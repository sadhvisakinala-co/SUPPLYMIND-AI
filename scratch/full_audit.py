"""
SUPPLYMIND AI — Comprehensive 5-Expert Hackathon Audit Script
Gathers empirical test data across all subsystems without modifying any codebase files.
"""

import os
import sys
import json
import time
import urllib.request
import urllib.error

BASE_BACKEND = "http://localhost:8000"
BASE_FRONTEND = "http://localhost:3000"

def req(url, method="GET", body=None, headers=None):
    if headers is None:
        headers = {}
    data = None
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req_obj = urllib.request.Request(url, data=data, headers=headers, method=method)
    t0 = time.time()
    try:
        with urllib.request.urlopen(req_obj, timeout=10) as resp:
            elapsed = (time.time() - t0) * 1000
            code = resp.getcode()
            body_bytes = resp.read()
            try:
                parsed = json.loads(body_bytes.decode("utf-8"))
            except Exception:
                parsed = body_bytes.decode("utf-8")
            return code, parsed, elapsed
    except urllib.error.HTTPError as e:
        elapsed = (time.time() - t0) * 1000
        err_bytes = e.read()
        try:
            parsed = json.loads(err_bytes.decode("utf-8"))
        except Exception:
            parsed = err_bytes.decode("utf-8")
        return e.code, parsed, elapsed
    except Exception as e:
        elapsed = (time.time() - t0) * 1000
        return 0, str(e), elapsed

def audit():
    audit_data = {}

    # 1. Health & Ping
    code, data, lat = req(f"{BASE_BACKEND}/api/health")
    audit_data["health"] = {"code": code, "data": data, "latency_ms": round(lat, 2)}

    # 2. Auth & Login
    code, auth_data, lat = req(f"{BASE_BACKEND}/api/auth/login", method="POST", body={
        "email": "demo@supplymind.ai",
        "password": "Demo@2024!"
    })
    token = auth_data.get("access_token") if code == 200 else None
    audit_data["auth"] = {"code": code, "user": auth_data.get("user") if code == 200 else None, "latency_ms": round(lat, 2)}

    if not token:
        print("Auth failed, cannot proceed with authorized audit.")
        return audit_data

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Inventory Inspection
    code, items, lat = req(f"{BASE_BACKEND}/api/inventory", headers=headers)
    audit_data["inventory"] = {
        "code": code,
        "count": len(items) if isinstance(items, list) else 0,
        "first_item": items[0] if isinstance(items, list) and items else None,
        "latency_ms": round(lat, 2)
    }

    # 4. Inventory Calculation for ELEC-005
    code, calc, lat = req(f"{BASE_BACKEND}/api/forecasting/calculations/ELEC-005", headers=headers)
    audit_data["calculation_elec005"] = {"code": code, "calc": calc, "latency_ms": round(lat, 2)}

    # 5. Suppliers & Quotations for ELEC-005
    code, quotes, lat = req(f"{BASE_BACKEND}/api/suppliers/quotations/ELEC-005", headers=headers)
    audit_data["quotations_elec005"] = {
        "code": code,
        "count": len(quotes) if isinstance(quotes, list) else 0,
        "suppliers": [q.get("supplier_name") for q in quotes] if isinstance(quotes, list) else [],
        "latency_ms": round(lat, 2)
    }

    # 6. Procurement Recommendation (Weighted Engine)
    code, rec, lat = req(f"{BASE_BACKEND}/api/procurement/recommend", method="POST", body={"item_sku": "ELEC-005", "quantity": 150}, headers=headers)
    audit_data["decision_engine"] = {
        "code": code,
        "best_choice": rec.get("best_choice") if isinstance(rec, dict) else None,
        "scoring_weights": rec.get("scoring_weights") if isinstance(rec, dict) else None,
        "ranked": rec.get("recommendations") if isinstance(rec, dict) else None,
        "latency_ms": round(lat, 2)
    }

    # 7. AI Negotiation & Active Guardrails
    code, llm_status, lat = req(f"{BASE_BACKEND}/api/negotiations/status/llm", headers=headers)
    audit_data["llm_status"] = {"code": code, "data": llm_status, "latency_ms": round(lat, 2)}

    code, guardrails, lat = req(f"{BASE_BACKEND}/api/negotiations/1/guardrails", headers=headers)
    audit_data["guardrails_policy"] = {"code": code, "data": guardrails, "latency_ms": round(lat, 2)}

    # 8. Guardrail Enforcement Test (Out of bounds offer)
    code, rej_res, lat = req(f"{BASE_BACKEND}/api/negotiations/5/counter", method="POST", body={"counter_price": 5.00}, headers=headers)
    audit_data["guardrail_rejection_test"] = {"code": code, "response": rej_res, "latency_ms": round(lat, 2)}

    # 9. Procurement Orders (PO-2024-00892)
    code, orders, lat = req(f"{BASE_BACKEND}/api/procurement/orders", headers=headers)
    elec_order = next((o for o in orders if o.get("order_number") == "PO-2024-00892"), orders[0] if orders else None)
    audit_data["order_po892"] = {"code": code, "order": elec_order, "latency_ms": round(lat, 2)}

    # 10. PayPal Sandbox Configuration
    code, paypal_status, lat = req(f"{BASE_BACKEND}/api/paypal/status", headers=headers)
    code_create, paypal_create, lat_create = req(f"{BASE_BACKEND}/api/paypal/create-order", method="POST", body={"order_id": elec_order["id"]}, headers=headers)
    audit_data["paypal_integration"] = {
        "status_endpoint": paypal_status,
        "create_order_endpoint": paypal_create,
        "latency_ms": round(lat, 2)
    }

    # 11. Duplicate Capture Prevention Test
    code_dup, dup_res, lat_dup = req(f"{BASE_BACKEND}/api/paypal/capture-order", method="POST", body={"paypal_order_id": "TEST_INVALID_ORDER_ID"}, headers=headers)
    audit_data["duplicate_capture_test"] = {"code": code_dup, "response": dup_res, "latency_ms": round(lat_dup, 2)}

    # 12. Audit Trail & Hash Chain Verification
    code, chain_verify, lat = req(f"{BASE_BACKEND}/api/audit/verify-chain", headers=headers)
    code_logs, audit_logs, lat_logs = req(f"{BASE_BACKEND}/api/audit/logs?per_page=10", headers=headers)
    audit_data["audit_trail"] = {
        "chain_verification": chain_verify,
        "logs_sample_count": len(audit_logs.get("logs", [])) if isinstance(audit_logs, dict) else 0,
        "latency_ms": round(lat, 2)
    }

    # 13. Frontend Routes Latency & Availability
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
    fe_results = {}
    for r in frontend_routes:
        c, _, l = req(f"{BASE_FRONTEND}{r}")
        fe_results[r] = {"code": c, "latency_ms": round(l, 2)}
    audit_data["frontend_routes"] = fe_results

    # Print summary JSON
    print(json.dumps(audit_data, indent=2))

if __name__ == "__main__":
    audit()

