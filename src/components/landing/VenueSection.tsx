import React, { useRef, useEffect, useState } from 'react';
import { MapPin, ExternalLink, Building2, Compass, Navigation } from 'lucide-react';

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

export const VenueSection: React.FC = () => {
  const { ref, inView } = useInView();

  const MAPS_URL =
    'https://www.google.com/maps/search/?api=1&query=VIT-AP+University,+Amaravati,+Andhra+Pradesh,+India';

  return (
    <section id="venue" className="relative py-28 bg-[#090A0E] overflow-hidden border-t border-white/[0.08]">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-tactical-grid opacity-30" />
      </div>

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-[#12141C] text-[10px] font-mono tracking-[0.24em] uppercase text-zinc-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
            <span>CAMPUS LOCATION</span>
          </div>

          <h2 className="font-cinzel font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            THE ARENA DESTINATION.<br />
            <span className="text-zinc-500 font-bold">VIT-AP UNIVERSITY AMARAVATI.</span>
          </h2>
        </div>

        {/* Centered Location Info Card */}
        <div
          className={`rounded-3xl border border-white/[0.1] bg-[#12141C] p-8 sm:p-12 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.7)] ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Top Row: Insignia + Coordinates */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
            <div className="px-4 py-2 rounded-xl bg-[#08090C] border border-white/[0.08]">
              <img
                src="/vit-ap-logo.png"
                alt="VIT-AP University"
                className="h-8 w-auto object-contain block filter brightness-0 invert opacity-95"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08090C] border border-white/[0.08] font-mono text-xs text-zinc-400">
              <Compass className="w-3.5 h-3.5 text-[#FF3B30]" />
              <span>16.4971° N, 80.5002° E</span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-cinzel font-black text-2xl sm:text-3xl text-white text-center sm:text-left">
              VIT-AP UNIVERSITY
            </h3>

            <div className="flex items-center justify-center sm:justify-start gap-2 text-zinc-300 font-mono text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-[#FF3B30] shrink-0" />
              <span>Near Vijayawada, Amaravati, Andhra Pradesh 522237, India</span>
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed text-center sm:text-left font-normal max-w-xl">
              An ecosystem engineered for high-intensity hackathon sprints. High-speed gigabit Wi-Fi, 24/7 dedicated arena labs, mentor briefing halls, and round-the-clock power redundancy.
            </p>
          </div>

          {/* Allocation Brief Box */}
          <div className="rounded-xl border border-white/[0.06] bg-[#08090C] p-4 mb-8 text-left flex items-start gap-3">
            <Building2 className="w-4 h-4 text-zinc-400 mt-0.5 shrink-0" />
            <p className="text-zinc-400 text-xs leading-relaxed">
              Designated lab allocations, check-in registration counters, and auditorium briefings will be transmitted directly to verified team leaders prior to the arena arrival date.
            </p>
          </div>

          {/* Directions CTA Button */}
          <div className="flex justify-center sm:justify-start">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white hover:bg-zinc-200 active:scale-[0.98] text-[#08090C] font-mono font-bold text-xs uppercase tracking-[0.16em] transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)] cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>GET CAMPUS DIRECTIONS</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default VenueSection;
