"""
SUPPLYMIND AI — Database Seeder
Seeds demo merchant Alex Chen (TechFlow Electronics), 20 inventory items,
3 suppliers, quotations, 90 days of sales records, sample negotiation,
and an urgent restock procurement order awaiting approval.
"""

import sys
import os
import random
from datetime import datetime, timedelta

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.database import engine, Base, SessionLocal
from app.models.models import (
    User, Supplier, InventoryItem, SalesRecord,
    SupplierQuotation, Negotiation, ProcurementOrder,
    PaymentRecord, AuditLog, OrderStatus, NegotiationStatus
)
from app.utils.auth import get_password_hash


def seed_database():
    print("Creating all tables in database...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if demo user already exists
        existing_user = db.query(User).filter(User.email == "demo@supplymind.ai").first()
        if existing_user:
            print("Demo user already exists. Seeding skipped.")
            return

        print("Seeding demo user...")
        demo_user = User(
            email="demo@supplymind.ai",
            hashed_password=get_password_hash("Demo@2024!"),
            full_name="Alex Chen",
            company_name="TechFlow Electronics Ltd",
            role="merchant",
            is_active=True
        )
        db.add(demo_user)
        db.flush()

        # 3 Global Suppliers
        print("Seeding suppliers...")
        suppliers_data = [
            {
                "name": "TechSource Global Ltd",
                "code": "SUP-TSG-01",
                "contact_email": "b2b@techsource-global.com",
                "contact_phone": "+86-755-8829-1000",
                "address": "Baoan High-Tech Industrial Park, Shenzhen, Guangdong",
                "country": "China",
                "rating": 4.2,
                "reliability_score": 0.88,
                "lead_time_days": 14,
                "payment_terms": "Net 30, PayPal Verified",
                "is_active": True
            },
            {
                "name": "PrimeParts Direct Inc",
                "code": "SUP-PPD-02",
                "contact_email": "procurement@primeparts-direct.com",
                "contact_phone": "+1-415-555-0198",
                "address": "450 Technology Parkway, Fremont, CA",
                "country": "United States",
                "rating": 4.7,
                "reliability_score": 0.96,
                "lead_time_days": 4,
                "payment_terms": "PayPal Express, Net 15",
                "is_active": True
            },
            {
                "name": "EuroTech Supply GmbH",
                "code": "SUP-ETS-03",
                "contact_email": "vertrieb@eurotech-supply.de",
                "contact_phone": "+49-89-9238-440",
                "address": "Industriestrasse 18, 80339 Munich, Bavaria",
                "country": "Germany",
                "rating": 4.5,
                "reliability_score": 0.93,
                "lead_time_days": 8,
                "payment_terms": "SEPA, PayPal Business",
                "is_active": True
            }
        ]

        supplier_objects = []
        for s in suppliers_data:
            obj = Supplier(**s)
            db.add(obj)
            supplier_objects.append(obj)
        db.flush()

        sup_china = supplier_objects[0]
        sup_usa = supplier_objects[1]
        sup_eu = supplier_objects[2]

        # 20 Inventory Items (Electronics)
        print("Seeding 20 electronics inventory items...")
        raw_items = [
            ("ELEC-001", "Wireless Earbuds Pro (Active Noise Canceling)", "Audio", 8, 25, 10, 42.0, 119.0, 7, 5.2, 1.4, "low"),
            ("ELEC-002", "Mechanical Gaming Keyboard RGB (Hot-Swap)", "Peripherals", 48, 20, 8, 38.0, 99.0, 5, 3.8, 0.9, "normal"),
            ("ELEC-003", "USB-C Multi-Port Hub 7-in-1 (100W PD)", "Accessories", 6, 30, 12, 19.5, 54.9, 6, 6.1, 1.8, "low"),
            ("ELEC-004", "Portable High-Speed SSD 1TB (NVMe)", "Storage", 35, 15, 6, 52.0, 129.9, 8, 2.8, 0.7, "normal"),
            ("ELEC-005", "Smart Watch Ultra Titanium (GPS + Cellular)", "Wearables", 0, 40, 15, 145.0, 349.0, 9, 8.4, 2.1, "stockout"), # URGENT STOCKOUT
            ("ELEC-006", "Webcam 4K Ultra HD Pro with Dual Mics", "Peripherals", 22, 18, 8, 48.0, 119.0, 6, 2.9, 0.8, "normal"),
            ("ELEC-007", "Bluetooth Speaker 360 Waterproof IPX7", "Audio", 54, 25, 10, 24.0, 69.0, 7, 4.0, 1.1, "normal"),
            ("ELEC-008", "Adjustable Aluminum Tablet & iPad Stand", "Accessories", 68, 20, 8, 12.0, 34.0, 5, 3.5, 0.6, "normal"),
            ("ELEC-009", "Ergonomic Vertical Wireless Mouse", "Peripherals", 42, 22, 9, 18.0, 49.0, 5, 4.3, 1.0, "normal"),
            ("ELEC-010", "IPS Gaming Monitor 27-inch 165Hz QHD", "Displays", 14, 12, 5, 160.0, 289.0, 10, 1.8, 0.5, "normal"),
            ("ELEC-011", "Ultra-Slim Power Bank 20000mAh 65W PD", "Power", 18, 35, 12, 28.0, 69.9, 6, 5.8, 1.3, "normal"),
            ("ELEC-012", "Braided High-Speed HDMI 2.1 Cable 6ft", "Cables", 120, 40, 15, 4.2, 16.9, 4, 9.5, 2.4, "normal"),
            ("ELEC-013", "Over-Ear Wireless Noise Cancelling Studio Headphones", "Audio", 16, 15, 6, 85.0, 199.0, 8, 2.2, 0.6, "normal"),
            ("ELEC-014", "Dual-Fan Laptop Cooling Pad (RGB)", "Accessories", 38, 20, 8, 16.5, 42.0, 5, 3.1, 0.8, "normal"),
            ("ELEC-015", "Studio Condenser USB Microphone + Boom Arm", "Audio", 26, 18, 7, 45.0, 109.0, 7, 2.6, 0.7, "normal"),
            ("ELEC-016", "MagSafe 3-in-1 Fast Wireless Charging Station", "Power", 31, 25, 10, 26.0, 64.9, 6, 4.7, 1.2, "normal"),
            ("ELEC-017", "Extended Gaming Mouse Pad XXL (Stitched Edge)", "Peripherals", 85, 30, 10, 7.5, 24.9, 4, 6.2, 1.5, "normal"),
            ("ELEC-018", "WiFi Smart Plug with Power Monitoring (4-Pack)", "Smart Home", 44, 25, 10, 21.0, 49.9, 6, 3.9, 1.0, "normal"),
            ("ELEC-019", "Dimmable LED Ring Light 10\" with Tripod", "Photography", 32, 20, 8, 15.0, 39.9, 5, 3.4, 0.9, "normal"),
            ("ELEC-020", "Mini Full-HD Portable Smart DLP Projector", "Displays", 11, 10, 4, 180.0, 379.0, 12, 1.4, 0.4, "normal"),
        ]

        item_objects = []
        for sku, name, cat, stock, reorder, safety, cost, price, lead, d_avg, d_std, status in raw_items:
            item = InventoryItem(
                owner_id=demo_user.id,
                sku=sku,
                name=name,
                category=cat,
                current_stock=stock,
                reorder_point=reorder,
                safety_stock=safety,
                unit_cost=cost,
                selling_price=price,
                lead_time_days=lead,
                daily_demand_avg=d_avg,
                demand_std_dev=d_std,
                last_restock_date=datetime.utcnow() - timedelta(days=random.randint(14, 45)),
                status=status
            )
            db.add(item)
            item_objects.append(item)
        db.flush()

        # Seed 90 days of sales records for each item
        print("Generating 90-day sales history records...")
        now = datetime.utcnow()
        for item in item_objects:
            for day_offset in range(90, 0, -1):
                record_date = now - timedelta(days=day_offset)
                # Apply weekday multiplier
                weekday = record_date.weekday()
                multiplier = 1.3 if weekday in [4, 5] else (0.8 if weekday == 6 else 1.0)
                
                # Base sales on daily_demand_avg with variance
                qty = max(0, int(random.gauss(item.daily_demand_avg * multiplier, item.demand_std_dev)))
                
                # If stockout item ELEC-005 in last 3 days, sales dropped to 0 due to no inventory
                if item.sku == "ELEC-005" and day_offset <= 3:
                    qty = 0

                revenue = round(qty * item.selling_price, 2)
                sale = SalesRecord(
                    item_id=item.id,
                    date=record_date,
                    quantity_sold=qty,
                    revenue=revenue
                )
                db.add(sale)

        # Seed Supplier Quotations (3 suppliers x 20 items = 60 quotes)
        print("Seeding supplier quotations...")
        for item in item_objects:
            # 1. TechSource Global (China) - Lowest price, higher lead time, high bulk discount
            q1 = SupplierQuotation(
                supplier_id=sup_china.id,
                item_sku=item.sku,
                item_name=item.name,
                unit_price=round(item.unit_cost * 0.90, 2),
                min_order_quantity=50,
                max_order_quantity=5000,
                bulk_discount_pct=8.5,
                bulk_threshold=150,
                delivery_days=14,
                warranty_months=12,
                valid_until=now + timedelta(days=30),
                currency="USD",
                notes="FOB Shenzhen port. Includes CE and FCC certification."
            )
            # 2. PrimeParts Direct (USA) - Medium price, fastest delivery, low MOQ
            q2 = SupplierQuotation(
                supplier_id=sup_usa.id,
                item_sku=item.sku,
                item_name=item.name,
                unit_price=round(item.unit_cost * 1.08, 2),
                min_order_quantity=10,
                max_order_quantity=2000,
                bulk_discount_pct=4.0,
                bulk_threshold=100,
                delivery_days=4,
                warranty_months=24,
                valid_until=now + timedelta(days=21),
                currency="USD",
                notes="Domestic express dispatch. Lifetime technical support."
            )
            # 3. EuroTech Supply (Germany) - Premium price, superior QC, moderate delivery
            q3 = SupplierQuotation(
                supplier_id=sup_eu.id,
                item_sku=item.sku,
                item_name=item.name,
                unit_price=round(item.unit_cost * 1.02, 2),
                min_order_quantity=25,
                max_order_quantity=3000,
                bulk_discount_pct=6.0,
                bulk_threshold=100,
                delivery_days=8,
                warranty_months=36,
                valid_until=now + timedelta(days=25),
                currency="USD",
                notes="TÜV Rheinland certified batches. Precision QA inspection."
            )
            db.add_all([q1, q2, q3])
        db.flush()

        # Find quotation for ELEC-005 from TechSource
        q_watch_china = db.query(SupplierQuotation).filter(
            SupplierQuotation.item_sku == "ELEC-005",
            SupplierQuotation.supplier_id == sup_china.id
        ).first()

        # Seed Completed AI Negotiation for ELEC-005
        print("Seeding demo AI negotiation scenario...")
        negotiation = Negotiation(
            merchant_id=demo_user.id,
            supplier_id=sup_china.id,
            quotation_id=q_watch_china.id,
            item_sku="ELEC-005",
            original_price=130.50,
            counter_price=118.00,
            final_price=122.50,
            quantity=150,
            ai_reasoning=(
                "Volume analysis: 150 units meets tier-2 bulk eligibility. "
                "Supplier historical margin tolerance is 6.8%. Initial quote of $130.50 "
                "was successfully negotiated down to $122.50/unit, saving $1,200 total (6.13% reduction) "
                "while preserving guaranteed 14-day expedited dispatch."
            ),
            ai_strategy="Volume leverage with expedited SLA lock-in",
            status=NegotiationStatus.ACCEPTED,
            rounds=2,
            messages=[
                {
                    "sender": "supplier",
                    "price": 130.50,
                    "message": "Quotation for 150x ELEC-005 Smart Watch Ultra at $130.50/unit. Standard lead time 14 days."
                },
                {
                    "sender": "ai_agent",
                    "price": 118.00,
                    "message": "SUPPLYMIND AI counteroffer: Based on volume of 150 units and verified payment history, we propose $118.00/unit with priority packing."
                },
                {
                    "sender": "supplier",
                    "price": 122.50,
                    "message": "We can meet at $122.50/unit for immediate sign-off and dispatch reservation."
                },
                {
                    "sender": "ai_agent",
                    "price": 122.50,
                    "message": "Terms accepted. Counter-price $122.50 approved for procurement execution."
                }
            ]
        )
        db.add(negotiation)
        db.flush()

        # Seed Pending Approval Order for Smart Watch Ultra
        print("Seeding urgent restock procurement order awaiting approval...")
        subtotal = round(150 * 122.50, 2)  # $18,375.00
        shipping = 350.00
        tax = round(subtotal * 0.05, 2)    # $918.75
        total = round(subtotal + shipping + tax, 2) # $19,643.75

        order = ProcurementOrder(
            order_number="PO-2024-00892",
            merchant_id=demo_user.id,
            supplier_id=sup_china.id,
            negotiation_id=negotiation.id,
            items=[
                {
                    "sku": "ELEC-005",
                    "name": "Smart Watch Ultra Titanium (GPS + Cellular)",
                    "quantity": 150,
                    "unit_price": 122.50,
                    "subtotal": subtotal,
                    "discount_applied": "6.13% volume concession via AI negotiation"
                }
            ],
            subtotal=subtotal,
            tax=tax,
            shipping=shipping,
            total_amount=total,
            currency="USD",
            status=OrderStatus.PENDING_APPROVAL,
            ai_recommendation=(
                "URGENT: Stockout state active. Daily loss rate is $2,931.60 in unfulfilled demand. "
                "TechSource Global negotiated rate ($122.50) is the optimal balance between unit economics "
                "and margin preservation. Merchant approval required to unlock PayPal sandbox checkout."
            ),
            ai_confidence_score=0.94,
            merchant_approved=False,
            expected_delivery=now + timedelta(days=14),
            notes="Expedited batch restock order. Priority freight lane reserved."
        )
        db.add(order)
        db.flush()

        # Seed initial audit log
        audit = AuditLog(
            order_id=order.id,
            user_id=demo_user.id,
            action="ORDER_GENERATED_BY_AI",
            entity_type="ProcurementOrder",
            entity_id=order.id,
            details={
                "sku": "ELEC-005",
                "quantity": 150,
                "amount": total,
                "confidence": 0.94,
                "reason": "Stockout emergency restock triggered by forecasting engine"
            },
            ip_address="127.0.0.1"
        )
        db.add(audit)

        db.commit()
        print("Database seeded successfully!")
        print("Demo Merchant Login:")
        print("  Email:    demo@supplymind.ai")
        print("  Password: Demo@2024!")
        print("  Company:  TechFlow Electronics Ltd")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

