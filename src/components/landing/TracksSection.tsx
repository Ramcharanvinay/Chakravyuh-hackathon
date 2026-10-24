import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Satellite, Atom, Wallet, Leaf, ArrowRight, ChevronRight } from 'lucide-react';
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

  const getTrackIcon = (themeKey: string) => {
    const props = { className: "w-5 h-5" };
    switch (themeKey) {
      case 'agni':  return <ShieldCheck {...props} className="w-5 h-5 text-[#FF453A]" />;
      case 'vayu':  return <Satellite {...props} className="w-5 h-5 text-[#0EA5E9]" />;
      case 'vajra': return <Atom {...props} className="w-5 h-5 text-[#8B5CF6]" />;
      case 'surya': return <Wallet {...props} className="w-5 h-5 text-[#F59E0B]" />;
      case 'vanam': return <Leaf {...props} className="w-5 h-5 text-[#10B981]" />;
      default:      return <ShieldCheck {...props} className="w-5 h-5 text-white" />;
    }
  };

  const getTrackAccentBorder = (themeKey: string) => {
    switch (themeKey) {
      case 'agni':  return 'group-hover:border-[#FF453A]/40';
      case 'vayu':  return 'group-hover:border-[#0EA5E9]/40';
      case 'vajra': return 'group-hover:border-[#8B5CF6]/40';
      case 'surya': return 'group-hover:border-[#F59E0B]/40';
      case 'vanam': return 'group-hover:border-[#10B981]/40';
      default:      return 'group-hover:border-white/30';
    }
  };

  return (
    <section id="tracks" className="relative py-28 bg-[#08090C] overflow-hidden border-t border-white/[0.08]">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-tactical-grid opacity-30" />
      </div>

      <div ref={ref} className="relative z-10 max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Section Heading */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.1] bg-[#12141C] text-[10px] font-mono tracking-[0.24em] uppercase text-zinc-400 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />
              <span>THE FIVE BATTLE TRACKS</span>
            </div>

            <h2 className="font-cinzel font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
              SELECT YOUR SECTOR.<br />
              <span className="text-zinc-500 font-bold">50 PATHWAYS TO LEGACY.</span>
            </h2>

            <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed font-normal">
              Each track is engineered around frontier technologies. Ten curated challenges per track. Inspect the briefs, choose your battlefield, and enter the formation.
            </p>
          </div>

          <button
            onClick={() => navigate('/tracks')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/[0.15] bg-[#12141C] hover:bg-white hover:text-[#08090C] text-white font-mono text-xs uppercase tracking-[0.16em] font-bold transition-all shrink-0 cursor-pointer"
          >
            <span>VIEW ALL 50 CHALLENGES</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Five Track Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track, idx) => (
            <div
              key={track.id}
              onClick={() => navigate(`/theme/${track.slug}`)}
              className={`group relative rounded-2xl bg-[#12141C] border border-white/[0.08] ${getTrackAccentBorder(
                track.themeKey
              )} p-8 flex flex-col justify-between transition-all duration-300 hover:bg-[#161822] cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: inView ? `${idx * 80}ms` : '0ms' }}
            >
              <div>
                {/* Header: Track Number & Sanskrit Name Badge */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#08090C] border border-white/[0.08] flex items-center justify-center">
                      {getTrackIcon(track.themeKey)}
                    </div>
                    <div>
                      <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase block">
                        GATE 0{track.displayOrder}
                      </span>
                      <span className="font-cinzel font-black text-sm text-white uppercase tracking-wider">
                        {track.name}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider bg-[#08090C] border border-white/[0.08] text-zinc-400 font-semibold">
                    10 PROBLEMS
                  </span>
                </div>

                {/* Official Title */}
                <h3 className="font-cinzel font-black text-xl text-white mb-2 group-hover:text-zinc-200 transition-colors">
                  {track.officialTitle}
                </h3>

                {/* Description */}
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  {track.description}
                </p>

                {/* Motto */}
                <div className="p-3 rounded-lg bg-[#08090C] border border-white/[0.04] text-[11px] font-mono text-zinc-400 italic mb-6">
                  "{track.motto}"
                </div>
              </div>

              {/* Card Footer: Explore Track Action */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-zinc-400 group-hover:text-white transition-colors">
                <span className="font-mono text-[11px] tracking-widest uppercase font-semibold">
                  ENTER GATE 0{track.displayOrder}
                </span>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TracksSection;
