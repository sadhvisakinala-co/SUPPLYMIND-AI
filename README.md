# SUPPLYMIND AI — Autonomous Supply Chain Intelligence & PayPal-Powered Procurement

> **Tagline:** Predict shortages. Negotiate intelligently. Purchase securely.  
> **Design System:** Graphite & Electric Teal (`#101719`, `#162326`, `#213236`, `#26B7A3`, `#6E9293`, `#EBF4F3`, `#A5B8B8`)  
> **Typography:** Manrope (Interface), Sora (Display & Hero Titles), IBM Plex Mono (Technical, Metrics & IDs)

---

## 💎 Product Architecture & Features

### 1. Landing Page (`/`)
- **Sticky Translucent Navbar**: Logo with animated teal indicator, Product, How It Works, AI Intelligence, Security, About, Sign In, and Get Started.
- **Cinematic Hero**:
  - Hero text (~45% width): Heading *"Procurement Intelligence That Moves Before Shortages Happen"* (`clamp()` 64–88px on desktop).
  - Interactive 3D scene (~55% width): Three.js futuristic logistics facility with architectural warehouse geometry, metallic graphite bays, glass atrium roof, teal illuminated logistics conduits, and autonomous moving AGV cargo pods with controlled mouse parallax.
  - Telemetry HUD with real-time indicators.
- **Business Problem Section**: Quantifies the $1.9T annual global stockout loss and 8.4-day manual email bidding delays.
- **7-Step Animated Workflow**: Predict → Source → Negotiate → Optimize → Approve → Pay → Track.
- **Scenario Demonstration**: Live restock scenario for **ELEC-005 Smart Watch Ultra** with 3 global accredited suppliers.
- **AI Negotiation Workspace & Transcript**: Bounded dialogue simulation with gross margin floors.
- **Fintech Security Architecture**: Server-side PayPal Orders v2 sandbox token exchange, cryptographic idempotency keys, and zero browser secret exposure.

### 2. Authentication (`/auth/signin`, `/auth/signup`)
- **Desktop Split-Screen**: Left 55% cinematic animated logistics environment, Right 45% clean form.
- **Session Persistence**: JWT Bearer tokens with auto-login on refresh and secure sign-out.
- **Demo Account Button**: 1-click **"Fill Credentials"** button for Alex Chen (`demo@supplymind.ai` / `Demo@2024!`).

### 3. All 9 Merchant Dashboard Modules (`/dashboard/*`)
1. **Overview Dashboard** (`/dashboard/overview`):
   - Real-time KPIs: Monitored SKUs (20), Inventory Value, Critical Stockouts (1), AI Margin Savings ($4,850).
   - Urgent Action Hero Banner: ELEC-005 stockout with 1-click review & approve.
   - At-risk inventory monitoring.
2. **Inventory Intelligence & Demand Forecasting** (`/dashboard/inventory`):
   - 20 synthetic electronics SKUs (ELEC-001 through ELEC-020).
   - Searchable table, category filters, days until stockout, safety stock, and Wilson EOQ recommendation.
   - Detail panel with statistical forecasting assumptions (daily mean demand, standard deviation, lead time).
3. **Suppliers & Quotations Matrix** (`/dashboard/suppliers`):
   - 3 Global Suppliers: TechSource Global (China), PrimeParts Direct (USA), EuroTech Supply (Germany).
   - Side-by-side quotation comparison for any SKU and customizable order quantities.
4. **AI Supplier Negotiation** (`/dashboard/negotiations`):
   - **3-Column Architecture**:
     - *Left*: Request & product details with active sessions list.
     - *Center*: AI conversation, bounded counteroffers, and live transcript.
     - *Right*: Supplier commitments, delivery SLA, margin delta, and total batch savings.
5. **Procurement Decision Engine** (`/dashboard/procurement`):
   - Multi-attribute deterministic scoring: Price (40%), Delivery Time (25%), Supplier Reliability (20%), Bulk Discount (15%).
   - Ranked suppliers with detailed composite score breakdowns.
6. **Purchase Approval Gate** (`/dashboard/approval`):
   - Mandatory human-in-the-loop authorization.
   - Financial breakdown: Subtotal, Shipping, Tax, Total.
   - "Approve Purchase Order" unlocks PayPal checkout.
7. **PayPal Orders v2 Sandbox Checkout** (`/dashboard/checkout`):
   - Server-side order creation (`/api/payments/create`), idempotency keys, and capture (`/api/payments/capture/{id}`).
   - Dedicated Success (`/dashboard/checkout/success`) and Cancel (`/dashboard/checkout/cancel`) states.
8. **Orders & Tracking / Cryptographic Audit Trail** (`/dashboard/tracking`):
   - 5-step visual shipment progress from Hong Kong to SFO.
   - Immutable audit logs with timestamp, action identifier, entity ref, and security verification.
9. **Settings & Guardrails** (`/dashboard/settings`):
   - Spend thresholds, gross margin floors, max lead times, and PayPal Sandbox configuration.
   - **Reset Demo Scenario button**: Restores ELEC-005 stockout and re-arms PO-2024-00892 in the Approval Gate.

---

## 🚀 Running the Platform

### Backend (FastAPI + Python 3.9+)
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
- API Health Check: `http://localhost:8000/api/health`
- Interactive OpenAPI Docs: `http://localhost:8000/api/docs`

### Frontend (Next.js 14 + React 18 + Three.js)
```bash
cd frontend
npm run start -- -p 3000
```
- Access Frontend: `http://localhost:3000`

### Demo Credentials
- **Email**: `demo@supplymind.ai`
- **Password**: `Demo@2024!`
- **Merchant**: Alex Chen, TechFlow Electronics Ltd
# SUPPLYMIND-AI
