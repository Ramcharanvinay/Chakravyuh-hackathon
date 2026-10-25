import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { HACKATHON_CONFIG } from '../../config/hackathonConfig';

const navLinks = [
  { label: 'Overview', href: '#hero' },
  { label: 'Protocol', href: '#protocol' },
  { label: 'Tracks', href: '#tracks' },
  { label: 'Prizes', href: '#prizes' },
  { label: 'Partners', href: '#partners' },
  { label: 'Rules', href: '#rules' },
  { label: 'Venue', href: '#venue' },
];

export const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#08090C]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.8)]'
            : 'bg-[#08090C]/60 backdrop-blur-md border-b border-white/[0.04]'
        }`}
      >
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-20 gap-4">

            {/* Left: Monolith Logo & Institutional Co-Branding */}
            <button
              onClick={() => scrollTo('#hero')}
              className="flex items-center gap-3.5 text-left focus:outline-none rounded-lg group shrink-0 cursor-pointer"
              aria-label="Chakravyuh home"
            >
              {/* Ancient Luxury Wheel Emblem */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center">
                <img
                  src="/chakravyuh-luxury-wheel.svg"
                  alt="Chakravyuh Emblem"
                  className="w-full h-full object-contain animate-spin-wheel drop-shadow-[0_0_12px_rgba(216,180,106,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(216,180,106,0.8)] transition-all duration-300"
                />
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-cinzel font-black text-base sm:text-2xl tracking-[0.12em] sm:tracking-[0.14em] text-white group-hover:text-zinc-200 transition-colors leading-none">
                  CHAKRAVYUH
                </span>
                
                <span className="text-zinc-600 hidden md:inline text-sm font-light">/</span>

                <div className="hidden md:flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#12141C] border border-white/[0.08] shrink-0">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-zinc-400 uppercase font-semibold">
                    POWERED BY
                  </span>
                  <img
                    src="/unstop-logo-transparent.png"
                    alt="Unstop"
                    className="h-3.5 w-auto object-contain block opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </button>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12141C]/80 border border-white/[0.08]">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all focus:outline-none"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right: Enter Arena CTA + optional choice form + Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3.5">
              {HACKATHON_CONFIG.choiceFormUrl && (
                <a
                  href={HACKATHON_CONFIG.choiceFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/[0.12] bg-[#12141C] text-zinc-300 hover:text-white hover:bg-white/[0.06] font-mono text-xs uppercase tracking-wider font-semibold transition-all"
                >
                  <span>SUBMIT YOUR CHOICE</span>
                </a>
              )}

              <button
                onClick={() => navigate('/tracks')}
                className="inline-flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-full bg-white text-[#08090C] font-mono text-[11px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.16em] font-bold hover:bg-zinc-200 active:scale-[0.98] transition-all focus:outline-none shadow-[0_4px_20px_rgba(255,255,255,0.12)] cursor-pointer"
              >
                <span>ENTER ARENA</span>
                <ChevronRight className="hidden sm:block w-3.5 h-3.5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="xl:hidden p-2.5 rounded-xl bg-[#12141C] border border-white/[0.12] text-zinc-300 hover:text-white focus:outline-none transition-colors cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#08090C]/95 backdrop-blur-2xl flex flex-col justify-between pt-24 pb-8 px-6 xl:hidden overflow-y-auto animate-in fade-in duration-200">
          <div className="flex flex-col gap-3 max-w-md mx-auto w-full pt-4">
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500 mb-2">
              NAVIGATION INDEX
            </div>
            {navLinks.map((link, idx) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="flex items-center justify-between py-3 px-4 rounded-xl border border-white/[0.06] bg-[#12141C]/60 hover:bg-[#12141C] hover:border-white/20 text-left transition-all"
              >
                <span className="font-cinzel text-lg font-bold text-white tracking-wider">
                  {link.label}
                </span>
                <span className="font-mono text-xs text-zinc-500">0{idx + 1}</span>
              </button>
            ))}

            <div className="pt-4 space-y-2.5">
              {HACKATHON_CONFIG.choiceFormUrl && (
                <a
                  href={HACKATHON_CONFIG.choiceFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/[0.15] bg-[#12141C] text-white font-mono text-xs uppercase tracking-[0.18em] font-bold"
                >
                  <span>SUBMIT YOUR CHOICE</span>
                </a>
              )}

              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate('/tracks');
                }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white text-[#08090C] font-mono text-xs uppercase tracking-[0.2em] font-bold shadow-lg"
              >
                <span>ENTER ARENA</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Footer Telemetry */}
          <div className="max-w-md mx-auto w-full pt-8 border-t border-white/[0.08] flex items-center justify-between text-zinc-500 font-mono text-[10px] tracking-wider">
            <span>VIT-AP UNIVERSITY</span>
            <span>POWERED BY UNSTOP</span>
          </div>
        </div>
      )}
    </>
  );
};

export default LandingNavbar;
