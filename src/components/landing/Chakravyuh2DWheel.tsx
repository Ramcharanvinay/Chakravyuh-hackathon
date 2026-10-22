import React from 'react';
import { motion } from 'framer-motion';

export const Chakravyuh2DWheel: React.FC = () => {
  return (
    <div className="relative w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[500px] xl:max-w-[530px] aspect-square flex items-center justify-center select-none group">
      
      {/* ── Soft Ambient Radial Backlight (Clean, smooth aura without harsh spots) ── */}
      <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-[#C6A15B]/10 via-[#E0BC70]/10 to-transparent blur-3xl pointer-events-none" />

      {/* ── Main 2D Chakravyuh Wheel from Git Repo (Smooth Continuous Rotation) ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 80, ease: 'linear' }}
        whileHover={{ scale: 1.02 }}
        className="relative z-10 w-full h-full flex items-center justify-center cursor-pointer transition-transform duration-500 drop-shadow-[0_0_35px_rgba(198,161,91,0.22)] group-hover:drop-shadow-[0_0_50px_rgba(224,188,112,0.4)]"
      >
        <img
          src="/chakravyuh.svg"
          alt="Chakravyuh 2D Formation Wheel"
          className="w-full h-full object-contain filter contrast-[1.10] brightness-[1.04]"
          draggable={false}
        />
      </motion.div>
    </div>
  );
};

export default Chakravyuh2DWheel;

