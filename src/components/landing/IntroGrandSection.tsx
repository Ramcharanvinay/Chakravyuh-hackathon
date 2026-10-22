import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const IntroGrandSection: React.FC = () => {
  const handleScrollDown = () => {
    const heroEl = document.querySelector('#hero');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="intro"
      className="relative min-h-screen w-full h-screen bg-[#08090B] text-[#C7BDA9] flex flex-col justify-between items-center px-4 py-8 overflow-hidden select-none"
    >
      {/* ── Background Atmospheric Effects & Ancient Formation Rings ── */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Deep Golden Ambient Core Glow */}
        <div className="absolute w-[800px] h-[800px] rounded-full bg-[#C6A15B]/[0.06] blur-[160px]" />
        <div className="absolute w-[450px] h-[450px] rounded-full bg-[#E0BC70]/[0.08] blur-[100px]" />

        {/* Huge Concentric Battle Formation Rings */}
        <div className="w-[1250px] h-[1250px] opacity-[0.14] animate-spin-slow">
          <svg viewBox="-600 -600 1200 1200" className="w-full h-full text-[#C6A15B]">
            {/* Outer rings */}
            <circle cx="0" cy="0" r="540" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="24 16" />
            <circle cx="0" cy="0" r="470" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="160 15 50 15" />
            <circle cx="0" cy="0" r="390" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="0" cy="0" r="310" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="100 20 30 20" />
            <circle cx="0" cy="0" r="230" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="40 15" />
            <circle cx="0" cy="0" r="150" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="0" cy="0" r="80" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="12 8" />

            {/* Battle formation crosshairs & diagonals */}
            <line x1="-580" y1="0" x2="580" y2="0" stroke="currentColor" strokeWidth="0.8" strokeDasharray="16 10" />
            <line x1="0" y1="-580" x2="0" y2="580" stroke="currentColor" strokeWidth="0.8" strokeDasharray="16 10" />
            <line x1="-420" y1="-420" x2="420" y2="420" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 16" opacity="0.6" />
            <line x1="420" y1="-420" x2="-420" y2="420" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 16" opacity="0.6" />
          </svg>
        </div>

        {/* Ambient Top & Bottom Vignettes */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#08090B]/60 to-[#08090B]" />
      </div>

      {/* ── Top Header Spacer / Eyebrow ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 pt-20 sm:pt-24 flex items-center gap-3 text-center"
      >
        <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#806638]" />
        <span className="font-sans text-[11px] sm:text-xs tracking-[0.28em] uppercase font-semibold text-[#C6A15B]">
          VIT-AP UNIVERSITY PRESENTS
        </span>
        <div className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#806638]" />
      </motion.div>

      {/* ── Centerpiece: Massive CHAKRAVYUH Title & Powered by Unstop ── */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center w-full max-w-7xl px-4 sm:px-6">
        {/* Massive CHAKRAVYUH Title (Sized with generous safety margins so it never clips) */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-cinzel font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.4rem] tracking-[0.03em] sm:tracking-[0.05em] leading-none select-none max-w-full text-center"
        >
          <span className="inline-block bg-gradient-to-b from-[#FFFBF2] via-[#E2BF74] to-[#8C6D32] bg-clip-text text-transparent drop-shadow-[0_15px_45px_rgba(198,161,91,0.35)]">
            CHAKRAVYUH
          </span>
        </motion.h1>

        {/* Just Below Title: Powered by & Logo (Seamless Integrated Royal Pill) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
          className="mt-8 sm:mt-12 inline-flex items-center gap-4 sm:gap-5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#121318]/90 border border-[#806638]/50 hover:border-[#C6A15B] backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_0_30px_rgba(198,161,91,0.25)] transition-all group"
        >
          <span className="font-sans text-xs sm:text-sm md:text-base tracking-[0.28em] uppercase font-bold text-[#C6A15B]">
            POWERED BY
          </span>
          <div className="h-5 sm:h-6 w-px bg-gradient-to-b from-transparent via-[#806638] to-transparent" />
          <img
            src="/unstop-logo-transparent.png"
            alt="Unstop"
            className="h-7 sm:h-8 md:h-9 w-auto object-contain block drop-shadow-[0_2px_12px_rgba(255,255,255,0.18)] group-hover:scale-105 transition-transform"
          />
        </motion.div>

      </div>

      {/* ── Bottom: Scroll Indicator to Enter Normal Page ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-10 pb-6 flex flex-col items-center"
      >
        <button
          onClick={handleScrollDown}
          className="flex flex-col items-center gap-2 group cursor-pointer text-[#898174] hover:text-[#E0BC70] transition-colors focus:outline-none"
          aria-label="Scroll to enter the arena"
        >
          <span className="font-sans text-[10px] sm:text-xs tracking-[0.25em] uppercase font-medium text-[#898174] group-hover:text-[#C6A15B] transition-colors">
            SCROLL TO ENTER
          </span>
          <div className="w-6 h-10 rounded-full border border-[#806638]/60 group-hover:border-[#C6A15B] flex items-start justify-center p-1.5 transition-colors">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="w-1.5 h-2.5 rounded-full bg-[#C6A15B] shadow-[0_0_8px_rgba(198,161,91,0.8)]"
            />
          </div>
          <ChevronDown className="w-4 h-4 text-[#C6A15B] group-hover:translate-y-1 transition-transform" />
        </button>
      </motion.div>
    </section>
  );
};

export default IntroGrandSection;
