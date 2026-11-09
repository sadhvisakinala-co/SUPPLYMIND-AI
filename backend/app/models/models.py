from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Enum, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import enum


class OrderStatus(str, enum.Enum):
    DRAFT = "draft"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    PAYMENT_PENDING = "payment_pending"
    PAYMENT_COMPLETED = "payment_completed"
    PAYMENT_FAILED = "payment_failed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class NegotiationStatus(str, enum.Enum):
    PENDING = "pending"
    COUNTER_OFFERED = "counter_offered"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    company_name = Column(String(255), default="")
    role = Column(String(50), default="merchant")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    inventory_items = relationship("InventoryItem", back_populates="owner")
    orders = relationship("ProcurementOrder", back_populates="merchant")


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, nullable=False)
    contact_email = Column(String(255))
    contact_phone = Column(String(50))
    address = Column(Text)
    country = Column(String(100))
    rating = Column(Float, default=0.0)
    reliability_score = Column(Float, default=0.0)
    lead_time_days = Column(Integer, default=7)
    payment_terms = Column(String(100))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    quotations = relationship("SupplierQuotation", back_populates="supplier")


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sku = Column(String(50), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100))
    current_stock = Column(Integer, default=0)
    reorder_point = Column(Integer, default=10)
    safety_stock = Column(Integer, default=5)
    unit_cost = Column(Float, default=0.0)
    selling_price = Column(Float, default=0.0)
    lead_time_days = Column(Integer, default=7)
    daily_demand_avg = Column(Float, default=0.0)
    demand_std_dev = Column(Float, default=0.0)
    last_restock_date = Column(DateTime)
    status = Column(String(50), default="normal")  # normal, low, critical, stockout
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    owner = relationship("User", back_populates="inventory_items")
    sales_history = relationship("SalesRecord", back_populates="item")


class SalesRecord(Base):
    __tablename__ = "sales_records"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("inventory_items.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    quantity_sold = Column(Integer, default=0)
    revenue = Column(Float, default=0.0)

    item = relationship("InventoryItem", back_populates="sales_history")


class SupplierQuotation(Base):
    __tablename__ = "supplier_quotations"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    item_sku = Column(String(50), nullable=False)
    item_name = Column(String(255))
    unit_price = Column(Float, nullable=False)
    min_order_quantity = Column(Integer, default=1)
    max_order_quantity = Column(Integer, default=10000)
    bulk_discount_pct = Column(Float, default=0.0)
    bulk_threshold = Column(Integer, default=100)
    delivery_days = Column(Integer, default=7)
    warranty_months = Column(Integer, default=12)
    valid_until = Column(DateTime)
    currency = Column(String(10), default="USD")
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    supplier = relationship("Supplier", back_populates="quotations")


class Negotiation(Base):
    __tablename__ = "negotiations"

    id = Column(Integer, primary_key=True, index=True)
    merchant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    quotation_id = Column(Integer, ForeignKey("supplier_quotations.id"), nullable=False)
    item_sku = Column(String(50), nullable=False)
    original_price = Column(Float, nullable=False)
    counter_price = Column(Float)
    final_price = Column(Float)
    quantity = Column(Integer, nullable=False)
    ai_reasoning = Column(Text)
    ai_strategy = Column(Text)
    status = Column(String(50), default=NegotiationStatus.PENDING)
    rounds = Column(Integer, default=0)
    messages = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ProcurementOrder(Base):
    __tablename__ = "procurement_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, nullable=False)
    merchant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    negotiation_id = Column(Integer, ForeignKey("negotiations.id"))
    items = Column(JSON, nullable=False)
    subtotal = Column(Float, nullable=False)
    tax = Column(Float, default=0.0)
    shipping = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    status = Column(String(50), default=OrderStatus.DRAFT)
    ai_recommendation = Column(Text)
    ai_confidence_score = Column(Float)
    merchant_approved = Column(Boolean, default=False)
    approved_at = Column(DateTime)
    expected_delivery = Column(DateTime)
    actual_delivery = Column(DateTime)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    merchant = relationship("User", back_populates="orders")
    payment = relationship("PaymentRecord", back_populates="order", uselist=False)
    audit_logs = relationship("AuditLog", back_populates="order")


class PaymentRecord(Base):
    __tablename__ = "payment_records"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("procurement_orders.id"), nullable=False)
    paypal_order_id = Column(String(255), unique=True)
    paypal_payer_id = Column(String(255))
    paypal_capture_id = Column(String(255))
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="USD")
    status = Column(String(50), default="pending")
    payment_method = Column(String(50), default="paypal")
    payer_email = Column(String(255))
    idempotency_key = Column(String(255), unique=True)
    raw_response = Column(JSON)
    error_message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    order = relationship("ProcurementOrder", back_populates="payment")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("procurement_orders.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50))
    entity_id = Column(Integer)
    details = Column(JSON)
    ip_address = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("ProcurementOrder", back_populates="audit_logs")

