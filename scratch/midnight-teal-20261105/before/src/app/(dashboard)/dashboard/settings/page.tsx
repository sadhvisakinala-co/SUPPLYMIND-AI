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
    <div className="space-y-8 animate-fade-in max-w-5xl font-sans">
      {/* Title */}
      <div>
        <span className="text-xs font-mono font-semibold text-electric-teal uppercase tracking-widest block mb-1">
          Merchant Governance & Policies
        </span>
        <h2 className="font-display font-bold text-3xl text-soft-ivory">
          System Settings & Guardrails
        </h2>
        <p className="text-xs text-silver-sage mt-1 font-mono">
          Configure autonomous agent boundaries, procurement spend limits, and PayPal API credentials.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-[#172c23] border border-success/50 flex items-center gap-3 text-success text-xs font-mono animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          <span>Merchant settings updated successfully. Guardrails active.</span>
        </div>
      )}

      {resetMessage && (
        <div className="p-4 rounded-xl bg-[#172c23] border border-success/50 flex items-center gap-3 text-success text-xs font-mono animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* ─── 1. RESET DEMO SCENARIO ────────────────────────────────────────── */}
      <Card variant="default" className="border-border-subtle p-6 sm:p-8 bg-gradient-to-r from-surface to-charcoal">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-base text-soft-ivory flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-electric-teal" />
              Reset Demo Scenario
            </h3>
            <p className="text-xs text-silver-sage mt-1 max-w-xl font-mono leading-relaxed">
              Restores the synthetic electronics merchant environment: sets ELEC-005 back to 0 units (urgent stockout) and re-arms PO-2024-00892 in the Approval Gate.
            </p>
          </div>

          <Button
            onClick={handleResetDemo}
            isLoading={resetting}
            variant="outline"
            size="sm"
            className="shrink-0 font-mono text-xs gap-1.5 border-electric-teal/40 text-electric-teal hover:bg-electric-teal/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Demo Data
          </Button>
        </div>
      </Card>

      {/* ─── 2. MERCHANT PROFILE ───────────────────────────────────────────── */}
      <Card variant="default" className="border-border-subtle p-6 sm:p-8">
        <h3 className="font-display font-bold text-lg text-soft-ivory mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-electric-teal" />
          Merchant Profile Information
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-silver-sage mb-1.5 font-mono">
              Full Legal Name
            </label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="text-xs h-10 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-silver-sage mb-1.5 font-mono">
              Company / Merchant Name
            </label>
            <Input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="text-xs h-10 font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-silver-sage mb-1.5 font-mono">
              Registered Merchant Email
            </label>
            <Input
              type="email"
              disabled
              value={user?.email || "demo@supplymind.ai"}
              className="bg-graphite border-border-subtle text-silver-sage text-xs h-10 cursor-not-allowed font-mono"
            />
          </div>

          <Button
            type="submit"
            isLoading={saving}
            className="text-xs shadow-teal-subtle gap-1.5 mt-2 font-mono font-bold"
          >
            Save Profile Changes
          </Button>
        </form>
      </Card>

      {/* ─── 3. AUTONOMOUS AGENT PROCUREMENT GUARDRAILS ───────────────────── */}
      <Card variant="default" className="border-border-subtle p-6 sm:p-8">
        <h3 className="font-display font-bold text-lg text-soft-ivory mb-2 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-electric-teal" />
          Autonomous Negotiation & Spend Policies
        </h3>
        <p className="text-xs text-silver-sage mb-6 leading-relaxed">
          These deterministic rules constrain all AI counteroffer formulas and govern when merchant approval is strictly enforced.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
          <div className="p-4 rounded-xl bg-graphite border border-border-subtle space-y-2">
            <label className="block text-xs font-bold text-soft-ivory font-sans">
              Max Pre-Approval Spend ($)
            </label>
            <Input
              type="number"
              value={autoApproveLimit}
              onChange={(e) => setAutoApproveLimit(e.target.value)}
              className="text-electric-teal font-mono font-bold text-sm h-9"
            />
            <p className="text-[11px] text-silver-sage font-sans">
              Orders above $5,000 always require manual merchant sign-off.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-graphite border border-border-subtle space-y-2">
            <label className="block text-xs font-bold text-soft-ivory font-sans">
              Minimum Target Margin (%)
            </label>
            <Input
              type="number"
              value={minMargin}
              onChange={(e) => setMinMargin(e.target.value)}
              className="text-electric-teal font-mono font-bold text-sm h-9"
            />
            <p className="text-[11px] text-silver-sage font-sans">
              AI negotiations reject counteroffers violating gross margin floor.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-graphite border border-border-subtle space-y-2">
            <label className="block text-xs font-bold text-soft-ivory font-sans">
              Maximum Lead Time (Days)
            </label>
            <Input
              type="number"
              value={maxLeadTime}
              onChange={(e) => setMaxLeadTime(e.target.value)}
              className="text-electric-teal font-mono font-bold text-sm h-9"
            />
            <p className="text-[11px] text-silver-sage font-sans">
              Excludes quotations with dispatch schedules longer than threshold.
            </p>
          </div>
        </div>
      </Card>

      {/* ─── 4. PAYPAL SANDBOX RAILS CONFIGURATION ─────────────────────────── */}
      <Card variant="default" className="border-border-subtle p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#003087]/30 border border-[#0079C1]/40 flex items-center justify-center text-[#0079C1] font-bold font-display text-lg">
              PP
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-soft-ivory">
                PayPal Orders v2 Sandbox Integration
              </h3>
              <p className="text-xs text-silver-sage font-mono">Cryptographic server-side keys & webhook verification</p>
            </div>
          </div>
          <Badge variant="success">SANDBOX VERIFIED</Badge>
        </div>

        <div className="space-y-4 max-w-xl text-xs font-mono">
          <div>
            <label className="block text-silver-sage font-semibold uppercase tracking-wider mb-1 font-sans">
              PayPal Environment
            </label>
            <div className="p-2.5 rounded-lg bg-graphite border border-border-subtle text-electric-teal">
              https://api-m.sandbox.paypal.com
            </div>
          </div>

          <div>
            <label className="block text-silver-sage font-semibold uppercase tracking-wider mb-1 font-sans">
              Active Client ID
            </label>
            <div className="p-2.5 rounded-lg bg-graphite border border-border-subtle text-soft-ivory">
              sb (Sandbox Default Test Pair)
            </div>
          </div>

          <div>
            <label className="block text-silver-sage font-semibold uppercase tracking-wider mb-1 font-sans">
              Webhook Security Verification
            </label>
            <div className="p-2.5 rounded-lg bg-graphite border border-border-subtle text-success">
              Enabled (RSA-SHA256 Signature Validation)
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
