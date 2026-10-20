import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  isSelected: boolean;
  className?: string;
}

interface FallingLeaf {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  swayAmp: number;
  swayFreq: number;
  swayPhase: number;
  alpha: number;
  color: string;
}

export const VanamBackground: React.FC<BackgroundProps> = ({ isSelected, className = '' }) => {
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

    const isMobile = window.innerWidth < 768;
    const leafCount = isSelected ? (isMobile ? 14 : 24) : (isMobile ? 8 : 14);
    const leaves: FallingLeaf[] = [];

    const leafColors = ['#10B981', '#34D399', '#059669', '#047857', '#D97706'];

    const spawnLeaf = (startY?: number): FallingLeaf => {
      return {
        x: Math.random() * width,
        y: startY !== undefined ? startY : -15,
        size: Math.random() * 4.5 + 3,
        vx: (Math.random() - 0.4) * 0.7, // Gentle drift with slight right-to-left bias
        vy: Math.random() * 0.7 + 0.5,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04,
        swayAmp: Math.random() * 1.2 + 0.5,
        swayFreq: Math.random() * 0.03 + 0.02,
        swayPhase: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.45 + 0.45,
        color: leafColors[Math.floor(Math.random() * leafColors.length)],
      };
    };

    for (let i = 0; i < leafCount; i++) {
      leaves.push(spawnLeaf(Math.random() * height));
    }

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.03;

      while (leaves.length < leafCount) {
        leaves.push(spawnLeaf());
      }

      for (let i = leaves.length - 1; i >= 0; i--) {
        const l = leaves[i];
        l.y += l.vy;
        l.x += l.vx + Math.sin(time + l.swayPhase) * l.swayAmp;
        l.rotation += l.vRot;

        if (l.y > height + 20) {
          leaves.splice(i, 1);
          continue;
        }

        // Draw stylized Gond folk-art pointed leaf
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.rotation);
        ctx.globalAlpha = l.alpha;
        ctx.fillStyle = l.color;
        ctx.strokeStyle = '#D97706';
        ctx.lineWidth = 0.6;

        ctx.beginPath();
        // Pointed oval leaf profile
        ctx.moveTo(0, -l.size * 1.8);
        ctx.quadraticCurveTo(l.size * 1.1, 0, 0, l.size * 1.8);
        ctx.quadraticCurveTo(-l.size * 1.1, 0, 0, -l.size * 1.8);
        ctx.fill();
        ctx.stroke();

        // Central vein
        ctx.beginPath();
        ctx.moveTo(0, -l.size * 1.6);
        ctx.lineTo(0, l.size * 1.6);
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
      {/* Deep forest green & bronze ambient aura */}
      <div
        className="absolute -right-8 bottom-0 w-64 h-64 rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: isSelected
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(6, 78, 59, 0.18) 55%, transparent 75%)'
            : 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, rgba(6, 78, 59, 0.08) 55%, transparent 75%)',
          filter: 'blur(36px)',
        }}
      />

      {/* Indian Gond Tribal Folk-Art Stylized Sacred Boughs & Swaying Patterned Foliage */}
      <div className="absolute right-0 bottom-0 w-36 h-40 flex items-end justify-end pointer-events-none">
        <svg
          viewBox="0 0 140 160"
          className="w-36 h-40 overflow-visible text-[#10B981] filter drop-shadow-[0_0_10px_rgba(16,185,129,0.35)]"
        >
          <defs>
            <linearGradient id="gondBranchGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#064E3B" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
            <pattern id="gondLines" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#D1FAE5" strokeWidth="0.8" opacity="0.6" />
            </pattern>
          </defs>

          {/* Main Stylized Gond Tree Trunk & Branches */}
          <path
            d="M140 160 C120 130 90 120 85 90 C80 60 95 30 110 15"
            fill="none"
            stroke="url(#gondBranchGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M85 90 C65 80 45 75 35 50"
            fill="none"
            stroke="url(#gondBranchGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M95 55 C115 50 125 45 135 30"
            fill="none"
            stroke="url(#gondBranchGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Traditional Gond Folk-Art Dot Arrays Along Bark */}
          {[130, 110, 95, 80, 65, 50, 35, 20].map((y, idx) => (
            <circle
              key={idx}
              cx={140 - idx * 6}
              cy={y}
              r="1.2"
              fill="#FDE68A"
              opacity="0.75"
            />
          ))}

          {/* Cluster 1: Swaying Upper Left Leaf Pair */}
          <g className="animate-gond-sway-1" style={{ transformOrigin: '35px 50px' }}>
            <path
              d="M35 50 C20 40 15 25 25 15 C35 25 40 40 35 50 Z"
              fill="#065F46"
              stroke="#10B981"
              strokeWidth="1"
            />
            {/* Fine Gond hatching within leaf */}
            <path d="M35 50 L25 15" stroke="#6EE7B7" strokeWidth="0.8" />
            <path d="M30 42 L24 38 M32 34 L25 30 M33 26 L26 22" stroke="#A7F3D0" strokeWidth="0.6" />
          </g>

          {/* Cluster 2: Swaying Upper Center Leaf (Bronze Accented) */}
          <g className="animate-gond-sway-2" style={{ transformOrigin: '110px 15px' }}>
            <path
              d="M110 15 C100 -2 85 0 90 15 C98 22 108 20 110 15 Z"
              fill="#047857"
              stroke="#D97706"
              strokeWidth="1.2"
            />
            <path d="M110 15 L90 15" stroke="#FBBF24" strokeWidth="0.8" />
            {/* Tribal decorative dots along leaf perimeter */}
            <circle cx="95" cy="5" r="1" fill="#FEF3C7" />
            <circle cx="102" cy="7" r="1" fill="#FEF3C7" />
            <circle cx="98" cy="18" r="1" fill="#FEF3C7" />
          </g>

          {/* Cluster 3: Swaying Upper Right Foliage */}
          <g className="animate-gond-sway-1" style={{ transformOrigin: '135px 30px', animationDelay: '-1.5s' }}>
            <path
              d="M135 30 C125 18 115 20 120 32 C126 38 134 35 135 30 Z"
              fill="#065F46"
              stroke="#34D399"
              strokeWidth="1"
            />
            <path d="M135 30 L120 32" stroke="#6EE7B7" strokeWidth="0.7" />
          </g>

          {/* Cluster 4: Lower Swaying Leaf */}
          <g className="animate-gond-sway-2" style={{ transformOrigin: '65px 80px', animationDelay: '-2.5s' }}>
            <path
              d="M65 80 C50 72 45 60 52 52 C60 60 66 72 65 80 Z"
              fill="#064E3B"
              stroke="#10B981"
              strokeWidth="1"
            />
            <path d="M65 80 L52 52" stroke="#34D399" strokeWidth="0.8" />
            <circle cx="56" cy="62" r="1.1" fill="#FDE68A" />
            <circle cx="60" cy="70" r="1.1" fill="#FDE68A" />
          </g>
        </svg>
      </div>

      {/* HTML5 Canvas Gently Falling & Drifting Leaves */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
    </div>
  );
};
