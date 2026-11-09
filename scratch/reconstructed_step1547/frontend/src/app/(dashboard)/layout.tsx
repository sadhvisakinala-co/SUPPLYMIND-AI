"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Boxes,
  Truck,
  MessageSquareCode,
  BrainCircuit,
  CheckCircle2,
  CreditCard,
  FileSearch,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Menu,
  X,
  History,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    name: "Overview",
    href: "/dashboard/overview",
    icon: LayoutDashboard,
  },
  {
    name: "Inventory Intelligence",
    href: "/dashboard/inventory",
    icon: Boxes,
    badge: "1 Stockout",
    badgeVariant: "stockout" as const,
  },
  {
    name: "Suppliers & Quotations",
    href: "/dashboard/suppliers",
    icon: Truck,
  },
  {
    name: "AI Negotiation",
    href: "/dashboard/negotiations",
    icon: MessageSquareCode,
    badge: "Active",
    badgeVariant: "default" as const,
  },
  {
    name: "Procurement Decisions",
    href: "/dashboard/procurement",
    icon: BrainCircuit,
  },
  {
    name: "Purchase Approvals",
    href: "/dashboard/approval",
    icon: CheckCircle2,
    badge: "1 Pending",
    badgeVariant: "warning" as const,
  },
  {
    name: "PayPal Payments",
    href: "/dashboard/checkout",
    icon: CreditCard,
  },
  {
    name: "Orders & Tracking",
    href: "/dashboard/tracking",
    icon: FileSearch,
  },
  {
    name: "Settings & Guardrails",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/auth/signin");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-graphite text-soft-ivory flex flex-col lg:flex-row antialiased font-sans selection:bg-electric-teal/20 selection:text-electric-teal">
      {/* ─── SIDEBAR NAVIGATION (250px Desktop) ───────────────────────────── */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-[250px] bg-graphite border-r border-border-subtle flex flex-col justify-between shrink-0 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo / Brand Header */}
          <div className="p-5 border-b border-border-subtle flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface border border-border-subtle flex items-center justify-center p-0.5 shadow-teal-subtle">
                <div className="w-full h-full bg-graphite rounded-[8px] flex items-center justify-center relative overflow-hidden">
                  <span className="font-display font-extrabold text-base text-electric-teal">S</span>
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-electric-teal animate-ping" />
                </div>
              </div>
              <div>
                <span className="font-display font-bold text-sm tracking-wide text-soft-ivory flex items-center gap-1.5">
                  SUPPLYMIND <span className="text-[10px] text-electric-teal font-mono font-bold px-1.5 py-0.2 rounded bg-electric-teal/10 border border-electric-teal/30">AI</span>
                </span>
                <span className="text-[10px] text-silver-sage block font-mono">Operations Console</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-silver-sage hover:text-soft-ivory"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Critical Stockout Alert Callout */}
          <div className="p-3.5 m-3.5 rounded-xl bg-[#281616] border border-error/40">
            <div className="flex items-center gap-2 text-xs font-bold text-error mb-1 font-mono">
              <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
              <span>STOCKOUT DETECTED</span>
            </div>
            <p className="text-[11px] text-silver-sage leading-relaxed">
              ELEC-005 (Smart Watch Ultra) at 0 units. Expedited PO awaits sign-off.
            </p>
            <Link
              href="/dashboard/approval"
              className="mt-2 inline-flex items-center gap-1 text-[11px] text-electric-teal font-mono font-semibold hover:underline"
            >
              Approval Gate <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-surface text-soft-ivory border border-electric-teal/40 font-semibold shadow-sm"
                      : "text-silver-sage hover:text-soft-ivory hover:bg-charcoal"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-electric-teal" : "text-silver-sage"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge variant={item.badgeVariant || "default"} className="text-[10px] px-1.5 py-0">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Account & Logout Footer */}
        <div className="p-4 border-t border-border-subtle bg-charcoal/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-surface border border-electric-teal/40 flex items-center justify-center text-electric-teal text-xs font-bold font-mono">
                AC
              </div>
              <div className="truncate max-w-[130px]">
                <div className="text-xs font-bold text-soft-ivory truncate">
                  {user?.full_name || "Alex Chen"}
                </div>
                <div className="text-[10px] text-silver-sage truncate font-mono">
                  {user?.company_name || "TechFlow Ltd"}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-silver-sage hover:text-error hover:bg-[#341818] rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-silver-sage pt-2 border-t border-border-subtle font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              PayPal Sandbox Live
            </span>
            <span className="text-electric-teal">v2.1</span>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}

      {/* ─── MAIN CONTENT AREA ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-border-subtle bg-graphite/80 backdrop-blur-md px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-silver-sage hover:text-soft-ivory mr-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-soft-ivory capitalize font-display">
              {pathname.replace("/dashboard/", "").replace("-", " ") || "Overview"}
            </h1>
            <span className="text-silver-sage text-xs">/</span>
            <span className="text-xs text-silver-sage font-mono">Autonomous Core</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal border border-border-subtle text-xs text-silver-sage font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
              <span>Merchant Sign-off Mandatory</span>
            </div>

            <Link href="/dashboard/approval">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8 font-mono">
                <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                <span>1 Pending PO</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 sm:p-8 flex-1 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
