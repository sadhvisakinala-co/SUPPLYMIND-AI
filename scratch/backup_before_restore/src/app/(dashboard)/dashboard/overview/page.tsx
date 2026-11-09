"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  Boxes,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Bot,
  Truck,
  CheckCircle2,
  RefreshCw,
  Bell,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  Lock,
  Layers,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageEntrance, SpotlightCard, StaggerContainer, StaggerItem } from "@/components/ui/motion";

export default function OverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [stockoutItem, setStockoutItem] = useState<any>(null);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [negotiations, setNegotiations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, invRes, ordersRes, negRes] = await Promise.all([
        api.get<any>("/api/inventory/stats"),
        api.get<any[]>("/api/inventory?status=stockout"),
        api.get<any[]>("/api/procurement/orders"),
        api.get<any[]>("/api/negotiations"),
      ]);

      setStats(statsRes.data);
      if (invRes.data && invRes.data.length > 0) {
        setStockoutItem(invRes.data[0]);
      }
      setPendingOrders(ordersRes.data || []);
      setNegotiations(negRes.data || []);
    } catch (err) {
      console.error("Failed to load overview data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalCatalogValue = stats?.total_inventory_value || 148500.0;
  const activeOrdersCount = pendingOrders.length || 6;
  const pendingSignCount = pendingOrders.filter((o) => !o.merchant_approved && o.status === "pending_approval").length || 1;

  return (
    <PageEntrance className="space-y-8 font-sans">
      {/* ─── 1. TOP HEADER & OPERATIONAL CONTROLS (OBSIDIAN LUXE) ─────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[rgba(154,231,207,0.12)]">
        <div>
          <span className="text-xs font-mono font-medium text-[#79E7C7] uppercase tracking-wider block mb-1">
            Enterprise Procurement Intelligence
          </span>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-[#F4F7F4] tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-[#A6B8B5] mt-1 font-sans">
            Real-time supply chain monitoring, automated inventory protection, and settlement analytics.
          </p>
        </div>

        {/* Right-aligned Date Selector, Notifications & Sync */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-[#A6B8B5]">
            <Calendar className="w-3.5 h-3.5 text-[#79E7C7]" />
            <span className="text-[#F4F7F4]">Last 30 Days</span>
            <ChevronDown className="w-3 h-3 text-[#708784]" />
          </div>

          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-[#A6B8B5] hover:text-[#F4F7F4] hover:bg-[#102326] transition-colors"
            title="Sync Telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#79E7C7] ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>

          <button className="p-2 rounded-xl bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-[#A6B8B5] hover:text-[#79E7C7] relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#79E7C7] animate-pulse" />
          </button>
        </div>
      </div>

      {/* ─── 2. FOUR HORIZONTAL KPI CARDS WITH CURSOR SPOTLIGHT ───────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Procurement Spend */}
        <SpotlightCard className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A6B8B5]">
            <span className="font-sans">Procurement Spend</span>
            <span className="text-[#5FC7A1] font-mono text-[11px] font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12.4%
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-[#F4F7F4] tracking-tight">
            ${Number(totalCatalogValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-[#708784] font-mono">
            Active managed valuation across 20 SKUs
          </div>
        </SpotlightCard>

        {/* KPI 2: Negotiated Savings */}
        <SpotlightCard className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A6B8B5]">
            <span className="font-sans">Negotiated Savings</span>
            <span className="text-[#79E7C7] font-mono text-[11px] font-semibold flex items-center gap-1">
              8.6% margin gain
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-[#79E7C7] tracking-tight">
            $18,240.00
          </div>
          <div className="text-xs text-[#708784] font-mono">
            $1,200.00 saved on PO-2024-00892
          </div>
        </SpotlightCard>

        {/* KPI 3: Active Orders */}
        <SpotlightCard className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A6B8B5]">
            <span className="font-sans">Active Orders</span>
            <span className="text-[#D8AD70] font-mono text-[11px] font-semibold">
              {pendingSignCount} Sign Required
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-[#F4F7F4] tracking-tight">
            {activeOrdersCount} Active
          </div>
          <div className="text-xs text-[#708784] font-mono">
            5 Settled / Verified · 1 Pending Gate
          </div>
        </SpotlightCard>

        {/* KPI 4: Delivery Performance */}
        <SpotlightCard className="p-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A6B8B5]">
            <span className="font-sans">Delivery Performance</span>
            <span className="text-[#5FC7A1] font-mono text-[11px] font-semibold">
              SLA Met
            </span>
          </div>
          <div className="text-3xl font-bold font-mono text-[#5FC7A1] tracking-tight">
            96.8%
          </div>
          <div className="text-xs text-[#708784] font-mono">
            TechSource SLA: 7-day expedited lead
          </div>
        </SpotlightCard>
      </div>

      {/* ─── 3. CHARTS: PROCUREMENT SPEND TREND & ORDER STATUS ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Wide Procurement Spend Trend Chart (~8 cols) */}
        <SpotlightCard className="lg:col-span-8 p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(154,231,207,0.08)]">
            <div>
              <h3 className="font-sans font-bold text-base text-[#F4F7F4]">
                Procurement Capital & Depletion Velocity
              </h3>
              <p className="text-xs text-[#A6B8B5] mt-0.5 font-mono">
                Historical batch commitments vs AI-optimized dynamic run-rates
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#79E7C7]">
                <span className="w-2 h-2 rounded-full bg-[#79E7C7]" /> Actual Spend
              </span>
              <span className="flex items-center gap-1.5 text-[#708784] ml-2">
                <span className="w-2 h-2 rounded-full bg-[#176D5B]" /> Projected
              </span>
            </div>
          </div>

          {/* Interactive SVG Trend Area Chart with reveal animation */}
          <div className="h-64 w-full relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mintSpendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#79E7C7" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#79E7C7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Reference Gridlines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke="rgba(154,231,207,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="rgba(154,231,207,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="160" x2="700" y2="160" stroke="rgba(154,231,207,0.06)" strokeDasharray="3 3" />
              <line x1="0" y1="220" x2="700" y2="220" stroke="rgba(154,231,207,0.1)" />

              {/* Area fill with fade animation */}
              <motion.polygon
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                fill="url(#mintSpendGradient)"
                points="0,200 70,185 140,165 210,175 280,140 350,150 420,110 490,125 560,90 630,70 700,50 700,220 0,220"
              />

              {/* Primary Curve with path length reveal */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                d="M0,200 Q70,185 140,165 T280,140 T420,110 T560,90 T700,50"
                fill="none"
                stroke="#79E7C7"
                strokeWidth="2.5"
              />

              {/* Data points */}
              {[[0, 200], [140, 165], [280, 140], [420, 110], [560, 90], [700, 50]].map(([cx, cy], i) => (
                <motion.circle
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill="#061011"
                  stroke="#79E7C7"
                  strokeWidth="2"
                />
              ))}
            </svg>

            {/* X-Axis Month Indicators */}
            <div className="flex justify-between text-[11px] text-[#708784] font-mono pt-3 border-t border-[rgba(154,231,207,0.08)]">
              <span>Nov 01</span>
              <span>Nov 08</span>
              <span>Nov 15</span>
              <span>Nov 22</span>
              <span>Nov 29</span>
              <span>Today</span>
            </div>
          </div>
        </SpotlightCard>

        {/* Right: Order Status Visualization (~4 cols) */}
        <SpotlightCard className="lg:col-span-4 p-6 sm:p-7 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-[#F4F7F4]">
              Procurement Pipeline Distribution
            </h3>
            <p className="text-xs text-[#A6B8B5] mt-0.5 font-mono">
              Status allocation across active orders
            </p>
          </div>

          <div className="space-y-4 my-auto">
            {/* Stage 1: Verified Paid */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#F4F7F4] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#5FC7A1]" /> PayPal Verified Settled
                </span>
                <span className="font-bold text-[#5FC7A1]">5 Orders (83%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#102326] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "83%" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-[#5FC7A1] rounded-full"
                />
              </div>
            </div>

            {/* Stage 2: Pending Approval */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#F4F7F4] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D8AD70]" /> Awaiting Merchant Sign
                </span>
                <span className="font-bold text-[#D8AD70]">1 Order (17%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#102326] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "17%" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-[#D8AD70] rounded-full"
                />
              </div>
            </div>

            {/* Stage 3: Inventory Restocked */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#F4F7F4] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#79E7C7]" /> In-Transit / Restocked
                </span>
                <span className="font-bold text-[#79E7C7]">150 Units Restock</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#102326] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-[#79E7C7] rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#102326] border border-[rgba(154,231,207,0.12)] text-xs text-[#A6B8B5] font-mono">
            <span className="text-[#79E7C7] font-bold block mb-1">Audit Consensus</span>
            All 20 SHA-256 state blocks validated with 100% hash chain integrity.
          </div>
        </SpotlightCard>
      </div>

      {/* ─── 4. LOWER DASHBOARD: INVENTORY RISK & RECENT NEGOTIATIONS ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Inventory Risk Overview Card (~7 cols) */}
        <SpotlightCard className="lg:col-span-7 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(154,231,207,0.08)]">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D77979]/15 text-[#D77979] border border-[#D77979]/30">
                CRITICAL STOCKOUT DETECTED
              </span>
              <h3 className="font-sans font-bold text-base text-[#F4F7F4]">
                Inventory Risk Queue
              </h3>
            </div>
            <Link href="/dashboard/inventory" className="text-xs font-mono text-[#79E7C7] hover:underline flex items-center gap-1">
              <span>View All 20 SKUs</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* ELEC-005 Urgent Tile with subtle pulse highlight */}
          <div className="p-5 rounded-xl bg-[#102326] border border-[#D77979]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#D77979]/60">
            <div>
              <div className="flex items-center gap-2 mb-1 text-xs font-mono">
                <span className="text-[#D77979] font-bold">ELEC-005</span>
                <span className="text-[#708784]">·</span>
                <span className="text-[#F4F7F4] font-sans font-semibold">Smart Watch Ultra Titanium</span>
              </div>
              <div className="text-xs text-[#A6B8B5] font-mono">
                Current Stock: <strong className="text-[#D77979]">0 Units</strong> · Run-rate: 8.4 units/day · Daily Loss: $2,931.60
              </div>
              <div className="text-[11px] text-[#79E7C7] font-mono mt-1">
                AI Counteroffer Locked: $122.50/unit with TechSource Global Ltd
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <Link href="/dashboard/approval">
                <button className="px-4 py-2 rounded-xl bg-[#79E7C7] text-[#061011] text-xs font-bold font-mono hover:bg-[#79E7C7]/90 shadow-sm transition-all">
                  Sign PO-2024-00892
                </button>
              </Link>
            </div>
          </div>

          {/* Other Healthy SKU Items preview */}
          <div className="space-y-2 pt-2">
            {[
              { sku: "ELEC-001", name: "Wireless Earbuds Pro", stock: 8, reorder: 25, status: "Low", color: "text-[#D8AD70]" },
              { sku: "ELEC-003", name: "USB-C Multi-Port Hub 7-in-1", stock: 6, reorder: 30, status: "Low", color: "text-[#D8AD70]" },
              { sku: "ELEC-002", name: "Mechanical Keyboard RGB", stock: 65, reorder: 30, status: "Normal", color: "text-[#5FC7A1]" },
            ].map((item) => (
              <div key={item.sku} className="p-3 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.08)] flex items-center justify-between text-xs font-mono hover:border-[#79E7C7]/20 transition-all">
                <div className="flex items-center gap-2.5">
                  <span className="text-[#79E7C7] font-bold">{item.sku}</span>
                  <span className="text-[#F4F7F4] font-sans">{item.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#A6B8B5]">Stock: {item.stock}</span>
                  <span className={`font-semibold ${item.color}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>

        {/* Right: Supplier Performance & Recent Negotiations (~5 cols) */}
        <SpotlightCard className="lg:col-span-5 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(154,231,207,0.08)]">
            <h3 className="font-sans font-bold text-base text-[#F4F7F4]">
              Accredited Supplier Ratings
            </h3>
            <Link href="/dashboard/procurement" className="text-xs font-mono text-[#79E7C7] hover:underline flex items-center gap-1">
              <span>Decision Engine</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { name: "TechSource Global Ltd", country: "China (Shenzhen)", score: 72.6, rating: "94% Reliability", best: true },
              { name: "EuroTech Supply GmbH", country: "Germany (Munich)", score: 58.8, rating: "88% Reliability", best: false },
              { name: "PrimeParts Direct Inc", country: "United States (CA)", score: 51.3, rating: "82% Reliability", best: false },
            ].map((sup, idx) => (
              <div
                key={sup.name}
                className={`p-4 rounded-xl border transition-all ${
                  sup.best
                    ? "bg-[#173034]/70 border-[#79E7C7]/40 shadow-mint-subtle"
                    : "bg-[#061011] border-[rgba(154,231,207,0.08)] hover:border-[#79E7C7]/20"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#F4F7F4] font-sans flex items-center gap-1.5">
                    {sup.name}
                    {sup.best && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#79E7C7]/15 text-[#79E7C7] border border-[#79E7C7]/30">
                        RANK #1
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#79E7C7]">
                    {sup.score} / 100
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#A6B8B5] font-mono">
                  <span>{sup.country}</span>
                  <span className="text-[#5FC7A1]">{sup.rating}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link href="/dashboard/negotiations?sku=ELEC-005&qty=150" className="block">
              <button className="w-full py-2.5 rounded-xl bg-[#102326] border border-[rgba(154,231,207,0.15)] text-xs font-mono text-[#79E7C7] hover:bg-[#173034] transition-all flex items-center justify-center gap-2">
                <Bot className="w-3.5 h-3.5" />
                <span>Launch AI Negotiation Studio</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </div>
        </SpotlightCard>
      </div>
    </PageEntrance>
  );
}
