import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  LogIn,
  Home,
  Trophy,
  Sparkles,
  ScrollText,
  MapPin
} from 'lucide-react';
import PillNav, { PillNavItem } from '../navigation/PillNav';

const navItems: PillNavItem[] = [
  { label: 'Home', href: '#hero', icon: <Home className="w-3.5 h-3.5" /> },
  { label: 'Prizes', href: '#prizes', icon: <Trophy className="w-3.5 h-3.5" /> },
  { label: 'Sponsors', href: '#sponsors', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { label: 'Rules', href: '#rules', icon: <ScrollText className="w-3.5 h-3.5" /> },
  { label: 'Venue', href: '#venue', icon: <MapPin className="w-3.5 h-3.5" /> },
];

export const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-[#08090B]/95 backdrop-blur-xl border-b border-[#302920] shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
        : 'bg-[#08090B]/70 backdrop-blur-md border-b border-[#302920]/40'
        }`}
    >
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">

          {/* Left: Ancient Wheel + Wordmark + Tagline */}
          <button
            onClick={() => scrollTo('#intro')}
            className="flex items-center gap-3.5 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A15B] rounded-lg p-1 group shrink-0"
          >
            {/* Ancient Wheel Emblem (Frameless & Enlarged) */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
              <img
                src="/chakravyuh-luxury-wheel.svg"
                alt="Chakravyuh Emblem"
                className="w-full h-full object-contain animate-spin-wheel drop-shadow-[0_0_12px_rgba(216,180,106,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(216,180,106,0.8)] transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="font-cinzel font-black text-2xl sm:text-3xl tracking-[0.14em] text-[#F0E6D1] group-hover:text-[#E0BC70] transition-colors leading-none">
                CHAKRAVYUH
              </span>
              <span className="text-[#806638] font-bold hidden sm:inline text-lg">—</span>
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#121318]/90 border border-[#806638]/40 hover:border-[#C6A15B] transition-colors shrink-0">
                <span className="text-[10px] tracking-[0.2em] text-[#C6A15B] uppercase font-sans font-bold whitespace-nowrap">
                  POWERED BY
                </span>
                <img
                  src="/unstop-logo-transparent.png"
                  alt="Unstop"
                  className="h-4 sm:h-4.5 w-auto object-contain block drop-shadow-[0_1px_6px_rgba(255,255,255,0.12)]"
                />
              </div>
            </div>
          </button>

          {/* Centre: Interactive PillNav with Icons (Desktop) */}
          <div className="hidden lg:flex items-center justify-center shrink-0">
            <PillNav
              items={navItems}
              size="sm"
              theme="dark"
              surface="glass"
              hoverEffect="fill"
              indicator="pill"
              onItemClick={(item, _idx, e) => {
                if (item.href?.startsWith('#')) {
                  e.preventDefault();
                  scrollTo(item.href);
                }
              }}
            />
          </div>

          {/* Right: VIT-AP Logo + Auth Entry Points */}
          <div className="flex items-center gap-3 shrink-0">
            {/* VIT-AP Logo - Integrated Royal Crest */}
            <div className="hidden sm:flex items-center px-4 py-2 rounded-xl bg-[#121318]/90 border border-[#806638]/40 hover:border-[#C6A15B] shadow-[0_4px_16px_rgba(0,0,0,0.5)] transition-all shrink-0">
              <img
                src="/vit-ap-logo.png"
                alt="VIT-AP University"
                className="h-8 sm:h-9 w-auto object-contain block filter brightness-0 invert opacity-90 hover:opacity-100 transition-opacity shrink-0"
              />
            </div>

            {/* Enter The Arena Button */}
            <button
              onClick={() => navigate('/tracks')}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C6A15B] hover:bg-[#E0BC70] text-[#08090B] font-cinzel font-bold text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(198,161,91,0.25)] hover:shadow-[0_0_20px_rgba(224,188,112,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BC70]"
              aria-label="Enter the arena"
            >
              <LogIn className="w-3.5 h-3.5 text-[#08090B]" />
              <span>ENTER THE ARENA</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="lg:hidden w-10 h-10 rounded-xl bg-[#121318] border border-[#302920] flex items-center justify-center text-[#C7BDA9] hover:text-[#E0BC70] hover:border-[#806638] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A15B]"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-[#0D0E11]/98 backdrop-blur-2xl border-t border-[#302920] px-4 py-5 shadow-2xl">
          <nav className="flex flex-col gap-1.5" aria-label="Mobile navigation">
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={() => scrollTo(item.href || '#')}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[#C7BDA9] hover:text-[#E0BC70] hover:bg-[#121318] rounded-xl transition-colors focus:outline-none"
              >
                <span className="text-[#C6A15B]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            <div className="pt-3 mt-2 border-t border-[#302920] flex flex-col gap-3">
              <div className="flex items-center gap-3 px-2 py-1">
                <img
                  src="/vit-ap-logo.png"
                  alt="VIT-AP University"
                  className="h-9 w-auto object-contain rounded"
                />
                <span className="text-xs text-[#898174]">VIT-AP University</span>
              </div>

              <button
                onClick={() => { setMenuOpen(false); navigate('/tracks'); }}
                className="w-full py-3.5 text-center rounded-xl bg-[#C6A15B] text-[#08090B] font-cinzel font-bold text-xs tracking-wider shadow-gold-subtle"
              >
                ENTER THE ARENA
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
