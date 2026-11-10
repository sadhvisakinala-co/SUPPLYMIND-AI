"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SmartWatchProductView from "@/components/dashboard/SmartWatchProductView";
import InventoryVelocityChart from "@/components/dashboard/InventoryVelocityChart";
import SpendCategoryDonut from "@/components/dashboard/SpendCategoryDonut";
import {
  Boxes,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Clock,
  Layers,
  FileText,
  FileCheck2,
} from "lucide-react";

export default function OverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const statsRes = await api.get<any>("/api/inventory/stats");
      setStats(statsRes.data);
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
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      {/* ─── 1. DASHBOARD HEADER WITH FLOWING NEON WAVE ─────────────────────── */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        {/* Subtle decorative neon wave light trail in background */}
        <div className="absolute right-40 -top-6 w-[640px] h-32 pointer-events-none opacity-60 overflow-hidden hidden lg:block">
          <svg viewBox="0 0 640 100" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B9F12F" stopOpacity="0" />
                <stop offset="35%" stopColor="#B9F12F" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#B9F12F" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 65 C 150 15, 290 85, 440 35 C 510 12, 580 30, 640 22"
              stroke="url(#waveGrad)"
              strokeWidth="2.2"
              strokeDasharray="4 4"
            />
            <path
              d="M20 75 C 170 25, 310 95, 460 42 C 520 18, 590 34, 640 26"
              stroke="#B9F12F"
              strokeWidth="1.2"
              strokeOpacity="0.45"
            />
            <path
              d="M40 85 C 190 35, 330 105, 480 50 C 540 24, 600 38, 640 30"
              stroke="#38BDF8"
              strokeWidth="0.9"
              strokeOpacity="0.3"
            />
          </svg>
        </div>

        <div>
          <div className="text-[11px] font-mono font-bold text-[#B9F12F] uppercase tracking-wider mb-1">
            REAL-TIME ENTERPRISE TELEMETRY
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-[34px] text-[#F2F0E9] tracking-tight leading-none">
            Autonomous Procurement Console
          </h1>
          <p className="text-xs sm:text-sm text-[#829DA8] mt-1.5 font-sans">
            Merchant: <strong className="text-[#F2F0E9]">TechFlow Electronics Ltd</strong> · Alex Chen
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="text-xs gap-2 h-9 px-4 font-mono bg-[#10394A] hover:bg-[#164657] border border-[rgba(150,215,222,0.25)] text-[#F2F0E9] rounded-xl transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#B9F12F] ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Telemetry</span>
          </Button>

          <Link href="/dashboard/approval">
            <Button
              size="sm"
              className="text-xs gap-2 h-9 px-4 bg-[#B9F12F] hover:bg-[#bef264] text-[#071F30] font-sans font-extrabold rounded-xl shadow-[0_0_20px_rgba(185,241,47,0.4)] hover:scale-105 active:scale-95 transition-all"
            >
              <span>Approve Pending PO</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── 2. CRITICAL STOCKOUT HERO PANEL (MATCHING REFERENCE EXACTLY) ─── */}
      <div className="relative rounded-2xl border border-[rgba(150,215,222,0.25)] bg-gradient-to-r from-[#072438] via-[#0E3547] to-[#071F30] p-6 sm:p-7 shadow-[0_0_35px_rgba(185,241,47,0.14)] overflow-hidden">
        {/* Top edge neon lime accent line with ambient glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B9F12F] to-transparent" />
        <div className="absolute top-0 right-1/4 w-80 h-36 bg-[#B9F12F]/12 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-5 items-center">
          {/* Left Column: Badges, Title, Story & 4 Metrics (6 cols) */}
          <div className="xl:col-span-6 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-red-500/25 text-red-400 border border-red-500/40">
                CRITICAL STOCKOUT DETECTED
              </span>
              <span className="text-[10px] text-[#AFC4CC] font-mono px-2 py-0.5 rounded bg-[#071F30]/80 border border-[rgba(242,240,233,0.08)]">
                <span className="text-red-400 font-bold">SKU:</span> ELEC-005
              </span>
            </div>

            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#F2F0E9] tracking-tight break-words sm:whitespace-nowrap">
              Smart Watch Ultra Titanium (GPS + Cellular)
            </h2>

            <p className="text-xs sm:text-sm text-[#AFC4CC] leading-relaxed font-sans max-w-xl">
              Current inventory reached <strong className="text-red-400 font-mono font-bold">0 units</strong> with an active velocity drain of <strong className="text-[#F2F0E9] font-mono font-bold">8.4 units/day</strong>. Estimated daily revenue forfeiture: <strong className="text-red-400 font-mono font-bold">$2,931.60</strong>. An autonomous counteroffer was negotiated with TechSource Global Ltd at <strong className="text-[#B9F12F] font-mono font-bold">$122.50/unit</strong> (saving $1,200.00).
            </p>

            {/* 4 Metric Boxes in a single horizontal row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[rgba(242,240,233,0.1)] text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#164657] flex items-center justify-center text-[#B9F12F] shrink-0">
                  <Boxes className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#829DA8] uppercase font-sans leading-tight">Recommended Restock</div>
                  <div className="text-xs sm:text-sm font-bold text-[#F2F0E9]">150 Units</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#164657] flex items-center justify-center text-[#B9F12F] shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#829DA8] uppercase font-sans leading-tight">Negotiated Total</div>
                  <div className="text-xs sm:text-sm font-bold text-[#F2F0E9]">$19,643.75</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#164657] flex items-center justify-center text-[#B9F12F] shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#829DA8] uppercase font-sans leading-tight">Lead Time</div>
                  <div className="text-xs sm:text-sm font-bold text-[#F2F0E9]">14 Days (Expedited)</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#164657] flex items-center justify-center text-[#B9F12F] shrink-0">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#829DA8] uppercase font-sans leading-tight">Cost Savings</div>
                  <div className="text-xs sm:text-sm font-bold text-[#F2F0E9]">$1,200.00 (6.13%)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Center-Right Column: Smart Watch on Glowing Ring (4 cols) */}
          <div className="xl:col-span-4 flex items-center justify-center relative min-h-[250px]">
            <SmartWatchProductView />
          </div>

          {/* Far-Right Column: Stacked Action Buttons (2 cols) */}
          <div className="xl:col-span-2 flex flex-col gap-3 justify-center">
            <Link href="/dashboard/approval" className="w-full">
              <Button
                size="sm"
                className="w-full h-10 gap-2 bg-[#B9F12F] hover:bg-[#bef264] text-[#071F30] font-sans text-xs font-bold rounded-xl shadow-[0_0_20px_rgba(185,241,47,0.4)] transition-all hover:scale-105 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Review &amp; Approve PO</span>
              </Button>
            </Link>

            <Link href="/dashboard/negotiations" className="w-full">
              <Button
                variant="secondary"
                size="sm"
                className="w-full h-10 gap-2 text-xs font-sans font-medium bg-[#071F30]/90 hover:bg-[#164657] text-[#F2F0E9] border border-[rgba(150,215,222,0.25)] rounded-xl transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-[#AFC4CC]" />
                <span>Inspect AI Transcript</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 3. TOP 4 KPI METRIC TILES WITH SPARKLINES ────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* KPI 1: TOTAL SKUS MONITORED */}
        <Card className="p-5 rounded-2xl bg-[#10394A] border border-[rgba(150,215,222,0.25)] hover:border-[#B9F12F]/40 transition-all duration-300 shadow-xl flex flex-col justify-between h-[130px]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#164657] border border-[#B9F12F]/30 flex items-center justify-center text-[#B9F12F] shrink-0">
              <Boxes className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#AFC4CC]">
              TOTAL SKUS MONITORED
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-extrabold font-mono text-[#F2F0E9] tracking-tight leading-none">
                {stats ? stats.total_items : 20}
              </div>
              <div className="text-xs text-[#B9F12F] font-mono mt-1.5">
                +5.3% vs. last 7 days
              </div>
            </div>

            {/* Neon Green SVG Sparkline */}
            <div className="w-24 h-8 pb-0.5">
              <svg viewBox="0 0 96 32" fill="none" className="w-full h-full">
                <path
                  d="M0 26 C 24 28, 36 16, 60 18 C 78 20, 84 8, 96 4"
                  stroke="#B9F12F"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </Card>

        {/* KPI 2: INVENTORY VALUE */}
        <Card className="p-5 rounded-2xl bg-[#10394A] border border-[rgba(150,215,222,0.25)] hover:border-[#B9F12F]/40 transition-all duration-300 shadow-xl flex flex-col justify-between h-[130px]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#164657] border border-[#B9F12F]/30 flex items-center justify-center text-[#B9F12F] shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#AFC4CC]">
              INVENTORY VALUE
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-extrabold font-mono text-[#F2F0E9] tracking-tight leading-none">
                ${stats ? stats.total_inventory_value?.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : "19,253.5"}
              </div>
              <div className="text-xs text-[#B9F12F] font-mono mt-1.5">
                +12.8% vs. last month
              </div>
            </div>

            {/* Neon Green SVG Sparkline */}
            <div className="w-24 h-8 pb-0.5">
              <svg viewBox="0 0 96 32" fill="none" className="w-full h-full">
                <path
                  d="M0 24 C 20 26, 32 30, 50 18 C 68 8, 80 14, 96 6"
                  stroke="#B9F12F"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </Card>

        {/* KPI 3: RISK / STOCKOUTS (With Coral Sparkline matching reference) */}
        <Card className="p-5 rounded-2xl bg-[#10394A] border border-red-500/35 hover:border-red-500/55 transition-all duration-300 shadow-xl flex flex-col justify-between h-[130px]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-400">
              RISK / STOCKOUTS
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-extrabold font-mono text-red-400 tracking-tight leading-none">
                Stockout · Low
              </div>
              <div className="text-xs text-red-400/80 font-mono mt-1.5">
                ELEC-005, ELEC-001, ELEC-003
              </div>
            </div>

            {/* Coral-Red SVG Sparkline */}
            <div className="w-24 h-8 pb-0.5">
              <svg viewBox="0 0 96 32" fill="none" className="w-full h-full">
                <path
                  d="M0 22 C 18 20, 32 28, 48 24 C 64 20, 78 28, 96 22"
                  stroke="#F07178"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </Card>

        {/* KPI 4: AI MARGIN SAVINGS */}
        <Card className="p-5 rounded-2xl bg-[#10394A] border border-[rgba(150,215,222,0.25)] hover:border-[#B9F12F]/40 transition-all duration-300 shadow-xl flex flex-col justify-between h-[130px]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#164657] border border-[#B9F12F]/30 flex items-center justify-center text-[#B9F12F] shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#AFC4CC]">
              AI MARGIN SAVINGS
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-extrabold font-mono text-[#F2F0E9] tracking-tight leading-none">
                $4,850.00
              </div>
              <div className="text-xs text-[#B9F12F] font-mono mt-1.5">
                +6.13% average concession yield
              </div>
            </div>

            {/* Neon Green SVG Sparkline */}
            <div className="w-24 h-8 pb-0.5">
              <svg viewBox="0 0 96 32" fill="none" className="w-full h-full">
                <path
                  d="M0 26 C 24 24, 40 28, 60 14 C 74 4, 84 12, 96 8"
                  stroke="#B9F12F"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* ─── 4. ANALYTICS SECTION: TWO INTERACTIVE GRAPHS (57% + 43%) ────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* GRAPH A: Inventory Trend & Forecast (7 cols) */}
        <Card className="xl:col-span-7 p-5 rounded-2xl bg-[#10394A] border border-[rgba(150,215,222,0.25)] shadow-xl flex flex-col justify-between">
          <InventoryVelocityChart />
        </Card>

        {/* GRAPH B: Spend by Category (5 cols) */}
        <Card className="xl:col-span-5 p-5 rounded-2xl bg-[#10394A] border border-[rgba(150,215,222,0.25)] shadow-xl flex flex-col justify-between">
          <SpendCategoryDonut />
        </Card>
      </div>

      {/* ─── 5. OPERATIONAL PANELS: RESTOCK SIGNALS (TABLE) & PROCUREMENT GATE (STEPPER) ─ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* LEFT: Priority Restock Signals Data Table (7 cols) */}
        <div className="xl:col-span-7">
          <Card className="p-5 rounded-2xl bg-[#10394A] border border-[rgba(150,215,222,0.25)] shadow-xl h-full flex flex-col justify-between">
            <div>
              {/* Table Card Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[rgba(242,240,233,0.08)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#164657] flex items-center justify-center text-[#B9F12F]">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#F2F0E9] font-display">
                      Priority Restock Signals
                    </h3>
                    <p className="text-xs text-[#829DA8] font-mono">
                      Items breaching dynamic reorder thresholds
                    </p>
                  </div>
                </div>

                <Link href="/dashboard/inventory">
                  <span className="text-xs text-[#B9F12F] font-mono hover:underline inline-flex items-center gap-1 cursor-pointer">
                    View All 20 SKUs <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>

              {/* Exact Data Table */}
              <div className="pt-3 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[rgba(242,240,233,0.08)] text-[10px] font-mono font-semibold text-[#829DA8] uppercase tracking-wider">
                      <th className="py-2.5 pr-3">SKU</th>
                      <th className="py-2.5 px-3">ITEM</th>
                      <th className="py-2.5 px-3">CURRENT INV.</th>
                      <th className="py-2.5 px-3">VELOCITY</th>
                      <th className="py-2.5 px-3 text-center">RECOMMENDED PO</th>
                      <th className="py-2.5 pl-3 text-right">EST. IMPACT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(242,240,233,0.05)] text-xs font-mono">
                    {/* Row 1: ELEC-005 */}
                    <tr className="hover:bg-[#12394F]/40 transition-colors">
                      <td className="py-3 pr-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/35">
                          ELEC-005
                        </span>
                      </td>
                      <td className="py-3 px-3 font-sans font-semibold text-[#F2F0E9]">
                        Smart Watch Ultra
                      </td>
                      <td className="py-3 px-3 font-bold text-red-400">
                        0 units
                      </td>
                      <td className="py-3 px-3 text-[#AFC4CC]">
                        8.4 / day
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#B9F12F]/15 text-[#B9F12F] border border-[#B9F12F]/30">
                          150 units
                        </span>
                      </td>
                      <td className="py-3 pl-3 text-right font-bold text-red-400">
                        $2,931.60
                      </td>
                    </tr>

                    {/* Row 2: ELEC-001 */}
                    <tr className="hover:bg-[#12394F]/40 transition-colors">
                      <td className="py-3 pr-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#164657] text-[#AFC4CC] border border-[rgba(242,240,233,0.1)]">
                          ELEC-001
                        </span>
                      </td>
                      <td className="py-3 px-3 font-sans font-semibold text-[#F2F0E9]">
                        Wireless Earbuds Pro
                      </td>
                      <td className="py-3 px-3 text-[#F2F0E9]">
                        12 units
                      </td>
                      <td className="py-3 px-3 text-[#AFC4CC]">
                        3.1 / day
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#B9F12F]/15 text-[#B9F12F] border border-[#B9F12F]/30">
                          100 units
                        </span>
                      </td>
                      <td className="py-3 pl-3 text-right text-[#AFC4CC]">
                        $961.00
                      </td>
                    </tr>

                    {/* Row 3: ELEC-003 */}
                    <tr className="hover:bg-[#12394F]/40 transition-colors">
                      <td className="py-3 pr-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#164657] text-[#AFC4CC] border border-[rgba(242,240,233,0.1)]">
                          ELEC-003
                        </span>
                      </td>
                      <td className="py-3 px-3 font-sans font-semibold text-[#F2F0E9]">
                        Smart Band 4
                      </td>
                      <td className="py-3 px-3 text-[#F2F0E9]">
                        18 units
                      </td>
                      <td className="py-3 px-3 text-[#AFC4CC]">
                        2.7 / day
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#B9F12F]/15 text-[#B9F12F] border border-[#B9F12F]/30">
                          75 units
                        </span>
                      </td>
                      <td className="py-3 pl-3 text-right text-[#AFC4CC]">
                        $742.50
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT: Active Procurement Gate Stepper (5 cols) */}
        <div className="xl:col-span-5">
          <Card className="p-5 rounded-2xl bg-[#10394A] border border-[rgba(150,215,222,0.25)] shadow-xl h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-[rgba(242,240,233,0.08)]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B9F12F]" />
                  <h3 className="text-sm font-bold text-[#F2F0E9] font-display">
                    Active Procurement Gate
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  MANDATORY SIGN-OFF
                </span>
              </div>

              {/* 4-Stage Stepper Workflow matching reference */}
              <div className="py-6 flex items-center justify-between">
                {/* Step 1: AI Negotiation */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-6 h-6 rounded-full bg-[#B9F12F] text-[#071F30] flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(185,241,47,0.4)]">
                    ✓
                  </div>
                  <span className="text-[11px] font-bold text-[#F2F0E9] font-sans mt-2 leading-tight">
                    AI Negotiation
                  </span>
                  <span className="text-[9px] text-[#AFC4CC] font-mono">
                    Completed
                  </span>
                </div>

                {/* Connecting Line 1 */}
                <div className="flex-1 h-[2px] bg-[#B9F12F] mx-2 -mt-4 opacity-80" />

                {/* Step 2: Counteroffer */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-6 h-6 rounded-full bg-[#B9F12F] text-[#071F30] flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(185,241,47,0.4)]">
                    ✓
                  </div>
                  <span className="text-[11px] font-bold text-[#F2F0E9] font-sans mt-2 leading-tight">
                    Counteroffer
                  </span>
                  <span className="text-[9px] text-[#AFC4CC] font-mono">
                    Approved
                  </span>
                </div>

                {/* Connecting Line 2 */}
                <div className="flex-1 h-[2px] bg-[#B9F12F] mx-2 -mt-4 opacity-80" />

                {/* Step 3: Merchant Sign-off (Active Highlight Card) */}
                <div className="p-2.5 px-3 rounded-xl border border-[#B9F12F] bg-[#12394F]/80 shadow-[0_0_16px_rgba(185,241,47,0.25)] flex flex-col items-center text-center -mt-2">
                  <div className="w-6 h-6 rounded-full bg-[#B9F12F] text-[#071F30] flex items-center justify-center font-black text-xs">
                    3
                  </div>
                  <span className="text-[11px] font-bold text-[#F2F0E9] font-sans mt-1.5 leading-tight">
                    Merchant Sign-off
                  </span>
                  <span className="text-[9px] text-[#B9F12F] font-mono font-semibold">
                    Pending
                  </span>
                </div>

                {/* Connecting Line 3 */}
                <div className="flex-1 h-[2px] bg-[#2A5167] mx-2 -mt-4 opacity-60" />

                {/* Step 4: PO Release */}
                <div className="flex flex-col items-center text-center opacity-60">
                  <div className="w-6 h-6 rounded-full bg-[#12394F] border border-[#2A5167] text-[#829DA8] flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <span className="text-[11px] font-medium text-[#829DA8] font-sans mt-2 leading-tight">
                    PO Release
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Order Info & Approval Button */}
            <div className="pt-3 border-t border-[rgba(242,240,233,0.08)] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#AFC4CC]">
                <FileCheck2 className="w-4 h-4 text-[#B9F12F]" />
                <span>PO-2024-00892 · ELEC-005 · 150 Units · <strong className="text-[#F2F0E9]">$19,643.75</strong></span>
              </div>

              <Link href="/dashboard/approval" className="shrink-0 w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-9 px-4 gap-2 bg-[#B9F12F] hover:bg-[#bef264] text-[#071F30] font-sans text-xs font-bold rounded-xl shadow-[0_0_16px_rgba(185,241,47,0.35)] transition-all hover:scale-105 active:scale-95">
                  <span>Approve Pending PO</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
