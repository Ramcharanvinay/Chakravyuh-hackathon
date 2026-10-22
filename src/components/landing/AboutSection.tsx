import React, { useRef, useEffect, useState } from 'react';
import { Layers, Globe, Users, Zap, Shield, Compass, Target, Award } from 'lucide-react';

const highlights = [
  { icon: Target, label: '50 Challenges', desc: 'Real-world problem statements spanning cybersecurity, quantum, space, fintech, and clean energy.' },
  { icon: Users,  label: 'Team Play',   desc: 'Collaborate with multidisciplinary minds to break through concentric problem layers.' },
  { icon: Globe,  label: 'Open Arena',  desc: 'Compete alongside top student innovators and builders from institutions across India.' },
  { icon: Zap,    label: 'Real Impact', desc: 'Build production-ready, original solutions that solve critical real-world friction.' },
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

export const AboutSection: React.FC = () => {
  const { ref, inView } = useInView();

  return (
    <section id="about" className="relative py-28 bg-[#0D0E11] overflow-hidden border-t border-[#302920]/50">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-[#C6A15B]/3 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-[#806638]/4 blur-[100px]" />
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-[#C6A15B] text-xs font-mono tracking-[0.28em] uppercase mb-3">
            ABOUT THE HACKATHON
          </p>
          <h2 className="font-cinzel font-black text-4xl sm:text-5xl text-[#F0E6D1] leading-tight">
            WHERE STRATEGY MEETS<br />
            <span className="text-[#E0BC70]">INNOVATION</span>
          </h2>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Narrative Description */}
          <div className={`space-y-6 transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-[#C7BDA9] text-lg leading-relaxed font-normal">
              Chakravyuh is a technology-driven hackathon hosted at VIT-AP University, bringing
              together creative problem-solvers, developers, and innovators to turn ideas into
              impactful solutions.
            </p>
            <p className="text-[#898174] text-base leading-relaxed">
              Inspired by the legendary strategic warfare labyrinth of the Mahabharata, the Chakravyuh
              formation challenges participants to navigate multifaceted complexity, embrace tactical unity,
              and emerge with enduring engineering breakthroughs.
            </p>

            {/* Bronze Divider & Formation Metrics */}
            <div className="relative mt-8 pt-6 border-l-2 border-[#806638]/50 pl-6 space-y-5">
              <div>
                <span className="block font-cinzel text-3xl font-bold text-[#F0E6D1]">50</span>
                <span className="text-xs text-[#898174] tracking-widest font-mono uppercase">Unique Problem Statements</span>
              </div>
              <div>
                <span className="block font-cinzel text-3xl font-bold text-[#C6A15B]">36</span>
                <span className="text-xs text-[#898174] tracking-widest font-mono uppercase">Hours Non-Stop Innovation</span>
              </div>
              <div>
                <span className="block font-cinzel text-3xl font-bold text-[#E0BC70]">7</span>
                <span className="text-xs text-[#898174] tracking-widest font-mono uppercase">Concentric Rings of Strategic Depth</span>
              </div>
            </div>
          </div>

          {/* Right: Refined Charcoal Feature Cards */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {highlights.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="group relative p-6 rounded-2xl bg-[#121318] border border-[#302920] hover:border-[#806638] hover:bg-[#17171B] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                {/* Subtle corner accent */}
                <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-[#806638]/40 group-hover:border-[#C6A15B] transition-colors" />

                <div className="w-10 h-10 rounded-xl bg-[#08090B] border border-[#302920] flex items-center justify-center mb-4 group-hover:border-[#C6A15B]/50 group-hover:bg-[#C6A15B]/10 transition-colors">
                  <Icon className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <h3 className="font-cinzel font-bold text-[#F0E6D1] text-base mb-2 group-hover:text-[#E0BC70] transition-colors">
                  {label}
                </h3>
                <p className="text-[#898174] text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
