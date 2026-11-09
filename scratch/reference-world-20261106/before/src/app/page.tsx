"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import SupplyChain3D from "@/components/three/SupplyChain3D";
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
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="landing-page min-h-screen bg-graphite text-soft-ivory selection:bg-electric-teal/20 selection:text-electric-teal font-sans antialiased overflow-x-hidden">
      {/* ─── FLOATING TRANSLUCENT NAVBAR ──────────────────────────────────── */}
      <Navbar />

      {/* ─── 1. CINEMATIC HERO SECTION ────────────────────────────────────────── */}
      <section id="hero" className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden border-b border-border-subtle">
        {/* Subtle Architectural Backlight (Restrained Teal & Charcoal) */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-teal/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-12 right-12 w-[400px] h-[400px] bg-charcoal/80 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hero Text (~45% width) */}
            <div className="hero-copy lg:col-span-6 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-charcoal border border-border-subtle backdrop-blur-md mb-6">
                <span className="w-2 h-2 rounded-full bg-electric-teal animate-pulse" />
                <span className="text-xs font-mono font-semibold text-electric-teal uppercase tracking-widest">
                  Autonomous Procurement Intelligence
                </span>
              </div>

              <h1 className="hero-title font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-soft-ivory leading-[1.08] tracking-tight mb-6">
                Procurement Intelligence That Moves{" "}
                <span className="text-gradient-teal">Before Shortages Happen.</span>
              </h1>

              <p className="text-base sm:text-lg text-silver-sage leading-relaxed max-w-xl mb-8">
                SUPPLYMIND AI predicts inventory shortages, evaluates suppliers, negotiates purchasing terms, and connects approved procurement decisions to secure PayPal payments.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-12">
                <Link href="#product">
                  <Button size="lg" variant="default" className="w-full sm:w-auto gap-3 text-base shadow-teal-subtle">
                    Explore the Platform
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/dashboard/overview">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2 text-base font-mono">
                    <span>Launch Dashboard</span>
                    <Badge variant="default" className="text-[10px] py-0 px-1.5">
                      LIVE
                    </Badge>
                  </Button>
                </Link>
              </div>

              {/* Technical Telemetry Row */}
              <div className="hero-metrics grid grid-cols-3 gap-6 pt-6 border-t border-border-subtle w-full max-w-lg font-mono">
                <div>
                  <div className="text-2xl font-bold text-electric-teal">99.4%</div>
                  <div className="text-xs text-silver-sage mt-0.5">Prediction Precision</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-soft-ivory">-11.2%</div>
                  <div className="text-xs text-silver-sage mt-0.5">COGS Arbitrage</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">100%</div>
                  <div className="text-xs text-silver-sage mt-0.5">Merchant Approved</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Logistics Assembly (~55% width) */}
            <div className="hero-visual lg:col-span-6 relative">
              <div className="digital-twin-frame relative">
                <SupplyChain3D />
                <div className="scene-caption absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-silver-sage bg-graphite/90 px-4 py-2.5 rounded-xl border border-border-subtle font-mono">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-electric-teal" />
                    Three.js Architectural Facility: Shenzhen · Munich · California
                  </span>
                  <span className="text-electric-teal">Interactive WebGL</span>
                </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Predict Shortages",
                desc: "Live inventory telemetry continuously scans sales velocity against dynamic safety thresholds to detect stockout exposure.",
                tag: "Telemetry",
              },
              {
                step: "02",
                title: "Source Suppliers",
                desc: "Simultaneous quote ingestion across international supplier networks (Shenzhen, California, Munich).",
                tag: "Multi-Source",
              },
              {
                step: "03",
                title: "AI Negotiation",
                desc: "Algorithmic counteroffers bounded by deterministic gross margin floors and volume tier leverage.",
                tag: "Bounded AI",
              },
              {
                step: "04",
                title: "Decision Engine",
                desc: "Multi-attribute scoring evaluates price (40%), lead time (25%), reliability (20%), and bulk concessions (15%).",
                tag: "Optimization",
              },
              {
                step: "05",
                title: "Merchant Approval",
                desc: "Mandatory human-in-the-loop sign-off. AI cannot initiate money movement without explicit merchant approval.",
                tag: "Compliance",
              },
              {
                step: "06",
                title: "PayPal Sandbox Pay",
                desc: "PayPal Orders v2 sandbox checkout with cryptographic idempotency keys, capture hooks, and verified responses.",
                tag: "Fintech",
              },
              {
                step: "07",
                title: "Logistics Tracking",
                desc: "Real-time dispatch tracking, air transit telemetry, and immutable transaction audit log preservation.",
                tag: "Fulfillment",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border-subtle bg-charcoal p-6 flex flex-col justify-between hover:border-electric-teal/50 transition-all duration-300 group"
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
      <section id="paypal-security" className="py-28 bg-graphite border-b border-border-subtle">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Architecture Box */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-border-subtle bg-charcoal p-6 sm:p-8 shadow-2xl relative font-mono text-xs">
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#003087]/30 border border-[#0079C1]/40 flex items-center justify-center text-[#0079C1] font-bold text-base font-display">
                      PP
                    </div>
                    <div>
                      <h4 className="font-bold text-soft-ivory text-base font-sans">PayPal Orders v2 Sandbox Rails</h4>
                      <p className="text-xs text-silver-sage">Server-Side Authorization & Capture</p>
                    </div>
                  </div>
                  <Badge variant="success">SANDBOX VERIFIED</Badge>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 rounded-lg bg-graphite border border-border-subtle text-silver-sage">
                    <span className="text-electric-teal">POST</span> /v2/checkout/orders
                    <div className="text-[11px] text-success mt-1">Status: 201 Created · Idempotency Key Injected</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-graphite border border-border-subtle text-silver-sage">
                    <span className="text-electric-teal">POST</span> /v2/checkout/orders/{'{id}'}/capture
                    <div className="text-[11px] text-success mt-1">Status: 200 OK · Capture ID: 2UG93021XP9910</div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-graphite border border-border-subtle text-silver-sage">
                    <span className="text-electric-teal">AUDIT RECORD</span> #AUD-99120
                    <div className="text-[11px] text-soft-ivory mt-1">Merchant Sign-off Verified · Signature Cryptographically Bound</div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-silver-sage">
                  <span>Merchant Sandbox: supplymind-buyer@sandbox.com</span>
                  <span className="text-electric-teal font-bold">Zero Client Secrets</span>
                </div>
              </div>
            </div>

            {/* Narrative Explanation */}
            <div className="lg:col-span-6">
              <span className="text-xs font-mono font-semibold text-electric-teal uppercase tracking-widest block mb-2">
                Fintech Governance
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-soft-ivory mb-6 leading-tight">
                PayPal Sandbox Integration <br />
                <span className="text-silver-sage font-normal">With Zero Unauthorized Money Movement</span>
              </h2>
              <p className="text-silver-sage text-sm leading-relaxed mb-6">
                Unlike decorative mock checkouts, SUPPLYMIND AI executes actual PayPal Orders v2 sandbox transactions. The AI generates purchasing recommendations, but money movement requires explicit merchant approval and server-side secret protection.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-electric-teal shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-soft-ivory">Secrets Never Exposed to Client</h5>
                    <p className="text-xs text-silver-sage mt-0.5">PayPal client credentials remain exclusively on the FastAPI backend server with zero browser leakage.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-electric-teal shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-soft-ivory">Cryptographic Idempotency</h5>
                    <p className="text-xs text-silver-sage mt-0.5">Every order creation injects a unique UUID `PayPal-Request-Id` preventing duplicate charges even on flaky networks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-electric-teal shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-soft-ivory">Strict Merchant Approval Gate</h5>
                    <p className="text-xs text-silver-sage mt-0.5">No order can be paid for until the merchant explicitly clicks &lsquo;Approve Order&rsquo; in the dashboard.</p>
                  </div>
                </div>
              </div>

              <Link href="/dashboard/approval">
                <Button variant="default" className="gap-2">
                  Inspect Purchase Approval Flow
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
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
