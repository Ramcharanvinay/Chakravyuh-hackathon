import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Shared helpers: materials, CAD edge lines, annotations, textures
// ---------------------------------------------------------------------------

type Updater = (t: number, dt: number) => void;
const setUpdate = (g: THREE.Group, fn: Updater) => {
  g.userData.update = fn;
};

const phys = (color: number, o: THREE.MeshPhysicalMaterialParameters = {}) =>
  new THREE.MeshPhysicalMaterial({ color, roughness: 0.35, metalness: 0.6, ...o });

const glow = (color: number, intensity = 1.6) =>
  new THREE.MeshStandardMaterial({
    color: new THREE.Color(color).multiplyScalar(0.35),
    emissive: color,
    emissiveIntensity: intensity * 0.38,
    roughness: 0.7,
    metalness: 0,
    envMapIntensity: 0.2,
    toneMapped: false,
  });

// Crisp feature-edge outline: the "hidden line" look of a CAD viewport.
const cad = (mesh: THREE.Mesh, color = 0xffffff, opacity = 0.35, threshold = 28) => {
  mesh.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry, threshold),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity })
    )
  );
  return mesh;
};

const add = <T extends THREE.Object3D>(parent: THREE.Object3D, child: T, x = 0, y = 0, z = 0) => {
  child.position.set(x, y, z);
  parent.add(child);
  return child;
};

const extrude = (shape: THREE.Shape, depth: number, bevel = 0.04) => {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 32,
  });
  geo.translate(0, 0, -depth / 2);
  return geo;
};

const roundedRect = (w: number, h: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
};

const strut = (a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material) => {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, a.distanceTo(b), 10), mat);
  m.position.copy(a.clone().add(b).multiplyScalar(0.5));
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  return m;
};

const tube = (pts: THREE.Vector3[], r: number, mat: THREE.Material, closed = false, seg = 48) =>
  new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, closed), seg, r, 10, closed), mat);

const canvasTexture = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, aniso: number) => {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  return t;
};

const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Drafting-style annotation: leader line, anchor dot and a boxed label.
const makeLabel = (text: string, color: number) => {
  const font = 'bold 28px Consolas, Menlo, monospace';
  const cv = document.createElement('canvas');
  const c = cv.getContext('2d')!;
  c.font = font;
  const w = Math.ceil(c.measureText(text).width) + 28;
  cv.width = w;
  cv.height = 52;
  c.font = font;
  c.fillStyle = 'rgba(6,8,12,0.88)';
  c.fillRect(0, 0, w, 52);
  c.strokeStyle = '#' + color.toString(16).padStart(6, '0');
  c.lineWidth = 2;
  c.strokeRect(1, 1, w - 2, 50);
  c.fillStyle = '#e8edf5';
  c.textBaseline = 'middle';
  c.fillText(text, 14, 27);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, toneMapped: false }));
  sp.scale.set(w / 150, 52 / 150, 1);
  sp.renderOrder = 20;
  return sp;
};

const callout = (ann: THREE.Group, text: string, target: THREE.Vector3, at: THREE.Vector3, color: number) => {
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([target, at]),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9, depthTest: false })
  );
  line.renderOrder = 19;
  ann.add(line);
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), new THREE.MeshBasicMaterial({ color, depthTest: false }));
  dot.position.copy(target);
  dot.renderOrder = 19;
  ann.add(dot);
  const label = makeLabel(text, color);
  label.position.copy(at).add(new THREE.Vector3(0, 0.2, 0));
  ann.add(label);
};

const newAnnotations = (g: THREE.Group) => {
  const ann = new THREE.Group();
  ann.name = 'annotations';
  g.add(ann);
  return ann;
};

const gridFloor = (w: number, d: number, step: number, color: number, opacity = 0.22, y = 0) => {
  const pts: number[] = [];
  for (let x = -w / 2; x <= w / 2 + 1e-6; x += step) pts.push(x, y, -d / 2, x, y, d / 2);
  for (let z = -d / 2; z <= d / 2 + 1e-6; z += step) pts.push(-w / 2, y, z, w / 2, y, z);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
};

const solarTexture = (aniso: number, cols = 8, rows = 14) =>
  canvasTexture(
    512,
    896,
    c => {
      c.fillStyle = '#aeb9c8';
      c.fillRect(0, 0, 512, 896);
      const cw = 512 / cols;
      const ch = 896 / rows;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const g = c.createLinearGradient(i * cw, j * ch, (i + 1) * cw, (j + 1) * ch);
          g.addColorStop(0, '#0a1f4d');
          g.addColorStop(1, '#16418f');
          c.fillStyle = g;
          c.fillRect(i * cw + 2, j * ch + 2, cw - 4, ch - 4);
          c.strokeStyle = 'rgba(200,214,235,0.5)';
          c.lineWidth = 1;
          for (let k = 1; k < 4; k++) {
            c.beginPath();
            c.moveTo(i * cw + (cw / 4) * k, j * ch + 2);
            c.lineTo(i * cw + (cw / 4) * k, (j + 1) * ch - 2);
            c.stroke();
          }
        }
      }
    },
    aniso
  );

// ---------------------------------------------------------------------------
// 1. CYBERSECURITY & BLOCKCHAIN: server rack, brass padlock, hash-linked blocks
// ---------------------------------------------------------------------------

const rackFaceTexture = (aniso: number, alert: boolean, seed: number) =>
  canvasTexture(
    1024,
    128,
    c => {
      const rand = rng(seed);
      c.fillStyle = '#1a1e26';
      c.fillRect(0, 0, 1024, 128);
      c.fillStyle = '#2b313c';
      c.fillRect(0, 0, 1024, 6);
      c.fillStyle = '#0b0d11';
      for (let i = 0; i < 40; i++) for (let j = 0; j < 4; j++) c.fillRect(24 + i * 8, 26 + j * 20, 4, 12);
      for (let i = 0; i < 6; i++) {
        c.fillStyle = '#0e1116';
        c.fillRect(380 + i * 92, 22, 82, 84);
        c.strokeStyle = '#3a4250';
        c.strokeRect(380 + i * 92, 22, 82, 84);
        c.fillStyle = '#4a5568';
        c.fillRect(392 + i * 92, 84, 58, 10);
        c.fillStyle = rand() > 0.5 ? '#24e07a' : '#2f9bff';
        c.fillRect(392 + i * 92, 32, 8, 8);
        c.fillStyle = alert && i === 2 ? '#ff2a55' : '#24e07a';
        c.fillRect(406 + i * 92, 32, 8, 8);
      }
      if (alert) {
        c.fillStyle = '#ff2a55';
        c.fillRect(0, 118, 1024, 6);
      }
      c.beginPath();
      c.arc(960, 64, 14, 0, Math.PI * 2);
      c.fillStyle = '#2b313c';
      c.fill();
      c.fillStyle = alert ? '#ff2a55' : '#24e07a';
      c.fillRect(950, 58, 20, 12);
    },
    aniso
  );

const hashTexture = (aniso: number, seed: number) =>
  canvasTexture(
    256,
    256,
    c => {
      const rand = rng(seed);
      c.fillStyle = '#12070b';
      c.fillRect(0, 0, 256, 256);
      c.strokeStyle = '#ff2a55';
      c.lineWidth = 4;
      c.strokeRect(6, 6, 244, 244);
      c.font = 'bold 20px Consolas, monospace';
      c.fillStyle = '#ff5576';
      c.fillText('BLOCK #' + (4000 + seed * 7), 18, 36);
      c.font = '16px Consolas, monospace';
      for (let r = 0; r < 9; r++) {
        let s = '';
        for (let i = 0; i < 14; i++) s += Math.floor(rand() * 16).toString(16);
        c.fillStyle = r % 3 === 0 ? '#ff8aa0' : '#8a2a40';
        c.fillText(s.toUpperCase(), 18, 66 + r * 20);
      }
      c.fillStyle = '#ff2a55';
      c.fillRect(18, 232, 90, 6);
    },
    aniso
  );

const chainLink = (rotX: number) => {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < 16; i++) {
    const t = (i / 16) * Math.PI * 2;
    const y = Math.max(-1, Math.min(1, Math.sin(t) * 1.6)) * 0.09;
    pts.push(new THREE.Vector3(Math.cos(t) * 0.15 * 1.55, y, 0));
  }
  const m = tube(pts, 0.032, phys(0xdfe4ea, { metalness: 1, roughness: 0.18 }), true, 48);
  m.rotation.x = rotX;
  return m;
};

export function buildCyberGate(aniso: number): THREE.Group {
  const g = new THREE.Group();
  const crimson = 0xff2a55;
  const steel = phys(0x4a525f, { metalness: 1, roughness: 0.32 });
  const darkSteel = phys(0x20252d, { metalness: 0.9, roughness: 0.4 });
  const W = 1.7;
  const H = 4.4;
  const D = 1.7;

  g.add(gridFloor(10, 7, 1, crimson, 0.18));

  cad(add(g, new THREE.Mesh(new THREE.BoxGeometry(W + 0.14, 0.14, D + 0.14), darkSteel), 0, 0.07, 0), crimson, 0.5);
  cad(add(g, new THREE.Mesh(new THREE.BoxGeometry(W + 0.14, 0.1, D + 0.14), darkSteel), 0, H, 0), crimson, 0.5);
  [-1, 1].forEach(sx =>
    [-1, 1].forEach(sz =>
      cad(add(g, new THREE.Mesh(new THREE.BoxGeometry(0.1, H, 0.1), steel), (sx * W) / 2, H / 2, (sz * D) / 2), 0xffffff, 0.35)
    )
  );
  const ventTex = canvasTexture(
    256,
    512,
    c => {
      c.fillStyle = '#14181e';
      c.fillRect(0, 0, 256, 512);
      c.fillStyle = '#05070a';
      for (let i = 0; i < 12; i++) for (let j = 0; j < 40; j++) c.fillRect(20 + i * 19, 14 + j * 12, 12, 4);
    },
    aniso
  );
  const sideMat = phys(0xffffff, { map: ventTex, metalness: 0.7, roughness: 0.5 });
  [-1, 1].forEach(sx => add(g, new THREE.Mesh(new THREE.BoxGeometry(0.04, H - 0.2, D - 0.1), sideMat), (sx * W) / 2, H / 2, 0));
  add(g, new THREE.Mesh(new THREE.BoxGeometry(W, H - 0.2, 0.04), darkSteel), 0, H / 2, -D / 2);

  for (let i = 0; i < 10; i++) {
    const face = new THREE.MeshStandardMaterial({ map: rackFaceTexture(aniso, i === 6, 3 + i), metalness: 0.6, roughness: 0.4 });
    const srv = new THREE.Mesh(new THREE.BoxGeometry(W - 0.22, 0.33, D - 0.4), [darkSteel, darkSteel, darkSteel, darkSteel, face, darkSteel]);
    srv.position.set(0, 0.42 + i * 0.39, -0.05);
    g.add(cad(srv, 0xffffff, 0.28));
  }

  const cableMats = [glow(crimson, 1.4), phys(0x101216, { roughness: 0.6 }), phys(0x6b7482, { roughness: 0.5 })];
  for (let i = 0; i < 6; i++) {
    const y = 0.6 + i * 0.58;
    const x = W / 2 - 0.2;
    g.add(
      tube(
        [new THREE.Vector3(x, y, 0.62), new THREE.Vector3(x + 0.08, y - 0.2, 0.95), new THREE.Vector3(x + 0.1, y - 0.8, 1.0), new THREE.Vector3(x + 0.04, 0.3, 0.95)],
        0.03,
        cableMats[i % 3]
      )
    );
  }
  add(g, new THREE.Mesh(new THREE.BoxGeometry(W - 0.2, 0.05, 0.05), glow(crimson, 2)), 0, H - 0.14, D / 2 + 0.02);

  // Brass padlock
  const lock = new THREE.Group();
  lock.position.set(-2.55, 0.62, 1.55);
  lock.rotation.y = 0.45;
  g.add(lock);
  const brass = phys(0xc89a35, { metalness: 1, roughness: 0.24 });
  lock.add(cad(new THREE.Mesh(extrude(roundedRect(1.15, 0.95, 0.14), 0.42, 0.05), brass), 0x5a3f08, 0.6));
  add(lock, new THREE.Mesh(extrude(roundedRect(0.95, 0.72, 0.1), 0.02, 0.01), phys(0x9a7424, { metalness: 1, roughness: 0.3 })), 0, 0, 0.255);
  const sh = [[-0.36, 0], [-0.36, 0.28], [-0.25, 0.55], [0, 0.68], [0.25, 0.55], [0.36, 0.28], [0.36, 0]].map(([x, y]) => new THREE.Vector3(x, y + 0.45, 0));
  lock.add(tube(sh, 0.09, phys(0xe6eaf0, { metalness: 1, roughness: 0.12 }), false, 48));
  const hole = new THREE.MeshBasicMaterial({ color: 0x0a0604 });
  add(lock, new THREE.Mesh(new THREE.CircleGeometry(0.1, 28), hole), 0, 0.06, 0.28);
  add(lock, new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.24, 0.005), hole), 0, -0.12, 0.28);

  // Hash-linked blocks joined by interlocking chain links
  const xs = [-0.5, 1.0, 2.5];
  xs.forEach((x, i) => {
    const m = phys(0xffffff, { map: hashTexture(aniso, i + 1), metalness: 0.4, roughness: 0.35, clearcoat: 0.6 });
    const blk = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.95), m);
    blk.position.set(x, 0.62, 3.1);
    g.add(cad(blk, crimson, 0.95));
    if (i < xs.length - 1) [0.62, 0.88].forEach((o, k) => add(g, chainLink(k % 2 ? Math.PI / 2 : 0), x + o, 0.62, 3.1));
  });

  const ann = newAnnotations(g);
  callout(ann, '42U SERVER RACK', new THREE.Vector3(0.7, 3.8, 0.85), new THREE.Vector3(2.6, 4.7, 0.85), crimson);
  callout(ann, 'HASH-LINKED BLOCKS', new THREE.Vector3(1.0, 1.1, 3.1), new THREE.Vector3(2.6, 2.1, 3.3), crimson);
  callout(ann, 'HARDENED LOCK', new THREE.Vector3(-2.55, 1.0, 1.7), new THREE.Vector3(-3.4, 2.2, 1.7), crimson);

  return g;
}

// ---------------------------------------------------------------------------
// 2. SPACE TECHNOLOGY: GEO communications satellite
// ---------------------------------------------------------------------------

const foilTexture = (aniso: number) =>
  canvasTexture(
    512,
    512,
    c => {
      const rand = rng(11);
      c.fillStyle = '#b8862a';
      c.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 700; i++) {
        const x = rand() * 512;
        const y = rand() * 512;
        c.fillStyle = rand() > 0.5 ? 'rgba(255,224,150,0.16)' : 'rgba(70,40,0,0.18)';
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x + (rand() - 0.5) * 70, y + (rand() - 0.5) * 70);
        c.lineTo(x + (rand() - 0.5) * 70, y + (rand() - 0.5) * 70);
        c.closePath();
        c.fill();
      }
    },
    aniso
  );

export function buildSpaceGate(aniso: number): THREE.Group {
  const g = new THREE.Group();
  const cyan = 0x00d2ff;
  const sat = new THREE.Group();
  sat.position.y = 2.4;
  sat.rotation.set(0.18, -0.5, 0);
  g.add(sat);

  const foil = phys(0xffffff, { map: foilTexture(aniso), metalness: 0.9, roughness: 0.32, clearcoat: 0.3 });
  const radiatorTex = canvasTexture(
    256,
    256,
    c => {
      c.fillStyle = '#e9edf2';
      c.fillRect(0, 0, 256, 256);
      c.strokeStyle = '#9aa5b4';
      c.lineWidth = 2;
      for (let i = 0; i <= 8; i++) {
        c.beginPath();
        c.moveTo(i * 32, 0);
        c.lineTo(i * 32, 256);
        c.moveTo(0, i * 32);
        c.lineTo(256, i * 32);
        c.stroke();
      }
    },
    aniso
  );
  const radiator = phys(0xffffff, { map: radiatorTex, metalness: 0.3, roughness: 0.4 });
  const chrome = phys(0xdfe4ea, { metalness: 1, roughness: 0.14 });
  const dark = phys(0x161b24, { metalness: 0.7, roughness: 0.4 });
  const gold = phys(0xc89a35, { metalness: 1, roughness: 0.2 });

  // Bus
  sat.add(cad(new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 1.5), foil), 0x3a2600, 0.7));
  [0.82, -0.82].forEach(y => add(sat, new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 1.3), radiator), 0, y, 0));

  // Solar arrays, rotating slowly about X to track the sun
  const cellMat = phys(0xffffff, { map: solarTexture(aniso), metalness: 0.5, roughness: 0.24, clearcoat: 1 });
  const frameMat = phys(0xaab3c0, { metalness: 0.9, roughness: 0.3 });
  const arms: THREE.Group[] = [];
  [-1, 1].forEach(side => {
    const arm = new THREE.Group();
    arm.position.x = side * 0.7;
    sat.add(arm);
    arms.push(arm);
    arm.add(strut(new THREE.Vector3(0, 0, 0), new THREE.Vector3(side * 0.5, 0, 0), 0.06, chrome));
    [1.15, 2.3].forEach(cx => {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.04, 1.95), [frameMat, frameMat, cellMat, dark, frameMat, frameMat]);
      panel.position.x = side * cx;
      arm.add(cad(panel, cyan, 0.7));
    });
    arm.add(strut(new THREE.Vector3(side * 1.72, 0, -0.9), new THREE.Vector3(side * 1.72, 0, 0.9), 0.035, chrome));
  });

  // Parabolic reflector with ribs and a feed horn at the focus
  const R = 1.0;
  const f = 0.8;
  const prof: THREE.Vector2[] = [];
  for (let i = 0; i <= 24; i++) {
    const r = (i / 24) * R;
    prof.push(new THREE.Vector2(r, (r * r) / (4 * f)));
  }
  const dish = new THREE.Mesh(
    new THREE.LatheGeometry(prof, 72),
    new THREE.MeshPhysicalMaterial({ color: 0xe9edf2, metalness: 0.7, roughness: 0.32, side: THREE.DoubleSide })
  );
  const dishGroup = new THREE.Group();
  dishGroup.position.set(0.05, 0.25, 1.35);
  dishGroup.rotation.set(-0.25 + Math.PI / 2, 0.18, 0);
  sat.add(dishGroup);
  dishGroup.add(dish);
  const ribs: number[] = [];
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2;
    for (let i = 0; i < 24; i++) {
      const r0 = (i / 24) * R;
      const r1 = ((i + 1) / 24) * R;
      ribs.push(Math.cos(a) * r0, (r0 * r0) / (4 * f), Math.sin(a) * r0, Math.cos(a) * r1, (r1 * r1) / (4 * f), Math.sin(a) * r1);
    }
  }
  const ribGeo = new THREE.BufferGeometry();
  ribGeo.setAttribute('position', new THREE.Float32BufferAttribute(ribs, 3));
  dish.add(new THREE.LineSegments(ribGeo, new THREE.LineBasicMaterial({ color: 0x7c8794, transparent: true, opacity: 0.8 })));
  const rim = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.CylinderGeometry(R, R, 0.001, 72, 1, true)),
    new THREE.LineBasicMaterial({ color: cyan, transparent: true, opacity: 0.9 })
  );
  rim.position.y = (R * R) / (4 * f);
  dish.add(rim);
  const feed = new THREE.Vector3(0, f, 0);
  dish.add(add(dish, new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.26, 24, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xc89a35, metalness: 1, roughness: 0.2, side: THREE.DoubleSide })), feed.x, feed.y, feed.z));
  const rr = R * 0.9;
  [0, 2.1, 4.2].forEach(a => dish.add(strut(new THREE.Vector3(Math.cos(a) * rr, (rr * rr) / (4 * f), Math.sin(a) * rr), feed, 0.012, chrome)));
  sat.add(strut(new THREE.Vector3(0.05, 0.1, 0.75), new THREE.Vector3(0.05, 0.25, 1.35), 0.05, chrome));

  // Horn cluster on the earth-facing panel
  [[-0.35, 0.3], [0.35, 0.3], [-0.35, -0.3], [0.35, -0.3]].forEach(([x, y]) => {
    const h = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.5, 32, 1, true), new THREE.MeshPhysicalMaterial({ color: 0xe7ebf0, metalness: 1, roughness: 0.18, side: THREE.DoubleSide }));
    h.rotation.x = -Math.PI / 2;
    h.position.set(x, y, 1.0);
    sat.add(h);
    add(h, new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.018, 8, 40), gold), 0, -0.25, 0).rotation.x = Math.PI / 2;
  });

  // Apogee motor, RCS thrusters, star trackers, TT&C whip
  const nozzlePts = [[0.12, 0], [0.14, -0.1], [0.22, -0.28], [0.36, -0.5], [0.52, -0.7]].map(([x, y]) => new THREE.Vector2(x, y));
  add(sat, new THREE.Mesh(new THREE.LatheGeometry(nozzlePts, 48), new THREE.MeshPhysicalMaterial({ color: 0x8f98a6, metalness: 1, roughness: 0.28, side: THREE.DoubleSide })), 0, -0.8, 0);
  [[-0.55, -0.6], [0.55, -0.6], [-0.55, 0.6], [0.55, 0.6]].forEach(([x, z]) => {
    const t = add(sat, new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.2, 16, 1, true), phys(0x9aa4b2, { metalness: 1, roughness: 0.3 })), x, -0.9, z);
    t.rotation.x = Math.PI;
  });
  [-0.35, 0.35].forEach(x => {
    const st = add(sat, new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.17, 0.34, 28), dark), x, 1.0, -0.4);
    st.rotation.z = x * -0.6;
    add(st, new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), glow(cyan, 1.4)), 0, 0.171, 0).rotation.x = -Math.PI / 2;
  });
  sat.add(strut(new THREE.Vector3(-0.5, 0.82, 0.5), new THREE.Vector3(-0.5, 1.7, 0.5), 0.016, glow(cyan, 1.2)));
  add(sat, new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), glow(0xffffff, 2)), -0.5, 1.72, 0.5);

  setUpdate(g, (_t, dt) => {
    arms.forEach(a => (a.rotation.x += dt * 0.18));
  });

  const ann = newAnnotations(g);
  callout(ann, 'SOLAR ARRAY', new THREE.Vector3(2.8, 2.2, 0.2), new THREE.Vector3(3.3, 3.9, 0.2), cyan);
  callout(ann, 'REFLECTOR ANTENNA', new THREE.Vector3(0.1, 2.7, 2.0), new THREE.Vector3(1.9, 4.2, 1.6), cyan);
  callout(ann, 'BUS + MLI FOIL', new THREE.Vector3(-0.7, 2.0, 0.6), new THREE.Vector3(-3.0, 0.7, 0.6), cyan);

  return g;
}

// ---------------------------------------------------------------------------
// 3. QUANTUM COMPUTING: dilution refrigerator + transmon chip
// ---------------------------------------------------------------------------

const chipTexture = (aniso: number) =>
  canvasTexture(
    512,
    512,
    c => {
      c.fillStyle = '#10121c';
      c.fillRect(0, 0, 512, 512);
      c.lineWidth = 3;
      for (let k = 0; k < 6; k++) {
        const y0 = 70 + k * 62;
        c.strokeStyle = '#d7dbe6';
        c.beginPath();
        c.moveTo(40, y0);
        for (let i = 0; i < 8; i++) {
          c.lineTo(80 + i * 28, y0 - (i % 2 ? 0 : 22));
          c.lineTo(94 + i * 28, y0 - (i % 2 ? 0 : 22));
          c.lineTo(94 + i * 28, y0 - (i % 2 ? 22 : 0));
        }
        c.lineTo(340, y0);
        c.stroke();
        c.fillStyle = '#b388ff';
        c.fillRect(350, y0 - 14, 28, 28);
        c.fillStyle = '#e9ddff';
        c.fillRect(356, y0 - 8, 16, 16);
        c.strokeStyle = '#8a74c9';
        c.beginPath();
        c.moveTo(378, y0);
        c.lineTo(470, y0);
        c.stroke();
      }
      c.strokeStyle = '#d7dbe6';
      c.strokeRect(14, 14, 484, 484);
    },
    aniso
  );

export function buildQuantumGate(aniso: number): THREE.Group {
  const g = new THREE.Group();
  const violet = 0xb388ff;
  const goldMat = phys(0xffd27a, { metalness: 1, roughness: 0.16 });
  const copperMat = phys(0xc7753f, { metalness: 1, roughness: 0.22 });
  const steel = phys(0xd5dae2, { metalness: 1, roughness: 0.2 });
  const boltMat = phys(0x3b424d, { metalness: 1, roughness: 0.4 });
  const ann = newAnnotations(g);

  const plates = [
    { y: 4.5, r: 2.1, h: 0.28, m: steel, n: '300 K' },
    { y: 3.6, r: 1.85, h: 0.2, m: goldMat, n: '50 K' },
    { y: 2.75, r: 1.55, h: 0.2, m: goldMat, n: '4 K' },
    { y: 1.95, r: 1.25, h: 0.2, m: goldMat, n: '800 mK' },
    { y: 1.2, r: 0.95, h: 0.18, m: goldMat, n: '50 mK' },
    { y: 0.55, r: 0.65, h: 0.18, m: copperMat, n: '10 mK' },
  ];

  plates.forEach((p, i) => {
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r, p.h, 128), p.m);
    plate.position.y = p.y;
    g.add(cad(plate, 0x2a2000, 0.55, 40));
    const nb = 6 + i * 2;
    for (let k = 0; k < nb; k++) {
      const a = (k / nb) * Math.PI * 2;
      add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.05, 12), boltMat), Math.cos(a) * p.r * 0.86, p.y + p.h / 2 + 0.02, Math.sin(a) * p.r * 0.86);
    }
    callout(ann, p.n, new THREE.Vector3(-p.r, p.y, 0), new THREE.Vector3(-p.r - 1.2, p.y + 0.1, 0.4), violet);

    if (i === plates.length - 1) return;
    const nx = plates[i + 1];
    const top = p.y - p.h / 2;
    const bot = nx.y + nx.h / 2;
    const gap = top - bot;
    for (let k = 0; k < 6; k++) {
      const a = Math.PI / 6 + (k * Math.PI) / 3;
      add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, gap, 16), steel), Math.cos(a) * nx.r * 0.78, bot + gap / 2, Math.sin(a) * nx.r * 0.78);
    }
    const cableMat = i < 1 ? steel : i < 3 ? copperMat : phys(0xcfa86a, { metalness: 1, roughness: 0.25 });
    for (let b = 0; b < 2; b++) {
      const a0 = b * Math.PI + i * 0.9 + 0.5;
      for (let k = 0; k < 3; k++) {
        const pts = [0, 0.2, 0.45, 0.7, 1].map(t => {
          const rr = nx.r * 0.45 + Math.sin(t * Math.PI) * 0.32 + k * 0.05;
          const a = a0 + t * 1.0 + k * 0.1;
          return new THREE.Vector3(Math.cos(a) * rr, top - gap * t, Math.sin(a) * rr);
        });
        g.add(tube(pts, 0.026, cableMat, false, 28));
        if (k === 1) add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 16), goldMat)).position.copy(pts[2]);
      }
    }
  });

  [0.7, -0.7].forEach((x, i) =>
    g.add(
      tube(
        [new THREE.Vector3(x, 4.64, 0.2), new THREE.Vector3(x, 5.15, 0.2), new THREE.Vector3(x * 1.9, 5.5, 0.6 + i * 0.4), new THREE.Vector3(x * 3, 5.5, 1.1 + i * 0.4)],
        0.13,
        phys(0x1b1f27, { metalness: 0.8, roughness: 0.45 })
      )
    )
  );

  // Sample holder, PCB, transmon chip with bond wires
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.3, 32), copperMat), 0, 0.28, 0);
  g.add(cad(new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.32, 1.1), copperMat), 0x2a1000, 0.6));
  add(g, new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.04, 0.92), phys(0x0f1424, { metalness: 0.4, roughness: 0.45 })), 0, 0.18, 0);
  const dk = phys(0x10121c);
  const chip = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.03, 0.5), [dk, dk, new THREE.MeshStandardMaterial({ map: chipTexture(aniso), metalness: 0.6, roughness: 0.3 }), dk, dk, dk]);
  chip.position.y = 0.215;
  g.add(cad(chip, violet, 0.9));
  for (let k = 0; k < 14; k++) {
    const side = k % 4;
    const t = ((k >> 2) + 0.5) / 4 - 0.5;
    const from = new THREE.Vector3(side < 2 ? (side ? 0.25 : -0.25) : t * 0.44, 0.23, side < 2 ? t * 0.44 : side === 2 ? 0.25 : -0.25);
    const to = from.clone().multiplyScalar(1.6);
    to.y = 0.2;
    const mid = from.clone().add(to).multiplyScalar(0.5);
    mid.y = 0.3;
    g.add(tube([from, mid, to], 0.006, phys(0xe8c98a, { metalness: 1, roughness: 0.2 }), false, 12));
  }
  [[0.55, 0], [-0.55, 0], [0, 0.55], [0, -0.55]].forEach(([x, z]) => {
    const sma = add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.2, 16), goldMat), x, 0, z);
    sma.rotation.set(z ? Math.PI / 2 : 0, 0, x ? Math.PI / 2 : 0);
  });
  callout(ann, 'TRANSMON QUBIT CHIP', new THREE.Vector3(0.1, 0.23, 0.1), new THREE.Vector3(2.4, -0.7, 0.8), violet);

  return g;
}

// ---------------------------------------------------------------------------
// 4. FINTECH: payment phone, EMV cards, reeded coins, market chart
// ---------------------------------------------------------------------------

export function buildFintechGate(aniso: number): THREE.Group {
  const g = new THREE.Group();
  const amber = 0xffb703;
  const emerald = 0x00c46a;
  const ann = newAnnotations(g);

  const slabTex = canvasTexture(
    512,
    320,
    c => {
      c.fillStyle = '#0b0c0f';
      c.fillRect(0, 0, 512, 320);
      c.strokeStyle = 'rgba(255,183,3,0.22)';
      for (let i = 0; i <= 14; i++) {
        c.beginPath();
        c.moveTo(i * (512 / 14), 0);
        c.lineTo(i * (512 / 14), 320);
        c.stroke();
      }
      for (let j = 0; j <= 9; j++) {
        c.beginPath();
        c.moveTo(0, j * (320 / 9));
        c.lineTo(512, j * (320 / 9));
        c.stroke();
      }
    },
    aniso
  );
  const slabSide = phys(0x15130e);
  const slab = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.16, 4.6), [slabSide, slabSide, phys(0xffffff, { map: slabTex, metalness: 0.5, roughness: 0.4 }), slabSide, slabSide, slabSide]);
  slab.position.y = 0.08;
  g.add(cad(slab, amber, 0.8));

  // Smartphone with a live payment UI
  const phone = new THREE.Group();
  phone.position.set(-1.9, 1.74, 0.2);
  phone.rotation.set(-0.16, 0.38, 0);
  g.add(phone);
  phone.add(cad(new THREE.Mesh(extrude(roundedRect(1.5, 3.0, 0.22), 0.12, 0.03), phys(0xb9bdc4, { metalness: 1, roughness: 0.26 })), 0x4a4f58, 0.7));
  const uiTex = canvasTexture(
    460,
    960,
    c => {
      c.fillStyle = '#080b10';
      c.fillRect(0, 0, 460, 960);
      c.fillStyle = '#e8edf5';
      c.font = 'bold 26px Segoe UI, Arial, sans-serif';
      c.fillText('9:41', 28, 44);
      c.fillStyle = '#00c46a';
      c.beginPath();
      c.arc(230, 190, 62, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = '#080b10';
      c.lineWidth = 12;
      c.lineCap = 'round';
      c.lineJoin = 'round';
      c.beginPath();
      c.moveTo(200, 192);
      c.lineTo(224, 218);
      c.lineTo(264, 166);
      c.stroke();
      c.textAlign = 'center';
      c.fillStyle = '#9aa6b6';
      c.font = '26px Segoe UI, Arial, sans-serif';
      c.fillText('Payment successful', 230, 300);
      c.fillStyle = '#ffffff';
      c.font = 'bold 70px Segoe UI, Arial, sans-serif';
      c.fillText('₹ 2,499.00', 230, 380);
      c.fillStyle = '#6f7b8c';
      c.font = '22px Segoe UI, Arial, sans-serif';
      c.fillText('to CHAKRA STORE · UPI', 230, 420);
      const grad = c.createLinearGradient(0, 470, 0, 640);
      grad.addColorStop(0, 'rgba(0,196,106,0.35)');
      grad.addColorStop(1, 'rgba(0,196,106,0)');
      const pts = [[40, 610], [100, 570], [150, 590], [210, 520], [270, 545], [330, 490], [420, 500]];
      c.beginPath();
      c.moveTo(40, 640);
      pts.forEach(([x, y]) => c.lineTo(x, y));
      c.lineTo(420, 640);
      c.closePath();
      c.fillStyle = grad;
      c.fill();
      c.beginPath();
      pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
      c.strokeStyle = '#00c46a';
      c.lineWidth = 4;
      c.stroke();
      c.textAlign = 'left';
      ['Metro Recharge', 'Coffee House', 'Salary Credit'].forEach((n, i) => {
        const y = 710 + i * 78;
        c.fillStyle = '#161b24';
        c.fillRect(28, y - 34, 404, 66);
        c.fillStyle = '#2a3342';
        c.beginPath();
        c.arc(64, y, 20, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = '#e8edf5';
        c.font = '24px Segoe UI, Arial, sans-serif';
        c.fillText(n, 100, y + 8);
        c.textAlign = 'right';
        c.fillStyle = i === 2 ? '#00c46a' : '#e8edf5';
        c.fillText((i === 2 ? '+' : '-') + ['₹ 150', '₹ 320', '₹ 45,000'][i], 414, y + 8);
        c.textAlign = 'left';
      });
    },
    aniso
  );
  add(
    phone,
    new THREE.Mesh(new THREE.PlaneGeometry(1.36, 2.84), new THREE.MeshStandardMaterial({ map: uiTex, emissiveMap: uiTex, emissive: 0xffffff, emissiveIntensity: 0.85, toneMapped: false })),
    0,
    0,
    0.152
  );

  // EMV cards
  const cardTex = (kind: 0 | 1) =>
    canvasTexture(
      512,
      322,
      c => {
        const g1 = c.createLinearGradient(0, 0, 512, 322);
        g1.addColorStop(0, kind === 0 ? '#2b2f38' : '#f1c24b');
        g1.addColorStop(1, kind === 0 ? '#0d0f13' : '#b9831a');
        c.fillStyle = g1;
        c.fillRect(0, 0, 512, 322);
        c.fillStyle = kind === 0 ? '#ffb703' : '#2a1d00';
        c.fillRect(0, 232, 512, 10);
        const chipG = c.createLinearGradient(50, 100, 130, 170);
        chipG.addColorStop(0, '#f6dc8c');
        chipG.addColorStop(1, '#b8892a');
        c.fillStyle = chipG;
        c.fillRect(50, 100, 84, 68);
        c.strokeStyle = 'rgba(70,45,0,0.7)';
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(50, 134);
        c.lineTo(134, 134);
        c.moveTo(92, 100);
        c.lineTo(92, 168);
        c.stroke();
        c.fillStyle = kind === 0 ? '#e8edf5' : '#2a1d00';
        c.font = 'bold 34px Consolas, monospace';
        c.fillText('4000  1234  5678  9010', 40, 218);
        c.font = '22px Segoe UI, Arial, sans-serif';
        c.fillText('CHAKRA PAY', 40, 286);
        c.fillText('VALID THRU 12/30', 290, 286);
      },
      aniso
    );
  [
    { x: 0.6, z: 1.4, ry: 0.35, kind: 0 as const },
    { x: 1.1, z: 1.0, ry: -0.2, kind: 1 as const },
  ].forEach((cd, i) => {
    const card = new THREE.Group();
    card.position.set(cd.x, 0.18 + i * 0.045, cd.z);
    card.rotation.y = cd.ry;
    g.add(card);
    const cb = new THREE.Mesh(extrude(roundedRect(2.4, 1.5, 0.12), 0.03, 0.005), phys(i ? 0xb9831a : 0x15181e, { metalness: 0.8, roughness: 0.3 }));
    cb.rotation.x = -Math.PI / 2;
    card.add(cb);
    const face = new THREE.Mesh(new THREE.PlaneGeometry(2.36, 1.48), new THREE.MeshStandardMaterial({ map: cardTex(cd.kind), metalness: 0.6, roughness: 0.28 }));
    face.rotation.x = -Math.PI / 2;
    face.position.y = 0.021;
    card.add(face);
  });

  // Reeded coin stack
  const reedTex = canvasTexture(
    256,
    16,
    c => {
      for (let i = 0; i < 128; i++) {
        c.fillStyle = i % 2 ? '#b98421' : '#f3cb70';
        c.fillRect(i * 2, 0, 2, 16);
      }
    },
    aniso
  );
  const coinFace = canvasTexture(
    256,
    256,
    c => {
      const gr = c.createRadialGradient(100, 90, 10, 128, 128, 140);
      gr.addColorStop(0, '#f6d57e');
      gr.addColorStop(1, '#c4922c');
      c.fillStyle = gr;
      c.fillRect(0, 0, 256, 256);
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.font = "bold 150px 'Segoe UI','Noto Sans',Arial,sans-serif";
      c.fillStyle = 'rgba(255,240,190,0.55)';
      c.fillText('₹', 126, 134);
      c.fillStyle = '#8b6212';
      c.fillText('₹', 128, 136);
    },
    aniso
  );
  const faceMat = phys(0xffffff, { map: coinFace, metalness: 0.9, roughness: 0.3 });
  for (let i = 0; i < 6; i++) {
    const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.11, 96), [phys(0xffffff, { map: reedTex, metalness: 1, roughness: 0.3 }), faceMat, faceMat]);
    coin.position.set(2.7 + (i % 2) * 0.03, 0.22 + i * 0.115, 0.9);
    coin.rotation.y = i * 0.7;
    g.add(coin);
  }

  // Candlestick market chart
  const cp = [
    { x: 0.2, y0: 0.3, h: 1.0, up: true },
    { x: 0.9, y0: 0.7, h: 1.3, up: true },
    { x: 1.6, y0: 1.1, h: 0.9, up: false },
    { x: 2.3, y0: 1.0, h: 1.5, up: true },
    { x: 3.0, y0: 1.7, h: 1.2, up: true },
    { x: 3.7, y0: 2.2, h: 1.7, up: true },
  ];
  const upMat = phys(0x0fa65a, { metalness: 0.6, roughness: 0.25, clearcoat: 0.8 });
  const downMat = phys(0xd02a3c, { metalness: 0.6, roughness: 0.25, clearcoat: 0.8 });
  const chartFrame = phys(0xcfd6df, { metalness: 1, roughness: 0.2 });
  cp.forEach(c => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.42, c.h, 0.42), c.up ? upMat : downMat);
    b.position.set(c.x - 0.1, c.y0 + c.h / 2, -1.5);
    g.add(cad(b, 0xffffff, 0.55));
    add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, c.h + 0.6, 8), chartFrame), c.x - 0.1, c.y0 + c.h / 2, -1.5);
  });
  add(g, new THREE.Mesh(new THREE.BoxGeometry(5, 0.05, 0.05), chartFrame), 1.9, 0.2, -1.95);
  add(g, new THREE.Mesh(new THREE.BoxGeometry(0.05, 3.8, 0.05), chartFrame), -0.55, 2.1, -1.95);
  const gl: number[] = [];
  for (let k = 1; k <= 5; k++) gl.push(-0.55, 0.2 + k * 0.7, -1.95, 4.4, 0.2 + k * 0.7, -1.95);
  const glg = new THREE.BufferGeometry();
  glg.setAttribute('position', new THREE.Float32BufferAttribute(gl, 3));
  g.add(new THREE.LineSegments(glg, new THREE.LineBasicMaterial({ color: amber, transparent: true, opacity: 0.22 })));
  g.add(tube(cp.map(c => new THREE.Vector3(c.x - 0.1, c.y0 + c.h + 0.5, -1.5)), 0.03, glow(emerald, 1.8), false, 48));

  callout(ann, 'UPI PAYMENT UI', new THREE.Vector3(-1.9, 2.9, 0.4), new THREE.Vector3(-3.3, 3.7, 0.5), amber);
  callout(ann, 'EMV CHIP CARD', new THREE.Vector3(0.6, 0.25, 1.4), new THREE.Vector3(-0.2, 1.2, 2.6), amber);
  callout(ann, 'MARKET DATA', new THREE.Vector3(3.6, 3.7, -1.5), new THREE.Vector3(3.3, 4.7, -1.2), amber);

  return g;
}

// ---------------------------------------------------------------------------
// 5. ENERGY & SUSTAINABILITY: spinning wind turbines with airflow, PV, BESS
// ---------------------------------------------------------------------------

const bladeGeometry = (L: number) => {
  const n = 10;
  const t = 0.16;
  const yt = (x: number) => 5 * t * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4);
  const af: [number, number][] = [];
  for (let k = 0; k <= n; k++) {
    const x = 0.5 * (1 - Math.cos((Math.PI * k) / n));
    af.push([x, yt(x)]);
  }
  for (let k = n - 1; k >= 1; k--) {
    const x = 0.5 * (1 - Math.cos((Math.PI * k) / n));
    af.push([x, -yt(x)]);
  }
  const M = af.length;
  const S = 18;
  const pos: number[] = [];
  for (let s = 0; s <= S; s++) {
    const u = s / S;
    const r = 0.2 + (L - 0.2) * u;
    const chord = u < 0.22 ? 0.26 + (0.4 - 0.26) * (u / 0.22) : 0.4 + (0.05 - 0.4) * ((u - 0.22) / 0.78) ** 0.9;
    const twist = (16 * (1 - u) ** 1.6 * Math.PI) / 180;
    af.forEach(([x, z]) => {
      const cx = (x - 0.3) * chord;
      const cz = z * chord;
      pos.push(cx * Math.cos(twist) + cz * Math.sin(twist), r, -cx * Math.sin(twist) + cz * Math.cos(twist));
    });
  }
  const idx: number[] = [];
  for (let s = 0; s < S; s++)
    for (let i = 0; i < M; i++) {
      const a = s * M + i;
      const b = s * M + ((i + 1) % M);
      const c = (s + 1) * M + i;
      const d = (s + 1) * M + ((i + 1) % M);
      idx.push(a, c, b, b, c, d);
    }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
};

export function buildEnergyGate(aniso: number): THREE.Group {
  const g = new THREE.Group();
  const emerald = 0x00e676;
  const spinners: { obj: THREE.Object3D; speed: number; axis: 'y' | 'z' }[] = [];
  const white = phys(0xf2f5f8, { metalness: 0.2, roughness: 0.3, clearcoat: 0.6, side: THREE.DoubleSide });
  const steel = phys(0xd5dae2, { metalness: 1, roughness: 0.2 });
  const ann = newAnnotations(g);
  const YAW = 0.75;
  const A = { x: -1.5, z: -0.7 };

  // Ground slab: mown grass with a drafting grid
  const grass = canvasTexture(
    512,
    512,
    c => {
      const rand = rng(5);
      for (let i = 0; i < 16; i++) {
        c.fillStyle = i % 2 ? '#2f6b2a' : '#38792f';
        c.fillRect(0, i * 32, 512, 32);
      }
      for (let i = 0; i < 6000; i++) {
        c.fillStyle = `rgba(${rand() > 0.5 ? '20,60,20' : '90,150,70'},0.18)`;
        c.fillRect(rand() * 512, rand() * 512, 2, 3);
      }
    },
    aniso
  );
  const soil = phys(0x2b1d12, { roughness: 0.9, metalness: 0 });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.3, 6.2), [soil, soil, phys(0xffffff, { map: grass, roughness: 0.95, metalness: 0 }), soil, soil, soil]);
  slab.position.y = 0.15;
  g.add(cad(slab, emerald, 0.6));
  g.add(gridFloor(8.4, 6.2, 0.7, emerald, 0.16, 0.305));

  const turbine = (x: number, z: number, s: number, speed: number) => {
    const t = new THREE.Group();
    t.position.set(x, 0.3, z);
    t.rotation.y = YAW;
    t.scale.setScalar(s);
    g.add(t);
    [[0, 1.0, 0.2, 0.17], [1.0, 2.2, 0.17, 0.13], [2.2, 3.5, 0.13, 0.095]].forEach(([y0, y1, r0, r1]) => {
      add(t, new THREE.Mesh(new THREE.CylinderGeometry(r1, r0, y1 - y0, 48), white), 0, (y0 + y1) / 2, 0);
      add(t, new THREE.Mesh(new THREE.CylinderGeometry(r1 + 0.02, r1 + 0.02, 0.04, 48), steel), 0, y1, 0);
    });
    t.add(cad(add(t, new THREE.Mesh(extrude(roundedRect(0.5, 0.46, 0.1), 1.2, 0.03), white), 0, 3.73, 0.05) as THREE.Mesh, 0x20382a, 0.5));
    for (let i = 0; i < 5; i++) add(t, new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.06), steel), 0, 3.97, -0.35 + i * 0.12);
    const anem = add(t, new THREE.Group(), 0, 4.05, -0.3);
    anem.add(strut(new THREE.Vector3(0, -0.06, 0), new THREE.Vector3(0, 0.1, 0), 0.01, steel));
    for (let k = 0; k < 3; k++) {
      const a = (k * Math.PI * 2) / 3;
      add(anem, new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8, 0, Math.PI), steel), Math.cos(a) * 0.1, 0.1, Math.sin(a) * 0.1);
      anem.add(strut(new THREE.Vector3(0, 0.1, 0), new THREE.Vector3(Math.cos(a) * 0.1, 0.1, Math.sin(a) * 0.1), 0.006, steel));
    }
    spinners.push({ obj: anem, speed: Math.abs(speed) * 6, axis: 'y' });
    const rotor = add(t, new THREE.Group(), 0, 3.73, 0.78);
    const nosePts = [[0, 0.5], [0.1, 0.46], [0.19, 0.36], [0.25, 0.2], [0.27, 0], [0.27, -0.12]].map(([px, py]) => new THREE.Vector2(px, py));
    add(rotor, new THREE.Mesh(new THREE.LatheGeometry(nosePts, 48), white)).rotation.x = Math.PI / 2;
    for (let k = 0; k < 3; k++) {
      const pivot = new THREE.Group();
      pivot.rotation.z = (k * Math.PI * 2) / 3;
      rotor.add(pivot);
      pivot.add(new THREE.Mesh(bladeGeometry(2.05), white));
      add(pivot, new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.3, 24), steel), 0, 0.28, 0);
    }
    spinners.push({ obj: rotor, speed, axis: 'z' });
  };
  turbine(A.x, A.z, 1, -1.5);
  turbine(2.5, -2.0, 0.62, -2.1);

  // Airflow streamlines: pass through, and wake behind, turbine A
  const COUNT = 90;
  const LEN = 1.7;
  type Streak = { rho: number; phi: number; z: number; v: number };
  const state: Streak[] = Array.from({ length: COUNT }, () => ({ rho: 0, phi: 0, z: 0, v: 0 }));
  const reset = (s: Streak, initial: boolean) => {
    s.rho = Math.sqrt(Math.random()) * 3.1;
    s.phi = Math.random() * Math.PI * 2;
    s.z = initial ? -6.5 + Math.random() * 12.5 : 6 + Math.random() * 0.5;
    s.v = 2.4 + Math.random() * 0.8;
  };
  state.forEach(s => reset(s, true));
  const fPos = new Float32Array(COUNT * 4 * 3);
  const fCol = new Float32Array(COUNT * 4 * 3);
  const flowGeo = new THREE.BufferGeometry();
  flowGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
  flowGeo.setAttribute('color', new THREE.BufferAttribute(fCol, 3));
  const base = new THREE.Color(0xa8f4ff);
  for (let i = 0; i < COUNT; i++)
    [1, 0.5, 0.5, 0].forEach((k, j) => {
      const o = i * 12 + j * 3;
      fCol[o] = base.r * k;
      fCol[o + 1] = base.g * k;
      fCol[o + 2] = base.b * k;
    });
  const flow = new THREE.LineSegments(
    flowGeo,
    new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
  );
  flow.frustumCulled = false;
  const flowGroup = new THREE.Group();
  flowGroup.position.set(A.x, 0.3 + 3.73, A.z);
  flowGroup.rotation.y = YAW;
  flowGroup.translateZ(0.78);
  flowGroup.add(flow);
  g.add(flowGroup);
  const put = (s: Streak, z: number, o: number) => {
    const inRotor = s.rho < 2.4;
    let rho = s.rho;
    let phi = s.phi;
    if (z > 0) rho = s.rho * (1 - (inRotor ? 0.1 : 0.03) * Math.exp(-z * 0.5));
    else if (inRotor) {
      rho = s.rho * (1 + 0.2 * (1 - Math.exp(z * 0.35)));
      phi = s.phi + 0.6 * (1 - Math.exp(z * 0.4));
    } else rho = s.rho * (1 + 0.04 * (1 - Math.exp(z * 0.3)));
    fPos[o] = rho * Math.cos(phi);
    fPos[o + 1] = rho * Math.sin(phi);
    fPos[o + 2] = z;
  };

  // PV array
  const cellMat = phys(0xffffff, { map: solarTexture(aniso, 8, 6), metalness: 0.5, roughness: 0.22, clearcoat: 1 });
  const frame = phys(0xaab3c0, { metalness: 0.9, roughness: 0.3 });
  [-0.2, 1.5].forEach(px => {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 1.0), [frame, frame, cellMat, phys(0x1a2233), frame, frame]);
    panel.position.set(px + 1.0, 0.95, 2.1);
    panel.rotation.x = 0.55;
    g.add(cad(panel, emerald, 0.6));
    [-0.5, 0.5].forEach(lx => g.add(strut(new THREE.Vector3(px + 1.0 + lx, 0.3, 1.75), new THREE.Vector3(px + 1.0 + lx, 0.85, 1.72), 0.035, steel)));
  });

  // Battery storage container
  const bess = new THREE.Group();
  bess.position.set(-2.9, 0.3, 1.55);
  bess.rotation.y = 0.5;
  g.add(bess);
  bess.add(cad(add(bess, new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.95, 0.9), phys(0xdfe5ea, { metalness: 0.4, roughness: 0.45 })), 0, 0.48, 0) as THREE.Mesh, 0x1d3a2a, 0.7));
  for (let i = 0; i < 14; i++) add(bess, new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.88, 0.02), steel), -0.95 + i * 0.146, 0.48, 0.46);
  add(bess, new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.04, 0.03), glow(emerald, 2)), 0, 0.88, 0.47);

  setUpdate(g, (_t, dt) => {
    spinners.forEach(s => (s.obj.rotation[s.axis] += s.speed * dt));
    for (let i = 0; i < COUNT; i++) {
      const s = state[i];
      s.z -= s.v * (s.z < 0 && s.rho < 2.4 ? 0.65 : 1) * dt;
      if (s.z < -6.5) reset(s, false);
      const o = i * 12;
      put(s, s.z, o);
      put(s, s.z + LEN * 0.5, o + 3);
      put(s, s.z + LEN * 0.5, o + 6);
      put(s, s.z + LEN, o + 9);
    }
    flowGeo.attributes.position.needsUpdate = true;
  });

  callout(ann, 'ROTOR Ø 82 m', new THREE.Vector3(-1.5, 5.3, 0.1), new THREE.Vector3(-3.4, 5.8, 0.2), emerald);
  callout(ann, 'HUB HEIGHT 80 m', new THREE.Vector3(-1.5, 2.5, -0.7), new THREE.Vector3(-3.6, 3.0, -0.5), emerald);
  callout(ann, 'PV ARRAY', new THREE.Vector3(1.7, 1.2, 2.0), new THREE.Vector3(3.3, 2.4, 2.4), emerald);
  callout(ann, 'BATTERY STORAGE', new THREE.Vector3(-2.9, 0.9, 1.6), new THREE.Vector3(-3.5, 1.9, 2.3), emerald);

  return g;
}
