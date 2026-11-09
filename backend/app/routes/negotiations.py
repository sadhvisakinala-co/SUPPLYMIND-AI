"""
Negotiation Routes — Multi-agent AI supplier price negotiation with live LLM integration
and deterministic guardrails.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime, timedelta
from decimal import Decimal, ROUND_HALF_UP

from app.database import get_db
from app.models.models import (
    User, Supplier, SupplierQuotation, Negotiation,
    NegotiationStatus, ProcurementOrder, OrderStatus, InventoryItem,
)
from app.middleware.auth import get_current_user
from app.routes.audit import create_audit_log
from app.services.llm_negotiator import (
    get_llm_status,
    generate_buyer_agent_message,
    generate_supplier_agent_response,
)

router = APIRouter(prefix="/api/negotiations", tags=["Negotiations"])


# ─── Decimal-safe Financial Helpers ──────────────────────────────────────────


def to_dec(val: Any) -> Decimal:
    """Convert float, int, str to Decimal safely."""
    if val is None:
        return Decimal("0.00")
    return Decimal(str(val))


def quantize_dec(val: Decimal) -> Decimal:
    """Quantize to 2 decimal places with standard ROUND_HALF_UP."""
    return val.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def dec_to_float(val: Decimal) -> float:
    """Convert Decimal back to float for JSON serialization."""
    return float(quantize_dec(val))


# ─── Pydantic Schemas ────────────────────────────────────────────────────────


class StartNegotiationRequest(BaseModel):
    quotation_id: int
    quantity: int = Field(..., gt=0)
    target_price: Optional[float] = None


class CounterOfferRequest(BaseModel):
    counter_price: float = Field(..., gt=0)


class NegotiationSupplierInfo(BaseModel):
    id: int
    name: str
    code: str
    country: Optional[str] = None
    rating: float
    reliability_score: float
    lead_time_days: int


class LinkedOrderSummary(BaseModel):
    id: int
    order_number: str
    status: str
    merchant_approved: bool
    approved_at: Optional[datetime] = None
    subtotal: float
    shipping: float
    tax: float
    total_amount: float
    currency: str = "USD"


class NegotiationFinancialSummary(BaseModel):
    approved_quantity: int
    initial_unit_price: float
    initial_merchandise_subtotal: float
    buyer_counteroffer_price: Optional[float] = None
    final_negotiated_unit_price: float
    negotiated_merchandise_subtotal: float
    merchandise_savings: float
    savings_percentage: float
    expedited_freight: float
    tax_amount: float
    total_approved_payment: float
    currency: str = "USD"


class NegotiationResponse(BaseModel):
    id: int
    merchant_id: int
    supplier_id: int
    quotation_id: int
    item_sku: str
    item_name: Optional[str] = None
    original_price: float
    counter_price: Optional[float] = None
    final_price: Optional[float] = None
    quantity: int
    ai_reasoning: Optional[str] = None
    ai_strategy: Optional[str] = None
    status: str
    rounds: int
    messages: Optional[List[Dict[str, Any]]] = []
    supplier: Optional[NegotiationSupplierInfo] = None
    llm_info: Optional[Dict[str, Any]] = None
    guardrails: Optional[Dict[str, Any]] = None
    financial_summary: Optional[NegotiationFinancialSummary] = None
    linked_order: Optional[LinkedOrderSummary] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NegotiationListItem(BaseModel):
    id: int
    item_sku: str
    item_name: Optional[str] = None
    supplier_id: int
    supplier_name: str
    supplier_country: Optional[str] = None
    original_price: float
    counter_price: Optional[float] = None
    final_price: Optional[float] = None
    quantity: int
    status: str
    rounds: int
    has_linked_order: bool = False
    order_number: Optional[str] = None
    order_id: Optional[int] = None
    created_at: datetime


class NegotiationStartResponse(BaseModel):
    negotiation: NegotiationResponse
    ai_analysis: dict


# ─── Helper Functions ────────────────────────────────────────────────────────


def generate_next_order_number(db: Session) -> str:
    """
    Generate a unique purchase order identifier using the creation year.
    Example format: PO-2026-00893.
    Preserves historical order IDs (such as PO-2024-00892) and guarantees uniqueness.
    """
    current_year = datetime.utcnow().year

    # Find highest existing sequence across all purchase orders to maintain sequential continuity
    highest_seq = 0
    all_orders = db.query(ProcurementOrder.order_number).all()
    for (ord_num,) in all_orders:
        if not ord_num:
            continue
        parts = ord_num.split("-")
        if len(parts) >= 3:
            try:
                val = int(parts[2])
                if val > highest_seq:
                    highest_seq = val
            except ValueError:
                pass
        elif len(parts) == 2:
            try:
                val = int(parts[1])
                if val > highest_seq:
                    highest_seq = val
            except ValueError:
                pass

    next_seq = (highest_seq + 1) if highest_seq > 0 else 893
    candidate = f"PO-{current_year}-{next_seq:05d}"

    # Guarantee uniqueness against database constraint
    while db.query(ProcurementOrder).filter(ProcurementOrder.order_number == candidate).first():
        next_seq += 1
        candidate = f"PO-{current_year}-{next_seq:05d}"

    return candidate


def normalize_message(
    msg: Any,
    fallback_time: Optional[str] = None,
    supplier_name: Optional[str] = None,
) -> Dict[str, Any]:
    """Normalize message dict so frontend can read role, sender, content, and message reliably."""
    sup_label = f"Supplier Agent ({supplier_name})" if supplier_name else "Supplier Agent (Simulated)"
    if not isinstance(msg, dict):
        return {
            "role": "buyer_agent",
            "sender": "buyer_agent",
            "sender_name": "Buyer Agent (SUPPLYMIND AI)",
            "content": str(msg),
            "message": str(msg),
            "price": None,
            "timestamp": fallback_time or datetime.utcnow().isoformat(),
        }

    raw_role = msg.get("role") or msg.get("sender") or "buyer_agent"
    raw_role_str = str(raw_role).lower()

    if raw_role_str in ("ai_agent", "ai_advisor", "buyer", "buyer_agent"):
        canonical_role = "buyer_agent"
        sender_name = "Buyer Agent (SUPPLYMIND AI)"
    elif raw_role_str in ("supplier", "supplier_agent", "vendor"):
        canonical_role = "supplier_agent"
        sender_name = msg.get("sender_name") or sup_label
    else:
        canonical_role = "merchant"
        sender_name = "Alex Chen (Merchant)"

    content = msg.get("content") or msg.get("message") or ""
    price = msg.get("price")
    timestamp = msg.get("timestamp") or fallback_time or datetime.utcnow().isoformat()

    return {
        "role": canonical_role,
        "sender": canonical_role,
        "sender_name": sender_name,
        "content": content,
        "message": content,
        "price": price,
        "timestamp": timestamp,
    }


def normalize_messages_list(
    messages: Optional[List[Any]],
    supplier_name: Optional[str] = None,
) -> List[Dict[str, Any]]:
    if not messages:
        return []
    now = datetime.utcnow().isoformat()
    return [normalize_message(m, now, supplier_name) for m in messages]


def get_negotiation_guardrails(
    n: Negotiation,
    supplier: Optional[Supplier] = None,
    quotation: Optional[SupplierQuotation] = None,
) -> Dict[str, Any]:
    """
    Generate the deterministic Active Negotiation Guardrails policy data.
    Enforces merchant spending limits, supplier commercial floors,
    transaction integrity gates, and negotiation round caps.
    """
    orig_price = float(n.original_price)
    floor_price = round(orig_price * 0.70, 2)
    max_unit_price = orig_price
    max_authorized_budget = 25000.00
    active_price = float(n.final_price or n.counter_price or n.original_price)
    total_proposed = round(active_price * n.quantity, 2)

    lead_days = quotation.delivery_days if quotation else (supplier.lead_time_days if supplier else 7)
    sup_name = supplier.name if supplier else f"Supplier #{n.supplier_id}"

    return {
        "merchant_spending_policy": {
            "max_authorized_budget": max_authorized_budget,
            "max_allowed_unit_price": max_unit_price,
            "approved_order_quantity": n.quantity,
            "approved_supplier_restrictions": [sup_name, "TechSource Global Ltd", "EuroTech Supply GmbH"],
            "current_commitment": total_proposed,
            "is_budget_compliant": total_proposed <= max_authorized_budget,
            "status": "COMPLIANT" if total_proposed <= max_authorized_budget else "BUDGET_EXCEEDED",
        },
        "supplier_commercial_limits": {
            "minimum_acceptable_supplier_price": floor_price,
            "list_price": orig_price,
            "max_permitted_discount_pct": 30.0,
            "available_quantity": 500,
            "minimum_delivery_days": lead_days,
            "supplier_margin_floor_policy": f"Commercial floor strictly locked at ${floor_price:.2f} (70% of ${orig_price:.2f}). Below-floor concessions are rejected server-side.",
            "status": "ENFORCED",
        },
        "transaction_controls": {
            "merchant_approval_required": True,
            "payment_method": "PayPal Sandbox Orders v2 (Escrow/Authorize-Capture)",
            "no_unauthorized_payment_capture": True,
            "approved_po_integrity_verification": "Canonical SHA-256 state hashing required",
            "status": "SECURED",
        },
        "negotiation_controls": {
            "max_negotiation_rounds": 5,
            "current_round": n.rounds,
            "permitted_discount_range": f"$0.00 to ${(orig_price - floor_price):.2f} (${floor_price:.2f} – ${max_unit_price:.2f}/unit)",
            "counteroffer_validation": "Deterministic floor, ceiling & round limit validation",
            "auto_rejection_policy": "Proposals violating spend cap, price floor, or max rounds immediately rejected server-side",
            "status": "ACTIVE" if n.rounds < 5 else "ROUND_LIMIT_REACHED",
        },
        "deterministic_guardrails_active": True,
        "llm_engine_status": get_llm_status(),
    }


def _build_full_negotiation_response(n: Negotiation, db: Session) -> NegotiationResponse:
    supplier = db.query(Supplier).filter(Supplier.id == n.supplier_id).first()
    quotation = db.query(SupplierQuotation).filter(SupplierQuotation.id == n.quotation_id).first()
    item = db.query(InventoryItem).filter(InventoryItem.sku == n.item_sku).first()
    order = db.query(ProcurementOrder).filter(ProcurementOrder.negotiation_id == n.id).first()

    sup_info = None
    if supplier:
        sup_info = NegotiationSupplierInfo(
            id=supplier.id,
            name=supplier.name,
            code=supplier.code,
            country=supplier.country,
            rating=supplier.rating,
            reliability_score=supplier.reliability_score,
            lead_time_days=supplier.lead_time_days,
        )

    supplier_name = supplier.name if supplier else None
    norm_msgs = normalize_messages_list(n.messages, supplier_name=supplier_name)
    item_name = quotation.item_name if quotation else (item.name if item else n.item_sku)
    guardrails = get_negotiation_guardrails(n, supplier, quotation)

    # Decimal-safe calculation of negotiation economics
    qty_dec = to_dec(n.quantity)
    orig_p_dec = to_dec(n.original_price)
    counter_p_dec = to_dec(n.counter_price) if n.counter_price is not None else None
    final_p_dec = to_dec(n.final_price) if n.final_price is not None else (counter_p_dec or orig_p_dec)

    init_subtotal_dec = quantize_dec(qty_dec * orig_p_dec)
    neg_subtotal_dec = quantize_dec(qty_dec * final_p_dec)
    savings_dec = quantize_dec(init_subtotal_dec - neg_subtotal_dec)
    savings_pct = (
        round(float((savings_dec / init_subtotal_dec) * 100), 2)
        if init_subtotal_dec > 0
        else 0.0
    )

    if order:
        freight_dec = quantize_dec(to_dec(order.shipping))
        tax_dec = quantize_dec(to_dec(order.tax))
        total_dec = quantize_dec(to_dec(order.total_amount))
        linked_order_summary = LinkedOrderSummary(
            id=order.id,
            order_number=order.order_number,
            status=order.status,
            merchant_approved=bool(order.merchant_approved),
            approved_at=order.approved_at,
            subtotal=float(order.subtotal),
            shipping=float(order.shipping),
            tax=float(order.tax),
            total_amount=float(order.total_amount),
            currency=order.currency or "USD",
        )
    else:
        freight_dec = (
            Decimal("350.00")
            if n.item_sku == "ELEC-005"
            else quantize_dec(min(neg_subtotal_dec * Decimal("0.02"), Decimal("200.00")))
        )
        tax_dec = quantize_dec(neg_subtotal_dec * Decimal("0.05"))
        total_dec = quantize_dec(neg_subtotal_dec + freight_dec + tax_dec)
        linked_order_summary = None

    fin_summary = NegotiationFinancialSummary(
        approved_quantity=n.quantity,
        initial_unit_price=dec_to_float(orig_p_dec),
        initial_merchandise_subtotal=dec_to_float(init_subtotal_dec),
        buyer_counteroffer_price=dec_to_float(counter_p_dec) if counter_p_dec is not None else None,
        final_negotiated_unit_price=dec_to_float(final_p_dec),
        negotiated_merchandise_subtotal=dec_to_float(neg_subtotal_dec),
        merchandise_savings=dec_to_float(savings_dec),
        savings_percentage=savings_pct,
        expedited_freight=dec_to_float(freight_dec),
        tax_amount=dec_to_float(tax_dec),
        total_approved_payment=dec_to_float(total_dec),
        currency="USD",
    )

    return NegotiationResponse(
        id=n.id,
        merchant_id=n.merchant_id,
        supplier_id=n.supplier_id,
        quotation_id=n.quotation_id,
        item_sku=n.item_sku,
        item_name=item_name,
        original_price=n.original_price,
        counter_price=n.counter_price,
        final_price=n.final_price,
        quantity=n.quantity,
        ai_reasoning=n.ai_reasoning,
        ai_strategy=n.ai_strategy,
        status=n.status,
        rounds=n.rounds,
        messages=norm_msgs,
        supplier=sup_info,
        llm_info=get_llm_status(),
        guardrails=guardrails,
        financial_summary=fin_summary,
        linked_order=linked_order_summary,
        created_at=n.created_at,
        updated_at=n.updated_at,
    )


# ─── Routes ──────────────────────────────────────────────────────────────────


@router.get("/status/llm")
def get_llm_connection_status():
    """Return LLM status and active engine (generative vs deterministic simulation)."""
    return get_llm_status()


@router.get("", response_model=List[NegotiationListItem])
def list_negotiations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all negotiations for current merchant with linked order metadata."""
    negotiations = (
        db.query(Negotiation)
        .filter(Negotiation.merchant_id == current_user.id)
        .order_by(Negotiation.created_at.desc())
        .all()
    )

    result = []
    for n in negotiations:
        supplier = db.query(Supplier).filter(Supplier.id == n.supplier_id).first()
        quotation = db.query(SupplierQuotation).filter(SupplierQuotation.id == n.quotation_id).first()
        item_name = quotation.item_name if quotation else n.item_sku
        order = db.query(ProcurementOrder).filter(ProcurementOrder.negotiation_id == n.id).first()

        result.append(NegotiationListItem(
            id=n.id,
            item_sku=n.item_sku,
            item_name=item_name,
            supplier_id=n.supplier_id,
            supplier_name=supplier.name if supplier else f"Supplier #{n.supplier_id}",
            supplier_country=supplier.country if supplier else "International",
            original_price=n.original_price,
            counter_price=n.counter_price,
            final_price=n.final_price,
            quantity=n.quantity,
            status=n.status,
            rounds=n.rounds,
            has_linked_order=bool(order),
            order_number=order.order_number if order else None,
            order_id=order.id if order else None,
            created_at=n.created_at,
        ))
    return result


@router.get("/{negotiation_id}", response_model=NegotiationResponse)
def get_negotiation(
    negotiation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get negotiation detail with normalized message history and supplier information."""
    negotiation = db.query(Negotiation).filter(
        Negotiation.id == negotiation_id,
        Negotiation.merchant_id == current_user.id,
    ).first()
    if not negotiation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Negotiation not found",
        )

    return _build_full_negotiation_response(negotiation, db)


@router.get("/{negotiation_id}/guardrails")
def get_active_guardrails(
    negotiation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get active deterministic negotiation guardrails and commercial policies
    for the specified negotiation.
    """
    negotiation = db.query(Negotiation).filter(
        Negotiation.id == negotiation_id,
        Negotiation.merchant_id == current_user.id,
    ).first()
    if not negotiation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Negotiation not found",
        )

    supplier = db.query(Supplier).filter(Supplier.id == negotiation.supplier_id).first()
    quotation = db.query(SupplierQuotation).filter(SupplierQuotation.id == negotiation.quotation_id).first()
    return get_negotiation_guardrails(negotiation, supplier, quotation)



@router.post("/start", response_model=NegotiationStartResponse, status_code=status.HTTP_201_CREATED)
async def start_negotiation(
    payload: StartNegotiationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Start an AI-powered negotiation for a supplier quotation.
    Executes Buyer Agent counteroffer (generative LLM if key present, bounded deterministic otherwise).
    """
    quotation = db.query(SupplierQuotation).filter(
        SupplierQuotation.id == payload.quotation_id
    ).first()
    if not quotation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quotation not found",
        )

    supplier = db.query(Supplier).filter(Supplier.id == quotation.supplier_id).first()
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supplier not found",
        )

    if payload.quantity < quotation.min_order_quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Quantity must be at least {quotation.min_order_quantity} (minimum order quantity)",
        )

    original_price = quotation.unit_price
    floor_price = round(original_price * 0.70, 2)
    default_target = round(original_price * 0.90, 2)
    target_price = payload.target_price if payload.target_price is not None else default_target
    target_price = max(floor_price, min(original_price, target_price))

    # Generate opening counteroffer via Buyer Agent
    buyer_res = await generate_buyer_agent_message(
        item_sku=quotation.item_sku,
        item_name=quotation.item_name or quotation.item_sku,
        quantity=payload.quantity,
        original_price=original_price,
        target_price=target_price,
        supplier_name=supplier.name,
        lead_time_days=quotation.delivery_days,
    )

    suggested_counter = buyer_res["price"]
    now = datetime.utcnow().isoformat()

    # Initial conversation transcript: Supplier original quote followed by Buyer Agent counter
    messages = [
        {
            "role": "supplier_agent",
            "sender": "supplier_agent",
            "sender_name": f"Supplier Agent ({supplier.name} - Simulated)",
            "content": (
                f"Quotation for {payload.quantity}x {quotation.item_name or quotation.item_sku} "
                f"at ${original_price:.2f}/unit. Standard lead time: {quotation.delivery_days} days. "
                f"Bulk threshold: {quotation.bulk_threshold} units."
            ),
            "message": (
                f"Quotation for {payload.quantity}x {quotation.item_name or quotation.item_sku} "
                f"at ${original_price:.2f}/unit. Standard lead time: {quotation.delivery_days} days."
            ),
            "price": original_price,
            "timestamp": now,
        },
        {
            "role": "buyer_agent",
            "sender": "buyer_agent",
            "sender_name": "Buyer Agent (SUPPLYMIND AI)",
            "content": buyer_res["content"],
            "message": buyer_res["content"],
            "price": suggested_counter,
            "timestamp": now,
        },
    ]

    savings = round(original_price - suggested_counter, 2)
    savings_pct = round((savings / original_price) * 100, 1)

    ai_reasoning = (
        f"Volume analysis for {quotation.item_name} from {supplier.name}: "
        f"Initial quote ${original_price:.2f} countered at ${suggested_counter:.2f} ({savings_pct}% discount). "
        f"Estimated batch savings: ${savings * payload.quantity:.2f} across {payload.quantity} units. "
        f"Lead time target: {quotation.delivery_days} days."
    )

    negotiation = Negotiation(
        merchant_id=current_user.id,
        supplier_id=supplier.id,
        quotation_id=quotation.id,
        item_sku=quotation.item_sku,
        original_price=original_price,
        counter_price=suggested_counter,
        quantity=payload.quantity,
        ai_reasoning=ai_reasoning,
        ai_strategy="Algorithmic volume leverage with bounded concession margins",
        status=NegotiationStatus.COUNTER_OFFERED,
        rounds=1,
        messages=messages,
    )
    db.add(negotiation)
    db.commit()
    db.refresh(negotiation)

    analysis = {
        "suggested_counter_price": suggested_counter,
        "original_price": original_price,
        "discount_percentage": savings_pct,
        "total_savings": round(savings * payload.quantity, 2),
        "floor_price": floor_price,
        "reasoning": ai_reasoning,
        "llm_info": get_llm_status(),
    }

    return NegotiationStartResponse(
        negotiation=_build_full_negotiation_response(negotiation, db),
        ai_analysis=analysis,
    )


@router.post("/{negotiation_id}/counter")
async def submit_counteroffer(
    negotiation_id: int,
    payload: CounterOfferRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Submit a counteroffer.
    Supplier Agent evaluates within commercial constraints (generative LLM if key present, deterministic otherwise).
    """
    negotiation = db.query(Negotiation).filter(
        Negotiation.id == negotiation_id,
        Negotiation.merchant_id == current_user.id,
    ).first()
    if not negotiation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Negotiation not found",
        )

    if negotiation.status in (NegotiationStatus.ACCEPTED, NegotiationStatus.REJECTED):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Negotiation is already {negotiation.status}",
        )

    # ─── PROTECT PAYMENT WORKFLOW ─────────────────────────────────────────────
    # If this negotiation is linked to an order, verify payment state
    linked_order = db.query(ProcurementOrder).filter(ProcurementOrder.negotiation_id == negotiation.id).first()
    if linked_order:
        if linked_order.status in (OrderStatus.PAYMENT_COMPLETED, OrderStatus.SHIPPED, OrderStatus.DELIVERED):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot alter terms of an already settled and paid transaction.",
            )
        # If order was previously approved, invalidate approval upon new counteroffer
        if linked_order.merchant_approved or linked_order.status == OrderStatus.APPROVED:
            linked_order.merchant_approved = False
            linked_order.status = OrderStatus.PENDING_APPROVAL
            linked_order.approved_at = None
            linked_order.notes = "APPROVAL_INVALIDATED: Counteroffer submitted after approval. Merchant re-approval required."
            linked_order.updated_at = datetime.utcnow()
            create_audit_log(
                db=db,
                user_id=current_user.id,
                order_id=linked_order.id,
                action="order_approval_invalidated_by_counteroffer",
                entity_type="procurement_order",
                entity_id=linked_order.id,
                details={
                    "order_number": linked_order.order_number,
                    "reason": "Counteroffer proposed after merchant approval. Revoked approval state.",
                },
            )

    floor = round(negotiation.original_price * 0.70, 2)
    max_price = round(negotiation.original_price, 2)
    max_budget = 25000.00
    proposed_total = round(payload.counter_price * negotiation.quantity, 2)

    # ─── ACTIVE DETERMINISTIC GUARDRAILS ENFORCEMENT ──────────────────────────
    # Guardrail 1: Max rounds limit
    if negotiation.rounds >= 5:
        create_audit_log(
            db=db,
            user_id=current_user.id,
            order_id=None,
            action="negotiation_guardrail_rejected",
            entity_type="negotiation",
            entity_id=negotiation.id,
            details={
                "violation_type": "MAX_ROUNDS_EXCEEDED",
                "current_rounds": negotiation.rounds,
                "max_rounds": 5,
                "proposed_price": payload.counter_price,
            },
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GUARDRAIL_VIOLATION: Maximum permitted negotiation rounds (5) exceeded. Proposal rejected.",
        )

    # Guardrail 2: Merchant spending policy budget cap
    if proposed_total > max_budget:
        create_audit_log(
            db=db,
            user_id=current_user.id,
            order_id=None,
            action="negotiation_guardrail_rejected",
            entity_type="negotiation",
            entity_id=negotiation.id,
            details={
                "violation_type": "MERCHANT_BUDGET_EXCEEDED",
                "proposed_total": proposed_total,
                "max_budget": max_budget,
                "proposed_price": payload.counter_price,
            },
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"GUARDRAIL_VIOLATION: Proposed commitment (${proposed_total:.2f}) violates Merchant Spending Policy ($25,000.00 budget cap). Proposal rejected.",
        )

    # Guardrail 3: Supplier commercial margin floor
    if payload.counter_price < floor:
        create_audit_log(
            db=db,
            user_id=current_user.id,
            order_id=None,
            action="negotiation_guardrail_rejected",
            entity_type="negotiation",
            entity_id=negotiation.id,
            details={
                "violation_type": "SUPPLIER_MARGIN_FLOOR_VIOLATION",
                "proposed_price": payload.counter_price,
                "floor_price": floor,
                "max_concession_pct": 30.0,
            },
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"GUARDRAIL_VIOLATION: Proposed price ${payload.counter_price:.2f} violates Supplier Commercial Margin Floor (${floor:.2f} / 30% max concession). Proposal rejected.",
        )

    # Guardrail 4: Maximum allowed unit price
    if payload.counter_price > max_price:
        create_audit_log(
            db=db,
            user_id=current_user.id,
            order_id=None,
            action="negotiation_guardrail_rejected",
            entity_type="negotiation",
            entity_id=negotiation.id,
            details={
                "violation_type": "PRICE_CEILING_EXCEEDED",
                "proposed_price": payload.counter_price,
                "max_price": max_price,
            },
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"GUARDRAIL_VIOLATION: Counter price ${payload.counter_price:.2f} exceeds Maximum Allowed Unit Price (${max_price:.2f}). Proposal rejected.",
        )

    supplier = db.query(Supplier).filter(Supplier.id == negotiation.supplier_id).first()
    quotation = db.query(SupplierQuotation).filter(SupplierQuotation.id == negotiation.quotation_id).first()
    supplier_name = supplier.name if supplier else "Supplier"
    supplier_country = supplier.country if supplier else "International"
    lead_time = quotation.delivery_days if quotation else (supplier.lead_time_days if supplier else 14)
    bulk_threshold = quotation.bulk_threshold if quotation else 100
    bulk_discount_pct = quotation.bulk_discount_pct if quotation else 5.0
    item_name = quotation.item_name if quotation else negotiation.item_sku

    now = datetime.utcnow().isoformat()
    messages = list(negotiation.messages or [])

    # Add merchant's / buyer's proposed offer
    messages.append({
        "role": "merchant",
        "sender": "merchant",
        "sender_name": "Merchant (Alex Chen)",
        "content": f"Counteroffer proposed: ${payload.counter_price:.2f}/unit for {negotiation.quantity} units.",
        "message": f"Counteroffer proposed: ${payload.counter_price:.2f}/unit for {negotiation.quantity} units.",
        "price": payload.counter_price,
        "timestamp": now,
    })

    # Call Supplier Agent response generator
    sup_response = await generate_supplier_agent_response(
        item_sku=negotiation.item_sku,
        item_name=item_name,
        quantity=negotiation.quantity,
        original_price=negotiation.original_price,
        offered_price=payload.counter_price,
        round_number=negotiation.rounds + 1,
        supplier_name=supplier_name,
        supplier_country=supplier_country,
        lead_time_days=lead_time,
        bulk_threshold=bulk_threshold,
        bulk_discount_pct=bulk_discount_pct,
    )

    # Append Supplier Agent reply
    messages.append({
        "role": "supplier_agent",
        "sender": "supplier_agent",
        "sender_name": f"Supplier Agent ({supplier_name} - Simulated)",
        "content": sup_response["content"],
        "message": sup_response["content"],
        "price": sup_response["supplier_price"],
        "timestamp": now,
    })

    # Update negotiation state
    negotiation.counter_price = sup_response["supplier_price"]
    negotiation.rounds = negotiation.rounds + 1
    negotiation.updated_at = datetime.utcnow()

    if sup_response["accepted"]:
        negotiation.status = NegotiationStatus.ACCEPTED
        negotiation.final_price = sup_response["supplier_price"]
        messages.append({
            "role": "buyer_agent",
            "sender": "buyer_agent",
            "sender_name": "Buyer Agent (SUPPLYMIND AI)",
            "content": (
                f"Terms agreed at ${sup_response['supplier_price']:.2f}/unit. "
                f"Net savings: ${(negotiation.original_price - sup_response['supplier_price']) * negotiation.quantity:.2f} "
                f"across {negotiation.quantity} units. Ready for merchant purchase order sign-off."
            ),
            "message": (
                f"Terms agreed at ${sup_response['supplier_price']:.2f}/unit. "
                f"Net savings: ${(negotiation.original_price - sup_response['supplier_price']) * negotiation.quantity:.2f}."
            ),
            "price": None,
            "timestamp": now,
        })
    elif sup_response["final_offer"]:
        negotiation.status = NegotiationStatus.COUNTER_OFFERED
        messages.append({
            "role": "buyer_agent",
            "sender": "buyer_agent",
            "sender_name": "Buyer Agent (SUPPLYMIND AI)",
            "content": (
                f"Supplier submitted final concession at ${sup_response['supplier_price']:.2f}/unit "
                f"({((negotiation.original_price - sup_response['supplier_price']) / negotiation.original_price * 100):.1f}% below quote). "
                f"Recommend immediate acceptance to reserve production capacity."
            ),
            "message": f"Supplier final offer at ${sup_response['supplier_price']:.2f}/unit.",
            "price": None,
            "timestamp": now,
        })
    else:
        negotiation.status = NegotiationStatus.COUNTER_OFFERED

    negotiation.messages = messages
    db.commit()
    db.refresh(negotiation)

    return {
        "negotiation": _build_full_negotiation_response(negotiation, db),
        "supplier_response": sup_response,
    }


@router.post("/{negotiation_id}/accept")
def accept_negotiation(
    negotiation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Accept the negotiated terms and create or update the pending procurement order."""
    negotiation = db.query(Negotiation).filter(
        Negotiation.id == negotiation_id,
        Negotiation.merchant_id == current_user.id,
    ).first()
    if not negotiation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Negotiation not found",
        )

    final_price = negotiation.counter_price or negotiation.original_price
    negotiation.final_price = final_price
    negotiation.status = NegotiationStatus.ACCEPTED
    negotiation.updated_at = datetime.utcnow()

    now = datetime.utcnow().isoformat()
    messages = list(negotiation.messages or [])
    messages.append({
        "role": "merchant",
        "sender": "merchant",
        "sender_name": "Merchant (Alex Chen)",
        "content": f"Merchant accepted negotiated rate of ${final_price:.2f}/unit for {negotiation.quantity} units.",
        "message": f"Merchant accepted rate of ${final_price:.2f}/unit.",
        "price": final_price,
        "timestamp": now,
    })
    messages.append({
        "role": "buyer_agent",
        "sender": "buyer_agent",
        "sender_name": "Buyer Agent (SUPPLYMIND AI)",
        "content": (
            f"Procurement lock confirmed at ${final_price:.2f}/unit. "
            f"Drafting purchase order for {negotiation.quantity} units (Subtotal: ${final_price * negotiation.quantity:.2f})."
        ),
        "message": f"Drafting purchase order for {negotiation.quantity} units.",
        "price": None,
        "timestamp": now,
    })
    negotiation.messages = messages

    supplier = db.query(Supplier).filter(Supplier.id == negotiation.supplier_id).first()
    quotation = db.query(SupplierQuotation).filter(SupplierQuotation.id == negotiation.quotation_id).first()
    delivery_days = quotation.delivery_days if quotation else (supplier.lead_time_days if supplier else 14)
    item_name = quotation.item_name if quotation else negotiation.item_sku

    # Exact decimal-safe financial formula: subtotal = final_price * quantity
    qty_dec = to_dec(negotiation.quantity)
    final_p_dec = to_dec(final_price)
    subtotal_dec = quantize_dec(qty_dec * final_p_dec)
    tax_dec = quantize_dec(subtotal_dec * Decimal("0.05"))  # Standardized 5% tax
    shipping_dec = (
        Decimal("350.00")
        if negotiation.item_sku == "ELEC-005"
        else quantize_dec(min(subtotal_dec * Decimal("0.02"), Decimal("200.00")))
    )
    total_dec = quantize_dec(subtotal_dec + tax_dec + shipping_dec)

    subtotal = float(subtotal_dec)
    tax = float(tax_dec)
    shipping = float(shipping_dec)
    total = float(total_dec)

    # Check if a procurement order already exists for this negotiation
    existing_order = db.query(ProcurementOrder).filter(ProcurementOrder.negotiation_id == negotiation.id).first()
    if existing_order:
        existing_order.items = [{
            "sku": negotiation.item_sku,
            "name": item_name,
            "quantity": negotiation.quantity,
            "unit_price": final_price,
            "subtotal": subtotal,
            "discount_applied": (
                f"{((negotiation.original_price - final_price) / negotiation.original_price * 100):.1f}% "
                f"volume concession via AI negotiation"
            ),
        }]
        existing_order.subtotal = subtotal
        existing_order.shipping = shipping
        existing_order.tax = tax
        existing_order.total_amount = total
        existing_order.status = OrderStatus.PENDING_APPROVAL
        existing_order.merchant_approved = False
        existing_order.approved_at = None
        existing_order.notes = "TERMS_ACCEPTED: Awaiting merchant approval gate sign-off."
        existing_order.updated_at = datetime.utcnow()
        order = existing_order
        order_number = existing_order.order_number
    else:
        order_number = generate_next_order_number(db)
        order = ProcurementOrder(
            order_number=order_number,
            merchant_id=current_user.id,
            supplier_id=negotiation.supplier_id,
            negotiation_id=negotiation.id,
            items=[{
                "sku": negotiation.item_sku,
                "name": item_name,
                "quantity": negotiation.quantity,
                "unit_price": final_price,
                "subtotal": subtotal,
                "discount_applied": (
                    f"{((negotiation.original_price - final_price) / negotiation.original_price * 100):.1f}% "
                    f"volume concession via AI negotiation"
                ),
            }],
            subtotal=subtotal,
            tax=tax,
            shipping=shipping,
            total_amount=total,
            currency="USD",
            status=OrderStatus.PENDING_APPROVAL,
            merchant_approved=False,
            ai_recommendation=(
                f"Order generated from successful multi-agent negotiation. "
                f"Negotiated rate ${final_price:.2f}/unit vs original quote ${negotiation.original_price:.2f} "
                f"({((negotiation.original_price - final_price) / negotiation.original_price * 100):.1f}% savings). "
                f"Vendor: {supplier.name if supplier else 'Supplier'}. Guaranteed lead time: {delivery_days} days."
            ),
            ai_confidence_score=0.94,
            expected_delivery=datetime.utcnow() + timedelta(days=delivery_days),
        )
        db.add(order)
    db.commit()
    db.refresh(order)
    db.refresh(negotiation)

    create_audit_log(
        db=db,
        user_id=current_user.id,
        order_id=order.id,
        action="negotiation_accepted",
        entity_type="negotiation",
        entity_id=negotiation.id,
        details={
            "original_price": negotiation.original_price,
            "final_price": final_price,
            "quantity": negotiation.quantity,
            "order_number": order_number,
            "total_amount": total,
        },
    )

    return {
        "message": "Negotiation accepted. Procurement order generated for merchant review.",
        "negotiation": _build_full_negotiation_response(negotiation, db),
        "order": {
            "id": order.id,
            "order_number": order.order_number,
            "total_amount": order.total_amount,
            "status": order.status,
        },
    }
