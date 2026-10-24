import React, { useRef, useEffect, useState } from 'react';

const sponsors = [
  {
    name: 'Unstop',
    src: '/WhatsApp Image 2026-10-21 at 9.53.48 PM.jpeg',
    bg: 'bg-[#1F3D6B]',
    tier: 'POWERED BY PARTNER',
    badge: 'PLATINUM',
  },
  {
    name: 'Qualium AI',
    src: '/1256.jpeg',
    bg: 'bg-[#12141C]',
    tier: 'AI INNOVATION PARTNER',
    badge: 'CATEGORY LEAD',
  },
  {
    name: 'Notion',
    src: '/123.jpeg',
    bg: 'bg-white',
    tier: 'PRODUCTIVITY PARTNER',
    badge: 'TOOLING',
  },
  {
    name: 'Pocket Lab',
    src: '/WhatsApp Image 2026-10-21 at 9.53.49 PM.jpeg',
    bg: 'bg-[#12141C]',
    tier: 'HARDWARE & LAB PARTNER',
    badge: 'INFRASTRUCTURE',
  },
  {
    name: 'IIEC',
    src: '/WhatsApp Image 2026-10-21 at 9.53.51 PM.jpeg',
    bg: 'bg-[#12141C]',
    tier: 'INCUBATION PARTNER',
    badge: 'VENTURE',
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
    <section id="partners" className="relative py-28 overflow-hidden bg-[#08090C] border-t border-white/[0.08]">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-tactical-grid opacity-30" />
      </div>

      <div ref={ref} className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Section Header */}
        <div className={`max-w-3xl mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-[#12141C] text-[10px] font-mono tracking-[0.24em] uppercase text-zinc-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
            <span>ECOSYSTEM COLLABORATORS</span>
          </div>

          <h2 className="font-cinzel font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            BACKED BY INDUSTRY LEADERS.<br />
            <span className="text-zinc-500 font-bold">POWERING THE NEXT FRONTIER.</span>
          </h2>
        </div>

        {/* Sponsor Showcase Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {sponsors.map((sponsor, idx) => (
            <div
              key={sponsor.name}
              className={`group flex flex-col justify-between p-6 rounded-2xl bg-[#12141C] border border-white/[0.08] hover:border-white/30 transition-all duration-300 hover:bg-[#161822] shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: inView ? `${idx * 70}ms` : '0ms' }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
                    {sponsor.badge}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#FF3B30] transition-colors" />
                </div>

                <div
                  className={`w-full aspect-[3/2] rounded-xl ${sponsor.bg} flex items-center justify-center p-4 border border-white/[0.08] mb-5 overflow-hidden`}
                >
                  <img
                    src={sponsor.src}
                    alt={`${sponsor.name} logo`}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-cinzel font-black text-base text-white group-hover:text-zinc-200 transition-colors mb-1">
                  {sponsor.name}
                </h4>
                <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                  {sponsor.tier}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SponsorsSection;
