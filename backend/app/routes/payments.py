"""
Payment Routes — PayPal integration for procurement order payments.
"""

from fastapi import APIRouter, Depends, HTTPException, Request, Query, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime
import uuid

from app.database import get_db
from app.models.models import (
    User, ProcurementOrder, PaymentRecord, OrderStatus,
)
from app.middleware.auth import get_current_user
from app.services.paypal import paypal_service
from app.routes.audit import create_audit_log

router = APIRouter(prefix="/api/payments", tags=["Payments"])


# ─── Pydantic Schemas ────────────────────────────────────────────────────────


class CreatePaymentRequest(BaseModel):
    order_id: int


class PaymentResponse(BaseModel):
    id: int
    order_id: int
    paypal_order_id: Optional[str] = None
    paypal_payer_id: Optional[str] = None
    paypal_capture_id: Optional[str] = None
    amount: float
    currency: str
    status: str
    payment_method: str
    payer_email: Optional[str] = None
    idempotency_key: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PaymentCreateResponse(BaseModel):
    payment_id: int
    paypal_order_id: str
    status: str
    approval_url: str
    message: str


class PaymentCaptureResponse(BaseModel):
    payment_id: int
    paypal_order_id: str
    paypal_capture_id: Optional[str] = None
    status: str
    payer_email: Optional[str] = None
    message: str


class PaymentHistoryItem(BaseModel):
    id: int
    order_id: int
    order_number: str
    paypal_order_id: Optional[str] = None
    amount: float
    currency: str
    status: str
    created_at: datetime


# ─── Routes ──────────────────────────────────────────────────────────────────


@router.post("/create", response_model=PaymentCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_payment(
    payload: CreatePaymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a PayPal order for an approved procurement order.
    Returns an approval URL for the payer to complete payment.
    """
    # Validate the procurement order
    order = db.query(ProcurementOrder).filter(
        ProcurementOrder.id == payload.order_id,
        ProcurementOrder.merchant_id == current_user.id,
    ).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Procurement order not found",
        )

    if order.status != OrderStatus.APPROVED or not order.merchant_approved:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Order must be explicitly approved by merchant before payment. Current status: {order.status}",
        )

    if order.notes and "APPROVAL_INVALIDATED" in order.notes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order approval was invalidated due to changed negotiation terms. Merchant review and re-approval required prior to checkout.",
        )

    # Check if payment already exists
    existing_payment = db.query(PaymentRecord).filter(
        PaymentRecord.order_id == order.id,
        PaymentRecord.status.in_(["pending", "completed"]),
    ).first()
    if existing_payment:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A payment already exists for this order",
        )

    # Create PayPal order
    paypal_result = await paypal_service.create_order(
        amount=order.total_amount,
        currency=order.currency,
        order_ref=order.order_number,
        description=f"SUPPLYMIND AI - Purchase Order {order.order_number}",
        items=order.items,
        subtotal=order.subtotal,
        shipping=order.shipping,
        tax=order.tax,
    )

    if paypal_result.get("status") == "configuration_required":
        return PaymentCreateResponse(
            payment_id=0,
            paypal_order_id="",
            status="configuration_required",
            approval_url="",
            message=paypal_result.get("message", "PayPal Sandbox credentials not configured in backend/.env"),
        )

    if paypal_result.get("status") != "created":
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=paypal_result.get("message", "Failed to create PayPal order"),
        )

    # Store payment record
    payment = PaymentRecord(
        order_id=order.id,
        paypal_order_id=paypal_result["order_id"],
        amount=order.total_amount,
        currency=order.currency,
        status="pending",
        payment_method="paypal",
        idempotency_key=paypal_result.get("idempotency_key"),
        raw_response=paypal_result.get("raw_response"),
    )
    db.add(payment)

    # Update order status
    order.status = OrderStatus.PAYMENT_PENDING
    order.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(payment)

    # Find approval URL
    approval_url = ""
    for link in paypal_result.get("links", []):
        if link.get("rel") == "approve":
            approval_url = link["href"]
            break

    create_audit_log(
        db=db,
        user_id=current_user.id,
        order_id=order.id,
        action="payment_created",
        entity_type="payment",
        entity_id=payment.id,
        details={
            "paypal_order_id": paypal_result["order_id"],
            "amount": order.total_amount,
            "currency": order.currency,
        },
    )

    return PaymentCreateResponse(
        payment_id=payment.id,
        paypal_order_id=paypal_result["order_id"],
        status="pending",
        approval_url=approval_url,
        message="PayPal order created. Redirect user to approval URL to complete payment.",
    )


@router.post("/capture/{paypal_order_id}", response_model=PaymentCaptureResponse)
async def capture_payment(
    paypal_order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Capture a PayPal payment after the payer has approved it.
    Updates payment record and procurement order status.
    """
    # Find payment record
    payment = db.query(PaymentRecord).filter(
        PaymentRecord.paypal_order_id == paypal_order_id,
    ).first()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment record not found for this PayPal order",
        )

    # Verify order belongs to the user
    order = db.query(ProcurementOrder).filter(
        ProcurementOrder.id == payment.order_id,
        ProcurementOrder.merchant_id == current_user.id,
    ).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to capture this payment",
        )

    if payment.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment has already been captured",
        )

    capture_result = await paypal_service.capture_order(paypal_order_id)
    if capture_result.get("status") == "configuration_required":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=capture_result.get("message", "PayPal Sandbox credentials not configured in backend/.env"),
        )
    if capture_result.get("status") != "completed":
        payment.status = "failed"
        payment.error_message = capture_result.get("message", "PayPal capture rejected")
        payment.updated_at = datetime.utcnow()
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=capture_result.get("message", "Failed to capture PayPal payment"),
        )

    # Extract capture details
    capture_id = capture_result.get("capture_id")
    payer_email = capture_result.get("payer_email")
    payer_id = capture_result.get("payer_id")

    raw_resp = capture_result.get("raw_response")
    if isinstance(raw_resp, dict):
        if not payer_email and "payer" in raw_resp:
            payer_email = raw_resp["payer"].get("email_address")
        if not payer_id and "payer" in raw_resp:
            payer_id = raw_resp["payer"].get("payer_id")
        if not capture_id:
            for pu in raw_resp.get("purchase_units", []):
                captures = pu.get("payments", {}).get("captures", [])
                if captures and captures[0].get("id"):
                    capture_id = captures[0].get("id")
                    break

    # Update payment record
    payment.status = "completed"
    payment.paypal_capture_id = capture_id
    payment.paypal_payer_id = payer_id
    payment.payer_email = payer_email
    payment.raw_response = capture_result
    payment.updated_at = datetime.utcnow()

    # Update procurement order
    order.status = OrderStatus.PAYMENT_COMPLETED
    order.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(payment)

    create_audit_log(
        db=db,
        user_id=current_user.id,
        order_id=order.id,
        action="payment_captured",
        entity_type="payment",
        entity_id=payment.id,
        details={
            "paypal_order_id": paypal_order_id,
            "capture_id": capture_id,
            "amount": payment.amount,
            "payer_email": payer_email,
        },
    )

    return PaymentCaptureResponse(
        payment_id=payment.id,
        paypal_order_id=paypal_order_id,
        paypal_capture_id=capture_id,
        status="completed",
        payer_email=payer_email,
        message="Payment captured successfully.",
    )


@router.get("/history", response_model=List[PaymentHistoryItem])
def get_payment_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get payment history for the current merchant."""
    # Get all orders for the user
    orders = db.query(ProcurementOrder).filter(
        ProcurementOrder.merchant_id == current_user.id
    ).all()
    order_ids = [o.id for o in orders]
    order_map = {o.id: o for o in orders}

    if not order_ids:
        return []

    payments = (
        db.query(PaymentRecord)
        .filter(PaymentRecord.order_id.in_(order_ids))
        .order_by(PaymentRecord.created_at.desc())
        .all()
    )

    result = []
    for p in payments:
        order = order_map.get(p.order_id)
        result.append(PaymentHistoryItem(
            id=p.id,
            order_id=p.order_id,
            order_number=order.order_number if order else "N/A",
            paypal_order_id=p.paypal_order_id,
            amount=p.amount,
            currency=p.currency,
            status=p.status,
            created_at=p.created_at,
        ))

    return result


@router.get("/{order_id}", response_model=PaymentResponse)
def get_payment_status(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get payment status for a procurement order."""
    # Verify the order belongs to the user
    order = db.query(ProcurementOrder).filter(
        ProcurementOrder.id == order_id,
        ProcurementOrder.merchant_id == current_user.id,
    ).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    payment = db.query(PaymentRecord).filter(
        PaymentRecord.order_id == order_id,
    ).order_by(PaymentRecord.created_at.desc()).first()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No payment found for this order",
        )

    return PaymentResponse.model_validate(payment)


@router.post("/webhook")
async def paypal_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Handle PayPal webhook notifications.
    Validates the event and updates payment/order status accordingly.
    """
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload",
        )

    event_type = body.get("event_type", "")
    resource = body.get("resource", {})

    # Handle relevant events
    if event_type == "CHECKOUT.ORDER.APPROVED":
        paypal_order_id = resource.get("id")
        if paypal_order_id:
            payment = db.query(PaymentRecord).filter(
                PaymentRecord.paypal_order_id == paypal_order_id
            ).first()
            if payment:
                payment.status = "approved"
                payment.updated_at = datetime.utcnow()
                db.commit()

    elif event_type == "PAYMENT.CAPTURE.COMPLETED":
        capture_id = resource.get("id")
        paypal_order_id = resource.get("supplementary_data", {}).get(
            "related_ids", {}
        ).get("order_id")
        if paypal_order_id:
            payment = db.query(PaymentRecord).filter(
                PaymentRecord.paypal_order_id == paypal_order_id
            ).first()
            if payment and payment.status != "completed":
                payment.status = "completed"
                payment.paypal_capture_id = capture_id
                payment.updated_at = datetime.utcnow()

                order = db.query(ProcurementOrder).filter(
                    ProcurementOrder.id == payment.order_id
                ).first()
                if order:
                    order.status = OrderStatus.PAYMENT_COMPLETED
                    order.updated_at = datetime.utcnow()

                db.commit()

    elif event_type == "PAYMENT.CAPTURE.DENIED":
        paypal_order_id = resource.get("supplementary_data", {}).get(
            "related_ids", {}
        ).get("order_id")
        if paypal_order_id:
            payment = db.query(PaymentRecord).filter(
                PaymentRecord.paypal_order_id == paypal_order_id
            ).first()
            if payment:
                payment.status = "failed"
                payment.error_message = "Payment capture denied by PayPal"
                payment.updated_at = datetime.utcnow()

                order = db.query(ProcurementOrder).filter(
                    ProcurementOrder.id == payment.order_id
                ).first()
                if order:
                    order.status = OrderStatus.PAYMENT_FAILED
                    order.updated_at = datetime.utcnow()

                db.commit()

    return {"status": "ok"}
