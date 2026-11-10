"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const WorldCanvas = dynamic(() => import("./world/WorldCanvas"), {
  ssr: false,
  loading: () => (
    <div
      className="scene-loading"
      role="status"
      aria-label="Loading interactive supply-chain scene"
    >
      <span />
    </div>
  ),
});

class SceneBoundary extends React.Component<
  { children: React.ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function SupplyChain3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [active, setActive] = useState(true);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => setReduced(media.matches);
    preference();
    media.addEventListener("change", preference);
    let visible = true;
    const sync = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    if (containerRef.current) observer.observe(containerRef.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", preference);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="scene-viewport reference-world relative w-full flex items-center justify-center overflow-hidden"
    >
      {webGLAvailable ? (
        <div className="absolute inset-0 scene-world-canvas">
          <SceneBoundary onFailure={() => setWebGLAvailable(false)}>
            <WorldCanvas
              active={active}
              reduced={reduced}
              onFailure={() => setWebGLAvailable(false)}
            />
          </SceneBoundary>
        </div>
      ) : (
        /* Reduced Motion & WebGL Fallback */
        <div className="absolute inset-0 flex items-center justify-center bg-charcoal/60 border border-border-subtle rounded-2xl p-8">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-electric-teal/40 mx-auto flex items-center justify-center text-electric-teal">
              <span className="font-mono text-xl font-bold">3D</span>
            </div>
            <h4 className="font-display font-bold text-soft-ivory text-base">
              Autonomous Logistics Digital Twin
            </h4>
            <p className="text-xs text-silver-sage leading-relaxed font-mono">
              Shenzhen · California · Munich routing conduits online. Dynamic
              replenishment active across 48 global corridors.
            </p>
          </div>
        </div>
      )}

      {/* Floating Translucent Information Panels */}
      <div className="scene-telemetry absolute top-6 left-6 z-10 pointer-events-none hidden sm:block">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-graphite/90 border border-electric-teal/30 backdrop-blur-md text-xs text-soft-ivory shadow-lg">
          <span className="w-2 h-2 rounded-full bg-electric-teal animate-pulse" />
          <span className="font-mono font-semibold text-electric-teal uppercase tracking-wider text-[11px]">
            TELEMETRY NODE:
          </span>
          <span className="font-mono text-silver-sage text-[11px]">
            Active Digital Twin v2.4
          </span>
        </div>
      </div>

      <div className="scene-statistics absolute bottom-6 right-6 z-10 pointer-events-none hidden sm:block">
        <div className="flex items-center gap-4 px-4 py-2.5 rounded-xl bg-graphite/90 border border-border-subtle backdrop-blur-md text-xs text-soft-ivory shadow-xl">
          <div>
            <div className="text-[10px] text-silver-sage uppercase font-mono tracking-wider">
              Transit Velocity
            </div>
            <div className="text-sm font-bold font-mono text-electric-teal">
              99.4% On Schedule
            </div>
          </div>
          <div className="h-6 w-[1px] bg-border-subtle" />
          <div>
            <div className="text-[10px] text-silver-sage uppercase font-mono tracking-wider">
              Settlement Rail
            </div>
            <div className="text-sm font-bold font-mono text-success">
              PayPal Verified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
