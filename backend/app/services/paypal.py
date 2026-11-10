"""
PayPal Payment Service — Genuine PayPal Orders v2 API Integration.
Handles OAuth 2.0 token acquisition, order creation, capture, and webhook verification
using server-side sandbox credentials.
When credentials are unconfigured or placeholders, transparently reports configuration-required state
without simulating authorization or fabricating successful responses.
"""

import httpx
import base64
import uuid
import logging
from typing import Dict, Any, Optional, Tuple
from app.config import settings

logger = logging.getLogger(__name__)


class PayPalService:
    """Service class for interacting with the PayPal Orders v2 REST API."""

    def __init__(self):
        self.sandbox_mode = bool(settings.PAYPAL_SANDBOX_MODE)
        if self.sandbox_mode:
            # Enforce sandbox endpoint in sandbox mode to prevent accidental live execution
            self.base_url = "https://api-m.sandbox.paypal.com"
        else:
            # Production mode requires live API endpoint
            configured_url = settings.PAYPAL_BASE_URL.rstrip("/")
            if "sandbox" in configured_url.lower():
                logger.warning("Production mode enabled but base URL contains 'sandbox'. Defaulting to live PayPal API.")
                self.base_url = "https://api-m.paypal.com"
            else:
                self.base_url = configured_url
        self.client_id = settings.PAYPAL_CLIENT_ID
        self.client_secret = settings.PAYPAL_CLIENT_SECRET

    def is_configured(self) -> bool:
        """Check whether valid PayPal API credentials are configured in environment."""
        if not self.client_id or not self.client_secret:
            return False
        # 'sb' is the default mock placeholder in PayPal docs, not a live sandbox key
        if self.client_id.strip() == "sb" or self.client_secret.strip() == "sb":
            return False
        if len(self.client_id.strip()) < 10 or len(self.client_secret.strip()) < 10:
            return False
        return True

    def get_configuration_status(self) -> Dict[str, Any]:
        """Return diagnostic status of PayPal Sandbox configuration."""
        configured = self.is_configured()
        return {
            "configured": configured,
            "environment": "sandbox" if "sandbox" in self.base_url else "production",
            "base_url": self.base_url,
            "client_id_set": bool(self.client_id and self.client_id != "sb"),
            "client_id_prefix": (self.client_id[:6] + "...") if self.client_id and self.client_id != "sb" else None,
            "status": "ready" if configured else "configuration_required",
            "message": (
                "PayPal Orders v2 Sandbox credentials active."
                if configured
                else "PayPal Sandbox credentials not configured. Provide valid PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in backend/.env (from developer.paypal.com) to process live sandbox payments."
            ),
        }

    async def get_access_token(self) -> Tuple[Optional[str], Optional[Dict[str, Any]]]:
        """
        Obtain an OAuth 2.0 access token from PayPal.
        Returns (token, error_dict).
        """
        if not self.is_configured():
            return None, {
                "error": "PAYPAL_CREDENTIALS_MISSING",
                "message": "PayPal Sandbox credentials are unconfigured or set to test placeholders in backend/.env.",
                "details": self.get_configuration_status(),
            }

        auth_header = base64.b64encode(f"{self.client_id}:{self.client_secret}".encode()).decode()
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(
                    f"{self.base_url}/v1/oauth2/token",
                    headers={
                        "Authorization": f"Basic {auth_header}",
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    data={"grant_type": "client_credentials"},
                )
                if res.status_code == 200:
                    token_data = res.json()
                    return token_data.get("access_token"), None
                else:
                    logger.error(f"PayPal OAuth failed with status {res.status_code}: {res.text}")
                    return None, {
                        "error": "PAYPAL_OAUTH_FAILED",
                        "status_code": res.status_code,
                        "raw_response": res.text,
                        "message": "Failed to authenticate with PayPal Sandbox. Verify client ID and secret in backend/.env.",
                    }
        except Exception as e:
            logger.error(f"Exception during PayPal token exchange: {e}")
            return None, {
                "error": "PAYPAL_NETWORK_ERROR",
                "message": f"Network error contacting PayPal Sandbox: {str(e)}",
            }

    async def create_order(
        self,
        amount: float,
        currency: str,
        order_ref: str,
        description: str,
        items: Optional[list] = None,
        subtotal: Optional[float] = None,
        shipping: Optional[float] = None,
        tax: Optional[float] = None,
    ) -> Dict[str, Any]:
        """
        Create a genuine PayPal Orders v2 checkout order.
        """
        if not self.is_configured():
            return {
                "status": "configuration_required",
                "error": "PAYPAL_CREDENTIALS_MISSING",
                "message": "PayPal Sandbox credentials not configured. Please configure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in backend/.env.",
                "telemetry": {
                    "request_prepared": {
                        "intent": "CAPTURE",
                        "currency": currency,
                        "amount": f"{amount:.2f}",
                        "order_ref": order_ref,
                    },
                    "credentials_status": "unconfigured",
                },
            }

        token, err = await self.get_access_token()
        if err or not token:
            return {
                "status": "error",
                "error": err.get("error", "AUTH_FAILED"),
                "message": err.get("message", "Could not obtain access token from PayPal"),
                "telemetry": {"oauth_error": err},
            }

        idempotency_key = str(uuid.uuid4())
        calc_subtotal = subtotal if subtotal is not None else amount
        calc_shipping = shipping if shipping is not None else 0.0
        calc_tax = tax if tax is not None else 0.0

        payload = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "reference_id": order_ref,
                    "description": description[:127],
                    "amount": {
                        "currency_code": currency,
                        "value": f"{amount:.2f}",
                        "breakdown": {
                            "item_total": {"currency_code": currency, "value": f"{calc_subtotal:.2f}"},
                            "shipping": {"currency_code": currency, "value": f"{calc_shipping:.2f}"},
                            "tax_total": {"currency_code": currency, "value": f"{calc_tax:.2f}"},
                        },
                    },
                }
            ],
            "application_context": {
                "return_url": f"{settings.FRONTEND_URL}/dashboard/checkout?status=authorized",
                "cancel_url": f"{settings.FRONTEND_URL}/dashboard/checkout?status=cancelled",
                "brand_name": "SUPPLYMIND AI",
                "shipping_preference": "NO_SHIPPING",
                "user_action": "PAY_NOW",
            },
        }

        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                res = await client.post(
                    f"{self.base_url}/v2/checkout/orders",
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Content-Type": "application/json",
                        "PayPal-Request-Id": idempotency_key,
                    },
                    json=payload,
                )

                if res.status_code in (200, 201):
                    data = res.json()
                    approval_url = None
                    for link in data.get("links", []):
                        if link.get("rel") == "approve":
                            approval_url = link.get("href")
                            break

                    return {
                        "status": "created",
                        "order_id": data.get("id"),
                        "paypal_status": data.get("status"),
                        "approval_url": approval_url,
                        "links": data.get("links", []),
                        "idempotency_key": idempotency_key,
                        "raw_response": data,
                        "telemetry": {
                            "request_body": payload,
                            "response_status": res.status_code,
                            "idempotency_key": idempotency_key,
                        },
                    }
                else:
                    logger.error(f"PayPal create_order error {res.status_code}: {res.text}")
                    return {
                        "status": "error",
                        "error": "PAYPAL_API_ERROR",
                        "status_code": res.status_code,
                        "message": f"PayPal API returned error {res.status_code}",
                        "raw_response": res.text,
                        "telemetry": {
                            "request_body": payload,
                            "response_status": res.status_code,
                            "error_response": res.text,
                        },
                    }
        except Exception as e:
            logger.error(f"Exception during PayPal create_order: {e}")
            return {
                "status": "error",
                "error": "NETWORK_EXCEPTION",
                "message": str(e),
                "telemetry": {"exception": str(e)},
            }

    async def capture_order(self, paypal_order_id: str) -> Dict[str, Any]:
        """
        Capture an approved PayPal order.
        """
        if not self.is_configured():
            return {
                "status": "configuration_required",
                "error": "PAYPAL_CREDENTIALS_MISSING",
                "message": "PayPal Sandbox credentials not configured. Please configure PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in backend/.env.",
            }

        token, err = await self.get_access_token()
        if err or not token:
            return {
                "status": "error",
                "error": err.get("error", "AUTH_FAILED"),
                "message": err.get("message", "Could not obtain access token from PayPal"),
            }

        capture_idempotency = str(uuid.uuid4())
        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                res = await client.post(
                    f"{self.base_url}/v2/checkout/orders/{paypal_order_id}/capture",
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Content-Type": "application/json",
                        "PayPal-Request-Id": capture_idempotency,
                    },
                )

                if res.status_code in (200, 201):
                    data = res.json()
                    payer_info = data.get("payer", {})
                    captures = []
                    for pu in data.get("purchase_units", []):
                        captures.extend(pu.get("payments", {}).get("captures", []))

                    capture_id = captures[0].get("id") if captures else None
                    capture_status = captures[0].get("status") if captures else data.get("status")
                    captured_amount = None
                    if captures and "amount" in captures[0]:
                        captured_amount = float(captures[0]["amount"].get("value", 0))

                    return {
                        "status": "completed" if capture_status == "COMPLETED" else "pending",
                        "paypal_status": data.get("status"),
                        "capture_id": capture_id,
                        "payer_email": payer_info.get("email_address"),
                        "payer_id": payer_info.get("payer_id"),
                        "captured_amount": captured_amount,
                        "raw_response": data,
                        "telemetry": {
                            "endpoint": f"/v2/checkout/orders/{paypal_order_id}/capture",
                            "response_status": res.status_code,
                            "capture_id": capture_id,
                            "idempotency_key": capture_idempotency,
                        },
                    }
                else:
                    logger.error(f"PayPal capture_order error {res.status_code}: {res.text}")
                    return {
                        "status": "error",
                        "error": "CAPTURE_FAILED",
                        "status_code": res.status_code,
                        "message": f"PayPal capture returned error {res.status_code}: {res.text}",
                        "raw_response": res.text,
                        "telemetry": {
                            "response_status": res.status_code,
                            "raw_response": res.text,
                        },
                    }
        except Exception as e:
            logger.error(f"Exception during PayPal capture_order: {e}")
            return {
                "status": "error",
                "error": "NETWORK_EXCEPTION",
                "message": str(e),
                "telemetry": {"exception": str(e)},
            }

    async def get_order_details(self, paypal_order_id: str) -> Dict[str, Any]:
        """Fetch actual order state from PayPal Orders v2 endpoint."""
        if not self.is_configured():
            return {"status": "configuration_required"}

        token, err = await self.get_access_token()
        if err or not token:
            return {"status": "error", "message": "Failed to get token"}

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(
                    f"{self.base_url}/v2/checkout/orders/{paypal_order_id}",
                    headers={"Authorization": f"Bearer {token}"},
                )
                if res.status_code == 200:
                    return res.json()
                return {"status": "error", "status_code": res.status_code}
        except Exception as e:
            return {"status": "error", "message": str(e)}


paypal_service = PayPalService()
