import React, { useRef, useEffect, useState } from 'react';
import { Users2, Award } from 'lucide-react';

const clubs = [
  {
    name: 'ACS',
    src: '/acs.jpeg',
    bg: 'bg-[#3B30D4]',
    description:
      'Collaborating club — co-organising and facilitating the Chakravyuh technical arena.',
  },
  {
    name: 'IQuest',
    src: '/WhatsApp Image 2026-10-21 at 9.53.51 PM (2).jpeg',
    bg: 'bg-white',
    description:
      'Collaborating club — driving developer community engagement, innovation, and coordination.',
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
    <section id="clubs" className="relative py-24 bg-[#0D0E11] overflow-hidden border-t border-[#302920]/40">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-ancient-grid opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[400px] rounded-full bg-[#C6A15B]/3 blur-[120px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[#C6A15B] text-xs font-sans font-semibold tracking-[0.28em] uppercase">COLLABORATING CLUBS</span>
          </div>
          <h2 className="font-cinzel font-black text-4xl sm:text-5xl text-[#F0E6D1]">
            BUILT BY <span className="text-[#E0BC70]">COMMUNITY</span>
          </h2>
          <p className="mt-4 text-[#898174] text-sm max-w-md mx-auto leading-relaxed">
            The student-led technical communities powering the arena and coordinating the hackathon experience.
          </p>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent" />
        </div>

        {/* Club Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {clubs.map((club, idx) => (
            <div
              key={club.name}
              className={`group relative rounded-3xl border border-[#302920] hover:border-[#806638] bg-[#121318] hover:bg-[#17171B] transition-all duration-400 p-8 flex flex-col items-center text-center gap-5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: inView ? `${idx * 120}ms` : '0ms' }}
            >
              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#806638]/40 group-hover:border-[#C6A15B] transition-colors" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#806638]/40 group-hover:border-[#C6A15B] transition-colors" />

              {/* Club Logo Showcase */}
              <div className={`w-32 h-32 rounded-2xl ${club.bg} flex items-center justify-center p-3 border border-[#302920] shadow-[0_0_20px_rgba(0,0,0,0.8)]`}>
                <img
                  src={club.src}
                  alt={`${club.name} logo`}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>

              {/* Title & Badge */}
              <div>
                <h3 className="font-cinzel font-black text-2xl text-[#F0E6D1] group-hover:text-[#E0BC70] transition-colors mb-1.5">
                  {club.name}
                </h3>
                <span className="inline-block px-3 py-1 rounded-full bg-[#08090B] border border-[#302920] text-[#C6A15B] text-[10px] font-sans font-semibold tracking-widest uppercase">
                  COLLABORATING CLUB
                </span>
              </div>

              {/* Description */}
              <p className="text-[#898174] text-xs leading-relaxed max-w-xs">
                {club.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClubsSection;
