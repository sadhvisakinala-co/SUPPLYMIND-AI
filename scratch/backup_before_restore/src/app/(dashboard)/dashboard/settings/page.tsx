"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings,
  ShieldCheck,
  User,
  Building,
  Mail,
  Key,
  Sliders,
  CheckCircle2,
  Lock,
  Sparkles,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";
import { PageEntrance } from "@/components/ui/motion";

export default function SettingsPage() {
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || "Alex Chen");
  const [companyName, setCompanyName] = useState(user?.company_name || "TechFlow Electronics Ltd");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Policy states
  const [autoApproveLimit, setAutoApproveLimit] = useState("5000");
  const [minMargin, setMinMargin] = useState("35");
  const [maxLeadTime, setMaxLeadTime] = useState("21");

  // Reset demo state
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await api.put("/api/settings/profile", {
        full_name: fullName,
        company_name: companyName,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDemo = async () => {
    if (!confirm("Are you sure you want to reset the synthetic demo scenario? This restores ELEC-005 stockout state and re-arms PO-2024-00892 for testing.")) {
      return;
    }
    setResetting(true);
    setResetMessage(null);
    try {
      const res = await api.post<any>("/api/settings/reset-demo", {});
      setResetMessage(res.data?.message || "Demo scenario restored successfully.");
      setTimeout(() => setResetMessage(null), 5000);
    } catch (err: any) {
      alert(err.detail || err.message || "Failed to reset demo scenario");
    } finally {
      setResetting(false);
    }
  };

  return (
    <PageEntrance className="space-y-8 max-w-5xl font-sans">
      {/* Title */}
      <div>
        <span className="text-xs font-mono font-semibold text-[#79E7C7] uppercase tracking-widest block mb-1">
          Merchant Governance & Policies
        </span>
        <h2 className="font-display font-bold text-3xl md:text-4xl font-bold font-display text-[#F4F7F4] tracking-tight">
          System Settings & Guardrails
        </h2>
        <p className="text-sm text-[#A6B8B5] mt-1 font-sans">
          Configure autonomous agent boundaries, procurement spend limits, and PayPal API credentials.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-[#172c23] border border-[#5FC7A1]/50 flex items-center gap-3 text-[#5FC7A1] text-xs font-mono animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#5FC7A1] shrink-0" />
          <span>Merchant settings updated successfully. Guardrails active.</span>
        </div>
      )}

      {resetMessage && (
        <div className="p-4 rounded-2xl bg-[#172c23] border border-[#5FC7A1]/50 flex items-center gap-3 text-[#5FC7A1] text-xs font-mono animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-[#5FC7A1] shrink-0" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* ─── 1. RESET DEMO SCENARIO ────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#173034]/90 via-[#0B191B]/90 to-[#061011] border border-[rgba(154,231,207,0.12)] shadow-sm backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-semibold text-base text-[#F4F7F4] flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#79E7C7]" />
              Reset Demo Scenario
            </h3>
            <p className="text-xs text-[#A6B8B5] mt-1 max-w-xl font-mono leading-relaxed">
              Restores the synthetic electronics merchant environment: sets ELEC-005 back to 0 units (urgent stockout) and re-arms PO-2024-00892 in the Approval Gate.
            </p>
          </div>

          <Button
            onClick={handleResetDemo}
            isLoading={resetting}
            variant="outline"
            size="sm"
            className="shrink-0 font-mono text-xs gap-1.5 border-[#79E7C7]/40 text-[#79E7C7] hover:bg-[#79E7C7]/10 rounded-xl h-9"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo Data
          </Button>
        </div>
      </div>

      {/* ─── 2. MERCHANT PROFILE ───────────────────────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B191B]/90 border border-[rgba(154,231,207,0.12)] shadow-sm backdrop-blur-md">
        <h3 className="font-display font-semibold text-lg text-[#F4F7F4] mb-6 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#173034] border border-[#79E7C7]/30 flex items-center justify-center text-[#79E7C7]">
            <User className="w-4 h-4" />
          </div>
          <span>Merchant Profile Information</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl font-mono">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A6B8B5] mb-1.5 font-mono">
              Full Legal Name
            </label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="text-xs h-10 font-sans bg-[#061011] border-[rgba(154,231,207,0.12)] text-[#F4F7F4] rounded-xl focus:border-[#79E7C7]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A6B8B5] mb-1.5 font-mono">
              Company / Merchant Name
            </label>
            <Input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="text-xs h-10 font-sans bg-[#061011] border-[rgba(154,231,207,0.12)] text-[#F4F7F4] rounded-xl focus:border-[#79E7C7]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A6B8B5] mb-1.5 font-mono">
              Registered Merchant Email
            </label>
            <Input
              type="email"
              disabled
              value={user?.email || "demo@supplymind.ai"}
              className="bg-[#061011] border-[rgba(154,231,207,0.12)] text-[#708784] text-xs h-10 cursor-not-allowed font-mono rounded-xl"
            />
          </div>

          <Button
            type="submit"
            isLoading={saving}
            className="text-xs shadow-[0_0_24px_rgba(84,201,179,0.25)] gap-1.5 mt-2 font-mono font-bold bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 rounded-xl h-10 px-5"
          >
            Save Profile Changes
          </Button>
        </form>
      </div>

      {/* ─── 3. AUTONOMOUS AGENT PROCUREMENT GUARDRAILS ───────────────────── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B191B]/90 border border-[rgba(154,231,207,0.12)] shadow-sm backdrop-blur-md">
        <h3 className="font-display font-semibold text-lg text-[#F4F7F4] mb-2 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#173034] border border-[#79E7C7]/30 flex items-center justify-center text-[#79E7C7]">
            <Sliders className="w-4 h-4" />
          </div>
          <span>Autonomous Negotiation & Spend Policies</span>
        </h3>
        <p className="text-xs text-[#A6B8B5] mb-6 leading-relaxed font-sans">
          These deterministic rules constrain all AI counteroffer formulas and govern when merchant approval is strictly enforced.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
          <div className="p-5 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.12)] space-y-2">
            <label className="block text-xs font-bold text-[#F4F7F4] font-sans">
              Max Pre-Approval Spend ($)
            </label>
            <Input
              type="number"
              value={autoApproveLimit}
              onChange={(e) => setAutoApproveLimit(e.target.value)}
              className="text-[#79E7C7] font-mono font-bold text-sm h-9 bg-[#0B191B] border-[rgba(154,231,207,0.12)] rounded-lg"
            />
            <p className="text-[11px] text-[#A6B8B5] font-sans">
              Orders above $5,000 always require manual merchant sign-off.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.12)] space-y-2">
            <label className="block text-xs font-bold text-[#F4F7F4] font-sans">
              Minimum Target Margin (%)
            </label>
            <Input
              type="number"
              value={minMargin}
              onChange={(e) => setMinMargin(e.target.value)}
              className="text-[#79E7C7] font-mono font-bold text-sm h-9 bg-[#0B191B] border-[rgba(154,231,207,0.12)] rounded-lg"
            />
            <p className="text-[11px] text-[#A6B8B5] font-sans">
              AI negotiations reject counteroffers violating gross margin floor.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.12)] space-y-2">
            <label className="block text-xs font-bold text-[#F4F7F4] font-sans">
              Maximum Lead Time (Days)
            </label>
            <Input
              type="number"
              value={maxLeadTime}
              onChange={(e) => setMaxLeadTime(e.target.value)}
              className="text-[#79E7C7] font-mono font-bold text-sm h-9 bg-[#0B191B] border-[rgba(154,231,207,0.12)] rounded-lg"
            />
            <p className="text-[11px] text-[#A6B8B5] font-sans">
              Excludes quotations with dispatch schedules longer than threshold.
            </p>
          </div>
        </div>
      </div>

      {/* ─── 4. PAYPAL SANDBOX RAILS CONFIGURATION ─────────────────────────── */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0B191B]/90 border border-[rgba(154,231,207,0.12)] shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(154,231,207,0.12)] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003087]/30 border border-[#0079C1]/40 flex items-center justify-center text-[#0079C1] font-bold font-display text-lg">
              PP
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg text-[#F4F7F4]">
                PayPal Orders v2 Sandbox Integration
              </h3>
              <p className="text-xs text-[#A6B8B5] font-mono">Cryptographic server-side keys & webhook verification</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#5FC7A1]/15 text-[#5FC7A1] border border-[#5FC7A1]/30">
            SANDBOX VERIFIED
          </span>
        </div>

        <div className="space-y-4 max-w-xl text-xs font-mono">
          <div>
            <label className="block text-[#A6B8B5] font-semibold uppercase tracking-wider mb-1.5 font-sans text-[11px]">
              PayPal Environment
            </label>
            <div className="p-3 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.12)] text-[#79E7C7]">
              https://api-m.sandbox.paypal.com
            </div>
          </div>

          <div>
            <label className="block text-[#A6B8B5] font-semibold uppercase tracking-wider mb-1.5 font-sans text-[11px]">
              Active Client ID
            </label>
            <div className="p-3 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.12)] text-[#F4F7F4]">
              sb (Sandbox Default Test Pair)
            </div>
          </div>

          <div>
            <label className="block text-[#A6B8B5] font-semibold uppercase tracking-wider mb-1.5 font-sans text-[11px]">
              Webhook Security Verification
            </label>
            <div className="p-3 rounded-xl bg-[#061011] border border-[rgba(154,231,207,0.12)] text-[#5FC7A1]">
              Enabled (RSA-SHA256 Signature Validation)
            </div>
          </div>
        </div>
      </div>
    </PageEntrance>
  );
}
