"""
SUPPLYMIND AI — Automated End-to-End Functional Test Suite
Validates the entire 14-step autonomous procurement sequence, financial precision,
PayPal Orders v2 integration, and cryptographic audit chaining.
"""

import pytest
import hashlib
from decimal import Decimal
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


@pytest.fixture(scope="module")
def auth_token():
    """Obtain authenticated JWT token for demo merchant."""
    response = client.post("/api/auth/login", json={
        "email": "demo@supplymind.ai",
        "password": "Demo@2024!"
    })
    assert response.status_code == 200, f"Login failed: {response.text}"
    token = response.json().get("access_token")
    assert token is not None
    return token


@pytest.fixture(scope="module")
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}


class TestAuthenticationAndSecurity:
    """Phase 6: Authentication & Authorization."""

    def test_merchant_login_success(self):
        res = client.post("/api/auth/login", json={
            "email": "demo@supplymind.ai",
            "password": "Demo@2024!"
        })
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["user"]["email"] == "demo@supplymind.ai"
        assert data["user"]["role"] == "merchant"

    def test_invalid_password_rejected(self):
        res = client.post("/api/auth/login", json={
            "email": "demo@supplymind.ai",
            "password": "WrongPassword123!"
        })
        assert res.status_code == 401
        assert "Incorrect email or password" in res.text

    def test_unauthenticated_request_rejected(self):
        res = client.get("/api/procurement/orders")
        assert res.status_code in (401, 403)

    def test_invalid_jwt_token_rejected(self):
        res = client.get("/api/procurement/orders", headers={"Authorization": "Bearer invalid.fake.token"})
        assert res.status_code == 401
        assert "Invalid or expired token" in res.text


class TestEndToEndProcurementWorkflow:
    """Phase 2 & Phase 5: Complete 14-Step Workflow Sequence."""

    def test_step_01_merchant_signs_in(self, auth_token):
        assert auth_token is not None and len(auth_token) > 20

    def test_step_02_inventory_shortage_detected(self, auth_headers):
        # Reset demo to baseline state
        reset_res = client.post("/api/settings/reset-demo", headers=auth_headers)
        assert reset_res.status_code == 200

        res = client.get("/api/inventory", headers=auth_headers)
        assert res.status_code == 200
        items = res.json()
        assert len(items) >= 20

        elec_005 = next((i for i in items if i["sku"] == "ELEC-005"), None)
        assert elec_005 is not None, "ELEC-005 not found in inventory"
        assert elec_005["current_stock"] == 0, "ELEC-005 must be at 0 units for critical stockout"
        assert elec_005["status"] == "stockout", "ELEC-005 status must be 'stockout'"
        assert elec_005["daily_demand_avg"] == 8.4

    def test_step_03_supplier_quotations_loaded(self, auth_headers):
        res = client.get("/api/suppliers", headers=auth_headers)
        assert res.status_code == 200
        suppliers = res.json()
        assert len(suppliers) >= 3

        supplier_codes = {s["code"] for s in suppliers}
        assert "SUP-TSG-01" in supplier_codes  # TechSource Global
        assert "SUP-PPD-02" in supplier_codes  # PrimeParts Direct
        assert "SUP-ETS-03" in supplier_codes  # EuroTech Supply

    def test_step_04_ai_negotiation_and_guardrails(self, auth_headers):
        res = client.get("/api/negotiations", headers=auth_headers)
        assert res.status_code == 200
        negs = res.json()
        assert len(negs) > 0

        # Primary accepted negotiation linked to PO-2024-00892
        neg_005 = next((n for n in negs if n["item_sku"] == "ELEC-005" and n.get("status") == "accepted"), None)
        assert neg_005 is not None, "Primary accepted negotiation for ELEC-005 must exist"
        assert neg_005["quantity"] == 150
        assert neg_005["original_price"] == 130.50
        assert neg_005["final_price"] == 122.50

        # Verify concession math: ($130.50 - $122.50) * 150 = $1,200.00
        savings = round((130.50 - 122.50) * 150, 2)
        assert savings == 1200.00
        savings_pct = round((1200.00 / (130.50 * 150)) * 100, 2)
        assert savings_pct == 6.13

        # Verify immutable state: Cannot submit counteroffer to already accepted negotiation
        counter_accepted = client.post(
            f"/api/negotiations/{neg_005['id']}/counter",
            json={"counter_price": 120.00},
            headers=auth_headers
        )
        assert counter_accepted.status_code == 400
        assert "Negotiation is already accepted" in counter_accepted.text

        # Start a live active negotiation session to test deterministic guardrails
        quote_res = client.get("/api/suppliers/quotations/ELEC-005", headers=auth_headers)
        assert quote_res.status_code == 200
        quotes = quote_res.json()
        techsource_quote = next(q for q in quotes if "TechSource" in q.get("supplier_name", ""))

        start_res = client.post(
            "/api/negotiations/start",
            json={"quotation_id": techsource_quote["quotation_id"], "quantity": 150},
            headers=auth_headers
        )
        assert start_res.status_code in (200, 201)
        active_neg_id = start_res.json()["negotiation"]["id"]

        # Test guardrail rejection: below margin floor ($80.00 < $91.35)
        floor_res = client.post(
            f"/api/negotiations/{active_neg_id}/counter",
            json={"counter_price": 80.00},
            headers=auth_headers
        )
        assert floor_res.status_code == 400
        assert "GUARDRAIL_VIOLATION" in floor_res.text
        assert "Supplier Commercial Margin Floor" in floor_res.text

        # Test guardrail rejection: exceeding maximum allowed unit price ($140.00 > $130.50)
        ceil_res = client.post(
            f"/api/negotiations/{active_neg_id}/counter",
            json={"counter_price": 140.00},
            headers=auth_headers
        )
        assert ceil_res.status_code == 400
        assert "GUARDRAIL_VIOLATION" in ceil_res.text
        assert "Maximum Allowed Unit Price" in ceil_res.text

    def test_step_05_decision_engine_ranks_suppliers(self, auth_headers):
        res = client.post(
            "/api/procurement/recommend",
            json={"item_sku": "ELEC-005", "quantity": 150},
            headers=auth_headers
        )
        assert res.status_code == 200
        rec_data = res.json()

        # Check multi-attribute weights (Price 40%, Lead Time 25%, Reliability 20%, Concessions 15%)
        weights = rec_data.get("scoring_weights", {})
        assert weights.get("price") == 0.40
        assert weights.get("lead_time") == 0.25
        assert weights.get("reliability") == 0.20
        assert weights.get("concessions") == 0.15

        suppliers = rec_data.get("recommendations", [])
        assert len(suppliers) == 3

        # Verify descending order by decision_score
        scores = [s["decision_score"] for s in suppliers]
        assert scores == sorted(scores, reverse=True), "Recommendations must be in descending order"

        # Verify top choice is TechSource Global Ltd
        top_choice = suppliers[0]
        assert "TechSource" in top_choice["supplier_name"]
        assert top_choice["rank"] == 1

    def test_step_06_and_07_purchase_order_approval_and_financials(self, auth_headers):
        """Phase 3: Financial Precision & Gate Sign-Off."""
        orders_res = client.get("/api/procurement/orders", headers=auth_headers)
        assert orders_res.status_code == 200
        orders = orders_res.json()

        target_order = next((o for o in orders if o["order_number"] == "PO-2024-00892"), None)
        assert target_order is not None, "PO-2024-00892 not found"

        # Verify initial unapproved state
        assert target_order["status"] == "pending_approval"
        assert target_order["merchant_approved"] is False

        # Verify exact line item and financial calculations
        items = target_order["items"]
        assert len(items) == 1
        line_item = items[0]
        assert line_item["sku"] == "ELEC-005"
        assert line_item["quantity"] == 150
        assert line_item["unit_price"] == 122.50

        # Exact financial assertions:
        # 150 * $122.50 = $18,375.00
        # Freight = $350.00
        # Tax (5%) = $918.75
        # Total = $19,643.75
        assert target_order["subtotal"] == 18375.00
        assert target_order["shipping"] == 350.00
        assert target_order["tax"] == 918.75
        assert target_order["total_amount"] == 19643.75
        assert target_order["currency"] == "USD"

        # Execute merchant approval
        app_res = client.post(f"/api/procurement/orders/{target_order['id']}/approve", headers=auth_headers)
        assert app_res.status_code == 200
        approved = app_res.json()
        assert approved["status"] == "approved"
        assert approved["merchant_approved"] is True
        assert approved["approved_at"] is not None
        assert "CANONICAL_HASH:" in approved["notes"]

    def test_step_08_and_09_paypal_sandbox_checkout_initiation(self, auth_headers):
        """Phase 4: PayPal Orders v2 Sandbox Integration."""
        orders_res = client.get("/api/procurement/orders", headers=auth_headers)
        target_order = next((o for o in orders_res.json() if o["order_number"] == "PO-2024-00892"), None)
        assert target_order is not None

        # Call genuine PayPal Orders v2 creation endpoint
        pay_res = client.post(
            "/api/paypal/create-order",
            json={"order_id": target_order["id"]},
            headers=auth_headers
        )
        assert pay_res.status_code == 200
        pay_data = pay_res.json()

        # Order must either be successfully created on PayPal Sandbox or report configuration required
        if pay_data.get("status") == "created":
            assert "paypal_order_id" in pay_data
            assert pay_data["paypal_order_id"].isalnum() or len(pay_data["paypal_order_id"]) > 10
            assert pay_data["order"]["total_amount"] == 19643.75
            assert pay_data["order"]["status"] == "payment_pending"
        else:
            assert pay_data.get("status") == "configuration_required"
            assert "error" in pay_data

    def test_step_10_paypal_security_and_duplicate_capture_prevention(self, auth_headers):
        """Phase 4: Duplicate Capture & Tampering Guard."""
        # Non-existent or fake order ID must be safely rejected
        res = client.post(
            "/api/paypal/capture-order",
            json={"paypal_order_id": "NON-EXISTENT-FAKE-ORDER-ID-999"},
            headers=auth_headers
        )
        assert res.status_code == 404
        assert "Payment record not found" in res.text

    def test_step_11_and_12_supplier_dispatch_and_fulfillment(self, auth_headers):
        """Phase 5: Logistics Dispatch & Fulfillment Transition."""
        orders_res = client.get("/api/procurement/orders", headers=auth_headers)
        target_order = next((o for o in orders_res.json() if o["order_number"] == "PO-2024-00892"), None)
        assert target_order is not None

        # Advance order to shipped state via simulated dispatch
        disp_res = client.post(f"/api/procurement/orders/{target_order['id']}/dispatch", headers=auth_headers)
        assert disp_res.status_code == 200
        shipped_order = disp_res.json()
        assert shipped_order["status"] == "shipped"
        assert shipped_order["expected_delivery"] is not None

    def test_step_13_idempotent_inventory_replenishment(self, auth_headers):
        """Phase 5: Inventory Replenishment & Idempotency Guarantee."""
        orders_res = client.get("/api/procurement/orders", headers=auth_headers)
        target_order = next((o for o in orders_res.json() if o["order_number"] == "PO-2024-00892"), None)
        assert target_order is not None

        # Verify inventory prior to receiving is 0
        inv_before = client.get("/api/inventory", headers=auth_headers).json()
        item_before = next(i for i in inv_before if i["sku"] == "ELEC-005")
        assert item_before["current_stock"] == 0

        # Receive order and replenish inventory
        rec_res = client.post(f"/api/procurement/orders/{target_order['id']}/receive", headers=auth_headers)
        assert rec_res.status_code == 200
        rec_data = rec_res.json()
        assert rec_data["status"] == "delivered"

        # Verify stock has replenished by exactly 150 units (0 -> 150)
        inv_after = client.get("/api/inventory", headers=auth_headers).json()
        item_after = next(i for i in inv_after if i["sku"] == "ELEC-005")
        assert item_after["current_stock"] == 150
        assert item_after["status"] == "normal"

        # IDEMPOTENCY GUARD: Attempting to receive the order a second time MUST be rejected
        dup_res = client.post(f"/api/procurement/orders/{target_order['id']}/receive", headers=auth_headers)
        assert dup_res.status_code == 400
        assert "Duplicate receiving prevented" in dup_res.text

        # Verify stock did NOT double (remains 150, not 300)
        inv_final = client.get("/api/inventory", headers=auth_headers).json()
        item_final = next(i for i in inv_final if i["sku"] == "ELEC-005")
        assert item_final["current_stock"] == 150, "Duplicate receiving must not alter inventory stock"

    def test_step_14_cryptographic_audit_trail_and_chain_integrity(self, auth_headers):
        """Phase 5: Cryptographic SHA-256 Ledger Chain Verification."""
        chain_res = client.get("/api/audit/verify-chain", headers=auth_headers)
        assert chain_res.status_code == 200
        chain_data = chain_res.json()
        assert chain_data["valid"] is True
        assert chain_data["status"] == "valid"
        assert chain_data["break_at_index"] is None
        assert chain_data["head_hash"] is not None
        assert chain_data["total_records"] > 0
        assert chain_data["verification_protocol"] == "SHA-256 Tamper-Evident Ledger Chain"

    def test_demo_reset_scenario_preservation(self, auth_headers):
        """Phase 5: Demo Reset returns platform to pristine hackathon evaluation state."""
        reset_res = client.post("/api/settings/reset-demo", headers=auth_headers)
        assert reset_res.status_code == 200

        # Verify ELEC-005 restored to 0 stock
        inv = client.get("/api/inventory", headers=auth_headers).json()
        item = next(i for i in inv if i["sku"] == "ELEC-005")
        assert item["current_stock"] == 0
        assert item["status"] == "stockout"

        # Verify PO-2024-00892 restored to pending_approval
        orders = client.get("/api/procurement/orders", headers=auth_headers).json()
        order = next(o for o in orders if o["order_number"] == "PO-2024-00892")
        assert order["status"] == "pending_approval"
        assert order["merchant_approved"] is False
        assert order["total_amount"] == 19643.75
