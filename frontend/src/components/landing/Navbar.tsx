"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ShieldCheck, ArrowUpRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
        isScrolled
          ? "bg-[#071F30]/95 backdrop-blur-xl border-b border-[rgba(242,240,233,0.1)] py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          : "bg-[#0B3048]/90 backdrop-blur-md border-b border-[rgba(242,240,233,0.08)] py-3.5"
      }`}
    >
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* ─── BRAND LOGO: 's˙' icon + SUPPLYMIND [AI] PROCUREMENT INTELLIGENCE ─── */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Dark Rounded Badge with 's' and dot */}
            <div className="w-9 h-9 rounded-xl bg-[#0B3048] border border-[rgba(242,240,233,0.14)] flex items-center justify-center relative shadow-sm group-hover:border-[#B9F12F]/60 transition-colors">
              <span className="font-sans font-black text-xl text-[#B9F12F] leading-none select-none pl-0.5">
                s
              </span>
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#B9F12F] shadow-[0_0_6px_#B9F12F]" />
            </div>

            {/* Logo Text Hierarchy */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-extrabold text-[15px] tracking-wider text-[#F2F0E9]">
                  SUPPLYMIND
                </span>
                <span className="text-[10px] font-mono font-bold text-[#B9F12F] bg-[#B9F12F]/15 border border-[#B9F12F]/30 px-1.5 py-0.5 rounded">
                  AI
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-[0.16em] text-[#829DA8] uppercase font-semibold">
                Procurement Intelligence
              </span>
            </div>
          </Link>

          {/* ─── CENTER NAVIGATION LINKS: Product, How It Works, AI Intelligence, Security, About ─── */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="#product"
              className="text-xs font-medium text-[#AFC4CC] hover:text-[#F2F0E9] transition-colors"
            >
              Product
            </Link>
            <Link
              href="#workflow"
              className="text-xs font-medium text-[#AFC4CC] hover:text-[#F2F0E9] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#intelligence"
              className="text-xs font-medium text-[#AFC4CC] hover:text-[#F2F0E9] transition-colors"
            >
              AI Intelligence
            </Link>
            <Link
              href="#paypal-security"
              className="text-xs font-medium text-[#AFC4CC] hover:text-[#F2F0E9] transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#B9F12F]" />
              <span>Security</span>
            </Link>
            <Link
              href="#about"
              className="text-xs font-medium text-[#AFC4CC] hover:text-[#F2F0E9] transition-colors"
            >
              About
            </Link>
          </nav>

          {/* ─── RIGHT CONTROLS: Sign In & Get Started ↗ ─── */}
          <div className="hidden lg:flex items-center gap-5">
            {user ? (
              <Link
                href="/dashboard/overview"
                className="text-xs font-medium text-[#AFC4CC] hover:text-[#F2F0E9] px-2 py-1.5 transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/auth/signin"
                className="text-xs font-medium text-[#AFC4CC] hover:text-[#F2F0E9] px-2 py-1.5 transition-colors"
              >
                Sign In
              </Link>
            )}

            <Link href={user ? "/dashboard/overview" : "/auth/signup"}>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-[#B9F12F] hover:bg-[#c6f848] text-[#071F30] font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_16px_rgba(185,241,47,0.25)] hover:scale-105 active:scale-95"
              >
                <span>Get Started</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#AFC4CC] hover:text-[#B9F12F] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-[rgba(242,240,233,0.1)] bg-[#071F30]/95 backdrop-blur-2xl rounded-2xl p-4 flex flex-col gap-3 animate-fade-in shadow-2xl">
            <Link
              href="#product"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#AFC4CC] hover:text-[#F2F0E9] py-1"
            >
              Product
            </Link>
            <Link
              href="#workflow"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#AFC4CC] hover:text-[#F2F0E9] py-1"
            >
              How It Works
            </Link>
            <Link
              href="#intelligence"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#AFC4CC] hover:text-[#F2F0E9] py-1"
            >
              AI Intelligence
            </Link>
            <Link
              href="#paypal-security"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#AFC4CC] hover:text-[#F2F0E9] py-1 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#B9F12F]" />
              <span>Security</span>
            </Link>
            <Link
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-[#AFC4CC] hover:text-[#F2F0E9] py-1"
            >
              About
            </Link>
            <div className="pt-2 border-t border-[rgba(242,240,233,0.1)] flex items-center justify-between gap-3">
              <Link
                href="/auth/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-[#AFC4CC] hover:text-[#F2F0E9]"
              >
                Sign In
              </Link>
              <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                <button className="px-3.5 py-1.5 rounded-lg bg-[#B9F12F] text-[#071F30] font-bold text-xs flex items-center gap-1 shadow-[0_0_12px_rgba(185,241,47,0.25)]">
                  <span>Get Started</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
