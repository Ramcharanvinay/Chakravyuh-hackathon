import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Home } from 'lucide-react';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';

export const Navbar: React.FC = () => {
  const formUrl = HACKATHON_CONFIG.choiceFormUrl;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#08090C]/90 backdrop-blur-xl">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Brand & College Title */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="relative w-10 h-10 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
            <img
              src="/chakravyuh-luxury-wheel.svg"
              alt="Chakravyuh Emblem"
              className="w-full h-full object-contain animate-spin-wheel drop-shadow-[0_0_12px_rgba(216,180,106,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(216,180,106,0.8)] transition-all duration-300"
            />
          </div>

          <div className="flex flex-col">
            <span className="font-cinzel text-lg sm:text-2xl font-black tracking-[0.14em] text-white group-hover:text-zinc-200 transition-colors">
              CHAKRAVYUH
            </span>
            <span className="hidden sm:block font-mono text-[10px] font-semibold text-zinc-500 tracking-widest uppercase truncate">
              {HACKATHON_CONFIG.collegeName} • {HACKATHON_CONFIG.edition}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Collaborating clubs: ACS x IQUEST */}
          <div className={`${formUrl ? 'hidden sm:flex' : 'flex'} items-center gap-2 sm:gap-2.5 px-2 sm:px-3 py-1.5 rounded-xl bg-[#12141C] border border-white/[0.1] shadow-sm`}>
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden bg-[#3428d8] border border-indigo-400/30 flex items-center justify-center p-0.5 shadow-sm">
                <img src="/acs.jpeg" alt="ACS Club Logo" className="w-full h-full object-contain rounded-md" />
              </div>
              <span className="hidden sm:inline font-mono font-bold text-xs tracking-wider text-zinc-200">ACS</span>
            </div>

            <span className="font-cinzel font-black text-xs sm:text-sm text-gold select-none px-0.5 drop-shadow-[0_0_8px_rgba(216,180,106,0.4)]">
              ✕
            </span>

            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden bg-white border border-white/40 flex items-center justify-center p-0.5 shadow-sm">
                <img src="/iquest.jpeg" alt="IQUEST Club Logo" className="w-full h-full object-contain rounded-md" />
              </div>
              <span className="hidden sm:inline font-mono font-bold text-xs tracking-wider text-zinc-200">IQUEST</span>
            </div>
          </div>

          <Link
            to="/"
            aria-label="Home"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.12] bg-[#12141C] hover:bg-white/[0.06] text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>HOME</span>
          </Link>

          {formUrl && (
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 whitespace-nowrap px-3.5 sm:px-5 py-2.5 rounded-full bg-white text-[#08090C] hover:bg-zinc-200 active:scale-[0.98] font-mono text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
            >
              <span className="sm:hidden">SUBMIT</span>
              <span className="hidden sm:inline">SUBMIT YOUR CHOICE</span>
              <ExternalLink className="hidden sm:block w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
