import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Track } from '../types';
import { RotateCw, Eye } from 'lucide-react';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  buildCyberGate,
  buildSpaceGate,
  buildQuantumGate,
  buildFintechGate,
  buildEnergyGate,
} from './gateModels';

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
        cameraRef.current.position.set(0, 17.5, 23.5);
        cameraRef.current.lookAt(0, 0, 0);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.maxDistance = 44;
        controlsRef.current.minDistance = 12;
      } else {
        cameraRef.current.position.set(5.2, 4.0, 17.5);
        cameraRef.current.lookAt(0, 1.8, 0);
        controlsRef.current.target.set(0, 1.8, 0);
        controlsRef.current.maxDistance = 32;
        controlsRef.current.minDistance = 9;
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
        const radius = 7.2;
        const rad = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
        grp.position.set(Math.cos(rad) * radius, 0.2, Math.sin(rad) * radius);
        grp.scale.set(0.62, 0.62, 0.62);
        grp.rotation.y = 0;
        grp.getObjectByName('annotations')?.scale.setScalar(0);
      } else {
        // Isolated focus: center the active model, hide others
        const isActive = gate.id === activeGate.id || gate.themeKey === activeGate.themeKey;
        grp.visible = isActive;
        grp.position.set(0, 0.4, 0);
        grp.scale.set(1.0, 1.0, 1.0);
        grp.rotation.y = 0;
        grp.getObjectByName('annotations')?.scale.setScalar(1);
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
      camera.position.set(0, 17.5, 23.5);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(5.2, 4.0, 17.5);
      camera.lookAt(0, 1.8, 0);
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
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // Image-based lighting so metals and clearcoats reflect something
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;
    scene.environmentIntensity = 0.65;

    // 4. ORBIT CONTROLS (STATIC by default, user rotates manually at will)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = false; // STATIC! No self rotation
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minPolarAngle = Math.PI / 8;
    controls.target.set(0, isChakravyuh ? 0 : 1.8, 0);
    controlsRef.current = controls;

    // 5. BALANCED HIGH-VISIBILITY STUDIO LIGHTING (NO harsh localized hotspots)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    // Key Light from top-front-left
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(12, 16, 14);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // Soft Fill Light from right-front
    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 0.8);
    fillLight.position.set(-14, 10, 10);
    scene.add(fillLight);

    // Soft Rim Light from behind-above
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.3);
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

    // 7. ROOT STAGE GROUP
    const stageGroup = new THREE.Group();
    stageGroupRef.current = stageGroup;
    scene.add(stageGroup);

    // =========================================================================
    // CHAKRAVYUH CENTRAL CITADEL & RADIAL GATE CONDUITS
    // (Rendered in 'chakravyuh' mode for the grand landing page formation)
    // =========================================================================
    const ringsGroup = new THREE.Group();
    ringsGroupRef.current = ringsGroup;
    ringsGroup.visible = currentMode === 'chakravyuh';
    stageGroup.add(ringsGroup);

    // Central Citadel Nexus (The Core of Chakravyuh)
    const citadelBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.0, 0.6, 8), slateArmorMat);
    citadelBase.position.y = 0.3;
    citadelBase.castShadow = true;
    ringsGroup.add(citadelBase);

    const citadelCap = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.5, 0.4, 8), slateArmorMat);
    citadelCap.position.y = 0.8;
    ringsGroup.add(citadelCap);

    const citadelCrown = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 0), polishedChromeMat);
    citadelCrown.position.y = 1.4;
    ringsGroup.add(citadelCrown);

    // CAD-style outlines on the formation centrepiece
    [citadelBase, citadelCap, citadelCrown].forEach(m =>
      m.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(m.geometry, 20),
          new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })
        )
      )
    );

    // 5 Radial Strategic Gate Conduits connecting Citadel to the 5 Themes
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const xEnd = Math.cos(angle) * 7.2;
      const zEnd = Math.sin(angle) * 7.2;
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
    // FIVE GATE MODELS (see gateModels.ts)
    // =========================================================================
    const aniso = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    const gateModels: [string[], string, THREE.Group][] = [
      [['track-cybersecurity-blockchain', 'agni'], 'cybersecurity', buildCyberGate(aniso)],
      [['track-space-technology', 'vayu'], 'space', buildSpaceGate(aniso)],
      [['track-quantum-computing', 'vajra'], 'quantum', buildQuantumGate(aniso)],
      [['track-fintech', 'surya'], 'fintech', buildFintechGate(aniso)],
      [['track-energy-sustainability', 'vanam'], 'energy', buildEnergyGate(aniso)],
    ];
    gateModels.forEach(([keys, name, group]) => {
      group.name = name;
      keys.forEach(k => {
        themeModelsRef.current[k] = group;
      });
      stageGroup.add(group);
    });

    // Initial Layout Setup based on viewMode
    FIVE_GATES_CONFIG.forEach((gate, idx) => {
      const grp = themeModelsRef.current[gate.id];
      if (!grp) return;

      if (isChakravyuh) {
        grp.visible = true;
        const radius = 7.2;
        const rad = (idx * 2 * Math.PI) / 5 - Math.PI / 2;
        grp.position.set(Math.cos(rad) * radius, 0.2, Math.sin(rad) * radius);
        grp.scale.set(0.62, 0.62, 0.62);
        grp.rotation.y = 0;
        grp.getObjectByName('annotations')?.scale.setScalar(0);
      } else {
        const isActive = gate.id === activeGate.id || gate.themeKey === activeGate.themeKey;
        grp.visible = isActive;
        grp.position.set(0, 0.4, 0);
        grp.scale.set(1.0, 1.0, 1.0);
        grp.rotation.y = 0;
        grp.getObjectByName('annotations')?.scale.setScalar(1);
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
    const clock = new THREE.Clock();

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);

      // OrbitControls allows manual user dragging/rotation without auto-spin
      controls.update();

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      stageGroup.children.forEach(c => {
        if (c.visible && c.userData.update) c.userData.update(t, dt);
      });

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
      envMap.dispose();
      pmrem.dispose();
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
      <div className="mt-1 z-20 pointer-events-none opacity-60">
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
