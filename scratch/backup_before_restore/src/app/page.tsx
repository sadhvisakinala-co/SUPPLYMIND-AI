"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import SupplyChain3D from "@/components/three/SupplyChain3D";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Bot,
  CreditCard,
  Boxes,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  PageEntrance,
  StaggerContainer,
  StaggerItem,
  SpotlightCard,
  MagneticCTA,
} from "@/components/ui/motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#061011] text-[#F4F7F4] selection:bg-[#79E7C7]/25 selection:text-[#79E7C7] font-sans antialiased overflow-x-hidden">
      {/* ─── REFINED EDITORIAL NAVBAR ────────────────────────────────────────── */}
      <Navbar />

      {/* ─── HERO SECTION: OBSIDIAN LUXE TWO-COLUMN COMPOSITION ──────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden border-b border-[rgba(154,231,207,0.12)]">
        {/* Soft Ambient Radial Lighting */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#79E7C7]/5 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-[#102326]/50 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Side: Editorial Serif Headline (72–88px) & CTAs with Stagger Reveal */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              <StaggerContainer>
                {/* Refined Eyebrow Pill */}
                <StaggerItem>
                  <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0B191B] border border-[rgba(154,231,207,0.15)] mb-8 shadow-mint-subtle">
                    <span className="w-2 h-2 rounded-full bg-[#79E7C7] animate-pulse" />
                    <span className="text-xs font-mono font-medium text-[#79E7C7] tracking-wider uppercase">
                      Autonomous Procurement Operating System
                    </span>
                  </div>
                </StaggerItem>

                {/* Elegant Serif Headline broken naturally into 3 lines (72-88px) */}
                <StaggerItem>
                  <h1 className="font-serif font-normal text-5xl sm:text-7xl lg:text-[80px] text-[#F4F7F4] leading-[1.04] tracking-[-0.025em] mb-8">
                    AI-Powered<br />
                    Procurement<br />
                    <span className="text-gradient-mint">Intelligence</span>
                  </h1>
                </StaggerItem>

                {/* Supporting description */}
                <StaggerItem>
                  <p className="text-base sm:text-lg text-[#A6B8B5] leading-relaxed max-w-xl mb-10 font-sans">
                    From demand forecasting to supplier negotiation and procurement execution — one intelligent operating system for modern businesses.
                  </p>
                </StaggerItem>

                {/* Primary & Secondary CTAs with Magnetic Attraction */}
                <StaggerItem>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-12">
                    <MagneticCTA>
                      <Link href="/dashboard/overview" className="block">
                        <Button
                          size="lg"
                          className="w-full sm:w-auto gap-2.5 text-sm font-semibold h-12 px-8 bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 shadow-[0_0_24px_rgba(121,231,199,0.25)] rounded-2xl transition-all"
                        >
                          <span>Get Started</span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </MagneticCTA>

                    <MagneticCTA>
                      <Link href="#solutions" className="block">
                        <Button
                          variant="secondary"
                          size="lg"
                          className="w-full sm:w-auto text-sm font-medium h-12 px-7 bg-[#0B191B] border border-[rgba(154,231,207,0.15)] text-[#F4F7F4] hover:bg-[#102326] hover:border-[#79E7C7]/40 rounded-2xl transition-all"
                        >
                          <span>Explore Platform</span>
                        </Button>
                      </Link>
                    </MagneticCTA>
                  </div>
                </StaggerItem>

                {/* Subtle Trust Indicators */}
                <StaggerItem>
                  <div className="pt-6 border-t border-[rgba(154,231,207,0.12)] w-full max-w-lg flex items-center justify-between text-xs font-mono text-[#A6B8B5]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#79E7C7]" />
                      <span>Human-in-the-Loop Gate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#79E7C7]" />
                      <span>SHA-256 Ledger</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#79E7C7]" />
                      <span>PayPal Orders v2</span>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>

            {/* Right Side: Sophisticated Animated 3D Global Supply Network */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 relative"
            >
              <SupplyChain3D />
            </motion.div>
          </div>
        </div>

        {/* ─── HERO BOTTOM: HORIZONTAL METRIC STRIP WITH SPOTLIGHT ─────────── */}
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 mt-16">
          <SpotlightCard className="p-6 sm:p-8 backdrop-blur-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
              <div>
                <div className="text-xs uppercase text-[#708784] mb-1 font-sans">Managed Catalog</div>
                <div className="text-3xl font-bold text-[#79E7C7] tracking-tight">20 SKUs</div>
                <div className="text-xs text-[#A6B8B5] mt-0.5 font-sans">Consumer Electronics</div>
              </div>

              <div>
                <div className="text-xs uppercase text-[#708784] mb-1 font-sans">Negotiation Model</div>
                <div className="text-3xl font-bold text-[#F4F7F4] tracking-tight">Bounded AI</div>
                <div className="text-xs text-[#A6B8B5] mt-0.5 font-sans">70% Margin Floor Enforced</div>
              </div>

              <div>
                <div className="text-xs uppercase text-[#708784] mb-1 font-sans">Settlement Rail</div>
                <div className="text-3xl font-bold text-[#79E7C7] tracking-tight">Orders v2</div>
                <div className="text-xs text-[#A6B8B5] mt-0.5 font-sans">PayPal Verified Sandbox</div>
              </div>

              <div>
                <div className="text-xs uppercase text-[#708784] mb-1 font-sans">Audit Integrity</div>
                <div className="text-3xl font-bold text-[#5FC7A1] tracking-tight">100% Valid</div>
                <div className="text-xs text-[#A6B8B5] mt-0.5 font-sans">Tamper-Evident SHA-256</div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* ─── 4-PILLAR ARCHITECTURAL SYSTEM SHOWCASE ─────────────────────────── */}
      <section id="solutions" className="py-24 bg-[#061011] border-b border-[rgba(154,231,207,0.12)]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono font-medium text-[#79E7C7] uppercase tracking-widest block mb-3">
              Core Capabilities
            </span>
            <h2 className="font-serif font-normal text-3xl sm:text-4xl text-[#F4F7F4] leading-[1.15] tracking-tight">
              An unbroken continuum from prediction to cryptographic settlement.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <SpotlightCard className="p-7 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#102326] border border-[rgba(154,231,207,0.2)] flex items-center justify-center text-[#79E7C7]">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-lg text-[#F4F7F4]">
                Dynamic Inventory Intelligence
              </h3>
              <p className="text-sm text-[#A6B8B5] leading-relaxed">
                Wilson EOQ models and Poisson depletion tracking detect impending shortages before warehouse stock depletion disrupts operations.
              </p>
            </SpotlightCard>

            {/* Pillar 2 */}
            <SpotlightCard className="p-7 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#102326] border border-[rgba(154,231,207,0.2)] flex items-center justify-center text-[#79E7C7]">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-lg text-[#F4F7F4]">
                Autonomous Multi-Agent Bidding
              </h3>
              <p className="text-sm text-[#A6B8B5] leading-relaxed">
                Buyer and supplier agents conduct strategic counteroffer dialogues governed by strict commercial margin floors and turn caps.
              </p>
            </SpotlightCard>

            {/* Pillar 3 */}
            <SpotlightCard className="p-7 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#102326] border border-[rgba(154,231,207,0.2)] flex items-center justify-center text-[#79E7C7]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-lg text-[#F4F7F4]">
                Human Merchant Governance
              </h3>
              <p className="text-sm text-[#A6B8B5] leading-relaxed">
                AI agents are strictly prohibited from moving money autonomously. Every approved order requires cryptographic merchant sign-off.
              </p>
            </SpotlightCard>

            {/* Pillar 4 */}
            <SpotlightCard className="p-7 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-[#102326] border border-[rgba(154,231,207,0.2)] flex items-center justify-center text-[#79E7C7]">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-lg text-[#F4F7F4]">
                PayPal Orders v2 Rails
              </h3>
              <p className="text-sm text-[#A6B8B5] leading-relaxed">
                Genuine sandbox token creation, idempotency key enforcement, and automated capture verification with SHA-256 state auditing.
              </p>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="py-14 bg-[#0B191B] border-t border-[rgba(154,231,207,0.12)]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#A6B8B5] font-mono">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#F4F7F4] font-sans">SUPPLYMIND AI</span>
            <span>—</span>
            <span>Autonomous Supply Chain Intelligence & Procurement</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard/overview" className="hover:text-[#79E7C7] transition-colors">
              Console
            </Link>
            <Link href="/dashboard/negotiations" className="hover:text-[#79E7C7] transition-colors">
              AI Studio
            </Link>
            <Link href="/dashboard/procurement" className="hover:text-[#79E7C7] transition-colors">
              Decisions
            </Link>
            <Link href="/dashboard/tracking" className="hover:text-[#79E7C7] transition-colors">
              Audit
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
