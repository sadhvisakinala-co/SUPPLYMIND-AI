"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutGrid,
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const navItems = [
  {
    name: "Overview",
    href: "/dashboard/overview",
    icon: LayoutGrid,
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
  const { user, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user && typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        window.location.replace("/auth/signin");
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#071F30] flex items-center justify-center text-xs font-mono text-[#AFC4CC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#B9F12F] border-t-transparent animate-spin" />
          <span>Verifying merchant session...</span>
        </div>
      </div>
    );
  }

  if (!user && typeof window !== "undefined" && !localStorage.getItem("auth_token")) {
    return null;
  }

  return (
    <div className="console-shell min-h-screen bg-[#071F30] text-[#F2F0E9] flex flex-col lg:flex-row antialiased font-sans selection:bg-[#B9F12F]/20 selection:text-[#B9F12F]">
      {/* ─── SIDEBAR NAVIGATION (240px Desktop, Foundation #062C39) ───── */}
      <aside
        className={`console-sidebar fixed lg:sticky lg:h-screen lg:overflow-y-auto top-0 bottom-0 left-0 z-40 w-[240px] bg-[#062C39] border-r border-[rgba(242,240,233,0.08)] flex flex-col justify-between shrink-0 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo / Brand Header */}
          <div className="p-4 border-b border-[rgba(242,240,233,0.08)] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#12394F] border border-[#19455A] flex items-center justify-center p-0.5 shadow-sm">
                <div className="w-full h-full bg-[#071F30] rounded-[8px] flex items-center justify-center relative overflow-hidden">
                  <span className="font-display font-extrabold text-sm text-[#B9F12F]">S</span>
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#B9F12F] shadow-[0_0_6px_#B9F12F]" />
                </div>
              </div>
              <div>
                <span className="font-display font-bold text-sm tracking-wide text-[#F2F0E9] flex items-center gap-1.5">
                  SUPPLYMIND <span className="text-[10px] text-[#B9F12F] font-mono font-bold px-1.5 py-0.2 rounded bg-[#B9F12F]/10 border border-[#B9F12F]/30">AI</span>
                </span>
                <span className="text-[10px] text-[#829DA8] block font-mono">Operations Console</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation"
              className="lg:hidden p-1 text-[#AFC4CC] hover:text-[#F2F0E9]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Critical Stockout Alert Callout */}
          <div className="p-3 m-3 rounded-xl bg-[#221215] border border-red-500/40 shadow-sm">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mb-1 font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>STOCKOUT DETECTED</span>
            </div>
            <p className="text-[11px] text-[#AFC4CC] leading-relaxed">
              ELEC-005 (Smart Watch Ultra) at 0 units. Expedited PO awaits sign-off.
            </p>
            <Link
              href="/dashboard/approval"
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-[#B9F12F] font-mono font-semibold hover:underline"
            >
              Approval Gate <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Console navigation" className="px-2 py-1.5 space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  aria-current={isActive ? "page" : undefined}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 relative ${
                    isActive
                      ? "bg-[#0E3A4B] text-[#F2F0E9] font-semibold border border-[rgba(150,215,222,0.2)] shadow-sm before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-[#B9F12F] before:rounded-r"
                      : "text-[#AFC4CC] hover:text-[#F2F0E9] hover:bg-[#10394A]/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#B9F12F]" : "text-[#829DA8]"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                        item.badgeVariant === "stockout"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : item.badgeVariant === "warning"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-[#B9F12F]/15 text-[#B9F12F] border border-[#B9F12F]/30"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Account & Logout Footer */}
        <div className="p-3.5 border-t border-[rgba(242,240,233,0.08)] bg-[#072430]/70">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#12394F] border border-[#B9F12F]/40 flex items-center justify-center text-[#B9F12F] text-xs font-bold font-mono">
                AC
              </div>
              <div className="truncate max-w-[125px]">
                <div className="text-xs font-bold text-[#F2F0E9] truncate font-sans">
                  {user?.full_name || "Alex Chen"}
                </div>
                <div className="text-[10px] text-[#829DA8] truncate font-mono">
                  TechFlow Electronic...
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1 text-[#AFC4CC] hover:text-red-400 hover:bg-[#341818] rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#829DA8] pt-1.5 border-t border-[rgba(242,240,233,0.08)] font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              PayPal Sandbox Live
            </span>
            <span className="text-[#B9F12F]">v2.1</span>
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
        {/* Top Header Bar Matching Reference */}
        <header className="h-14 border-b border-[rgba(242,240,233,0.08)] bg-[#071F30]/90 backdrop-blur-md px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              className="lg:hidden p-1.5 text-[#AFC4CC] hover:text-[#F2F0E9] mr-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5 text-xs font-mono">
              <Link href="/dashboard/overview" className="text-[#F2F0E9] font-bold text-sm hover:underline">
                Overview
              </Link>
              <span className="text-[#829DA8]">/</span>
              <span className="text-[#829DA8] font-medium">
                {pathname === "/dashboard/settings"
                  ? "System Settings & Guardrails"
                  : pathname === "/dashboard/inventory"
                  ? "Inventory Intelligence"
                  : pathname === "/dashboard/suppliers"
                  ? "Suppliers & Quotations"
                  : pathname === "/dashboard/negotiations"
                  ? "AI Negotiation"
                  : pathname === "/dashboard/procurement"
                  ? "Procurement Decisions"
                  : pathname === "/dashboard/approval"
                  ? "Purchase Approvals"
                  : pathname === "/dashboard/checkout"
                  ? "PayPal Payments"
                  : pathname === "/dashboard/tracking"
                  ? "Orders & Tracking"
                  : "Autonomous Core"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10394A]/90 border border-[rgba(150,215,222,0.25)] text-xs text-[#AFC4CC] font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B9F12F]" />
              <span>Merchant Sign-off Mandatory</span>
            </div>

            <Link href="/dashboard/approval">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10394A]/90 border border-[rgba(150,215,222,0.25)] hover:border-[#B9F12F]/40 text-xs text-[#F2F0E9] font-mono transition-colors cursor-pointer">
                <span className="w-2 h-2 rounded-full bg-[#B9F12F] shadow-[0_0_6px_#B9F12F]" />
                <span>1 Pending PO</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="console-content p-6 sm:p-7 xl:p-8 flex-1 max-w-[1680px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
