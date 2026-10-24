import React, { useRef, useEffect, useState } from 'react';
import { Trophy, Award, Sparkles, Rocket, Shield, CheckCircle2 } from 'lucide-react';

const prizeTiers = [
  {
    rank: '01',
    title: 'GRAND CHAMPION',
    allocation: 'OVERALL 1ST PLACE',
    desc: 'The supreme squad demonstrating impeccable technical execution, algorithmic novelty, and production feasibility across all sectors.',
    perks: ['Grand Cash Prize', 'Chakravyuh Supreme Trophy', 'Direct IIEC Incubation Pipeline', 'Unstop National Spotlight'],
    featured: true,
  },
  {
    rank: '02',
    title: 'RUNNER-UP SQUAD',
    allocation: 'OVERALL 2ND PLACE',
    desc: 'The first contender squad with standout system architecture, robust prototype stability, and strong defensibility before the jury.',
    perks: ['Cash Award', 'Chakravyuh Silver Trophy', 'Investor Pitch Opportunities', 'Fast-Track Mentorship'],
    featured: false,
  },
  {
    rank: '03',
    title: 'TRACK CHAMPIONS',
    allocation: '5 GATE SPECIALISTS',
    desc: 'Top-ranking teams in each of the five battle gates: Cybersecurity, Space Tech, Quantum, FinTech, and Energy Systems.',
    perks: ['Category Cash Prizes', 'Gate Specialist Mementos', 'Industry Partner Interviews', 'Merit Certificates'],
    featured: false,
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

export const PrizePoolSection: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section
      id="prizes"
      className="relative py-28 overflow-hidden bg-[#090A0E] border-t border-white/[0.08]"
    >
      {/* Background Subtle Monolith Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-tactical-grid opacity-30" />
      </div>

      <div ref={ref} className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Section Heading */}
        <div className={`max-w-3xl mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-[#12141C] text-[10px] font-mono tracking-[0.24em] uppercase text-zinc-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
            <span>VALUATION & BOUNTIES</span>
          </div>

          <h2 className="font-cinzel font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            THE STAKES ARE SET.<br />
            <span className="text-zinc-500 font-bold">REWARDING ARCHITECTURAL EXCELLENCE.</span>
          </h2>
        </div>

        {/* Grand Total Centerpiece Module */}
        <div
          className={`relative rounded-3xl border border-white/[0.12] bg-[#12141C] p-8 sm:p-12 lg:p-16 mb-12 shadow-[0_20px_50px_rgba(0,0,0,0.7)] transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div>
              <span className="font-mono text-xs sm:text-sm tracking-[0.25em] uppercase text-zinc-400 font-semibold block mb-2">
                TOTAL WORTH PRIZE POOL
              </span>
              <div className="font-cinzel font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-white leading-none">
                ₹7,00,000
              </div>
              <p className="mt-4 text-zinc-400 text-xs sm:text-sm max-w-lg leading-relaxed">
                Distributed across cash bounties, incubator venture support, partner credits, and hardware deployment kits.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
              <div className="p-4 rounded-xl bg-[#08090C] border border-white/[0.08] flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">ACCREDITATION</div>
                  <div className="font-cinzel font-bold text-xs text-white">NATIONAL CHAMPIONSHIP TITLE</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#08090C] border border-white/[0.08] flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Rocket className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">VENTURE SUPPORT</div>
                  <div className="font-cinzel font-bold text-xs text-white">IIEC INCUBATION PIPELINE</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prizeTiers.map((tier, idx) => (
            <div
              key={tier.rank}
              className={`rounded-2xl p-8 flex flex-col justify-between border transition-all duration-300 ${
                tier.featured
                  ? 'bg-[#151722] border-white/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)]'
                  : 'bg-[#12141C] border-white/[0.08] hover:border-white/20'
              } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: inView ? `${idx * 100}ms` : '0ms' }}
            >
              <div>
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06]">
                  <span className="font-mono text-xs font-bold text-zinc-500 tracking-wider">
                    RANK {tier.rank}
                  </span>
                  <span className="font-mono text-[9px] tracking-widest uppercase text-white bg-white/10 px-2.5 py-1 rounded-full">
                    {tier.allocation}
                  </span>
                </div>

                <h3 className="font-cinzel font-black text-2xl text-white mb-3">
                  {tier.title}
                </h3>

                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  {tier.desc}
                </p>

                {/* Perks Checklist */}
                <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
                  {tier.perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF3B30] shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PrizePoolSection;
