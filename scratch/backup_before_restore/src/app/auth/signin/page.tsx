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
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Cpu,
} from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard/overview");
    } catch (err: any) {
      setError(
        err.detail || err.message || "Failed to sign in. Please verify your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail("demo@supplymind.ai");
    setPassword("Demo@2024!");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#061011] flex flex-col lg:flex-row text-[#F4F7F4] selection:bg-[#4ED8AF]/20 selection:text-[#4ED8AF] font-sans">
      {/* ─── LEFT: 55% QUIET LUXURY EDITORIAL SHOWCASE ────────── */}
      <div className="lg:w-[55%] relative bg-gradient-to-br from-[#0B191B] via-[#061011] to-[#080B0C] p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#F4F7F4]/[0.08] overflow-hidden">
        {/* Subtle moving jade ambient light */}
        <div className="absolute top-12 left-12 w-96 h-96 bg-[#4ED8AF]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-12 right-12 w-96 h-96 bg-[#254D4C]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#173034] border border-[#F4F7F4]/[0.08] flex items-center justify-center p-0.5 group-hover:border-[#4ED8AF]/60 transition-colors shadow-mint-subtle">
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

        {/* Narrative & Value Proposition */}
        <div className="relative z-10 my-12 lg:my-0 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#173034] border border-[#F4F7F4]/[0.08] text-xs text-[#4ED8AF] font-mono mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Obsidian Atelier Architecture</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F4F7F4] leading-tight mb-6 tracking-tight">
            Autonomous procurement that moves <br />
            <span className="text-[#4ED8AF]">before shortages happen.</span>
          </h1>

          <p className="text-[#A6B8B5] text-sm sm:text-base leading-relaxed mb-8 font-sans">
            Continuous inventory telemetry, bounded algorithmic negotiation, and PayPal Orders v2 sandbox settlement. One unified operating system for high-velocity merchants.
          </p>

          <div className="space-y-3.5 pt-6 border-t border-[#F4F7F4]/[0.08] font-mono text-xs text-[#A6B8B5]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4ED8AF] shrink-0" />
              <span>20 Pre-configured electronics SKUs with sales velocity models</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4ED8AF] shrink-0" />
              <span>Multi-supplier quotation arbitrage (Shenzhen · Munich · California)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#4ED8AF] shrink-0" />
              <span>End-to-end PayPal Orders v2 Sandbox verification</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-[#708784] flex items-center justify-between font-mono">
          <span>PCI-DSS & SOC-2 Compliant Rail</span>
          <span className="text-[#4ED8AF]">PayPal Sandbox Enabled</span>
        </div>
      </div>

      {/* ─── RIGHT: 45% CLEAN AUTHENTICATION FORM ─────────────────────────── */}
      <div className="lg:w-[45%] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#061011]">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F4F7F4] mb-2 tracking-tight">
              Sign In to Console
            </h2>
            <p className="text-sm text-[#A6B8B5]">
              Access your merchant inventory risk monitoring & procurement engine.
            </p>
          </div>

          {/* Quick Demo Fill Card */}
          <div className="mb-6 p-4 rounded-2xl bg-[#0B191B]/90 border border-[#F4F7F4]/[0.08] flex items-center justify-between gap-4 shadow-sm backdrop-blur-md">
            <div>
              <div className="text-xs font-bold text-[#4ED8AF] flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5" /> Demo Merchant Account
              </div>
              <div className="text-[11px] text-[#A6B8B5] mt-0.5">
                Alex Chen (TechFlow Electronics Ltd)
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fillDemoAccount}
              className="text-xs shrink-0 font-mono border-[#F4F7F4]/[0.08] text-[#F4F7F4] hover:bg-[#173034] rounded-xl h-8"
            >
              Fill Credentials
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#2e1717] border border-[#D77979]/50 flex items-start gap-3 text-[#D77979] text-xs animate-fade-in font-mono">
              <AlertCircle className="w-4 h-4 text-[#D77979] shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A6B8B5] mb-2 font-mono">
                Merchant Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#708784] absolute left-3.5 top-3.5" />
                <Input
                  type="email"
                  required
                  placeholder="demo@supplymind.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 font-mono text-xs bg-[#0B191B] border-[#F4F7F4]/[0.08] text-[#F4F7F4] rounded-xl h-11 focus:border-[#4ED8AF]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A6B8B5] font-mono">
                  Password
                </label>
                <span className="text-xs text-[#4ED8AF] hover:underline cursor-pointer font-mono">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#708784] absolute left-3.5 top-3.5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 font-mono text-xs bg-[#0B191B] border-[#F4F7F4]/[0.08] text-[#F4F7F4] rounded-xl h-11 focus:border-[#4ED8AF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#708784] hover:text-[#F4F7F4]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#A6B8B5]">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#F4F7F4]/[0.08] bg-[#0B191B] text-[#4ED8AF] focus:ring-[#4ED8AF] accent-[#4ED8AF]"
              />
              <label htmlFor="remember" className="cursor-pointer">
                Remember session on this device
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 text-xs font-bold shadow-mint-subtle bg-[#4ED8AF] text-[#061011] hover:bg-[#4ED8AF]/90 font-mono rounded-xl h-11"
              isLoading={loading}
            >
              Sign In to Console
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Alternative navigation */}
          <div className="mt-8 pt-6 border-t border-[#F4F7F4]/[0.08] text-center text-xs text-[#A6B8B5]">
            Don&apos;t have a merchant account?{" "}
            <Link href="/auth/signup" className="text-[#4ED8AF] font-semibold hover:underline">
              Register merchant workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
