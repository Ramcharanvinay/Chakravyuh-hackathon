import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Chakravyuh2DWheel } from './Chakravyuh2DWheel';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const scrollToNext = () => {
    document.querySelector('#prizes')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#08090B]"
    >
      {/* Background Atmosphere: Sacred battlefield with subtle obsidian grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-ancient-grid opacity-50" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 sm:pt-36 sm:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">

          {/* ── Left Column: Editorial & Calls to Action ── */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">

            {/* Top Group: Pill Badge + Main Heading */}
            <div className="space-y-4 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#C6A15B]/30 bg-[#121318]/90 text-[#E0BC70] text-xs sm:text-sm font-sans font-semibold tracking-[0.22em] shadow-[0_0_15px_rgba(198,161,91,0.15)] hover:border-[#C6A15B]/60 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>VIT-AP UNIVERSITY PRESENTS</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-cinzel font-black text-5xl sm:text-6xl lg:text-[4rem] xl:text-[4.6rem] leading-[1.04] tracking-tight"
              >
                <span className="block text-[#F0E6D1] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                  ENTER THE
                </span>
                <span className="block bg-gradient-to-r from-[#FFFBF2] via-[#E2BF74] to-[#C6A15B] bg-clip-text text-transparent drop-shadow-[0_6px_25px_rgba(198,161,91,0.35)]">
                  CHAKRAVYUH
                </span>
              </motion.h1>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto"
            >
              {/* Primary: Antique Gold with Dark Text */}
              <button
                onClick={() => navigate('/tracks')}
                className="group flex items-center justify-center gap-3 px-9 py-4 rounded-xl bg-gradient-to-r from-[#D8B46A] via-[#E5C37A] to-[#C6A15B] hover:brightness-110 active:scale-[0.98] text-[#08090B] font-cinzel font-black text-xs sm:text-sm tracking-[0.16em] transition-all shadow-[0_0_25px_rgba(198,161,91,0.35)] hover:shadow-[0_0_35px_rgba(224,188,112,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BC70] cursor-pointer"
              >
                <span>ENTER THE ARENA</span>
                <ChevronRight className="w-4 h-4 text-[#08090B] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary: Dark Surface with Thin Bronze Border */}
              <button
                onClick={scrollToNext}
                className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl border border-[#806638]/60 bg-[#121318]/90 text-[#F0E6D1] font-cinzel font-bold text-xs sm:text-sm tracking-[0.16em] hover:border-[#C6A15B] hover:text-[#E0BC70] hover:bg-[#171820] transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A15B] shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                <span>EXPLORE THE ARENA</span>
                <ArrowDown className="w-4 h-4 text-[#C6A15B] group-hover:translate-y-1 transition-transform" />
              </button>
            </motion.div>

            {/* Quick Metrics / Formation Metadata */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-6 sm:gap-8 pt-7 border-t border-[#806638]/40 w-full max-w-lg"
            >
              {[
                { val: '₹7,00,000', label: 'WORTH PRIZE POOL' },
                { val: '50',       label: 'CHALLENGES' },
              ].map((s, idx) => (
                <React.Fragment key={s.label}>
                  {idx > 0 && <div className="h-10 w-px bg-[#806638]/30" />}
                  <div className="text-center sm:text-left">
                    <div className="font-cinzel font-black text-2xl sm:text-3xl lg:text-4xl text-[#F0E6D1] drop-shadow-[0_2px_10px_rgba(198,161,91,0.2)]">
                      {s.val}
                    </div>
                    <div className="text-[11px] text-[#898174] font-sans font-semibold tracking-[0.18em] uppercase mt-1">
                      {s.label}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </motion.div>
          </div>

          {/* ── Right Column: Chakravyuh Sacred 2D Formation Wheel (No Overlap) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 xl:col-span-5 relative flex items-center justify-center"
          >
            <Chakravyuh2DWheel />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#898174] hover:text-[#C6A15B] transition-colors focus:outline-none"
        aria-label="Scroll to prize pool section"
      >
        <span className="text-[10px] tracking-[0.25em] font-sans font-medium uppercase">SCROLL</span>
        <div className="w-px h-7 bg-gradient-to-b from-[#C6A15B]/50 to-transparent" />
      </button>
    </section>
  );
};

export default HeroSection;
