import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Scroll, Sparkles } from 'lucide-react';

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

export const FinalCTASection: React.FC = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  const scrollToRules = () => {
    document.querySelector('#rules')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="register" className="relative py-32 overflow-hidden bg-[#08090B] border-t border-[#302920]/40">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-ancient-grid opacity-30" />
        
        {/* Subtle Central Gold Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#C6A15B]/5 blur-[140px]" />
        
        {/* Ancient Labyrinth Radial Geometry */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.05]" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="50%" cy="50%" rx="48%" ry="42%" fill="none" stroke="#C6A15B" strokeWidth="1" strokeDasharray="16 10" />
          <ellipse cx="50%" cy="50%" rx="36%" ry="32%" fill="none" stroke="#806638" strokeWidth="1" strokeDasharray="10 12" />
          <ellipse cx="50%" cy="50%" rx="24%" ry="20%" fill="none" stroke="#C6A15B" strokeWidth="1" />
        </svg>
      </div>

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-[#302920] bg-[#121318] text-[#C6A15B] text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>FINAL CALL TO ARMS</span>
          </div>

          {/* Heading */}
          <h2 className="font-cinzel font-black text-4xl sm:text-5xl lg:text-6xl text-[#F0E6D1] leading-tight mb-4">
            EVERY LEGEND BEGINS<br />WITH A{' '}
            <span className="bg-gradient-to-r from-[#F0E6D1] via-[#E0BC70] to-[#C6A15B] bg-clip-text text-transparent">
              CHOICE.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-[#898174] text-lg sm:text-xl font-cinzel mb-10 tracking-wide">
            The arena is ready. The challenge is yours.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Primary: Antique Gold */}
            <button
              onClick={() => navigate('/tracks')}
              className="group flex items-center justify-center gap-3 px-10 py-4 rounded-xl bg-[#C6A15B] hover:bg-[#E0BC70] text-[#08090B] font-cinzel font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(198,161,91,0.25)] hover:shadow-[0_0_25px_rgba(224,188,112,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BC70]"
            >
              <span>ENTER THE ARENA</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Secondary: Dark Surface with Bronze Border */}
            <button
              onClick={scrollToRules}
              className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl border border-[#302920] bg-[#121318] hover:border-[#806638] hover:bg-[#17171B] text-[#F0E6D1] font-cinzel font-bold text-xs tracking-wider transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C6A15B]"
            >
              <Scroll className="w-4 h-4 text-[#C6A15B]" />
              <span>REVISIT THE RULES</span>
            </button>
          </div>

          {/* Footer Note */}
          <p className="mt-8 text-[#898174]/60 text-xs font-mono">
            Registration via Unstop — associate one team leader per squad.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
