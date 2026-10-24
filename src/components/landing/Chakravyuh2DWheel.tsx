import React from 'react';
import { motion } from 'framer-motion';

export const Chakravyuh2DWheel: React.FC = () => {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px] xl:max-w-[540px] aspect-square flex items-center justify-center select-none group">
      
      {/* ── Outer Tactical Telemetry Ring (Hairline Precision, Zero Glow) ── */}
      <div className="absolute inset-0 rounded-full border border-white/[0.08] pointer-events-none" />
      
      {/* Second dashed concentric guide ring */}
      <div className="absolute inset-[6%] rounded-full border border-dashed border-white/[0.06] pointer-events-none" />

      {/* Coordinate Crosshairs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />
      </div>

      {/* Degree Markers on Cardinal Angles */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
        000° N
      </div>
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
        180° S
      </div>
      <div className="absolute right-1 top-1/2 -translate-y-1/2 font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
        090° E
      </div>
      <div className="absolute left-1 top-1/2 -translate-y-1/2 font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
        270° W
      </div>

      {/* Counter-rotating Outer Telemetry Ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 160, ease: 'linear' }}
        className="absolute inset-[3%] pointer-events-none"
      >
        <svg viewBox="0 0 500 500" className="w-full h-full text-zinc-600/40">
          <circle cx="250" cy="250" r="236" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 24" />
          <circle cx="250" cy="250" r="226" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 8" />
        </svg>
      </motion.div>

      {/* ── Main 2D Chakravyuh Wheel with Smooth Rotation ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 90, ease: 'linear' }}
        whileHover={{ scale: 1.02 }}
        className="relative z-10 w-[84%] h-[84%] flex items-center justify-center cursor-pointer transition-transform duration-500"
      >
        <img
          src="/chakravyuh.svg"
          alt="Chakravyuh Tactical Formation Blueprint"
          className="w-full h-full object-contain filter contrast-[1.12] brightness-[1.08] drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
          draggable={false}
        />
      </motion.div>

      {/* Center Tactical Reticle Dot */}
      <div className="absolute z-20 w-3 h-3 rounded-full bg-[#08090C] border border-white/40 flex items-center justify-center pointer-events-none">
        <div className="w-1 h-1 rounded-full bg-[#FF3B30]" />
      </div>
    </div>
  );
};

export default Chakravyuh2DWheel;
