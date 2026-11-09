"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticCTA } from "@/components/ui/motion";

export default function Navbar() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Product", href: "#product" },
    { label: "Solutions", href: "#solutions" },
    { label: "Resources", href: "#resources" },
    { label: "Company", href: "#company" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#061011]/90 backdrop-blur-xl border-b border-[rgba(154,231,207,0.12)] py-3.5 shadow-mint-subtle"
          : "bg-transparent py-5 border-b border-transparent"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between">
          {/* Logo with minimal geometric mint mark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-[#0B191B] border border-[rgba(154,231,207,0.2)] flex items-center justify-center p-0.5 group-hover:border-[#79E7C7] transition-all shadow-sm">
              <div className="w-full h-full bg-[#102326] rounded-[6px] flex items-center justify-center relative">
                <span className="font-display font-bold text-sm text-[#79E7C7]">S</span>
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#79E7C7] animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-sans font-bold tracking-tight text-base text-[#F4F7F4] group-hover:text-white transition-colors">
                SUPPLYMIND
              </span>
              <span className="text-[10px] font-mono font-bold text-[#79E7C7] uppercase px-1.5 py-0.5 rounded bg-[#79E7C7]/10 border border-[#79E7C7]/30">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with animated hover indicators */}
          <nav className="hidden md:flex items-center gap-2" onMouseLeave={() => setHoveredLink(null)}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.label)}
                className="relative text-sm font-medium text-[#A6B8B5] hover:text-[#F4F7F4] transition-colors px-4 py-2 rounded-xl"
              >
                {hoveredLink === link.label && (
                  <motion.span
                    layoutId="navbarHoverPill"
                    className="absolute inset-0 rounded-xl bg-[#102326] border border-[rgba(154,231,207,0.15)] -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-[#A6B8B5] hover:text-[#F4F7F4] transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <MagneticCTA>
              <Link href="/dashboard/overview">
                <Button
                  size="sm"
                  className="bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 font-sans font-semibold text-xs h-9 px-4 rounded-xl gap-1.5 shadow-[0_0_20px_rgba(121,231,199,0.2)] transition-all"
                >
                  <span>Get Started</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </MagneticCTA>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#0B191B] border border-[rgba(154,231,207,0.12)] text-[#F4F7F4]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-[#0B191B] border-b border-[rgba(154,231,207,0.12)] px-6 py-6 space-y-4 overflow-hidden"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-[#A6B8B5] hover:text-[#79E7C7] transition-colors py-1.5"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-[rgba(154,231,207,0.12)] flex flex-col gap-3">
              <Link
                href="/auth/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#A6B8B5] hover:text-[#F4F7F4] py-1 text-center"
              >
                Sign In
              </Link>
              <Link href="/dashboard/overview" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-[#79E7C7] text-[#061011] hover:bg-[#79E7C7]/90 font-sans font-semibold text-xs h-10 rounded-xl justify-center">
                  <span>Get Started</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
