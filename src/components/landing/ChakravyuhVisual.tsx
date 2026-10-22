import React, { useEffect, useRef } from 'react';

export const ChakravyuhVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let t = 0;

    // Concentric Chakravyuh formation rings (antique gold & bronze)
    const rings = [
      { r: 230, speed: 0.0002,  dash: [14, 10], color: 'rgba(128, 102, 56, 0.35)', w: 1 },
      { r: 200, speed: -0.0003, dash: [],       color: 'rgba(198, 161, 91, 0.45)', w: 1.5 },
      { r: 170, speed: 0.0004,  dash: [18, 8, 4, 8], color: 'rgba(128, 102, 56, 0.4)', w: 1.2 },
      { r: 140, speed: -0.0005, dash: [8, 8],   color: 'rgba(198, 161, 91, 0.6)',  w: 1.5 },
      { r: 110, speed: 0.0007,  dash: [],       color: 'rgba(224, 188, 112, 0.55)', w: 1.8 },
      { r: 80,  speed: -0.0009, dash: [10, 6],  color: 'rgba(198, 161, 91, 0.7)',  w: 2 },
      { r: 50,  speed: 0.0012,  dash: [],       color: 'rgba(224, 188, 112, 0.85)', w: 2 },
      { r: 24,  speed: -0.0018, dash: [4, 4],   color: 'rgba(240, 230, 209, 0.9)',  w: 2.2 },
    ];

    // Gold beacon trails traversing the corridors
    const trails = [
      { r: 200, angle: 0,            speed: 0.006,  color: '#C6A15B' },
      { r: 140, angle: Math.PI * 0.8, speed: -0.008, color: '#E0BC70' },
      { r: 80,  angle: Math.PI * 1.5, speed: 0.012,  color: '#F0E6D1' },
    ];

    // Subtle atmospheric warm gold particles
    const particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; r: number }[] = [];
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const rad   = 15 + Math.random() * 225;
      particles.push({
        x: Math.cos(angle) * rad,
        y: Math.sin(angle) * rad,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        life: Math.random() * 200,
        maxLife: 140 + Math.random() * 120,
        r: 0.8 + Math.random() * 1.4,
      });
    }

    const cx = canvas.width  / 2;
    const cy = canvas.height / 2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep restrained radial gold lighting
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 240);
      grad.addColorStop(0,   'rgba(198, 161, 91, 0.08)');
      grad.addColorStop(0.4, 'rgba(128, 102, 56, 0.03)');
      grad.addColorStop(1,   'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Concentric rings
      rings.forEach((ring) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(t * ring.speed * 1000);
        ctx.beginPath();
        ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
        if (ring.dash.length) ctx.setLineDash(ring.dash);
        else ctx.setLineDash([]);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = ring.w;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(198, 161, 91, 0.25)';
        ctx.stroke();
        ctx.restore();
      });

      // Sacred radial gateway axes (8 directional corridors)
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i + t * 0.00015;
        ctx.save();
        ctx.translate(cx, cy);
        const lineGrad = ctx.createLinearGradient(0, 0, Math.cos(angle) * 230, Math.sin(angle) * 230);
        lineGrad.addColorStop(0,   'rgba(224, 188, 112, 0.6)');
        lineGrad.addColorStop(0.4, 'rgba(198, 161, 91, 0.25)');
        lineGrad.addColorStop(1,   'transparent');
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 25, Math.sin(angle) * 25);
        ctx.lineTo(Math.cos(angle) * 230, Math.sin(angle) * 230);
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();
      }

      // Ancient labyrinth spiral curve (The true Chakravyuh spiral)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * -0.0002);
      ctx.beginPath();
      const spiralTurns = 3.5;
      const maxSpiralR = 210;
      for (let a = 0; a < Math.PI * 2 * spiralTurns; a += 0.05) {
        const r = (a / (Math.PI * 2 * spiralTurns)) * maxSpiralR + 15;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(198, 161, 91, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.restore();

      // Golden light trails
      trails.forEach(trail => {
        trail.angle += trail.speed * 0.016;
        const tx = cx + Math.cos(trail.angle) * trail.r;
        const ty = cy + Math.sin(trail.angle) * trail.r;

        const trailGrad = ctx.createRadialGradient(tx, ty, 0, tx, ty, 14);
        trailGrad.addColorStop(0,   trail.color + 'B3');
        trailGrad.addColorStop(1,   'transparent');
        ctx.beginPath();
        ctx.arc(tx, ty, 14, 0, Math.PI * 2);
        ctx.fillStyle = trailGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(tx, ty, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowBlur = 12;
        ctx.shadowColor = trail.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Sacred central sanctum
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 26);
      coreGrad.addColorStop(0,   'rgba(240, 230, 209, 0.95)');
      coreGrad.addColorStop(0.3, 'rgba(224, 188, 112, 0.7)');
      coreGrad.addColorStop(0.7, 'rgba(198, 161, 91, 0.3)');
      coreGrad.addColorStop(1,   'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.shadowBlur = 24;
      ctx.shadowColor = '#C6A15B';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Golden center eye
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#F0E6D1';
      ctx.fill();

      // Atmospheric gold dust particles
      particles.forEach(p => {
        p.life += 1;
        if (p.life > p.maxLife) {
          const angle = Math.random() * Math.PI * 2;
          const rad   = 15 + Math.random() * 220;
          p.x = Math.cos(angle) * rad;
          p.y = Math.sin(angle) * rad;
          p.life = 0;
          p.maxLife = 140 + Math.random() * 120;
        }
        const alpha = Math.sin((p.life / p.maxLife) * Math.PI);
        ctx.beginPath();
        ctx.arc(cx + p.x + Math.sin(t * 0.001 + p.life) * 2, cy + p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 188, 112, ${alpha * 0.65})`;
        ctx.fill();
      });

      t++;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Decorative antique gold corner bracket accents */}
      <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-[#806638]/40" />
      <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-[#806638]/40" />
      <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-[#806638]/40" />
      <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-[#806638]/40" />

      <canvas
        ref={canvasRef}
        width={520}
        height={520}
        className="w-full h-full max-w-[480px] max-h-[480px]"
        aria-hidden="true"
      />
    </div>
  );
};

export default ChakravyuhVisual;
