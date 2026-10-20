import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  isSelected: boolean;
  className?: string;
}

interface GoldDust {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
}

export const SuryaBackground: React.FC<BackgroundProps> = ({ isSelected, className = '' }) => {
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
    const dustCount = isSelected ? (isMobile ? 24 : 45) : (isMobile ? 14 : 25);
    const dustParticles: GoldDust[] = [];

    const spawnDust = (): GoldDust => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.45) * 0.4,
        vy: -(Math.random() * 0.5 + 0.2), // Gently floating upward like dust in temple sunlight
        alpha: Math.random() * 0.5 + 0.3,
        baseAlpha: Math.random() * 0.4 + 0.3,
        twinkleSpeed: Math.random() * 0.05 + 0.02,
        phase: Math.random() * Math.PI * 2,
      };
    };

    for (let i = 0; i < dustCount; i++) {
      dustParticles.push(spawnDust());
    }

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.03;

      for (let i = 0; i < dustParticles.length; i++) {
        const p = dustParticles[i];
        p.x += p.vx + Math.sin(time + p.phase) * 0.2;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.y < 0) p.y = height + 5;
        if (p.x < 0) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;

        const currentAlpha = p.baseAlpha + Math.sin(time * 2 + p.phase) * 0.25;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${Math.max(0.05, currentAlpha)})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
        ctx.fill();
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
      {/* Warm amber solar glow */}
      <div
        className="absolute -right-10 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: isSelected
            ? 'radial-gradient(circle, rgba(216, 180, 106, 0.35) 0%, rgba(180, 83, 9, 0.18) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(216, 180, 106, 0.16) 0%, rgba(180, 83, 9, 0.08) 50%, transparent 75%)',
          filter: 'blur(36px)',
        }}
      />

      {/* Konark Sun Temple Carved Stone Wheel with Radial Engravings & Slow Rotation */}
      <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center pointer-events-none">
        {/* Sweeping Narrow Golden Light Sheen */}
        <div
          className="absolute inset-0 rounded-full animate-sun-sweep pointer-events-none"
          style={{
            background:
              'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 40deg, rgba(253, 230, 138, 0.3) 65deg, rgba(251, 191, 36, 0.5) 75deg, rgba(253, 230, 138, 0.2) 85deg, transparent 110deg, transparent 360deg)',
            mixBlendMode: 'screen',
            opacity: isSelected ? 0.9 : 0.55,
          }}
        />

        {/* Ornate Konark Stone Wheel SVG */}
        <svg
          viewBox="0 0 200 200"
          className="w-44 h-44 text-[#D8B46A] filter drop-shadow-[0_0_12px_rgba(216,180,106,0.35)] overflow-visible"
        >
          <defs>
            <radialGradient id="konarkHubGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF3C7" />
              <stop offset="45%" stopColor="#D97706" />
              <stop offset="90%" stopColor="#78350F" />
            </radialGradient>
          </defs>

          {/* Stationary Outer Stone Rim with Carved Beaded Border */}
          <circle cx="100" cy="100" r="92" fill="none" stroke="#B45309" strokeWidth="3" opacity="0.45" />
          <circle cx="100" cy="100" r="86" fill="none" stroke="#D8B46A" strokeWidth="1.4" opacity="0.6" />
          <circle cx="100" cy="100" r="82" fill="none" stroke="#FDE68A" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.75" />

          {/* Rotating Radial Spoke & Medallion Layer (Slow Majestic Spin) */}
          <g className="animate-konark-spin" style={{ transformOrigin: '100px 100px' }}>
            {/* 8 Primary Carved Spokes with Medallions */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
              <g key={idx} transform={`rotate(${angle} 100 100)`}>
                {/* Tapered main spoke beam */}
                <line x1="100" y1="28" x2="100" y2="82" stroke="#D8B46A" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="97" y1="35" x2="97" y2="78" stroke="#78350F" strokeWidth="0.8" opacity="0.6" />
                <line x1="103" y1="35" x2="103" y2="78" stroke="#FEF3C7" strokeWidth="0.8" opacity="0.6" />

                {/* Circular Carved Medallion at Spoke Midpoint */}
                <circle cx="100" cy="54" r="6.5" fill="#78350F" stroke="#D8B46A" strokeWidth="1.2" />
                <circle cx="100" cy="54" r="3" fill="#D97706" stroke="#FEF3C7" strokeWidth="0.8" />
              </g>
            ))}

            {/* 8 Intermediary Narrow Spokes with Carved Beads */}
            {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, idx) => (
              <g key={idx} transform={`rotate(${angle} 100 100)`}>
                <line x1="100" y1="30" x2="100" y2="82" stroke="#B45309" strokeWidth="1.1" strokeDasharray="4 2" />
                <circle cx="100" cy="54" r="2.2" fill="#FBBF24" />
              </g>
            ))}
          </g>

          {/* Central Carved Hub (Axle and Sacred Lotus Centerpiece) */}
          <circle cx="100" cy="100" r="22" fill="url(#konarkHubGrad)" stroke="#FDE68A" strokeWidth="1.8" />
          <circle cx="100" cy="100" r="16" fill="#451A03" stroke="#D8B46A" strokeWidth="1.2" />

          {/* Central 8-Petal Solar Lotus Disc */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <path
              key={idx}
              d="M100 87 C103 93 103 97 100 100 C97 97 97 93 100 87 Z"
              fill="#F59E0B"
              stroke="#FEF3C7"
              strokeWidth="0.6"
              transform={`rotate(${angle} 100 100)`}
            />
          ))}

          {/* Central Axle Pin (Bindu) */}
          <circle cx="100" cy="100" r="5" fill="#FEF3C7" stroke="#78350F" strokeWidth="1" />
          <circle cx="100" cy="100" r="2" fill="#78350F" />
        </svg>
      </div>

      {/* HTML5 Canvas Floating Golden Dust Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
    </div>
  );
};
