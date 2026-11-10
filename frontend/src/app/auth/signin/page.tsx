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
  const { login, loginDemo } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
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

  const handle1ClickDemo = async () => {
    setError(null);
    setDemoLoading(true);
    try {
      await loginDemo();
      router.push("/dashboard/overview");
    } catch (err: any) {
      setError(
        err.detail || err.message || "Failed to initiate demo merchant session."
      );
    } finally {
      setDemoLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail("demo@supplymind.ai");
    setPassword("Demo@2024!");
    setError(null);
  };

  return (
    <div className="auth-shell min-h-screen bg-graphite flex flex-col lg:flex-row text-soft-ivory selection:bg-electric-teal/20 selection:text-electric-teal font-sans">
      {/* ─── LEFT: 55% CINEMATIC ANIMATED SUPPLY-CHAIN ENVIRONMENT ────────── */}
      <div className="lg:w-[55%] relative bg-gradient-to-br from-charcoal via-graphite to-[#071F30] p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border-subtle overflow-hidden">
        {/* Subtle moving teal ambient light */}
        <div className="absolute top-12 left-12 w-96 h-96 bg-electric-teal/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-12 right-12 w-96 h-96 bg-charcoal/90 rounded-full blur-[120px] pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center p-0.5 group-hover:border-electric-teal/60 transition-colors shadow-teal-subtle">
              <div className="w-full h-full bg-graphite rounded-[8px] flex items-center justify-center relative overflow-hidden">
                <span className="font-display font-extrabold text-lg text-electric-teal">S</span>
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-electric-teal ambient-beacon" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold tracking-wider text-base text-soft-ivory">
                SUPPLYMIND <span className="text-electric-teal text-xs px-1.5 py-0.2 rounded bg-electric-teal/10 border border-electric-teal/30 font-mono">AI</span>
              </span>
              <span className="text-[10px] text-silver-sage tracking-widest uppercase font-mono">
                Procurement Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Narrative & Value Proposition */}
        <div className="relative z-10 my-12 lg:my-0 max-w-xl">
          <Badge variant="default" className="mb-6 py-1 px-3">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Graphite & Electric Teal Architecture
          </Badge>

          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-soft-ivory leading-tight mb-6">
            Autonomous procurement that moves <br />
            <span className="text-gradient-teal">before shortages happen.</span>
          </h1>

          <p className="text-silver-sage text-sm sm:text-base leading-relaxed mb-8">
            Continuous inventory telemetry, bounded algorithmic negotiation, and PayPal Orders v2 sandbox settlement. One unified operating system for high-velocity merchants.
          </p>

          <div className="space-y-4 pt-6 border-t border-border-subtle font-mono text-xs text-silver-sage">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-electric-teal shrink-0" />
              <span>20 Pre-configured electronics SKUs with sales velocity models</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-electric-teal shrink-0" />
              <span>Multi-supplier quotation arbitrage (Shenzhen · Munich · California)</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-electric-teal shrink-0" />
              <span>End-to-end PayPal Orders v2 Sandbox verification</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-xs text-silver-sage flex items-center justify-between font-mono">
          <span>PCI-DSS & SOC-2 Compliant Rail</span>
          <span className="text-electric-teal">PayPal Sandbox Enabled</span>
        </div>
      </div>

      {/* ─── RIGHT: 45% CLEAN AUTHENTICATION FORM ─────────────────────────── */}
      <div className="lg:w-[45%] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-graphite">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-soft-ivory mb-2">
              Sign In to Console
            </h2>
            <p className="text-sm text-silver-sage">
              Access your merchant inventory risk monitoring & procurement engine.
            </p>
          </div>

          {/* Quick Demo Fill Card */}
          <div className="mb-6 p-4 rounded-xl bg-charcoal border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-electric-teal flex items-center gap-1.5 font-mono">
                <Sparkles className="w-3.5 h-3.5" /> Demo Merchant Account
              </div>
              <div className="text-[11px] text-silver-sage mt-0.5">
                Alex Chen (TechFlow Electronics Ltd)
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillDemoAccount}
                className="text-xs font-mono"
              >
                Fill Form
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handle1ClickDemo}
                isLoading={demoLoading}
                className="text-xs font-mono font-bold bg-electric-teal hover:bg-electric-teal/90 text-graphite shadow-teal-subtle"
              >
                1-Click Demo
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#2e1717] border border-error/50 flex items-start gap-3 text-error text-xs animate-fade-in">
              <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-silver-sage mb-2 font-mono">
                Merchant Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-silver-sage absolute left-3.5 top-3.5" />
                <Input
                  type="email"
                  required
                  placeholder="demo@supplymind.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-silver-sage font-mono">
                  Password
                </label>
                <span className="text-xs text-electric-teal hover:underline cursor-pointer font-mono">
                  Forgot?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-silver-sage absolute left-3.5 top-3.5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-silver-sage hover:text-soft-ivory"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-silver-sage">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-border-subtle bg-charcoal text-electric-teal focus:ring-electric-teal accent-electric-teal"
              />
              <label htmlFor="remember" className="cursor-pointer">
                Remember session on this device
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 text-base font-bold shadow-teal-subtle"
              isLoading={loading}
            >
              Sign In to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Alternative navigation */}
          <div className="mt-8 pt-6 border-t border-border-subtle text-center text-xs text-silver-sage">
            Don&apos;t have a merchant account?{" "}
            <Link href="/auth/signup" className="text-electric-teal font-semibold hover:underline">
              Register merchant workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
