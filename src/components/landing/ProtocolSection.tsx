import React, { useRef, useEffect, useState } from 'react';
import { ShieldCheck, Cpu, Target, Layers, GitBranch } from 'lucide-react';

const pillars = [
  {
    step: '01',
    title: 'IMMUTABLE SELECTION',
    subtitle: 'Track & Problem Statement Lock',
    desc: 'Select from 50 high-stakes challenges across 5 battle tracks. Once your squad locks the challenge in the portal, the choice is immutable. Direct focus, zero hesitation.',
    icon: Target,
    tag: 'TACTICAL INITIATION',
  },
  {
    step: '02',
    title: '48-HOUR SPRINT',
    subtitle: 'System Architecture & Hardening',
    desc: 'Translate algorithmic designs into production-grade systems. Collaborate across hardware, distributed systems, cryptography, and modern software engineering.',
    icon: Cpu,
    tag: 'RAPID EXECUTION',
  },
  {
    step: '03',
    title: 'DEFENSE & VERDICT',
    subtitle: 'Rigorous Jury Evaluation',
    desc: 'Present functioning prototypes and deployment architecture to industry veterans and academic leaders. Scored on technical execution, innovation, and real impact.',
    icon: ShieldCheck,
    tag: 'THE ARENA VERDICT',
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

export const ProtocolSection: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section id="protocol" className="relative py-28 bg-[#090A0E] overflow-hidden border-t border-white/[0.08]">
      {/* Background Subtle Monolith Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-tactical-grid opacity-30" />
      </div>

      <div ref={ref} className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Section Header */}
        <div className={`max-w-3xl mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-[#12141C] text-[10px] font-mono tracking-[0.24em] uppercase text-zinc-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
            <span>THE FORMATION PROTOCOL</span>
          </div>

          <h2 className="font-cinzel font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            ANCIENT TACTICAL STRATEGY.<br />
            <span className="text-zinc-500 font-bold">MODERN ENGINEERING EXECUTION.</span>
          </h2>

          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            Inspired by the concentric strategic labyrinth of the Mahabharata, Chakravyuh transforms warfare tactics into a high-stakes competitive crucible. Each layer demands collective intelligence, architectural depth, and relentless execution.
          </p>
        </div>

        {/* Three Pillar Architectural Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.step}
                className={`group relative rounded-2xl bg-[#12141C] border border-white/[0.08] hover:border-white/20 p-8 flex flex-col justify-between transition-all duration-300 hover:bg-[#161822] shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: inView ? `${idx * 120}ms` : '0ms' }}
              >
                {/* Top: Step Index & Tag */}
                <div>
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
                    <span className="font-mono text-2xl font-black text-white/40 group-hover:text-white transition-colors">
                      {pillar.step}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-zinc-500 bg-[#08090C] px-2.5 py-1 rounded-full border border-white/[0.06]">
                      {pillar.tag}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-[#08090C] border border-white/[0.08] flex items-center justify-center mb-6 group-hover:border-white/30 transition-colors">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>

                  <h3 className="font-cinzel font-black text-xl text-white mb-1.5 group-hover:text-zinc-200 transition-colors">
                    {pillar.title}
                  </h3>

                  <div className="font-mono text-[11px] text-[#FF3B30] tracking-wider uppercase mb-4 font-semibold">
                    {pillar.subtitle}
                  </div>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                {/* Bottom Hairline Highlight */}
                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-zinc-500 font-mono text-[10px] tracking-widest uppercase">
                  <span>STAGE {pillar.step} OF 03</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ProtocolSection;
