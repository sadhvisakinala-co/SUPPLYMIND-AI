"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Activity, ShieldCheck, Cpu, ArrowUpRight, Globe, Layers, Navigation } from "lucide-react";

export default function SupplyChain3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLAvailable, setWebGLAvailable] = useState<boolean>(true);
  const [activeWorkflowStage, setActiveWorkflowStage] = useState<number>(0);
  const [activeNode, setActiveNode] = useState<string>("shenzhen");

  const workflowStages = [
    {
      step: "01",
      title: "Predictive Stockout Interception",
      detail: "Wilson EOQ & Bayesian demand forecast identify impending stockout on SKU ELEC-005.",
      badge: "INVENTORY TELEMETRY",
      badgeColor: "bg-[#D77979]/15 text-[#D77979] border-[#D77979]/30",
      activeNode: "california",
    },
    {
      step: "02",
      title: "Autonomous Multi-Agent Bidding",
      detail: "Buyer Agent opens multi-vendor dialogue. TechSource Global drops quote from $130.50 to $122.50.",
      badge: "MULTI-AGENT PROTOCOL",
      badgeColor: "bg-[#79E7C7]/15 text-[#79E7C7] border-[#79E7C7]/30",
      activeNode: "shenzhen",
    },
    {
      step: "03",
      title: "Cryptographic Merchant Sign-Off",
      detail: "Merchant signs order PO-2024-00892 ($19,643.75 total). SHA-256 canonical hash locked.",
      badge: "HUMAN GOVERNANCE",
      badgeColor: "bg-[#D8AD70]/15 text-[#D8AD70] border-[#D8AD70]/30",
      activeNode: "central",
    },
    {
      step: "04",
      title: "PayPal Orders v2 Capture",
      detail: "Server-side token exchange completes idempotently. Funds captured on PayPal Sandbox rail.",
      badge: "FINTECH SETTLEMENT",
      badgeColor: "bg-[#5FC7A1]/15 text-[#5FC7A1] border-[#5FC7A1]/30",
      activeNode: "munich",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWorkflowStage((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Check WebGL availability
    let gl: WebGLRenderingContext | null = null;
    try {
      const canvas = document.createElement("canvas");
      gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext;
      if (!gl) {
        setWebGLAvailable(false);
        return;
      }
    } catch {
      setWebGLAvailable(false);
      return;
    }

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 560;

    // ─── THREE.JS SCENE SETUP ──────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x061011, 0.032);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 4, 18);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      container.appendChild(renderer.domElement);
    } catch {
      setWebGLAvailable(false);
      return;
    }

    // ─── LIGHTING ARCHITECTURE (DARK FINTECH LUXURY) ───────────────────────
    const ambientLight = new THREE.AmbientLight(0x102326, 2.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xf4f7f4, 2.2);
    dirLight.position.set(12, 18, 14);
    scene.add(dirLight);

    const mintGlowLight = new THREE.PointLight(0x79e7c7, 3.8, 30);
    mintGlowLight.position.set(-6, 5, 8);
    scene.add(mintGlowLight);

    const emeraldLight = new THREE.PointLight(0x176d5b, 4.0, 35);
    emeraldLight.position.set(6, -4, -6);
    scene.add(emeraldLight);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // ─── 1. DARK CORE GLOBE SPHERE ─────────────────────────────────────────
    const globeRadius = 5.2;
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x0b191b,
      metalness: 0.85,
      roughness: 0.35,
      wireframe: false,
    });
    const coreGlobe = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(coreGlobe);

    // ─── 2. MINT GEOMETRIC WIREFRAME LATTICE SPHERE ────────────────────────
    const wireframeGeo = new THREE.SphereGeometry(globeRadius + 0.04, 32, 24);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x79e7c7,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    globeGroup.add(wireframeMesh);

    // ─── 3. ATMOSPHERIC HALO ───────────────────────────────────────────────
    const haloGeo = new THREE.SphereGeometry(globeRadius + 0.3, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x4ed8af,
      transparent: true,
      opacity: 0.05,
      side: THREE.BackSide,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    globeGroup.add(haloMesh);

    // ─── 4. GEOGRAPHIC POINT CLOUD ─────────────────────────────────────────
    const pointCount = 650;
    const pointPositions = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / pointCount);
      const theta = Math.sqrt(pointCount * Math.PI) * phi;
      const r = globeRadius + 0.08;

      pointPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pointPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pointPositions[i * 3 + 2] = r * Math.cos(phi);
    }

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(pointPositions, 3));
    const pointMat = new THREE.PointsMaterial({
      color: 0x79e7c7,
      size: 0.14,
      transparent: true,
      opacity: 0.55,
    });
    const pointCloud = new THREE.Points(pointGeo, pointMat);
    globeGroup.add(pointCloud);

    // Helper: Convert lat/long to 3D Cartesian coordinates
    const latLongToVector3 = (lat: number, lon: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    // ─── 5. GLOBAL SUPPLY HUBS & ARCS ──────────────────────────────────────
    const hubs = [
      { id: "shenzhen", name: "Shenzhen Hub", lat: 22.5, lon: 114.0 },
      { id: "california", name: "Autonomous Core (US)", lat: 37.7, lon: -122.4 },
      { id: "munich", name: "Munich Logistics (EU)", lat: 48.1, lon: 11.5 },
    ];

    const hubMeshes: THREE.Mesh[] = [];
    const hubVectors = hubs.map((h) => {
      const v = latLongToVector3(h.lat, h.lon, globeRadius + 0.12);

      // Node marker
      const markerGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const markerMat = new THREE.MeshStandardMaterial({
        color: 0x79e7c7,
        emissive: 0x79e7c7,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(v);
      globeGroup.add(marker);
      hubMeshes.push(marker);

      // Outer pulsing ring
      const ringGeo = new THREE.RingGeometry(0.25, 0.35, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x4ed8af,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(v);
      ring.lookAt(v.clone().multiplyScalar(2));
      globeGroup.add(ring);

      return v;
    });

    // Create arched spline routes between hubs
    const routes = [
      { start: hubVectors[0], end: hubVectors[1] }, // Shenzhen -> California
      { start: hubVectors[1], end: hubVectors[2] }, // California -> Munich
      { start: hubVectors[2], end: hubVectors[0] }, // Munich -> Shenzhen
    ];

    const splineCurves: THREE.QuadraticBezierCurve3[] = [];
    const photonMeshes: THREE.Mesh[] = [];

    routes.forEach(({ start, end }) => {
      const mid = start.clone().lerp(end, 0.5);
      const distance = start.distanceTo(end);
      mid.normalize().multiplyScalar(globeRadius + distance * 0.35);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      splineCurves.push(curve);

      const points = curve.getPoints(40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x79e7c7,
        transparent: true,
        opacity: 0.45,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);

      // Add animated photon particle traveling along the arc
      const photonGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const photonMat = new THREE.MeshBasicMaterial({
        color: 0xf4f7f4,
      });
      const photon = new THREE.Mesh(photonGeo, photonMat);
      globeGroup.add(photon);
      photonMeshes.push(photon);
    });

    camera.lookAt(0, 0, 0);

    // ─── MOUSE RESPONSIVE PARALLAX ─────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 0.4;
      mouseY = (y / rect.height) * 0.4;
    };

    container.addEventListener("mousemove", handleMouseMove);

    // Animation Loop with Offscreen Pause via IntersectionObserver
    let animationId: number;
    let isVisible = true;
    let clock = new THREE.Clock();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return; // Pause offscreen animations for performance

      const elapsedTime = clock.getElapsedTime();

      // Gentle continuous turntable rotation + mouse parallax
      targetRotationY = elapsedTime * 0.08 + mouseX;
      targetRotationX = Math.sin(elapsedTime * 0.15) * 0.08 - mouseY;

      globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.05;
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05;

      // Subtle pulse on nodes
      hubMeshes.forEach((mesh, idx) => {
        const s = 1 + Math.sin(elapsedTime * 3 + idx) * 0.15;
        mesh.scale.set(s, s, s);
      });

      // Animate traveling photons along routes
      splineCurves.forEach((curve, idx) => {
        if (photonMeshes[idx]) {
          const t = (elapsedTime * 0.25 + idx * 0.33) % 1;
          const pos = curve.getPoint(t);
          photonMeshes[idx].position.copy(pos);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 700;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      cancelAnimationFrame(animationId);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[520px] sm:h-[560px] lg:h-[600px] rounded-3xl bg-gradient-to-br from-[#0B191B] via-[#061011] to-[#061011] border border-[rgba(154,231,207,0.12)] relative overflow-hidden shadow-mint-glow group"
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-[#79E7C7]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* ─── INTERACTIVE NETWORK SCHEMATIC OVERLAY ──────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
        {/* Top Telemetry Strip */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0B191B]/85 backdrop-blur-md border border-[rgba(154,231,207,0.15)] text-xs font-mono text-[#A6B8B5]">
            <span className="w-2 h-2 rounded-full bg-[#79E7C7] animate-pulse" />
            <span className="font-semibold text-[#F4F7F4]">GLOBAL SUPPLY TOPOLOGY</span>
            <span className="text-[#708784]">|</span>
            <span className="text-[#79E7C7]">ACTIVE ORBIT</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B191B]/85 backdrop-blur-md border border-[rgba(154,231,207,0.15)] text-xs font-mono text-[#A6B8B5]">
            <span>VERIFIED HUBS:</span>
            <span className="text-[#F4F7F4] font-bold">3 GLOBAL · 1 FINTECH GATE</span>
          </div>
        </div>

        {/* Center Live Node Callouts */}
        <div className="grid grid-cols-3 gap-3 pointer-events-auto my-auto max-w-lg mx-auto w-full">
          {[
            { id: "shenzhen", name: "Shenzhen Hub", latency: "14ms", desc: "TechSource Global Ltd" },
            { id: "central", name: "Autonomous Core", latency: "2ms", desc: "SUPPLYMIND AI Engine" },
            { id: "munich", name: "Munich Logistics", latency: "28ms", desc: "EuroTech Supply GmbH" },
          ].map((node) => (
            <button
              key={node.id}
              onClick={() => setActiveNode(node.id)}
              className={`p-3 rounded-2xl text-left transition-all duration-200 border backdrop-blur-md ${
                activeNode === node.id
                  ? "bg-[#173034]/90 border-[#79E7C7] shadow-mint-subtle"
                  : "bg-[#0B191B]/70 border-[rgba(154,231,207,0.12)] hover:border-[rgba(154,231,207,0.3)] hover:bg-[#0B191B]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono text-[#79E7C7] flex items-center gap-1.5 font-bold">
                  <span className={`w-1.5 h-1.5 rounded-full ${activeNode === node.id ? "bg-[#79E7C7] animate-ping" : "bg-[#708784]"}`} />
                  {node.latency}
                </span>
              </div>
              <div className="text-xs font-bold text-[#F4F7F4] font-sans truncate">{node.name}</div>
              <div className="text-[10px] text-[#A6B8B5] font-mono truncate">{node.desc}</div>
            </button>
          ))}
        </div>

        {/* Bottom Interactive HUD: 4-Stage Autonomous Workflow Showcase */}
        <div className="pointer-events-auto p-4 rounded-2xl bg-[#0B191B]/90 backdrop-blur-md border border-[rgba(154,231,207,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono shadow-mint-subtle">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${workflowStages[activeWorkflowStage].badgeColor}`}>
                {workflowStages[activeWorkflowStage].badge}
              </span>
              <span className="text-[11px] text-[#708784]">
                PHASE {workflowStages[activeWorkflowStage].step} OF 04
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#F4F7F4] font-sans">
              {workflowStages[activeWorkflowStage].title}
            </h4>
            <p className="text-[11px] text-[#A6B8B5] font-sans leading-relaxed max-w-md">
              {workflowStages[activeWorkflowStage].detail}
            </p>
          </div>

          {/* Interactive Phase Indicator Tabs */}
          <div className="flex items-center gap-1.5 shrink-0">
            {workflowStages.map((stage, idx) => (
              <button
                key={stage.step}
                onClick={() => setActiveWorkflowStage(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeWorkflowStage === idx ? "w-6 bg-[#79E7C7]" : "w-2 bg-[#173034] hover:bg-[#708784]"
                }`}
                title={`Phase ${stage.step}: ${stage.title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
