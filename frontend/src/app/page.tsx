"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import FloatingSupplyIsland from "@/components/landing/FloatingSupplyIsland";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Lock,
  DollarSign,
  Clock,
  Sparkles,
  BarChart3,
  Bot,
  Layers,
  ChevronRight,
  Globe2,
  RefreshCw,
  ExternalLink,
  Zap,
  Activity,
  ArrowUpRight,
  PlayCircle,
  Package,
  Coins,
  Users,
  MessageSquare,
  Truck,
} from "lucide-react";

export default function LandingPage() {
  const dockItems = [
    { label: "Inventory Intelligence", href: "/dashboard/inventory", icon: Package },
    { label: "Supplier Ecosystem", href: "/dashboard/suppliers", icon: Users },
    { label: "AI Negotiation Studio", href: "/dashboard/negotiations", icon: MessageSquare },
    { label: "Procurement Decision Engine", href: "/dashboard/procurement", icon: Layers },
    { label: "Orders & Tracking", href: "/dashboard/tracking", icon: Truck },
  ];

  return (
    <div className="landing-page min-h-screen bg-[#071F30] text-[#F2F0E9] selection:bg-[#B9F12F]/20 selection:text-[#B9F12F] font-sans antialiased overflow-x-hidden">
      {/* ─── FLOATING TRANSLUCENT NAVBAR ──────────────────────────────────── */}
      <Navbar />

      {/* ─── 1. CINEMATIC HERO SECTION (100% ACCURACY TO REFERENCE) ──────────── */}
      <section
        id="hero"
        className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#071F30] via-[#0B3048] to-[#071F30]"
      >
        {/* Atmospheric Backlight / Volumetric Cloud Glows */}
        <div className="absolute top-1/4 right-1/4 w-[650px] h-[650px] bg-[#38BDF8]/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/6 w-[500px] h-[500px] bg-[#B9F12F]/8 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
            {/* Left Column: Hero Text (~48% width) */}
            <div className="hero-copy lg:col-span-6 flex flex-col items-start text-left z-20">
              <h1 className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-[62px] xl:text-[68px] leading-[1.08] tracking-tight text-white mb-6">
                Procurement<br />
                Intelligence That<br />
                Moves Before<br />
                <span className="text-[#B9F12F] drop-shadow-[0_0_24px_rgba(185,241,47,0.4)]">
                  Shortages Happen.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mb-9 font-sans font-normal">
                AI-powered procurement, inventory, and supplier orchestration to keep your supply chain resilient, cost-efficient, and always a step ahead.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-12">
                <Link href="/dashboard/overview">
                  <button className="px-8 py-3.5 rounded-full bg-[#B9F12F] hover:bg-[#d4ff59] text-[#071F30] font-extrabold text-sm flex items-center gap-2.5 transition-all shadow-[0_0_28px_rgba(185,241,47,0.35)] hover:scale-105 active:scale-95">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </Link>
                <Link href="/dashboard/overview">
                  <button className="px-7 py-3.5 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-white/20 hover:border-white/40 text-white font-semibold text-sm flex items-center gap-2.5 backdrop-blur-md transition-all hover:scale-105 active:scale-95">
                    <PlayCircle className="w-4 h-4 text-white" />
                    <span>View Console</span>
                  </button>
                </Link>
              </div>

              {/* Three Metrics: Supply Continuity, Cost Savings, Faster Procurement */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 w-full max-w-lg">
                {/* Metric 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#B9F12F]/10 border border-[#B9F12F]/30 flex items-center justify-center text-[#B9F12F] shrink-0 mt-0.5">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-white font-sans tracking-tight">98.7%</div>
                    <div className="text-xs text-slate-400 font-sans mt-0.5">Supply Continuity</div>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#B9F12F]/10 border border-[#B9F12F]/30 flex items-center justify-center text-[#B9F12F] shrink-0 mt-0.5">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-white font-sans tracking-tight">17.3%</div>
                    <div className="text-xs text-slate-400 font-sans mt-0.5">Cost Savings</div>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#B9F12F]/10 border border-[#B9F12F]/30 flex items-center justify-center text-[#B9F12F] shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-white font-sans tracking-tight">42%</div>
                    <div className="text-xs text-slate-400 font-sans mt-0.5">Faster Procurement</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Floating Supply Chain Island Digital Twin (~52% width) */}
            <div className="hero-visual lg:col-span-6 relative w-full flex items-center justify-center">
              <FloatingSupplyIsland />
            </div>
          </div>

          {/* ─── BOTTOM FLOATING NAVIGATION DOCK ──────────────────────────────── */}
          <div className="mt-12 w-full">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-[#0B3048]/80 border border-white/10 backdrop-blur-xl shadow-2xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {dockItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-[#B9F12F]/30 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#B9F12F] group-hover:scale-110 group-hover:bg-[#B9F12F]/15 transition-all">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. BUSINESS PROBLEM & REAL-WORLD PROCUREMENT DELAYS ──────────────── */}
      <section id="blindspot" className="py-24 bg-graphite border-b border-border-subtle">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-3xl mb-16">
            <span className="text-xs font-mono font-semibold text-electric-teal uppercase tracking-widest block mb-2">
              The Critical Blind Spot
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-soft-ivory leading-tight">
              Traditional ERPs report historical stockouts. <br />
              <span className="text-silver-sage font-normal">We eliminate exposure before customer impact.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="default" className="p-8 border-error/30 hover:border-error/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#2a1717] border border-error/40 flex items-center justify-center mb-6 text-error font-mono font-bold">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-soft-ivory mb-3">
                $1.9 Trillion Annual Loss
              </h3>
              <p className="text-sm text-silver-sage leading-relaxed">
                Global commerce loses nearly two trillion dollars every year to unexpected stockouts, stock slippage, and last-minute emergency freight surcharges.
              </p>
            </Card>

            <Card variant="default" className="p-8 border-warning/30 hover:border-warning/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#2a2217] border border-warning/40 flex items-center justify-center mb-6 text-warning font-mono font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-soft-ivory mb-3">
                8.4 Days Lost to Email Bidding
              </h3>
              <p className="text-sm text-silver-sage leading-relaxed">
                Procurement teams waste over a week negotiating MOQs, tier thresholds, and dispatch schedules across fragmented threads with zero margin safety rails.
              </p>
            </Card>

            <Card variant="default" className="p-8 border-electric-teal/30 hover:border-electric-teal/60 transition-all">
              <div className="w-12 h-12 rounded-xl bg-surface border border-electric-teal/40 flex items-center justify-center mb-6 text-electric-teal font-mono font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-soft-ivory mb-3">
                Zero Unauthorized Outflow
              </h3>
              <p className="text-sm text-silver-sage leading-relaxed">
                SUPPLYMIND enforces deterministic gross margin floors, quantity checks, and mandatory merchant sign-off before initiating PayPal sandbox checkout orders.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── 3. AI WORKFLOW: PREDICT → SOURCE → NEGOTIATE → APPROVE → PAY → TRACK ── */}
      <section id="workflow" className="py-28 bg-charcoal/40 border-b border-border-subtle relative">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-mono font-semibold text-electric-teal uppercase tracking-widest block mb-2">
              End-to-End Governance
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-soft-ivory">
              The Seven-Step Procurement Pipeline
            </h2>
            <p className="text-silver-sage text-base mt-4">
              From telemetry detection to verified PayPal sandbox settlement, every state transition is audited with cryptographic integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
            {[
              {
                step: "01",
                title: "Predict Shortages",
                desc: "Live inventory telemetry continuously scans sales velocity against dynamic safety thresholds to detect stockout exposure.",
                tag: "Telemetry",
                gridSpan: "lg:col-span-3",
              },
              {
                step: "02",
                title: "Source Suppliers",
                desc: "Simultaneous quote ingestion across international supplier networks (Shenzhen, California, Munich).",
                tag: "Multi-Source",
                gridSpan: "lg:col-span-3",
              },
              {
                step: "03",
                title: "AI Negotiation",
                desc: "Algorithmic counteroffers bounded by deterministic gross margin floors and volume tier leverage.",
                tag: "Bounded AI",
                gridSpan: "lg:col-span-3",
              },
              {
                step: "04",
                title: "Decision Engine",
                desc: "Multi-attribute scoring evaluates price (40%), lead time (25%), reliability (20%), and bulk concessions (15%).",
                tag: "Optimization",
                gridSpan: "lg:col-span-3",
              },
              {
                step: "05",
                title: "Merchant Approval",
                desc: "Mandatory human-in-the-loop sign-off. AI cannot initiate money movement without explicit merchant approval.",
                tag: "Compliance",
                gridSpan: "md:col-span-1 lg:col-span-4",
              },
              {
                step: "06",
                title: "PayPal Sandbox Pay",
                desc: "PayPal Orders v2 sandbox checkout with cryptographic idempotency keys, capture hooks, and verified responses.",
                tag: "Fintech",
                gridSpan: "md:col-span-1 lg:col-span-4",
              },
              {
                step: "07",
                title: "Logistics Tracking",
                desc: "Real-time dispatch tracking, air transit telemetry, and immutable transaction audit log preservation.",
                tag: "Fulfillment",
                gridSpan: "md:col-span-2 lg:col-span-4",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className={`rounded-xl border border-border-subtle bg-charcoal p-6 flex flex-col justify-between hover:border-electric-teal/50 transition-all duration-300 group ${s.gridSpan}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl text-electric-teal font-bold">
                      {s.step}
                    </span>
                    <Badge variant="default" className="text-[10px]">
                      {s.tag}
                    </Badge>
                  </div>
                  <h4 className="font-display font-bold text-lg text-soft-ivory mb-2 group-hover:text-electric-teal transition-colors">
                    {s.title}
                  </h4>
                  <p className="text-xs text-silver-sage leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border-subtle flex items-center text-[11px] text-electric-teal font-mono font-semibold gap-1">
                  <span>Audited State</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. INVENTORY FORECASTING & STOCKOUT SCENARIO SHOWCASE ───────────── */}
      <section id="intelligence" className="py-28 bg-graphite border-b border-border-subtle">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-5">
              <span className="text-xs font-mono font-semibold text-electric-teal uppercase tracking-widest block mb-2">
                Scenario Demonstration
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-soft-ivory mb-6 leading-tight">
                Urgent Stockout Detected: <br />
                <span className="text-error font-mono text-2xl sm:text-3xl">ELEC-005 Smart Watch Ultra</span>
              </h2>
              <p className="text-silver-sage text-sm leading-relaxed mb-6">
                In our synthetic electronics merchant environment (Alex Chen, TechFlow Electronics), high sales velocity has depleted stock to zero. Our engine immediately evaluated all 3 accredited global suppliers and calculated optimal restocking paths.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-charcoal border border-border-subtle">
                  <div className="w-2 h-2 rounded-full bg-error mt-1.5 shrink-0 ambient-beacon" />
                  <div>
                    <div className="text-xs font-bold text-soft-ivory font-mono">Unfulfilled Velocity Drain</div>
                    <div className="text-xs text-silver-sage mt-0.5">$2,931.60/day in forfeited retail margins</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-charcoal border border-border-subtle">
                  <div className="w-2 h-2 rounded-full bg-electric-teal mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-soft-ivory font-mono">Economic Order Quantity (EOQ)</div>
                    <div className="text-xs text-silver-sage mt-0.5">Recommended Restock: 150 units ($18,375.00)</div>
                  </div>
                </div>
              </div>

              <Link href="/dashboard/procurement">
                <Button variant="default" className="gap-2">
                  View Full Recommendation Engine
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Right Supplier Comparison Card */}
            <div className="lg:col-span-7">
              <Card variant="default" className="border-border-subtle p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-subtle">
                  <div>
                    <h3 className="font-display font-bold text-soft-ivory text-base">
                      Supplier Quotation Comparison (SKU: ELEC-005)
                    </h3>
                    <p className="text-xs text-silver-sage font-mono">Quantity: 150 units · Pre-negotiated Quotes</p>
                  </div>
                  <Badge variant="stockout">STOCKOUT ACTIVE</Badge>
                </div>

                <div className="space-y-4 font-mono">
                  {/* Supplier 1: TechSource China */}
                  <div className="p-4 rounded-xl border border-electric-teal/60 bg-surface/50 relative">
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-electric-teal text-graphite uppercase">
                        AI TOP PICK
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-soft-ivory text-sm font-sans">TechSource Global Ltd</div>
                        <div className="text-xs text-silver-sage mt-0.5">Shenzhen, China · Lead Time: 14 Days · Rating: 4.2/5.0</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-silver-sage line-through">$130.50/unit</div>
                        <div className="text-lg font-bold text-electric-teal">$122.50/unit</div>
                        <div className="text-[10px] text-success font-semibold">Saved $1,200.00 via AI</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                      <span className="text-silver-sage">Confidence Score: <strong className="text-soft-ivory">94%</strong></span>
                      <span className="text-soft-ivory">Total: $19,643.75 (Inc. Tax & Freight)</span>
                    </div>
                  </div>

                  {/* Supplier 2: PrimeParts USA */}
                  <div className="p-4 rounded-xl border border-border-subtle bg-graphite/60">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-soft-ivory text-sm font-sans">PrimeParts Direct Inc</div>
                        <div className="text-xs text-silver-sage mt-0.5">Fremont, CA, USA · Lead Time: 4 Days · Rating: 4.7/5.0</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-soft-ivory">$156.60/unit</div>
                        <div className="text-[10px] text-silver-sage">Fastest dispatch (Domestic)</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                      <span className="text-silver-sage">Confidence Score: <strong className="text-soft-ivory">82%</strong></span>
                      <span className="text-soft-ivory">Total: $24,850.00</span>
                    </div>
                  </div>

                  {/* Supplier 3: EuroTech Germany */}
                  <div className="p-4 rounded-xl border border-border-subtle bg-graphite/60">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-soft-ivory text-sm font-sans">EuroTech Supply GmbH</div>
                        <div className="text-xs text-silver-sage mt-0.5">Munich, Germany · Lead Time: 8 Days · Rating: 4.5/5.0</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-soft-ivory">$147.90/unit</div>
                        <div className="text-[10px] text-silver-sage">TÜV Rheinland certified</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                      <span className="text-silver-sage">Confidence Score: <strong className="text-soft-ivory">86%</strong></span>
                      <span className="text-soft-ivory">Total: $23,410.00</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. AI NEGOTIATION WORKSPACE & TRANSCRIPT ─────────────────────────── */}
      <section id="product" className="py-28 bg-charcoal/30 border-b border-border-subtle relative">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-semibold text-electric-teal uppercase tracking-widest block mb-2">
              Autonomous Bounded Dialogue
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-soft-ivory">
              Algorithmic Negotiation with Safe Guardrails
            </h2>
            <p className="text-silver-sage text-base mt-4">
              AI agents analyze quotation structure, historical vendor margins, and volume tiers to formulate respectful, persuasive counteroffers that suppliers accept.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-2xl border border-border-subtle bg-charcoal p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-6 border-b border-border-subtle mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface border border-electric-teal/30 flex items-center justify-center text-electric-teal">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-soft-ivory text-base font-display">Negotiation Engine: Active Transcript</h4>
                  <p className="text-xs text-silver-sage font-mono">Target SKU: ELEC-005 · TechSource Global Ltd</p>
                </div>
              </div>
              <Badge variant="success">ROUND 2 OF 3 (ACCEPTED)</Badge>
            </div>

            <div className="space-y-4">
              {/* Message 1 */}
              <div className="p-4 rounded-xl bg-graphite border border-border-subtle">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-silver-sage">Supplier Initial Quotation</span>
                  <span className="font-mono text-soft-ivory">$130.50 / unit</span>
                </div>
                <p className="text-xs text-silver-sage">
                  &ldquo;Quotation for 150x ELEC-005 Smart Watch Ultra at $130.50/unit. Standard lead time 14 days FOB Shenzhen.&rdquo;
                </p>
              </div>

              {/* Message 2: AI Counter */}
              <div className="p-4 rounded-xl bg-surface border border-electric-teal/30 ml-4 sm:ml-8">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-electric-teal flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> SUPPLYMIND Autonomous Agent
                  </span>
                  <span className="font-mono text-electric-teal font-bold">$118.00 / unit (Counter)</span>
                </div>
                <p className="text-xs text-soft-ivory leading-relaxed">
                  &ldquo;Based on our 150-unit volume commitment and prompt settlement via PayPal verified rails, we propose $118.00/unit with priority packing guarantee.&rdquo;
                </p>
              </div>

              {/* Message 3: Supplier Concession */}
              <div className="p-4 rounded-xl bg-graphite border border-border-subtle">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-silver-sage">Supplier Revised Position</span>
                  <span className="font-mono text-success font-bold">$122.50 / unit (Agreed Compromise)</span>
                </div>
                <p className="text-xs text-silver-sage">
                  &ldquo;We can meet at $122.50/unit for immediate sign-off and dispatch reservation.&rdquo;
                </p>
              </div>

              {/* Outcome summary bar */}
              <div className="p-4 rounded-xl bg-surface border border-electric-teal/40 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div>
                  <div className="text-xs text-electric-teal font-bold uppercase font-mono tracking-wider">Negotiation Yield</div>
                  <div className="text-sm text-soft-ivory mt-0.5">
                    Net price reduced from <span className="line-through text-silver-sage">$130.50</span> to <strong className="text-electric-teal font-mono">$122.50</strong> ($1,200.00 saved)
                  </div>
                </div>
                <Link href="/dashboard/negotiations">
                  <Button size="sm" variant="default" className="shrink-0 gap-1.5 font-mono">
                    Open Negotiation Studio
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. PAYPAL INTEGRATION & FINTECH SECURITY ARCHITECTURE ───────────── */}
      <section id="paypal-security" className="py-24 sm:py-28 bg-[#0B3048] border-b border-[rgba(242,240,233,0.08)]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
            {/* Visual Architecture Box (Left Column) */}
            <div className="w-full min-w-0">
              <div className="rounded-2xl border border-[rgba(242,240,233,0.12)] bg-[#10394A] p-6 sm:p-8 shadow-2xl relative font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-[rgba(242,240,233,0.08)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#003087]/30 border border-[#0079C1]/40 flex items-center justify-center text-[#0079C1] font-bold text-base font-display shrink-0 shadow-sm">
                      PP
                    </div>
                    <div>
                      <h4 className="font-bold text-[#F2F0E9] text-base font-sans leading-tight">
                        PayPal Orders v2 Sandbox Rails
                      </h4>
                      <p className="text-xs text-[#829DA8] font-sans mt-0.5">
                        Server-Side Authorization &amp; Capture
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" className="shrink-0 self-start sm:self-auto font-mono text-[10px]">
                    SANDBOX VERIFIED
                  </Badge>
                </div>

                <div className="space-y-3.5">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#071F30]/80 border border-[rgba(242,240,233,0.08)]">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#F2F0E9] flex-wrap">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#B9F12F]/15 text-[#B9F12F] border border-[#B9F12F]/30 uppercase font-mono">
                        POST
                      </span>
                      <span className="font-semibold break-all">/v2/checkout/orders</span>
                    </div>
                    <div className="text-[11px] text-[#B9F12F] font-mono mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B9F12F] shrink-0" />
                      <span>Status: 201 Created · Idempotency Key Injected</span>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#071F30]/80 border border-[rgba(242,240,233,0.08)]">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#F2F0E9] flex-wrap">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#B9F12F]/15 text-[#B9F12F] border border-[#B9F12F]/30 uppercase font-mono">
                        POST
                      </span>
                      <span className="font-semibold break-all">/v2/checkout/orders/{'{id}'}/capture</span>
                    </div>
                    <div className="text-[11px] text-[#B9F12F] font-mono mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B9F12F] shrink-0" />
                      <span>Status: 200 OK · Capture ID: 2UG93021XP9910</span>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-[#071F30]/80 border border-[rgba(242,240,233,0.08)]">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#F2F0E9] flex-wrap">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 uppercase font-mono">
                        AUDIT RECORD
                      </span>
                      <span className="font-semibold">#AUD-99120</span>
                    </div>
                    <div className="text-[11px] text-[#AFC4CC] font-mono mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0" />
                      <span>Merchant Sign-off Verified · Signature Cryptographically Bound</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[rgba(242,240,233,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[#829DA8]">
                  <span className="truncate">Merchant Sandbox: supplymind-buyer@sandbox.com</span>
                  <span className="text-[#B9F12F] font-bold shrink-0">Zero Client Secrets</span>
                </div>
              </div>
            </div>

            {/* Narrative Explanation (Right Column) */}
            <div className="w-full min-w-0">
              <span className="text-xs font-mono font-semibold text-[#B9F12F] uppercase tracking-widest block mb-2.5">
                Fintech Governance
              </span>

              <h2 className="font-display font-bold text-[clamp(28px,2.8vw,42px)] leading-[1.18] tracking-[-0.025em] text-[#F2F0E9] mb-5">
                PayPal Sandbox Integration{" "}
                <span className="text-[#829DA8] font-normal">With Zero Unauthorized Money Movement</span>
              </h2>

              <p className="text-[#AFC4CC] text-sm sm:text-base leading-[1.6] mb-6 max-w-xl font-sans">
                Unlike decorative mock checkouts, SUPPLYMIND AI executes actual PayPal Orders v2 sandbox transactions. The AI generates purchasing recommendations, but money movement requires explicit merchant approval and server-side secret protection.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3.5">
                  <CheckCircle2 className="w-5 h-5 text-[#B9F12F] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h5 className="text-sm font-bold text-[#F2F0E9] font-sans leading-snug">
                      Secrets Never Exposed to Client
                    </h5>
                    <p className="text-xs sm:text-sm text-[#829DA8] mt-1 font-sans leading-[1.6]">
                      PayPal client credentials remain exclusively on the FastAPI backend server with zero browser leakage.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <CheckCircle2 className="w-5 h-5 text-[#B9F12F] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h5 className="text-sm font-bold text-[#F2F0E9] font-sans leading-snug">
                      Cryptographic Idempotency
                    </h5>
                    <p className="text-xs sm:text-sm text-[#829DA8] mt-1 font-sans leading-[1.6]">
                      Every order creation injects a unique UUID <code className="text-[#F2F0E9] font-mono text-xs">PayPal-Request-Id</code> preventing duplicate charges even on flaky networks.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <CheckCircle2 className="w-5 h-5 text-[#B9F12F] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h5 className="text-sm font-bold text-[#F2F0E9] font-sans leading-snug">
                      Strict Merchant Approval Gate
                    </h5>
                    <p className="text-xs sm:text-sm text-[#829DA8] mt-1 font-sans leading-[1.6]">
                      No order can be paid for until the merchant explicitly clicks &lsquo;Approve Order&rsquo; in the dashboard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/dashboard/approval">
                  <Button variant="default" className="gap-2.5 h-11 px-6 font-bold text-sm shadow-[0_0_20px_rgba(185,241,47,0.3)] hover:scale-105 active:scale-95 transition-all">
                    <span>Inspect Purchase Approval Flow</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. FINAL CONVERSION CTA ─────────────────────────────────────────── */}
      <section id="final-cta" className="py-28 bg-charcoal/40 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border-subtle text-xs text-electric-teal font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Enterprise Sandbox Live
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-5xl text-soft-ivory leading-tight mb-6">
            Experience the Future of <br />
            <span className="text-gradient-teal">Autonomous Procurement Intelligence</span>
          </h2>

          <p className="text-base text-silver-sage max-w-2xl mx-auto mb-10 leading-relaxed">
            Test the live demo merchant account with 20 real electronic inventory items, active stockout scenarios, multi-supplier quotations, and genuine PayPal sandbox settlement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/overview">
              <Button size="xl" className="gap-3 shadow-teal-subtle font-bold">
                Launch Merchant Dashboard
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="secondary" size="xl" className="gap-2 font-mono">
                Sign In with Demo Account
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-xs text-silver-sage font-mono">
            Demo Credentials Pre-configured: <strong className="text-soft-ivory">demo@supplymind.ai</strong> / <strong className="text-soft-ivory">Demo@2024!</strong>
          </div>
        </div>
      </section>

      {/* ─── 8. LUXURY FOOTER ────────────────────────────────────────────────── */}
      <footer id="about" className="border-t border-border-subtle bg-graphite py-14 text-xs text-silver-sage">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-surface border border-electric-teal/40 flex items-center justify-center text-electric-teal font-display font-bold text-sm">
                  S
                </div>
                <span className="font-display font-bold text-sm text-soft-ivory tracking-wide">
                  SUPPLYMIND AI
                </span>
              </div>
              <p className="leading-relaxed mb-4">
                Enterprise autonomous supply chain intelligence and PayPal-powered procurement platform.
              </p>
              <div className="text-[11px] text-silver-sage font-mono">
                Graphite & Electric Teal Architecture
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-soft-ivory mb-3 uppercase tracking-wider text-[11px] font-mono">
                Platform Modules
              </h5>
              <ul className="space-y-2">
                <li><Link href="/dashboard/overview" className="hover:text-electric-teal transition-colors">Overview Dashboard</Link></li>
                <li><Link href="/dashboard/inventory" className="hover:text-electric-teal transition-colors">Inventory Intelligence</Link></li>
                <li><Link href="/dashboard/suppliers" className="hover:text-electric-teal transition-colors">Supplier Quotations</Link></li>
                <li><Link href="/dashboard/negotiations" className="hover:text-electric-teal transition-colors">AI Negotiation</Link></li>
                <li><Link href="/dashboard/procurement" className="hover:text-electric-teal transition-colors">Decision Engine</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-soft-ivory mb-3 uppercase tracking-wider text-[11px] font-mono">
                Governance & Rails
              </h5>
              <ul className="space-y-2">
                <li><Link href="/dashboard/approval" className="hover:text-electric-teal transition-colors">Merchant Approval Gate</Link></li>
                <li><Link href="/dashboard/checkout" className="hover:text-electric-teal transition-colors">PayPal Orders v2</Link></li>
                <li><Link href="/dashboard/tracking" className="hover:text-electric-teal transition-colors">Audit & Logistics Tracking</Link></li>
                <li><Link href="/dashboard/settings" className="hover:text-electric-teal transition-colors">Procurement Policies</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-soft-ivory mb-3 uppercase tracking-wider text-[11px] font-mono">
                Security & Sandbox
              </h5>
              <p className="leading-relaxed mb-3">
                Operates on PayPal Sandbox API environment. All money movement requires explicit merchant approval.
              </p>
              <div className="p-3 rounded-lg bg-charcoal border border-border-subtle text-[11px] font-mono">
                <span className="text-success font-bold block mb-1">● Sandbox Mode Active</span>
                <span>PCI-DSS & SOC-2 compliance architecture</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              © 2024 SUPPLYMIND AI Systems Inc. All rights reserved.
            </div>
            <div className="flex gap-6 font-mono">
              <span className="hover:text-soft-ivory cursor-pointer">Privacy Policy</span>
              <span className="hover:text-soft-ivory cursor-pointer">Terms of Service</span>
              <span className="hover:text-soft-ivory cursor-pointer">Security Whitepaper</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
