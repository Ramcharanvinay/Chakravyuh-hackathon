import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { Navbar } from '../components/Navbar';
import { BannerDemo } from '../components/BannerDemo';
import { ProgressSteps } from '../components/ProgressSteps';
import { ChakravyuhWheel3D } from '../components/ChakravyuhWheel3D';
import {
  TrackCulturalBackground,
  PageCulturalAtmosphere,
} from '../components/cultural-backgrounds';
import {
  ShieldCheck,
  Satellite,
  Atom,
  Wallet,
  Zap,
  ArrowRight,
} from 'lucide-react';

// Domain-Specific SVG Artwork Watermarks that directly reflect each theme
const ThemeDomainArtwork: React.FC<{ themeKey: string; accentColor: string }> = ({ themeKey, accentColor }) => {
  switch (themeKey) {
    case 'agni':
    case 'cybersecurity-blockchain':
      return (
        <svg viewBox="0 0 160 120" fill="none" className="absolute right-0 bottom-0 w-36 h-28 pointer-events-none opacity-20 transition-opacity duration-300">
          {/* Cryptographic Shield & Blockchain Block Nodes */}
          <path d="M80 15L120 32V68C120 95 80 112 80 112C80 112 40 95 40 68V32L80 15Z" stroke={accentColor} strokeWidth="1.8" fill={`${accentColor}12`} />
          <path d="M80 35V92M55 58H105" stroke={accentColor} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="80" cy="58" r="8" fill="#12141C" stroke={accentColor} strokeWidth="1.8" />
          <path d="M76 58L80 62L86 54" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="18" y="22" width="16" height="16" rx="3" stroke={accentColor} strokeWidth="1.2" fill="#12141C" />
          <line x1="34" y1="30" x2="48" y2="38" stroke={accentColor} strokeWidth="1.2" />
          <rect x="126" y="22" width="16" height="16" rx="3" stroke={accentColor} strokeWidth="1.2" fill="#12141C" />
          <line x1="112" y1="38" x2="126" y2="30" stroke={accentColor} strokeWidth="1.2" />
          <rect x="124" y="80" width="16" height="16" rx="3" stroke={accentColor} strokeWidth="1.2" fill="#12141C" />
          <line x1="105" y1="82" x2="124" y2="88" stroke={accentColor} strokeWidth="1.2" />
        </svg>
      );
    case 'vayu':
    case 'space-technology':
      return (
        <svg viewBox="0 0 160 120" fill="none" className="absolute right-0 bottom-0 w-36 h-28 pointer-events-none opacity-20 transition-opacity duration-300">
          {/* Satellite with Orbital Trajectory */}
          <ellipse cx="80" cy="65" rx="58" ry="24" stroke={accentColor} strokeWidth="1.2" strokeDasharray="4 3" transform="rotate(-18 80 65)" />
          <circle cx="80" cy="65" r="16" fill={`${accentColor}20`} stroke={accentColor} strokeWidth="1.5" />
          <g transform="translate(108, 42) rotate(24)">
            <rect x="-8" y="-6" width="16" height="12" rx="2" fill="#12141C" stroke={accentColor} strokeWidth="1.5" />
            <rect x="-24" y="-5" width="14" height="10" rx="1" fill={`${accentColor}30`} stroke={accentColor} strokeWidth="1" />
            <rect x="10" y="-5" width="14" height="10" rx="1" fill={`${accentColor}30`} stroke={accentColor} strokeWidth="1" />
            <line x1="0" y1="-6" x2="0" y2="-12" stroke={accentColor} strokeWidth="1.5" />
            <circle cx="0" cy="-13" r="2.5" fill={accentColor} />
          </g>
          <circle cx="32" cy="28" r="1.5" fill="#FFF" opacity="0.7" />
          <circle cx="50" cy="18" r="1" fill="#FFF" opacity="0.6" />
          <circle cx="138" cy="85" r="1.5" fill="#FFF" opacity="0.7" />
        </svg>
      );
    case 'vajra':
    case 'quantum-computing':
      return (
        <svg viewBox="0 0 160 120" fill="none" className="absolute right-0 bottom-0 w-36 h-28 pointer-events-none opacity-20 transition-opacity duration-300">
          {/* Quantum Atom Superposition Orbitals */}
          <ellipse cx="80" cy="60" rx="46" ry="16" stroke={accentColor} strokeWidth="1.4" />
          <ellipse cx="80" cy="60" rx="46" ry="16" stroke={accentColor} strokeWidth="1.4" transform="rotate(60 80 60)" />
          <ellipse cx="80" cy="60" rx="46" ry="16" stroke={accentColor} strokeWidth="1.4" transform="rotate(-60 80 60)" />
          <circle cx="80" cy="60" r="9" fill={accentColor} opacity="0.8" />
          <circle cx="80" cy="60" r="16" fill={`${accentColor}18`} stroke={accentColor} strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="118" cy="48" r="3" fill="#FFF" />
          <circle cx="52" cy="82" r="3" fill="#FFF" />
          <circle cx="65" cy="28" r="2.5" fill={accentColor} />
        </svg>
      );
    case 'surya':
    case 'fintech':
      return (
        <svg viewBox="0 0 160 120" fill="none" className="absolute right-0 bottom-0 w-36 h-28 pointer-events-none opacity-20 transition-opacity duration-300">
          {/* FinTech Growth Chart & Digital Currency Matrix */}
          <path d="M25 95L55 75L80 85L110 50L135 32" stroke={accentColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M25 95L55 75L80 85L110 50L135 32V105H25Z" fill={`${accentColor}12`} />
          <circle cx="135" cy="32" r="4.5" fill="#FFF" stroke={accentColor} strokeWidth="2" />
          <circle cx="48" cy="40" r="18" fill="#12141C" stroke={accentColor} strokeWidth="1.6" />
          <path d="M48 28V52M42 34H52C54.2 34 56 35.8 56 38C56 40.2 54.2 42 52 42H44C41.8 42 40 43.8 40 46C40 48.2 41.8 50 44 50H54" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M98 28C103 33 103 42 98 47" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M104 24C111 31 111 44 104 51" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </svg>
      );
    case 'vanam':
    case 'energy-sustainability':
      return (
        <svg viewBox="0 0 160 120" fill="none" className="absolute right-0 bottom-0 w-36 h-28 pointer-events-none opacity-20 transition-opacity duration-300">
          {/* Clean Energy Lightning Bolt & Sustainability Leaf Eco Grid */}
          <path d="M68 20L48 62H68L60 102L92 52H74L86 20Z" stroke={accentColor} strokeWidth="1.8" fill={`${accentColor}18`} strokeLinejoin="round" />
          <path d="M125 35C100 35 90 60 90 85C115 85 140 75 140 50C140 38 135 35 125 35Z" stroke={accentColor} strokeWidth="1.6" fill={`${accentColor}12`} />
          <path d="M90 85C102 70 118 55 135 48" stroke={accentColor} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="118" cy="88" r="8" fill="none" stroke={accentColor} strokeWidth="1.2" strokeDasharray="3 2" />
        </svg>
      );
    default:
      return null;
  }
};

export const TrackSelectionPage: React.FC = () => {
  const { team, selection, submission, isLoading } = useAuth();
  const navigate = useNavigate();

  const tracks = HACKATHON_CONFIG.tracks;
  const [selectedTrackId, setSelectedTrackId] = useState<string>(tracks[0].id);

  // Guard: Redirect to /login if not authenticated
  useEffect(() => {
    if (!isLoading && !team) {
      navigate('/login', { replace: true });
    }
  }, [team, isLoading, navigate]);

  // Guard: If team has already locked their choice, navigate them directly
  useEffect(() => {
    if (!isLoading && selection) {
      if (submission) {
        navigate('/submit', { replace: true });
      } else {
        const lockedTrack = tracks.find(t => t.id === selection.trackId);
        if (lockedTrack) {
          navigate(`/theme/${lockedTrack.slug}`, { replace: true });
        } else {
          navigate('/problems', { replace: true });
        }
      }
    }
  }, [selection, submission, isLoading, navigate, tracks]);

  const selectedTrack =
    tracks.find(
      t =>
        t.id === selectedTrackId ||
        t.slug === selectedTrackId ||
        t.themeKey === selectedTrackId ||
        t.id.toLowerCase() === selectedTrackId.toLowerCase()
    ) || tracks[0];

  const handleSelectTrack = (trackId: string) => {
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
    const props = { className: "w-5 h-5", style: { color: accentColor } };
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
    navigate(`/theme/${selectedTrack.slug}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center text-gold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <span className="font-cinzel text-xs tracking-widest uppercase">Consulting Formation Gates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F3E8CF] flex flex-col justify-between relative">
      {/* Full-Page Animated Atmosphere */}
      <PageCulturalAtmosphere selectedTrackId={selectedTrack.id} />

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
              ALIGN YOUR THEME GATE
            </h1>
            <p className="text-xs sm:text-sm text-ivory-muted/80 mt-2 max-w-xl mx-auto leading-relaxed">
              Select one of the five strategic hackathon themes below. The circular formation will reorient, unlocking your squad's dedicated 10-problem challenge chamber.
            </p>
          </div>

          {/* Interactive Wheel & Track Selector Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left/Center: Interactive Chakravyuh 3D Wheel (Full View & Enhanced 3D Quality) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center py-2 w-full">
              <ChakravyuhWheel3D
                tracks={tracks}
                selectedTrackId={selectedTrack.id}
                onSelectTrack={handleSelectTrack}
                height={540}
              />
            </div>

            {/* Right: Five Selectable Theme Cards */}
            <div className="lg:col-span-5 flex flex-col space-y-3.5">
              <span className="text-xs font-mono text-gold tracking-widest uppercase font-semibold">
                OFFICIAL HACKATHON THEMES (5 DOMAINS)
              </span>

              {/* Five Theme Cards */}
              <div className="space-y-2.5">
                {tracks.map((track, idx) => {
                  const isSelected = track.id === selectedTrack.id;
                  return (
                    <motion.div
                      key={track.id}
                      onClick={() => handleSelectTrack(track.id)}
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
                      <TrackCulturalBackground trackId={track.id} isSelected={isSelected} />

                      {/* Domain-Reflecting Vector Artwork Background */}
                      <ThemeDomainArtwork themeKey={track.themeKey || track.slug} accentColor={track.accentColor} />

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
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border backdrop-blur-sm shadow-inner"
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
                                {`0${idx + 1}`}
                              </span>
                              <h3 className="font-cinzel text-base font-bold text-ivory tracking-wide">
                                {track.officialTitle}
                              </h3>
                            </div>
                            <span className="text-[11px] text-ivory-muted/85 font-sans italic line-clamp-1 mt-0.5">
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
                    <span className="text-xs font-mono text-ivory-muted">Ready to Inspect:</span>
                    <span
                      className="font-cinzel font-bold text-sm"
                      style={{ color: selectedTrack.accentColor }}
                    >
                      {selectedTrack.officialTitle} (10 Problem Statements)
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-gold via-amber-400 to-gold text-obsidian font-cinzel font-bold text-xs tracking-widest flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-gold-glow cursor-pointer"
                >
                  <span>Explore Problem Statements</span>
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

export default TrackSelectionPage;
