import React, { useRef, useEffect, useState } from 'react';
import { MapPin, ExternalLink, Building2, Compass } from 'lucide-react';

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

  // Configurable Google Maps destination
  const MAPS_URL =
    'https://maps.google.com/?q=VIT-AP+University,+Amaravati,+Andhra+Pradesh,+India';

  return (
    <section id="venue" className="relative py-28 bg-[#0D0E11] overflow-hidden border-t border-[#302920]/40">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-ancient-grid opacity-30" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full bg-[#C6A15B]/3 blur-[120px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-[#C6A15B] text-xs font-sans font-semibold tracking-[0.28em] uppercase mb-3">LOCATION & VENUE</p>
          <h2 className="font-cinzel font-black text-4xl sm:text-5xl text-[#F0E6D1]">
            THE ARENA <span className="text-[#E0BC70]">AWAITS</span>
          </h2>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent" />
        </div>

        {/* Centered Location Info Card */}
        <div
          className={`max-w-2xl mx-auto rounded-3xl border border-[#302920] bg-[#121318]/90 backdrop-blur-md p-8 sm:p-12 transition-all duration-700 delay-100 shadow-[0_16px_50px_rgba(0,0,0,0.7)] ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Card Top: VIT-AP Insignia + Coordinates Tag */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-[#302920]">
            <div className="px-3.5 py-2 rounded-xl bg-[#08090B] border border-[#806638]/40 shadow-inner">
              <img
                src="/vit-ap-logo.png"
                alt="VIT-AP University"
                className="h-9 w-auto object-contain block filter brightness-0 invert opacity-95"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#08090B] border border-[#302920] text-xs font-sans font-medium text-[#898174]">
              <Compass className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>16.4971° N, 80.5002° E</span>
            </div>
          </div>

          <h3 className="font-cinzel font-black text-2xl sm:text-3xl lg:text-4xl text-[#F0E6D1] mb-2 text-center sm:text-left">
            VIT-AP UNIVERSITY
          </h3>

          <div className="flex items-center justify-center sm:justify-start gap-2 text-[#C6A15B] mb-5">
            <MapPin className="w-4 h-4 shrink-0 text-[#C6A15B]" />
            <span className="text-sm font-medium tracking-wide">Amaravati, Andhra Pradesh, India</span>
          </div>

          <p className="text-[#898174] text-sm sm:text-base leading-relaxed mb-6 text-center sm:text-left">
            Join us on campus at VIT-AP University, where multidisciplinary engineering minds
            gather to compete in the Chakravyuh hackathon arena.
          </p>

          {/* Informational Notice */}
          <div className="rounded-xl border border-[#302920] bg-[#08090B]/90 px-4 py-3.5 mb-8 text-left">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-[#C6A15B] mt-0.5 shrink-0" />
              <p className="text-[#898174] text-xs sm:text-sm leading-relaxed">
                Specific hall, lab, and auditorium allocations will be communicated directly to verified team leaders before the check-in date.
              </p>
            </div>
          </div>

          <div className="flex justify-center sm:justify-start">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#D8B46A] via-[#E5C37A] to-[#C6A15B] hover:brightness-110 active:scale-[0.98] text-[#08090B] font-cinzel font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(198,161,91,0.25)] hover:shadow-[0_0_30px_rgba(224,188,112,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0BC70]"
            >
              <ExternalLink className="w-4 h-4" />
              <span>GET DIRECTIONS</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueSection;
