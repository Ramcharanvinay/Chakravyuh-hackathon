import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { ChakravyuhWheel3D } from '../ChakravyuhWheel3D';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const scrollToTracks = () => {
    document.querySelector('#tracks')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectTrack3D = (trackId: string) => {
    const slugMap: Record<string, string> = {
      'track-cybersecurity-blockchain': 'cybersecurity-blockchain',
      'track-space-technology': 'space-technology',
      'track-quantum-computing': 'quantum-computing',
      'track-fintech': 'fintech',
      'track-energy-sustainability': 'energy-sustainability',
    };
    const slug = slugMap[trackId] || 'cybersecurity-blockchain';
    navigate(`/theme/${slug}`);
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#070709] pt-24 pb-16 lg:py-0"
    >
      <div className="relative z-10 w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[calc(100vh-6rem)] py-8">

          {/* ── Left Column: Editorial Presentation ── */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">

            {/* Stage / Institution Tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-white/[0.1] bg-white/[0.03] text-xs font-mono tracking-[0.2em] uppercase text-zinc-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="font-semibold text-white">CHAKRAVYUH 2026</span>
              <span className="text-zinc-600">//</span>
              <span className="text-zinc-400">VIT-AP UNIVERSITY</span>
            </motion.div>

            {/* Mammoth Editorial Title (Crisp, High-Contrast Titanium White) */}
            <div className="space-y-2 max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-cinzel font-black text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.5rem] leading-[0.98] tracking-tight text-white"
              >
                <span className="block text-zinc-400 font-bold text-2xl sm:text-3xl md:text-4xl tracking-[0.2em] mb-2 uppercase">
                  ENTER THE
                </span>
                <span className="block text-white">
                  CHAKRAVYUH
                </span>
              </motion.h1>
            </div>

            {/* Narrative Brief */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-normal"
            >
              India's premier 48-hour national hackathon hosted at VIT-AP University and powered by Unstop.
              Fifty problem statements. Five specialized battle tracks. Breach the concentric rings of code.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto"
            >
              {/* Primary Action Button: Stark White High-Contrast */}
              <button
                onClick={() => navigate('/tracks')}
                className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-black font-mono font-bold text-xs sm:text-sm tracking-[0.18em] uppercase hover:bg-zinc-200 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>ENTER THE ARENA</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary Action Button: Hairline Architectural Glass */}
              <button
                onClick={scrollToTracks}
                className="group w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl border border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/30 text-white font-mono font-semibold text-xs sm:text-sm tracking-[0.18em] uppercase transition-all cursor-pointer"
              >
                <span>EXPLORE TRACKS</span>
                <ArrowDown className="w-4 h-4 text-zinc-400 group-hover:text-white group-hover:translate-y-0.5 transition-all" />
              </button>
            </motion.div>

            {/* Strategic Metadata Modules */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-white/[0.08] w-full max-w-2xl text-left"
            >
              {[
                { val: '₹7,00,000', label: 'PRIZE POOL' },
                { val: '50',       label: 'CHALLENGES' },
                { val: '05',       label: 'BATTLE TRACKS' },
                { val: '48 HRS',   label: 'ARENA SPRINT' },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="font-cinzel font-black text-xl sm:text-2xl lg:text-3xl text-white">
                    {item.val}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.2em] text-zinc-500 uppercase font-medium">
                    {item.label}
                  </div>
                </div>
              ))}
            </motion.div>

          </div>

          {/* ── Right Column: Precision Physical 3D Grand Chakravyuh Artifact ── */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center w-full">
            <div className="w-full max-w-[620px]">
              <ChakravyuhWheel3D
                viewMode="chakravyuh"
                onSelectTrack={handleSelectTrack3D}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Subtle Bottom Scroll Marker */}
      <button
        onClick={scrollToTracks}
        className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors focus:outline-none cursor-pointer"
        aria-label="Scroll to exploration"
      >
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase">SCROLL</span>
        <div className="w-px h-6 bg-gradient-to-b from-white/30 to-transparent" />
      </button>
    </section>
  );
};

export default HeroSection;
