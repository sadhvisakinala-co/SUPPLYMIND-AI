"""
Supplier Routes — Supplier listing, details, and quotation comparison.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.models import Supplier, SupplierQuotation
from app.middleware.auth import get_current_user, User

router = APIRouter(prefix="/api/suppliers", tags=["Suppliers"])


# ─── Pydantic Schemas ────────────────────────────────────────────────────────


class SupplierResponse(BaseModel):
    id: int
    name: str
    code: str
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    rating: float
    reliability_score: float
    lead_time_days: int
    payment_terms: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class QuotationResponse(BaseModel):
    id: int
    supplier_id: int
    item_sku: str
    item_name: Optional[str] = None
    unit_price: float
    min_order_quantity: int
    max_order_quantity: int
    bulk_discount_pct: float
    bulk_threshold: int
    delivery_days: int
    warranty_months: int
    valid_until: Optional[datetime] = None
    currency: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class SupplierDetailResponse(SupplierResponse):
    quotations: List[QuotationResponse] = []


class QuotationComparison(BaseModel):
    id: int
    quotation_id: int
    supplier_id: int
    supplier_name: str
    supplier_rating: float
    supplier_country: Optional[str] = None
    supplier: Optional[SupplierResponse] = None
    unit_price: float
    min_order_quantity: int
    bulk_discount_pct: float
    bulk_threshold: int
    delivery_days: int
    warranty_months: int
    currency: str
    # Computed fields for common quantities
    cost_for_50: float
    cost_for_100: float
    cost_for_250: float
    cost_for_500: float


# ─── Routes ──────────────────────────────────────────────────────────────────


@router.get("/quotations/{sku}", response_model=List[QuotationComparison])
def compare_quotations(
    sku: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Compare quotations for a specific SKU from all suppliers."""
    quotations = (
        db.query(SupplierQuotation)
        .join(Supplier)
        .filter(
            SupplierQuotation.item_sku == sku,
            Supplier.is_active == True,
        )
        .all()
    )

    if not quotations:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No quotations found for SKU: {sku}",
        )

    comparisons = []
    for q in quotations:
        supplier = q.supplier

        def calc_cost(qty: int) -> float:
            """Calculate total cost for a given quantity, applying bulk discount if applicable."""
            if qty >= q.bulk_threshold and q.bulk_discount_pct > 0:
                discounted_price = q.unit_price * (1 - q.bulk_discount_pct / 100)
                return round(qty * discounted_price, 2)
            return round(qty * q.unit_price, 2)

        comparisons.append(
            QuotationComparison(
                id=q.id,
                quotation_id=q.id,
                supplier_id=supplier.id,
                supplier_name=supplier.name,
                supplier_rating=supplier.rating,
                supplier_country=supplier.country,
                supplier=SupplierResponse.model_validate(supplier),
                unit_price=q.unit_price,
                min_order_quantity=q.min_order_quantity,
                bulk_discount_pct=q.bulk_discount_pct,
                bulk_threshold=q.bulk_threshold,
                delivery_days=q.delivery_days,
                warranty_months=q.warranty_months,
                currency=q.currency,
                cost_for_50=calc_cost(50),
                cost_for_100=calc_cost(100),
                cost_for_250=calc_cost(250),
                cost_for_500=calc_cost(500),
            )
        )

    # Sort in logical order: Supplier #1, Supplier #2, Supplier #3
    comparisons.sort(key=lambda c: c.supplier_id)
    return comparisons


@router.get("/{supplier_id}", response_model=SupplierDetailResponse)
def get_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get supplier details with all their quotations."""
    supplier = db.query(Supplier).filter(Supplier.id == supplier_id).first()
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Supplier not found",
        )

    return SupplierDetailResponse(
        **{c.key: getattr(supplier, c.key) for c in Supplier.__table__.columns},
        quotations=[QuotationResponse.model_validate(q) for q in supplier.quotations],
    )


@router.get("", response_model=List[SupplierResponse])
def list_suppliers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all active suppliers with their ratings."""
    suppliers = (
        db.query(Supplier)
        .filter(Supplier.is_active == True)
        .order_by(Supplier.rating.desc())
        .all()
    )
    return [SupplierResponse.model_validate(s) for s in suppliers]
