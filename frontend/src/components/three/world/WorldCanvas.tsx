"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as T from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { buildWorld } from "./buildWorld";

type Props = { active: boolean; reduced: boolean; onFailure: () => void };
function World({ reduced }: { reduced: boolean }) {
  const { size, camera, gl, pointer, invalidate } = useThree();
  const mobile = size.width < 600;
  const world = useMemo(() => buildWorld(mobile), [mobile]);
  const time = useRef(0);
  const target = useMemo(() => new T.Vector3(0, 1.7, 0), []);
  useEffect(() => {
    time.current = 0;
    invalidate();
    return () => world.dispose();
  }, [world, invalidate]);
  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    if (!reduced) time.current += delta;
    const progress = reduced ? 1 : T.MathUtils.smoothstep(time.current, 0, 2.2);
    // Framing uses both dimensions, including the complete globe and rock tip.
    const aspect = size.width / size.height;
    const distance = Math.max(26, 26 / aspect);
    const cameraDistance = distance + (1 - progress) * 2.3;
    const x = reduced ? 0 : T.MathUtils.clamp(pointer.x, -1, 1) * 0.7;
    const y = reduced ? 0 : T.MathUtils.clamp(pointer.y, -1, 1) * 0.4;
    const desired = new T.Vector3(10 + x, 17 + y, cameraDistance);
    camera.position.lerp(desired, reduced ? 1 : 1 - Math.exp(-delta * 3));
    camera.lookAt(target);
    world.update(time.current, delta, reduced);
    const selected = gl.domElement.dataset.facility;
    if (reduced && selected) world.update(0, 0.1, true);
  });
  const hover = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const id = event.object.userData.facility as
      | "factory"
      | "warehouse"
      | "port"
      | undefined;
    world.hover(id || null);
    gl.domElement.dataset.facility = id || "";
    gl.domElement.style.cursor = id ? "pointer" : "default";
    invalidate();
  };
  const leave = () => {
    world.hover(null);
    gl.domElement.dataset.facility = "";
    gl.domElement.style.cursor = "default";
    invalidate();
  };
  return (
    <primitive
      object={world.root}
      dispose={null}
      onPointerMove={hover}
      onPointerOut={leave}
    />
  );
}

function RenderEffects({ reduced, active, onFailure }: Props) {
  const { gl, scene, camera, size, invalidate, setDpr } = useThree();
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  useEffect(() => {
    gl.domElement.dataset.renderState = active
      ? reduced
        ? "reduced"
        : "running"
      : "paused";
  }, [gl, active, reduced]);
  const composer = useRef<{ render: (delta:number)=>void } | null>(null);
  const bloomEnabled = useRef(size.width >= 600);
  const stats = useRef({ frames: 0, elapsed: 0, slow: 0, measured: 0 });
  useEffect(() => {
    if (size.width < 600) {
      bloomEnabled.current = false;
      return;
    }
    const glowComposer = new EffectComposer(gl);
    glowComposer.renderToScreen = false;
    const glowRender = new RenderPass(scene, camera);
    const bloom = new UnrealBloomPass(new T.Vector2(size.width, size.height), .38, .4, 1.05);
    glowComposer.addPass(glowRender);
    glowComposer.addPass(bloom);
    const finalComposer = new EffectComposer(gl);
    const baseRender = new RenderPass(scene, camera);
    const combine = new ShaderPass({
      uniforms: {tDiffuse:{value:null}, glowTexture:{value:bloom.renderTargetsHorizontal[0].texture}},
      vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `uniform sampler2D tDiffuse; uniform sampler2D glowTexture; varying vec2 vUv; void main(){vec4 base=texture2D(tDiffuse,vUv);vec3 glow=texture2D(glowTexture,vUv).rgb;gl_FragColor=vec4(base.rgb+glow,base.a);}`,
    });
    const output = new OutputPass();
    finalComposer.addPass(baseRender);finalComposer.addPass(combine);finalComposer.addPass(output);
    glowComposer.setSize(size.width,size.height);finalComposer.setSize(size.width,size.height);
    const black = new T.MeshBasicMaterial({color:0x000000});
    const savedMaterials = new Map<T.Mesh,T.Material|T.Material[]>();
    const hidden: T.Object3D[] = [];
    composer.current = {render(delta) {
      // Preserve geometric occlusion, but isolate bloom strictly to network materials.
      scene.traverse(object=>{
        if(object instanceof T.Mesh && !Array.isArray(object.material) && !object.material.userData.networkGlow){savedMaterials.set(object,object.material);object.material=black;}
        else if((object instanceof T.Sprite || object instanceof T.Points || object instanceof T.Line)&&object.visible){hidden.push(object);object.visible=false;}
      });
      try {glowComposer.render(delta);}
      finally {savedMaterials.forEach((material,mesh)=>mesh.material=material);savedMaterials.clear();hidden.forEach(object=>object.visible=true);hidden.length=0;}
      finalComposer.render(delta);
    }};
    bloomEnabled.current = true;
    invalidate();
    return () => {
      composer.current = null;
      black.dispose();glowRender.dispose();bloom.dispose();baseRender.dispose();combine.dispose();output.dispose();glowComposer.dispose();finalComposer.dispose();
    };

  }, [gl, scene, camera, size.width, size.height, invalidate]);
  useFrame((_, delta) => {
    gl.info.autoReset = false;
    gl.info.reset();
    gl.domElement.dataset.frames = String(
      Number(gl.domElement.dataset.frames || 0) + 1,
    );
    if (composer.current && bloomEnabled.current)
      composer.current.render(delta);
    else gl.render(scene, camera);
    const s = stats.current;
    s.frames++;
    s.elapsed += delta;
    if (s.elapsed >= 1) {
      const fps = s.frames / s.elapsed;
      gl.domElement.dataset.renderFps = fps.toFixed(1);
      gl.domElement.dataset.drawCalls = String(gl.info.render.calls);
      gl.domElement.dataset.triangles = String(gl.info.render.triangles);
      gl.domElement.dataset.pixelRatio = gl.getPixelRatio().toFixed(2);
      gl.domElement.dataset.bloom = String(bloomEnabled.current);
      gl.domElement.dataset.motion = reduced ? "reduced" : "animated";
      // Degrade effects once after sustained slow frames, rather than oscillating.
      if (!reduced && ++s.measured > 3 && fps < 32) s.slow++;
      else s.slow = 0;
      if (s.slow >= 3) {
        bloomEnabled.current = false;
        setDpr(1);
        s.slow = 0;
      }
      s.frames = 0;
      s.elapsed = 0;
    }
  }, 1);
  return null;
}

export default function WorldCanvas({ active, reduced, onFailure }: Props) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.5]}
      frameloop={active && !reduced ? "always" : "demand"}
      camera={{ position: [10, 17, 32], fov: 37, near: 0.1, far: 110 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: T.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x0b3048, 0);
        gl.shadowMap.type = T.PCFShadowMap;
        const canvas = gl.domElement;
        canvas.setAttribute(
          "aria-label",
          "Interactive floating logistics island with warehouse, factory, shipping port and global supply routes",
        );
      }}
      fallback={null}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.7} color="#B8C9CC" />
      <hemisphereLight args={["#C5E0E8", "#173C49", 1.5]} />
      <directionalLight
        position={[-7, 15, 10]}
        intensity={2.4}
        color="#F2F0E9"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-camera-far={45}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />
      <directionalLight position={[8, 7, -8]} intensity={1.7} color="#9EC7D7" />
      <directionalLight position={[4, 2, 9]} intensity={0.55} color="#F2F0E9" />
      <Environment resolution={64} frames={1}>
        <Lightformer
          form="rect"
          intensity={2}
          color="#F2F0E9"
          position={[-5, 8, 4]}
          scale={[12, 5, 1]}
          rotation-x={Math.PI / 2}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#B8C9CC"
          position={[5, 5, -5]}
          scale={[8, 8, 1]}
        />
      </Environment>
      <World reduced={reduced} />
      <RenderEffects reduced={reduced} active={active} onFailure={onFailure} />
    </Canvas>
  );
}
