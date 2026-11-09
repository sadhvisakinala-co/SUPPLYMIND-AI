"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ChevronRight, Menu, X, ArrowUpRight, Cpu } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActiveSection(entry.target.id);
    }, { rootMargin: "-10% 0px -65% 0px" });
    document.querySelectorAll("section[id], footer[id]").forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`landing-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-graphite/90 backdrop-blur-xl border-b border-border-subtle py-3.5 shadow-2xl"
          : "bg-graphite/60 backdrop-blur-md py-5 border-b border-white/5"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Brand Logo with animated teal indicator */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-charcoal border border-border-subtle flex items-center justify-center p-0.5 group-hover:border-electric-teal/60 transition-colors shadow-teal-subtle">
              <div className="w-full h-full bg-surface rounded-[8px] flex items-center justify-center relative overflow-hidden">
                <span className="font-display font-extrabold text-lg text-electric-teal">S</span>
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-electric-teal ambient-beacon" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold tracking-wider text-base text-soft-ivory flex items-center gap-1.5">
                SUPPLYMIND <span className="text-electric-teal text-xs px-1.5 py-0.2 rounded bg-electric-teal/10 border border-electric-teal/30 font-mono">AI</span>
              </span>
              <span className="text-[10px] text-silver-sage font-medium tracking-widest uppercase font-mono">
                Procurement Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main navigation" className="hidden xl:flex items-center gap-8">
            <Link
              href="#product"
              aria-current={activeSection === "product" ? "location" : undefined}
              className="text-sm font-medium text-silver-sage hover:text-electric-teal transition-colors"
            >
              Product
            </Link>
            <Link
              href="#workflow"
              aria-current={activeSection === "workflow" ? "location" : undefined}
              className="text-sm font-medium text-silver-sage hover:text-electric-teal transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#intelligence"
              aria-current={activeSection === "intelligence" ? "location" : undefined}
              className="text-sm font-medium text-silver-sage hover:text-electric-teal transition-colors"
            >
              AI Intelligence
            </Link>
            <Link
              href="#paypal-security"
              aria-current={activeSection === "paypal-security" ? "location" : undefined}
              className="text-sm font-medium text-silver-sage hover:text-electric-teal transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-electric-teal" />
              Security
            </Link>
            <Link
              href="#about"
              aria-current={activeSection === "about" ? "location" : undefined}
              className="text-sm font-medium text-silver-sage hover:text-electric-teal transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden xl:flex items-center gap-4">
            {user ? (
              <Link href="/dashboard/overview">
                <Button variant="default" size="sm" className="gap-2 font-mono text-xs">
                  Console
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-silver-sage hover:text-soft-ivory transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link href="/auth/signup">
                  <Button variant="default" size="sm" className="gap-2">
                    Get Started
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-silver-sage hover:text-electric-teal focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-4 pt-4 border-t border-border-subtle flex flex-col gap-4 pb-4 animate-fade-in">
            <Link
              href="#product"
              aria-current={activeSection === "product" ? "location" : undefined}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-silver-sage hover:text-electric-teal py-1"
            >
              Product
            </Link>
            <Link
              href="#workflow"
              aria-current={activeSection === "workflow" ? "location" : undefined}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-silver-sage hover:text-electric-teal py-1"
            >
              How It Works
            </Link>
            <Link
              href="#intelligence"
              aria-current={activeSection === "intelligence" ? "location" : undefined}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-silver-sage hover:text-electric-teal py-1"
            >
              AI Intelligence
            </Link>
            <Link
              href="#paypal-security"
              aria-current={activeSection === "paypal-security" ? "location" : undefined}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-silver-sage hover:text-electric-teal py-1 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-electric-teal" />
              Security
            </Link>
            <Link
              href="#about"
              aria-current={activeSection === "about" ? "location" : undefined}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-medium text-silver-sage hover:text-electric-teal py-1"
            >
              About
            </Link>
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In (Demo Account)
                </Button>
              </Link>
              <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" className="w-full">
                  Launch Console
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
