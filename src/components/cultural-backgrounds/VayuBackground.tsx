import React, { useEffect, useRef } from 'react';

interface BackgroundProps {
  isSelected: boolean;
  className?: string;
}

interface WindMote {
  x: number;
  y: number;
  baseY: number;
  vx: number;
  length: number;
  size: number;
  alpha: number;
  freq: number;
  amp: number;
  phase: number;
  color: string;
}

export const VayuBackground: React.FC<BackgroundProps> = ({ isSelected, className = '' }) => {
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
    const count = isSelected ? (isMobile ? 22 : 36) : (isMobile ? 12 : 20);
    const motes: WindMote[] = [];

    const spawnMote = (startX?: number): WindMote => {
      const baseY = Math.random() * height;
      return {
        x: startX !== undefined ? startX : width + Math.random() * 40,
        y: baseY,
        baseY,
        vx: -(Math.random() * 1.8 + (isSelected ? 2.2 : 1.8)), // Swift flow from right to left
        length: Math.random() * 16 + 8,
        size: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.45 + 0.35,
        freq: Math.random() * 0.025 + 0.015,
        amp: Math.random() * 14 + 6,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.45 ? '#22D3EE' : '#E2E8F0', // Cyan and muted silver
      };
    };

    // Pre-populate particles across screen
    for (let i = 0; i < count; i++) {
      motes.push(spawnMote(Math.random() * width));
    }

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.04;

      while (motes.length < count) {
        motes.push(spawnMote());
      }

      for (let i = motes.length - 1; i >= 0; i--) {
        const m = motes[i];
        m.x += m.vx;
        m.y = m.baseY + Math.sin(m.x * m.freq + m.phase + time) * m.amp;

        if (m.x < -30) {
          motes.splice(i, 1);
          continue;
        }

        // Draw elongated flowing wind streak
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x + m.length, m.y - (Math.cos(m.x * m.freq) * 2));
        ctx.strokeStyle = m.color;
        ctx.lineWidth = m.size;
        ctx.globalAlpha = m.alpha;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#06B6D4';
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
      {/* Midnight teal atmospheric glow */}
      <div
        className="absolute -right-8 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: isSelected
            ? 'radial-gradient(circle, rgba(6, 182, 212, 0.28) 0%, rgba(8, 51, 68, 0.18) 55%, transparent 75%)'
            : 'radial-gradient(circle, rgba(6, 182, 212, 0.14) 0%, rgba(8, 51, 68, 0.08) 55%, transparent 75%)',
          filter: 'blur(36px)',
        }}
      />

      {/* Indian Miniature Painting Inspired Swirling Wind Ribbons & Stylized Cloud Spirals */}
      <svg
        viewBox="0 0 320 180"
        className="absolute inset-0 w-full h-full text-[#06B6D4] pointer-events-none overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="vayuStreamGrad1" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#0891B2" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0E7490" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="vayuStreamGrad2" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.65" />
            <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#164E63" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Layer 1: Flowing Primary Wind Stream Wave */}
        <path
          d="M340 40 C280 20 220 70 170 50 C120 30 70 80 -10 65"
          fill="none"
          stroke="url(#vayuStreamGrad1)"
          strokeWidth="2"
          strokeDasharray="60 40"
          className="animate-vayu-stream"
          opacity={isSelected ? 0.95 : 0.65}
        />

        {/* Layer 2: Meandering Midground Stream with Flowing Offset */}
        <path
          d="M340 95 C270 125 210 65 150 105 C90 145 40 85 -10 115"
          fill="none"
          stroke="url(#vayuStreamGrad2)"
          strokeWidth="1.6"
          strokeDasharray="80 50"
          style={{ animationDuration: '9s' }}
          className="animate-vayu-stream"
          opacity={isSelected ? 0.85 : 0.5}
        />

        {/* Layer 3: Lower Swift Breeze Current */}
        <path
          d="M340 145 C260 115 190 160 130 135 C70 110 30 150 -10 145"
          fill="none"
          stroke="url(#vayuStreamGrad1)"
          strokeWidth="1.4"
          strokeDasharray="50 35"
          style={{ animationDuration: '6s' }}
          className="animate-vayu-stream"
          opacity={isSelected ? 0.75 : 0.4}
        />

        {/* Traditional Indian Miniature Cloud Swirls on the Flank */}
        <g
          className="animate-vayu-float"
          transform="translate(240, 25)"
          opacity={isSelected ? 0.45 : 0.22}
        >
          {/* Ornate cloud swirl 1 */}
          <path
            d="M0 25 C12 10 32 10 40 22 C48 34 38 48 24 45 C15 43 14 32 24 28 C30 26 34 30 32 34"
            fill="none"
            stroke="#22D3EE"
            strokeWidth="1.2"
          />
          <path
            d="M35 15 C45 6 60 8 66 18 C72 28 64 38 52 36"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="0.9"
            strokeDasharray="3 2"
          />
        </g>

        <g
          className="animate-vayu-float"
          style={{ animationDuration: '5.5s', animationDelay: '-2s' }}
          transform="translate(250, 100)"
          opacity={isSelected ? 0.4 : 0.2}
        >
          {/* Ornate cloud swirl 2 */}
          <path
            d="M5 20 C18 8 36 12 42 24 C48 36 34 46 22 42 C12 38 16 26 26 24 C32 23 35 27 34 31"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="1.1"
          />
        </g>
      </svg>

      {/* HTML5 Canvas Streaming Wind Motes */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
    </div>
  );
};
