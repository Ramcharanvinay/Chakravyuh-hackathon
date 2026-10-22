import React from 'react';
import { HACKATHON_CONFIG } from '../../config/hackathonConfig';

const navLinks = [
  { label: 'Prizes',   href: '#prizes' },
  { label: 'Sponsors', href: '#sponsors' },
  { label: 'Rules',    href: '#rules' },
  { label: 'Venue',    href: '#venue' },
];

export const LandingFooter: React.FC = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="relative bg-[#08090B] border-t border-[#302920] pt-16 pb-10 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none bg-ancient-grid opacity-25" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">

          {/* Brand Column */}
          <div className="space-y-4">
            <div>
              <span className="font-cinzel font-black text-2xl tracking-[0.18em] text-[#F0E6D1]">
                CHAKRAVYUH
              </span>
              <div className="flex items-center gap-2.5 mt-2">
                <span className="text-[11px] text-[#898174] font-sans font-semibold tracking-widest uppercase">
                  Powered by
                </span>
                <div className="bg-[#121318] px-2 py-1 rounded-full border border-[#806638]/40 inline-flex items-center">
                  <img
                    src="/unstop-logo-transparent.png"
                    alt="Unstop"
                    className="h-3.5 w-auto object-contain"
                  />
                </div>
              </div>
            </div>

            <p className="text-[#898174] text-xs leading-relaxed max-w-xs">
              A premier technology hackathon hosted at VIT-AP University.
              Fifty challenges. One legendary formation.
            </p>

            {/* VIT-AP Logo */}
            <div className="pt-2">
              <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#121318] border border-[#806638]/40 shadow-sm">
                <img
                  src="/vit-ap-logo.png"
                  alt="VIT-AP University"
                  className="h-7 w-auto object-contain block filter brightness-0 invert opacity-90"
                />
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-cinzel text-xs font-bold tracking-[0.25em] text-[#C6A15B] uppercase mb-4">
              FORMATION INDEX
            </h4>
            <nav className="flex flex-col gap-2.5">
              {navLinks.map(link => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-xs font-medium text-[#898174] hover:text-[#E0BC70] transition-colors focus:outline-none w-fit"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Partners & Clubs Column */}
          <div>
            <h4 className="font-cinzel text-xs font-bold tracking-[0.25em] text-[#C6A15B] uppercase mb-3.5">
              PARTNERS & SPONSORS
            </h4>
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {[
                { src: '/WhatsApp Image 2026-10-21 at 9.53.48 PM.jpeg', alt: 'Unstop',      bg: 'bg-[#2E5FA3]' },
                { src: '/1256.jpeg',                                     alt: 'Qualium AI',  bg: 'bg-black' },
                { src: '/123.jpeg',                                      alt: 'Notion',      bg: 'bg-white' },
                { src: '/WhatsApp Image 2026-10-21 at 9.53.49 PM.jpeg', alt: 'Pocket Lab',  bg: 'bg-black' },
                { src: '/WhatsApp Image 2026-10-21 at 9.53.51 PM.jpeg', alt: 'IIEC',        bg: 'bg-black' },
              ].map(s => (
                <div key={s.alt} className={`${s.bg} rounded-lg p-2 flex items-center justify-center h-10 border border-[#302920]`}>
                  <img src={s.src} alt={s.alt} className="max-h-full max-w-full object-contain" loading="lazy" />
                </div>
              ))}
            </div>

            <h4 className="font-cinzel text-xs font-bold tracking-[0.25em] text-[#C6A15B] uppercase mb-2.5">
              COLLABORATING CLUBS
            </h4>
            <div className="flex gap-2.5">
              {[
                { src: '/acs.jpeg',                                          alt: 'ACS',    bg: 'bg-[#3B30D4]' },
                { src: '/WhatsApp Image 2026-10-21 at 9.53.51 PM (2).jpeg', alt: 'IQuest', bg: 'bg-white' },
              ].map(c => (
                <div key={c.alt} className={`${c.bg} rounded-lg p-2 flex items-center justify-center h-10 w-16 border border-[#302920]`}>
                  <img src={c.src} alt={c.alt} className="max-h-full max-w-full object-contain" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-[#302920] pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#898174]/70 text-xs text-center sm:text-left">
              © 2026 CHAKRAVYUH HACKATHON • VIT-AP University, Amaravati, Andhra Pradesh, India
            </p>
            <div className="flex items-center gap-4 text-xs font-sans text-[#898174]/70">
              <a href={`mailto:${HACKATHON_CONFIG.contactEmail}`} className="hover:text-[#C6A15B] transition-colors">
                {HACKATHON_CONFIG.contactEmail}
              </a>
              <span>•</span>
              <span>All Rights Reserved</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
