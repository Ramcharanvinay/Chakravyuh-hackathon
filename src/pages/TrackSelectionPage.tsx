import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { Track } from '../types';
import { Navbar } from '../components/Navbar';
import { BannerDemo } from '../components/BannerDemo';
import { ProgressSteps } from '../components/ProgressSteps';
import { ChakravyuhWheel } from '../components/ChakravyuhWheel';
import {
  TrackCulturalBackground,
  AgniBackground,
  VajraBackground,
  VayuBackground,
  VanamBackground,
  SuryaBackground,
  PageCulturalAtmosphere,
} from '../components/cultural-backgrounds';
import { Flame, Zap, Wind, Trees, Sun, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export const TrackSelectionPage: React.FC = () => {
  const { team, selection, submission, isLoading } = useAuth();
  const navigate = useNavigate();

  const tracks = HACKATHON_CONFIG.tracks;
  const [selectedTrackId, setSelectedTrackId] = useState<string>(tracks[0].id);

  // Guard: Redirect to /login if not authenticated
  useEffect(() => {
    if (!isLoading && !team) {
      navigate('/login');
    }
  }, [team, isLoading, navigate]);

  // Guard: If team has already locked their choice, navigate them directly to locked problems or submission
  useEffect(() => {
    if (!isLoading && selection) {
      if (submission) {
        navigate('/submit');
      } else {
        navigate('/problems');
      }
    }
  }, [selection, submission, isLoading, navigate]);

  const selectedTrack = tracks.find(t => t.id === selectedTrackId) || tracks[0];

  const getTrackIcon = (iconName: string, accentColor: string) => {
    const props = { className: "w-5 h-5", style: { color: accentColor } };
    switch (iconName) {
      case 'Flame': return <Flame {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Wind': return <Wind {...props} />;
      case 'Trees': return <Trees {...props} />;
      case 'Sun': return <Sun {...props} />;
      default: return <Flame {...props} />;
    }
  };

  const handleContinue = () => {
    navigate(`/problems?track=${selectedTrackId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center text-gold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <span className="font-cinzel text-xs tracking-widest uppercase">Consulting Ancient Formation...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F3E8CF] flex flex-col justify-between relative">
      {/* Full-Page Animated Cultural Background — changes when a track/gate is selected */}
      <PageCulturalAtmosphere selectedTrackId={selectedTrackId} />

      <div className="relative z-10">
        <BannerDemo />
        <Navbar />
        <ProgressSteps currentStep={1} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Page Heading */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-mono tracking-[0.25em] text-gold uppercase font-semibold">
              STAGE 01 • CHAKRAVYUHA BATTLE FORMATION
            </span>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-ivory tracking-wide mt-2">
              ALIGN YOUR TRACK GATE
            </h1>
            <p className="text-xs sm:text-sm text-ivory-muted/80 mt-2 max-w-xl mx-auto leading-relaxed">
              Select one of the five ancient operational gates. The sacred formation will reorient, channeling your squad into the corresponding trial chamber.
            </p>
          </div>

          {/* Interactive Wheel & Track Selector Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left/Center: Interactive Chakravyuh Wheel (Figma Vector Artwork with 5 Operational Gates) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center py-2">
              <ChakravyuhWheel
                tracks={tracks}
                selectedTrackId={selectedTrackId}
                onSelectTrack={setSelectedTrackId}
                size={580}
              />
              <span className="text-[11px] text-ivory-muted/60 mt-3 font-mono text-center">
                Click any numbered gate marker on the wheel or a track card to rotate the formation
              </span>
            </div>

            {/* Right: Five Selectable Track Cards & Information Panel */}
            <div className="lg:col-span-5 flex flex-col space-y-3.5">
              <span className="text-xs font-mono text-gold tracking-widest uppercase font-semibold">
                AVAILABLE GATES (5 TRACKS)
              </span>

              {/* Five Track Cards */}
              <div className="space-y-2.5">
                {tracks.map((track, idx) => {
                  const isSelected = track.id === selectedTrackId;
                  return (
                    <motion.div
                      key={track.id}
                      onClick={() => setSelectedTrackId(track.id)}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                      className={`relative overflow-hidden p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                        isSelected
                          ? 'bg-charcoal/90 border-2 shadow-gold-subtle'
                          : 'bg-charcoal/60 border-charcoal-border hover:border-gold/30 hover:bg-charcoal/80'
                      }`}
                      style={{
                        borderColor: isSelected ? track.accentColor : undefined,
                      }}
                    >
                      {/* Real-Time Animated Cultural Background (Agni, Vajra, Vayu, Vanam, Surya) */}
                      <TrackCulturalBackground trackId={track.id} isSelected={isSelected} />

                      {/* Active indicator line */}
                      {isSelected && (
                        <div
                          className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full z-10"
                          style={{ backgroundColor: track.accentColor }}
                        />
                      )}

                      <div className="relative z-10 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border backdrop-blur-sm"
                            style={{
                              backgroundColor: `${track.accentColor}25`,
                              borderColor: `${track.accentColor}60`,
                            }}
                          >
                            {getTrackIcon(track.iconName, track.accentColor)}
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-obsidian/90 text-ivory-muted border border-charcoal-border backdrop-blur-sm">
                                {`GATE 0${idx + 1}`}
                              </span>
                              <h3 className="font-cinzel text-base font-bold text-ivory tracking-wide">
                                {track.name}
                              </h3>
                            </div>
                            <span className="text-[11px] text-ivory-muted/80 italic font-cinzel line-clamp-1 mt-0.5">
                              "{track.motto}"
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div
                            className="w-2.5 h-2.5 rounded-full animate-ping shrink-0 mt-2 z-10"
                            style={{ backgroundColor: track.accentColor }}
                          />
                        )}
                      </div>

                      <p className="relative z-10 text-xs text-ivory-muted/90 mt-2.5 line-clamp-2 leading-relaxed">
                        {track.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Selected Track Details & Continuation CTA */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-charcoal to-[#0A0D14] border border-gold/40 mt-3 shadow-gold-subtle">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-ivory-muted">Ready to Challenge:</span>
                    <span
                      className="font-cinzel font-bold text-sm"
                      style={{ color: selectedTrack.accentColor }}
                    >
                      {selectedTrack.name} (10 Problem Statements)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-gold via-amber-400 to-gold text-obsidian font-cinzel font-bold text-xs tracking-widest flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-gold-glow cursor-pointer"
                >
                  <span>CONTINUE TO PROBLEM STATEMENTS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer className="w-full py-6 text-center text-xs text-ivory-muted/40 border-t border-charcoal-border/40">
          <span>{HACKATHON_CONFIG.hackathonName} • {HACKATHON_CONFIG.collegeName}</span>
        </footer>
      </div>
    </div>
  );
};
