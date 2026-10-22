import React, { useRef, useEffect, useState } from 'react';

const sponsors = [
  {
    name: 'Unstop',
    src: '/WhatsApp Image 2026-10-21 at 9.53.48 PM.jpeg',
    bg: 'bg-[#2E5FA3]',
    tier: 'Powered By Partner',
  },
  {
    name: 'Qualium AI',
    src: '/1256.jpeg',
    bg: 'bg-black',
    tier: 'AI Innovation Partner',
  },
  {
    name: 'Notion',
    src: '/123.jpeg',
    bg: 'bg-white',
    tier: 'Productivity Partner',
  },
  {
    name: 'Pocket Lab',
    src: '/WhatsApp Image 2026-10-21 at 9.53.49 PM.jpeg',
    bg: 'bg-black',
    tier: 'Hardware & Lab Partner',
  },
  {
    name: 'IIEC',
    src: '/WhatsApp Image 2026-10-21 at 9.53.51 PM.jpeg',
    bg: 'bg-black',
    tier: 'Incubation Partner',
  },
];

const useInView = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

export const SponsorsSection: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section id="sponsors" className="relative py-28 overflow-hidden bg-[#08090B] border-t border-[#302920]/40">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-[#C6A15B]/4 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-[#806638]/4 blur-[120px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-[#C6A15B] text-xs font-sans font-semibold tracking-[0.28em] uppercase mb-3">PARTNERS & SPONSORS</p>
          <h2 className="font-cinzel font-black text-4xl sm:text-5xl text-[#F0E6D1]">
            POWERING THE <span className="text-[#E0BC70]">NEXT GENERATION</span>
          </h2>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent" />
        </div>

        {/* Sponsor Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {sponsors.map((sponsor, idx) => (
            <div
              key={sponsor.name}
              className={`group flex flex-col items-center gap-3.5 transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: inView ? `${idx * 70}ms` : '0ms' }}
            >
              <div
                className={`w-full aspect-[3/2] rounded-2xl ${sponsor.bg} flex items-center justify-center p-4 border border-[#302920] group-hover:border-[#806638] group-hover:shadow-[0_0_20px_rgba(198,161,91,0.18)] transition-all duration-300 relative overflow-hidden`}
              >
                {/* Subtle corner highlight on hover */}
                <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#806638]/40 group-hover:border-[#C6A15B] transition-colors" />

                <img
                  src={sponsor.src}
                  alt={`${sponsor.name} logo`}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>

              <div className="text-center">
                <span className="block text-xs font-cinzel font-bold text-[#F0E6D1] group-hover:text-[#E0BC70] transition-colors">
                  {sponsor.name}
                </span>
                <span className="text-[10px] text-[#898174] font-sans font-medium tracking-wider uppercase">
                  {sponsor.tier}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
