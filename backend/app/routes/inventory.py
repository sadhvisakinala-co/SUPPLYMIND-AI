"""
Inventory Routes — CRUD and analytics for inventory items.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import case
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.models import User, InventoryItem, SalesRecord
from app.middleware.auth import get_current_user
from app.services.forecasting import calculate_reorder_quantity

router = APIRouter(prefix="/api/inventory", tags=["Inventory"])


# ─── Pydantic Schemas ────────────────────────────────────────────────────────


class SalesRecordResponse(BaseModel):
    id: int
    date: datetime
    quantity_sold: int
    revenue: float

    class Config:
        from_attributes = True


class InventoryItemResponse(BaseModel):
    id: int
    sku: str
    name: str
    category: Optional[str] = None
    current_stock: int
    reorder_point: int
    safety_stock: int
    unit_cost: float
    selling_price: float
    lead_time_days: int
    daily_demand_avg: float
    demand_std_dev: Optional[float] = 0.0
    last_restock_date: Optional[datetime] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class InventoryItemDetail(InventoryItemResponse):
    sales_history: List[SalesRecordResponse] = []


class InventoryItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    current_stock: Optional[int] = None
    reorder_point: Optional[int] = None
    safety_stock: Optional[int] = None
    unit_cost: Optional[float] = None
    selling_price: Optional[float] = None
    lead_time_days: Optional[int] = None
    daily_demand_avg: Optional[float] = None
    demand_std_dev: Optional[float] = None


class InventoryStatsResponse(BaseModel):
    total_items: int
    total_inventory_value: float
    total_retail_value: float
    at_risk_count: int
    stockout_count: int
    low_stock_count: int
    normal_count: int
    categories: List[str]


class AlertItem(BaseModel):
    id: int
    sku: str
    name: str
    current_stock: int
    reorder_point: int
    status: str
    daily_demand_avg: float
    days_until_stockout: Optional[float] = None

    class Config:
        from_attributes = True


# ─── Routes ──────────────────────────────────────────────────────────────────


@router.get("/alerts", response_model=List[AlertItem])
def get_inventory_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get inventory items that are below reorder point or at stockout."""
    items = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.owner_id == current_user.id,
            InventoryItem.status.in_(["low", "critical", "stockout"]),
        )
        .order_by(InventoryItem.current_stock.asc())
        .all()
    )

    alerts = []
    for item in items:
        days_left = None
        if item.daily_demand_avg > 0:
            days_left = round(item.current_stock / item.daily_demand_avg, 1)
        alerts.append(
            AlertItem(
                id=item.id,
                sku=item.sku,
                name=item.name,
                current_stock=item.current_stock,
                reorder_point=item.reorder_point,
                status=item.status,
                daily_demand_avg=item.daily_demand_avg,
                days_until_stockout=days_left,
            )
        )
    return alerts


@router.get("/stats", response_model=InventoryStatsResponse)
def get_inventory_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get summary statistics for the merchant's inventory."""
    items = (
        db.query(InventoryItem)
        .filter(InventoryItem.owner_id == current_user.id)
        .all()
    )

    total_value = sum(i.current_stock * i.unit_cost for i in items)
    retail_value = sum(i.current_stock * i.selling_price for i in items)
    stockout = sum(1 for i in items if i.status == "stockout")
    low = sum(1 for i in items if i.status in ("low", "critical"))
    normal = sum(1 for i in items if i.status == "normal")
    categories = list(set(i.category for i in items if i.category))

    return InventoryStatsResponse(
        total_items=len(items),
        total_inventory_value=round(total_value, 2),
        total_retail_value=round(retail_value, 2),
        at_risk_count=low + stockout,
        stockout_count=stockout,
        low_stock_count=low,
        normal_count=normal,
        categories=sorted(categories),
    )


@router.get("/{item_id}", response_model=InventoryItemDetail)
def get_inventory_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a single inventory item with its sales history."""
    item = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.id == item_id,
            InventoryItem.owner_id == current_user.id,
        )
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )

    sales = (
        db.query(SalesRecord)
        .filter(SalesRecord.item_id == item.id)
        .order_by(SalesRecord.date.desc())
        .limit(90)
        .all()
    )

    return InventoryItemDetail(
        **{c.key: getattr(item, c.key) for c in InventoryItem.__table__.columns},
        sales_history=[SalesRecordResponse.model_validate(s) for s in sales],
    )


@router.get("", response_model=List[InventoryItemResponse])
def list_inventory(
    status_filter: Optional[str] = Query(None, alias="status"),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all inventory items for the current user with optional filters."""
    query = db.query(InventoryItem).filter(InventoryItem.owner_id == current_user.id)

    if status_filter:
        query = query.filter(InventoryItem.status == status_filter)
    if category:
        query = query.filter(InventoryItem.category == category)

    # Order by urgency priority by default: STOCKOUT (1) -> LOW/CRITICAL (2) -> NORMAL/HEALTHY (3)
    # Then by id ascending so ELEC-001 and ELEC-003 follow ELEC-005 immediately.
    urgency_order = case(
        (InventoryItem.status == "stockout", 1),
        (InventoryItem.status.in_(["critical", "low"]), 2),
        (InventoryItem.status == "normal", 3),
        else_=4,
    )
    items = query.order_by(urgency_order.asc(), InventoryItem.id.asc()).all()
    return [InventoryItemResponse.model_validate(i) for i in items]


@router.put("/{item_id}", response_model=InventoryItemResponse)
def update_inventory_item(
    item_id: int,
    payload: InventoryItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an inventory item."""
    item = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.id == item_id,
            InventoryItem.owner_id == current_user.id,
        )
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)

    # Recompute status based on stock levels
    if item.current_stock <= 0:
        item.status = "stockout"
    elif item.current_stock <= item.safety_stock:
        item.status = "critical"
    elif item.current_stock <= item.reorder_point:
        item.status = "low"
    else:
        item.status = "normal"

    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return InventoryItemResponse.model_validate(item)


@router.get("/{item_id}/reorder-calculation")
def get_inventory_item_reorder_calculation(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get detailed Wilson EOQ and shortage-driven replenishment calculation breakdown
    for an inventory item.
    """
    item = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.id == item_id,
            InventoryItem.owner_id == current_user.id,
        )
        .first()
    )
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inventory item not found",
        )

    return calculate_reorder_quantity(item)

