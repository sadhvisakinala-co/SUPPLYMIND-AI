"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function SupplyChain3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLAvailable, setWebGLAvailable] = useState<boolean>(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Check WebGL availability
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGLAvailable(false);
        return;
      }
    } catch {
      setWebGLAvailable(false);
      return;
    }

    // Check reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setWebGLAvailable(false);
      return;
    }

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 550;

    // ─── THREE.JS SCENE SETUP ──────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x101719, 0.035);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(12, 10, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ─── LIGHTING ARCHITECTURE ─────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x213236, 1.2);
    scene.add(ambientLight);

    // Key Light (Clean White/Teal directional)
    const dirLight = new THREE.DirectionalLight(0xebf4f3, 2.0);
    dirLight.position.set(15, 20, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 40;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    scene.add(dirLight);

    // Electric Teal Rim Light
    const tealRim = new THREE.PointLight(0x26b7a3, 3.5, 30);
    tealRim.position.set(-8, 6, -6);
    scene.add(tealRim);

    // Soft Fill Light
    const fillLight = new THREE.PointLight(0x6e9293, 1.5, 25);
    fillLight.position.set(0, -3, 8);
    scene.add(fillLight);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // ─── MATERIALS ─────────────────────────────────────────────────────────
    const metallicGraphiteMat = new THREE.MeshStandardMaterial({
      color: 0x182427,
      metalness: 0.85,
      roughness: 0.25,
    });

    const darkCharcoalMat = new THREE.MeshStandardMaterial({
      color: 0x121c1e,
      metalness: 0.9,
      roughness: 0.4,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x26b7a3,
      transparent: true,
      opacity: 0.35,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.7,
      ior: 1.5,
    });

    const tealGlowMat = new THREE.MeshBasicMaterial({
      color: 0x26b7a3,
    });

    const subtleBorderMat = new THREE.LineBasicMaterial({
      color: 0x34494c,
      transparent: true,
      opacity: 0.4,
    });

    // ─── ARCHITECTURAL GROUND GRID & PLATFORM ──────────────────────────────
    const platformGeom = new THREE.CylinderGeometry(8.5, 9.2, 0.4, 64);
    const platform = new THREE.Mesh(platformGeom, darkCharcoalMat);
    platform.position.y = -0.2;
    platform.receiveShadow = true;
    worldGroup.add(platform);

    const gridHelper = new THREE.GridHelper(16, 24, 0x26b7a3, 0x213236);
    gridHelper.position.y = 0.02;
    worldGroup.add(gridHelper);

    // ─── 1. CENTRAL AUTOMATED FULFILLMENT FACILITY ─────────────────────────
    const centralFacility = new THREE.Group();
    centralFacility.position.set(0, 0, 0);

    // Main modern angular warehouse blocks
    const mainBlockGeom = new THREE.BoxGeometry(3.6, 1.8, 2.6);
    const mainBlock = new THREE.Mesh(mainBlockGeom, metallicGraphiteMat);
    mainBlock.position.y = 0.9;
    mainBlock.castShadow = true;
    mainBlock.receiveShadow = true;
    centralFacility.add(mainBlock);

    // Glass Atrium / Control Center
    const glassRoofGeom = new THREE.BoxGeometry(2.8, 0.6, 1.8);
    const glassRoof = new THREE.Mesh(glassRoofGeom, glassMat);
    glassRoof.position.y = 2.0;
    centralFacility.add(glassRoof);

    // Interior glow core inside glass roof
    const coreLightGeom = new THREE.BoxGeometry(1.4, 0.3, 0.8);
    const coreLight = new THREE.Mesh(coreLightGeom, tealGlowMat);
    coreLight.position.y = 1.95;
    centralFacility.add(coreLight);

    // Cantilevered automated loading docks
    for (let i = -1; i <= 1; i += 2) {
      const dockGeom = new THREE.BoxGeometry(0.8, 0.4, 0.6);
      const dock = new THREE.Mesh(dockGeom, darkCharcoalMat);
      dock.position.set(i * 1.6, 0.2, 1.4);
      centralFacility.add(dock);

      // Dock indicator LED line
      const ledGeom = new THREE.BoxGeometry(0.6, 0.05, 0.05);
      const led = new THREE.Mesh(ledGeom, tealGlowMat);
      led.position.set(i * 1.6, 0.42, 1.7);
      centralFacility.add(led);
    }

    worldGroup.add(centralFacility);

    // ─── 2. OUTPOST LOGISTICS HUBS (Shenzhen, California, Munich) ──────────
    const hubPositions = [
      { pos: [-4.8, 0, 3.2], name: "TechSource Shenzhen", scale: 0.75 },
      { pos: [5.0, 0, 2.2], name: "PrimeParts California", scale: 0.8 },
      { pos: [0.5, 0, -5.2], name: "EuroTech Munich", scale: 0.7 },
    ];

    const hubGroups: THREE.Group[] = [];
    hubPositions.forEach((h) => {
      const hGroup = new THREE.Group();
      hGroup.position.set(h.pos[0], h.pos[1], h.pos[2]);

      const baseGeom = new THREE.CylinderGeometry(1.2 * h.scale, 1.3 * h.scale, 0.5 * h.scale, 32);
      const baseMesh = new THREE.Mesh(baseGeom, darkCharcoalMat);
      baseMesh.position.y = 0.25 * h.scale;
      baseMesh.castShadow = true;
      hGroup.add(baseMesh);

      const towerGeom = new THREE.BoxGeometry(0.8 * h.scale, 1.6 * h.scale, 0.8 * h.scale);
      const tower = new THREE.Mesh(towerGeom, metallicGraphiteMat);
      tower.position.y = (0.5 + 0.8) * h.scale;
      tower.castShadow = true;
      hGroup.add(tower);

      // Antenna / Signal Beacon
      const antennaGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.8 * h.scale, 8);
      const antenna = new THREE.Mesh(antennaGeom, metallicGraphiteMat);
      antenna.position.y = (0.5 + 1.6 + 0.4) * h.scale;
      hGroup.add(antenna);

      const beaconGeom = new THREE.SphereGeometry(0.12 * h.scale, 16, 16);
      const beacon = new THREE.Mesh(beaconGeom, tealGlowMat);
      beacon.position.y = (0.5 + 1.6 + 0.8) * h.scale;
      hGroup.add(beacon);

      worldGroup.add(hGroup);
      hubGroups.push(hGroup);
    });

    // ─── 3. TEAL ILLUMINATED CONDUITS & ACTIVE AGV CARGO PODS ──────────────
    const curves: THREE.CatmullRomCurve3[] = [];
    const pods: THREE.Mesh[] = [];

    hubPositions.forEach((h) => {
      const startPt = new THREE.Vector3(0, 0.3, 0);
      const endPt = new THREE.Vector3(h.pos[0], 0.3, h.pos[2]);
      const midPt = new THREE.Vector3()
        .addVectors(startPt, endPt)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(0, 0.4, 0));

      const curve = new THREE.CatmullRomCurve3([startPt, midPt, endPt]);
      curves.push(curve);

      // Conduit rail
      const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.04, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x26b7a3,
        emissive: 0x26b7a3,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      const tube = new THREE.Mesh(tubeGeom, tubeMat);
      worldGroup.add(tube);

      // Autonomous Moving Pod (AGV / Data capsule)
      const podGeom = new THREE.BoxGeometry(0.3, 0.16, 0.2);
      const podMat = new THREE.MeshStandardMaterial({
        color: 0xebf4f3,
        metalness: 0.9,
        roughness: 0.1,
      });
      const pod = new THREE.Mesh(podGeom, podMat);
      worldGroup.add(pod);
      pods.push(pod);
    });

    // ─── 4. PARALLAX & ANIMATION LOOP ──────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 12;
    let targetCameraY = 10;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth slow camera damping
      targetCameraX = 12 + mouseX * 2.5;
      targetCameraY = 10 + mouseY * 1.5;
      camera.position.x += (targetCameraX - camera.position.x) * 0.03;
      camera.position.y += (targetCameraY - camera.position.y) * 0.03;
      camera.lookAt(0, 1.2, 0);

      // Gentle rotation of the logistics facility
      worldGroup.rotation.y = elapsed * 0.05;

      // Animate pods along conduits
      pods.forEach((pod, idx) => {
        const curve = curves[idx];
        const t = (elapsed * 0.25 + idx * 0.33) % 1;
        const pt = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t);

        pod.position.copy(pt);
        pod.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), tangent);
      });

      // Subtle pulse on glass core
      coreLight.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.05);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] md:h-[620px] lg:h-[680px] flex items-center justify-center overflow-hidden">
      {webGLAvailable ? (
        <div ref={containerRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
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
              Shenzhen · California · Munich routing conduits online. Dynamic replenishment active across 48 global corridors.
            </p>
          </div>
        </div>
      )}

      {/* Floating Translucent Information Panels */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none hidden sm:block">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-graphite/90 border border-electric-teal/30 backdrop-blur-md text-xs text-soft-ivory shadow-lg">
          <span className="w-2 h-2 rounded-full bg-electric-teal animate-pulse" />
          <span className="font-mono font-semibold text-electric-teal uppercase tracking-wider text-[11px]">
            TELEMETRY NODE:
          </span>
          <span className="font-mono text-silver-sage text-[11px]">Active Digital Twin v2.4</span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 pointer-events-none hidden sm:block">
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
