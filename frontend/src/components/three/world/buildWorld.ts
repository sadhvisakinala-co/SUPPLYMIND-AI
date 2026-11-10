import * as T from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import landPoints from "./land-points.json";

// Original, dimensioned models for this scene. No external model/texture requests.
const LIME = new T.Color("#B9F12F");
const PEARL = new T.Color("#F2F0E9");
const UP = new T.Vector3(0, 1, 0);
const v = (x: number, y: number, z: number) => new T.Vector3(x, y, z);
function rng(seed = 92731) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
let random = rng();
type Mat = T.Material;
type Facility = "warehouse" | "factory" | "port";

function texture(kind: "metal" | "ground" | "rock" | "cloud" | "shadow") {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const c = canvas.getContext("2d")!;
  const s = canvas.width;
  if (kind === "cloud") {
    // Ray-marched, self-shadowed density baked once into a small RGBA sprite.
    // A cluster of overlapping ellipsoids produces a lit cloud, not flat circles.
    const lobes = Array.from({ length: 17 }, (_, i) => ({
      x: (random() - 0.5) * 1.45,
      y: (random() - 0.5) * 0.48,
      z: (random() - 0.5) * 0.6,
      r: 0.22 + random() * 0.3,
    }));
    const density = (x: number, y: number, z: number) => {
      let d = 0;
      for (const l of lobes) {
        const q =
          ((x - l.x) ** 2 + (y - l.y) ** 2 * 1.6 + (z - l.z) ** 2) /
          (l.r * l.r);
        if (q < 1) d += Math.pow(1 - q, 1.2);
      }
      const noise =
        Math.sin(x * 32 + Math.sin(z * 19)) * Math.sin(y * 29 - z * 17) * 0.1 +
        Math.sin(x * 67 - y * 43 + z * 31) * 0.045;
      return Math.max(0, d * (0.82 + noise));
    };
    const pixels = c.createImageData(s, s);
    for (let py = 0; py < s; py++)
      for (let px = 0; px < s; px++) {
        const x = (px / s - 0.5) * 2.8,
          y = (0.5 - py / s) * 1.8;
        let trans = 1,
          r = 0,
          g = 0,
          b = 0;
        for (let step = 0; step < 32 && trans > 0.015; step++) {
          const z = 0.9 - step * 0.057,
            d = density(x, y, z);
          if (d < 0.01) continue;
          const shadow =
            density(x - 0.12, y + 0.16, z + 0.08) +
            density(x - 0.24, y + 0.32, z + 0.16) * 0.7;
          const light = 0.32 + 0.68 * Math.exp(-shadow * 1.5),
            alpha = 1 - Math.exp(-d * 0.15);
          r += trans * alpha * (100 + 145 * light);
          g += trans * alpha * (140 + 108 * light);
          b += trans * alpha * (165 + 85 * light);
          trans *= 1 - alpha;
        }
        const a = 1 - trans,
          i = (py * s + px) * 4;
        if (a > 0.001) {
          pixels.data[i] = r / a;
          pixels.data[i + 1] = g / a;
          pixels.data[i + 2] = b / a;
          pixels.data[i + 3] = a * 255;
        }
      }
    c.putImageData(pixels, 0, 0);
  } else if (kind === "shadow") {
    const g = c.createRadialGradient(s / 2, s / 2, 2, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(0,8,14,.6)");
    g.addColorStop(0.5, "rgba(0,8,14,.22)");
    g.addColorStop(1, "rgba(0,8,14,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, s, s);
  } else {
    const pixels = c.createImageData(s, s);
    for (let y = 0; y < s; y++)
      for (let x = 0; x < s; x++) {
        const i = (y * s + x) * 4;
        const n = (random() - 0.5) * (kind === "rock" ? 45 : 18);
        const value =
          kind === "metal"
            ? 160 + n + (x % 16 < 2 ? 45 : 0)
            : kind === "ground"
              ? 105 + n
              : 110 + n + Math.sin(y * 0.3 + x * 0.08) * 20;
        pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
        pixels.data[i + 3] = 255;
      }
    c.putImageData(pixels, 0, 0);
  }
  const t = new T.CanvasTexture(canvas);
  t.colorSpace = T.SRGBColorSpace;
  if (kind !== "cloud" && kind !== "shadow") {
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.repeat.set(kind === "ground" ? 5 : 2, kind === "ground" ? 5 : 2);
    t.anisotropy = 4;
  }
  return t;
}

export function buildWorld(mobile: boolean) {
  random = rng();
  const root = new T.Group();
  root.name = "SupplyMind reference logistics world";
  const metalTexture = texture("metal"),
    groundTexture = texture("ground"),
    rockTexture = texture("rock"),
    cloudTexture = texture("cloud"),
    shadowTexture = texture("shadow");
  const textures = [
    metalTexture,
    groundTexture,
    rockTexture,
    cloudTexture,
    shadowTexture,
  ];
  const std = (
    color: T.ColorRepresentation,
    metalness = 0,
    roughness = 0.7,
    extra: Partial<T.MeshStandardMaterialParameters> = {},
  ) => new T.MeshStandardMaterial({ color, metalness, roughness, ...extra });
  const mats = {
    wall: std("#a6bcc5", 0.28, 0.52, {
      map: metalTexture,
      bumpMap: metalTexture,
      bumpScale: 0.025,
    }),
    roof: std("#d2dedd", 0.36, 0.44, {
      map: metalTexture,
      bumpMap: metalTexture,
      bumpScale: 0.018,
    }),
    frame: std("#e3e5dd", 0.55, 0.3),
    dark: std("#173b4b", 0.35, 0.6),
    road: std("#486774", 0.38, 0.26, {
      bumpMap: groundTexture,
      bumpScale: 0.012,
    }),
    concrete: std("#b2bbb0", 0.05, 0.85, { map: groundTexture }),
    soil: std("#334e38", 0, 0.94, { bumpMap: groundTexture, bumpScale: 0.08 }),
    rock: std("#174052", 0.05, 0.96, {
      map: rockTexture,
      bumpMap: rockTexture,
      bumpScale: 0.22,
    }),
    glass: std("#4a8797", 0.7, 0.2, {
      emissive: "#759ea1",
      emissiveIntensity: 0.12,
    }),
    rubber: std("#101b22", 0.05, 0.88),
    rim: std("#bcc5c8", 0.8, 0.25),
    wood: std("#8f9070", 0, 0.95),
    crane: std("#c39a64", 0.48, 0.4),
    red: std("#8b554b", 0.25, 0.65),
    green: std("#426d62", 0.3, 0.62),
    blue: std("#526e80", 0.3, 0.6),
    leaf: std("#37652f", 0, 0.92),
    leafLight: std("#66865a", 0, 0.92),
    trunk: std("#484739", 0, 0.95),
    window: std("#f2e9cb", 0.12, 0.35, {
      emissive: "#f2e9cb",
      emissiveIntensity: 0.7,
    }),
    dock: std("#f2ead5", 0, 0.6, {
      emissive: "#f2ead5",
      emissiveIntensity: 0.6,
    }),
    lime: new T.MeshBasicMaterial({
      color: LIME.clone().multiplyScalar(1.8),
      toneMapped: false,
    }),
    routeHalo: new T.MeshBasicMaterial({
      color: LIME,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: T.AdditiveBlending,
    }),
  };
  mats.lime.userData.networkGlow = true;
  mats.routeHalo.userData.networkGlow = true;
  const boxGeo = new T.BoxGeometry(1, 1, 1),
    sphereGeo = new T.SphereGeometry(1, 12, 8);
  const box = (
    g: T.Object3D,
    size: number[],
    pos: number[],
    mat: Mat,
    rot = 0,
  ) => {
    const m = new T.Mesh(boxGeo, mat);
    m.scale.set(size[0], size[1], size[2]);
    m.position.set(pos[0], pos[1], pos[2]);
    m.rotation.y = rot;
    m.castShadow = m.receiveShadow = true;
    g.add(m);
    return m;
  };
  const cylinder = (
    g: T.Object3D,
    rt: number,
    rb: number,
    h: number,
    pos: number[],
    mat: Mat,
    segments = 16,
  ) => {
    const m = new T.Mesh(new T.CylinderGeometry(rt, rb, h, segments), mat);
    m.position.set(...(pos as [number, number, number]));
    m.castShadow = m.receiveShadow = true;
    g.add(m);
    return m;
  };
  const beam = (
    g: T.Object3D,
    a: T.Vector3,
    b: T.Vector3,
    r: number,
    mat: Mat,
  ) => {
    const m = new T.Mesh(new T.CylinderGeometry(r, r, a.distanceTo(b), 6), mat);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(UP, b.clone().sub(a).normalize());
    g.add(m);
    return m;
  };
  const shadow = (
    g: T.Object3D,
    x: number,
    z: number,
    sx: number,
    sz: number,
    y = 0.035,
  ) => {
    const m = new T.Mesh(
      new T.PlaneGeometry(sx, sz),
      new T.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
      }),
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(x, y, z);
    g.add(m);
  };
  // Static architectural detail is merged by material per facility: hundreds of
  // components become a handful of draws while retaining facility raycasting.
  function batch(g: T.Group, facility?: Facility) {
    g.updateMatrixWorld(true);
    const inverse = g.matrixWorld.clone().invert();
    const batches = new Map<Mat, T.BufferGeometry[]>();
    const old: T.Mesh[] = [];
    g.traverse((o) => {
      if (
        !(o instanceof T.Mesh) ||
        o instanceof T.InstancedMesh ||
        Array.isArray(o.material)
      )
        return;
      const geo = o.geometry.clone();
      geo.applyMatrix4(
        new T.Matrix4().multiplyMatrices(inverse, o.matrixWorld),
      );
      if (!geo.getAttribute("uv"))
        geo.setAttribute(
          "uv",
          new T.BufferAttribute(
            new Float32Array(geo.getAttribute("position").count * 2),
            2,
          ),
        );
      const key = o.material;
      const arr = batches.get(key) || [];
      arr.push(geo);
      batches.set(key, arr);
      old.push(o);
    });
    old.forEach((m) => {
      m.removeFromParent();
      if (m.geometry !== boxGeo && m.geometry !== sphereGeo)
        m.geometry.dispose();
    });
    for (const [material, geometries] of Array.from(batches)) {
      const flattened = geometries.map((geo) =>
        geo.index ? geo.toNonIndexed() : geo,
      );
      const merged = mergeGeometries(flattened, false);
      if (merged) {
        const mesh = new T.Mesh(merged, material);
        mesh.castShadow = mesh.receiveShadow = true;
        if (facility) mesh.userData.facility = facility;
        g.add(mesh);
      }
      flattened.forEach((geo) => geo.dispose());
      geometries.forEach((geo) => geo.dispose());
    }
  }

  // Irregular shoreline and a deep, stratified rock foundation, never a disk.
  const n = mobile ? 96 : 128,
    outline: T.Vector2[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 1 + 0.035 * Math.sin(a * 7) + 0.025 * Math.cos(a * 11);
    outline.push(new T.Vector2(Math.cos(a) * 8.45 * r, Math.sin(a) * 5.65 * r));
  }
  const shape = new T.Shape(outline);
  const topGeo = new T.ShapeGeometry(shape, 32);
  topGeo.rotateX(-Math.PI / 2);
  const top = new T.Mesh(topGeo, mats.soil);
  top.receiveShadow = true;
  root.add(top);
  const rockPositions: number[] = [],
    rockColors: number[] = [];
  const rings = [
    { s: 1, y: -0.03 },
    { s: 1.01, y: -0.22 },
    { s: 0.98, y: -0.6 },
    { s: 0.95, y: -1 },
    { s: 0.89, y: -1.5 },
    { s: 0.82, y: -2.1 },
    { s: 0.72, y: -2.8 },
    { s: 0.61, y: -3.5 },
    { s: 0.44, y: -5.4 },
    { s: 0.25, y: -6.9 },
    { s: 0.07, y: -8.3 },
  ];
  const ringPoints = rings.map((ring, j) =>
    outline.map((p, i) =>
      v(
        p.x * ring.s + (j > 1 ? (random() - 0.5) * 0.6 : 0),
        ring.y + (j > 1 ? (random() - 0.5) * 0.55 : 0),
        -p.y * ring.s + j * 0.22 + (j > 1 ? (random() - 0.5) * 0.5 : 0),
      ),
    ),
  );
  function triangle(a: T.Vector3, b: T.Vector3, c: T.Vector3) {
    const shade = 0.65 + random() * 0.55;
    const color = new T.Color("#335c66").multiplyScalar(shade);
    for (const p of [a, b, c]) {
      rockPositions.push(p.x, p.y, p.z);
      rockColors.push(color.r, color.g, color.b);
    }
  }
  for (let j = 0; j < rings.length - 1; j++)
    for (let i = 0; i < n; i++) {
      const k = (i + 1) % n;
      triangle(ringPoints[j][i], ringPoints[j + 1][i], ringPoints[j][k]);
      triangle(ringPoints[j][k], ringPoints[j + 1][i], ringPoints[j + 1][k]);
    }
  const rockGeo = new T.BufferGeometry();
  rockGeo.setAttribute(
    "position",
    new T.Float32BufferAttribute(rockPositions, 3),
  );
  rockGeo.setAttribute("color", new T.Float32BufferAttribute(rockColors, 3));
  const rockUV: number[] = [];
  for (let i = 0; i < rockPositions.length; i += 3)
    rockUV.push(
      rockPositions[i] * 0.3 + rockPositions[i + 2] * 0.2,
      rockPositions[i + 1] * 0.3,
    );
  rockGeo.setAttribute("uv", new T.Float32BufferAttribute(rockUV, 2));
  rockGeo.computeVertexNormals();
  const rockMat = std("#bbd0ce", 0.05, 0.93, {
    vertexColors: true,
    bumpMap: rockTexture,
    bumpScale: 0.23,
  });
  const underside = new T.Mesh(rockGeo, rockMat);
  underside.receiveShadow = true;
  root.add(underside);
  // Additional narrow strata and fractured rock faces provide surface depth.
  const strata = new T.Group();
  for (let i = 0; i < 100; i++) {
    const a = random() * Math.PI * 2;
    const y = -0.4 - random() * 2.7;
    const s = 1 + y * 0.095;
    const m = new T.Mesh(
      new T.DodecahedronGeometry(0.16 + random() * 0.38, 0),
      mats.rock,
    );
    m.position.set(Math.cos(a) * 8.4 * s, y, Math.sin(a) * 5.65 * s);
    m.scale.set(0.55, 0.8 + random() * 2, 0.55);
    m.rotation.set(random(), a, random());
    strata.add(m);
  }
  batch(strata);
  root.add(strata);

  // Road is an actual continuous ribbon with marked lanes and curb shoulders.
  const roadCurve = new T.CatmullRomCurve3(
    [
      v(-4.7, 0.06, 1),
      v(-4.15, 0.06, -0.6),
      v(-2.9, 0.06, -1.65),
      v(0, 0.06, -1.65),
      v(3.4, 0.06, -1.65),
      v(4.4, 0.06, -0.4),
      v(4.4, 0.06, 2.6),
      v(2.5, 0.06, 4.1),
      v(-1.5, 0.06, 4.3),
      v(-4.4, 0.06, 3.5),
    ],
    true,
    "catmullrom",
    0.3,
  );
  function ribbon(
    curve: T.CatmullRomCurve3,
    width: number,
    y: number,
    material: Mat,
  ) {
    const positions: number[] = [],
      indices: number[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = i / 200,
        p = curve.getPointAt(t),
        d = curve.getTangentAt(t),
        normal = v(-d.z, 0, d.x)
          .normalize()
          .multiplyScalar(width / 2);
      positions.push(
        p.x + normal.x,
        y,
        p.z + normal.z,
        p.x - normal.x,
        y,
        p.z - normal.z,
      );
      if (i < 200) {
        const k = i * 2;
        indices.push(k, k + 2, k + 1, k + 1, k + 2, k + 3);
      }
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    const mesh = new T.Mesh(geo, material);
    mesh.receiveShadow = true;
    root.add(mesh);
    return mesh;
  }
  ribbon(roadCurve, 1.3, 0.055, mats.concrete);
  ribbon(roadCurve, 1.14, 0.065, mats.road);
  const markings = new T.Group();
  for (let i = 0; i < 80; i++) {
    const p = roadCurve.getPointAt(i / 80),
      d = roadCurve.getTangentAt(i / 80);
    box(
      markings,
      [0.025, 0.012, 0.18],
      [p.x, 0.077, p.z],
      mats.frame,
      Math.atan2(d.x, d.z),
    );
  }
  batch(markings);
  root.add(markings);
  const apron = new T.Group();
  box(apron, [6.5, 0.07, 4.6], [0, 0.04, 1.05], mats.concrete);
  box(apron, [5.7, 0.02, 3.9], [0, 0.09, 1.3], mats.road);
  for (let i = 0; i < 7; i++)
    box(apron, [0.025, 0.015, 1.45], [-2.2 + i * 0.72, 0.11, 2.4], mats.frame);
  batch(apron);
  root.add(apron);

  const facilities = new Map<Facility, T.Group>();
  const warehouse = new T.Group();
  warehouse.position.set(0.35, 0.12, 1.05);
  warehouse.userData.facility = "warehouse";
  facilities.set("warehouse", warehouse);
  // Custom gabled shell and separated roof surfaces, corrugation, clerestories,
  // hollow bays, weather trim, roof vents, dock shelters, bollards and canopies.
  // Separate walls leave genuine recessed loading bays with visible interiors.
  box(warehouse, [5.1, 2.25, 0.12], [0, 1.125, -1.7], mats.wall);
  for (const side of [-1, 1])
    box(warehouse, [0.12, 2.25, 3.4], [side * 2.55, 1.125, 0], mats.wall);
  box(warehouse, [5.1, 0.9, 0.12], [0, 1.8, 1.7], mats.wall);
  for (let i = 0; i < 5; i++)
    box(
      warehouse,
      [0.23, 1.35, 0.16],
      [-2.46 + i * 1.22, 0.675, 1.7],
      mats.wall,
    );
  const gableShape = new T.Shape();
  gableShape.moveTo(-2.55, 2.25);
  gableShape.lineTo(2.55, 2.25);
  gableShape.lineTo(0, 2.7);
  gableShape.closePath();
  const gableGeo = new T.ExtrudeGeometry(gableShape, {
    depth: 0.12,
    bevelEnabled: false,
  });
  const gable = new T.Mesh(gableGeo, mats.wall);
  gable.position.z = 1.64;
  warehouse.add(gable);
  box(warehouse, [5, 0.06, 3.3], [0, 0.06, 0], mats.concrete);

  for (const sign of [-1, 1]) {
    const roof = box(
      warehouse,
      [2.65, 0.09, 3.7],
      [sign * 1.28, 2.5, 0],
      mats.roof,
    );
    roof.rotation.z = -sign * Math.atan(0.45 / 2.55);
  }
  beam(warehouse, v(0, 2.76, -1.85), v(0, 2.76, 1.85), 0.035, mats.frame);
  for (let i = 0; i < 38; i++) {
    const x = -2.5 + (i * 5) / 37;
    const y = 2.72 - (Math.abs(x) * 0.45) / 2.55;
    beam(warehouse, v(x, y, -1.83), v(x, y, 1.83), 0.012, mats.frame);
  }
  for (let i = 0; i < 31; i++) {
    const x = -2.5 + (i / 30) * 5;
    box(warehouse, [0.022, 1.35, 0.028], [x, 0.72, 1.79], mats.dark);
    box(warehouse, [0.022, 2.1, 0.028], [x, 1.1, -1.715], mats.dark);
  }
  for (const x of [-2.64, 2.64])
    for (let i = 0; i < 22; i++)
      box(
        warehouse,
        [0.03, 2.14, 0.018],
        [x, 1.08, -1.65 + i * 0.157],
        mats.frame,
      );
  for (let i = 0; i < 19; i++) {
    box(
      warehouse,
      [0.205, 0.23, 0.028],
      [-2.35 + i * 0.26, 1.91, 1.79],
      mats.window,
    );
    box(
      warehouse,
      [0.028, 0.23, 0.14],
      [2.64, 1.9, -1.55 + i * 0.17],
      mats.window,
    );
  }
  for (let i = 0; i < 4; i++) {
    const x = -1.85 + i * 1.22;
    box(warehouse, [0.94, 1.25, 0.1], [x, 0.65, 1.16], mats.dark);
    box(warehouse, [0.73, 1.08, 0.04], [x, 0.6, 1.23], mats.dock);
    box(warehouse, [0.3, 0.48, 0.25], [x + 0.16, 0.27, 1.4], mats.wood);
    box(warehouse, [0.22, 0.28, 0.2], [x + 0.1, 0.65, 1.4], mats.wood);
    for (const side of [-1, 1])
      box(
        warehouse,
        [0.09, 1.3, 0.32],
        [x + side * 0.48, 0.65, 1.88],
        mats.rubber,
      );
    box(warehouse, [1.05, 0.08, 0.5], [x, 1.32, 1.96], mats.frame);
    box(warehouse, [0.82, 0.06, 0.5], [x, 0.1, 2.03], mats.road);
    const light = box(
      warehouse,
      [0.65, 0.025, 0.04],
      [x, 1.23, 2.13],
      mats.window,
    );
    for (const side of [-1, 1]) {
      cylinder(
        warehouse,
        0.035,
        0.035,
        0.35,
        [x + side * 0.55, 0.18, 2.25],
        mats.crane,
        8,
      );
      box(
        warehouse,
        [0.1, 0.035, 0.06],
        [x + side * 0.53, 0.5, 1.96],
        mats.lime,
      );
    }
    box(warehouse, [0.3, 0.05, 0.26], [x, 2.61, -0.6], mats.dark);
  }
  const pools = new T.Group();
  const poolCanvas = document.createElement("canvas");
  poolCanvas.width = poolCanvas.height = 64;
  const poolContext = poolCanvas.getContext("2d")!;
  const glow = poolContext.createRadialGradient(32, 32, 0, 32, 32, 32);
  glow.addColorStop(0, "rgba(255,221,139,.5)");
  glow.addColorStop(0.3, "rgba(246,210,123,.22)");
  glow.addColorStop(1, "rgba(230,190,102,0)");
  poolContext.fillStyle = glow;
  poolContext.fillRect(0, 0, 64, 64);
  const poolTexture = new T.CanvasTexture(poolCanvas);
  poolTexture.colorSpace = T.SRGBColorSpace;
  textures.push(poolTexture);
  for (let i = 0; i < 4; i++) {
    const pool = new T.Mesh(
      new T.PlaneGeometry(1.1, 1.5),
      new T.MeshBasicMaterial({
        map: poolTexture,
        transparent: true,
        depthWrite: false,
        blending: T.AdditiveBlending,
      }),
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(-1.5 + i * 1.22, 0.125, 3.25);
    pools.add(pool);
  }
  root.add(pools);

  // Side office volume with a cool reflective facade and pale structural mullions.
  box(warehouse, [0.8, 1.1, 2.5], [2.8, 0.55, -0.15], mats.dark);
  box(warehouse, [0.82, 0.07, 2.6], [2.8, 1.14, -0.15], mats.roof);
  for (let i = 0; i < 7; i++)
    box(
      warehouse,
      [0.025, 0.7, 0.27],
      [3.22, 0.7, -1.15 + i * 0.33],
      mats.glass,
    );
  const hvac = new T.Group();
  for (let i = 0; i < 3; i++) {
    box(hvac, [0.55, 0.23, 0.5], [-1.4 + i * 1.3, 2.68, -0.8], mats.roof);
    cylinder(hvac, 0.17, 0.17, 0.06, [-1.4 + i * 1.3, 2.83, -0.8], mats.dark);
  }
  warehouse.add(hvac);
  shadow(root, 0, 0.7, 7, 5);
  batch(warehouse, "warehouse");
  root.add(warehouse);
  for (const x of [-1.5, 1.1]) {
    const light = new T.PointLight("#ffd395", 1.4, 3.5, 2);
    light.position.set(x, 1.1, 3);
    root.add(light);
  }

  const factory = new T.Group();
  factory.position.set(-5, 0.06, -2.9);
  factory.userData.facility = "factory";
  facilities.set("factory", factory);
  box(factory, [2.7, 1.25, 1.7], [0, 0.625, 0], mats.wall);
  box(factory, [2.9, 0.12, 1.9], [0, 1.31, 0], mats.roof);
  box(factory, [1.3, 1.7, 1.2], [-1.05, 0.85, -0.5], mats.dark);
  box(factory, [1.4, 0.1, 1.3], [-1.05, 1.73, -0.5], mats.roof);
  for (let i = 0; i < 3; i++) {
    const x = -0.35 + i * 0.65;
    const height = 3.25 + i * 0.18;
    cylinder(
      factory,
      0.11,
      0.18,
      height,
      [x, height / 2, -0.5],
      mats.frame,
      20,
    );
    for (let j = 0; j < 3; j++)
      cylinder(
        factory,
        0.116,
        0.12,
        0.13,
        [x, height - 0.2 - j * 0.36, -0.5],
        mats.red,
        20,
      );
    cylinder(factory, 0.12, 0.12, 0.07, [x, height, -0.5], mats.dark, 20);
    box(factory, [0.5, 0.55, 0.6], [x, 0.275, 0.8], mats.glass);
  }
  for (let i = 0; i < 9; i++) {
    box(
      factory,
      [0.19, 0.24, 0.03],
      [-1.14 + i * 0.28, 0.93, 0.87],
      mats.window,
    );
    box(factory, [0.03, 1.2, 0.06], [-1.25 + i * 0.31, 0.62, 0.9], mats.frame);
  }
  for (let i = 0; i < 3; i++) {
    cylinder(
      factory,
      0.28,
      0.28,
      0.75,
      [-1.85 + i * 0.6, 0.375, 0.5],
      mats.roof,
    );
    const lid = new T.Mesh(
      new T.SphereGeometry(0.28, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      mats.roof,
    );
    lid.position.set(-1.85 + i * 0.6, 0.75, 0.5);
    factory.add(lid);
  }
  for (let i = 0; i < 3; i++) {
    beam(
      factory,
      v(-1.7 + i * 0.6, 0.6, 0.5),
      v(-1.7 + i * 0.6, 0.6, 1.3),
      0.045,
      mats.frame,
    );
    beam(
      factory,
      v(-1.7 + i * 0.6, 0.6, 1.3),
      v(-1.7 + i * 0.6, 0.15, 1.3),
      0.045,
      mats.frame,
    );
  }
  shadow(root, -4.8, -2.6, 4, 3);
  batch(factory, "factory");
  root.add(factory);

  // Port: inset water cove, quay, fenders, stacked corrugated containers,
  // two triangulated container cranes, and a tapered cargo vessel hull.
  const port = new T.Group();
  port.userData.facility = "port";
  facilities.set("port", port);
  const waterGeo = new T.PlaneGeometry(3.75, 5.4, 32, 40);
  waterGeo.rotateX(-Math.PI / 2);
  const waterMat = new T.MeshPhysicalMaterial({
    color: "#255b6a",
    metalness: 0.65,
    roughness: 0.16,
    transparent: true,
    opacity: 0.93,
    clearcoat: 1,
    clearcoatRoughness: 0.18,
  });
  const water = new T.Mesh(waterGeo, waterMat);
  water.position.set(6.25, 0.035, -0.7);
  water.receiveShadow = true;
  root.add(water);
  box(port, [0.8, 0.3, 5.3], [5.2, 0.12, -0.7], mats.concrete);
  box(port, [2.3, 0.18, 1.05], [5.8, 0.12, -3.8], mats.concrete);
  for (let i = 0; i < 12; i++) {
    cylinder(
      port,
      0.045,
      0.045,
      0.2,
      [5.5, 0.3, -3.1 + i * 0.43],
      mats.dark,
      8,
    );
    box(port, [0.12, 0.25, 0.22], [5.64, 0.08, -3.1 + i * 0.43], mats.rubber);
  }
  function container(
    g: T.Group,
    x: number,
    y: number,
    z: number,
    color: Mat,
    rotate = 0,
  ) {
    const group = new T.Group();
    group.position.set(x, y, z);
    group.rotation.y = rotate;
    box(group, [0.53, 0.49, 1.1], [0, 0.245, 0], color);
    for (let i = 0; i < 10; i++)
      for (const side of [-1, 1])
        box(
          group,
          [0.025, 0.45, 0.022],
          [side * 0.275, 0.245, -0.49 + i * 0.11],
          mats.frame,
        );
    for (const side of [-1, 1])
      box(
        group,
        [0.56, 0.025, 1.13],
        [0, side < 0 ? 0.02 : 0.48, 0],
        mats.dark,
      );
    box(group, [0.012, 0.42, 0.025], [0, 0.24, 0.565], mats.frame);
    g.add(group);
  }
  for (let i = 0; i < 14; i++)
    container(
      port,
      2.65 + (i % 3) * 0.62,
      0.08 + Math.floor(i / 6) * 0.51,
      -4.25 + Math.floor((i % 6) / 3) * 1.16,
      [mats.red, mats.blue, mats.green][i % 3],
    );
  function crane(x: number, z: number) {
    const g = new T.Group();
    g.position.set(x, 0.1, z);
    for (const side of [-1, 1]) {
      beam(
        g,
        v(side * 0.45, 0, -0.4),
        v(side * 0.6, 2.9, 0),
        0.055,
        mats.crane,
      );
      beam(g, v(side * 0.45, 0, 0.4), v(side * 0.6, 2.9, 0), 0.055, mats.crane);
      box(g, [0.28, 0.13, 1], [side * 0.45, 0.08, 0], mats.dark);
    }
    beam(g, v(-0.65, 2.9, 0), v(0.65, 2.9, 0), 0.06, mats.crane);
    beam(g, v(0, 2.85, -0.6), v(0, 2.85, 2.45), 0.055, mats.crane);
    beam(g, v(0, 3.7, 0), v(0, 2.85, 2.45), 0.026, mats.frame);
    beam(g, v(0, 3.7, 0), v(0, 2.85, -0.6), 0.026, mats.frame);
    beam(g, v(0, 2.8, 0), v(0, 3.7, 0), 0.045, mats.crane);
    for (let i = 0; i < 6; i++) {
      beam(
        g,
        v(-0.13, 2.76, -0.5 + i * 0.5),
        v(0.13, 2.96, i * 0.5),
        0.018,
        mats.crane,
      );
    }
    for (const side of [-1, 1])
      beam(
        g,
        v(side * 0.2, 2.85, 1.7),
        v(side * 0.2, 1.45, 1.7),
        0.012,
        mats.dark,
      );
    box(g, [0.65, 0.1, 0.4], [0, 1.44, 1.7], mats.crane);
    box(g, [0.4, 0.35, 0.45], [0, 2.65, 0.35], mats.glass);
    g.rotation.y = -Math.PI / 2;
    port.add(g);
  }
  crane(5.2, -2.65);
  crane(5.2, -0.2);
  batch(port, "port");
  root.add(port);
  const ship = new T.Group();
  ship.position.set(6.7, 0.12, -1.15);
  ship.rotation.y = -0.55;
  ship.userData.facility = "port";
  const hullShape = new T.Shape();
  hullShape.moveTo(-0.53, -1.8);
  hullShape.lineTo(0.53, -1.8);
  hullShape.lineTo(0.62, 0.85);
  hullShape.quadraticCurveTo(0.52, 1.7, 0, 2.1);
  hullShape.quadraticCurveTo(-0.52, 1.7, -0.62, 0.85);
  hullShape.closePath();
  const hullGeo = new T.ExtrudeGeometry(hullShape, {
    depth: 0.4,
    bevelEnabled: true,
    bevelSize: 0.09,
    bevelThickness: 0.07,
    bevelSegments: 3,
    steps: 1,
  });
  hullGeo.rotateX(-Math.PI / 2);
  const hull = new T.Mesh(hullGeo, mats.dark);
  ship.add(hull);
  box(ship, [1.05, 0.12, 3.35], [0, 0.42, -0.15], mats.red);
  for (let i = 0; i < 8; i++)
    container(
      ship,
      ((i % 2) - 0.5) * 0.53,
      0.48 + Math.floor(i / 6) * 0.5,
      -1.1 + Math.floor((i % 6) / 2) * 1.12,
      [mats.blue, mats.red, mats.green][i % 3],
    );
  box(ship, [0.98, 0.75, 0.5], [0, 0.83, -1.55], mats.frame);
  box(ship, [1.05, 0.21, 0.6], [0, 1.27, -1.55], mats.frame);
  for (let i = 0; i < 5; i++)
    box(ship, [0.13, 0.11, 0.025], [-0.38 + i * 0.19, 1.28, -1.23], mats.glass);
  beam(ship, v(0, 1.4, -1.55), v(0, 1.9, -1.55), 0.018, mats.frame);
  for (let i = 0; i < 14; i++) {
    const z = -1.6 + i * 0.25;
    for (const side of [-1, 1])
      beam(
        ship,
        v(side * 0.52, 0.52, z),
        v(side * 0.52, 0.73, z),
        0.008,
        mats.frame,
      );
  }
  batch(ship, "port");
  root.add(ship);
  shadow(root, 6.5, -0.7, 1.8, 4.9, 0.05);

  // Detailed vehicles: fixed showcase truck plus two road vehicles on a closed
  // distance-parameterized spline. No jumps or implied real delivery telemetry.
  function truck(scale: number) {
    const g = new T.Group(),
      body = new T.Group(),
      wheels: T.Mesh[] = [];
    box(body, [0.7, 0.12, 1.75], [0, 0.26, 0], mats.dark);
    box(body, [0.78, 0.68, 1.25], [0, 0.66, -0.28], mats.frame);
    box(body, [0.74, 0.08, 1.3], [0, 1.03, -0.28], mats.roof);
    const cabShape = new T.Shape();
    cabShape.moveTo(-0.34, 0);
    cabShape.lineTo(0.34, 0);
    cabShape.lineTo(0.34, 0.55);
    cabShape.lineTo(0.22, 0.73);
    cabShape.lineTo(-0.34, 0.73);
    cabShape.closePath();
    const cabGeo = new T.ExtrudeGeometry(cabShape, {
      depth: 0.7,
      bevelEnabled: true,
      bevelSize: 0.025,
      bevelThickness: 0.025,
      bevelSegments: 2,
    });
    cabGeo.rotateY(Math.PI / 2);
    cabGeo.translate(-0.35, 0.3, 0.9);
    const cab = new T.Mesh(cabGeo, mats.frame);
    body.add(cab);
    box(body, [0.63, 0.28, 0.035], [0, 0.82, 1.22], mats.glass);
    for (const side of [-1, 1]) {
      box(body, [0.025, 0.27, 0.3], [side * 0.37, 0.82, 0.93], mats.glass);
      box(body, [0.1, 0.1, 0.05], [side * 0.23, 0.46, 1.27], mats.window);
      box(body, [0.09, 0.12, 0.08], [side * 0.46, 0.74, 1.07], mats.dark);
    }
    box(body, [0.7, 0.07, 0.08], [0, 0.32, 1.29], mats.dark);
    box(body, [0.42, 0.15, 0.04], [0, 0.5, 1.28], mats.dark);
    for (let i = 0; i < 9; i++)
      box(
        body,
        [0.015, 0.6, 0.02],
        [-0.36 + i * 0.09, 0.66, -0.925],
        mats.roof,
      );
    batch(body);
    g.add(body);
    for (const z of [-0.7, 0.1, 0.9])
      for (const side of [-1, 1]) {
        const wheel = new T.Mesh(
          new T.CylinderGeometry(0.19, 0.19, 0.14, 16),
          mats.rubber,
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(side * 0.4, 0.2, z);
        g.add(wheel);
        wheels.push(wheel);
        const hub = new T.Mesh(
          new T.CylinderGeometry(0.1, 0.1, 0.145, 12),
          mats.rim,
        );
        hub.rotation.z = Math.PI / 2;
        hub.position.copy(wheel.position);
        g.add(hub);
        wheels.push(hub);
      }
    g.scale.setScalar(scale);
    return { group: g, wheels };
  }
  const showcase = truck(1);
  showcase.group.position.set(-1.3, 0.15, 3.7);
  showcase.group.rotation.y = -Math.PI / 2;
  root.add(showcase.group);
  shadow(root, -1.3, 3.1, 2.6, 1.5, 0.12);
  const moving = [truck(0.45), truck(0.38)];
  moving.forEach((t) => root.add(t.group));

  // Instanced vegetation and small cargo details: shared geometries/materials.
  const trees = new T.Group();
  const leafGeo = new T.IcosahedronGeometry(1, mobile ? 1 : 2),
    trunkGeo = new T.CylinderGeometry(0.045, 0.065, 0.55, 6);
  const treePoints: number[][] = [];
  for (let i = 0; i < 38; i++) {
    const a = (i / 38) * Math.PI * 2;
    const x = Math.cos(a) * (7.6 + random() * 0.3),
      z = Math.sin(a) * (4.8 + random() * 0.25);
    if ((x > 3.8 && z < 2) || i % 5 === 1 || i % 5 === 2) continue;
    treePoints.push([x, z]);
  }
  for (const [cx, cz] of [
    [-6, -0.7],
    [-6.1, 2.3],
    [6.4, 3.1],
    [1.7, -4.5],
  ])
    for (let i = 0; i < 5; i++)
      treePoints.push([
        cx + (random() - 0.5) * 1.1,
        cz + (random() - 0.5) * 0.7,
      ]);
  const foliage = new T.InstancedMesh(
      leafGeo,
      mats.leaf,
      treePoints.length * 3,
    ),
    trunks = new T.InstancedMesh(trunkGeo, mats.trunk, treePoints.length);
  const dummy = new T.Object3D();
  treePoints.forEach(([x, z], i) => {
    const s = 0.6 + random() * 0.42;
    dummy.position.set(x, 0.32 * s, z);
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    trunks.setMatrixAt(i, dummy.matrix);
    for (let j = 0; j < 3; j++) {
      dummy.position.set(x + (j - 1) * 0.17 * s, 0.65 * s + (j % 2) * 0.13, z);
      dummy.scale.set(0.3 * s, 0.32 * s, 0.26 * s);
      dummy.rotation.set(random(), random(), random());
      dummy.updateMatrix();
      foliage.setMatrixAt(i * 3 + j, dummy.matrix);
      foliage.setColorAt(
        i * 3 + j,
        new T.Color().setHSL(
          0.26 + random() * 0.04,
          0.3 + random() * 0.13,
          0.65 + random() * 0.3,
        ),
      );
    }
  });
  foliage.castShadow = true;
  trunks.castShadow = true;
  trees.add(foliage, trunks);
  root.add(trees);
  const details = new T.Group();
  for (let i = 0; i < 18; i++) {
    const x = -3.35 + (i % 3) * 0.32,
      z = 0.1 + Math.floor(i / 3) * 0.42;
    box(details, [0.27, 0.08, 0.33], [x, 0.12, z], mats.wood);
    box(details, [0.25, 0.24, 0.3], [x, 0.27, z], mats.wood);
    for (const side of [-1, 1])
      box(details, [0.025, 0.25, 0.31], [x + side * 0.08, 0.27, z], mats.frame);
  }
  for (const [x, z] of [
    [-3, 2.6],
    [3, 2.7],
    [-5, -0.4],
    [3.7, -3.9],
  ]) {
    cylinder(details, 0.025, 0.04, 1.2, [x, 0.6, z], mats.dark, 8);
    box(details, [0.22, 0.05, 0.12], [x, 1.23, z], mats.window);
  }
  batch(details);
  root.add(details);

  const routes: T.Mesh[] = [];
  const pulses: { mesh: T.Mesh; curve: T.CatmullRomCurve3; offset: number }[] =
    [];
  const supplyPaths = [
    new T.CatmullRomCurve3([
      v(-4.7, 0.16, -1.6),
      v(-4, 0.18, -0.9),
      v(-3.6, 0.18, 0.4),
      v(-3.5, 0.18, 2.5),
      v(-2.6, 0.18, 3.6),
    ]),
    new T.CatmullRomCurve3([
      v(0.5, 0.18, 3.8),
      v(2.8, 0.18, 3.9),
      v(4, 0.18, 3.1),
      v(4.1, 0.18, 0.5),
      v(4, 0.18, -1.8),
    ]),
  ];
  for (const [i, curve] of Array.from(supplyPaths.entries())) {
    const material = mats.lime.clone();
    const tube = new T.Mesh(
      new T.TubeGeometry(curve, 100, 0.05, 6, false),
      material,
    );
    tube.userData.facility = i === 0 ? "factory" : "port";
    root.add(tube);
    routes.push(tube);
    const halo = new T.Mesh(
      new T.TubeGeometry(curve, 100, 0.09, 8, false),
      mats.routeHalo,
    );
    root.add(halo);
    for (let j = 0; j < 3; j++) {
      const pulse = new T.Mesh(sphereGeo, mats.lime);
      pulse.scale.setScalar(0.055);
      root.add(pulse);
      pulses.push({ mesh: pulse, curve, offset: j / 3 + i * 0.15 });
    }
  }

  const edgePoints = outline
    .filter((_, i) => i % 4 === 0)
    .map((p, i) =>
      v(p.x * 1.015, -0.6 + Math.sin(i * 0.6) * 0.1, -p.y * 1.015),
    );
  const edgeCurve = new T.CatmullRomCurve3(edgePoints, true, "catmullrom", 0.2);
  root.add(
    new T.Mesh(new T.TubeGeometry(edgeCurve, 256, 0.021, 5, true), mats.lime),
  );
  root.add(
    new T.Mesh(
      new T.TubeGeometry(edgeCurve, 256, 0.1, 6, true),
      mats.routeHalo,
    ),
  );

  // Public-domain Natural Earth outlines converted to evenly spaced globe dots.
  const globe = new T.Group();
  globe.position.set(1.3, 4.85, -3.5);
  globe.rotation.z = -0.12;
  const globeMat = new T.MeshPhysicalMaterial({
    color: "#0b3048",
    metalness: 0,
    roughness: 0.65,
    envMapIntensity: 0.12,
    transparent: true,
    opacity: 0.48,
    depthWrite: true,
    side: T.FrontSide,
  });
  const globeSurface = new T.Mesh(new T.SphereGeometry(3.85, 64, 48), globeMat);
  globe.add(globeSurface);
  const geography = new T.Group();
  const dots: number[] = [];
  for (const [lon, lat] of landPoints) {
    const phi = (lat * Math.PI) / 180,
      theta = (lon * Math.PI) / 180;
    dots.push(
      3.88 * Math.cos(phi) * Math.sin(theta),
      3.88 * Math.sin(phi),
      3.88 * Math.cos(phi) * Math.cos(theta),
    );
  }
  const dotGeo = new T.BufferGeometry();
  dotGeo.setAttribute("position", new T.Float32BufferAttribute(dots, 3));
  const dotMat = new T.PointsMaterial({
    color: "#c1e1dc",
    size: mobile ? 0.043 : 0.032,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const earthDots = new T.Points(dotGeo, dotMat);
  earthDots.renderOrder = 1;
  geography.add(earthDots);
  const guides = new T.Group();
  const guideMat = new T.LineBasicMaterial({
    color: "#8eb1bf",
    transparent: true,
    opacity: 0.11,
    depthWrite: false,
  });
  for (let lat = -60; lat <= 60; lat += 30) {
    const phi = (lat * Math.PI) / 180;
    const pts = [];
    for (let i = 0; i <= 160; i++) {
      const a = (i / 160) * Math.PI * 2;
      pts.push(
        v(
          3.9 * Math.cos(phi) * Math.sin(a),
          3.9 * Math.sin(phi),
          3.9 * Math.cos(phi) * Math.cos(a),
        ),
      );
    }
    guides.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), guideMat));
  }
  for (let lng = 0; lng < 180; lng += 30) {
    const pts = [];
    for (let i = 0; i <= 160; i++) {
      const a = (i / 160) * Math.PI * 2,
        b = (lng * Math.PI) / 180;
      pts.push(
        v(
          3.9 * Math.cos(a) * Math.sin(b),
          3.9 * Math.sin(a),
          3.9 * Math.cos(a) * Math.cos(b),
        ),
      );
    }
    guides.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), guideMat));
  }
  globe.add(guides, geography);
  const atmosphere = new T.Mesh(
    new T.SphereGeometry(3.94, 48, 32),
    new T.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: T.FrontSide,
      blending: T.AdditiveBlending,
      uniforms: { color: { value: new T.Color("#8ac4d1") } },
      vertexShader: `varying vec3 n; varying vec3 p; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);p=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `varying vec3 n; varying vec3 p; uniform vec3 color; void main(){float rim=pow(1.-abs(dot(normalize(n),normalize(p))),3.5);gl_FragColor=vec4(color,rim*.42);}`,
    }),
  );
  globe.add(atmosphere);
  const globeNodes: T.Mesh[] = [];
  function globePoint(lon: number, lat: number, r = 3.91) {
    return v(
      r * Math.cos((lat * Math.PI) / 180) * Math.sin((lon * Math.PI) / 180),
      r * Math.sin((lat * Math.PI) / 180),
      r * Math.cos((lat * Math.PI) / 180) * Math.cos((lon * Math.PI) / 180),
    );
  }
  const cities = [
    [-74, 40],
    [10, 51],
    [116, 32],
    [28, -15],
    [-40, -20],
  ];
  cities.forEach(([lon, lat]) => {
    const node = new T.Mesh(sphereGeo, mats.lime);
    node.scale.setScalar(0.065);
    node.position.copy(globePoint(lon, lat));
    geography.add(node);
    globeNodes.push(node);
    const halo = new T.Mesh(new T.SphereGeometry(0.16, 12, 8), mats.routeHalo);
    halo.position.copy(node.position);
    geography.add(halo);
  });
  for (const [a, b] of [
    [0, 1],
    [1, 2],
    [1, 3],
    [0, 4],
    [3, 2],
  ]) {
    const start = globePoint(...(cities[a] as [number, number])),
      end = globePoint(...(cities[b] as [number, number]));
    const points = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      points.push(
        start
          .clone()
          .lerp(end, t)
          .normalize()
          .multiplyScalar(3.92 + Math.sin(t * Math.PI) * 0.45),
      );
    }
    const curve = new T.CatmullRomCurve3(points);
    const line = new T.Mesh(
      new T.TubeGeometry(curve, 72, 0.009, 5, false),
      mats.lime,
    );
    geography.add(line);
    const pulse = new T.Mesh(sphereGeo, mats.lime);
    pulse.scale.setScalar(0.045);
    geography.add(pulse);
    pulses.push({ mesh: pulse, curve, offset: random() });
  }
  root.add(globe);

  // Atmospheric cloud billboards remain in 3D space behind/below the island.
  const clouds: { sprite: T.Sprite; origin: T.Vector3; phase: number }[] = [];
  const cloudPlacements = [
    [-7, 1.3, -5, 5],
    [-4, 2.5, -7, 5],
    [5, 2.8, -7, 6],
    [9, 1, -4, 4],
    [-7, -2, 2, 5],
    [6, -2.8, 3, 6],
    [2, -4.6, 1, 7],
    [-2, -3.7, 3.5, 6],
    [8, -1.4, 2, 4],
    [-9, 0.4, -1, 4],
  ];
  for (const [x, y, z, s] of cloudPlacements) {
    for (let i = 0; i < (mobile ? 2 : 3); i++) {
      const mat = new T.SpriteMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
        color: "#c3d4df",
      });
      const sprite = new T.Sprite(mat);
      sprite.position.set(
        x + (random() - 0.5) * 2,
        y + (random() - 0.5) * 0.7,
        z + (random() - 0.5) * 1.5,
      );
      sprite.scale.set(s * (0.75 + random() * 0.4), s * 0.64, 1);
      root.add(sprite);
      clouds.push({
        sprite,
        origin: sprite.position.clone(),
        phase: random() * 6.28,
      });
    }
  }

  const hoverRings = new Map<Facility, T.Mesh>();
  for (const [name, g] of Array.from(facilities)) {
    const dims =
      name === "warehouse"
        ? [6.2, 4.5]
        : name === "factory"
          ? [3.8, 2.7]
          : [3.1, 5.3];
    const ring = new T.Mesh(
      new T.RingGeometry(0.94, 1, 64),
      new T.MeshBasicMaterial({
        color: LIME,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: T.DoubleSide,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.scale.set(dims[0] / 2, dims[1] / 2, 1);
    ring.position.set(
      name === "port" ? 5 : g.position.x,
      0.14,
      name === "port" ? -0.7 : g.position.z,
    );
    root.add(ring);
    hoverRings.set(name, ring);
  }
  const baseWaterPositions = waterGeo.attributes.position.array.slice();
  const roadLength = roadCurve.getLength();
  let selected: Facility | null = null;
  function hover(name: Facility | null) {
    selected = name;
  }
  function update(time: number, delta: number, reduced: boolean) {
    const t = reduced ? 0 : time;
    moving.forEach((vehicle, i) => {
      const distance = t * 0.37 + i * roadLength * 0.48;
      const u = (distance / roadLength) % 1;
      const p = roadCurve.getPointAt(u),
        tangent = roadCurve.getTangentAt(u);
      vehicle.group.position.copy(p);
      vehicle.group.position.y = 0.12;
      vehicle.group.rotation.y = Math.atan2(tangent.x, tangent.z);
      vehicle.wheels.forEach(
        (w) => (w.rotation.x = distance / (0.19 * (i === 0 ? 0.45 : 0.38))),
      );
    });
    pulses.forEach((pulse, i) =>
      pulse.mesh.position.copy(
        pulse.curve.getPointAt((t * (i < 6 ? 0.07 : 0.024) + pulse.offset) % 1),
      ),
    );
    geography.rotation.y = -0.25 + t * 0.015;
    globeNodes.forEach((node, i) =>
      node.scale.setScalar(0.065 + Math.sin(t * 0.65 + i) * 0.008),
    );
    const intro = reduced ? 1 : T.MathUtils.smoothstep(time, 0.6, 2.3);
    globeMat.opacity = 0.48 * intro;
    dotMat.opacity = 0.82 * intro;
    ship.rotation.z = Math.sin(t * 0.65) * 0.012;
    ship.position.y = 0.12 + Math.sin(t * 0.55) * 0.025;
    const position = waterGeo.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = baseWaterPositions[i * 3],
        z = baseWaterPositions[i * 3 + 2];
      position.setY(
        i,
        Math.sin(x * 4 + z * 2 + t * 0.6) * 0.012 +
          Math.sin(z * 5 - t * 0.5) * 0.008,
      );
    }
    position.needsUpdate = true;
    clouds.forEach(({ sprite, origin, phase }) => {
      sprite.position.x = origin.x + Math.sin(t * 0.025 + phase) * 0.6;
      sprite.position.y = origin.y + Math.sin(t * 0.04 + phase) * 0.06;
    });
    for (const [name, ring] of Array.from(hoverRings)) {
      const mat = ring.material as T.MeshBasicMaterial;
      mat.opacity = reduced
        ? selected === name
          ? 0.24
          : 0
        : T.MathUtils.damp(mat.opacity, selected === name ? 0.24 : 0, 6, delta);
    }
    routes.forEach((route, i) => {
      const mat = route.material as T.MeshBasicMaterial;
      const boost =
        selected === (i === 0 ? "factory" : "port") || selected === "warehouse"
          ? 2.6
          : 1.8;
      mat.color
        .copy(LIME)
        .multiplyScalar(boost * (0.92 + 0.08 * Math.sin(t * 0.5 + i)));
    });
    mats.window.emissiveIntensity = 0.65 + Math.sin(t * 0.7) * 0.035;
  }
  function dispose() {
    const geos = new Set<T.BufferGeometry>([boxGeo, sphereGeo]),
      materials = new Set<Mat>(Object.values(mats));
    root.traverse((o) => {
      if (
        o instanceof T.Mesh ||
        o instanceof T.Points ||
        o instanceof T.Line ||
        o instanceof T.Sprite
      ) {
        if ("geometry" in o) geos.add(o.geometry);
        const mat = o.material;
        (Array.isArray(mat) ? mat : [mat]).forEach((m) => materials.add(m));
      }
    });
    geos.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
  }
  return { root, update, hover, dispose };
}
