"""
Settings Routes — Merchant profile management and procurement policies.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

from app.database import get_db
from app.models.models import User
from app.utils.auth import verify_password, get_password_hash
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/settings", tags=["Settings"])


# ─── Pydantic Schemas ────────────────────────────────────────────────────────


class ProfileResponse(BaseModel):
    id: int
    email: str
    full_name: str
    company_name: Optional[str] = ""
    role: str
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    company_name: Optional[str] = Field(None, max_length=255)


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


class ProcurementPolicy(BaseModel):
    name: str
    description: str
    value: str
    editable: bool


class PoliciesResponse(BaseModel):
    approval_thresholds: List[ProcurementPolicy]
    preferred_suppliers: List[str]
    budget_limits: List[ProcurementPolicy]
    general: List[ProcurementPolicy]


# ─── Routes ──────────────────────────────────────────────────────────────────


@router.get("/profile", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    """Get the current merchant's profile."""
    return ProfileResponse.model_validate(current_user)


@router.put("/profile", response_model=ProfileResponse)
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update merchant profile (full_name, company_name)."""
    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update",
        )

    for field, value in update_data.items():
        setattr(current_user, field, value)

    current_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_user)
    return ProfileResponse.model_validate(current_user)


@router.put("/password")
def change_password(
    payload: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Change the merchant's password."""
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    if payload.current_password == payload.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password",
        )

    current_user.hashed_password = get_password_hash(payload.new_password)
    current_user.updated_at = datetime.utcnow()
    db.commit()

    return {"message": "Password updated successfully"}


@router.get("/policies", response_model=PoliciesResponse)
def get_policies(current_user: User = Depends(get_current_user)):
    """
    Get procurement policies for the merchant.
    Returns mock policy data representing configurable business rules.
    """
    return PoliciesResponse(
        approval_thresholds=[
            ProcurementPolicy(
                name="Auto-approve threshold",
                description="Orders below this amount are auto-approved",
                value="$500.00",
                editable=True,
            ),
            ProcurementPolicy(
                name="Manager approval threshold",
                description="Orders above this amount require manager approval",
                value="$5,000.00",
                editable=True,
            ),
            ProcurementPolicy(
                name="Executive approval threshold",
                description="Orders above this amount require executive approval",
                value="$25,000.00",
                editable=True,
            ),
        ],
        preferred_suppliers=[
            "TechSource Global",
            "PrimeParts Direct",
            "EuroTech Supply",
        ],
        budget_limits=[
            ProcurementPolicy(
                name="Monthly procurement budget",
                description="Maximum monthly spend on procurement",
                value="$50,000.00",
                editable=True,
            ),
            ProcurementPolicy(
                name="Single order limit",
                description="Maximum value for a single purchase order",
                value="$15,000.00",
                editable=True,
            ),
        ],
        general=[
            ProcurementPolicy(
                name="Minimum supplier rating",
                description="Only consider suppliers with rating above this threshold",
                value="3.5",
                editable=True,
            ),
            ProcurementPolicy(
                name="Require multiple quotes",
                description="Require quotations from at least N suppliers",
                value="2",
                editable=True,
            ),
            ProcurementPolicy(
                name="AI recommendation required",
                description="Require AI procurement recommendation before ordering",
                value="Yes",
                editable=True,
            ),
        ],
    )


@router.post("/reset-demo", tags=["Settings"])
def reset_demo_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Resets synthetic demo data:
    Restores ELEC-005 stockout state, resets PO-2024-00892 to pending_approval,
    and clears testing payment attempts while keeping merchant account intact.
    """
    from app.models.models import InventoryItem, ProcurementOrder, PaymentRecord, Negotiation, OrderStatus, NegotiationStatus
    
    # Reset ELEC-005 stock
    item_watch = db.query(InventoryItem).filter(InventoryItem.sku == "ELEC-005").first()
    if item_watch:
        item_watch.current_stock = 0
        item_watch.status = "stockout"

    # Reset ELEC-001 and ELEC-003 to low stock
    item_earbuds = db.query(InventoryItem).filter(InventoryItem.sku == "ELEC-001").first()
    if item_earbuds:
        item_earbuds.current_stock = 8
        item_earbuds.status = "low"

    item_hub = db.query(InventoryItem).filter(InventoryItem.sku == "ELEC-003").first()
    if item_hub:
        item_hub.current_stock = 6
        item_hub.status = "low"

    # Reset the primary procurement order
    order = db.query(ProcurementOrder).filter(ProcurementOrder.order_number == "PO-2024-00892").first()
    if order:
        order.status = OrderStatus.PENDING_APPROVAL
        order.merchant_approved = False
        order.approved_at = None
        order.actual_delivery = None
        order.notes = "Expedited batch restock order. Priority freight lane reserved."
        # Clear testing payments associated with this order
        db.query(PaymentRecord).filter(PaymentRecord.order_id == order.id).delete()

    # Reset negotiation
    neg = db.query(Negotiation).filter(Negotiation.item_sku == "ELEC-005").first()
    if neg:
        neg.status = NegotiationStatus.ACCEPTED
        neg.final_price = 122.50

    db.commit()

    from app.routes.audit import create_audit_log
    create_audit_log(
        db=db,
        user_id=current_user.id,
        order_id=order.id if order else None,
        action="demo_environment_reset",
        entity_type="system",
        entity_id=0,
        details={
            "sku": "ELEC-005",
            "stock_restored": 0,
            "order_number": "PO-2024-00892",
            "status": "pending_approval",
        },
    )

    return {
        "status": "success",
        "message": "Demo scenario has been successfully reset. ELEC-005 is back in stockout state and PO-2024-00892 is awaiting approval."
    }

