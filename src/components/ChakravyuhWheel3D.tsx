import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Track } from '../types';
import { RotateCw, Eye } from 'lucide-react';

export interface Gate3DConfig {
  id: string;
  aliasId?: string;
  themeKey: string;
  name: string;
  title: string;
  subtitle: string;
  accent: string;
  colorHex: number;
  emissiveHex: number;
  angle: number;
  motto: string;
}

export const FIVE_GATES_CONFIG: Gate3DConfig[] = [
  {
    id: 'track-cybersecurity-blockchain',
    aliasId: 'track-agni',
    themeKey: 'agni',
    name: 'CYBERSECURITY',
    title: 'CYBERSECURITY & BLOCKCHAIN',
    subtitle: 'Cryptographic Bastion & Distributed Ledger',
    accent: '#FF2A55',
    colorHex: 0xff2a55,
    emissiveHex: 0x660018,
    angle: 0,
    motto: 'Zero-Trust Defenses, Cryptographic Proofs and Resilient Chains',
  },
  {
    id: 'track-space-technology',
    aliasId: 'track-vayu',
    themeKey: 'vayu',
    name: 'SPACE TECH',
    title: 'SPACE TECHNOLOGY',
    subtitle: 'Deep-Space Satellite & Aerospace Payload',
    accent: '#00D2FF',
    colorHex: 0x00d2ff,
    emissiveHex: 0x004c66,
    angle: (2 * Math.PI) / 5,
    motto: 'Satellite Intelligence, Orbital Telemetry and Aerospace Systems',
  },
  {
    id: 'track-quantum-computing',
    aliasId: 'track-vajra',
    themeKey: 'vajra',
    name: 'QUANTUM',
    title: 'QUANTUM COMPUTING',
    subtitle: 'Superconducting Qubit & Dilution Refrigerator',
    accent: '#B388FF',
    colorHex: 0xb388ff,
    emissiveHex: 0x4a148c,
    angle: (4 * Math.PI) / 5,
    motto: 'Quantum Coherence, Superposition and Next-Gen Algorithms',
  },
  {
    id: 'track-fintech',
    aliasId: 'track-surya',
    themeKey: 'surya',
    name: 'FINTECH',
    title: 'FINTECH',
    subtitle: 'Algorithmic Matrix & Decentralized Ledger',
    accent: '#FFB703',
    colorHex: 0xffb703,
    emissiveHex: 0x664400,
    angle: (6 * Math.PI) / 5,
    motto: 'Digital Payments, Smart Ledgers and Intelligent Finance',
  },
  {
    id: 'track-energy-sustainability',
    aliasId: 'track-vanam',
    themeKey: 'vanam',
    name: 'SUSTAINABILITY',
    title: 'ENERGY & SUSTAINABILITY',
    subtitle: 'Clean Power Grid & Renewable Turbine Reactor',
    accent: '#00E676',
    colorHex: 0x00e676,
    emissiveHex: 0x004d20,
    angle: (8 * Math.PI) / 5,
    motto: 'Clean Energy Grids and Climate-Resilient Technologies',
  },
];

export interface ChakravyuhWheel3DProps {
  tracks?: Track[];
  selectedTrackId?: string;
  onSelectTrack: (trackId: string) => void;
  className?: string;
  isLocked?: boolean;
  viewMode?: 'chakravyuh' | 'isolated';
}

export const ChakravyuhWheel3D: React.FC<ChakravyuhWheel3DProps> = ({
  tracks,
  selectedTrackId,
  onSelectTrack,
  className = '',
  isLocked = false,
  viewMode: propViewMode,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Controlled or internal viewMode ('chakravyuh' shows all 5 models on concentric rings; 'isolated' focuses on one)
  const [internalViewMode, setInternalViewMode] = useState<'chakravyuh' | 'isolated'>(
    propViewMode || 'isolated'
  );

  useEffect(() => {
    if (propViewMode) {
      setInternalViewMode(propViewMode);
    }
  }, [propViewMode]);

  const currentMode = propViewMode || internalViewMode;

  const stageGroupRef = useRef<THREE.Group | null>(null);
  const ringsGroupRef = useRef<THREE.Group | null>(null);
  const themeModelsRef = useRef<Record<string, THREE.Group>>({});
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

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

  const onSelectTrackRef = useRef(onSelectTrack);
  useEffect(() => {
    onSelectTrackRef.current = onSelectTrack;
  }, [onSelectTrack]);

  // Layout positions: Chakravyuh concentric rings vs Isolated center
  useEffect(() => {
    const isChakravyuh = currentMode === 'chakravyuh';

    // Toggle rings visibility
    if (ringsGroupRef.current) {
      ringsGroupRef.current.visible = isChakravyuh;
    }

    // Camera target and position adjustment
    if (cameraRef.current && controlsRef.current) {
      if (isChakravyuh) {
        cameraRef.current.position.set(0, 18, 24);
        cameraRef.current.lookAt(0, 0, 0);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.maxDistance = 38;
        controlsRef.current.minDistance = 12;
      } else {
        cameraRef.current.position.set(4.5, 3.2, 12.0);
        cameraRef.current.lookAt(0, 0.5, 0);
        controlsRef.current.target.set(0, 0.5, 0);
        controlsRef.current.maxDistance = 24;
        controlsRef.current.minDistance = 7;
      }
      controlsRef.current.update();
    }

    // Position and visibility of the 5 theme models
    FIVE_GATES_CONFIG.forEach((gate, idx) => {
      const grp = themeModelsRef.current[gate.id];
      if (!grp) return;

      if (isChakravyuh) {
        // Positioned radially at the 5 gates of the concentric Chakravyuh formation
        grp.visible = true;
        const radius = 6.4;
        const rad = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
        grp.position.set(Math.cos(rad) * radius, 0.2, Math.sin(rad) * radius);
        grp.scale.set(0.48, 0.48, 0.48);
        grp.rotation.y = -rad + Math.PI / 2;
      } else {
        // Isolated focus: center the active model, hide others
        const isActive = gate.id === activeGate.id || gate.themeKey === activeGate.themeKey;
        grp.visible = isActive;
        grp.position.set(0, 0.4, 0);
        grp.scale.set(1.0, 1.0, 1.0);
        grp.rotation.y = 0;
      }
    });
  }, [currentMode, activeGate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE
    const scene = new THREE.Scene();

    // 2. CAMERA
    const isChakravyuh = currentMode === 'chakravyuh';
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    if (isChakravyuh) {
      camera.position.set(0, 18, 24);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(4.5, 3.2, 12.0);
      camera.lookAt(0, 0.5, 0);
    }
    cameraRef.current = camera;

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    renderer.setPixelRatio(dpr);

    const initialRect = container.getBoundingClientRect();
    const initialSize = Math.max(Math.round(initialRect.width || container.clientWidth || 640), 320);
    renderer.setSize(initialSize, initialSize, false);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 4. ORBIT CONTROLS (STATIC by default, user rotates manually at will)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = false; // STATIC! No self rotation
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minPolarAngle = Math.PI / 8;
    controls.target.set(0, isChakravyuh ? 0 : 0.5, 0);
    controlsRef.current = controls;

    // 5. BALANCED HIGH-VISIBILITY STUDIO LIGHTING (NO harsh localized hotspots)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    // Key Light from top-front-left
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(12, 16, 14);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Soft Fill Light from right-front
    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 1.6);
    fillLight.position.set(-14, 10, 10);
    scene.add(fillLight);

    // Soft Rim Light from behind-above
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.0);
    rimLight.position.set(0, 10, -16);
    scene.add(rimLight);

    // Under-bounce Fill Light so bottom features are clearly visible
    const underFill = new THREE.DirectionalLight(0x94a3b8, 0.8);
    underFill.position.set(0, -10, 0);
    scene.add(underFill);

    // 6. RICH VIBRANT MATERIALS
    const slateArmorMat = new THREE.MeshStandardMaterial({
      color: 0x242b38,
      roughness: 0.25,
      metalness: 0.82,
    });

    const brushedTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.14,
      metalness: 0.94,
    });

    const polishedChromeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.04,
      metalness: 0.98,
    });

    const goldPlatedMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      emissive: 0x4a3200,
      roughness: 0.12,
      metalness: 0.95,
    });

    const crimsonMat = new THREE.MeshStandardMaterial({
      color: 0xff2a55,
      emissive: 0x590014,
      roughness: 0.14,
      metalness: 0.92,
    });

    const cyanMat = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      emissive: 0x003d52,
      roughness: 0.12,
      metalness: 0.92,
    });

    const violetMat = new THREE.MeshStandardMaterial({
      color: 0xb388ff,
      emissive: 0x3e176b,
      roughness: 0.14,
      metalness: 0.92,
    });

    const amberMat = new THREE.MeshStandardMaterial({
      color: 0xffb703,
      emissive: 0x593d00,
      roughness: 0.12,
      metalness: 0.95,
    });

    const emeraldMat = new THREE.MeshStandardMaterial({
      color: 0x00e676,
      emissive: 0x00471f,
      roughness: 0.14,
      metalness: 0.92,
    });

    const solarCellMat = new THREE.MeshStandardMaterial({
      color: 0x0b2545,
      roughness: 0.16,
      metalness: 0.88,
    });

    // 7. ROOT STAGE GROUP
    const stageGroup = new THREE.Group();
    stageGroupRef.current = stageGroup;
    scene.add(stageGroup);

    // =========================================================================
    // CHAKRAVYUH 5 CONCENTRIC RINGS & CENTRAL CITADEL
    // (Rendered in 'chakravyuh' mode for the grand landing page formation)
    // =========================================================================
    const ringsGroup = new THREE.Group();
    ringsGroupRef.current = ringsGroup;
    stageGroup.add(ringsGroup);

    // Central Citadel Nexus (The Core of Chakravyuh)
    const citadelBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 0.6, 8), slateArmorMat);
    citadelBase.position.y = 0.3;
    citadelBase.castShadow = true;
    ringsGroup.add(citadelBase);

    const citadelCap = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.5, 0.4, 8), goldPlatedMat);
    citadelCap.position.y = 0.8;
    ringsGroup.add(citadelCap);

    const citadelCrown = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), polishedChromeMat);
    citadelCrown.position.y = 1.4;
    ringsGroup.add(citadelCrown);

    // 5 Concentric Circular Rings of Chakravyuh
    const ringRadii = [2.4, 4.4, 6.4, 8.4, 10.2];
    ringRadii.forEach((r, idx) => {
      // Ring Tube Floor
      const ringTube = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.05, 12, 64),
        new THREE.MeshStandardMaterial({
          color: idx === 2 ? 0xffb703 : 0x475569,
          roughness: 0.2,
          metalness: 0.8,
        })
      );
      ringTube.rotation.x = Math.PI / 2;
      ringTube.position.y = 0.02;
      ringsGroup.add(ringTube);

      // Delicate Hairline Guide Ring
      const ringFlat = new THREE.Mesh(
        new THREE.RingGeometry(r - 0.015, r + 0.015, 64),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.35,
          transparent: true,
          side: THREE.DoubleSide,
        })
      );
      ringFlat.rotation.x = -Math.PI / 2;
      ringFlat.position.y = 0.03;
      ringsGroup.add(ringFlat);
    });

    // 5 Radial Strategic Gate Conduits connecting Citadel to the 5 Themes
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const xEnd = Math.cos(angle) * 10.2;
      const zEnd = Math.sin(angle) * 10.2;
      const conduitGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.04, 0),
        new THREE.Vector3(xEnd, 0.04, zEnd),
      ]);
      const conduit = new THREE.Line(
        conduitGeo,
        new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3, transparent: true })
      );
      ringsGroup.add(conduit);
    }

    // =========================================================================
    // THEME 1: CYBERSECURITY & BLOCKCHAIN (Pure Vivid Crimson #FF2A55)
    // =========================================================================
    const cyberGroup = new THREE.Group();
    cyberGroup.name = 'cybersecurity';
    themeModelsRef.current['track-cybersecurity-blockchain'] = cyberGroup;
    themeModelsRef.current['agni'] = cyberGroup;
    stageGroup.add(cyberGroup);

    // Cryptographic Vault Bastion Door
    const vaultPlateGeo = new THREE.CylinderGeometry(2.4, 2.7, 0.55, 6);
    const vaultPlate = new THREE.Mesh(vaultPlateGeo, slateArmorMat);
    vaultPlate.rotation.x = Math.PI / 2;
    vaultPlate.position.set(0, 0.8, 0);
    vaultPlate.castShadow = true;
    cyberGroup.add(vaultPlate);

    const vaultBezel = new THREE.LineSegments(
      new THREE.EdgesGeometry(vaultPlateGeo),
      new THREE.LineBasicMaterial({ color: 0xff2a55 })
    );
    vaultBezel.rotation.x = Math.PI / 2;
    vaultBezel.position.set(0, 0.8, 0);
    cyberGroup.add(vaultBezel);

    // Polished Chrome Cipher Drum Core
    const cipherDrum = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 1.2, 32), polishedChromeMat);
    cipherDrum.rotation.x = Math.PI / 2;
    cipherDrum.position.set(0, 0.8, 0.35);
    cyberGroup.add(cipherDrum);

    // Vivid Crimson Cipher Dial Ring
    const cipherRing = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.09, 16, 48), crimsonMat);
    cipherRing.position.set(0, 0.8, 0.4);
    cyberGroup.add(cipherRing);

    // Hardened Titanium Shackle
    const shackle = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.18, 16, 32, Math.PI),
      brushedTitaniumMat
    );
    shackle.position.set(0, 2.1, 0.1);
    cyberGroup.add(shackle);

    // 4 Distributed Blockchain Cube Nodes
    const cyberNodes = [
      [-3.2, 1.8, -1.6],
      [3.2, 1.8, -1.6],
      [-3.2, -0.4, 1.6],
      [3.2, -0.4, 1.6],
    ];
    cyberNodes.forEach(([nx, ny, nz]) => {
      const bGeo = new THREE.BoxGeometry(1.1, 1.1, 1.1);
      const bMesh = new THREE.Mesh(bGeo, slateArmorMat);
      bMesh.position.set(nx, ny, nz);
      bMesh.castShadow = true;
      cyberGroup.add(bMesh);

      const bEdge = new THREE.LineSegments(new THREE.EdgesGeometry(bGeo), new THREE.LineBasicMaterial({ color: 0xff2a55 }));
      bEdge.position.set(nx, ny, nz);
      cyberGroup.add(bEdge);

      const coreOrb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), crimsonMat);
      coreOrb.position.set(nx, ny, nz);
      cyberGroup.add(coreOrb);

      const laserLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(nx, ny, nz),
          new THREE.Vector3(0, 0.8, 0),
        ]),
        new THREE.LineBasicMaterial({ color: 0xff2a55, transparent: true, opacity: 0.8 })
      );
      cyberGroup.add(laserLine);
    });

    // =========================================================================
    // THEME 2: SPACE TECHNOLOGY (Electric Cyan #00D2FF)
    // =========================================================================
    const spaceGroup = new THREE.Group();
    spaceGroup.name = 'spacetech';
    themeModelsRef.current['track-space-technology'] = spaceGroup;
    themeModelsRef.current['vayu'] = spaceGroup;
    stageGroup.add(spaceGroup);

    // Deep Space Satellite Main Chassis
    const satBusGeo = new THREE.BoxGeometry(2.0, 2.4, 2.0);
    const satBus = new THREE.Mesh(satBusGeo, slateArmorMat);
    satBus.position.set(0, 0.8, 0);
    satBus.castShadow = true;
    spaceGroup.add(satBus);

    const satBusTrim = new THREE.LineSegments(new THREE.EdgesGeometry(satBusGeo), new THREE.LineBasicMaterial({ color: 0x00d2ff }));
    satBusTrim.position.set(0, 0.8, 0);
    spaceGroup.add(satBusTrim);

    // Radiant Gold MLI Thermal Foil Shielding
    const mliPatch = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.7, 0.06), goldPlatedMat);
    mliPatch.position.set(0, 0.8, 1.03);
    spaceGroup.add(mliPatch);

    // Left Deployable Solar Wing Array
    const leftWingGroup = new THREE.Group();
    leftWingGroup.position.set(-1.0, 0.8, 0);
    spaceGroup.add(leftWingGroup);

    const leftBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 12), brushedTitaniumMat);
    leftBoom.rotation.z = Math.PI / 2;
    leftBoom.position.set(-0.7, 0, 0);
    leftWingGroup.add(leftBoom);

    const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.8, 0.08), solarCellMat);
    leftPanel.position.set(-3.6, 0, 0);
    leftPanel.castShadow = true;
    leftWingGroup.add(leftPanel);

    const leftPanelEdge = new THREE.LineSegments(new THREE.EdgesGeometry(leftPanel.geometry), new THREE.LineBasicMaterial({ color: 0x00d2ff }));
    leftPanelEdge.position.set(-3.6, 0, 0);
    leftWingGroup.add(leftPanelEdge);

    // Right Deployable Solar Wing Array
    const rightWingGroup = new THREE.Group();
    rightWingGroup.position.set(1.0, 0.8, 0);
    spaceGroup.add(rightWingGroup);

    const rightBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 12), brushedTitaniumMat);
    rightBoom.rotation.z = Math.PI / 2;
    rightBoom.position.set(0.7, 0, 0);
    rightWingGroup.add(rightBoom);

    const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.8, 0.08), solarCellMat);
    rightPanel.position.set(3.6, 0, 0);
    rightPanel.castShadow = true;
    rightWingGroup.add(rightPanel);

    const rightPanelEdge = new THREE.LineSegments(new THREE.EdgesGeometry(rightPanel.geometry), new THREE.LineBasicMaterial({ color: 0x00d2ff }));
    rightPanelEdge.position.set(3.6, 0, 0);
    rightWingGroup.add(rightPanelEdge);

    // Chrome High-Gain Parabolic Telemetry Dish
    const satDish = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.75, 36, 1, true), polishedChromeMat);
    satDish.position.set(0, 2.5, 0.2);
    satDish.rotation.x = -Math.PI / 4;
    satDish.castShadow = true;
    spaceGroup.add(satDish);

    const satFeed = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 8), cyanMat);
    satFeed.position.set(0, 2.9, 0.7);
    satFeed.rotation.x = -Math.PI / 4;
    spaceGroup.add(satFeed);

    // 4 Quad RCS Aerospace Thruster Cones
    [-0.75, 0.75].forEach(tx => {
      [-0.75, 0.75].forEach(tz => {
        const thruster = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 12), brushedTitaniumMat);
        thruster.position.set(tx, -0.6, tz);
        thruster.rotation.x = Math.PI;
        spaceGroup.add(thruster);
      });
    });

    // =========================================================================
    // THEME 3: QUANTUM COMPUTING (Royal Violet #B388FF)
    // =========================================================================
    const quantumGroup = new THREE.Group();
    quantumGroup.name = 'quantum';
    themeModelsRef.current['track-quantum-computing'] = quantumGroup;
    themeModelsRef.current['vajra'] = quantumGroup;
    stageGroup.add(quantumGroup);

    // Tiered Golden Cryostat Flanges
    const cryoTiers = [
      { y: 3.2, r: 2.6, h: 0.22 },
      { y: 1.9, r: 2.1, h: 0.20 },
      { y: 0.7, r: 1.6, h: 0.18 },
      { y: -0.5, r: 1.1, h: 0.16 },
    ];
    cryoTiers.forEach(t => {
      const flange = new THREE.Mesh(new THREE.CylinderGeometry(t.r, t.r, t.h, 48), goldPlatedMat);
      flange.position.y = t.y;
      flange.castShadow = true;
      quantumGroup.add(flange);

      const flangeRing = new THREE.Mesh(new THREE.TorusGeometry(t.r, 0.05, 12, 48), violetMat);
      flangeRing.rotation.x = Math.PI / 2;
      flangeRing.position.y = t.y;
      quantumGroup.add(flangeRing);
    });

    // Chrome Coaxial Waveguide Cryo-Lines
    for (let c = 0; c < 8; c++) {
      const angle = (c / 8) * Math.PI * 2;
      const pipeRadius = 1.35;
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 3.6, 8), polishedChromeMat);
      pipe.position.set(Math.sin(angle) * pipeRadius, 1.35, Math.cos(angle) * pipeRadius);
      quantumGroup.add(pipe);
    }

    // Superconducting Qubit Package Canister
    const chipCanister = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.85, 24), slateArmorMat);
    chipCanister.position.set(0, -1.2, 0);
    chipCanister.castShadow = true;
    quantumGroup.add(chipCanister);

    // Quantum Bloch Sphere & Superposition State Ring
    const qOrb = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 24), violetMat);
    qOrb.position.set(0, 0.7, 0);
    quantumGroup.add(qOrb);

    const qRing1 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.045, 16, 48), violetMat);
    qRing1.position.set(0, 0.7, 0);
    quantumGroup.add(qRing1);

    const qRing2 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.045, 16, 48), violetMat);
    qRing2.position.set(0, 0.7, 0);
    qRing2.rotation.x = Math.PI / 2;
    quantumGroup.add(qRing2);

    // =========================================================================
    // THEME 4: FINTECH (Imperial Amber Gold #FFB703)
    // =========================================================================
    const fintechGroup = new THREE.Group();
    fintechGroup.name = 'fintech';
    themeModelsRef.current['track-fintech'] = fintechGroup;
    themeModelsRef.current['surya'] = fintechGroup;
    stageGroup.add(fintechGroup);

    // Heavy FinTech Sovereign Currency Token Disc
    const coinGeo = new THREE.CylinderGeometry(2.3, 2.3, 0.45, 48);
    const coin = new THREE.Mesh(coinGeo, amberMat);
    coin.rotation.x = Math.PI / 2;
    coin.position.set(0, 0.9, 0);
    coin.castShadow = true;
    fintechGroup.add(coin);

    const coinChromeRim = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.08, 16, 48), polishedChromeMat);
    coinChromeRim.rotation.x = Math.PI / 2;
    coinChromeRim.position.set(0, 0.9, 0);
    fintechGroup.add(coinChromeRim);

    // Currency Inscription Symbol
    const cStem = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.6, 0.5), brushedTitaniumMat);
    cStem.position.set(0, 0.9, 0.05);
    fintechGroup.add(cStem);

    const cCross1 = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.28, 0.5), brushedTitaniumMat);
    cCross1.position.set(0, 1.35, 0.05);
    fintechGroup.add(cCross1);

    const cCross2 = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.28, 0.5), brushedTitaniumMat);
    cCross2.position.set(0, 0.45, 0.05);
    fintechGroup.add(cCross2);

    // Stepped Algorithmic Trading Steles
    const fintechBars = [
      { x: -3.4, z: 0.8, h: 2.2 },
      { x: -1.8, z: 1.4, h: 3.2 },
      { x: 1.8,  z: 1.4, h: 4.0 },
      { x: 3.4,  z: 0.8, h: 5.0 },
    ];
    fintechBars.forEach(b => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.85, b.h, 0.85), slateArmorMat);
      col.position.set(b.x, b.h / 2 - 1.4, b.z);
      col.castShadow = true;
      fintechGroup.add(col);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.12, 0.88), amberMat);
      cap.position.set(b.x, b.h - 1.4 + 0.06, b.z);
      fintechGroup.add(cap);

      const colEdge = new THREE.LineSegments(new THREE.EdgesGeometry(col.geometry), new THREE.LineBasicMaterial({ color: 0xffb703 }));
      colEdge.position.set(b.x, b.h / 2 - 1.4, b.z);
      fintechGroup.add(colEdge);
    });

    // =========================================================================
    // THEME 5: ENERGY & SUSTAINABILITY (Vivid Emerald #00E676)
    // =========================================================================
    const energyGroup = new THREE.Group();
    energyGroup.name = 'sustainability';
    themeModelsRef.current['track-energy-sustainability'] = energyGroup;
    themeModelsRef.current['vanam'] = energyGroup;
    stageGroup.add(energyGroup);

    // Aerodynamic Wind Turbine Mast
    const towerMast = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.75, 5.0, 24), brushedTitaniumMat);
    towerMast.position.set(0, 0.3, 0);
    towerMast.castShadow = true;
    energyGroup.add(towerMast);

    // Aerodynamic Nacelle
    const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.68, 1.9, 24), slateArmorMat);
    nacelle.rotation.x = Math.PI / 2;
    nacelle.position.set(0, 2.8, 0);
    energyGroup.add(nacelle);

    // Clean Energy Kinetic Rotor Hub
    const rotorHub = new THREE.Group();
    rotorHub.position.set(0, 2.8, 1.05);
    energyGroup.add(rotorHub);

    const noseCone = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.8, 24), polishedChromeMat);
    noseCone.rotation.x = Math.PI / 2;
    rotorHub.add(noseCone);

    for (let b = 0; b < 3; b++) {
      const bAngle = (b / 3) * Math.PI * 2;
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.32, 4.2, 0.08), emeraldMat);
      blade.position.set(Math.sin(bAngle) * 2.1, Math.cos(bAngle) * 2.1, 0);
      blade.rotation.z = -bAngle;
      blade.castShadow = true;
      rotorHub.add(blade);
    }

    // Solar PV Ground Canopies
    [-2.6, 2.6].forEach(px => {
      const pv = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.08, 1.5), solarCellMat);
      pv.position.set(px, -1.6, 1.2);
      pv.rotation.x = -Math.PI / 5;
      energyGroup.add(pv);

      const pvEdge = new THREE.LineSegments(new THREE.EdgesGeometry(pv.geometry), new THREE.LineBasicMaterial({ color: 0x00e676 }));
      pvEdge.position.set(px, -1.6, 1.2);
      pvEdge.rotation.x = -Math.PI / 5;
      energyGroup.add(pvEdge);
    });

    // Bio-Energy Torus Catalyst
    const helixBase = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.08, 16, 48), emeraldMat);
    helixBase.rotation.x = Math.PI / 2;
    helixBase.position.set(0, -1.9, 0);
    energyGroup.add(helixBase);

    // Initial Layout Setup based on viewMode
    FIVE_GATES_CONFIG.forEach((gate, idx) => {
      const grp = themeModelsRef.current[gate.id];
      if (!grp) return;

      if (isChakravyuh) {
        grp.visible = true;
        const radius = 7.6;
        const rad = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
        grp.position.set(Math.cos(rad) * radius, 0.2, Math.sin(rad) * radius);
        grp.scale.set(0.68, 0.68, 0.68);
        grp.rotation.y = -rad + Math.PI / 2;
      } else {
        const isActive = gate.id === activeGate.id || gate.themeKey === activeGate.themeKey;
        grp.visible = isActive;
        grp.position.set(0, 0.4, 0);
        grp.scale.set(1.0, 1.0, 1.0);
        grp.rotation.y = 0;
      }
    });

    // 8. RESIZE OBSERVER
    const updateDimensions = (width: number) => {
      if (!camera || !renderer) return;
      const newSize = Math.max(Math.round(width), 280);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      const newDpr = Math.min(window.devicePixelRatio || 1, 2.5);
      renderer.setPixelRatio(newDpr);
      renderer.setSize(newSize, newSize, false);
    };

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) updateDimensions(w);
      }
    });
    resizeObserver.observe(container);

    // 9. RENDER LOOP (STATIC - NO AUTO ROTATION!)
    let animationFrameId: number;

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);

      // OrbitControls allows manual user dragging/rotation without auto-spin
      controls.update();

      try {
        renderer.render(scene, camera);
      } catch (e) {
        // Recover gracefully
      }
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none w-full ${className}`}>
      {/* Top Header & View Mode Switcher */}
      <div className="w-full flex items-center justify-between px-3 pb-2 z-20">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full ring-2 ring-white/20"
            style={{
              backgroundColor: currentMode === 'chakravyuh' ? '#FFFFFF' : activeGate.accent,
            }}
          />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            {currentMode === 'chakravyuh' ? 'GRAND CHAKRAVYUH FORMATION' : activeGate.title}
          </span>
        </div>

        {/* View Mode Toggle Pill */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/[0.1]">
          <button
            type="button"
            onClick={() => setInternalViewMode('chakravyuh')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
              currentMode === 'chakravyuh'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>FORMATION</span>
          </button>
          <button
            type="button"
            onClick={() => setInternalViewMode('isolated')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
              currentMode === 'isolated'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <RotateCw className="w-3 h-3" />
            <span>FOCUSED</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport (100% Interactive, Drag to Rotate 360°) */}
      <div
        ref={mountRef}
        className="relative w-full max-w-[700px] aspect-square flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing z-10"
      />

      {/* Floating 360° Drag Interaction Hint */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-60 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400">
          <RotateCw className="w-2.5 h-2.5 text-zinc-300" />
          <span>DRAG TO ROTATE 360°</span>
        </div>
      </div>

      {/* Five Theme Switcher Pills */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 z-20 w-full px-2">
        {FIVE_GATES_CONFIG.map((gate, idx) => {
          const isSelected = activeGate.id === gate.id;

          return (
            <button
              key={gate.id}
              type="button"
              onClick={() => {
                if (!isLocked) {
                  onSelectTrack(gate.id);
                  if (currentMode === 'chakravyuh') {
                    // Clicking theme switches to isolated focused inspection
                    setInternalViewMode('isolated');
                  }
                }
              }}
              disabled={isLocked && !isSelected}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[11px] font-semibold tracking-wider transition-all duration-200 ${
                isSelected
                  ? 'bg-white text-black shadow-md scale-105 cursor-pointer ring-1 ring-white/40'
                  : isLocked
                  ? 'bg-transparent text-zinc-600 opacity-40 cursor-not-allowed'
                  : 'bg-white/[0.04] text-zinc-400 hover:bg-white/[0.08] hover:text-white cursor-pointer'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: gate.accent }}
              />
              <span>{`0${idx + 1}`}</span>
              <span className="text-zinc-600">//</span>
              <span>{gate.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChakravyuhWheel3D;
