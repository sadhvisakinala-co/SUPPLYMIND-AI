"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Boxes,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Bot,
  Truck,
  CheckCircle2,
  RefreshCw,
  Clock,
  Activity,
  BarChart3,
  Layers,
} from "lucide-react";

export default function OverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [stockoutItem, setStockoutItem] = useState<any>(null);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, invRes, ordersRes] = await Promise.all([
        api.get<any>("/api/inventory/stats"),
        api.get<any[]>("/api/inventory?status=stockout"),
        api.get<any[]>("/api/procurement/orders?status=pending_approval"),
      ]);

      setStats(statsRes.data);
      if (invRes.data && invRes.data.length > 0) {
        setStockoutItem(invRes.data[0]);
      }
      setPendingOrders(ordersRes.data || []);
    } catch (err) {
      console.error("Failed to load overview data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* ─── TITLE & CONTEXT BAR ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold text-electric-teal uppercase tracking-widest block mb-1">
            Real-Time Enterprise Telemetry
          </span>
          <h2 className="font-display font-bold text-3xl text-soft-ivory">
            Autonomous Procurement Console
          </h2>
          <p className="text-xs text-silver-sage mt-1 font-mono">
            Merchant: <strong className="text-soft-ivory">TechFlow Electronics Ltd</strong> · Alex Chen
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchData}
            className="text-xs gap-1.5 h-9 font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5 text-electric-teal" />
            Refresh Telemetry
          </Button>

          <Link href="/dashboard/approval">
            <Button size="sm" className="text-xs gap-1.5 h-9 shadow-teal-subtle font-mono font-bold">
              <span>Approve Pending PO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── URGENT ACTION HERO: CRITICAL STOCKOUT ALERT ─────────────────── */}
      <div className="relative rounded-2xl border-2 border-error/50 bg-gradient-to-r from-[#2a1616] via-charcoal to-[#182022] p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-error/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="stockout" className="px-3 py-1 text-xs">
                CRITICAL STOCKOUT DETECTED
              </Badge>
              <span className="text-xs text-error font-mono">SKU: ELEC-005</span>
            </div>

            <h3 className="font-display font-bold text-xl sm:text-2xl text-soft-ivory mb-2">
              Smart Watch Ultra Titanium (GPS + Cellular)
            </h3>

            <p className="text-xs sm:text-sm text-silver-sage leading-relaxed mb-4">
              Current inventory reached <strong className="text-error">0 units</strong> with an active velocity drain of <strong className="text-soft-ivory">8.4 units/day</strong>. Estimated daily revenue forfeiture: <strong className="text-error">$2,931.60</strong>. An autonomous counteroffer was negotiated with TechSource Global Ltd at <strong className="text-electric-teal font-mono">$122.50/unit</strong> (saving $1,200.00).
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-silver-sage font-mono">
              <div>
                Recommended Restock: <strong className="text-soft-ivory">150 Units</strong>
              </div>
              <div className="h-3 w-[1px] bg-border-subtle" />
              <div>
                Negotiated Total: <strong className="text-electric-teal font-bold">$19,643.75</strong>
              </div>
              <div className="h-3 w-[1px] bg-border-subtle" />
              <div>
                Lead Time: <strong className="text-soft-ivory">14 Days (Expedited)</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <Link href="/dashboard/approval">
              <Button size="lg" className="w-full gap-2 shadow-teal-subtle text-sm font-bold font-mono">
                <CheckCircle2 className="w-4 h-4" />
                Review & Approve PO
              </Button>
            </Link>
            <Link href="/dashboard/negotiations">
              <Button variant="secondary" size="lg" className="w-full gap-2 text-xs font-mono">
                <Bot className="w-4 h-4 text-electric-teal" />
                Inspect AI Transcript
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 4 TOP KPI METRIC TILES ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card variant="default" className="p-5 border-border-subtle hover:border-electric-teal/40 transition-all">
          <div className="flex items-center justify-between text-silver-sage mb-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">Total SKUs Monitored</span>
            <Boxes className="w-4 h-4 text-electric-teal" />
          </div>
          <div className="text-3xl font-bold font-mono text-soft-ivory">
            {stats ? stats.total_items : 20}
          </div>
          <div className="text-xs text-silver-sage mt-1">
            Consumer Electronics & Peripherals
          </div>
        </Card>

        <Card variant="default" className="p-5 border-border-subtle hover:border-electric-teal/40 transition-all">
          <div className="flex items-center justify-between text-silver-sage mb-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">Inventory Value</span>
            <DollarSign className="w-4 h-4 text-electric-teal" />
          </div>
          <div className="text-3xl font-bold font-mono text-electric-teal">
            ${stats ? stats.total_inventory_value?.toLocaleString() : "41,840.00"}
          </div>
          <div className="text-xs text-silver-sage mt-1">
            At-cost wholesale asset valuation
          </div>
        </Card>

        <Card variant="default" className="p-5 border-error/30 hover:border-error/60 transition-all">
          <div className="flex items-center justify-between text-silver-sage mb-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">Risk / Stockouts</span>
            <AlertTriangle className="w-4 h-4 text-error" />
          </div>
          <div className="text-3xl font-bold font-mono text-error">
            {stats ? stats.stockout_items_count : 1} Stockout · {stats ? stats.low_stock_items_count : 2} Low
          </div>
          <div className="text-xs text-error/80 mt-1 font-mono">
            ELEC-005, ELEC-001, ELEC-003
          </div>
        </Card>

        <Card variant="default" className="p-5 border-success/30 hover:border-success/60 transition-all">
          <div className="flex items-center justify-between text-silver-sage mb-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">AI Margin Savings</span>
            <TrendingUp className="w-4 h-4 text-success" />
          </div>
          <div className="text-3xl font-bold font-mono text-success">
            $4,850.00
          </div>
          <div className="text-xs text-silver-sage mt-1 font-mono">
            +6.13% average concession yield
          </div>
        </Card>
      </div>

      {/* ─── 12-COLUMN MAIN SECTION ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: At-Risk Inventory & Velocity 7-cols */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="default" className="border-border-subtle">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border-subtle">
              <div>
                <CardTitle className="text-base text-soft-ivory font-display">
                  Priority Restock Signals
                </CardTitle>
                <p className="text-xs text-silver-sage mt-0.5 font-mono">
                  Items breaching dynamic reorder thresholds
                </p>
              </div>
              <Link href="/dashboard/inventory">
                <Button variant="ghost" size="sm" className="text-xs text-electric-teal gap-1 font-mono">
                  View All 20 SKUs <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              {/* Item 1: ELEC-005 Stockout */}
              <div className="p-4 rounded-xl border border-error/50 bg-[#281616]/40 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-soft-ivory text-sm">
                      Smart Watch Ultra Titanium
                    </span>
                    <Badge variant="stockout">0 UNITS</Badge>
                  </div>
                  <div className="text-xs text-silver-sage font-mono">
                    SKU: ELEC-005 · Reorder Point: 40 · Demand: 8.4/day
                  </div>
                </div>
                <Link href="/dashboard/approval">
                  <Button size="sm" variant="default" className="text-xs shrink-0 font-mono">
                    Approve Restock
                  </Button>
                </Link>
              </div>

              {/* Item 2: ELEC-001 Low */}
              <div className="p-4 rounded-xl border border-warning/40 bg-[#292218]/40 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-soft-ivory text-sm">
                      Wireless Earbuds Pro (Active Noise Canceling)
                    </span>
                    <Badge variant="warning">8 UNITS LEFT</Badge>
                  </div>
                  <div className="text-xs text-silver-sage font-mono">
                    SKU: ELEC-001 · Reorder Point: 25 · 1.5 days of runway left
                  </div>
                </div>
                <Link href="/dashboard/procurement">
                  <Button size="sm" variant="outline" className="text-xs shrink-0 font-mono">
                    Trigger AI Bidding
                  </Button>
                </Link>
              </div>

              {/* Item 3: ELEC-003 Low */}
              <div className="p-4 rounded-xl border border-warning/40 bg-[#292218]/40 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-soft-ivory text-sm">
                      USB-C Multi-Port Hub 7-in-1 (100W PD)
                    </span>
                    <Badge variant="warning">6 UNITS LEFT</Badge>
                  </div>
                  <div className="text-xs text-silver-sage font-mono">
                    SKU: ELEC-003 · Reorder Point: 30 · 1.0 day of runway left
                  </div>
                </div>
                <Link href="/dashboard/procurement">
                  <Button size="sm" variant="outline" className="text-xs shrink-0 font-mono">
                    Trigger AI Bidding
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Status Matrix */}
          <Card variant="default" className="border-border-subtle">
            <CardHeader className="pb-4 border-b border-border-subtle">
              <CardTitle className="text-base text-soft-ivory font-display">
                Accredited Global Sourcing Network
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                <div className="p-4 rounded-xl bg-graphite border border-border-subtle">
                  <div className="text-xs font-bold text-soft-ivory font-sans">TechSource Global</div>
                  <div className="text-[11px] text-silver-sage mt-0.5">Shenzhen, CN · 14d lead</div>
                  <div className="text-xs text-electric-teal font-semibold mt-2">Rating: 4.2 / 5.0</div>
                  <div className="text-[10px] text-success mt-0.5">Lowest Unit Cost</div>
                </div>

                <div className="p-4 rounded-xl bg-graphite border border-border-subtle">
                  <div className="text-xs font-bold text-soft-ivory font-sans">PrimeParts Direct</div>
                  <div className="text-[11px] text-silver-sage mt-0.5">Fremont, USA · 4d lead</div>
                  <div className="text-xs text-electric-teal font-semibold mt-2">Rating: 4.7 / 5.0</div>
                  <div className="text-[10px] text-success mt-0.5">Fastest Domestic Lane</div>
                </div>

                <div className="p-4 rounded-xl bg-graphite border border-border-subtle">
                  <div className="text-xs font-bold text-soft-ivory font-sans">EuroTech Supply</div>
                  <div className="text-[11px] text-silver-sage mt-0.5">Munich, DE · 8d lead</div>
                  <div className="text-xs text-electric-teal font-semibold mt-2">Rating: 4.5 / 5.0</div>
                  <div className="text-[10px] text-success mt-0.5">TÜV QC Certified</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Pending PO & Real-Time Audit Stream 5-cols */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="default" className="border-border-subtle">
            <CardHeader className="pb-4 border-b border-border-subtle">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-soft-ivory font-display">
                  Active Procurement Gate
                </CardTitle>
                <Badge variant="warning">MANDATORY SIGN-OFF</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="p-4 rounded-xl bg-surface border border-border-subtle space-y-3 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-electric-teal font-bold">PO-2024-00892</span>
                  <span className="text-xs text-silver-sage">Created Today</span>
                </div>
                <div className="text-sm font-bold text-soft-ivory font-sans">
                  150x Smart Watch Ultra Restock
                </div>
                <div className="text-xs text-silver-sage leading-relaxed">
                  Vendor: <strong className="text-soft-ivory font-sans">TechSource Global Ltd</strong><br />
                  AI Confidence: <strong className="text-success">94%</strong>
                </div>
                <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                  <span className="text-xs text-silver-sage">Total Approved Cost:</span>
                  <span className="text-base font-bold text-electric-teal">$19,643.75</span>
                </div>
              </div>

              <Link href="/dashboard/approval" className="block">
                <Button className="w-full gap-2 shadow-teal-subtle font-mono text-sm font-bold">
                  Proceed to Approval Screen
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Cryptographic Audit Trail Preview */}
          <Card variant="default" className="border-border-subtle">
            <CardHeader className="pb-4 border-b border-border-subtle">
              <CardTitle className="text-base text-soft-ivory font-display">
                Cryptographic Audit Log
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3.5 text-xs font-mono">
                <div className="flex items-start gap-2.5 pb-3 border-b border-border-subtle">
                  <div className="w-2 h-2 rounded-full bg-success mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-soft-ivory font-sans">ORDER_GENERATED_BY_AI</span>
                    <p className="text-silver-sage text-[11px] mt-0.5">PO-2024-00892 compiled for ELEC-005 restock ($19,643.75)</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pb-3 border-b border-border-subtle">
                  <div className="w-2 h-2 rounded-full bg-electric-teal mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-soft-ivory font-sans">AI_COUNTER_ACCEPTED</span>
                    <p className="text-silver-sage text-[11px] mt-0.5">TechSource accepted $122.50 counteroffer ($1,200.00 saved)</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-electric-teal mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-soft-ivory font-sans">TELEMETRY_TRIGGER</span>
                    <p className="text-silver-sage text-[11px] mt-0.5">Inventory reached 0 units on ELEC-005. Emergency pipeline invoked.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border-subtle text-center">
                <Link href="/dashboard/tracking" className="text-xs text-electric-teal hover:underline font-mono">
                  View full immutable transaction logs →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
