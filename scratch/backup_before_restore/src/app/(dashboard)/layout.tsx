"use client";

import React, { useState } from "react";
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
  History,
  Settings,
  LogOut,
  AlertTriangle,
  Menu,
  X,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard/overview",
    icon: LayoutDashboard,
  },
  {
    name: "Inventory Intelligence",
    href: "/dashboard/inventory",
    icon: Boxes,
    badge: "1 Stockout",
    badgeColor: "bg-[#D77979]/15 text-[#D77979] border-[#D77979]/30",
  },
  {
    name: "Supplier Quotations",
    href: "/dashboard/suppliers",
    icon: Truck,
  },
  {
    name: "AI Negotiation",
    href: "/dashboard/negotiations",
    icon: MessageSquareCode,
    badge: "Active",
    badgeColor: "bg-[#79E7C7]/15 text-[#79E7C7] border-[#79E7C7]/30",
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
    badgeColor: "bg-[#D8AD70]/15 text-[#D8AD70] border-[#D8AD70]/30",
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
    name: "Audit History",
    href: "/dashboard/tracking",
    icon: History,
  },
  {
    name: "Settings",
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
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#061011] text-[#F4F7F4] flex flex-col lg:flex-row antialiased font-sans selection:bg-[#79E7C7]/25 selection:text-[#79E7C7]">
      {/* ─── LEFT FIXED SIDEBAR (~240px Desktop) ─────────────────────────── */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-[240px] bg-[#0B191B] border-r border-[rgba(154,231,207,0.12)] flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo at Top */}
          <div className="p-6 border-b border-[rgba(154,231,207,0.12)]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-[#102326] border border-[rgba(154,231,207,0.2)] flex items-center justify-center p-0.5 group-hover:border-[#79E7C7] transition-all shadow-sm">
                <div className="w-full h-full bg-[#061011] rounded-[6px] flex items-center justify-center relative">
                  <span className="font-display font-bold text-sm text-[#79E7C7]">S</span>
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#79E7C7] animate-pulse" />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-sans font-bold tracking-tight text-sm text-[#F4F7F4]">
                    SUPPLYMIND
                  </span>
                  <span className="text-[9px] font-mono font-bold text-[#79E7C7] uppercase px-1 py-0.2 rounded bg-[#79E7C7]/10 border border-[#79E7C7]/30">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-[#708784] font-mono tracking-wider uppercase">
                  Enterprise OS
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links with fluid gliding active indicator */}
          <nav className="p-3 space-y-1" onMouseLeave={() => setHoveredNav(null)}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                (item.href === "/dashboard/overview" && pathname === "/dashboard/overview") ||
                (item.href !== "/dashboard/overview" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  onMouseEnter={() => setHoveredNav(item.name)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors group relative ${
                    isActive
                      ? "text-[#79E7C7]"
                      : "text-[#A6B8B5] hover:text-[#F4F7F4]"
                  }`}
                >
                  {/* Fluid Gliding Active Indicator Pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      className="absolute inset-0 rounded-xl bg-[#176D5B]/25 border border-[#79E7C7]/30 shadow-sm -z-0"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Left accent vertical pip for active tab */}
                  {isActive && (
                    <motion.span
                      layoutId="activeSidebarPip"
                      className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-[#79E7C7] z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Hover preview pill for inactive items */}
                  {!isActive && hoveredNav === item.name && (
                    <div className="absolute inset-0 rounded-xl bg-[#102326]/60 -z-0" />
                  )}

                  <div className="flex items-center gap-2.5 relative z-10">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? "text-[#79E7C7]" : "text-[#708784] group-hover:text-[#F4F7F4]"
                      }`}
                      strokeWidth={1.75}
                    />
                    <span className="font-sans text-xs">{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border relative z-10 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Merchant Account Controls */}
        <div className="p-3.5 border-t border-[rgba(154,231,207,0.12)] space-y-2.5 bg-[#061011]/60">
          <div className="p-3 rounded-xl bg-[#0B191B] border border-[rgba(154,231,207,0.12)] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#F4F7F4] font-sans truncate">
                {user?.full_name || "Alex Chen"}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#5FC7A1]" title="Merchant Authenticated" />
            </div>
            <div className="text-[10px] text-[#A6B8B5] font-mono truncate">
              {user?.company_name || "TechFlow Electronics Ltd"}
            </div>
            <div className="pt-1.5 border-t border-[rgba(154,231,207,0.08)] flex items-center justify-between text-[9px] text-[#79E7C7] font-mono">
              <span>PAYPAL ORDERS V2</span>
              <span>ACTIVE ✓</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-1 text-xs text-[#A6B8B5]">
            <Link
              href="/"
              className="text-xs hover:text-[#F4F7F4] transition-colors flex items-center gap-1 font-mono"
            >
              <Compass className="w-3.5 h-3.5" /> Landing
            </Link>
            <button
              onClick={() => logout()}
              className="text-xs hover:text-[#D77979] transition-colors flex items-center gap-1 font-mono"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay with AnimatePresence */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/75 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT VIEWPORT ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-16 bg-[#061011]/90 backdrop-blur-md border-b border-[rgba(154,231,207,0.12)] px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-[#F4F7F4]"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-[#A6B8B5]">
              <span>CONSOLE</span>
              <span>/</span>
              <span className="text-[#F4F7F4] font-bold capitalize">
                {pathname.split("/").pop()?.replace("-", " ") || "Overview"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/inventory"
              className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#D77979]/15 border border-[#D77979]/30 text-xs text-[#D77979] font-mono font-bold hover:bg-[#D77979]/20 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>1 Critical Stockout (ELEC-005)</span>
            </Link>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B191B] border border-[rgba(154,231,207,0.15)] text-xs text-[#79E7C7] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#79E7C7] animate-pulse" />
              <span>SANDBOX VERIFIED</span>
            </div>
          </div>
        </header>

        {/* Dynamic Route Children Viewport */}
        <main className="p-6 sm:p-8 lg:p-10 flex-1 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
