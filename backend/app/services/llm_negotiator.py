"""
Autonomous Multi-Agent Negotiation Service.
Supports live generative LLM calls (Google Gemini & OpenAI) with separate Buyer Agent
and Supplier Agent roles, bounded by deterministic backend constraints.
When no API key is present or LLM call fails, transparently reports unavailable status
and utilizes deterministic simulation guardrails without pretending live LLM generation occurred.
"""

import os
import re
import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional, Tuple, List
import httpx

logger = logging.getLogger(__name__)


def get_llm_status() -> Dict[str, Any]:
    """Check availability of generative LLM providers."""
    gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    if gemini_key:
        return {
            "available": True,
            "provider": "gemini",
            "model": "gemini-1.5-flash",
            "message": "Live Google Gemini multi-agent negotiation active",
        }
    elif openai_key:
        return {
            "available": True,
            "provider": "openai",
            "model": "gpt-4o-mini",
            "message": "Live OpenAI multi-agent negotiation active",
        }
    else:
        return {
            "available": False,
            "provider": "none",
            "model": "deterministic_fallback",
            "message": (
                "External LLM API key not configured. Set GEMINI_API_KEY or OPENAI_API_KEY "
                "in backend/.env to enable live generative LLM dialogues. Operating in deterministic sandbox mode."
            ),
        }


def extract_price_from_text(text: str, default_price: float, floor: float, ceil: float) -> float:
    """Safely parse a dollar figure from LLM text and clamp it to deterministic bounds."""
    matches = re.findall(r"\$(\d+(?:\.\d{1,2})?)", text)
    if matches:
        try:
            val = float(matches[-1])
            return round(max(floor, min(ceil, val)), 2)
        except ValueError:
            pass
    return round(max(floor, min(ceil, default_price)), 2)


async def call_gemini(api_key: str, system_prompt: str, user_prompt: str) -> Optional[str]:
    """Call Google Gemini API via REST."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": f"System Directive: {system_prompt}\n\nTask: {user_prompt}"}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.4,
            "maxOutputTokens": 300,
        }
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.post(url, json=payload)
        if res.status_code == 200:
            data = res.json()
            candidates = data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "").strip()
        else:
            logger.warning(f"Gemini API returned status {res.status_code}: {res.text}")
            return None


async def call_openai(api_key: str, system_prompt: str, user_prompt: str) -> Optional[str]:
    """Call OpenAI Chat Completions API."""
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": 0.4,
        "max_tokens": 300,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        res = await client.post(url, headers=headers, json=payload)
        if res.status_code == 200:
            data = res.json()
            choices = data.get("choices", [])
            if choices:
                return choices[0].get("message", {}).get("content", "").strip()
        else:
            logger.warning(f"OpenAI API returned status {res.status_code}: {res.text}")
            return None


async def generate_buyer_agent_message(
    item_sku: str,
    item_name: str,
    quantity: int,
    original_price: float,
    target_price: float,
    supplier_name: str,
    lead_time_days: int,
) -> Dict[str, Any]:
    """
    Generate Buyer Agent offer and reasoning.
    Tries live LLM if key is present; returns deterministic if unavailable or fails.
    """
    llm_info = get_llm_status()
    floor_price = round(original_price * 0.70, 2)
    bounded_target = round(max(floor_price, min(original_price * 0.98, target_price)), 2)

    system_prompt = (
        "You are the autonomous SUPPLYMIND AI Buyer Agent representing merchant Alex Chen (TechFlow Electronics Ltd). "
        "Your objective is to secure the most favorable wholesale unit price and expedite delivery for high-demand items. "
        "Maintain a professional, quantitative enterprise tone. Keep your proposal concise (2 sentences). "
        "Always explicitly state your proposed unit price formatted as $XX.XX/unit."
    )

    user_prompt = (
        f"Negotiate for {quantity} units of {item_name} (SKU: {item_sku}) with {supplier_name}. "
        f"Initial supplier quote: ${original_price:.2f}/unit with {lead_time_days} days delivery. "
        f"Merchant target price: ${bounded_target:.2f}/unit. "
        f"Formulate our opening counteroffer emphasizing volume and rapid merchant settlement."
    )

    buyer_text = None
    if llm_info["available"]:
        try:
            gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
            openai_key = os.getenv("OPENAI_API_KEY")
            if gemini_key:
                buyer_text = await call_gemini(gemini_key, system_prompt, user_prompt)
            elif openai_key:
                buyer_text = await call_openai(openai_key, system_prompt, user_prompt)
        except Exception as e:
            logger.error(f"Error calling LLM for buyer agent: {e}")
            buyer_text = None

    if buyer_text:
        parsed_price = extract_price_from_text(buyer_text, bounded_target, floor_price, original_price)
        return {
            "llm_active": True,
            "provider": llm_info["provider"],
            "model": llm_info["model"],
            "price": parsed_price,
            "content": buyer_text,
        }
    else:
        # Transparent deterministic fallback
        return {
            "llm_active": False,
            "provider": "none",
            "model": "deterministic_rules",
            "price": bounded_target,
            "content": (
                f"SUPPLYMIND AI counteroffer: Based on order volume of {quantity} units and verified settlement "
                f"history, we propose ${bounded_target:.2f}/unit with guaranteed {lead_time_days}-day priority dispatch."
            ),
        }


async def generate_supplier_agent_response(
    item_sku: str,
    item_name: str,
    quantity: int,
    original_price: float,
    offered_price: float,
    round_number: int,
    supplier_name: str,
    supplier_country: str,
    lead_time_days: int,
    bulk_threshold: int,
    bulk_discount_pct: float,
) -> Dict[str, Any]:
    """
    Generate Supplier Agent response to a buyer counteroffer.
    Simulates vendor commercial parameters and margin floor.
    """
    llm_info = get_llm_status()
    floor_margin = round(original_price * 0.85, 2)
    discount_pct = ((original_price - offered_price) / original_price) * 100

    # Deterministic logic rules for outcome
    if round_number >= 3:
        final_price = round(original_price * 0.92, 2)
        accepted = False
        final_offer = True
        sim_price = final_price
    elif discount_pct <= 5.0:
        accepted = True
        final_offer = False
        sim_price = offered_price
    elif discount_pct <= 14.0:
        accepted = False
        final_offer = False
        sim_price = round((offered_price + original_price) / 2, 2)
    else:
        accepted = False
        final_offer = False
        sim_price = round(original_price * 0.90, 2)

    system_prompt = (
        f"You are the enterprise sales director representing {supplier_name} ({supplier_country}). "
        f"You are negotiating with an AI procurement agent for {quantity} units of {item_name} (SKU: {item_sku}). "
        f"Your original quote was ${original_price:.2f}/unit. "
        f"Your firm floor price is ${sim_price:.2f}/unit. "
        f"{'You accept the buyer offer.' if accepted else 'You cannot accept the buyer offer but can propose a counter.' if not final_offer else 'This is your final non-negotiable concession.'} "
        f"State your position in 2 concise professional sentences, clearly stating your price of ${sim_price:.2f}/unit."
    )

    user_prompt = (
        f"Buyer offered ${offered_price:.2f}/unit for {quantity} units (Round {round_number}). "
        f"Standard lead time is {lead_time_days} days. Formulate our vendor response with target price ${sim_price:.2f}/unit."
    )

    supplier_text = None
    if llm_info["available"]:
        try:
            gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
            openai_key = os.getenv("OPENAI_API_KEY")
            if gemini_key:
                supplier_text = await call_gemini(gemini_key, system_prompt, user_prompt)
            elif openai_key:
                supplier_text = await call_openai(openai_key, system_prompt, user_prompt)
        except Exception as e:
            logger.error(f"Error calling LLM for supplier agent: {e}")
            supplier_text = None

    if supplier_text:
        return {
            "llm_active": True,
            "provider": llm_info["provider"],
            "model": llm_info["model"],
            "accepted": accepted,
            "final_offer": final_offer,
            "supplier_price": sim_price,
            "content": supplier_text,
        }
    else:
        # Deterministic simulation messages
        if accepted:
            content = (
                f"We accept your counteroffer of ${sim_price:.2f}/unit for {quantity} units. "
                f"Production allocation is confirmed with guaranteed {lead_time_days}-day dispatch."
            )
        elif final_offer:
            content = (
                f"After executive review, our final concession is ${sim_price:.2f}/unit. "
                f"This reflects our lowest commercial margin for {quantity} units and remains locked for 48 hours."
            )
        elif discount_pct <= 14.0:
            content = (
                f"We value our relationship with TechFlow Electronics. While ${offered_price:.2f} is below our cost tier, "
                f"we can compromise at ${sim_price:.2f}/unit for immediate batch reservation."
            )
        else:
            content = (
                f"Your proposed rate of ${offered_price:.2f} breaches our bill-of-materials threshold. "
                f"The best volume rate we can extend is ${sim_price:.2f}/unit with standard SLA."
            )

        return {
            "llm_active": False,
            "provider": "none",
            "model": "deterministic_simulation",
            "accepted": accepted,
            "final_offer": final_offer,
            "supplier_price": sim_price,
            "content": content,
        }

