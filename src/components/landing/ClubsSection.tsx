import React, { useRef, useEffect, useState } from 'react';
import { Users2 } from 'lucide-react';

const clubs = [
  {
    name: 'ACS',
    fullName: 'Association of Computer Science',
    src: '/acs.jpeg',
    bg: 'bg-[#2B239E]',
    role: 'CO-HOSTING COMMUNITY',
    description:
      'Co-organizing and facilitating technical operations, systems evaluation, and arena infrastructure for Chakravyuh.',
  },
  {
    name: 'IQuest',
    fullName: 'IQuest Developer Society',
    src: '/WhatsApp Image 2026-10-21 at 9.53.51 PM (2).jpeg',
    bg: 'bg-white',
    role: 'COMMUNITY & OPERATIONS',
    description:
      'Driving pan-university developer engagement, participant logistics, mentorship coordination, and arena management.',
  },
];

const useInView = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

export const ClubsSection: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section id="clubs" className="relative py-28 bg-[#090A0E] overflow-hidden border-t border-white/[0.08]">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-tactical-grid opacity-30" />
      </div>

      <div ref={ref} className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Section Header */}
        <div className={`max-w-3xl mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-[#12141C] text-[10px] font-mono tracking-[0.24em] uppercase text-zinc-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
            <span>ORGANIZING COMMUNITIES</span>
          </div>

          <h2 className="font-cinzel font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            ENGINEERED BY BUILDERS.<br />
            <span className="text-zinc-500 font-bold">DRIVEN BY STUDENT COMMUNITIES.</span>
          </h2>
        </div>

        {/* Club Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {clubs.map((club, idx) => (
            <div
              key={club.name}
              className={`group relative rounded-2xl border border-white/[0.08] hover:border-white/20 bg-[#12141C] hover:bg-[#161822] transition-all duration-300 p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: inView ? `${idx * 120}ms` : '0ms' }}
            >
              {/* Club Logo Showcase */}
              <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl ${club.bg} flex items-center justify-center p-3 border border-white/[0.08] shrink-0 shadow-lg`}>
                <img
                  src={club.src}
                  alt={`${club.name} logo`}
                  className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              </div>

              {/* Club Details */}
              <div className="flex flex-col justify-between h-full text-center sm:text-left">
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 mb-1">
                    {club.role}
                  </div>
                  <h3 className="font-cinzel font-black text-2xl sm:text-3xl text-white group-hover:text-zinc-200 transition-colors mb-1">
                    {club.name}
                  </h3>
                  <div className="font-mono text-xs text-zinc-400 mb-3">
                    {club.fullName}
                  </div>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
                    {club.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-zinc-500 font-mono text-[10px] tracking-wider uppercase">
                  <span>VIT-AP UNIVERSITY</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ClubsSection;
