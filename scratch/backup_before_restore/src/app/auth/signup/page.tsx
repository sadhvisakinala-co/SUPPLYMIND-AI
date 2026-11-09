"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  User,
  Building,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      await register(email, password, fullName, companyName);
      router.push("/dashboard/overview");
    } catch (err: any) {
      setError(
        err.detail || err.message || "Failed to create merchant account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#061011] flex flex-col lg:flex-row text-[#F4F7F4] selection:bg-[#4ED8AF]/20 selection:text-[#4ED8AF] font-sans">
      {/* ─── LEFT: 55% QUIET LUXURY EDITORIAL SHOWCASE ────────── */}
      <div className="lg:w-[55%] relative bg-gradient-to-br from-[#0B191B] via-[#061011] to-[#080B0C] p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#F4F7F4]/[0.08] overflow-hidden">
        <div className="absolute top-12 left-12 w-96 h-96 bg-[#4ED8AF]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-12 right-12 w-96 h-96 bg-[#254D4C]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#173034] border border-[#F4F7F4]/[0.08] flex items-center justify-center p-0.5 shadow-mint-subtle">
              <div className="w-full h-full bg-[#061011] rounded-[8px] flex items-center justify-center relative overflow-hidden">
                <span className="font-display font-extrabold text-lg text-[#4ED8AF]">S</span>
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#4ED8AF] animate-ping" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold tracking-tight text-base text-[#F4F7F4]">
                SUPPLYMIND <span className="text-[#4ED8AF] text-xs px-1.5 py-0.5 rounded bg-[#4ED8AF]/10 border border-[#4ED8AF]/30 font-mono font-semibold">AI</span>
              </span>
              <span className="text-[10px] text-[#708784] tracking-widest uppercase font-mono">
                Autonomous Procurement OS
              </span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 my-12 lg:my-0 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173034] border border-[#F4F7F4]/[0.08] text-xs text-[#4ED8AF] font-mono mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enterprise Merchant Onboarding</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F4F7F4] leading-tight mb-6 tracking-tight">
            Autonomous procurement <br />
            <span className="text-[#4ED8AF]">built for high scale.</span>
          </h1>

          <p className="text-[#A6B8B5] text-sm sm:text-base leading-relaxed mb-8 font-sans">
            Create an enterprise merchant workspace in seconds. Connect your inventory catalog, configure gross margin guardrails, and let bounded AI agents safeguard your supply chain.
          </p>

          <div className="space-y-3.5 pt-6 border-t border-[#F4F7F4]/[0.08] font-mono text-xs text-[#A6B8B5]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4ED8AF] shrink-0" />
              <span>Real-time stockout probability calculation and EOQ sizing</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4ED8AF] shrink-0" />
              <span>Bounded AI negotiation agents with price concession bounds</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4ED8AF] shrink-0" />
              <span>Mandatory merchant approval before PayPal sandbox checkout</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#708784] flex items-center justify-between font-mono">
          <span>Enterprise Grade Security</span>
          <span className="text-[#4ED8AF]">Instant Workspace Provisioning</span>
        </div>
      </div>

      {/* ─── RIGHT: 45% SIGN UP FORM ───────────────────────────────────────── */}
      <div className="lg:w-[45%] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#061011]">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F4F7F4] mb-2 tracking-tight">
              Create Merchant Account
            </h2>
            <p className="text-sm text-[#A6B8B5]">
              Deploy your autonomous procurement intelligence environment.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#2e1717] border border-[#D77979]/50 flex items-start gap-3 text-[#D77979] text-xs animate-fade-in font-mono">
              <AlertCircle className="w-4 h-4 text-[#D77979] shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A6B8B5] mb-1.5 font-mono">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#708784] absolute left-3.5 top-3.5" />
                <Input
                  type="text"
                  required
                  placeholder="Alex Chen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 font-sans text-xs bg-[#0B191B] border-[#F4F7F4]/[0.08] text-[#F4F7F4] rounded-xl h-11 focus:border-[#4ED8AF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A6B8B5] mb-1.5 font-mono">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#708784] absolute left-3.5 top-3.5" />
                <Input
                  type="email"
                  required
                  placeholder="alex.chen@techflow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 font-mono text-xs bg-[#0B191B] border-[#F4F7F4]/[0.08] text-[#F4F7F4] rounded-xl h-11 focus:border-[#4ED8AF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A6B8B5] mb-1.5 font-mono">
                Company / Merchant Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-[#708784] absolute left-3.5 top-3.5" />
                <Input
                  type="text"
                  required
                  placeholder="TechFlow Electronics Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="pl-10 font-sans text-xs bg-[#0B191B] border-[#F4F7F4]/[0.08] text-[#F4F7F4] rounded-xl h-11 focus:border-[#4ED8AF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A6B8B5] mb-1.5 font-mono">
                Password (min. 8 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#708784] absolute left-3.5 top-3.5" />
                <Input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 font-mono text-xs bg-[#0B191B] border-[#F4F7F4]/[0.08] text-[#F4F7F4] rounded-xl h-11 focus:border-[#4ED8AF]"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 shadow-mint-subtle text-xs font-bold mt-4 bg-[#4ED8AF] text-[#061011] hover:bg-[#4ED8AF]/90 rounded-xl h-11 font-mono"
              isLoading={loading}
            >
              Initialize Workspace
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#F4F7F4]/[0.08] text-center text-xs text-[#A6B8B5]">
            Already registered?{" "}
            <Link href="/auth/signin" className="text-[#4ED8AF] font-semibold hover:underline">
              Sign in with existing credentials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
