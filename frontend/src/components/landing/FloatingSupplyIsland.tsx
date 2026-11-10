"use client";

import React, { useEffect, useRef, useState } from "react";
import { Factory, Package, Truck, ShieldCheck } from "lucide-react";

interface Hotspot {
  id: string;
  xPercent: number; // percentage of width (0-100)
  yPercent: number; // percentage of height (0-100)
  label: string;
  badge: string;
  metric: string;
  subtext: string;
  icon: any;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "factory",
    xPercent: 18.2,
    yPercent: 45.6,
    label: "Component Fabrication",
    badge: "Manufacturing Plant",
    metric: "12,400 units/day",
    subtext: "Shenzhen Tier-1 Facility · Lead: 14 Days",
    icon: Factory,
  },
  {
    id: "warehouse",
    xPercent: 49.2,
    yPercent: 60.0,
    label: "Autonomous Distribution Hub",
    badge: "Fulfillment Center",
    metric: "99.8% Dispatch Precision",
    subtext: "Robotic AGV Sorting · 20 Live SKUs",
    icon: Package,
  },
  {
    id: "port",
    xPercent: 80.5,
    yPercent: 52.6,
    label: "Deepwater Marine Terminal",
    badge: "Intermodal Seaport",
    metric: "Pacific Transit · 48h",
    subtext: "Container Vessel CMA-CGM · 150 units ELEC-005",
    icon: Truck,
  },
];

export default function FloatingSupplyIsland() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Damped tilt physics targets
  const targetTilt = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  // ─── 1. DAMPED LERP INTERPOLATION LOOP (60FPS BUTTERY SMOOTH TILT) ───────────
  useEffect(() => {
    let animId: number;

    const updatePhysics = () => {
      // Damped lerp factor 0.05 gives silky smooth response with zero jumps
      currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * 0.05;
      currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * 0.05;

      setTilt({
        x: Number(currentTilt.current.x.toFixed(3)),
        y: Number(currentTilt.current.y.toFixed(3)),
      });

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width - 0.5;
    const yRel = (e.clientY - rect.top) / rect.height - 0.5;
    // Bounded tilt angles for refined cinematic parallax
    targetTilt.current = {
      x: -yRel * 9,
      y: xRel * 12,
    };
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    targetTilt.current = { x: 0, y: 0 };
  };

  // ─── 2. FLOATING AMBIENT ENERGY PARTICLES CANVAS ─────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || 560);
    let height = (canvas.height = canvas.offsetHeight || 460);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 560;
      height = canvas.height = canvas.offsetHeight || 460;
    };
    window.addEventListener("resize", handleResize);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      alpha: number;
      maxAlpha: number;
      color: string;
    }

    const particles: Particle[] = [];
    const count = 30;
    const colors = ["#A3E635", "#BEF264", "#38BDF8", "#FEF08A"];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: width * 0.15 + Math.random() * (width * 0.72),
        y: height * 0.25 + Math.random() * (height * 0.65),
        size: 1 + Math.random() * 2,
        speedY: -(0.25 + Math.random() * 0.5),
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4,
        maxAlpha: 0.3 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < height * 0.12) {
          p.alpha -= 0.008;
        } else if (p.alpha < p.maxAlpha) {
          p.alpha += 0.006;
        }

        if (p.y < height * 0.06 || p.alpha <= 0) {
          p.y = height * 0.76 + Math.random() * (height * 0.15);
          p.x = width * 0.18 + Math.random() * (width * 0.68);
          p.alpha = 0.05;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[460px] md:min-h-[520px] lg:min-h-[580px] flex items-center justify-center select-none"
      style={{ perspective: "1200px" }}
    >
      {/* Atmospheric Backlight Glow - Integrated seamlessly with Midnight Teal atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(56,189,248,0.12)_0%,rgba(163,230,53,0.06)_40%,transparent_75%)] pointer-events-none" />

      {/* ─── 3D LEVITATING ISOLATED WRAPPER ──────────────────────────────────── */}
      <div
        className="relative w-full max-w-[760px] aspect-[559/460] transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${
            isHovering ? "scale3d(1.025, 1.025, 1.025)" : "scale3d(1, 1, 1)"
          }`,
          transformStyle: "preserve-3d",
          // Perimeter radial mask guarantees zero rectangular boundary clipping
          maskImage: "radial-gradient(ellipse 94% 90% at 50% 50%, black 72%, rgba(0,0,0,0.6) 88%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 94% 90% at 50% 50%, black 72%, rgba(0,0,0,0.6) 88%, transparent 100%)",
        }}
      >
        {/* Floating sine-wave levitation bobbing layer */}
        <div className="relative w-full h-full animate-island-levitate">
          {/* Main Visual Asset: Seamless Isolated Floating Island */}
          <div className="relative w-full h-full overflow-visible">
            <img
              src="/island_seamless.png"
              alt="SUPPLYMIND AI Autonomous Logistics Island Digital Twin"
              className="w-full h-full object-contain pointer-events-none filter brightness-[1.03] contrast-[1.05]"
              loading="eager"
            />

            {/* ─── SVG ANIMATED ENERGY CONDUITS & HOLOGRAPHIC GLOBE OVERLAY ─────── */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 559 460"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Luminous Electric Lime Filter */}
                <filter id="energyGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.0" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="globeAura" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="12" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <linearGradient id="conduitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#A3E635" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#BEF264" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#A3E635" stopOpacity="0.4" />
                </linearGradient>

                <radialGradient id="globeCenterGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#A3E635" stopOpacity="0.22" />
                  <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#0B3048" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* ─── 1. HOLOGRAPHIC ROTATING DIGITAL GLOBE ENHANCEMENT ─────────── */}
              {/* Globe center: x=280, y=138, radius=125 */}
              <g className="hologram-globe-group opacity-90">
                <circle
                  cx="280"
                  cy="138"
                  r="125"
                  fill="url(#globeCenterGlow)"
                  filter="url(#globeAura)"
                />

                {/* Rotating Latitude / Orbital rings */}
                <ellipse
                  cx="280"
                  cy="138"
                  rx="125"
                  ry="46"
                  stroke="#A3E635"
                  strokeWidth="1.2"
                  strokeDasharray="4 6"
                  strokeOpacity="0.7"
                  className="animate-spin-slow origin-[280px_138px]"
                />
                <ellipse
                  cx="280"
                  cy="138"
                  rx="46"
                  ry="125"
                  stroke="#38BDF8"
                  strokeWidth="1.1"
                  strokeDasharray="5 7"
                  strokeOpacity="0.55"
                  className="animate-spin-reverse origin-[280px_138px]"
                />
                <ellipse
                  cx="280"
                  cy="138"
                  rx="125"
                  ry="38"
                  transform="rotate(-26 280 138)"
                  stroke="#BEF264"
                  strokeWidth="0.9"
                  strokeDasharray="3 6"
                  strokeOpacity="0.45"
                  className="animate-spin-slow origin-[280px_138px]"
                />

                {/* Glowing Satellite Beacon Nodes on Globe */}
                <g filter="url(#energyGlow)">
                  {/* Node 1: Shenzhen Hub */}
                  <circle cx="332" cy="122" r="4" fill="#A3E635" className="animate-ping origin-[332px_122px]" />
                  <circle cx="332" cy="122" r="2.8" fill="#FFFFFF" />
                  {/* Node 2: California Hub */}
                  <circle cx="225" cy="110" r="3.5" fill="#38BDF8" />
                  <circle cx="225" cy="110" r="2" fill="#FFFFFF" />
                  {/* Node 3: Munich Hub */}
                  <circle cx="272" cy="90" r="3.5" fill="#FEF08A" />
                  <circle cx="272" cy="90" r="2" fill="#FFFFFF" />
                </g>

                {/* Curved Data Trajectory Arc connecting hubs */}
                <path
                  d="M225 110 Q 275 75 332 122"
                  stroke="#A3E635"
                  strokeWidth="1.8"
                  strokeDasharray="6 8"
                  className="animate-dash"
                  filter="url(#energyGlow)"
                />
              </g>

              {/* ─── 2. LUMINOUS NEON CONDUIT ENERGY HIGHWAYS ──────────────────── */}
              {/* Main Conduit 1: Factory -> Center Warehouse */}
              <path
                d="M 102 210 Q 130 225 155 203 T 205 208 T 235 252 T 275 276"
                stroke="url(#conduitGrad)"
                strokeWidth="3.6"
                strokeLinecap="round"
                fill="none"
                filter="url(#energyGlow)"
                className="opacity-90"
              />
              <path
                d="M 102 210 Q 130 225 155 203 T 205 208 T 235 252 T 275 276"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeDasharray="8 20"
                strokeLinecap="round"
                fill="none"
                className="animate-dash"
                filter="url(#energyGlow)"
              />

              {/* Main Conduit 2: Warehouse -> Seaport Container Ship */}
              <path
                d="M 308 286 Q 355 300 395 262 T 450 242"
                stroke="url(#conduitGrad)"
                strokeWidth="3.6"
                strokeLinecap="round"
                fill="none"
                filter="url(#energyGlow)"
                className="opacity-90"
              />
              <path
                d="M 308 286 Q 355 300 395 262 T 450 242"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeDasharray="8 20"
                strokeLinecap="round"
                fill="none"
                className="animate-dash"
                filter="url(#energyGlow)"
              />

              {/* Pulsing Energy Nodes on Conduits */}
              <g filter="url(#energyGlow)">
                {/* Node at Factory Gate */}
                <circle cx="102" cy="210" r="4.5" fill="#A3E635" className="animate-pulse" />
                <circle cx="102" cy="210" r="2.2" fill="#FFFFFF" />

                {/* Node at Warehouse Loading Dock */}
                <circle cx="275" cy="276" r="5.5" fill="#A3E635" className="animate-ping origin-[275px_276px]" />
                <circle cx="275" cy="276" r="3" fill="#FFFFFF" />

                {/* Node at Seaport Gantry Crane */}
                <circle cx="450" cy="242" r="4.5" fill="#A3E635" className="animate-pulse" />
                <circle cx="450" cy="242" r="2.2" fill="#FFFFFF" />
              </g>

              {/* Continuous Traveling Energy Photon Beads */}
              <circle r="4" fill="#FFFFFF" filter="url(#energyGlow)">
                <animateMotion
                  path="M 102 210 Q 130 225 155 203 T 205 208 T 235 252 T 275 276"
                  dur="3.0s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="4" fill="#FFFFFF" filter="url(#energyGlow)">
                <animateMotion
                  path="M 308 286 Q 355 300 395 262 T 450 242"
                  dur="2.6s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>

            {/* ─── CANVAS PARTICLE SYSTEM (FLOATING SPARKS) ──────────────────── */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
            />

            {/* ─── VOLUMETRIC DRIFTING CLOUDS (ORGANIC ATMOSPHERE) ──────────── */}
            <div className="absolute -bottom-10 -left-14 w-[65%] h-36 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,rgba(11,48,72,0.3)_50%,transparent_75%)] blur-2xl rounded-full pointer-events-none animate-cloud-drift-1" />
            <div className="absolute -bottom-12 -right-12 w-[60%] h-40 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,rgba(11,48,72,0.25)_50%,transparent_75%)] blur-3xl rounded-full pointer-events-none animate-cloud-drift-2" />

            {/* ─── INTERACTIVE TELEMETRY HOTSPOT BUTTONS ────────────────────── */}
            {HOTSPOTS.map((h) => {
              const Icon = h.icon;
              const isSelected = activeHotspot?.id === h.id;

              return (
                <div
                  key={h.id}
                  style={{
                    left: `${h.xPercent}%`,
                    top: `${h.yPercent}%`,
                  }}
                  className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  onMouseEnter={() => setActiveHotspot(h)}
                  onMouseLeave={() => setActiveHotspot(null)}
                >
                  {/* Outer pulsating wave ring */}
                  <span className="absolute -inset-2 rounded-full bg-[#A3E635]/30 animate-ping opacity-75" />

                  {/* Hotspot Center Beacon Pin */}
                  <button
                    type="button"
                    className={`relative w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-200 shadow-lg ${
                      isSelected
                        ? "bg-[#A3E635] text-[#07131D] border-white scale-125 shadow-[0_0_20px_#A3E635]"
                        : "bg-[#07131D]/90 text-[#A3E635] border-[#A3E635]/60 hover:bg-[#A3E635] hover:text-[#07131D] hover:scale-110"
                    }`}
                    aria-label={`View ${h.label} telemetry`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>

                  {/* Hover Telemetry Card */}
                  <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 rounded-xl bg-[#07131D]/95 border border-[#A3E635]/50 backdrop-blur-xl shadow-2xl transition-all duration-200 pointer-events-none ${
                      isSelected
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-2 scale-95"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#A3E635] mb-1">
                      <span className="uppercase tracking-wider font-bold">● {h.badge}</span>
                      <ShieldCheck className="w-3 h-3 text-[#A3E635]" />
                    </div>
                    <div className="text-xs font-bold text-white mb-0.5">{h.label}</div>
                    <div className="text-sm font-extrabold text-[#A3E635] font-mono">{h.metric}</div>
                    <div className="text-[10px] text-slate-300 mt-1 border-t border-white/10 pt-1 font-mono">
                      {h.subtext}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Telemetry Status Pill Bottom Right */}
      <div className="absolute -bottom-2 right-4 hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#07131D]/90 border border-[#A3E635]/30 backdrop-blur-md shadow-xl text-[11px] text-slate-300 font-mono z-30">
        <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
        <span>Island Digital Twin: <strong className="text-white">Active 60fps</strong></span>
        <span className="text-slate-500">|</span>
        <span className="text-[#A3E635] font-semibold">Interactive 3D Tilt</span>
      </div>
    </div>
  );
}
