import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  isSelected: boolean;
  className?: string;
}

interface LightningBolt {
  segments: { x1: number; y1: number; x2: number; y2: number }[];
  alpha: number;
  width: number;
  color: string;
}

export const VajraBackground: React.FC<BackgroundProps> = ({ isSelected, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 150);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const activeBolts: LightningBolt[] = [];

    // Recursive midpoint displacement lightning arc generator
    const createBolt = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      displace: number,
      segments: { x1: number; y1: number; x2: number; y2: number }[]
    ) => {
      if (displace < 4) {
        segments.push({ x1, y1, x2, y2 });
        return;
      }
      const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displace;
      const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displace;

      createBolt(x1, y1, midX, midY, displace / 2, segments);
      createBolt(midX, midY, x2, y2, displace / 2, segments);

      // Occasional branching fork
      if (Math.random() < 0.28) {
        const branchEndX = midX + (Math.random() - 0.5) * 45;
        const branchEndY = midY + (Math.random() - 0.5) * 45;
        createBolt(midX, midY, branchEndX, branchEndY, displace / 2.5, segments);
      }
    };

    const triggerStrike = () => {
      // Strike origins focused around the vajra artwork on the right
      const startX = width * (0.65 + Math.random() * 0.3);
      const startY = height * (0.15 + Math.random() * 0.35);
      const endX = startX + (Math.random() - 0.5) * (width * 0.5);
      const endY = height * (0.55 + Math.random() * 0.4);

      const segments: { x1: number; y1: number; x2: number; y2: number }[] = [];
      createBolt(startX, startY, endX, endY, 28, segments);

      activeBolts.push({
        segments,
        alpha: 1.0,
        width: Math.random() * 1.5 + 1.2,
        color: Math.random() > 0.4 ? '#93C5FD' : '#E0F2FE',
      });
    };

    let lastStrikeTime = 0;
    const strikeInterval = isSelected ? 1200 : 2400;

    let time = 0;
    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      // Trigger occasional strikes
      if (now - lastStrikeTime > strikeInterval + (Math.random() - 0.5) * 800) {
        triggerStrike();
        lastStrikeTime = now;
      }

      // Draw and decay active electric bolts
      for (let i = activeBolts.length - 1; i >= 0; i--) {
        const bolt = activeBolts[i];
        bolt.alpha -= 0.055;

        if (bolt.alpha <= 0) {
          activeBolts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = bolt.color;
        ctx.lineWidth = bolt.width;
        ctx.globalAlpha = bolt.alpha;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#60A5FA';

        ctx.beginPath();
        for (const seg of bolt.segments) {
          ctx.moveTo(seg.x1, seg.y1);
          ctx.lineTo(seg.x2, seg.y2);
        }
        ctx.stroke();

        // White inner core
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = Math.max(0.6, bolt.width * 0.4);
        ctx.stroke();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSelected]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none rounded-2xl ${className}`}>
      {/* Restrained electric blue ambient background glow */}
      <div
        className="absolute -right-10 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: isSelected
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.28) 0%, rgba(30, 58, 138, 0.15) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.14) 0%, rgba(30, 58, 138, 0.06) 50%, transparent 75%)',
          filter: 'blur(38px)',
        }}
      />

      {/* Engraved Sacred Yantra Diamond Matrix (Traditional Metallic Geometry) */}
      <svg
        viewBox="0 0 200 200"
        className="absolute -right-6 top-1/2 -translate-y-1/2 w-52 h-52 text-[#3B82F6] pointer-events-none transition-opacity duration-700"
        style={{ opacity: isSelected ? 0.32 : 0.15 }}
      >
        <g className="animate-vajra-pulse">
          {/* Concentric diamond yantra steps */}
          <rect x="35" y="35" width="130" height="130" transform="rotate(45 100 100)" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" />
          <rect x="50" y="50" width="100" height="100" transform="rotate(45 100 100)" fill="none" stroke="#60A5FA" strokeWidth="0.8" />
          <rect x="65" y="65" width="70" height="70" transform="rotate(45 100 100)" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          {/* Radial lightning grid ticks */}
          <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
          <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
          <circle cx="100" cy="100" r="16" fill="none" stroke="#93C5FD" strokeWidth="1.2" />
        </g>
      </svg>

      {/* Indra's Vajra Motif with Travelling Outline Energy Light */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-28 h-40 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 100 180"
          className="w-24 h-40 filter drop-shadow-[0_0_12px_rgba(59,130,246,0.5)] overflow-visible"
        >
          <defs>
            <linearGradient id="vajraMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="45%" stopColor="#3B82F6" />
              <stop offset="85%" stopColor="#1E3A8A" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="vajraEnergyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="50%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>

          {/* Central Spherical Lotus Hub (Garbha) */}
          <circle cx="50" cy="90" r="12" fill="url(#vajraMetalGrad)" stroke="#93C5FD" strokeWidth="1.5" />
          <circle cx="50" cy="90" r="6" fill="#0F172A" stroke="#E0F2FE" strokeWidth="1" />
          <circle cx="50" cy="90" r="2.5" fill="#E0F2FE" />

          {/* Upper Lotus Crown (Padmasana) */}
          <path
            d="M32 76 C40 82 60 82 68 76 C65 68 35 68 32 76 Z"
            fill="#1E40AF"
            stroke="#60A5FA"
            strokeWidth="1.2"
          />
          {/* Lower Lotus Crown */}
          <path
            d="M32 104 C40 98 60 98 68 104 C65 112 35 112 32 104 Z"
            fill="#1E40AF"
            stroke="#60A5FA"
            strokeWidth="1.2"
          />

          {/* Upper Central Diamond Spire (Point) */}
          <path
            d="M50 14 L55 68 L45 68 Z"
            fill="url(#vajraMetalGrad)"
            stroke="#93C5FD"
            strokeWidth="1.2"
          />
          {/* Upper Outer Curved Flanking Prongs (Makara mouths) */}
          <path
            d="M35 70 C24 55 24 35 50 14 C36 38 34 56 42 70 Z"
            fill="#1D4ED8"
            stroke="#60A5FA"
            strokeWidth="1.2"
          />
          <path
            d="M65 70 C76 55 76 35 50 14 C64 38 66 56 58 70 Z"
            fill="#1D4ED8"
            stroke="#60A5FA"
            strokeWidth="1.2"
          />

          {/* Lower Central Diamond Spire */}
          <path
            d="M50 166 L55 112 L45 112 Z"
            fill="url(#vajraMetalGrad)"
            stroke="#93C5FD"
            strokeWidth="1.2"
          />
          {/* Lower Outer Curved Flanking Prongs */}
          <path
            d="M35 110 C24 125 24 145 50 166 C36 142 34 124 42 110 Z"
            fill="#1D4ED8"
            stroke="#60A5FA"
            strokeWidth="1.2"
          />
          <path
            d="M65 110 C76 125 76 145 50 166 C64 142 66 124 58 110 Z"
            fill="#1D4ED8"
            stroke="#60A5FA"
            strokeWidth="1.2"
          />

          {/* Animated Blue Electric Energy Flowing Along Outlines */}
          <path
            d="M50 14 C20 45 20 135 50 166 C80 135 80 45 50 14 Z"
            fill="none"
            stroke="url(#vajraEnergyGrad)"
            strokeWidth="1.8"
            strokeDasharray="16 28"
            className="animate-vajra-energy"
          />

          {/* Inner Central Core Pulsing Ray */}
          <line
            x1="50"
            y1="22"
            x2="50"
            y2="158"
            stroke="#E0F2FE"
            strokeWidth="1"
            strokeDasharray="8 12"
            className="animate-vajra-energy"
          />
        </svg>
      </div>

      {/* HTML5 Canvas Branching Electric Arcs */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
    </div>
  );
};
