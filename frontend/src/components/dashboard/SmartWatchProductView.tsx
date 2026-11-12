"use client";

import React, { useState, useEffect, useRef } from "react";

export default function SmartWatchProductView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Subtle pointer parallax effect with spring damping
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      
      // Limit to max 3.5px subtle movement for smooth elegance
      setParallax({
        x: Math.max(-3.5, Math.min(3.5, x * 3.5)),
        y: Math.max(-2.5, Math.min(2.5, y * 2.5)),
      });
    };

    const handleMouseLeave = () => {
      setParallax({ x: 0, y: 0 });
    };

    const node = containerRef.current;
    if (node) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      node.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (node) {
        node.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center justify-center select-none py-1 group overflow-visible min-w-0"
    >
      {/* ─── 1. ATMOSPHERIC RADIAL BACKLIGHT (CYAN & LIME DIFFUSION) ─────────── */}
      <div className="absolute -inset-6 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15)_0%,rgba(185,241,47,0.08)_40%,transparent_70%)] blur-2xl pointer-events-none" />

      {/* ─── 2. PEDESTAL BASE LIGHT SPILL & SOFT CONTACT SHADOW ─────────────── */}
      <div className="absolute bottom-2 w-48 sm:w-64 h-12 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(185,241,47,0.42)_0%,rgba(185,241,47,0.14)_45%,transparent_75%)] blur-lg pointer-events-none transition-opacity duration-1000 opacity-90 group-hover:opacity-100" />
      <div className="absolute bottom-1 w-40 sm:w-56 h-8 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.65)_0%,transparent_70%)] blur-md pointer-events-none" />

      {/* ─── 3. HIGH-RESOLUTION STUDIO SMARTWATCH ON GLOWING PEDESTAL ──────── */}
      <div
        className="relative z-10 w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[320px] h-52 sm:h-64 lg:h-72 flex items-center justify-center transition-transform duration-300 ease-out animate-product-float"
        style={{
          transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
        }}
      >
        <img
          src="/smartwatch_studio_hero.png"
          alt="Smart Watch Ultra Titanium (GPS + Cellular)"
          className="w-full h-full max-h-full object-contain pointer-events-none filter brightness-[1.03] contrast-[1.02] select-none"
        />
      </div>
    </div>
  );
}
