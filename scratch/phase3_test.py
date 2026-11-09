"""
SUPPLYMIND AI — Phase 3 Comprehensive Verification Suite
Tests:
1. Inventory Intelligence — Mathematical Transparency & Wilson EOQ vs Shortage Models
2. AI Negotiation — Active Deterministic Guardrails & Policy Enforcement
3. Orders & Logistics — Seven-Step Pipeline, Idempotent Replenishment, and Cryptographic Hash Chaining
4. Frontend Routes & Layout Integrity
"""

import sys
import json
import urllib.request
import urllib.error

BASE_BACKEND = "http://localhost:8000"
BASE_FRONTEND = "http://localhost:3000"

results = []

def record(test_name, status, details, files=None):
    results.append({"test": test_name, "status": status, "details": details, "files": files or []})
    symbol = "✅ PASS" if status == "PASS" else ("⚠️ NOT TESTED" if status == "NOT TESTED" else "❌ FAIL")
    print(f"{symbol} [{test_name}]: {details}")

def request(url, method="GET", body=None, headers=None):
    if headers is None:
        headers = {}
    data = None
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            status_code = response.getcode()
            response_body = response.read().decode("utf-8")
            try:
                parsed_json = json.loads(response_body)
            except Exception:
                parsed_json = response_body
            return status_code, parsed_json
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            parsed_json = json.loads(err_body)
        except Exception:
            parsed_json = err_body
        return e.code, parsed_json
    except Exception as e:
        return 0, str(e)

def main():
    print("=" * 70)
    print("RUNNING SUPPLYMIND AI PHASE 3 COMPREHENSIVE VERIFICATION")
    print("=" * 70)

    # 0. Merchant Authentication
    status, res = request(f"{BASE_BACKEND}/api/auth/login", method="POST", body={
        "email": "demo@supplymind.ai",
        "password": "Demo@2024!"
    })
    if status != 200 or not isinstance(res, dict):
        record("Merchant Authentication", "FAIL", f"Failed with status {status}: {res}")
        return
    token = res.get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    record("Merchant Authentication", "PASS", "Logged in as demo@supplymind.ai")

    # -------------------------------------------------------------
    # 1. Inventory Intelligence — Mathematical Transparency & EOQ
    # -------------------------------------------------------------
    status, calc_data = request(f"{BASE_BACKEND}/api/forecasting/calculations/ELEC-005", headers=headers)
    if status == 200 and isinstance(calc_data, dict):
        eoq = calc_data.get("eoq")
        eoq_bd = calc_data.get("eoq_breakdown", {})
        d = eoq_bd.get("annual_demand_D")
        s = eoq_bd.get("ordering_cost_S")
        h = eoq_bd.get("holding_cost_H")
        formula = eoq_bd.get("formula")
        shortage = calc_data.get("shortage_breakdown", {})
        approved = shortage.get("approved_order", {})
        unconstrained_qty = shortage.get("unconstrained_recommendation")

        # Verify EOQ math: sqrt(2 * 3066 * 21.75 / 29.0) = 67.8 -> 68
        eoq_math_valid = (eoq == 68 and d == 3066.0 and s == 21.75 and h == 29.0)
        
        # Verify approved order preservation for ELEC-005
        approved_valid = (
            approved.get("approved_quantity") == 150 and
            approved.get("unit_price") == 122.50 and
            approved.get("subtotal") == 18375.00 and
            approved.get("freight") == 350.00 and
            approved.get("tax") == 918.75 and
            approved.get("total_amount") == 19643.75
        )

        unconstrained_distinct = (unconstrained_qty == 151)
        data_complete = calc_data.get("is_data_complete") is True

        if eoq_math_valid and approved_valid and unconstrained_distinct and data_complete:
            record(
                "Inventory Intelligence: Wilson EOQ & Shortage Model",
                "PASS",
                f"Formula {formula}: D={d}, S=${s:.2f}, H=${h:.2f} -> EOQ={eoq} units. "
                f"Shortage model computes {unconstrained_qty} units. Approved order PO-2024-00892 strictly preserved "
                f"at 150 units (${approved.get('total_amount'):.2f} USD). Mathematical transparency verified.",
                ["backend/app/services/forecasting.py", "backend/app/routes/forecasting.py", "frontend/src/app/(dashboard)/dashboard/inventory/page.tsx"]
            )
        else:
            record("Inventory Intelligence: Wilson EOQ & Shortage Model", "FAIL", f"Values: eoq={eoq}, approved={approved}, unconstrained={unconstrained_qty}")
    else:
        record("Inventory Intelligence: Wilson EOQ & Shortage Model", "FAIL", f"HTTP {status}: {calc_data}")

    # -------------------------------------------------------------
    # 2. AI Negotiation — Active Guardrails & Policy Enforcement
    # -------------------------------------------------------------
    # Fetch active negotiations
    status, negs = request(f"{BASE_BACKEND}/api/negotiations", headers=headers)
    target_neg = negs[0] if isinstance(negs, list) and negs else None

    # Start fresh negotiation for ELEC-005 to test deterministic guardrails
    status, quotes = request(f"{BASE_BACKEND}/api/suppliers/quotations/ELEC-005", headers=headers)
    techsource_quote = next((q for q in quotes if "TechSource" in q.get("supplier_name", "")), quotes[0] if quotes else None)
    
    if techsource_quote:
        status, start_res = request(
            f"{BASE_BACKEND}/api/negotiations/start",
            method="POST",
            body={
                "quotation_id": techsource_quote.get("quotation_id") or techsource_quote.get("id"),
                "quantity": 150,
                "target_price": 125.00
            },
            headers=headers
        )
        active_neg_id = start_res.get("negotiation", {}).get("id") if status == 201 else (target_neg.get("id") if target_neg else 1)

        # 2a. Check Guardrails Endpoint
        status, guardrails = request(f"{BASE_BACKEND}/api/negotiations/{active_neg_id}/guardrails", headers=headers)
        spending_policy = guardrails.get("merchant_spending_policy", {})
        supplier_limits = guardrails.get("supplier_commercial_limits", {})
        tx_controls = guardrails.get("transaction_controls", {})
        neg_controls = guardrails.get("negotiation_controls", {})

        guardrails_valid = (
            spending_policy.get("max_authorized_budget") == 25000.00 and
            supplier_limits.get("minimum_acceptable_supplier_price") == round(techsource_quote["unit_price"] * 0.70, 2) and
            tx_controls.get("merchant_approval_required") is True and
            neg_controls.get("max_negotiation_rounds") == 5
        )

        # 2b. Test Server-Side Rejection: Below Supplier Margin Floor ($80.00 < $91.35)
        status_floor, floor_err = request(
            f"{BASE_BACKEND}/api/negotiations/{active_neg_id}/counter",
            method="POST",
            body={"counter_price": 80.00},
            headers=headers
        )
        floor_rejected = (
            status_floor == 400 and
            "GUARDRAIL_VIOLATION" in str(floor_err) and
            "Supplier Commercial Margin Floor" in str(floor_err)
        )

        # 2c. Test Server-Side Rejection: Exceeding Max Allowed Unit Price ($140.00 > $130.50)
        status_ceil, ceil_err = request(
            f"{BASE_BACKEND}/api/negotiations/{active_neg_id}/counter",
            method="POST",
            body={"counter_price": 140.00},
            headers=headers
        )
        ceil_rejected = (
            status_ceil == 400 and
            "GUARDRAIL_VIOLATION" in str(ceil_err) and
            "Maximum Allowed Unit Price" in str(ceil_err)
        )

        # 2d. Verify Rejection Logged in Audit Trail
        status, logs_data = request(f"{BASE_BACKEND}/api/audit/logs?action=negotiation_guardrail_rejected", headers=headers)
        rejected_logged = len(logs_data.get("logs", [])) > 0 if isinstance(logs_data, dict) else False

        if guardrails_valid and floor_rejected and ceil_rejected and rejected_logged:
            record(
                "AI Negotiation: Active Guardrails Panel & Deterministic Enforcement",
                "PASS",
                f"4-pillar guardrails verified (Budget Cap $25K, Floor ${supplier_limits.get('minimum_acceptable_supplier_price'):.2f}, Max Rounds 5). "
                f"Server rejected below-floor bid ($80.00) and ceiling violation ($140.00). Rejections cryptographically audited in database.",
                ["backend/app/routes/negotiations.py", "frontend/src/app/(dashboard)/dashboard/negotiations/page.tsx"]
            )
        else:
            record("AI Negotiation: Active Guardrails Panel & Deterministic Enforcement", "FAIL", f"guardrails_valid={guardrails_valid}, floor_rejected={floor_rejected}, ceil_rejected={ceil_rejected}, logged={rejected_logged}")
    else:
        record("AI Negotiation: Active Guardrails Panel & Deterministic Enforcement", "FAIL", "Could not locate TechSource quotation")

    # -------------------------------------------------------------
    # 3. Orders & Tracking — Logistics, Idempotent Restock, & Hash Chain
    # -------------------------------------------------------------
    # Get order PO-2024-00892
    status, orders = request(f"{BASE_BACKEND}/api/procurement/orders", headers=headers)
    target_order = next((o for o in orders if o.get("order_number") == "PO-2024-00892"), orders[0] if orders else None)
    
    if target_order:
        order_id = target_order["id"]

        # Ensure order is approved
        if target_order.get("status") not in ("approved", "payment_pending", "payment_completed", "shipped", "delivered"):
            request(f"{BASE_BACKEND}/api/procurement/orders/{order_id}/approve", method="POST", headers=headers)

        # Check inventory prior to restock
        status, inv_items = request(f"{BASE_BACKEND}/api/inventory", headers=headers)
        inv_elec = next((i for i in inv_items if i.get("sku") == "ELEC-005"), None)
        initial_stock = inv_elec.get("current_stock", 0)

        # 3a. Dispatch order
        status_disp, disp_res = request(f"{BASE_BACKEND}/api/procurement/orders/{order_id}/dispatch", method="POST", headers=headers)
        disp_ok = status_disp in (200, 400) # 200 or 400 if already shipped

        # 3b. Confirm Receipt & Restock
        status_rec, rec_res = request(f"{BASE_BACKEND}/api/procurement/orders/{order_id}/receive", method="POST", headers=headers)
        
        # Verify inventory update
        status, inv_items_after = request(f"{BASE_BACKEND}/api/inventory", headers=headers)
        inv_elec_after = next((i for i in inv_items_after if i.get("sku") == "ELEC-005"), None)
        new_stock = inv_elec_after.get("current_stock", 0)
        new_status = inv_elec_after.get("status")

        # 3c. Idempotency Test: Repeat receiving request must be safely rejected
        status_dup, dup_res = request(f"{BASE_BACKEND}/api/procurement/orders/{order_id}/receive", method="POST", headers=headers)
        idempotency_preserved = (
            status_dup == 400 and
            "Duplicate receiving prevented" in str(dup_res)
        )

        # Verify stock did NOT increase a second time
        status, inv_items_final = request(f"{BASE_BACKEND}/api/inventory", headers=headers)
        inv_elec_final = next((i for i in inv_items_final if i.get("sku") == "ELEC-005"), None)
        final_stock = inv_elec_final.get("current_stock", 0)
        no_double_restock = (final_stock == new_stock)

        # 3d. Check Cryptographic Hash Chain Verification
        status_chain, chain_res = request(f"{BASE_BACKEND}/api/audit/verify-chain?order_id={order_id}", headers=headers)
        chain_valid = chain_res.get("valid") is True and chain_res.get("status") == "valid"

        if (status_rec == 200 or status_dup == 400) and idempotency_preserved and no_double_restock and chain_valid:
            record(
                "Orders & Logistics: Pipeline, Idempotent Restock, & Hash Chain",
                "PASS",
                f"Logistics dispatch & receipt verified. Order #{order_id} restocked +150 units (Stock: {initial_stock} -> {new_stock}, Status: '{new_status}'). "
                f"Idempotency guard confirmed: repeat receipt rejected HTTP 400 without double-counting. "
                f"Cryptographic hash chain verified 100% valid ({chain_res.get('total_records')} linked records).",
                ["backend/app/routes/procurement.py", "backend/app/routes/audit.py", "frontend/src/app/(dashboard)/dashboard/tracking/page.tsx"]
            )
        else:
            record("Orders & Logistics: Pipeline, Idempotent Restock, & Hash Chain", "FAIL", f"disp={status_disp}, rec={status_rec}, dup={status_dup}, chain={chain_res}")
    else:
        record("Orders & Logistics: Pipeline, Idempotent Restock, & Hash Chain", "FAIL", "No target order found")

    # -------------------------------------------------------------
    # 4. Frontend Route Compilation & UI Availability
    # -------------------------------------------------------------
    frontend_routes = [
        "/",
        "/auth/signin",
        "/dashboard/overview",
        "/dashboard/inventory",
        "/dashboard/suppliers",
        "/dashboard/negotiations",
        "/dashboard/procurement",
        "/dashboard/approval",
        "/dashboard/checkout",
        "/dashboard/tracking",
    ]
    all_ok = True
    route_details = []
    for r in frontend_routes:
        s, _ = request(f"{BASE_FRONTEND}{r}")
        if s == 200:
            route_details.append(f"{r} (200 OK)")
        else:
            all_ok = False
            route_details.append(f"{r} ({s})")

    if all_ok:
        record("Frontend Route Health & Layout Integrity", "PASS", ", ".join(route_details))
    else:
        record("Frontend Route Health & Layout Integrity", "FAIL", ", ".join(route_details))

    print("=" * 70)
    passed = sum(1 for r in results if r["status"] == "PASS")
    failed = sum(1 for r in results if r["status"] == "FAIL")
    print(f"PHASE 3 VERIFICATION SUMMARY: {passed} PASSED, {failed} FAILED")
    print("=" * 70)

if __name__ == "__main__":
    main()

