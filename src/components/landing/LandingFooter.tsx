import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, ChevronRight } from 'lucide-react';

const navLinks = [
  { label: 'Overview', href: '#hero' },
  { label: 'Protocol', href: '#protocol' },
  { label: 'Tracks', href: '#tracks' },
  { label: 'Prizes', href: '#prizes' },
  { label: 'Partners', href: '#partners' },
  { label: 'Rules', href: '#rules' },
  { label: 'Venue', href: '#venue' },
];

export const LandingFooter: React.FC = () => {
  const navigate = useNavigate();

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#060709] border-t border-white/[0.08] pt-20 pb-12 overflow-hidden">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none bg-tactical-grid opacity-20" />

      <div className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Top Pre-Footer Call to Arms Banner */}
        <div className="rounded-3xl border border-white/[0.1] bg-[#12141C] p-8 sm:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#FF3B30] uppercase font-semibold">
              READY FOR DEPLOYMENT?
            </span>
            <h3 className="font-cinzel font-black text-2xl sm:text-3xl text-white">
              BREACH THE FORMATION. CLAIM YOUR PLACE.
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-lg">
              Registration is open to university students across India. Fifty challenges await.
            </p>
          </div>

          <button
            onClick={() => navigate('/tracks')}
            className="flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white text-[#08090C] font-mono font-bold text-xs uppercase tracking-[0.18em] hover:bg-zinc-200 active:scale-[0.98] transition-all shrink-0 shadow-[0_4px_25px_rgba(255,255,255,0.15)] cursor-pointer"
          >
            <span>ENTER THE ARENA</span>
            <ChevronRight className="w-4 h-4 text-[#08090C]" />
          </button>
        </div>

        {/* Footer Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/[0.08]">

          {/* Brand Column (Col 1-5) */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="font-cinzel font-black text-2xl sm:text-3xl tracking-[0.14em] text-white">
                CHAKRAVYUH
              </span>
              <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mt-1">
                NATIONAL TECHNOLOGY CRUCIBLE // EDITION 2026
              </p>
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md font-normal">
              A premier 48-hour national hackathon hosted at VIT-AP University and powered by Unstop.
              Fifty problem statements. Five specialized battle gates. Designed for builders.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="px-3.5 py-2 rounded-xl bg-[#12141C] border border-white/[0.08]">
                <img
                  src="/vit-ap-logo.png"
                  alt="VIT-AP University"
                  className="h-6 w-auto object-contain filter brightness-0 invert opacity-80"
                />
              </div>

              <div className="px-3.5 py-2 rounded-xl bg-[#12141C] border border-white/[0.08]">
                <img
                  src="/unstop-logo-transparent.png"
                  alt="Unstop"
                  className="h-4 w-auto object-contain opacity-80"
                />
              </div>
            </div>
          </div>

          {/* Quick Index (Col 6-8) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-mono text-xs font-bold tracking-[0.22em] text-white uppercase">
              ARENA INDEX
            </h4>
            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="text-left font-mono text-xs text-zinc-400 hover:text-white transition-colors focus:outline-none w-fit"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tracks Quicklinks (Col 9-12) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-mono text-xs font-bold tracking-[0.22em] text-white uppercase">
              BATTLE GATES
            </h4>
            <div className="space-y-2 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF453A]" />
                <span>GATE 01 — CYBERSECURITY & BLOCKCHAIN</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                <span>GATE 02 — SPACE TECHNOLOGY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                <span>GATE 03 — QUANTUM COMPUTING</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                <span>GATE 04 — INTELLIGENT FINTECH</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>GATE 05 — ENERGY & SUSTAINABILITY</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 font-mono text-[11px] tracking-wider">
          <div>
            © 2026 CHAKRAVYUH HACKATHON. HOSTED AT VIT-AP UNIVERSITY. POWERED BY UNSTOP.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
          >
            <span>BACK TO APEX</span>
            <div className="w-7 h-7 rounded-lg bg-[#12141C] border border-white/[0.08] flex items-center justify-center">
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
};

export default LandingFooter;
