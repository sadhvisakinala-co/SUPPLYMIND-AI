"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Sliders,
  CheckCircle2,
  RotateCcw,
  ChevronDown,
  Pencil,
  Save,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  // Profile Form States
  const [fullName, setFullName] = useState(user?.full_name || "Alex Chen");
  const [companyName, setCompanyName] = useState(user?.company_name || "TechFlow Electronics Ltd");
  const [businessPhone, setBusinessPhone] = useState("+1 (555) 123-4567");
  const [businessAddress, setBusinessAddress] = useState("123 Innovation Drive, San Jose, CA 95134");
  const [industry, setIndustry] = useState("Electronics & Consumer Goods");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Policy States matching reference image
  const [maxSpend, setMaxSpend] = useState("5000.00");
  const [minMargin, setMinMargin] = useState("15");
  const [maxLeadTime, setMaxLeadTime] = useState("14");
  const [autoApproveThreshold, setAutoApproveThreshold] = useState("500.00");

  // Inline editing state for policy cards
  const [editingPolicy, setEditingPolicy] = useState<string | null>(null);

  // Reset Demo State
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Sync profile when user auth loads
  useEffect(() => {
    if (user) {
      if (user.full_name) setFullName(user.full_name);
      if (user.company_name) setCompanyName(user.company_name);
    }
  }, [user]);

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
    if (
      !confirm(
        "Are you sure you want to reset the synthetic demo scenario? This restores ELEC-005 stockout state and re-arms PO-2024-00892 for testing."
      )
    ) {
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
    <div className="space-y-6 animate-fade-in font-sans pb-16 max-w-[1240px] mx-auto select-none">
      {/* ─── 1. HEADER WITH FLOWING AMBIENT NEON WAVE ─────────────────────── */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
        {/* Subtle decorative neon wave light trail in background */}
        <div className="absolute right-0 -top-6 w-[55%] h-36 pointer-events-none opacity-60 overflow-hidden hidden lg:block z-0">
          <svg viewBox="0 0 640 100" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="settingsWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B9F12F" stopOpacity="0" />
                <stop offset="35%" stopColor="#B9F12F" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#B9F12F" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 65 C 150 15, 290 85, 440 35 C 510 12, 580 30, 640 22"
              stroke="url(#settingsWaveGrad)"
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

        <div className="relative z-10">
          <div className="text-[11px] font-mono font-bold text-[#B9F12F] uppercase tracking-wider mb-1">
            MERCHANT GOVERNANCE &amp; POLICIES
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-[34px] text-[#F2F0E9] tracking-tight leading-none">
            System Settings &amp; Guardrails
          </h1>
          <p className="text-xs sm:text-sm text-[#829DA8] mt-1.5 font-sans">
            Configure autonomous agent boundaries, procurement spend limits, and PayPal API credentials.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 rounded-xl bg-[#10394A] border border-[#B9F12F]/40 flex items-center gap-3 text-[#B9F12F] text-xs font-mono shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#B9F12F] shrink-0" />
          <span>Merchant settings updated successfully. Guardrails active.</span>
        </div>
      )}

      {resetMessage && (
        <div className="p-4 rounded-xl bg-[#10394A] border border-[#B9F12F]/40 flex items-center gap-3 text-[#B9F12F] text-xs font-mono shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#B9F12F] shrink-0" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* ─── 2. RESET DEMO SCENARIO CARD ──────────────────────────────────── */}
      <Card className="rounded-2xl border border-[rgba(150,215,222,0.25)] bg-[#10394A] p-5 sm:p-6 shadow-xl transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full border border-[#B9F12F]/40 bg-[#164657] flex items-center justify-center text-[#B9F12F] shrink-0 shadow-[0_0_12px_rgba(185,241,47,0.25)]">
              <RotateCcw className={`w-5 h-5 ${resetting ? "animate-spin" : ""}`} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#F2F0E9]">
                Reset Demo Scenario
              </h3>
              <p className="text-xs text-[#829DA8] font-mono mt-0.5 leading-relaxed max-w-2xl">
                Restores the synthetic electronics merchant environment: sets ELEC-005 back to 0 units (urgent stockout) and re-arms PO-2024-00892 in the Approval Gate.
              </p>
            </div>
          </div>

          <Button
            onClick={handleResetDemo}
            disabled={resetting}
            variant="outline"
            className="shrink-0 h-9 px-4 rounded-xl border border-[#B9F12F] text-[#B9F12F] bg-transparent hover:bg-[#B9F12F]/10 font-mono text-xs font-bold gap-2 shadow-[0_0_12px_rgba(185,241,47,0.2)] hover:scale-105 active:scale-95 transition-all"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
            <span>Reset Demo Data</span>
          </Button>
        </div>
      </Card>

      {/* ─── 3. MERCHANT PROFILE INFORMATION CARD ─────────────────────────── */}
      <Card className="rounded-2xl border border-[rgba(150,215,222,0.25)] bg-[#10394A] p-6 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2.5 mb-6">
          <User className="w-5 h-5 text-[#B9F12F]" />
          <h3 className="font-display font-bold text-lg text-[#F2F0E9]">
            Merchant Profile Information
          </h3>
        </div>

        <form onSubmit={handleSaveProfile}>
          {/* Responsive 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {/* Column 1: Left */}
            <div className="space-y-5">
              {/* Full Legal Name */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#AFC4CC] mb-2">
                  FULL LEGAL NAME
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-[#829DA8] absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 bg-[#071F30]/80 border border-[rgba(150,215,222,0.25)] focus:border-[#B9F12F] focus:ring-1 focus:ring-[#B9F12F] rounded-xl pl-10 pr-4 text-xs font-sans text-[#F2F0E9] outline-none transition-all shadow-inner"
                    placeholder="Full legal name"
                    required
                  />
                </div>
              </div>

              {/* Company / Merchant Name */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#AFC4CC] mb-2">
                  COMPANY / MERCHANT NAME
                </label>
                <div className="relative flex items-center">
                  <Building2 className="w-4 h-4 text-[#829DA8] absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full h-11 bg-[#071F30]/80 border border-[rgba(150,215,222,0.25)] focus:border-[#B9F12F] focus:ring-1 focus:ring-[#B9F12F] rounded-xl pl-10 pr-4 text-xs font-sans text-[#F2F0E9] outline-none transition-all shadow-inner"
                    placeholder="Company name"
                    required
                  />
                </div>
              </div>

              {/* Registered Merchant Email */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#AFC4CC] mb-2">
                  REGISTERED MERCHANT EMAIL
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#829DA8] absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    disabled
                    value={user?.email || "demo@supplymind.ai"}
                    className="w-full h-11 bg-[#071F30]/40 border border-[rgba(150,215,222,0.15)] rounded-xl pl-10 pr-4 text-xs font-mono text-[#829DA8] cursor-not-allowed select-none"
                  />
                </div>
              </div>
            </div>

            {/* Column 2: Right */}
            <div className="space-y-5">
              {/* Business Phone */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#AFC4CC] mb-2">
                  BUSINESS PHONE
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-[#829DA8] absolute left-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    className="w-full h-11 bg-[#071F30]/80 border border-[rgba(150,215,222,0.25)] focus:border-[#B9F12F] focus:ring-1 focus:ring-[#B9F12F] rounded-xl pl-10 pr-4 text-xs font-mono text-[#F2F0E9] outline-none transition-all shadow-inner"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Business Address */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#AFC4CC] mb-2">
                  BUSINESS ADDRESS
                </label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-[#829DA8] absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    className="w-full h-11 bg-[#071F30]/80 border border-[rgba(150,215,222,0.25)] focus:border-[#B9F12F] focus:ring-1 focus:ring-[#B9F12F] rounded-xl pl-10 pr-4 text-xs font-sans text-[#F2F0E9] outline-none transition-all shadow-inner"
                    placeholder="Business street address, city, state"
                  />
                </div>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-[#AFC4CC] mb-2">
                  INDUSTRY
                </label>
                <div className="relative flex items-center">
                  <Briefcase className="w-4 h-4 text-[#829DA8] absolute left-3.5 pointer-events-none" />
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full h-11 bg-[#071F30]/80 border border-[rgba(150,215,222,0.25)] focus:border-[#B9F12F] focus:ring-1 focus:ring-[#B9F12F] rounded-xl pl-10 pr-10 text-xs font-sans text-[#F2F0E9] outline-none transition-all appearance-none cursor-pointer shadow-inner"
                  >
                    <option value="Electronics & Consumer Goods" className="bg-[#071F30] text-[#F2F0E9]">
                      Electronics &amp; Consumer Goods
                    </option>
                    <option value="Semiconductors & Components" className="bg-[#071F30] text-[#F2F0E9]">
                      Semiconductors &amp; Components
                    </option>
                    <option value="Industrial & Aerospace" className="bg-[#071F30] text-[#F2F0E9]">
                      Industrial &amp; Aerospace
                    </option>
                    <option value="Automotive & Mobility" className="bg-[#071F30] text-[#F2F0E9]">
                      Automotive &amp; Mobility
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#829DA8] absolute right-3.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6">
            <Button
              type="submit"
              disabled={saving}
              className="h-10 px-5 bg-[#B9F12F] hover:bg-[#bef264] text-[#071F30] font-sans font-extrabold text-xs rounded-xl shadow-[0_0_16px_rgba(185,241,47,0.35)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>{saving ? "Saving Changes..." : "Save Profile Changes"}</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* ─── 4. AUTONOMOUS NEGOTIATION & SPEND POLICIES CARD ──────────────── */}
      <Card className="rounded-2xl border border-[rgba(150,215,222,0.25)] bg-[#10394A] p-6 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2.5 mb-1.5">
          <Sliders className="w-5 h-5 text-[#B9F12F]" />
          <h3 className="font-display font-bold text-lg text-[#F2F0E9]">
            Autonomous Negotiation &amp; Spend Policies
          </h3>
        </div>
        <p className="text-xs text-[#829DA8] font-mono mb-6 leading-relaxed">
          These deterministic rules constrain all AI counteroffer formulas and govern where merchant approval is strictly enforced.
        </p>

        {/* 4 Policy Cards Arrangement matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          {/* Policy 1: Max Pre-Approval Spend */}
          <div className="p-4 rounded-xl bg-[#071F30]/75 border border-[rgba(150,215,222,0.2)] hover:border-[#B9F12F]/40 transition-all flex flex-col justify-between h-[88px] group">
            <span className="text-[11px] font-sans text-[#AFC4CC] font-medium truncate">
              Max Pre-Approval Spend ($)
            </span>
            <div className="flex items-baseline justify-between">
              {editingPolicy === "spend" ? (
                <div className="flex items-center gap-1.5 w-full">
                  <span className="text-sm text-[#F2F0E9] font-bold">$</span>
                  <input
                    type="number"
                    value={maxSpend}
                    onChange={(e) => setMaxSpend(e.target.value)}
                    className="w-24 bg-[#10394A] text-[#F2F0E9] border border-[#B9F12F] rounded px-1.5 py-0.5 text-sm font-bold font-mono outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => setEditingPolicy(null)}
                    className="p-1 text-[#B9F12F] hover:bg-[#B9F12F]/20 rounded"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-xl font-extrabold text-[#F2F0E9] tracking-tight">
                    ${Number(maxSpend).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <button
                    onClick={() => setEditingPolicy("spend")}
                    className="opacity-60 group-hover:opacity-100 hover:text-[#B9F12F] transition-opacity"
                    title="Edit Max Pre-Approval Spend"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Policy 2: Minimum Target Margin */}
          <div className="p-4 rounded-xl bg-[#071F30]/75 border border-[rgba(150,215,222,0.2)] hover:border-[#B9F12F]/40 transition-all flex flex-col justify-between h-[88px] group">
            <span className="text-[11px] font-sans text-[#AFC4CC] font-medium truncate">
              Minimum Target Margin (%)
            </span>
            <div className="flex items-baseline justify-between">
              {editingPolicy === "margin" ? (
                <div className="flex items-center gap-1.5 w-full">
                  <input
                    type="number"
                    value={minMargin}
                    onChange={(e) => setMinMargin(e.target.value)}
                    className="w-16 bg-[#10394A] text-[#F2F0E9] border border-[#B9F12F] rounded px-1.5 py-0.5 text-sm font-bold font-mono outline-none"
                    autoFocus
                  />
                  <span className="text-sm text-[#F2F0E9] font-bold">%</span>
                  <button
                    onClick={() => setEditingPolicy(null)}
                    className="p-1 text-[#B9F12F] hover:bg-[#B9F12F]/20 rounded ml-auto"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-xl font-extrabold text-[#F2F0E9] tracking-tight">
                    {minMargin}%
                  </span>
                  <button
                    onClick={() => setEditingPolicy("margin")}
                    className="opacity-60 group-hover:opacity-100 hover:text-[#B9F12F] transition-opacity"
                    title="Edit Minimum Target Margin"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Policy 3: Maximum Lead Time */}
          <div className="p-4 rounded-xl bg-[#071F30]/75 border border-[rgba(150,215,222,0.2)] hover:border-[#B9F12F]/40 transition-all flex flex-col justify-between h-[88px] group">
            <span className="text-[11px] font-sans text-[#AFC4CC] font-medium truncate">
              Maximum Lead Time (Days)
            </span>
            <div className="flex items-baseline justify-between">
              {editingPolicy === "leadTime" ? (
                <div className="flex items-center gap-1.5 w-full">
                  <input
                    type="number"
                    value={maxLeadTime}
                    onChange={(e) => setMaxLeadTime(e.target.value)}
                    className="w-16 bg-[#10394A] text-[#F2F0E9] border border-[#B9F12F] rounded px-1.5 py-0.5 text-sm font-bold font-mono outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => setEditingPolicy(null)}
                    className="p-1 text-[#B9F12F] hover:bg-[#B9F12F]/20 rounded ml-auto"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-xl font-extrabold text-[#F2F0E9] tracking-tight">
                    {maxLeadTime}
                  </span>
                  <button
                    onClick={() => setEditingPolicy("leadTime")}
                    className="opacity-60 group-hover:opacity-100 hover:text-[#B9F12F] transition-opacity"
                    title="Edit Maximum Lead Time"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Policy 4: Auto-Approval Threshold */}
          <div className="p-4 rounded-xl bg-[#071F30]/75 border border-[rgba(150,215,222,0.2)] hover:border-[#B9F12F]/40 transition-all flex flex-col justify-between h-[88px] group">
            <span className="text-[11px] font-sans text-[#AFC4CC] font-medium truncate">
              Auto-Approval Threshold ($)
            </span>
            <div className="flex items-baseline justify-between">
              {editingPolicy === "threshold" ? (
                <div className="flex items-center gap-1.5 w-full">
                  <span className="text-sm text-[#F2F0E9] font-bold">$</span>
                  <input
                    type="number"
                    value={autoApproveThreshold}
                    onChange={(e) => setAutoApproveThreshold(e.target.value)}
                    className="w-24 bg-[#10394A] text-[#F2F0E9] border border-[#B9F12F] rounded px-1.5 py-0.5 text-sm font-bold font-mono outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => setEditingPolicy(null)}
                    className="p-1 text-[#B9F12F] hover:bg-[#B9F12F]/20 rounded"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-xl font-extrabold text-[#F2F0E9] tracking-tight">
                    ${Number(autoApproveThreshold).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <button
                    onClick={() => setEditingPolicy("threshold")}
                    className="opacity-60 group-hover:opacity-100 hover:text-[#B9F12F] transition-opacity"
                    title="Edit Auto-Approval Threshold"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* ─── 5. PAYPAL SANDBOX RAILS INTEGRATION CARD ─────────────────────── */}
      <Card className="rounded-2xl border border-[rgba(150,215,222,0.25)] bg-[#10394A] p-6 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(242,240,233,0.08)] mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#003087]/30 border border-[#0079C1]/40 flex items-center justify-center text-[#0079C1] font-bold font-display text-lg shadow-sm">
              PP
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-[#F2F0E9]">
                PayPal Orders v2 Sandbox Integration
              </h3>
              <p className="text-xs text-[#829DA8] font-mono">
                Cryptographic server-side keys &amp; webhook verification
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#B9F12F]/15 text-[#B9F12F] border border-[#B9F12F]/30 shadow-[0_0_10px_rgba(185,241,47,0.2)]">
            SANDBOX VERIFIED
          </span>
        </div>

        <div className="space-y-4 max-w-xl text-xs font-mono">
          <div>
            <label className="block text-[#AFC4CC] font-sans font-semibold uppercase tracking-wider text-[11px] mb-1.5">
              PayPal Environment
            </label>
            <div className="p-3 rounded-xl bg-[#071F30]/80 border border-[rgba(150,215,222,0.2)] text-[#B9F12F] font-mono">
              https://api-m.sandbox.paypal.com
            </div>
          </div>

          <div>
            <label className="block text-[#AFC4CC] font-sans font-semibold uppercase tracking-wider text-[11px] mb-1.5">
              Active Client ID
            </label>
            <div className="p-3 rounded-xl bg-[#071F30]/80 border border-[rgba(150,215,222,0.2)] text-[#F2F0E9] font-mono">
              sb (Sandbox Default Test Pair)
            </div>
          </div>

          <div>
            <label className="block text-[#AFC4CC] font-sans font-semibold uppercase tracking-wider text-[11px] mb-1.5">
              Webhook Security Verification
            </label>
            <div className="p-3 rounded-xl bg-[#071F30]/80 border border-[rgba(150,215,222,0.2)] text-[#B9F12F] font-mono flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B9F12F]" />
              <span>Enabled (RSA-SHA256 Signature Validation)</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
