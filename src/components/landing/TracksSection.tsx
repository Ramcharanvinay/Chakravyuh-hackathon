import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Rocket, Cpu, Coins, Leaf, ArrowRight, ChevronRight, Lock } from 'lucide-react';
import { HACKATHON_CONFIG } from '../../config/hackathonConfig';

const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
};

export const TracksSection: React.FC = () => {
  const { ref, inView } = useInView();
  const navigate = useNavigate();
  const tracks = HACKATHON_CONFIG.tracks;

  const getTrackIcon = (iconName: string, accentColor: string) => {
    const props = { className: "w-5 h-5", style: { color: accentColor } };
    switch (iconName) {
      case 'Shield': return <Shield {...props} />;
      case 'Rocket': return <Rocket {...props} />;
      case 'Cpu':    return <Cpu {...props} />;
      case 'Coins':  return <Coins {...props} />;
      case 'Leaf':   return <Leaf {...props} />;
      default:       return <Shield {...props} />;
    }
  };

  return (
    <section id="tracks" className="relative py-28 bg-[#0D0E11] overflow-hidden border-t border-[#302920]/40">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-ancient-grid opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#C6A15B]/3 blur-[140px]" />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-[#C6A15B] text-xs font-mono tracking-[0.28em] uppercase mb-3">HACKATHON TRACKS</p>
          <h2 className="font-cinzel font-black text-4xl sm:text-5xl text-[#F0E6D1]">
            CHOOSE YOUR <span className="text-[#E0BC70]">BATTLE</span>
          </h2>
          <p className="mt-4 text-[#898174] max-w-xl mx-auto text-base leading-relaxed">
            Five tracks. Ten challenges each. Fifty pathways to victory. Select your arena and define your legacy.
          </p>
          <div className="mt-6 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-[#C6A15B] to-transparent" />
        </div>

        {/* Five Track Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track, idx) => (
            <div
              key={track.id}
              className={`group relative rounded-2xl bg-[#121318] border border-[#302920] hover:border-[#806638] p-7 flex flex-col justify-between transition-all duration-300 hover:bg-[#17171B] shadow-[0_10px_30px_rgba(0,0,0,0.6)] ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: inView ? `${idx * 80}ms` : '0ms' }}
            >
              {/* Corner Bracket Accent */}
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#806638]/40 group-hover:border-[#C6A15B] transition-colors" />

              <div>
                {/* Header: Track Number & Sanskrit Name Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-[#08090B] border border-[#302920] flex items-center justify-center">
                      {getTrackIcon(track.iconName, track.accentColor)}
                    </div>
                    <div>
                      <span className="font-cinzel font-bold text-xs tracking-widest text-[#C6A15B]">
                        GATE 0{track.displayOrder}
                      </span>
                      <h4 className="font-cinzel font-black text-lg text-[#F0E6D1] leading-none">
                        {track.name}
                      </h4>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider bg-[#08090B] border border-[#302920] text-[#C7BDA9]">
                    10 Challenges
                  </span>
                </div>

                {/* Official Title */}
                <h3 className="font-cinzel font-bold text-xl text-[#F0E6D1] mb-2 group-hover:text-[#E0BC70] transition-colors">
                  {track.officialTitle}
                </h3>

                {/* Description */}
                <p className="text-[#898174] text-xs leading-relaxed mb-4 line-clamp-3">
                  {track.description}
                </p>

                {/* Motto */}
                {track.motto && (
                  <div className="border-l-2 border-[#806638]/60 pl-3 py-1 mb-6">
                    <p className="text-[11px] font-serif italic text-[#C7BDA9]/80">
                      "{track.motto}"
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#08090B] border border-[#302920] group-hover:border-[#806638] group-hover:bg-[#121318] text-[#C7BDA9] group-hover:text-[#E0BC70] text-xs font-cinzel font-semibold tracking-wider transition-all mt-2"
              >
                <span>ENTER TRACK ARENA</span>
                <ChevronRight className="w-4 h-4 text-[#C6A15B] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}

          {/* 6th Card: Grand Total / All Tracks Overview */}
          <div
            className={`relative rounded-2xl bg-[#08090B] border border-[#302920] p-7 flex flex-col justify-between transition-all duration-300 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: inView ? `${5 * 80}ms` : '0ms' }}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#121318] border border-[#806638]/50 flex items-center justify-center mb-4 text-[#C6A15B]">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-cinzel text-xs text-[#C6A15B] tracking-widest uppercase">Formation Overview</span>
              <h3 className="font-cinzel font-black text-2xl text-[#F0E6D1] mt-1 mb-3">
                THE SACRED BATTLEFIELD
              </h3>
              <p className="text-[#898174] text-xs leading-relaxed mb-4">
                Each team chooses one battle track and commits to a single challenge statement.
                Once locked in the Chakravyuh, your path is forged.
              </p>
              <div className="space-y-2 pt-2 border-t border-[#302920]/60">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#898174]">Total Battle Tracks</span>
                  <span className="text-[#F0E6D1] font-bold">5 Tracks</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#898174]">Problem Statements</span>
                  <span className="text-[#C6A15B] font-bold">50 Challenges</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#898174]">Max Team Size</span>
                  <span className="text-[#E0BC70] font-bold">4 Warriors</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-xl bg-[#C6A15B] hover:bg-[#E0BC70] text-[#08090B] text-xs font-cinzel font-bold tracking-wider transition-all mt-6 shadow-[0_0_15px_rgba(198,161,91,0.2)]"
            >
              ENLIST YOUR SQUAD
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TracksSection;
