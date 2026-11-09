from pathlib import Path
p=Path('frontend/src/components/three/SupplyChain3D.tsx')
s=p.read_text()
s=s.replace('if (mediaQuery.matches) {\n      setWebGLAvailable(false);\n      return;\n    }','let reducedMotion = mediaQuery.matches;')
s=s.replace('scene.fog = new THREE.FogExp2(0x101719, 0.035);','scene.fog = new THREE.FogExp2(0x0b3048, 0.008);')
s=s.replace('new THREE.PerspectiveCamera(40','new THREE.PerspectiveCamera(39').replace('camera.position.set(12, 10, 16)','camera.position.set(12, 13, 19)')
s=s.replace('const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });','let renderer: THREE.WebGLRenderer;\n    try {\n      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "default" });\n    } catch {\n      setWebGLAvailable(false);\n      return;\n    }')
s=s.replace('Math.min(window.devicePixelRatio, 2)','Math.min(window.devicePixelRatio, width < 640 ? 1.5 : 2)')
s=s.replace('renderer.toneMappingExposure = 1.15','renderer.toneMappingExposure = 1.35')
s=s.replace('new THREE.AmbientLight(0x213236, 1.2)','new THREE.AmbientLight(0xf2f0e9, 1.5)')
s=s.replace('scene.add(ambientLight);','scene.add(ambientLight);\n    scene.add(new THREE.HemisphereLight(0xf2f0e9, 0x19455a, 2.0));')
s=s.replace('0xebf4f3','0xf2f0e9').replace('0x26b7a3','0xb9f12f').replace('0x6e9293','0xf2f0e9').replace('0x34494c','0x90a9af').replace('0x213236','0x19455a')
s=s.replace('new THREE.PointLight(0xf2f0e9, 1.5, 25)','new THREE.DirectionalLight(0xf2f0e9, 2.0)').replace('fillLight.position.set(0, -3, 8)','fillLight.position.set(-12, 10, 6)')
s=s.replace('color: 0x182427,\n      metalness: 0.85,\n      roughness: 0.25','color: 0xb8c9cc,\n      metalness: 0.32,\n      roughness: 0.38')
s=s.replace('color: 0x121c1e,\n      metalness: 0.9,\n      roughness: 0.4','color: 0x19455a,\n      metalness: 0.25,\n      roughness: 0.48')
s=s.replace('opacity: 0.35','opacity: 0.55').replace('transmission: 0.7','transmission: 0.25')
s=s.replace('const gridHelper = new THREE.GridHelper(16, 24, 0xb9f12f, 0x19455a);','const gridHelper = new THREE.GridHelper(12, 24, 0x90a9af, 0x2e5063);\n    (gridHelper.material as THREE.Material).transparent = true;\n    (gridHelper.material as THREE.Material).opacity = 0.22;')
s=s.replace('new THREE.CylinderGeometry(8.5, 9.2, 0.4, 64)','new THREE.CylinderGeometry(7.6, 8, 0.65, 96)')
s=s.replace('new THREE.BoxGeometry(3.6, 1.8, 2.6)','new THREE.BoxGeometry(4.2, 1.8, 3.2)')
# Layered facility architecture, warehouse details and transport geometry.
pos='    worldGroup.add(centralFacility);'
s=s.replace(pos,'''    const pearlMat = new THREE.MeshStandardMaterial({ color: 0xf2f0e9, metalness: .25, roughness: .32 });
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
    worldGroup.add(truck);''')
s=s.replace('      worldGroup.add(hGroup);','''      // Pearl cladding and bands keep each regional hub legible at a glance.
      for(let j=0;j<4;j++) box(hGroup,[.85*h.scale,.08,.85*h.scale],[0,(.7+j*.35)*h.scale,0],pearlMat);
      box(hGroup,[1.35*h.scale,.35,.9*h.scale],[.65*h.scale,.25,0],roofMat);
      for(let j=0;j<3;j++) {
        const stack = new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,1.1,12),pearlMat);
        stack.position.set((.3+j*.28)*h.scale,1,-.25); hGroup.add(stack);
      }
      worldGroup.add(hGroup);''')
s=s.replace('const midPt = new THREE.Vector3()','const midPt = new THREE.Vector3()').replace('.add(new THREE.Vector3(0, 0.4, 0))','.add(new THREE.Vector3(0, 1.8, 0))')
start=s.index('    // ─── 4. PARALLAX')
end=s.index('\n  }, []);',start)
s=s[:start]+'''    // Presentation clock is independent from procurement and transaction state.
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
    };''' +s[end:]
s=s.replace('relative w-full h-[520px] md:h-[620px] lg:h-[680px]','scene-viewport relative w-full')
s=s.replace('className="absolute inset-0 cursor-grab active:cursor-grabbing"','className="absolute inset-0" role="img" aria-label="Interactive supply-chain digital twin with a central warehouse and three connected regional logistics hubs"')
s=s.replace('absolute top-6 left-6','scene-telemetry absolute top-6 left-6').replace('absolute bottom-6 right-6','scene-statistics absolute bottom-6 right-6')
p.write_text(s)
