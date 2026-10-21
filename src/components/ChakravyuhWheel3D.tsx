/**
 * ============================================================================
 * CHAKRAVYUHA 3D ANCIENT FORMATION WHEEL (100% SELF-CONTAINED SINGLE FILE)
 * ============================================================================
 * 
 * Inspired by the sacred Chakravyuh (Padmavyuha) battle labyrinth from the
 * Mahabharata, engineered with Three.js WebGL procedural geometry.
 * 
 * FEATURES INCLUDED IN THIS SINGLE FILE:
 *  - 7 Concentric Battle Rampart Tiers (Saptavyuha) with authentic breach openings
 *  - Stepped ancient ziggurat wall heights ascending to the central sanctum
 *  - Drona's Brahmavidya Citadel with rotating 12-blade Sudarshana golden disc
 *  - Floating levitating Brahmashira crystal core with vertical divine light beam
 *  - 5 Sacred Elemental Gates (AGNI, VAYU, DHRUVA, VAJRA, VANAM) with:
 *      * Carved Torana stone pillars & architraves
 *      * Ceremonial braziers with flame light
 *      * Floating 3D Elemental Totems (Fire Trident, Wind Vortex, Pole Star, Vajra, Lotus)
 *      * Real-time Raycasting (hover highlight & click selection)
 *      * Pulsing ground beacon halos
 *  - Celestial Outer Rim with 78 bronze tick teeth & 20 floating diamond markers
 *  - Kurukshetra twilight atmospheric dust & golden firefly particle system
 *  - Full 3D OrbitControls (drag to orbit, right-click pan, scroll zoom)
 *  - Smooth Inertial Auto-Alignment: rotates chosen gate to 12 o'clock entrance
 *  - Camera Angle Presets: 3D Hero Perspective, Top-Down Tactical Map, Gate View
 *  - Zero external type dependencies (inlined Track type & standalone SVG icons)
 * 
 * USAGE:
 *   import ChakravyuhWheel3D from './ChakravyuhWheel3D';
 *   // or: import { ChakravyuhWheel3D } from './ChakravyuhWheel3D';
 * 
 *   <ChakravyuhWheel3D
 *     selectedTrackId={selectedTrackId}
 *     onSelectTrack={(trackId) => setSelectedTrackId(trackId)}
 *     height={580}
 *   />
 * ============================================================================
 */

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- INLINED TYPES (Makes this file 100% portable across projects) ---
export interface ChakravyuhTrack {
  id: string;
  name: string;
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
}

// 5 Sacred Gate Angle Offsets (radians around the circular formation)
// Gate 1 (Agni): 0° (Facing 12 o'clock Entrance at top)
// Gate 2 (Vayu): 72°
// Gate 3 (Dhruva): 144°
// Gate 4 (Vajra): 216°
// Gate 5 (Vanam): 288°
export const FIVE_GATES_CONFIG = [
  {
    id: 'track-agni',
    name: 'AGNI',
    title: 'GATE 01 • AGNI',
    subtitle: 'Fire & Cybernetic Defense',
    accent: '#E05A47',
    glow: '#FF7A59',
    pointLightColor: 0xff4500,
    angle: 0, // Top / 12 o'clock entrance
    motto: 'Through Fire We Conquer Darkness',
  },
  {
    id: 'track-vayu',
    name: 'VAYU',
    title: 'GATE 02 • VAYU',
    subtitle: 'Cosmic Wind & Distributed Networks',
    accent: '#06B6D4',
    glow: '#38BDF8',
    pointLightColor: 0x00e5ff,
    angle: (2 * Math.PI) / 5, // 72°
    motto: 'Boundless Speed & Zero Friction',
  },
  {
    id: 'track-dhruva',
    aliasId: 'track-surya',
    name: 'DHRUVA',
    title: 'GATE 03 • DHRUVA',
    subtitle: 'The Steadfast Pole Star & Governance',
    accent: '#D8B46A',
    glow: '#F59E0B',
    pointLightColor: 0xffd54f,
    angle: (4 * Math.PI) / 5, // 144°
    motto: 'Steadfast as the Cosmic Anchor',
  },
  {
    id: 'track-vajra',
    name: 'VAJRA',
    title: 'GATE 04 • VAJRA',
    subtitle: 'Indestructible Thunderbolt & AI/ML',
    accent: '#3B82F6',
    glow: '#60A5FA',
    pointLightColor: 0x3b82f6,
    angle: (6 * Math.PI) / 5, // 216°
    motto: 'Unyielding Lightning in Real-Time',
  },
  {
    id: 'track-vanam',
    name: 'VANAM',
    title: 'GATE 05 • VANAM',
    subtitle: 'Sacred Earth & Bio-Computing',
    accent: '#10B981',
    glow: '#34D399',
    pointLightColor: 0x10b981,
    angle: (8 * Math.PI) / 5, // 288°
    motto: 'Nature Protects Those Who Protect Her',
  },
];

// --- STANDALONE INLINE ICONS (Zero external icon library dependency) ---
const PlayIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);

const PauseIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

export const ChakravyuhWheel3D: React.FC<ChakravyuhWheel3DProps> = ({
  tracks,
  selectedTrackId,
  onSelectTrack,
  className = '',
  height = 580,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [viewAngle, setViewAngle] = useState<'perspective' | 'top' | 'cinematic'>('perspective');
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

  // Active track helper
  const activeGate = useMemo(() => {
    return (
      FIVE_GATES_CONFIG.find(
        g => g.id === selectedTrackId || ('aliasId' in g && g.aliasId === selectedTrackId)
      ) || FIVE_GATES_CONFIG[0]
    );
  }, [selectedTrackId]);

  // Handle target rotation when selected track changes:
  // We rotate wheelGroup so the selected gate smoothly faces the top entrance (12 o'clock)
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

  // Camera view preset transitions
  const applyViewAngle = useCallback((mode: 'perspective' | 'top' | 'cinematic') => {
    setViewAngle(mode);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    controls.enabled = false;
    const startPos = camera.position.clone();
    let targetPos = new THREE.Vector3(0, 15, 19);

    if (mode === 'top') {
      targetPos = new THREE.Vector3(0, 24, 0.001); // 90° top-down tactical map
    } else if (mode === 'cinematic') {
      targetPos = new THREE.Vector3(0, 8.5, 14.5); // dramatic low angle hero
    }

    const startTime = performance.now();
    const duration = 900;

    const animateCam = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      camera.position.lerpVectors(startPos, targetPos, ease);
      controls.target.set(0, 0, 0);
      camera.lookAt(0, 0, 0);

      if (progress < 1) {
        requestAnimationFrame(animateCam);
      } else {
        controls.enabled = true;
      }
    };
    requestAnimationFrame(animateCam);
  }, []);

  // Main Three.js Scene Setup & Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 580;
    const heightPx = typeof height === 'number' ? height : container.clientHeight || 580;

    // 1. SCENE & ATMOSPHERIC FOG
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090d, 0.024);

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 150);
    camera.position.set(0, 15, 19);
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

    // 4. ORBIT CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minPolarAngle = 0.05;
    controls.minDistance = 7;
    controls.maxDistance = 38;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. LIGHTING SYSTEM (Kurukshetra Sunset + Sacred Vedic Fire)
    const ambientLight = new THREE.AmbientLight(0xd8b46a, 0.7);
    scene.add(ambientLight);

    // Directional Key Light (Low golden setting sun)
    const sunLight = new THREE.DirectionalLight(0xfff2d4, 2.8);
    sunLight.position.set(12, 22, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 60;
    sunLight.shadow.camera.left = -16;
    sunLight.shadow.camera.right = 16;
    sunLight.shadow.camera.top = 16;
    sunLight.shadow.camera.bottom = -16;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);

    // Cool rim light from opposite angle to highlight stone crenellations
    const rimLight = new THREE.DirectionalLight(0x406085, 1.2);
    rimLight.position.set(-14, 10, -14);
    scene.add(rimLight);

    // Central Sanctum Divine Beam Light
    const sanctumPointLight = new THREE.PointLight(0xfff5d0, 3.2, 18);
    sanctumPointLight.position.set(0, 2.5, 0);
    scene.add(sanctumPointLight);

    // 6. ANCIENT MATERIALS PALETTE (Weathered Vedic Bronze, Basalt & Gold)
    const bronzeMaterial = new THREE.MeshStandardMaterial({
      color: 0x241d14,
      metalness: 0.88,
      roughness: 0.32,
    });

    const darkBasaltMaterial = new THREE.MeshStandardMaterial({
      color: 0x0e1017,
      metalness: 0.25,
      roughness: 0.85,
    });

    const goldTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8b46a,
      metalness: 0.95,
      roughness: 0.22,
      emissive: 0x473715,
      emissiveIntensity: 0.4,
    });

    const ivoryStoneMaterial = new THREE.MeshStandardMaterial({
      color: 0xf3e8cf,
      metalness: 0.15,
      roughness: 0.55,
    });

    const sanctumGoldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5d485,
      metalness: 0.96,
      roughness: 0.15,
      emissive: 0xd8b46a,
      emissiveIntensity: 0.5,
    });

    // 7. ROOT ROTATABLE FORMATION GROUP
    const wheelGroup = new THREE.Group();
    scene.add(wheelGroup);
    wheelGroupRef.current = wheelGroup;

    // --- A. BASE STONE PLINTH ---
    const baseGeo = new THREE.CylinderGeometry(11.2, 11.6, 0.45, 64);
    const baseMesh = new THREE.Mesh(baseGeo, darkBasaltMaterial);
    baseMesh.position.y = -0.25;
    baseMesh.receiveShadow = true;
    wheelGroup.add(baseMesh);

    // Outer golden bevel ring edge
    const outerGoldRingGeo = new THREE.TorusGeometry(11.2, 0.08, 16, 100);
    const outerGoldRingMesh = new THREE.Mesh(outerGoldRingGeo, goldTrimMaterial);
    outerGoldRingMesh.rotation.x = Math.PI / 2;
    outerGoldRingMesh.position.y = -0.02;
    wheelGroup.add(outerGoldRingMesh);

    // --- B. 7 CONCENTRIC BATTLE RAMPARTS (The Saptavyuha Fortresses) ---
    // The rings rise in stepped ancient ziggurat terraces towards the core!
    // Each ring has strategic breach openings simulating Abhimanyu's labyrinth maze.
    const RINGS_DATA = [
      { radius: 9.2, width: 0.42, height: 0.55, gapAngle: 0, gapSpan: 0.48 },
      { radius: 7.9, width: 0.40, height: 0.72, gapAngle: Math.PI * 0.85, gapSpan: 0.52 },
      { radius: 6.6, width: 0.38, height: 0.90, gapAngle: Math.PI * 0.35, gapSpan: 0.50 },
      { radius: 5.3, width: 0.36, height: 1.08, gapAngle: Math.PI * 1.45, gapSpan: 0.54 },
      { radius: 4.1, width: 0.34, height: 1.25, gapAngle: Math.PI * 0.12, gapSpan: 0.50 },
      { radius: 2.9, width: 0.32, height: 1.45, gapAngle: Math.PI * 0.92, gapSpan: 0.52 },
      { radius: 1.8, width: 0.30, height: 1.65, gapAngle: Math.PI * 1.65, gapSpan: 0.50 },
    ];

    RINGS_DATA.forEach((ring) => {
      const ringGroup = new THREE.Group();

      // Main circular curved wall arc (leaving the breach opening)
      const arcLength = Math.PI * 2 - ring.gapSpan;
      const wallGeo = new THREE.CylinderGeometry(
        ring.radius + ring.width / 2,
        ring.radius + ring.width / 2,
        ring.height,
        64,
        1,
        true,
        ring.gapAngle + ring.gapSpan / 2,
        arcLength
      );
      const innerWallGeo = new THREE.CylinderGeometry(
        ring.radius - ring.width / 2,
        ring.radius - ring.width / 2,
        ring.height,
        64,
        1,
        true,
        ring.gapAngle + ring.gapSpan / 2,
        arcLength
      );

      const wallMesh = new THREE.Mesh(wallGeo, bronzeMaterial);
      wallMesh.position.y = ring.height / 2;
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      ringGroup.add(wallMesh);

      const innerWallMesh = new THREE.Mesh(innerWallGeo, bronzeMaterial);
      innerWallMesh.position.y = ring.height / 2;
      innerWallMesh.castShadow = true;
      innerWallMesh.receiveShadow = true;
      ringGroup.add(innerWallMesh);

      // Top rampart walkway ledge (flat ring cap)
      const capGeo = new THREE.RingGeometry(
        ring.radius - ring.width / 2,
        ring.radius + ring.width / 2,
        64,
        1,
        ring.gapAngle + ring.gapSpan / 2,
        arcLength
      );
      const capMesh = new THREE.Mesh(capGeo, ivoryStoneMaterial);
      capMesh.rotation.x = -Math.PI / 2;
      capMesh.position.y = ring.height;
      capMesh.receiveShadow = true;
      ringGroup.add(capMesh);

      // Golden parapet trim line along the top ridge
      const parapetTrimGeo = new THREE.TorusGeometry(
        ring.radius + ring.width / 2,
        0.03,
        8,
        64,
        arcLength
      );
      const parapetTrimMesh = new THREE.Mesh(parapetTrimGeo, goldTrimMaterial);
      parapetTrimMesh.rotation.x = Math.PI / 2;
      parapetTrimMesh.rotation.z = ring.gapAngle + ring.gapSpan / 2;
      parapetTrimMesh.position.y = ring.height + 0.02;
      ringGroup.add(parapetTrimMesh);

      // Ancient stone crenellations / battlements along the wall
      const crenelCount = Math.floor(ring.radius * 6);
      const crenelStep = arcLength / crenelCount;
      const crenelGeo = new THREE.BoxGeometry(0.12, 0.18, 0.16);

      for (let c = 0; c < crenelCount; c += 2) {
        const theta = ring.gapAngle + ring.gapSpan / 2 + c * crenelStep;
        const cx = Math.cos(theta) * (ring.radius + ring.width / 2 - 0.06);
        const cz = Math.sin(theta) * (ring.radius + ring.width / 2 - 0.06);

        const crenel = new THREE.Mesh(crenelGeo, darkBasaltMaterial);
        crenel.position.set(cx, ring.height + 0.09, cz);
        crenel.rotation.y = -theta;
        crenel.castShadow = true;
        ringGroup.add(crenel);
      }

      // End-bastion terminal posts at the opening gaps
      const postGeo = new THREE.CylinderGeometry(0.24, 0.28, ring.height + 0.2, 16);
      const thetaStart = ring.gapAngle + ring.gapSpan / 2;
      const thetaEnd = thetaStart + arcLength;

      const post1 = new THREE.Mesh(postGeo, goldTrimMaterial);
      post1.position.set(Math.cos(thetaStart) * ring.radius, (ring.height + 0.2) / 2, Math.sin(thetaStart) * ring.radius);
      ringGroup.add(post1);

      const post2 = new THREE.Mesh(postGeo, goldTrimMaterial);
      post2.position.set(Math.cos(thetaEnd) * ring.radius, (ring.height + 0.2) / 2, Math.sin(thetaEnd) * ring.radius);
      ringGroup.add(post2);

      wheelGroup.add(ringGroup);
    });

    // --- C. ABHIMANYU'S SPIRAL INWARD PATH ---
    const spiralPoints: THREE.Vector3[] = [];
    const numSpiralSteps = 120;
    for (let s = 0; s < numSpiralSteps; s++) {
      const t = s / numSpiralSteps;
      const rad = 1.8 + t * 7.2;
      const angle = t * Math.PI * 4.5;
      const px = Math.cos(angle) * rad;
      const pz = Math.sin(angle) * rad;
      spiralPoints.push(new THREE.Vector3(px, 0.08, pz));
    }
    const spiralCurve = new THREE.CatmullRomCurve3(spiralPoints);
    const spiralGeo = new THREE.TubeGeometry(spiralCurve, 100, 0.045, 8, false);
    const spiralMat = new THREE.MeshStandardMaterial({
      color: 0xd8b46a,
      emissive: 0xd8b46a,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });
    const spiralMesh = new THREE.Mesh(spiralGeo, spiralMat);
    wheelGroup.add(spiralMesh);

    // --- D. CELESTIAL OUTER RIM & 78 PERIMETER TICKS ---
    const celestialGroup = new THREE.Group();
    wheelGroup.add(celestialGroup);

    const tickGeo = new THREE.BoxGeometry(0.06, 0.08, 0.45);
    const majorTickGeo = new THREE.BoxGeometry(0.1, 0.14, 0.75);

    for (let t = 0; t < 78; t++) {
      const angle = (t / 78) * Math.PI * 2;
      const isMajor = t % 6 === 0;
      const r = 10.35;
      const tx = Math.cos(angle) * r;
      const tz = Math.sin(angle) * r;

      const tick = new THREE.Mesh(isMajor ? majorTickGeo : tickGeo, isMajor ? goldTrimMaterial : bronzeMaterial);
      tick.position.set(tx, 0.04, tz);
      tick.rotation.y = -angle + Math.PI / 2;
      celestialGroup.add(tick);
    }

    // 20 Floating Celestial Diamond Runes
    const diamondsGroup = new THREE.Group();
    diamondsGroupRef.current = diamondsGroup;
    wheelGroup.add(diamondsGroup);

    const diamondGeo = new THREE.OctahedronGeometry(0.18, 0);
    for (let d = 0; d < 20; d++) {
      const angle = (d / 20) * Math.PI * 2;
      const r = 10.75;
      const dx = Math.cos(angle) * r;
      const dz = Math.sin(angle) * r;

      const diamond = new THREE.Mesh(diamondGeo, sanctumGoldMaterial);
      diamond.position.set(dx, 0.45, dz);
      diamond.rotation.y = angle;
      diamondsGroup.add(diamond);
    }

    // --- E. CENTRAL SANCTUM CITADEL (Drona's Brahmavidya Core) ---
    const sanctumGroup = new THREE.Group();
    wheelGroup.add(sanctumGroup);

    // Multi-tiered sacred dais
    const sanctumBase1 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.5, 0.4, 32),
      darkBasaltMaterial
    );
    sanctumBase1.position.y = 1.6;
    sanctumGroup.add(sanctumBase1);

    const sanctumBase2 = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.25, 0.35, 32),
      goldTrimMaterial
    );
    sanctumBase2.position.y = 1.95;
    sanctumGroup.add(sanctumBase2);

    // 12 Sudarshana Golden Blade Spokes
    const spokesGroup = new THREE.Group();
    spokesGroup.position.y = 2.15;
    sanctumGroup.add(spokesGroup);
    sanctumSpokesRef.current = spokesGroup;

    const bladeGeo = new THREE.ConeGeometry(0.12, 0.85, 4);
    bladeGeo.rotateX(Math.PI / 2);

    for (let b = 0; b < 12; b++) {
      const angle = (b / 12) * Math.PI * 2;
      const blade = new THREE.Mesh(bladeGeo, sanctumGoldMaterial);
      blade.position.set(Math.cos(angle) * 0.7, 0, Math.sin(angle) * 0.7);
      blade.rotation.y = -angle;
      spokesGroup.add(blade);
    }

    // Floating Sacred Brahmashira Crystal Core
    const crystalGeo = new THREE.DodecahedronGeometry(0.38, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xfff3d1,
      emissive: 0xd8b46a,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.8,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.position.y = 2.65;
    sanctumGroup.add(crystalMesh);
    sanctumCoreRef.current = crystalMesh;

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

    // --- F. 5 MONUMENTAL ANCIENT GATE BASTIONS (Agni, Vayu, Dhruva, Vajra, Vanam) ---
    interactiveGatesRef.current = [];
    gateLightsRef.current = {};
    elementalTotemsRef.current = {};

    FIVE_GATES_CONFIG.forEach(gate => {
      const gateGroup = new THREE.Group();
      const radius = 9.45;
      const gx = Math.cos(gate.angle) * radius;
      const gz = Math.sin(gate.angle) * radius;
      gateGroup.position.set(gx, 0, gz);
      // Face inward towards the center
      gateGroup.rotation.y = -gate.angle - Math.PI / 2;

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

      // Pillar Ornate Caps
      const capGeo = new THREE.BoxGeometry(0.44, 0.18, 0.44);
      const leftCap = new THREE.Mesh(capGeo, goldTrimMaterial);
      leftCap.position.set(-0.85, 2.65, 0);
      gateGroup.add(leftCap);

      const rightCap = new THREE.Mesh(capGeo, goldTrimMaterial);
      rightCap.position.set(0.85, 2.65, 0);
      gateGroup.add(rightCap);

      // 3. Architrave / Lintel Beam with Ancient Finials
      const architraveGeo = new THREE.BoxGeometry(2.2, 0.28, 0.42);
      const architrave = new THREE.Mesh(architraveGeo, bronzeMaterial);
      architrave.position.set(0, 2.85, 0);
      architrave.castShadow = true;
      gateGroup.add(architrave);

      // Top Temple Crest
      const crestGeo = new THREE.ConeGeometry(0.35, 0.65, 4);
      const crest = new THREE.Mesh(crestGeo, sanctumGoldMaterial);
      crest.position.set(0, 3.25, 0);
      crest.rotation.y = Math.PI / 4;
      gateGroup.add(crest);

      // 4. Dual Ceremonial Braziers on Flanking Pillars
      const brazierGeo = new THREE.CylinderGeometry(0.2, 0.08, 0.25, 8);
      const brazierMat = new THREE.MeshStandardMaterial({
        color: 0x221a12,
        metalness: 0.9,
        roughness: 0.3,
      });

      const leftBrazier = new THREE.Mesh(brazierGeo, brazierMat);
      leftBrazier.position.set(-1.15, 0.65, 0.5);
      gateGroup.add(leftBrazier);

      const rightBrazier = new THREE.Mesh(brazierGeo, brazierMat);
      rightBrazier.position.set(1.15, 0.65, 0.5);
      gateGroup.add(rightBrazier);

      // 5. Unique Floating 3D Elemental Totem in the portal
      const totemGroup = new THREE.Group();
      totemGroup.position.set(0, 1.65, 0);
      gateGroup.add(totemGroup);
      elementalTotemsRef.current[gate.id] = totemGroup;

      const elementMat = new THREE.MeshStandardMaterial({
        color: gate.pointLightColor,
        emissive: gate.pointLightColor,
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.7,
      });

      if (gate.name === 'AGNI') {
        // Flame Trident / Agnibana
        const centerSpear = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.75, 6), elementMat);
        const leftFlame = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.5, 6), elementMat);
        leftFlame.position.set(-0.25, -0.1, 0);
        leftFlame.rotation.z = 0.35;
        const rightFlame = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.5, 6), elementMat);
        rightFlame.position.set(0.25, -0.1, 0);
        rightFlame.rotation.z = -0.35;
        totemGroup.add(centerSpear, leftFlame, rightFlame);
      } else if (gate.name === 'VAYU') {
        // Dual Whirling Aerofoil Rings
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.06, 8, 24), elementMat);
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 8, 24), elementMat);
        ring2.rotation.x = Math.PI / 3;
        totemGroup.add(ring1, ring2);
      } else if (gate.name === 'DHRUVA') {
        // Radiant 8-Point Pole Star with Astrolabe Armillary Ring
        const starCore = new THREE.Mesh(new THREE.OctahedronGeometry(0.28, 0), elementMat);
        const astrolabe = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.04, 8, 32), elementMat);
        astrolabe.rotation.x = Math.PI / 4;
        totemGroup.add(starCore, astrolabe);
      } else if (gate.name === 'VAJRA') {
        // Double-headed Indra Thunderbolt (Vajra)
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.85, 8), elementMat);
        const topProng = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 4), elementMat);
        topProng.position.y = 0.45;
        const bottomProng = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 4), elementMat);
        bottomProng.position.y = -0.45;
        bottomProng.rotation.z = Math.PI;
        totemGroup.add(shaft, topProng, bottomProng);
      } else if (gate.name === 'VANAM') {
        // Sacred Banyan Lotus with Nature Spores
        const lotusCore = new THREE.Mesh(new THREE.DodecahedronGeometry(0.26, 0), elementMat);
        const petalRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.08, 6, 8), elementMat);
        petalRing.rotation.x = Math.PI / 2;
        totemGroup.add(lotusCore, petalRing);
      }

      // 6. Point Light at Gate Arch (illuminating ramparts with elemental color)
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
      beaconRing.visible = selectedTrackId === gate.id;
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

    // --- G. BATTLEFIELD AMBIENT PARTICLES (Kurukshetra Dust & Golden Fireflies) ---
    const particleCount = 220;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let p = 0; p < particleCount; p++) {
      const rad = 2 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const py = 0.3 + Math.random() * 6.5;

      particlePositions[p * 3] = Math.cos(theta) * rad;
      particlePositions[p * 3 + 1] = py;
      particlePositions[p * 3 + 2] = Math.sin(theta) * rad;
      particleScales[p] = Math.random() * 0.8 + 0.3;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    const particleMat = new THREE.PointsMaterial({
      color: 0xd8b46a,
      size: 0.12,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current.push(particles);

    // 8. RAYCASTING INTERACTION (Hover & Click on 3D Gates)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

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

    renderer.domElement.addEventListener('mousemove', handlePointerMove);
    renderer.domElement.addEventListener('click', handlePointerDown);

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

      // Smooth Inertial Wheel Rotation toward target gate
      if (wheelGroup) {
        const diff = targetRotationY.current - currentRotationY.current;
        currentRotationY.current += diff * 0.055;

        // Auto slow cosmic drift if enabled and user isn't dragging
        if (isAutoRotate && Math.abs(diff) < 0.005) {
          targetRotationY.current += 0.0018;
          currentRotationY.current += 0.0018;
        }

        wheelGroup.rotation.y = currentRotationY.current;
      }

      // Gentle counter-rotation of Sanctum spokes
      if (sanctumSpokesRef.current) {
        sanctumSpokesRef.current.rotation.y = -elapsedTime * 0.25;
      }

      // Floating crystal core bobbing and rotation
      if (sanctumCoreRef.current) {
        sanctumCoreRef.current.rotation.y = elapsedTime * 0.45;
        sanctumCoreRef.current.position.y = 2.65 + Math.sin(elapsedTime * 2) * 0.06;
      }

      // Celestial diamonds gentle float
      if (diamondsGroupRef.current) {
        diamondsGroupRef.current.children.forEach((dia, idx) => {
          dia.position.y = 0.45 + Math.sin(elapsedTime * 2.5 + idx * 0.5) * 0.08;
          dia.rotation.x = Math.sin(elapsedTime + idx) * 0.3;
        });
      }

      // Elemental totems rotation & gate beacon pulses
      FIVE_GATES_CONFIG.forEach(gate => {
        const totem = elementalTotemsRef.current[gate.id];
        if (totem) {
          totem.rotation.y = elapsedTime * 1.2;
          totem.position.y = 1.65 + Math.sin(elapsedTime * 2.5 + gate.angle) * 0.08;
        }

        // Pulse selected gate beacon
        const beacon = wheelGroup.getObjectByName(`beacon-${gate.id}`) as THREE.Mesh | undefined;
        if (beacon) {
          const isSelected =
            selectedTrackId === gate.id ||
            ('aliasId' in gate && gate.aliasId === selectedTrackId);
          beacon.visible = isSelected;
          if (isSelected && beacon.material) {
            (beacon.material as THREE.MeshBasicMaterial).opacity =
              0.55 + Math.sin(elapsedTime * 4.5) * 0.35;
          }
        }

        // Flicker fire light on Agni
        if (gate.name === 'AGNI' && gateLightsRef.current[gate.id]) {
          gateLightsRef.current[gate.id].intensity = 1.8 + (Math.random() - 0.5) * 0.5;
        }
      });

      // Drifting dust particles
      if (particlesRef.current.length > 0) {
        particlesRef.current.forEach(pts => {
          const positions = pts.geometry.attributes.position.array as Float32Array;
          for (let p = 0; p < positions.length; p += 3) {
            positions[p + 1] += Math.sin(elapsedTime + p) * 0.003;
          }
          pts.geometry.attributes.position.needsUpdate = true;
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };

    renderLoop();

    // CLEANUP ON UNMOUNT
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousemove', handlePointerMove);
      renderer.domElement.removeEventListener('click', handlePointerDown);

      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [height, onSelectTrack]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none w-full ${className}`}>
      {/* Dynamic Ambient Background Glow Keyed to Active Track */}
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
              CHAKRAVYUHA • {activeGate.name} GATE
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

        {/* Hover Gate Tooltip Overlay */}
        {hoveredGateId && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-2 rounded-xl bg-[#0e1017]/95 border border-[#D8B46A]/40 shadow-2xl backdrop-blur-md text-center transition-all">
            <div className="text-[10px] font-mono tracking-widest text-[#D8B46A] uppercase">
              Click to Reorient Battle Formation
            </div>
            <div className="text-sm font-cinzel font-bold text-[#F3E8CF]">
              {FIVE_GATES_CONFIG.find(g => g.id === hoveredGateId)?.title}
            </div>
            <div className="text-[11px] text-[#F3E8CF]/80 italic font-cinzel">
              "{FIVE_GATES_CONFIG.find(g => g.id === hoveredGateId)?.motto}"
            </div>
          </div>
        )}

        {/* Tactical 3D HUD Floating Controls (Top Left & Top Right) */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`p-2 rounded-xl border backdrop-blur-md transition-all text-xs flex items-center gap-1.5 ${
              isAutoRotate
                ? 'bg-[#D8B46A]/20 border-[#D8B46A]/50 text-[#D8B46A]'
                : 'bg-[#12141B]/80 border-[#222738] text-[#F3E8CF]/60 hover:text-[#F3E8CF]'
            }`}
            title={isAutoRotate ? 'Pause Cosmic Rotation' : 'Resume Cosmic Rotation'}
          >
            {isAutoRotate ? <PauseIcon /> : <PlayIcon />}
            <span className="font-mono text-[10px] hidden sm:inline">
              {isAutoRotate ? 'Auto: ON' : 'Auto: PAUSE'}
            </span>
          </button>
        </div>

        {/* Camera Preset Angles (Isometric 3D vs Top-Down Commander Map) */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 p-1 rounded-xl bg-[#12141B]/85 border border-[#222738] backdrop-blur-md text-[11px]">
          <button
            type="button"
            onClick={() => applyViewAngle('perspective')}
            className={`px-2.5 py-1 rounded-lg font-cinzel font-semibold transition-all ${
              viewAngle === 'perspective'
                ? 'bg-[#D8B46A]/25 text-[#D8B46A] border border-[#D8B46A]/40'
                : 'text-[#F3E8CF]/60 hover:text-[#F3E8CF]'
            }`}
            title="3D Cinematic Isometric Hero View"
          >
            3D Hero
          </button>
          <button
            type="button"
            onClick={() => applyViewAngle('top')}
            className={`px-2.5 py-1 rounded-lg font-cinzel font-semibold transition-all ${
              viewAngle === 'top'
                ? 'bg-[#D8B46A]/25 text-[#D8B46A] border border-[#D8B46A]/40'
                : 'text-[#F3E8CF]/60 hover:text-[#F3E8CF]'
            }`}
            title="Top-Down Sacred Labyrinth Map"
          >
            Top-Down
          </button>
          <button
            type="button"
            onClick={() => applyViewAngle('cinematic')}
            className={`px-2.5 py-1 rounded-lg font-cinzel font-semibold transition-all ${
              viewAngle === 'cinematic'
                ? 'bg-[#D8B46A]/25 text-[#D8B46A] border border-[#D8B46A]/40'
                : 'text-[#F3E8CF]/60 hover:text-[#F3E8CF]'
            }`}
            title="Close-Up Bastion Front View"
          >
            Gate View
          </button>
        </div>

        {/* Quick Instructions Bottom Overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 px-3 py-1 rounded-full bg-[#12141B]/80 border border-[#222738] text-[10px] font-mono text-[#F3E8CF]/70 backdrop-blur-sm">
          <span>Drag to orbit in 3D • Scroll to zoom • Click gate bastions to select</span>
        </div>
      </div>

      {/* Five Gate Tactical Badges (Direct Selection underneath 3D Wheel) */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 z-10 w-full px-2">
        {FIVE_GATES_CONFIG.map((gate, idx) => {
          const isSelected =
            selectedTrackId === gate.id ||
            ('aliasId' in gate && gate.aliasId === selectedTrackId);

          return (
            <button
              key={gate.id}
              type="button"
              onClick={() => onSelectTrack(gate.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-cinzel font-bold transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'border-2 scale-105'
                  : 'bg-[#12141B]/80 border-[#222738] text-[#F3E8CF]/70 hover:border-[#D8B46A]/30 hover:text-[#F3E8CF]'
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
              <span className="tracking-wider">{`0${idx + 1} • ${gate.name}`}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChakravyuhWheel3D;
