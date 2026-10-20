import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  isSelected: boolean;
  className?: string;
}

interface Ember {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  maxLife: number;
  life: number;
  hue: number;
  swayOffset: number;
}

export const AgniBackground: React.FC<BackgroundProps> = ({ isSelected, className = '' }) => {
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
    const maxEmbers = isSelected ? (isMobile ? 22 : 36) : (isMobile ? 12 : 20);
    const embers: Ember[] = [];

    const spawnEmber = (): Ember => {
      // Spawn near the right quadrant where the oil lamp sits
      const spawnCenterX = width * 0.82;
      const spawnCenterY = height * 0.85;
      return {
        x: spawnCenterX + (Math.random() - 0.5) * 60,
        y: spawnCenterY + (Math.random() - 0.5) * 20,
        size: Math.random() * 2.5 + 1.2,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 1.4 + 0.6),
        alpha: Math.random() * 0.5 + 0.5,
        maxLife: Math.random() * 90 + 70,
        life: 0,
        hue: Math.floor(Math.random() * 35) + 15, // Golden saffron to orange-red
        swayOffset: Math.random() * Math.PI * 2,
      };
    };

    // Pre-populate some embers
    for (let i = 0; i < maxEmbers; i++) {
      const e = spawnEmber();
      e.life = Math.random() * e.maxLife;
      e.y -= Math.random() * (height * 0.7);
      embers.push(e);
    }

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.03;

      while (embers.length < maxEmbers) {
        embers.push(spawnEmber());
      }

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life++;
        e.x += e.vx + Math.sin(time + e.swayOffset) * 0.45;
        e.y += e.vy;

        const progress = e.life / e.maxLife;
        const currentAlpha = Math.sin(progress * Math.PI) * e.alpha;

        if (e.life >= e.maxLife || e.y < 0) {
          embers.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 100%, 60%, ${currentAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${e.hue}, 100%, 55%, ${currentAlpha})`;
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
      {/* Subtle copper & saffron radial light pulse in background */}
      <div
        className="absolute -right-6 bottom-0 w-64 h-64 rounded-full transition-all duration-700 ease-out pointer-events-none"
        style={{
          background: isSelected
            ? 'radial-gradient(circle, rgba(234, 101, 78, 0.32) 0%, rgba(249, 115, 22, 0.16) 45%, transparent 70%)'
            : 'radial-gradient(circle, rgba(234, 101, 78, 0.16) 0%, rgba(249, 115, 22, 0.08) 45%, transparent 70%)',
          filter: 'blur(35px)',
        }}
      />

      {/* Sacred Rangoli Mandala Geometry (Layered Behind Diya) */}
      <svg
        viewBox="0 0 200 200"
        className="absolute -right-8 -bottom-10 w-56 h-56 text-[#E05A47] pointer-events-none transition-opacity duration-700"
        style={{ opacity: isSelected ? 0.35 : 0.18 }}
      >
        <g className="animate-rangoli-pulse">
          {/* Outer lotus petal rings */}
          <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="55" fill="none" stroke="#D8B46A" strokeWidth="0.8" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="35" fill="none" stroke="currentColor" strokeWidth="1" />
          {/* 8-Petal Sacred Floral Star */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <g key={idx} transform={`rotate(${angle} 100 100)`}>
              <path
                d="M100 25 C115 50 115 70 100 90 C85 70 85 50 100 25 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
              />
              <circle cx="100" cy="45" r="2.5" fill="#D8B46A" opacity="0.6" />
            </g>
          ))}
        </g>
      </svg>

      {/* Traditional Indian Brass Oil Lamp (Diya) with Dancing Sacred Flame */}
      <div className="absolute right-4 bottom-2.5 w-20 h-28 flex flex-col items-center justify-end pointer-events-none">
        {/* Animated Sacred Flame (Multiple layers: outer halo, body, inner core) */}
        <div className="relative w-12 h-16 flex items-center justify-center">
          {/* Flame Ambient Halo Glow */}
          <div
            className="absolute inset-0 rounded-full blur-md animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(255, 179, 0, 0.7) 0%, rgba(234, 101, 78, 0.3) 60%, transparent 100%)',
            }}
          />

          <svg viewBox="0 0 40 60" className="w-10 h-16 overflow-visible filter drop-shadow-[0_0_8px_rgba(255,160,0,0.8)]">
            {/* Outer dancing flame petal */}
            <path
              d="M20 4 C24 16 34 26 31 42 C28 54 12 54 9 42 C6 26 16 16 20 4 Z"
              fill="url(#outerFlameGrad)"
              className="animate-flame-flicker"
            />
            {/* Middle saffron flame */}
            <path
              d="M20 14 C23 22 28 30 26 42 C24 50 16 50 14 42 C12 30 17 22 20 14 Z"
              fill="url(#midFlameGrad)"
              className="animate-flame-core"
            />
            {/* Inner white-gold fiery bindu */}
            <path
              d="M20 25 C21.5 30 24 35 23 42 C22 47 18 47 17 42 C16 35 18.5 30 20 25 Z"
              fill="#FFFBEB"
              opacity="0.95"
            />

            <defs>
              <linearGradient id="outerFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFF176" />
                <stop offset="35%" stopColor="#FF9800" />
                <stop offset="80%" stopColor="#EA654E" />
                <stop offset="100%" stopColor="#B71C1C" />
              </linearGradient>
              <linearGradient id="midFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#FFF59D" />
                <stop offset="80%" stopColor="#FFB300" />
                <stop offset="100%" stopColor="#F57C00" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Traditional Brass Diya Base with Ornate Metallic Ridges */}
        <svg viewBox="0 0 60 28" className="w-14 h-7 text-[#D8B46A]">
          {/* Upper Diya bowl lip */}
          <path
            d="M6 10 C15 4 45 4 54 10 C50 18 38 22 30 22 C22 22 10 18 6 10 Z"
            fill="#B45309"
            stroke="#FDE68A"
            strokeWidth="1.2"
          />
          {/* Inner oil pool */}
          <ellipse cx="30" cy="10" rx="20" ry="4" fill="#78350F" />
          <ellipse cx="30" cy="10" rx="14" ry="2.2" fill="#D97706" opacity="0.8" />
          {/* Tiered Diya pedestal stand */}
          <path
            d="M22 21 L20 26 C25 27.5 35 27.5 40 26 L38 21 Z"
            fill="#92400E"
            stroke="#FDE68A"
            strokeWidth="0.8"
          />
          {/* Carved filigree dots on rim */}
          <circle cx="16" cy="13" r="1" fill="#FEF3C7" />
          <circle cx="23" cy="15" r="1" fill="#FEF3C7" />
          <circle cx="30" cy="16" r="1" fill="#FEF3C7" />
          <circle cx="37" cy="15" r="1" fill="#FEF3C7" />
          <circle cx="44" cy="13" r="1" fill="#FEF3C7" />
        </svg>
      </div>

      {/* HTML5 Canvas Rising Embers */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
    </div>
  );
};
