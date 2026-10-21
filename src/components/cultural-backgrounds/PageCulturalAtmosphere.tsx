import React, { useEffect, useRef } from 'react';

interface PageAtmosphereProps {
  selectedTrackId: string;
}

interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  phase: number;
  color: string;
}

export const PageCulturalAtmosphere: React.FC<PageAtmosphereProps> = ({ selectedTrackId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 18 : 35;
    const particles: AmbientParticle[] = [];

    const getTrackParticleColor = (trackId: string) => {
      switch (trackId) {
        case 'track-agni':
        case 'track-cybersecurity-blockchain':
          return Math.random() > 0.4 ? '#FF7A59' : '#FBBF24'; // Flame copper & golden saffron
        case 'track-vajra':
        case 'track-quantum-computing':
          return Math.random() > 0.4 ? '#60A5FA' : '#93C5FD'; // Electric blue & lightning white
        case 'track-vayu':
        case 'track-space-technology':
          return Math.random() > 0.4 ? '#22D3EE' : '#E2E8F0'; // Cyan wind & silver
        case 'track-vanam':
        case 'track-energy-sustainability':
          return Math.random() > 0.4 ? '#34D399' : '#FDE68A'; // Jade leaf & golden firefly
        case 'track-surya':
        case 'track-fintech':
          return Math.random() > 0.4 ? '#FBBF24' : '#F59E0B'; // Solar gold & temple amber
        default:
          return '#D8B46A';
      }
    };

    const spawnParticle = (): AmbientParticle => {
      const color = getTrackParticleColor(selectedTrackId);
      // Movement behavior differs by track
      let vx = (Math.random() - 0.5) * 0.5;
      let vy = - (Math.random() * 0.6 + 0.2); // Default upward drift

      if (selectedTrackId === 'track-vayu') {
        vx = - (Math.random() * 1.5 + 0.8); // Horizontal wind flow
        vy = (Math.random() - 0.5) * 0.4;
      } else if (selectedTrackId === 'track-vanam') {
        vy = Math.random() * 0.6 + 0.2; // Falling forest drift
        vx = (Math.random() - 0.4) * 0.5;
      }

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx,
        vy,
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.4 + 0.2,
        baseAlpha: Math.random() * 0.35 + 0.15,
        phase: Math.random() * Math.PI * 2,
        color,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(spawnParticle());
    }

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.025;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(time + p.phase) * 0.25;
        p.y += p.vy;

        // Wrap boundaries
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.baseAlpha + Math.sin(time * 1.5 + p.phase) * 0.15;

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.05, currentAlpha);
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
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
  }, [selectedTrackId]);

  // Color atmospheres based on active track
  const getAtmosphereConfig = (trackId: string) => {
    switch (trackId) {
      case 'track-agni':
        return {
          baseBg: '#09080A',
          gradient1: 'rgba(234, 101, 78, 0.18)',
          gradient2: 'rgba(249, 115, 22, 0.10)',
          borderColor: '#EA654E',
        };
      case 'track-vajra':
        return {
          baseBg: '#060811',
          gradient1: 'rgba(59, 130, 246, 0.18)',
          gradient2: 'rgba(30, 58, 138, 0.14)',
          borderColor: '#3B82F6',
        };
      case 'track-vayu':
        return {
          baseBg: '#05090F',
          gradient1: 'rgba(6, 182, 212, 0.18)',
          gradient2: 'rgba(8, 51, 68, 0.16)',
          borderColor: '#06B6D4',
        };
      case 'track-vanam':
        return {
          baseBg: '#040B08',
          gradient1: 'rgba(16, 185, 129, 0.16)',
          gradient2: 'rgba(6, 78, 59, 0.14)',
          borderColor: '#10B981',
        };
      case 'track-surya':
        return {
          baseBg: '#0A0806',
          gradient1: 'rgba(216, 180, 106, 0.20)',
          gradient2: 'rgba(180, 83, 9, 0.12)',
          borderColor: '#D8B46A',
        };
      default:
        return {
          baseBg: '#08090D',
          gradient1: 'rgba(216, 180, 106, 0.15)',
          gradient2: 'rgba(216, 180, 106, 0.05)',
          borderColor: '#D8B46A',
        };
    }
  };

  const config = getAtmosphereConfig(selectedTrackId);

  return (
    <div
      className="fixed inset-0 pointer-events-none transition-colors duration-1000 ease-in-out z-0"
      style={{ backgroundColor: config.baseBg }}
    >
      {/* Dynamic Top Atmospheric Radial Glow */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          background: `
            radial-gradient(ellipse 90% 55% at 50% -10%, ${config.gradient1} 0%, transparent 70%),
            radial-gradient(ellipse 75% 45% at 15% 90%, ${config.gradient2} 0%, transparent 65%),
            radial-gradient(ellipse 65% 45% at 85% 85%, ${config.gradient1} 0%, transparent 65%)
          `,
        }}
      />

      {/* Atmospheric War Grid overlay with subtle responsive tint */}
      <div className="absolute inset-0 bg-war-grid opacity-60" />

      {/* Live Canvas Ambient Particles (Embers / Electric sparks / Wind motes / Spores / Sun dust) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
};
