import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

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

const addEdges = (mesh: THREE.Mesh, color: number, opacity = 1, threshold = 30) => {
  const lines = new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry, threshold),
    new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity })
  );
  mesh.add(lines);
  return lines;
};

const extrude = (shape: THREE.Shape, depth: number, bevel = 0.05) => {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 4,
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

const canvasTexture = (
  w: number,
  h: number,
  draw: (c: CanvasRenderingContext2D) => void,
  aniso: number
) => {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  return t;
};

// Deterministic PRNG so textures look identical on every load.
const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const solarTexture = (aniso: number, cols = 6, rows = 4) =>
  canvasTexture(
    512,
    384,
    c => {
      c.fillStyle = '#c9d3e0';
      c.fillRect(0, 0, 512, 384);
      const cw = 512 / cols;
      const ch = 384 / rows;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const g = c.createLinearGradient(i * cw, j * ch, (i + 1) * cw, (j + 1) * ch);
          g.addColorStop(0, '#0a2f7a');
          g.addColorStop(1, '#1f78e6');
          c.fillStyle = g;
          c.fillRect(i * cw + 3, j * ch + 3, cw - 6, ch - 6);
          c.strokeStyle = 'rgba(220,230,245,0.55)';
          c.lineWidth = 1.5;
          for (let k = 1; k <= 3; k++) {
            const x = i * cw + (cw / 4) * k;
            c.beginPath();
            c.moveTo(x, j * ch + 3);
            c.lineTo(x, (j + 1) * ch - 3);
            c.stroke();
          }
        }
      }
    },
    aniso
  );

// ---------------------------------------------------------------------------
// 1. CYBERSECURITY & BLOCKCHAIN: shield + padlock + chain of blocks
// ---------------------------------------------------------------------------

const shieldShape = (s: number) => {
  const sh = new THREE.Shape();
  sh.moveTo(-1 * s, 1.0 * s);
  sh.lineTo(1 * s, 1.0 * s);
  sh.lineTo(1 * s, 0.1 * s);
  sh.bezierCurveTo(1 * s, -0.55 * s, 0.4 * s, -0.95 * s, 0, -1.2 * s);
  sh.bezierCurveTo(-0.4 * s, -0.95 * s, -1 * s, -0.55 * s, -1 * s, 0.1 * s);
  sh.closePath();
  return sh;
};

export function buildCyberGate(): THREE.Group {
  const g = new THREE.Group();
  const crimson = 0xff2a55;

  const shieldMat = phys(crimson, {
    metalness: 0.5,
    roughness: 0.26,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    emissive: 0x3a000c,
  });
  const plateMat = phys(0x16070d, { metalness: 0.5, roughness: 0.2, clearcoat: 1 });
  const gold = phys(0xffc233, { metalness: 1, roughness: 0.16 });
  const chrome = phys(0xf5f7fa, { metalness: 1, roughness: 0.08 });

  // Hex plinth
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.5, 0.3, 6),
    phys(0x1b1f2a, { metalness: 0.7, roughness: 0.3 })
  );
  plinth.position.y = 0.15;
  g.add(plinth);
  addEdges(plinth, crimson);

  // Shield body
  const shield = new THREE.Mesh(extrude(shieldShape(1.7), 0.35, 0.09), shieldMat);
  shield.position.set(0, 2.49, 0);
  g.add(shield);

  const plate = new THREE.Mesh(extrude(shieldShape(1.36), 0.08, 0.03), plateMat);
  plate.position.set(0, 2.49, 0.27);
  g.add(plate);
  addEdges(plate, crimson, 0.9);

  // Circuit traces on the plate
  const traceMat = glow(crimson, 1.8);
  [
    [-0.95, 1.55, 0.5],
    [0.95, 1.55, 0.5],
    [-0.8, 2.6, 0.7],
    [0.8, 2.6, 0.7],
  ].forEach(([x, y, w]) => {
    const t = new THREE.Mesh(new THREE.BoxGeometry(w, 0.04, 0.02), traceMat);
    t.position.set(x, y + 0.2, 0.32);
    g.add(t);
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), traceMat);
    node.position.set(x + Math.sign(x) * (w / 2), y + 0.2, 0.32);
    g.add(node);
  });

  // Padlock
  const lockBody = new THREE.Mesh(extrude(roundedRect(1.5, 1.15, 0.18), 0.4, 0.05), gold);
  lockBody.position.set(0, 2.05, 0.54);
  g.add(lockBody);

  const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.11, 24, 48, Math.PI), chrome);
  shackle.position.set(0, 2.75, 0.54);
  g.add(shackle);
  [-0.42, 0.42].forEach(x => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.4, 24), chrome);
    leg.position.set(x, 2.55, 0.54);
    g.add(leg);
  });

  const holeMat = new THREE.MeshBasicMaterial({ color: 0x0a0306 });
  const keyCircle = new THREE.Mesh(new THREE.CircleGeometry(0.15, 32), holeMat);
  keyCircle.position.set(0, 2.1, 0.8);
  g.add(keyCircle);
  const keySlot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, 0.01), holeMat);
  keySlot.position.set(0, 1.88, 0.8);
  g.add(keySlot);

  // Blockchain: linked glass blocks with glowing cores
  const xs = [-2.55, -0.85, 0.85, 2.55];
  xs.forEach((x, i) => {
    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.8, 0.8),
      phys(0x2a0a14, { metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.22, depthWrite: false })
    );
    shell.position.set(x, 0.4, 2.6);
    g.add(shell);
    addEdges(shell, crimson);

    const core = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), glow(crimson, 2.4));
    core.position.copy(shell.position);
    g.add(core);

    if (i < xs.length - 1) {
      const link = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.9, 16), chrome);
      link.rotation.z = Math.PI / 2;
      link.position.set(x + 0.85, 0.4, 2.6);
      g.add(link);
    }
  });

  return g;
}

// ---------------------------------------------------------------------------
// 2. SPACE TECHNOLOGY: satellite over Earth
// ---------------------------------------------------------------------------

const earthTexture = (aniso: number) =>
  canvasTexture(
    1024,
    512,
    c => {
      const rand = rng(42);
      const ocean = c.createLinearGradient(0, 0, 0, 512);
      ocean.addColorStop(0, '#0b3a8c');
      ocean.addColorStop(0.5, '#1565c0');
      ocean.addColorStop(1, '#0b3a8c');
      c.fillStyle = ocean;
      c.fillRect(0, 0, 1024, 512);

      const blob = (cx: number, cy: number, r: number, col: string) => {
        c.fillStyle = col;
        c.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.35) {
          const rr = r * (0.65 + rand() * 0.6);
          const x = cx + Math.cos(a) * rr * 1.4;
          const y = cy + Math.sin(a) * rr;
          if (a === 0) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
        c.closePath();
        c.fill();
      };
      for (let i = 0; i < 26; i++) {
        const cx = rand() * 1024;
        const cy = 90 + rand() * 330;
        const r = 20 + rand() * 50;
        blob(cx, cy, r, '#2e8b57');
        blob(cx + 6, cy + 4, r * 0.55, rand() > 0.5 ? '#8d9a45' : '#3aa56a');
      }
      c.fillStyle = '#f2f7ff';
      c.fillRect(0, 0, 1024, 26);
      c.fillRect(0, 486, 1024, 26);

      for (let i = 0; i < 60; i++) {
        c.fillStyle = `rgba(255,255,255,${0.18 + rand() * 0.25})`;
        c.beginPath();
        c.ellipse(rand() * 1024, 40 + rand() * 430, 30 + rand() * 70, 8 + rand() * 14, 0, 0, Math.PI * 2);
        c.fill();
      }
    },
    aniso
  );

export function buildSpaceGate(aniso: number): THREE.Group {
  const g = new THREE.Group();
  const cyan = 0x00d2ff;

  // Earth
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(2.0, 96, 64),
    phys(0xffffff, { map: earthTexture(aniso), roughness: 0.6, metalness: 0.05 })
  );
  earth.position.set(0.2, 0.1, -0.4);
  earth.rotation.y = 2.2;
  g.add(earth);

  // Satellite
  const sat = new THREE.Group();
  sat.position.set(-0.2, 3.1, 0.6);
  sat.rotation.set(0.12, 0.55, 0.1);
  g.add(sat);

  const foil = phys(0xe3a72a, { metalness: 0.95, roughness: 0.28, clearcoat: 0.4 });
  const chrome = phys(0xf5f7fa, { metalness: 1, roughness: 0.1 });
  const white = phys(0xf2f6fb, { metalness: 0.3, roughness: 0.3, clearcoat: 0.6 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.5), foil);
  sat.add(body);
  addEdges(body, 0x5a3b00);

  const radiator = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 1.2), white);
  radiator.position.y = 0.575;
  sat.add(radiator);

  const panelTex = solarTexture(aniso);
  const cellMat = phys(0xffffff, { map: panelTex, metalness: 0.5, roughness: 0.22, clearcoat: 1 });
  const frameMat = phys(0xb8c2d0, { metalness: 0.9, roughness: 0.3 });
  const backMat = phys(0x1a2233, { metalness: 0.6, roughness: 0.4 });

  [-1, 1].forEach(side => {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.9, 16), chrome);
    arm.rotation.z = Math.PI / 2;
    arm.position.x = side * 1.9;
    sat.add(arm);

    [1.35, 2.65].forEach(cx => {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 1.55), [
        frameMat,
        frameMat,
        cellMat,
        backMat,
        frameMat,
        frameMat,
      ]);
      panel.position.x = side * cx;
      sat.add(panel);
      addEdges(panel, cyan, 0.9);
    });
  });

  // Dish on a mast, aimed forward/up
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.55, 12), chrome);
  mast.position.set(0, 0.85, 0.2);
  sat.add(mast);

  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(0.75, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.6),
    new THREE.MeshPhysicalMaterial({
      color: 0xdde5ee,
      metalness: 0.6,
      roughness: 0.32,
      side: THREE.DoubleSide,
    })
  );
  dish.position.set(0, 1.5, 0.85);
  dish.rotation.x = (-2 * Math.PI) / 3;
  sat.add(dish);

  const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 12), glow(cyan, 2));
  feed.position.set(0, 1.27, 0.46);
  feed.rotation.x = Math.PI / 3;
  sat.add(feed);

  // Thruster nozzle + whip antenna + star tracker
  const nozzle = new THREE.Mesh(
    new THREE.ConeGeometry(0.3, 0.5, 32, 1, true),
    new THREE.MeshPhysicalMaterial({ color: 0x9aa4b2, metalness: 1, roughness: 0.2, side: THREE.DoubleSide })
  );
  nozzle.rotation.x = Math.PI;
  nozzle.position.y = -0.8;
  sat.add(nozzle);

  const whip = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.1, 8), glow(cyan, 1.6));
  whip.position.set(-0.4, 1.15, -0.45);
  sat.add(whip);
  const whipTip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), glow(0xffffff, 2));
  whipTip.position.set(-0.4, 1.72, -0.45);
  sat.add(whipTip);

  const tracker = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.3, 24), phys(0x111826));
  tracker.rotation.x = Math.PI / 2;
  tracker.position.set(0.3, 0.1, 0.9);
  sat.add(tracker);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.1, 24), glow(cyan, 2));
  lens.position.set(0.3, 0.1, 1.06);
  sat.add(lens);

  // Starfield
  const rand = rng(7);
  const pts: number[] = [];
  for (let i = 0; i < 45; i++) {
    const r = 4 + rand() * 1.5;
    const th = rand() * Math.PI * 2;
    const ph = Math.acos(2 * rand() - 1);
    pts.push(r * Math.sin(ph) * Math.cos(th), 1.5 + r * Math.cos(ph) * 0.8, r * Math.sin(ph) * Math.sin(th));
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  g.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xdff6ff, size: 0.07 })));

  return g;
}

// ---------------------------------------------------------------------------
// 3. QUANTUM COMPUTING: dilution refrigerator + qubit chip + Bloch sphere
// ---------------------------------------------------------------------------

export function buildQuantumGate(aniso: number): THREE.Group {
  const g = new THREE.Group();
  const violet = 0xb388ff;

  const goldMat = phys(0xe08e00, { metalness: 0.6, roughness: 0.45 });
  const copperMat = phys(0xd9824f, { metalness: 1, roughness: 0.2 });
  const chrome = phys(0xf5f7fa, { metalness: 1, roughness: 0.08 });

  const fridge = new THREE.Group();
  fridge.position.x = -0.8;
  g.add(fridge);

  const plates = [
    { y: 4.1, r: 2.0, h: 0.22, m: goldMat },
    { y: 3.1, r: 1.7, h: 0.2, m: goldMat },
    { y: 2.1, r: 1.35, h: 0.2, m: goldMat },
    { y: 1.1, r: 1.0, h: 0.18, m: copperMat },
    { y: 0.2, r: 0.65, h: 0.16, m: copperMat },
  ];

  plates.forEach((p, i) => {
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(p.r, p.r, p.h, 96), p.m);
    plate.position.y = p.y;
    fridge.add(plate);
    addEdges(plate, violet, 0.9);

    if (i === plates.length - 1) return;
    const next = plates[i + 1];
    const top = p.y - p.h / 2;
    const bot = next.y + next.h / 2;
    const gap = top - bot;

    // Support rods
    for (let k = 0; k < 4; k++) {
      const a = Math.PI / 4 + (k * Math.PI) / 2;
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, gap, 12), chrome);
      rod.position.set(Math.cos(a) * next.r * 0.8, bot + gap / 2, Math.sin(a) * next.r * 0.8);
      fridge.add(rod);
    }

    // Coaxial cable runs, swirled between stages
    for (let k = 0; k < 3; k++) {
      const a0 = (k * Math.PI * 2) / 3 + i * 0.7;
      const pathPts = [0, 0.25, 0.5, 0.75, 1].map(t => {
        const rr = next.r * 0.45 + Math.sin(t * Math.PI) * 0.28;
        const a = a0 + t * 0.9;
        return new THREE.Vector3(Math.cos(a) * rr, top - gap * t, Math.sin(a) * rr);
      });
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pathPts), 24, 0.03, 8),
        i < 2 ? copperMat : glow(0xc9a8ff, 1.6)
      );
      fridge.add(tube);
    }
  });

  // Qubit chip hanging from the mixing-chamber plate
  const holder = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.35, 24), copperMat);
  holder.position.y = -0.05;
  fridge.add(holder);

  const chipTex = canvasTexture(
    256,
    256,
    c => {
      c.fillStyle = '#0b0618';
      c.fillRect(0, 0, 256, 256);
      c.strokeStyle = '#b388ff';
      c.lineWidth = 2;
      for (let i = 1; i < 8; i++) {
        c.beginPath();
        c.moveTo(i * 32, 16);
        c.lineTo(i * 32, 240);
        c.moveTo(16, i * 32);
        c.lineTo(240, i * 32);
        c.stroke();
      }
      c.fillStyle = '#e6d6ff';
      for (let i = 1; i < 8; i++) for (let j = 1; j < 8; j++) c.fillRect(i * 32 - 5, j * 32 - 5, 10, 10);
    },
    aniso
  );
  const chip = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 1.0), [
    phys(0x0b0618),
    phys(0x0b0618),
    new THREE.MeshStandardMaterial({
      map: chipTex,
      emissiveMap: chipTex,
      emissive: 0xffffff,
      emissiveIntensity: 0.9,
    }),
    phys(0x0b0618),
    phys(0x0b0618),
    phys(0x0b0618),
  ]);
  chip.position.y = -0.33;
  fridge.add(chip);
  addEdges(chip, violet);

  // Entangled qubit cluster under the chip
  const qpos = [
    new THREE.Vector3(0, -1.0, 0.35),
    new THREE.Vector3(-0.35, -1.0, -0.25),
    new THREE.Vector3(0.35, -1.0, -0.25),
    new THREE.Vector3(0, -1.45, 0),
  ];
  qpos.forEach(v => {
    const q = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 24), glow(violet, 2.6));
    q.position.copy(v);
    fridge.add(q);
  });
  [[0, 1], [1, 2], [2, 0], [0, 3], [1, 3], [2, 3]].forEach(([a, b]) => {
    const A = qpos[a];
    const B = qpos[b];
    const len = A.distanceTo(B);
    const link = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, len, 8), glow(0xe6d6ff, 1.4));
    link.position.copy(A.clone().add(B).multiplyScalar(0.5));
    link.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize());
    fridge.add(link);
  });

  // Bloch sphere with state vector
  const bloch = new THREE.Group();
  bloch.position.set(2.7, 2.5, 0.3);
  g.add(bloch);

  const R = 0.95;
  bloch.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(R, 64, 48),
      new THREE.MeshPhysicalMaterial({
        color: 0x7c4dff,
        transparent: true,
        opacity: 0.35,
        emissive: 0x5b2bc4,
        emissiveIntensity: 0.9,
        roughness: 0.4,
        metalness: 0,
        envMapIntensity: 0.3,
        depthWrite: false,
      })
    )
  );

  const axisMat = phys(0xeadfff, { metalness: 0.8, roughness: 0.2 });
  [
    [0, 0, 0],
    [0, 0, Math.PI / 2],
    [Math.PI / 2, 0, 0],
  ].forEach(([rx, ry, rz]) => {
    const axis = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, R * 2.5, 8), axisMat);
    axis.rotation.set(rx, ry, rz);
    bloch.add(axis);
  });

  [
    [0, R, 0, 0x00e5ff],
    [0, -R, 0, violet],
  ].forEach(([x, y, z, col]) => {
    const pole = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), glow(col, 2.2));
    pole.position.set(x, y, z);
    bloch.add(pole);
  });

  const dir = new THREE.Vector3(0.55, 0.7, 0.45).normalize();
  const vec = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, R, 12), glow(0xffffff, 1.4));
  vec.position.copy(dir.clone().multiplyScalar(R / 2));
  vec.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  bloch.add(vec);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 24), glow(0xffffff, 2.4));
  tip.position.copy(dir.clone().multiplyScalar(R));
  bloch.add(tip);

  return g;
}

// ---------------------------------------------------------------------------
// 4. FINTECH: rupee coin, candlestick chart, trend arrow, coin stack
// ---------------------------------------------------------------------------

export function buildFintechGate(aniso: number): THREE.Group {
  const g = new THREE.Group();
  const amber = 0xffb703;
  const emerald = 0x00e676;

  const goldMat = phys(0xffc233, { metalness: 1, roughness: 0.18, clearcoat: 0.5 });
  const darkGold = phys(0x6b4a00, { metalness: 0.9, roughness: 0.3 });

  const faceTex = canvasTexture(
    512,
    512,
    c => {
      const grad = c.createRadialGradient(200, 190, 20, 256, 256, 280);
      grad.addColorStop(0, '#fff0b0');
      grad.addColorStop(0.55, '#ffc233');
      grad.addColorStop(1, '#d68f00');
      c.fillStyle = grad;
      c.fillRect(0, 0, 512, 512);
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.font = "bold 340px 'Segoe UI','Noto Sans','Arial',sans-serif";
      c.fillStyle = 'rgba(255,245,200,0.7)';
      c.fillText('₹', 252, 262);
      c.fillStyle = '#7a4d00';
      c.fillText('₹', 256, 266);
    },
    aniso
  );
  const faceMat = phys(0xffffff, { map: faceTex, metalness: 0.7, roughness: 0.28, clearcoat: 0.6 });

  // Slab
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(7.2, 0.18, 3.8),
    phys(0x070502, { metalness: 0, roughness: 0.6, envMapIntensity: 0.12 })
  );
  slab.position.y = 0.09;
  g.add(slab);
  addEdges(slab, amber);

  // Large ₹ coin on a pedestal
  const pedestal = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.4, 0.7), darkGold);
  pedestal.position.set(-1.5, 0.38, 0.3);
  g.add(pedestal);

  const coin = new THREE.Group();
  coin.position.set(-1.5, 2.1, 0.3);
  coin.rotation.y = 0.3;
  g.add(coin);

  const coinBody = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.55, 0.28, 96), goldMat);
  coinBody.rotation.x = Math.PI / 2;
  coin.add(coinBody);

  const front = new THREE.Mesh(new THREE.CircleGeometry(1.5, 64), faceMat);
  front.position.z = 0.142;
  coin.add(front);
  const back = new THREE.Mesh(new THREE.CircleGeometry(1.5, 64), faceMat);
  back.position.z = -0.142;
  back.rotation.y = Math.PI;
  coin.add(back);

  // Coin stack
  for (let i = 0; i < 4; i++) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.16, 64), goldMat);
    c.position.set(0.9 + (i % 2 ? 0.04 : -0.03), 0.26 + i * 0.17, 1.3);
    c.rotation.y = i * 0.6;
    g.add(c);
  }
  const topFace = new THREE.Mesh(new THREE.CircleGeometry(0.72, 48), faceMat);
  topFace.rotation.x = -Math.PI / 2;
  topFace.position.set(0.87, 0.26 + 3 * 0.17 + 0.082, 1.3);
  g.add(topFace);

  // Candlestick chart
  const candles = [
    { x: 0.7, y0: 0.2, h: 1.2, up: true },
    { x: 1.5, y0: 0.6, h: 1.9, up: true },
    { x: 2.3, y0: 1.2, h: 1.4, up: false },
    { x: 3.1, y0: 1.3, h: 2.7, up: true },
  ];
  candles.forEach(cd => {
    const col = cd.up ? emerald : 0xff3d57;
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.46, cd.h, 0.46), glow(col, 0.9));
    body.position.set(cd.x, cd.y0 + cd.h / 2, -0.7);
    g.add(body);
    addEdges(body, 0xffffff, 0.7);

    const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, cd.h + 0.7, 8), phys(0xe8edf5, { metalness: 0.9, roughness: 0.2 }));
    wick.position.set(cd.x, cd.y0 + cd.h / 2, -0.7);
    g.add(wick);
  });

  // Trend arrow
  const arrowPts = [
    new THREE.Vector3(0.1, 1.0, 0.3),
    new THREE.Vector3(0.9, 1.9, 0.3),
    new THREE.Vector3(1.6, 1.7, 0.3),
    new THREE.Vector3(2.5, 3.0, 0.3),
    new THREE.Vector3(3.3, 4.2, 0.3),
  ];
  const curve = new THREE.CatmullRomCurve3(arrowPts);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.07, 12), glow(emerald, 2)));
  const arrowHead = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.55, 24), glow(emerald, 2.2));
  arrowHead.position.copy(arrowPts[4]);
  arrowHead.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), curve.getTangent(1).normalize());
  g.add(arrowHead);

  return g;
}

// ---------------------------------------------------------------------------
// 5. ENERGY & SUSTAINABILITY: wind turbines, solar array, sprout, bolt
// ---------------------------------------------------------------------------

const bladeShape = (L: number) => {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.22, 0.1, 0.2, L * 0.4, 0.03, L);
  s.lineTo(-0.03, L);
  s.bezierCurveTo(-0.1, L * 0.4, -0.12, 0.1, 0, 0);
  return s;
};

const leafShape = () => {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.45, 0.2, 0.5, 0.8, 0, 1.2);
  s.bezierCurveTo(-0.5, 0.8, -0.45, 0.2, 0, 0);
  return s;
};

export function buildEnergyGate(aniso: number): THREE.Group {
  const g = new THREE.Group();
  const emerald = 0x00e676;

  const white = phys(0xf4f7fb, { metalness: 0.15, roughness: 0.22, clearcoat: 0.8 });
  const chrome = phys(0xf5f7fa, { metalness: 1, roughness: 0.1 });

  // Grass-covered base
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(3.5, 3.8, 0.35, 64),
    phys(0x0a7a30, { metalness: 0.0, roughness: 0.85, envMapIntensity: 0.3 })
  );
  base.position.y = 0.175;
  g.add(base);

  const turbine = (x: number, z: number, s: number, spin: number) => {
    const t = new THREE.Group();
    t.position.set(x, 0.35, z);
    t.scale.setScalar(s);
    g.add(t);

    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.2, 3.5, 32), white);
    tower.position.y = 1.75;
    t.add(tower);

    const nacelle = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.36, 0.95), white);
    nacelle.position.set(0, 3.6, 0.1);
    t.add(nacelle);

    const rotor = new THREE.Group();
    rotor.position.set(0, 3.6, 0.65);
    t.add(rotor);

    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 24), chrome);
    rotor.add(hub);

    for (let k = 0; k < 3; k++) {
      const blade = new THREE.Mesh(extrude(bladeShape(1.75), 0.04, 0.02), white);
      blade.position.z = 0.05;
      blade.rotation.z = spin + (k * Math.PI * 2) / 3;
      rotor.add(blade);
      const tipBand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.18, 0.06), glow(emerald, 1.4));
      tipBand.position.set(0, 1.62, 0.05);
      const pivot = new THREE.Group();
      pivot.rotation.z = spin + (k * Math.PI * 2) / 3;
      pivot.add(tipBand);
      rotor.add(pivot);
    }
  };
  turbine(-0.9, -0.2, 1, 0.35);
  turbine(1.9, -1.5, 0.62, 0.9);

  // Solar array
  const cellMat = phys(0xffffff, {
    map: solarTexture(aniso, 4, 3),
    metalness: 0.5,
    roughness: 0.22,
    clearcoat: 1,
  });
  const frame = phys(0xb8c2d0, { metalness: 0.9, roughness: 0.3 });
  [0.9, 2.6].forEach(px => {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 1.15), [frame, frame, cellMat, phys(0x1a2233), frame, frame]);
    panel.position.set(px, 0.95, 1.9);
    panel.rotation.x = 0.55;
    g.add(panel);
    addEdges(panel, emerald, 0.8);
    [-0.55, 0.55].forEach(lx => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.85, 12), chrome);
      leg.position.set(px + lx, 0.78, 1.6);
      g.add(leg);
    });
  });

  // Sprout
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.3, 0.35, 1.7),
    new THREE.Vector3(-2.35, 0.9, 1.72),
    new THREE.Vector3(-2.25, 1.4, 1.7),
  ]);
  g.add(new THREE.Mesh(new THREE.TubeGeometry(stemCurve, 16, 0.045, 8), phys(0x2fbf71, { roughness: 0.5, metalness: 0.1 })));
  const leafMat = phys(0x00c853, { emissive: 0x00a050, emissiveIntensity: 0.6, roughness: 0.5, metalness: 0, envMapIntensity: 0.35 });
  [
    { rz: -1.0, ry: 0.3 },
    { rz: 1.0, ry: -0.3 },
  ].forEach(l => {
    const leaf = new THREE.Mesh(extrude(leafShape(), 0.03, 0.015), leafMat);
    leaf.scale.setScalar(0.85);
    leaf.position.set(-2.25, 1.35, 1.7);
    leaf.rotation.set(0, l.ry, l.rz);
    g.add(leaf);
  });

  // Lightning bolt
  const bolt = new THREE.Shape();
  bolt.moveTo(0.1, 1);
  bolt.lineTo(-0.35, 0.05);
  bolt.lineTo(-0.02, 0.05);
  bolt.lineTo(-0.15, -1);
  bolt.lineTo(0.4, 0.1);
  bolt.lineTo(0.05, 0.1);
  bolt.closePath();
  const boltMesh = new THREE.Mesh(extrude(bolt, 0.12, 0.03), glow(0xd8ff6a, 1.8));
  boltMesh.scale.setScalar(0.55);
  boltMesh.position.set(3.0, 4.3, 0.3);
  boltMesh.rotation.y = -0.3;
  g.add(boltMesh);
  addEdges(boltMesh, 0xffffff, 0.8);

  return g;
}
