import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { Navbar } from '../components/Navbar';
import { ProgressSteps } from '../components/ProgressSteps';
import { ChakravyuhWheel3D } from '../components/ChakravyuhWheel3D';
import {
  ShieldCheck,
  Satellite,
  Atom,
  Wallet,
  Zap,
  ArrowRight,
  Lock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const TrackSelectionPage: React.FC = () => {
  const { team, selection, submission, isLoading } = useAuth();
  const navigate = useNavigate();

  const tracks = HACKATHON_CONFIG.tracks;

  const lockedTrack = useMemo(() => {
    if (!selection) return null;
    return (
      tracks.find(
        t =>
          t.id === selection.trackId ||
          t.slug === selection.trackId ||
          t.themeKey === selection.trackId ||
          t.id.toLowerCase() === selection.trackId.toLowerCase()
      ) || null
    );
  }, [selection, tracks]);

  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    selection?.trackId || tracks[0].id
  );

  useEffect(() => {
    if (selection?.trackId) {
      setSelectedTrackId(selection.trackId);
    }
  }, [selection]);

  const selectedTrack =
    lockedTrack ||
    tracks.find(
      t =>
        t.id === selectedTrackId ||
        t.slug === selectedTrackId ||
        t.themeKey === selectedTrackId ||
        t.id.toLowerCase() === selectedTrackId.toLowerCase()
    ) ||
    tracks[0];

  const handleSelectTrack = (trackId: string) => {
    if (selection) return;
    const matched = tracks.find(
      t =>
        t.id === trackId ||
        t.slug === trackId ||
        t.themeKey === trackId ||
        t.id.toLowerCase() === trackId.toLowerCase()
    );
    setSelectedTrackId(matched ? matched.id : trackId);
  };

  const getTrackIcon = (iconName: string, accentColor: string) => {
    const props = { className: 'w-4 h-4', style: { color: accentColor } };
    switch (iconName) {
      case 'ShieldCheck':
      case 'Shield':
        return <ShieldCheck {...props} />;
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

  const handleContinue = () => {
    if (submission) {
      navigate('/submit');
    } else {
      navigate(`/theme/${selectedTrack.slug}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090C] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
            CALIBRATING ARENA FORMATION...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col justify-between relative overflow-hidden bg-dot-matrix">
      <div className="relative z-10">
        <Navbar />
        <ProgressSteps currentStep={1} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-zinc-300 uppercase">
                {selection ? 'FORMATION LOCKED // COMMITTED' : 'STAGE 01 // FORMATION GATEWAY'}
              </span>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white tracking-wide">
              {selection ? 'YOUR LOCKED BATTLE GATE' : 'CHOOSE YOUR BATTLE GATE'}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-zinc-400 mt-2 max-w-xl mx-auto leading-relaxed">
              {submission
                ? 'Your squad has completed problem statement submission. Your theme assignment is permanently sealed in the arena records.'
                : selection
                ? 'Your squad has officially committed to this theme gate. Re-selection is locked. Inspect your 10 challenges or submit your solution.'
                : 'Select one of the five strategic hackathon themes below to align the formation and unlock your dedicated 10-problem challenge chamber.'}
            </p>
          </div>

          {/* Interactive Formation & Editorial Track List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-2">
            {/* Left: Floating 3D Chakravyuh Kinetic Artifact (Zero border boxes) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center w-full">
              <ChakravyuhWheel3D
                tracks={tracks}
                selectedTrackId={selectedTrack.id}
                onSelectTrack={handleSelectTrack}
                isLocked={Boolean(selection)}
              />
            </div>

            {/* Right: High-Fashion Luxury Editorial Theme Selection */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
                <span className="text-xs font-mono font-bold text-zinc-400 tracking-widest uppercase">
                  OFFICIAL HACKATHON DOMAINS
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  5 TRACKS OPEN
                </span>
              </div>

              {/* Minimalist Editorial Track Rows */}
              <div className="space-y-1.5">
                {tracks.map((track, idx) => {
                  const isLockedTrack = Boolean(
                    selection && (track.id === selection.trackId || track.slug === selection.trackId)
                  );
                  const isOtherLockedOut = Boolean(selection && !isLockedTrack);
                  const isSelected = track.id === selectedTrack.id;

                  return (
                    <motion.div
                      key={track.id}
                      onClick={() => handleSelectTrack(track.id)}
                      whileHover={!selection ? { x: 3 } : undefined}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className={`relative px-3.5 py-2.5 sm:py-3 rounded-xl transition-all duration-200 border cursor-pointer ${
                        isLockedTrack
                          ? 'bg-white/[0.08] border-white/40 shadow-lg'
                          : isOtherLockedOut
                          ? 'bg-transparent border-white/[0.04] opacity-35 cursor-not-allowed'
                          : isSelected
                          ? 'bg-white/[0.06] border-white/30 shadow-lg'
                          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/20'
                      }`}
                      style={{
                        borderLeftColor: isSelected || isLockedTrack ? track.accentColor : undefined,
                        borderLeftWidth: isSelected || isLockedTrack ? '4px' : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors"
                            style={{
                              backgroundColor: isSelected ? `${track.accentColor}25` : `${track.accentColor}12`,
                              borderColor: isSelected ? `${track.accentColor}70` : `${track.accentColor}30`,
                            }}
                          >
                            {getTrackIcon(track.iconName, track.accentColor)}
                          </div>
                          <div>
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
                            <p className="text-[11px] text-zinc-400 font-sans line-clamp-1 mt-0.5">
                              {track.description}
                            </p>
                          </div>
                        </div>

                        {isLockedTrack ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-white font-bold shrink-0">
                            <Lock className="w-2.5 h-2.5" /> LOCKED
                          </span>
                        ) : isSelected ? (
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: track.accentColor }}
                          />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full py-3.5 px-6 rounded-xl font-mono font-bold text-xs sm:text-sm tracking-widest text-[#08090C] bg-white hover:bg-zinc-200 uppercase transition-all duration-300 shadow-[0_4px_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                >
                  <span>
                    {submission
                      ? 'VIEW FINAL SUBMISSION'
                      : selection
                      ? 'PROCEED TO LOCKED CHALLENGES'
                      : `INSPECT ${selectedTrack.officialTitle.toUpperCase()}`}
                  </span>
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
