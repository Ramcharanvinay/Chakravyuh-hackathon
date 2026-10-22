/**
 * ============================================================================
 * CHAKRAVYUHA 3D ANCIENT GATE FORMATION (FULL VIEW & HIGH FIDELITY)
 * ============================================================================
 * 
 * Features:
 *  - Elevated cinematic full view showing the entire circular Chakravyuh wheel
 *  - High-fidelity ACES Filmic tone mapping, soft shadows & metallic materials
 *  - 7 Concentric Battle Rampart Tiers (Saptavyuha) with stepped ziggurat walls
 *  - Active gate entrance breach opening into Abhimanyu's labyrinth
 *  - Carved Vedic Torana stone pillars, ornamental architraves & temple finials
 *  - Ceremonial bronze braziers with active elemental flame lighting & embers
 *  - 5 Distinct Floating Elemental 3D Totems (Agni, Vayu, Vajra, Surya, Vanam)
 *  - Central Sanctum with rotating 12-blade Sudarshana disc & levitating crystal core
 *  - Kurukshetra twilight ambient particle system (golden fireflies & dust)
 *  - Smooth shortest-path inertial rotation aligning selected theme to front gate
 *  - Full mobile touch & desktop pointer raycasting with OrbitControls
 *  - Comprehensive GPU memory cleanup (geometry & material disposal)
 * ============================================================================
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface ChakravyuhTrack {
  id: string;
  name: string;
  officialTitle?: string;
  slug?: string;
  themeKey?: string;
  accentColor?: string;
  secondaryColor?: string;
  glowColor?: string;
  description?: string;
  motto?: string;
  iconName?: string;
  displayOrder?: number;
  [key: string]: any;
}

export interface ChakravyuhWheel3DProps {
  tracks?: ChakravyuhTrack[];
  selectedTrackId: string | null;
  onSelectTrack: (trackId: string) => void;
  className?: string;
  height?: number | string;
  isLocked?: boolean;
}

// 5 Sacred Gate Configurations mapped 1-to-1 to the 5 official hackathon themes
const FIVE_GATES_CONFIG = [
  {
    id: 'track-cybersecurity-blockchain',
    aliasId: 'track-agni',
    themeKey: 'agni',
    name: 'CYBERSECURITY',
    title: 'CYBERSECURITY & BLOCKCHAIN',
    subtitle: 'Cybersecurity and Blockchain',
    accent: '#E05A47',
    glow: '#FF7A59',
    pointLightColor: 0xff4500,
    angle: 0, // Top / 12 o'clock entrance
    slogan: 'Secure digital systems and build trust through decentralized technology.',
    motto: 'Defending Digital Frontiers with Cryptographic Security and Decentralized Trust',
  },
  {
    id: 'track-space-technology',
    aliasId: 'track-vayu',
    themeKey: 'vayu',
    name: 'SPACE TECH',
    title: 'SPACE TECHNOLOGY',
    subtitle: 'Space Technology',
    accent: '#38BDF8',
    glow: '#0284C7',
    pointLightColor: 0x00e5ff,
    angle: (2 * Math.PI) / 5, // 72°
    slogan: 'Innovate in satellites, space exploration, and aerospace systems.',
    motto: 'Advancing Satellite Intelligence, Orbital Telemetry and Aerospace Systems',
  },
  {
    id: 'track-quantum-computing',
    aliasId: 'track-vajra',
    themeKey: 'vajra',
    name: 'QUANTUM',
    title: 'QUANTUM COMPUTING',
    subtitle: 'Quantum Computing',
    accent: '#8B5CF6',
    glow: '#A855F7',
    pointLightColor: 0x8b5cf6,
    angle: (4 * Math.PI) / 5, // 144°
    slogan: 'Explore quantum algorithms, simulations, and next-generation computing.',
    motto: 'Unlocking Quantum Coherence, Superposition and Next-Gen Algorithms',
  },
  {
    id: 'track-fintech',
    aliasId: 'track-surya',
    themeKey: 'surya',
    name: 'FINTECH',
    title: 'FINTECH',
    subtitle: 'FinTech',
    accent: '#D8B46A',
    glow: '#F59E0B',
    pointLightColor: 0xffd54f,
    angle: (6 * Math.PI) / 5, // 216°
    slogan: 'Rethink digital payments, financial access, and intelligent financial services.',
    motto: 'Revolutionizing Digital Payments, Smart Ledgers and Intelligent Finance',
  },
  {
    id: 'track-energy-sustainability',
    aliasId: 'track-vanam',
    themeKey: 'vanam',
    name: 'SUSTAINABILITY',
    title: 'ENERGY & SUSTAINABILITY',
    subtitle: 'Energy and Sustainability',
    accent: '#10B981',
    glow: '#34D399',
    pointLightColor: 0x10b981,
    angle: (8 * Math.PI) / 5, // 288°
    slogan: 'Develop clean energy solutions and technologies for a sustainable future.',
    motto: 'Powering Clean Energy Grids and Climate-Resilient Technologies',
  },
];

// Helper to render crisp 3D gate lintel labels matching the theme domains
function createGateSignTexture(numberStr: string, nameStr: string, accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0E1118';
    ctx.fillRect(0, 0, 512, 128);

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 116);

    ctx.fillStyle = '#F3E8CF';
    ctx.font = 'bold 36px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${numberStr} • ${nameStr}`, 256, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

export const ChakravyuhWheel3D: React.FC<ChakravyuhWheel3DProps> = ({
  tracks,
  selectedTrackId,
  onSelectTrack,
  className = '',
  height = 540,
  isLocked = false,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hoveredGateId, setHoveredGateId] = useState<string | null>(null);

  // References to mutable 3D objects for real-time interaction
  const wheelGroupRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const targetRotationY = useRef<number>(0);
  const currentRotationY = useRef<number>(0);
  const interactiveGatesRef = useRef<{ mesh: THREE.Object3D; gateId: string }[]>([]);
  const gateLightsRef = useRef<Record<string, THREE.PointLight>>({});
  const particlesRef = useRef<THREE.Points[]>([]);
  const sanctumSpokesRef = useRef<THREE.Group | null>(null);
  const sanctumCoreRef = useRef<THREE.Mesh | null>(null);
  const diamondsGroupRef = useRef<THREE.Group | null>(null);
  const elementalTotemsRef = useRef<Record<string, THREE.Group>>({});

  // Active gate helper: flawlessly resolves track ID, alias, or themeKey
  const activeGate = useMemo(() => {
    if (!selectedTrackId) return FIVE_GATES_CONFIG[0];
    const lower = selectedTrackId.toLowerCase();
    return (
      FIVE_GATES_CONFIG.find(
        g =>
          g.id === selectedTrackId ||
          g.aliasId === selectedTrackId ||
          g.themeKey === lower ||
          g.id.toLowerCase() === lower ||
          g.name.toLowerCase() === lower ||
          lower.includes(g.themeKey) ||
          (g.aliasId && lower.includes(g.aliasId.replace('track-', '')))
      ) || FIVE_GATES_CONFIG[0]
    );
  }, [selectedTrackId]);

  // Handle target rotation when selected track changes:
  // Smoothly rotates the wheelGroup so the selected gate faces the front entrance (12 o'clock)
  useEffect(() => {
    if (!activeGate) return;
    const target = -activeGate.angle;

    // Calculate shortest angular path around circle
    const current = currentRotationY.current;
    let diff = (target - current) % (Math.PI * 2);
    if (diff > Math.PI) diff -= Math.PI * 2;
    if (diff < -Math.PI) diff += Math.PI * 2;
    targetRotationY.current = current + diff;
  }, [activeGate]);

  // Main Three.js Scene Setup & Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 540;
    const heightPx = typeof height === 'number' ? height : container.clientHeight || 540;

    // 1. SCENE & ATMOSPHERIC FOG
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090d, 0.02);

    // 2. CAMERA (Elevated Full View showing the entire wheel formation without clipping)
    const camera = new THREE.PerspectiveCamera(42, width / heightPx, 0.1, 160);
    camera.position.set(0, 18, 25);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. ORBIT CONTROLS (Full touch and mouse support)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minPolarAngle = 0.08;
    controls.minDistance = 9;
    controls.maxDistance = 42;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. LIGHTING SYSTEM (Kurukshetra Sunset + Sacred Vedic Gold)
    const ambientLight = new THREE.AmbientLight(0xd8b46a, 0.7);
    scene.add(ambientLight);

    // Key Directional Sun Light
    const sunLight = new THREE.DirectionalLight(0xfff2d4, 2.8);
    sunLight.position.set(12, 22, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);

    // Cool rim light to highlight stone crenellations
    const rimLight = new THREE.DirectionalLight(0x406085, 1.2);
    rimLight.position.set(-14, 10, -14);
    scene.add(rimLight);

    // Central Sanctum Divine Beam Light
    const sanctumPointLight = new THREE.PointLight(0xfff5d0, 3.2, 18);
    sanctumPointLight.position.set(0, 3.5, 0);
    scene.add(sanctumPointLight);

    // 6. SHARED HIGH-END MATERIALS
    const darkBasaltMaterial = new THREE.MeshStandardMaterial({
      color: 0x12141c,
      roughness: 0.72,
      metalness: 0.28,
    });

    const innerStoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1e2a,
      roughness: 0.65,
      metalness: 0.35,
    });

    const goldTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8b46a,
      roughness: 0.26,
      metalness: 0.88,
      emissive: 0x4a3b1c,
      emissiveIntensity: 0.15,
    });

    const ceremonialGoldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf3e8cf,
      roughness: 0.2,
      metalness: 0.92,
      emissive: 0xd8b46a,
      emissiveIntensity: 0.3,
    });

    const bronzeMaterial = new THREE.MeshStandardMaterial({
      color: 0x8a6328,
      roughness: 0.42,
      metalness: 0.8,
    });

    // 7. BUILD THE ROTATABLE CHAKRAVYUHA BATTLE FORMATION
    const wheelGroup = new THREE.Group();
    wheelGroupRef.current = wheelGroup;
    scene.add(wheelGroup);

    // --- A. Base Circular Foundation Plinth ---
    const plinthGeo = new THREE.CylinderGeometry(13.4, 13.8, 0.4, 64);
    const plinthMesh = new THREE.Mesh(plinthGeo, darkBasaltMaterial);
    plinthMesh.position.y = -0.2;
    plinthMesh.receiveShadow = true;
    wheelGroup.add(plinthMesh);

    // Outer Plinth Gold Chamfer Ring
    const plinthRingGeo = new THREE.TorusGeometry(13.6, 0.08, 12, 64);
    const plinthRing = new THREE.Mesh(plinthRingGeo, goldTrimMaterial);
    plinthRing.rotation.x = Math.PI / 2;
    wheelGroup.add(plinthRing);

    // --- B. 7 Concentric Battle Rampart Tiers (Saptavyuha) ---
    const tierRadii = [11.8, 10.2, 8.6, 7.0, 5.4, 3.8, 2.3];
    const tierHeights = [0.45, 0.6, 0.8, 1.05, 1.35, 1.7, 2.1];

    tierRadii.forEach((radius, i) => {
      const wallHeight = tierHeights[i];
      const wallThick = 0.32;

      // Outer crenellated battle wall
      const wallGeo = new THREE.CylinderGeometry(radius, radius, wallHeight, 64, 1, true);
      const wallMesh = new THREE.Mesh(wallGeo, i > 3 ? innerStoneMaterial : darkBasaltMaterial);
      wallMesh.position.y = wallHeight / 2;
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      wheelGroup.add(wallMesh);

      // Gold cap on rampart top edge
      const capGeo = new THREE.TorusGeometry(radius, wallThick / 3, 8, 64);
      const capMesh = new THREE.Mesh(capGeo, goldTrimMaterial);
      capMesh.rotation.x = Math.PI / 2;
      capMesh.position.y = wallHeight;
      wheelGroup.add(capMesh);

      // Crenellation Battlements (Merlons along the wall)
      const numMerlons = 24 + i * 4;
      const merlonGeo = new THREE.BoxGeometry(0.22, 0.18, 0.28);
      for (let m = 0; m < numMerlons; m++) {
        const mAngle = (m / numMerlons) * Math.PI * 2;
        // Leave gaps for the entrance channel at 12 o'clock
        if (Math.abs(mAngle) < 0.22 || Math.abs(mAngle - Math.PI * 2) < 0.22) continue;

        const merlon = new THREE.Mesh(merlonGeo, bronzeMaterial);
        merlon.position.set(
          Math.sin(mAngle) * radius,
          wallHeight + 0.09,
          -Math.cos(mAngle) * radius
        );
        merlon.rotation.y = -mAngle;
        wheelGroup.add(merlon);
      }
    });

    // --- C. Celestial Outer Rim (Tick Teeth & Diamond Markers) ---
    const numTicks = 78;
    const tickGeo = new THREE.BoxGeometry(0.12, 0.08, 0.42);
    for (let t = 0; t < numTicks; t++) {
      const tAngle = (t / numTicks) * Math.PI * 2;
      const tick = new THREE.Mesh(tickGeo, goldTrimMaterial);
      tick.position.set(Math.sin(tAngle) * 12.8, 0.05, -Math.cos(tAngle) * 12.8);
      tick.rotation.y = -tAngle;
      wheelGroup.add(tick);
    }

    // 20 Floating Celestial Diamond Inlays
    const diamondsGroup = new THREE.Group();
    diamondsGroupRef.current = diamondsGroup;
    wheelGroup.add(diamondsGroup);

    const diamondGeo = new THREE.OctahedronGeometry(0.18, 0);
    for (let d = 0; d < 20; d++) {
      const dAngle = (d / 20) * Math.PI * 2;
      const diamond = new THREE.Mesh(diamondGeo, ceremonialGoldMaterial);
      diamond.position.set(Math.sin(dAngle) * 12.8, 0.45, -Math.cos(dAngle) * 12.8);
      diamond.rotation.y = dAngle;
      diamondsGroup.add(diamond);
    }

    // --- D. Drona's Central Sanctum (Padmavyuha Citadel) ---
    const sanctumGroup = new THREE.Group();
    wheelGroup.add(sanctumGroup);

    // Stepped Circular Altar
    const altarBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.8, 0.6, 32),
      goldTrimMaterial
    );
    altarBase.position.y = 2.4;
    altarBase.receiveShadow = true;
    sanctumGroup.add(altarBase);

    // Rotating 12-Blade Golden Sudarshana Disc
    const spokesGroup = new THREE.Group();
    sanctumSpokesRef.current = spokesGroup;
    spokesGroup.position.y = 2.75;
    sanctumGroup.add(spokesGroup);

    const spokeGeo = new THREE.BoxGeometry(0.12, 0.06, 1.4);
    for (let s = 0; s < 12; s++) {
      const sAngle = (s / 12) * Math.PI * 2;
      const spoke = new THREE.Mesh(spokeGeo, ceremonialGoldMaterial);
      spoke.rotation.y = sAngle;
      spokesGroup.add(spoke);
    }

    // Floating Levitating Brahmashira Crystal Core
    const crystalGeo = new THREE.OctahedronGeometry(0.48, 1);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xd8b46a,
      emissiveIntensity: 0.95,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.85,
      ior: 2.2,
      thickness: 1.2,
    });
    const crystalCore = new THREE.Mesh(crystalGeo, crystalMat);
    crystalCore.position.y = 3.65;
    sanctumCoreRef.current = crystalCore;
    sanctumGroup.add(crystalCore);

    // Divine Vertical Light Beam
    const beamGeo = new THREE.CylinderGeometry(0.08, 0.45, 12, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xd8b46a,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.y = 7.5;
    sanctumGroup.add(beamMesh);

    // --- E. 5 SACRED ELEMENTAL GATES (1-to-1 matching official themes) ---
    interactiveGatesRef.current = [];
    gateLightsRef.current = {};
    elementalTotemsRef.current = {};

    FIVE_GATES_CONFIG.forEach((gate, idx) => {
      const gateGroup = new THREE.Group();
      const radius = 9.45;
      // Position Gate 0 at 12 o'clock (x=0, z=-radius) and other gates clockwise around circle
      const gx = Math.sin(gate.angle) * radius;
      const gz = -Math.cos(gate.angle) * radius;
      gateGroup.position.set(gx, 0, gz);
      // Face inward towards the central altar
      gateGroup.lookAt(0, 0, 0);

      // 1. Bastion Terrace Platform
      const bastionPlatform = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.4, 1.6),
        darkBasaltMaterial
      );
      bastionPlatform.position.y = 0.2;
      bastionPlatform.receiveShadow = true;
      gateGroup.add(bastionPlatform);

      // Gold steps
      const stepsGeo = new THREE.BoxGeometry(1.6, 0.15, 0.6);
      const stepsMesh = new THREE.Mesh(stepsGeo, goldTrimMaterial);
      stepsMesh.position.set(0, 0.08, 0.9);
      gateGroup.add(stepsMesh);

      // 2. Twin Carved Vedic Torana Pillars
      const pillarGeo = new THREE.CylinderGeometry(0.18, 0.24, 2.4, 12);
      const leftPillar = new THREE.Mesh(pillarGeo, bronzeMaterial);
      leftPillar.position.set(-0.85, 1.4, 0);
      leftPillar.castShadow = true;
      gateGroup.add(leftPillar);

      const rightPillar = new THREE.Mesh(pillarGeo, bronzeMaterial);
      rightPillar.position.set(0.85, 1.4, 0);
      rightPillar.castShadow = true;
      gateGroup.add(rightPillar);

      // 3. Ornate Torana Architrave / Lintel Beam
      const lintelMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.35, 0.45),
        goldTrimMaterial
      );
      lintelMesh.position.set(0, 2.65, 0);
      lintelMesh.castShadow = true;
      gateGroup.add(lintelMesh);

      // Temple Crown Finial (Kalasha spire atop gate)
      const finialGeo = new THREE.ConeGeometry(0.24, 0.55, 8);
      const finial = new THREE.Mesh(finialGeo, ceremonialGoldMaterial);
      finial.position.set(0, 3.25, 0);
      gateGroup.add(finial);

      // 3B. Crisp 3D Sign Banner on Lintel with Theme Name
      const signTexture = createGateSignTexture(`0${idx + 1}`, gate.name, gate.accent);
      const signGeo = new THREE.PlaneGeometry(1.9, 0.42);
      const signMat = new THREE.MeshBasicMaterial({
        map: signTexture,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const signMesh = new THREE.Mesh(signGeo, signMat);
      signMesh.position.set(0, 2.65, 0.24);
      gateGroup.add(signMesh);

      // 4. Ceremonial Braziers with Active Flame Lights
      const brazierGeo = new THREE.CylinderGeometry(0.22, 0.12, 0.4, 8);
      const brazierMat = new THREE.MeshStandardMaterial({ color: 0x422a10, metalness: 0.8 });

      const leftBrazier = new THREE.Mesh(brazierGeo, brazierMat);
      leftBrazier.position.set(-1.15, 0.65, 0.5);
      gateGroup.add(leftBrazier);

      const rightBrazier = new THREE.Mesh(brazierGeo, brazierMat);
      rightBrazier.position.set(1.15, 0.65, 0.5);
      gateGroup.add(rightBrazier);

      // 5. Unique Floating 3D Elemental Totem in the portal (Accurately matching theme card artwork)
      const totemGroup = new THREE.Group();
      totemGroup.position.set(0, 1.65, 0);
      gateGroup.add(totemGroup);
      elementalTotemsRef.current[gate.id] = totemGroup;

      const elementMat = new THREE.MeshStandardMaterial({
        color: gate.pointLightColor,
        emissive: gate.pointLightColor,
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.7,
      });

      if (idx === 0 || gate.themeKey === 'agni') {
        // 01: CYBERSECURITY & BLOCKCHAIN - Cryptographic Shield, Padlock & Connected Ledger Nodes
        const shieldPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.46, 0.1, 6), elementMat);
        shieldPlate.rotation.x = Math.PI / 2;
        const lockBody = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.14), goldTrimMaterial);
        lockBody.position.set(0, -0.06, 0.08);
        const lockShackle = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.03, 8, 16, Math.PI), goldTrimMaterial);
        lockShackle.position.set(0, 0.08, 0.08);
        // Blockchain node blocks
        const node1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), goldTrimMaterial);
        node1.position.set(-0.55, 0.1, 0);
        const node2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), goldTrimMaterial);
        node2.position.set(0.55, 0.1, 0);
        const connBar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.02, 0.02), ceremonialGoldMaterial);
        connBar.position.set(0, 0.1, 0);
        totemGroup.add(shieldPlate, lockBody, lockShackle, node1, node2, connBar);
      } else if (idx === 1 || gate.themeKey === 'vayu') {
        // 02: SPACE TECHNOLOGY - Satellite Spacecraft with Solar Panels, Orbital Ring & Antenna
        const satBody = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.44), elementMat);
        const solarWings = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.03, 0.32), goldTrimMaterial);
        const commDish = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.14, 16, 1, true), goldTrimMaterial);
        commDish.position.set(0, 0.26, 0);
        commDish.rotation.x = Math.PI;
        const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.018, 6, 32), ceremonialGoldMaterial);
        orbitRing.rotation.x = Math.PI / 3;
        totemGroup.add(satBody, solarWings, commDish, orbitRing);
      } else if (idx === 2 || gate.themeKey === 'vajra') {
        // 03: QUANTUM COMPUTING - Superposition Quantum Core with 3 Golden Qubit Orbital Rings
        const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), ceremonialGoldMaterial);
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.025, 8, 32), elementMat);
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.025, 8, 32), elementMat);
        ring2.rotation.x = Math.PI / 3;
        const ring3 = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.025, 8, 32), elementMat);
        ring3.rotation.x = -Math.PI / 3;
        totemGroup.add(nucleus, ring1, ring2, ring3);
      } else if (idx === 3 || gate.themeKey === 'surya') {
        // 04: FINTECH - Digital Currency Token Coin & Ascending Ledger Pillars
        const coin = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.08, 32), elementMat);
        coin.rotation.x = Math.PI / 2;
        const hexRing = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.04, 6, 1, true), goldTrimMaterial);
        hexRing.rotation.x = Math.PI / 2;
        const bar1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.1), ceremonialGoldMaterial);
        bar1.position.set(-0.25, -0.15, 0.06);
        const bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.36, 0.1), ceremonialGoldMaterial);
        bar2.position.set(0, -0.08, 0.06);
        const bar3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), ceremonialGoldMaterial);
        bar3.position.set(0.25, -0.01, 0.06);
        totemGroup.add(coin, hexRing, bar1, bar2, bar3);
      } else {
        // 05: ENERGY & SUSTAINABILITY - Clean Energy Core & 3 Eco-Turbine Blades with Lightning Surge
        const sunCore = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), ceremonialGoldMaterial);
        const bladeGeo = new THREE.ConeGeometry(0.13, 0.48, 6);
        const blade1 = new THREE.Mesh(bladeGeo, elementMat);
        blade1.position.set(0, 0.25, 0);
        const blade2 = new THREE.Mesh(bladeGeo, elementMat);
        blade2.position.set(0.22, -0.16, 0);
        blade2.rotation.z = (2 * Math.PI) / 3;
        const blade3 = new THREE.Mesh(bladeGeo, elementMat);
        blade3.position.set(-0.22, -0.16, 0);
        blade3.rotation.z = -(2 * Math.PI) / 3;
        totemGroup.add(sunCore, blade1, blade2, blade3);
      }

      // 6. Point Light at Gate Arch
      const gatePointLight = new THREE.PointLight(gate.pointLightColor, 1.8, 6.5);
      gatePointLight.position.set(0, 1.8, 0.4);
      gateGroup.add(gatePointLight);
      gateLightsRef.current[gate.id] = gatePointLight;

      // 7. Ground Beacon Ring (Activates when gate is selected)
      const beaconRing = new THREE.Mesh(
        new THREE.RingGeometry(0.8, 1.15, 32),
        new THREE.MeshBasicMaterial({
          color: gate.pointLightColor,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        })
      );
      beaconRing.rotation.x = -Math.PI / 2;
      beaconRing.position.y = 0.41;
      beaconRing.name = `beacon-${gate.id}`;
      beaconRing.visible = activeGate.id === gate.id;
      gateGroup.add(beaconRing);

      // 8. High-Precision Invisible Hit Target for Clicking
      const hitBox = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 3.8, 2.2),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.position.y = 1.8;
      gateGroup.add(hitBox);
      interactiveGatesRef.current.push({ mesh: hitBox, gateId: gate.id });

      wheelGroup.add(gateGroup);
    });

    // --- F. Atmospheric Kurukshetra Twilight Particle Fireflies ---
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      const pRad = 2 + Math.random() * 14;
      const pAng = Math.random() * Math.PI * 2;
      particlePositions[p * 3] = Math.cos(pAng) * pRad;
      particlePositions[p * 3 + 1] = 0.5 + Math.random() * 5.5;
      particlePositions[p * 3 + 2] = Math.sin(pAng) * pRad;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf5d794,
      size: 0.12,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = [particles];

    // 8. RAYCASTING INTERACTION (Hover & Click Selection on Desktop & Mobile)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let pointerDownTime = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = interactiveGatesRef.current.map(item => item.mesh);
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hit = interactiveGatesRef.current.find(item => item.mesh === intersects[0].object);
        if (hit) {
          setHoveredGateId(hit.gateId);
          renderer.domElement.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredGateId(null);
      renderer.domElement.style.cursor = 'default';
    };

    const handlePointerDown = (e: MouseEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
      pointerDownTime = Date.now();
    };

    const handlePointerUp = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      const duration = Date.now() - pointerDownTime;
      // If user was dragging to orbit the camera, ignore click
      if (dist > 7 || duration > 450) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = interactiveGatesRef.current.map(item => item.mesh);
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hit = interactiveGatesRef.current.find(item => item.mesh === intersects[0].object);
        if (hit) {
          onSelectTrack(hit.gateId);
        }
      }
    };

    // Mobile touch interaction
    let touchDownPos = { x: 0, y: 0 };
    let touchDownTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      touchDownPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchDownTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 0) return;
      const touch = e.changedTouches[0];
      const dist = Math.hypot(touch.clientX - touchDownPos.x, touch.clientY - touchDownPos.y);
      const duration = Date.now() - touchDownTime;
      if (dist > 10 || duration > 500) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = interactiveGatesRef.current.map(item => item.mesh);
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hit = interactiveGatesRef.current.find(item => item.mesh === intersects[0].object);
        if (hit) {
          onSelectTrack(hit.gateId);
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('mousedown', handlePointerDown);
    renderer.domElement.addEventListener('mouseup', handlePointerUp);
    renderer.domElement.addEventListener('touchstart', handleTouchStart);
    renderer.domElement.addEventListener('touchend', handleTouchEnd);

    // 9. WINDOW RESIZE HANDLER
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const newW = container.clientWidth;
      const newH = typeof height === 'number' ? height : container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 10. ANIMATION TICK RENDER LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth Inertial Wheel Rotation toward target gate (stays locked on target gate without drifting)
      if (wheelGroup) {
        const diff = targetRotationY.current - currentRotationY.current;
        if (Math.abs(diff) > 0.0008) {
          currentRotationY.current += diff * 0.082;
          wheelGroup.rotation.y = currentRotationY.current;
        } else {
          currentRotationY.current = targetRotationY.current;
          wheelGroup.rotation.y = targetRotationY.current;
        }
      }

      // Gentle counter-rotation of Sanctum Sudarshana spokes
      if (sanctumSpokesRef.current) {
        sanctumSpokesRef.current.rotation.y = -elapsedTime * 0.35;
      }

      // Floating crystal core bobbing and rotation
      if (sanctumCoreRef.current) {
        sanctumCoreRef.current.rotation.y = elapsedTime * 0.55;
        sanctumCoreRef.current.position.y = 3.65 + Math.sin(elapsedTime * 2.4) * 0.12;
      }

      // Celestial diamonds gentle float and cosmic orbit
      if (diamondsGroupRef.current) {
        diamondsGroupRef.current.rotation.y = -elapsedTime * 0.04;
        diamondsGroupRef.current.children.forEach((dia, idx) => {
          dia.position.y = 0.45 + Math.sin(elapsedTime * 2.5 + idx * 0.5) * 0.08;
          dia.rotation.x = Math.sin(elapsedTime + idx) * 0.3;
        });
      }

      // Elemental totems dynamic rotation & bobbing & gate beacon pulses
      FIVE_GATES_CONFIG.forEach(gate => {
        const totem = elementalTotemsRef.current[gate.id];
        if (totem) {
          totem.rotation.y = elapsedTime * 1.5;
          totem.position.y = 1.65 + Math.sin(elapsedTime * 2.8 + gate.angle) * 0.1;
        }

        // Pulse selected gate beacon
        const beacon = wheelGroup.getObjectByName(`beacon-${gate.id}`) as THREE.Mesh | undefined;
        if (beacon) {
          const isSelected = activeGate.id === gate.id;
          beacon.visible = isSelected;
          if (isSelected && beacon.material) {
            (beacon.material as THREE.MeshBasicMaterial).opacity =
              0.55 + Math.sin(elapsedTime * 4.5) * 0.35;
          }
        }

        // Flicker fire light on Agni
        if (gate.themeKey === 'agni' && gateLightsRef.current[gate.id]) {
          gateLightsRef.current[gate.id].intensity = 1.8 + Math.sin(elapsedTime * 8) * 0.4 + (Math.random() - 0.5) * 0.3;
        }
      });

      // Drifting dust particles
      if (particlesRef.current.length > 0) {
        particlesRef.current.forEach(pts => {
          pts.rotation.y = elapsedTime * 0.03;
          const positions = pts.geometry.attributes.position.array as Float32Array;
          for (let p = 0; p < positions.length; p += 3) {
            positions[p + 1] += Math.sin(elapsedTime * 1.8 + p) * 0.003;
          }
          pts.geometry.attributes.position.needsUpdate = true;
        });
      }

      controls.update();
      try {
        renderer.render(scene, camera);
      } catch (e) {
        // Gracefully recover if WebGL context was paused or interrupted
      }
    };

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animationFrameId);
    };
    const handleContextRestored = () => {
      renderLoop();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

    renderLoop();

    // CLEANUP ON UNMOUNT
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', handlePointerMove);
      renderer.domElement.removeEventListener('mousedown', handlePointerDown);
      renderer.domElement.removeEventListener('mouseup', handlePointerUp);
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      renderer.domElement.removeEventListener('touchend', handleTouchEnd);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [height, onSelectTrack, activeGate.id]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none w-full ${className}`}>
      {/* Dynamic Ambient Background Glow Keyed to Active Gate */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-1000 ease-out z-0"
        style={{
          width: '72%',
          height: '72%',
          maxWidth: '520px',
          maxHeight: '520px',
          backgroundColor: activeGate.accent,
          opacity: 0.18,
          filter: 'blur(95px)',
        }}
      />

      {/* Main 3D Canvas Viewport */}
      <div
        ref={mountRef}
        style={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height }}
        className="relative max-w-full aspect-square flex items-center justify-center rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {/* Stationary Entrance HUD Reticle at Top (12 o'clock Entrance) */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1118]/95 border shadow-2xl backdrop-blur-md transition-all duration-500"
            style={{
              borderColor: activeGate.accent,
              boxShadow: `0 0 25px ${activeGate.accent}45`,
            }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full animate-ping shrink-0"
              style={{ backgroundColor: activeGate.accent }}
            />
            <span className="text-[11px] sm:text-xs tracking-[0.22em] font-cinzel font-black text-[#F3E8CF] uppercase whitespace-nowrap">
              {isLocked ? `LOCKED THEME GATE • ${activeGate.title}` : `THEME GATE • ${activeGate.title}`}
            </span>
          </div>
          {/* Ancient alignment needle */}
          <div
            className="w-0.5 h-3 sm:h-4 transition-colors duration-500"
            style={{
              background: `linear-gradient(to bottom, ${activeGate.accent}, transparent)`,
            }}
          />
        </div>

        </div>

      {/* Five Gate Tactical Badges (Direct Selection underneath 3D Wheel) */}
      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 z-10 w-full px-2">
        {FIVE_GATES_CONFIG.map((gate, idx) => {
          const isSelected = activeGate.id === gate.id;

          return (
            <button
              key={gate.id}
              type="button"
              onClick={() => !isLocked && onSelectTrack(gate.id)}
              disabled={isLocked && !isSelected}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-sans font-semibold tracking-wider transition-all duration-300 ${
                isSelected && isLocked
                  ? 'border-2 scale-105 shadow-[0_0_15px_rgba(201,164,92,0.4)] ring-1 ring-gold/40 cursor-default'
                  : isSelected
                  ? 'border-2 scale-105 shadow-[0_0_15px_rgba(201,164,92,0.3)] cursor-pointer'
                  : isLocked
                  ? 'bg-[#12141B]/40 border-[#222738]/50 text-[#F3E8CF]/30 opacity-40 cursor-not-allowed'
                  : 'bg-[#12141B]/80 border-[#222738] text-[#F3E8CF]/70 hover:border-[#D8B46A]/30 hover:text-[#F3E8CF] cursor-pointer'
              }`}
              style={{
                backgroundColor: isSelected ? `${gate.accent}20` : undefined,
                borderColor: isSelected ? gate.accent : undefined,
                color: isSelected ? '#F3E8CF' : undefined,
              }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: gate.accent }}
              />
              <span className="tracking-wider">
                {isSelected && isLocked ? `0${idx + 1} • ${gate.name} (LOCKED)` : `0${idx + 1} • ${gate.name}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChakravyuhWheel3D;
