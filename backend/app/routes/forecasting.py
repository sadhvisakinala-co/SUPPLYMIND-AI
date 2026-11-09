"""
Forecasting Routes — AI-powered demand forecasting, stockout prediction, and risk analysis.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import User, InventoryItem
from app.middleware.auth import get_current_user
from app.services.forecasting import (
    forecast_demand,
    predict_stockout_date,
    calculate_reorder_quantity,
    get_risk_score,
)

router = APIRouter(prefix="/api/forecasting", tags=["Forecasting"])


# ─── Routes ──────────────────────────────────────────────────────────────────


@router.get("/dashboard")
def forecasting_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get a forecasting summary dashboard for all inventory items.
    Includes risk scores, stockout predictions, and reorder recommendations.
    """
    items = (
        db.query(InventoryItem)
        .filter(InventoryItem.owner_id == current_user.id)
        .order_by(InventoryItem.name.asc())
        .all()
    )

    if not items:
        return {
            "total_items": 0,
            "critical_items": 0,
            "high_risk_items": 0,
            "items_needing_reorder": 0,
            "total_forecast_demand_30d": 0.0,
            "items": [],
        }

    dashboard_items = []
    critical_count = 0
    high_risk_count = 0
    reorder_count = 0
    total_demand_30d = 0.0

    for item in items:
        # Forecast demand
        demand_forecast = forecast_demand(db, item, days=30)
        total_demand_30d += demand_forecast["forecast_total_demand"]

        # Stockout prediction
        stockout = predict_stockout_date(item, demand_forecast["forecast_daily_demand"])

        # Risk score
        risk = get_risk_score(item)

        # Reorder calculation
        reorder = calculate_reorder_quantity(item)

        # Count critical/high-risk items
        if risk["risk_level"] == "critical":
            critical_count += 1
        if risk["risk_level"] in ("critical", "high"):
            high_risk_count += 1
        if item.current_stock <= item.reorder_point:
            reorder_count += 1

        dashboard_items.append({
            "item_id": item.id,
            "sku": item.sku,
            "name": item.name,
            "current_stock": item.current_stock,
            "status": item.status,
            "risk_score": risk["risk_score"],
            "risk_level": risk["risk_level"],
            "forecast_daily_demand": demand_forecast["forecast_daily_demand"],
            "forecast_30d_demand": demand_forecast["forecast_total_demand"],
            "days_until_stockout": stockout.get("days_until_stockout"),
            "stockout_date": stockout.get("stockout_date"),
            "recommended_reorder_qty": reorder["eoq"],
            "reorder_point": reorder["reorder_point"],
        })

    # Sort by risk score descending (most urgent first)
    dashboard_items.sort(key=lambda x: x["risk_score"], reverse=True)

    return {
        "total_items": len(items),
        "critical_items": critical_count,
        "high_risk_items": high_risk_count,
        "items_needing_reorder": reorder_count,
        "total_forecast_demand_30d": round(total_demand_30d, 1),
        "items": dashboard_items,
    }


@router.get("/{item_id}")
def get_item_forecast(
    item_id: int,
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get detailed AI forecast for a single inventory item.
    Includes demand forecast, stockout prediction, reorder recommendation, and risk score.
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

    demand = forecast_demand(db, item, days=days)
    stockout = predict_stockout_date(item, demand["forecast_daily_demand"])
    reorder = calculate_reorder_quantity(item)
    risk = get_risk_score(item)

    return {
        "item": {
            "id": item.id,
            "sku": item.sku,
            "name": item.name,
            "category": item.category,
            "current_stock": item.current_stock,
            "reorder_point": item.reorder_point,
            "safety_stock": item.safety_stock,
            "unit_cost": item.unit_cost,
            "selling_price": item.selling_price,
            "status": item.status,
        },
        "demand_forecast": demand,
        "stockout_prediction": stockout,
        "reorder_recommendation": reorder,
        "risk_assessment": risk,
    }


@router.get("/calculations/{item_sku_or_id}")
def get_reorder_calculation(
    item_sku_or_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get detailed mathematical breakdown for EOQ and shortage-driven replenishment.
    Explains the Wilson EOQ formula, input variables, adjustments, and approved purchase orders.
    """
    query = db.query(InventoryItem).filter(InventoryItem.owner_id == current_user.id)
    if item_sku_or_id.isdigit():
        item = query.filter(InventoryItem.id == int(item_sku_or_id)).first()
    else:
        item = query.filter(InventoryItem.sku == item_sku_or_id).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Inventory item '{item_sku_or_id}' not found",
        )

    return calculate_reorder_quantity(item)

