"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function SupplyChain3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLAvailable, setWebGLAvailable] = useState<boolean>(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Check reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = mediaQuery.matches;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 550;

    // ─── THREE.JS SCENE SETUP ──────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b3048, 0.008);

    const camera = new THREE.PerspectiveCamera(39, width / height, 0.1, 100);
    camera.position.set(12, 13, 19);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "default" });
    } catch {
      setWebGLAvailable(false);
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 640 ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ─── LIGHTING ARCHITECTURE ─────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xf2f0e9, 1.5);
    scene.add(ambientLight);
    scene.add(new THREE.HemisphereLight(0xf2f0e9, 0x19455a, 2.0));

    // Key Light (Clean White/Teal directional)
    const dirLight = new THREE.DirectionalLight(0xf2f0e9, 2.0);
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
    const tealRim = new THREE.PointLight(0xb9f12f, 3.5, 30);
    tealRim.position.set(-8, 6, -6);
    scene.add(tealRim);

    // Soft Fill Light
    const fillLight = new THREE.DirectionalLight(0xf2f0e9, 2.0);
    fillLight.position.set(-12, 10, 6);
    scene.add(fillLight);

    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // ─── MATERIALS ─────────────────────────────────────────────────────────
    const metallicGraphiteMat = new THREE.MeshStandardMaterial({
      color: 0xb8c9cc,
      metalness: 0.32,
      roughness: 0.38,
    });

    const darkCharcoalMat = new THREE.MeshStandardMaterial({
      color: 0x19455a,
      metalness: 0.25,
      roughness: 0.48,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xb9f12f,
      transparent: true,
      opacity: 0.55,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.25,
      ior: 1.5,
    });

    const tealGlowMat = new THREE.MeshBasicMaterial({
      color: 0xb9f12f,
    });

    const subtleBorderMat = new THREE.LineBasicMaterial({
      color: 0x90a9af,
      transparent: true,
      opacity: 0.4,
    });

    // ─── ARCHITECTURAL GROUND GRID & PLATFORM ──────────────────────────────
    const platformGeom = new THREE.CylinderGeometry(7.6, 8, 0.65, 96);
    const platform = new THREE.Mesh(platformGeom, darkCharcoalMat);
    platform.position.y = -0.2;
    platform.receiveShadow = true;
    worldGroup.add(platform);

    const gridHelper = new THREE.GridHelper(12, 24, 0x90a9af, 0x2e5063);
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.22;
    gridHelper.position.y = 0.02;
    worldGroup.add(gridHelper);

    // ─── 1. CENTRAL AUTOMATED FULFILLMENT FACILITY ─────────────────────────
    const centralFacility = new THREE.Group();
    centralFacility.position.set(0, 0, 0);

    // Main modern angular warehouse blocks
    const mainBlockGeom = new THREE.BoxGeometry(4.2, 1.8, 3.2);
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

    const pearlMat = new THREE.MeshStandardMaterial({ color: 0xf2f0e9, metalness: .25, roughness: .32 });
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x90a9af, metalness: .42, roughness: .35 });
    const windowMat = new THREE.MeshStandardMaterial({ color: 0xf2f0e9, emissive: 0xf2f0e9, emissiveIntensity: .28, roughness: .2 });
    const box = (parent: THREE.Group, size: number[], position: number[], material: THREE.Material) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size as [number, number, number]), material);
      mesh.position.set(...position as [number, number, number]);
      mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
    };
    box(centralFacility, [4.5,.12,3.5], [0,1.86,0], roofMat);
    // Raised roof seams, translucent atrium, glazed clerestory and loading bays.
    for(let i=0;i<15;i++) box(centralFacility,[.035,.06,3.5],[-2.1+i*.3,1.95,0],pearlMat);
    for(let i=0;i<12;i++) {
      box(centralFacility,[.2,.28,.035],[-1.86+i*.34,1.4,1.62],windowMat);
      box(centralFacility,[.035,1.7,.06],[-2.05+i*.37,.9,1.63],roofMat);
    }
    for(let i=0;i<3;i++) {
      box(centralFacility,[.72,.9,.06],[-1.35+i*1.35,.5,1.65],darkCharcoalMat);
      box(centralFacility,[.76,.05,.08],[-1.35+i*1.35,.98,1.68],tealGlowMat);
      for(let j=0;j<5;j++) box(centralFacility,[.68,.018,.03],[-1.35+i*1.35,.15+j*.14,1.7],roofMat);
    }
    box(centralFacility,[1.2,1.4,2.8],[2.2,.7,-.1],glassMat);
    for(let i=0;i<5;i++) box(centralFacility,[.04,1.5,2.9],[1.65+i*.27,.75,-.1],pearlMat);
    worldGroup.add(centralFacility);

    // Terraced platform with a thin, controlled network perimeter.
    const rim = new THREE.Mesh(new THREE.TorusGeometry(7.65,.025,8,128),tealGlowMat);
    rim.rotation.x = Math.PI/2; rim.position.y = .08; worldGroup.add(rim);
    const lowerRim = new THREE.Mesh(new THREE.TorusGeometry(7.85,.035,8,128),roofMat);
    lowerRim.rotation.x = Math.PI/2; lowerRim.position.y = -.45; worldGroup.add(lowerRim);
    // Transport lanes, road markings, loading apron and cargo containers.
    box(worldGroup,[9,.035,1.25],[0,.04,3.1],darkCharcoalMat);
    for(let i=0;i<18;i++) box(worldGroup,[.22,.015,.035],[-4.25+i*.5,.07,3.1],pearlMat);
    for(let i=0;i<6;i++) {
      const cargo = new THREE.Group(); cargo.position.set(3.4+(i%2)*.7,.15,-2.3+Math.floor(i/2)*.85);
      box(cargo,[.6,.55,.72],[0,.275,0],i%2 ? roofMat : metallicGraphiteMat);
      for(let j=0;j<5;j++) box(cargo,[.025,.52,.74],[-.24+j*.12,.275,0],darkCharcoalMat);
      worldGroup.add(cargo);
    }
    const truck = new THREE.Group(); truck.position.set(-1.8,.18,3.8);
    box(truck,[1.6,.65,.75],[0,.55,0],pearlMat);
    box(truck,[.65,.55,.75],[1.12,.5,0],roofMat);
    box(truck,[.05,.25,.6],[1.46,.63,0],glassMat);
    for(const x of [-.55,.55,1.1]) for(const z of [-.4,.4]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.12,12),darkCharcoalMat);
      wheel.rotation.x = Math.PI/2; wheel.position.set(x,.17,z); truck.add(wheel);
    }
    worldGroup.add(truck);
    // Logistics gantry and hoist provide a distinct architectural silhouette.
    const gantry = new THREE.Group(); gantry.position.set(-3.1,0,-2.8);
    box(gantry,[.13,2.9,.13],[-.9,1.45,0],roofMat);
    box(gantry,[.13,2.9,.13],[.9,1.45,0],roofMat);
    box(gantry,[2.4,.16,.24],[0,2.9,0],pearlMat);
    box(gantry,[.025,1.2,.025],[.35,2.25,0],metallicGraphiteMat);
    box(gantry,[.5,.08,.3],[.35,1.65,0],tealGlowMat);
    box(gantry,[2.6,.06,.65],[0,.06,0],roofMat);
    worldGroup.add(gantry);

    // ─── 2. OUTPOST LOGISTICS HUBS (Shenzhen, California, Munich) ──────────
    const hubPositions = [
      { pos: [-4.8, 0, 3.2], name: "TechSource Shenzhen", scale: 0.75 },
      { pos: [5.0, 0, 2.2], name: "PrimeParts California", scale: 0.8 },
      { pos: [0.5, 0, -5.2], name: "EuroTech Munich", scale: 0.7 },
    ];

    const nodeBeacons: THREE.Mesh[] = [];
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
      nodeBeacons.push(beacon);

      // Pearl cladding and bands keep each regional hub legible at a glance.
      for(let j=0;j<4;j++) box(hGroup,[.85*h.scale,.08,.85*h.scale],[0,(.7+j*.35)*h.scale,0],pearlMat);
      box(hGroup,[1.35*h.scale,.35,.9*h.scale],[.65*h.scale,.25,0],roofMat);
      for(let j=0;j<3;j++) {
        const stack = new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,1.1,12),pearlMat);
        stack.position.set((.3+j*.28)*h.scale,1,-.25); hGroup.add(stack);
      }
      worldGroup.add(hGroup);

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
        .add(new THREE.Vector3(0, 1.8, 0));

      const curve = new THREE.CatmullRomCurve3([startPt, midPt, endPt]);
      curves.push(curve);

      // Conduit rail
      const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.04, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0xb9f12f,
        emissive: 0xb9f12f,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      const tube = new THREE.Mesh(tubeGeom, tubeMat);
      worldGroup.add(tube);

      // Autonomous Moving Pod (AGV / Data capsule)
      const podGeom = new THREE.BoxGeometry(0.3, 0.16, 0.2);
      const podMat = new THREE.MeshStandardMaterial({
        color: 0xf2f0e9,
        metalness: 0.9,
        roughness: 0.1,
      });
      const pod = new THREE.Mesh(podGeom, podMat);
      worldGroup.add(pod);
      pods.push(pod);
    });

    // Presentation clock is independent from procurement and transaction state.
    let mouseX = 0, mouseY = 0, elapsed = 0, lastTime = 0;
    let animationId = 0, visible = true;
    const handleMouseMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = Math.max(-1, Math.min(1, ((e.clientX-rect.left)/rect.width)*2-1));
      mouseY = Math.max(-1, Math.min(1, ((e.clientY-rect.top)/rect.height)*2-1));
    };
    const resetPointer = () => { mouseX = 0; mouseY = 0; };
    container.addEventListener("pointermove", handleMouseMove);
    container.addEventListener("pointerleave", resetPointer);
    const render = (now: number) => {
      animationId = 0;
      const delta = lastTime ? Math.min((now-lastTime)/1000,.05) : 0;
      lastTime = now;
      if (!reducedMotion) elapsed += delta;
      const damping = 1-Math.exp(-delta*3);
      const targetX = 12 + (reducedMotion ? 0 : mouseX*.9 + Math.sin(elapsed*.12)*.6);
      const targetY = 13 + (reducedMotion ? 0 : mouseY*.7);
      camera.position.x += (targetX-camera.position.x)*damping;
      camera.position.y += (targetY-camera.position.y)*damping;
      camera.lookAt(0,.3,0);
      worldGroup.rotation.y = -.18 + (reducedMotion ? 0 : Math.sin(elapsed*.08)*.06);
      pods.forEach((pod,idx) => {
        const t = (elapsed*.065+idx*.33)%1;
        pod.position.copy(curves[idx].getPointAt(t));
        pod.quaternion.setFromUnitVectors(new THREE.Vector3(1,0,0),curves[idx].getTangentAt(t));
      });
      coreLight.scale.setScalar(1+Math.sin(elapsed*.8)*.025);
      nodeBeacons.forEach((beacon,i) => beacon.scale.setScalar(1+Math.sin(elapsed*.7+i)*.07));
      renderer.render(scene,camera);
      if(!reducedMotion && visible && !document.hidden) animationId=requestAnimationFrame(render);
    };
    const resume = () => {
      cancelAnimationFrame(animationId); lastTime = 0;
      if(visible && !document.hidden) animationId=requestAnimationFrame(render);
    };
    const motionChange = () => { reducedMotion=mediaQuery.matches; resetPointer(); resume(); };
    mediaQuery.addEventListener("change",motionChange);
    document.addEventListener("visibilitychange",resume);
    const visibilityObserver = new IntersectionObserver(([entry]) => { visible=entry.isIntersecting; resume(); });
    visibilityObserver.observe(container);
    const resizeObserver = new ResizeObserver(() => {
      const w=container.clientWidth, h=container.clientHeight;
      if(!w || !h) return;
      camera.aspect=w/h;
      // Keep the complete facility in frame on mobile and narrow split layouts.
      camera.fov = w/h < 1 ? 48 : 39;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,w<640 ? 1.5 : 2));
      renderer.setSize(w,h);
      resume();
    });
    resizeObserver.observe(container);
    const contextLost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(animationId); setWebGLAvailable(false); };
    renderer.domElement.addEventListener("webglcontextlost",contextLost);
    resume();
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect(); visibilityObserver.disconnect();
      container.removeEventListener("pointermove",handleMouseMove);
      container.removeEventListener("pointerleave",resetPointer);
      mediaQuery.removeEventListener("change",motionChange);
      document.removeEventListener("visibilitychange",resume);
      renderer.domElement.removeEventListener("webglcontextlost",contextLost);
      const geometries = new Set<THREE.BufferGeometry>();
      const materials = new Set<THREE.Material>();
      scene.traverse(object => {
        const mesh = object as THREE.Mesh;
        if(mesh.geometry) geometries.add(mesh.geometry);
        if(mesh.material) (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(m=>materials.add(m));
      });
      geometries.forEach(g=>g.dispose()); materials.forEach(m=>m.dispose());
      subtleBorderMat.dispose();
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="scene-viewport relative w-full flex items-center justify-center overflow-hidden">
      {webGLAvailable ? (
        <div ref={containerRef} className="absolute inset-0" role="img" aria-label="Interactive supply-chain digital twin with a central warehouse and three connected regional logistics hubs" />
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
      <div className="scene-telemetry absolute top-6 left-6 z-10 pointer-events-none hidden sm:block">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-graphite/90 border border-electric-teal/30 backdrop-blur-md text-xs text-soft-ivory shadow-lg">
          <span className="w-2 h-2 rounded-full bg-electric-teal animate-pulse" />
          <span className="font-mono font-semibold text-electric-teal uppercase tracking-wider text-[11px]">
            TELEMETRY NODE:
          </span>
          <span className="font-mono text-silver-sage text-[11px]">Active Digital Twin v2.4</span>
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
