import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { Navbar } from '../components/Navbar';
import { ChakravyuhWheel3D } from '../components/ChakravyuhWheel3D';
import { ShieldCheck, Satellite, Atom, Wallet, Zap, ArrowRight, ChevronRight } from 'lucide-react';

const getTrackIcon = (iconName: string, accentColor: string) => {
  const props = { className: 'w-4 h-4', style: { color: accentColor } };
  switch (iconName) {
    case 'Satellite':
    case 'Rocket':
      return <Satellite {...props} />;
    case 'Atom':
    case 'Cpu':
      return <Atom {...props} />;
    case 'Wallet':
    case 'Coins':
      return <Wallet {...props} />;
    case 'Zap':
    case 'Leaf':
      return <Zap {...props} />;
    default:
      return <ShieldCheck {...props} />;
  }
};

export const TrackSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const tracks = HACKATHON_CONFIG.tracks;
  const [selectedTrackId, setSelectedTrackId] = useState<string>(tracks[0].id);

  const selectedTrack = tracks.find(t => t.id === selectedTrackId) || tracks[0];

  // The 3D scene reports ids, slugs or theme keys; normalise to a track id.
  const handleSelectTrack = (trackId: string) => {
    const matched = tracks.find(
      t => t.id === trackId || t.slug === trackId || t.themeKey === trackId || t.id.toLowerCase() === trackId.toLowerCase()
    );
    setSelectedTrackId(matched ? matched.id : trackId);
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col justify-between relative overflow-hidden bg-dot-matrix">
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-zinc-300 uppercase">
                FORMATION GATEWAY // 5 BATTLE GATES
              </span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white tracking-wide">
              CHOOSE YOUR BATTLE GATE
            </h1>
            <p className="font-sans text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl mx-auto leading-relaxed">
              Pick one of the five themes to read its ten problem statements in full. Take your time and choose the
              challenge your squad wants to build.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-2">
            {/* Left: 3D gate models */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center w-full">
              <ChakravyuhWheel3D tracks={tracks} selectedTrackId={selectedTrack.id} onSelectTrack={handleSelectTrack} />
            </div>

            {/* Right: Track list */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
                <span className="text-xs font-mono font-bold text-zinc-400 tracking-widest uppercase">
                  OFFICIAL HACKATHON DOMAINS
                </span>
                <span className="text-[11px] font-mono text-zinc-500">5 TRACKS OPEN</span>
              </div>

              <div className="space-y-1.5">
                {tracks.map((track, idx) => {
                  const isSelected = track.id === selectedTrack.id;
                  return (
                    <motion.button
                      type="button"
                      key={track.id}
                      onClick={() => handleSelectTrack(track.id)}
                      onDoubleClick={() => navigate(`/theme/${track.slug}`)}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      aria-pressed={isSelected}
                      className={`w-full text-left relative px-3.5 py-2.5 sm:py-3 rounded-xl transition-all duration-200 border cursor-pointer ${
                        isSelected
                          ? 'bg-white/[0.06] border-white/30 shadow-lg'
                          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/20'
                      }`}
                      style={{
                        borderLeftColor: isSelected ? track.accentColor : undefined,
                        borderLeftWidth: isSelected ? '4px' : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors"
                            style={{
                              backgroundColor: isSelected ? `${track.accentColor}25` : `${track.accentColor}12`,
                              borderColor: isSelected ? `${track.accentColor}70` : `${track.accentColor}30`,
                            }}
                          >
                            {getTrackIcon(track.iconName, track.accentColor)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className="font-mono text-[11px] font-bold transition-colors"
                                style={{ color: isSelected ? track.accentColor : '#71717A' }}
                              >
                                {`0${idx + 1}`}
                              </span>
                              <h3 className="font-cinzel text-xs sm:text-sm font-bold text-white tracking-wide">
                                {track.officialTitle}
                              </h3>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-sans line-clamp-1 mt-0.5">{track.description}</p>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: track.accentColor }} />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => navigate(`/theme/${selectedTrack.slug}`)}
                  className="w-full py-3.5 px-6 rounded-xl font-mono font-bold text-xs sm:text-sm tracking-widest text-[#08090C] bg-white hover:bg-zinc-200 uppercase transition-all duration-300 shadow-[0_4px_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                >
                  <span>VIEW {selectedTrack.officialTitle.toUpperCase()} PROBLEMS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="w-full py-6 text-center text-xs text-zinc-500 border-t border-white/[0.08] mt-12 font-mono">
        <span>{HACKATHON_CONFIG.hackathonName} • {HACKATHON_CONFIG.collegeName}</span>
      </footer>
    </div>
  );
};

export default TrackSelectionPage;
