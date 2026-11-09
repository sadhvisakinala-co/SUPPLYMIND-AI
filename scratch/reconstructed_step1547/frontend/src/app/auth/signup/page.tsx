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
    <div className="min-h-screen bg-graphite flex flex-col lg:flex-row text-soft-ivory selection:bg-electric-teal/20 selection:text-electric-teal font-sans">
      {/* ─── LEFT: 55% CINEMATIC VISUAL ────────────────────────────────────────── */}
      <div className="lg:w-[55%] relative bg-gradient-to-br from-charcoal via-graphite to-[#0b1012] p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border-subtle overflow-hidden">
        <div className="absolute top-12 left-12 w-96 h-96 bg-electric-teal/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-12 right-12 w-96 h-96 bg-charcoal/90 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface border border-border-subtle flex items-center justify-center p-0.5 shadow-teal-subtle">
              <div className="w-full h-full bg-graphite rounded-[8px] flex items-center justify-center relative overflow-hidden">
                <span className="font-display font-extrabold text-lg text-electric-teal">S</span>
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-electric-teal animate-ping" />
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

        <div className="relative z-10 my-12 lg:my-0 max-w-xl">
          <Badge variant="default" className="mb-6 py-1 px-3">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Enterprise Merchant Onboarding
          </Badge>

          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-soft-ivory leading-tight mb-6">
            Autonomous procurement <br />
            <span className="text-gradient-teal">built for high scale.</span>
          </h1>

          <p className="text-silver-sage text-sm sm:text-base leading-relaxed mb-8">
            Create an enterprise merchant workspace in seconds. Connect your inventory catalog, configure gross margin guardrails, and let bounded AI agents safeguard your supply chain.
          </p>

          <div className="space-y-4 pt-6 border-t border-border-subtle font-mono text-xs text-silver-sage">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-electric-teal shrink-0" />
              <span>Real-time stockout probability calculation and EOQ sizing</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-electric-teal shrink-0" />
              <span>Bounded AI negotiation agents with price concession bounds</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-electric-teal shrink-0" />
              <span>Mandatory merchant approval before PayPal sandbox checkout</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-silver-sage flex items-center justify-between font-mono">
          <span>Enterprise Grade Security</span>
          <span className="text-electric-teal">Instant Workspace Provisioning</span>
        </div>
      </div>

      {/* ─── RIGHT: 45% SIGN UP FORM ───────────────────────────────────────── */}
      <div className="lg:w-[45%] flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-graphite">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-soft-ivory mb-2">
              Create Merchant Account
            </h2>
            <p className="text-sm text-silver-sage">
              Deploy your autonomous procurement intelligence environment.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#2e1717] border border-error/50 flex items-start gap-3 text-error text-xs animate-fade-in">
              <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-silver-sage mb-1.5 font-mono">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-silver-sage absolute left-3.5 top-3.5" />
                <Input
                  type="text"
                  required
                  placeholder="Alex Chen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-silver-sage mb-1.5 font-mono">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-silver-sage absolute left-3.5 top-3.5" />
                <Input
                  type="email"
                  required
                  placeholder="alex.chen@techflow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-silver-sage mb-1.5 font-mono">
                Company / Merchant Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-silver-sage absolute left-3.5 top-3.5" />
                <Input
                  type="text"
                  required
                  placeholder="TechFlow Electronics Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-silver-sage mb-1.5 font-mono">
                Password (min. 8 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-silver-sage absolute left-3.5 top-3.5" />
                <Input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 font-mono text-xs"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2 shadow-teal-subtle text-base font-bold mt-6"
              isLoading={loading}
            >
              Initialize Workspace
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border-subtle text-center text-xs text-silver-sage">
            Already registered?{" "}
            <Link href="/auth/signin" className="text-electric-teal font-semibold hover:underline">
              Sign in with existing credentials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
