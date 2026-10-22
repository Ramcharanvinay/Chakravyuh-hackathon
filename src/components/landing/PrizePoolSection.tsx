import React, { useRef, useEffect, useState } from 'react';
import { Trophy, Award } from 'lucide-react';

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
      className="relative py-28 overflow-hidden bg-[#08090B] border-t border-[#302920]/40"
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-ancient-grid opacity-40" />
        {/* Subtle Central Gold Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full bg-[#C6A15B]/5 blur-[130px]" />
        
        {/* Concentric Decorative Rings */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.05]" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
          <ellipse cx="50%" cy="50%" rx="420" ry="300" fill="none" stroke="#C6A15B" strokeWidth="1" strokeDasharray="14 8" />
          <ellipse cx="50%" cy="50%" rx="520" ry="380" fill="none" stroke="#806638" strokeWidth="1" strokeDasharray="8 12" />
        </svg>
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Section Heading */}
        <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-[#C6A15B] text-xs font-sans font-semibold tracking-[0.28em] uppercase mb-3">PRIZE POOL</p>
          <h2 className="font-cinzel font-black text-4xl sm:text-5xl text-[#F0E6D1] mb-12">
            THE STAKES ARE <span className="text-[#E0BC70]">LEGENDARY</span>
          </h2>
        </div>

        {/* Grand Prize Display Card */}
        <div
          className={`relative inline-block transition-all duration-700 delay-200 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          {/* Subtle Ambient Glow Behind Card */}
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-b from-[#C6A15B]/10 via-[#806638]/5 to-transparent blur-xl" />
          
          <div className="relative rounded-3xl border border-[#302920] bg-[#121318]/90 backdrop-blur-md p-10 sm:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">

            {/* Antique Gold Metallic Corner Accents */}
            {['top-3 left-3 border-t-2 border-l-2', 'top-3 right-3 border-t-2 border-r-2',
              'bottom-3 left-3 border-b-2 border-l-2', 'bottom-3 right-3 border-b-2 border-r-2'].map((cls, i) => (
              <div key={i} className={`absolute w-5 h-5 ${cls} border-[#806638]`} />
            ))}

            {/* Victory-Inspired Trophy Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#08090B] border border-[#806638]/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(198,161,91,0.15)]">
              <Trophy className="w-8 h-8 text-[#C6A15B]" />
            </div>

            {/* Grand Prize Number */}
            <div className="font-cinzel font-black text-6xl sm:text-7xl lg:text-8xl leading-none tracking-tight">
              <span
                className="bg-gradient-to-b from-[#F0E6D1] via-[#E0BC70] to-[#C6A15B] bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(198,161,91,0.25)]"
                style={{ WebkitTextFillColor: 'transparent' }}
              >
                ₹7,00,000
              </span>
            </div>

            {/* Supporting Text */}
            <div className="mt-6 font-sans text-xs sm:text-sm tracking-[0.28em] text-[#C6A15B] uppercase font-bold">
              TOTAL PRIZE POOL WORTH ₹7 LAKHS
            </div>

            {/* Bronze Divider */}
            <div className="mt-6 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-[#806638] to-transparent" />
          </div>
        </div>

        {/* Narrative Context */}
        <p
          className={`mt-10 text-[#898174] text-base max-w-lg mx-auto leading-relaxed transition-all duration-700 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          Breach through concentric layers of engineering complexity, solve high-stakes challenges,
          and claim your legacy in the Chakravyuh.
        </p>
      </div>
    </section>
  );
};

export default PrizePoolSection;
