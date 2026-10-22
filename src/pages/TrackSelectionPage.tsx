import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { Navbar } from '../components/Navbar';
import { BannerDemo } from '../components/BannerDemo';
import { ProgressSteps } from '../components/ProgressSteps';
import { ChakravyuhWheel3D } from '../components/ChakravyuhWheel3D';
import { PageCulturalAtmosphere } from '../components/cultural-backgrounds';
import {
  ShieldCheck,
  Satellite,
  Atom,
  Wallet,
  Zap,
  ArrowRight,
  Lock,
} from 'lucide-react';

// Sleek, modern, domain-accurate vector artwork on the right side of each theme card
const ThemeDomainArtwork: React.FC<{ themeKey: string; accentColor: string; isSelected: boolean }> = ({
  themeKey,
  accentColor,
  isSelected,
}) => {
  const normKey = (themeKey || '').toLowerCase();

  // 01: Cybersecurity & Blockchain
  if (normKey === 'agni' || normKey.includes('cyber') || normKey.includes('blockchain')) {
    return (
      <div
        className={`absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 w-28 h-24 sm:w-36 sm:h-28 pointer-events-none transition-all duration-500 ${
          isSelected ? 'opacity-90 scale-105' : 'opacity-35 hover:opacity-55'
        }`}
      >
        <svg viewBox="0 0 160 120" fill="none" className="w-full h-full">
          {/* Cyber-defense Cryptographic Shield */}
          <path
            d="M80 12L124 28V68C124 96 80 114 80 114C80 114 36 96 36 68V28L80 12Z"
            stroke={accentColor}
            strokeWidth="1.8"
            fill={`${accentColor}15`}
          />
          {/* Internal Security Grid */}
          <path d="M80 32V94M52 60H108" stroke={accentColor} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
          {/* Central Cryptographic Lock */}
          <rect x="70" y="52" width="20" height="18" rx="3" fill="#10131B" stroke={accentColor} strokeWidth="1.6" />
          <path d="M74 52V46C74 42.7 76.7 40 80 40C83.3 40 86 42.7 86 46V52" stroke={accentColor} strokeWidth="1.6" fill="none" />
          <circle cx="80" cy="61" r="2" fill={accentColor} />
          {/* Blockchain Node Blocks */}
          <rect x="14" y="24" width="18" height="18" rx="3" stroke={accentColor} strokeWidth="1.2" fill="#10131B" />
          <line x1="32" y1="33" x2="48" y2="40" stroke={accentColor} strokeWidth="1.2" strokeDasharray="2 2" />
          <rect x="128" y="24" width="18" height="18" rx="3" stroke={accentColor} strokeWidth="1.2" fill="#10131B" />
          <line x1="112" y1="40" x2="128" y2="33" stroke={accentColor} strokeWidth="1.2" strokeDasharray="2 2" />
          <rect x="126" y="80" width="18" height="18" rx="3" stroke={accentColor} strokeWidth="1.2" fill="#10131B" />
          <line x1="108" y1="80" x2="126" y2="88" stroke={accentColor} strokeWidth="1.2" strokeDasharray="2 2" />
          {/* Status Nodes */}
          <circle cx="80" cy="12" r="2.5" fill="#FFF" />
          <circle cx="124" cy="28" r="2" fill={accentColor} />
          <circle cx="36" cy="28" r="2" fill={accentColor} />
        </svg>
      </div>
    );
  }

  // 02: Space Technology
  if (normKey === 'vayu' || normKey.includes('space')) {
    return (
      <div
        className={`absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 w-28 h-24 sm:w-36 sm:h-28 pointer-events-none transition-all duration-500 ${
          isSelected ? 'opacity-90 scale-105' : 'opacity-35 hover:opacity-55'
        }`}
      >
        <svg viewBox="0 0 160 120" fill="none" className="w-full h-full">
          {/* Orbital Trajectory Ellipse */}
          <ellipse cx="80" cy="64" rx="66" ry="26" stroke={accentColor} strokeWidth="1.2" strokeDasharray="5 3" transform="rotate(-18 80 64)" opacity="0.65" />
          {/* Planetary Horizon Glow */}
          <circle cx="50" cy="74" r="22" fill={`${accentColor}12`} stroke={accentColor} strokeWidth="1.4" />
          <ellipse cx="50" cy="74" rx="28" ry="8" stroke={accentColor} strokeWidth="1" strokeDasharray="3 2" transform="rotate(20 50 74)" opacity="0.5" />
          {/* Modern Aerospace Satellite */}
          <g transform="translate(108, 40) rotate(22)">
            {/* Satellite Body */}
            <rect x="-10" y="-8" width="20" height="16" rx="3" fill="#10131B" stroke={accentColor} strokeWidth="1.6" />
            <circle cx="0" cy="0" r="3.5" fill={accentColor} opacity="0.9" />
            {/* Left Solar Array Wing */}
            <rect x="-30" y="-7" width="18" height="14" rx="1.5" fill={`${accentColor}25`} stroke={accentColor} strokeWidth="1.2" />
            <line x1="-21" y1="-7" x2="-21" y2="7" stroke={accentColor} strokeWidth="1" />
            {/* Right Solar Array Wing */}
            <rect x="12" y="-7" width="18" height="14" rx="1.5" fill={`${accentColor}25`} stroke={accentColor} strokeWidth="1.2" />
            <line x1="21" y1="-7" x2="21" y2="7" stroke={accentColor} strokeWidth="1" />
            {/* Communication Antenna */}
            <path d="M0 -8 L0 -16" stroke={accentColor} strokeWidth="1.5" />
            <path d="M-6 -16 C-3 -19 3 -19 6 -16" stroke={accentColor} strokeWidth="1.5" fill="none" />
            <circle cx="0" cy="-18" r="2" fill="#FFF" />
          </g>
          {/* Telemetry Stars */}
          <circle cx="26" cy="24" r="1.5" fill="#FFF" opacity="0.8" />
          <circle cx="86" cy="18" r="1.5" fill="#FFF" opacity="0.6" />
          <circle cx="138" cy="90" r="1.8" fill={accentColor} opacity="0.7" />
        </svg>
      </div>
    );
  }

  // 03: Quantum Computing
  if (normKey === 'vajra' || normKey.includes('quantum')) {
    return (
      <div
        className={`absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 w-28 h-24 sm:w-36 sm:h-28 pointer-events-none transition-all duration-500 ${
          isSelected ? 'opacity-90 scale-105' : 'opacity-35 hover:opacity-55'
        }`}
      >
        <svg viewBox="0 0 160 120" fill="none" className="w-full h-full">
          {/* Quantum Superposition Intersecting Orbitals */}
          <ellipse cx="80" cy="60" rx="54" ry="19" stroke={accentColor} strokeWidth="1.5" />
          <ellipse cx="80" cy="60" rx="54" ry="19" stroke={accentColor} strokeWidth="1.5" transform="rotate(60 80 60)" />
          <ellipse cx="80" cy="60" rx="54" ry="19" stroke={accentColor} strokeWidth="1.5" transform="rotate(-60 80 60)" />
          {/* Central Qubit Core */}
          <circle cx="80" cy="60" r="18" fill={`${accentColor}20`} stroke={accentColor} strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="80" cy="60" r="8" fill={accentColor} />
          <circle cx="80" cy="60" r="3.5" fill="#FFF" />
          {/* Entangled Qubits on Orbitals */}
          <circle cx="126" cy="46" r="3.5" fill="#FFF" stroke={accentColor} strokeWidth="1.5" />
          <circle cx="48" cy="85" r="3.5" fill="#FFF" stroke={accentColor} strokeWidth="1.5" />
          <circle cx="62" cy="24" r="3" fill={accentColor} />
          <circle cx="98" cy="96" r="3" fill={accentColor} />
          {/* Quantum Wave Interference Lattice */}
          <path d="M18 60 Q34 46 50 60 T82 60 T114 60 T146 60" stroke={accentColor} strokeWidth="0.9" strokeDasharray="2 2" opacity="0.4" />
        </svg>
      </div>
    );
  }

  // 04: FinTech
  if (normKey === 'surya' || normKey.includes('fintech')) {
    return (
      <div
        className={`absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 w-28 h-24 sm:w-36 sm:h-28 pointer-events-none transition-all duration-500 ${
          isSelected ? 'opacity-90 scale-105' : 'opacity-35 hover:opacity-55'
        }`}
      >
        <svg viewBox="0 0 160 120" fill="none" className="w-full h-full">
          {/* Financial Growth Vector Trendline with Gradient Fill */}
          <path d="M22 92 L54 70 L78 80 L112 44 L142 26" stroke={accentColor} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 92 L54 70 L78 80 L112 44 L142 26 V102 H22 Z" fill={`${accentColor}14`} />
          <circle cx="142" cy="26" r="4.5" fill="#FFF" stroke={accentColor} strokeWidth="2" />
          {/* Digital Currency Token Coin */}
          <g transform="translate(50, 42)">
            <polygon points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8" fill="#10131B" stroke={accentColor} strokeWidth="1.6" />
            <path d="M0 -9 V9 M-5 -4 H5 M-5 1 H4" stroke={accentColor} strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="0" cy="0" r="1.5" fill="#FFF" />
          </g>
          {/* Algorithmic Transaction Bar Metrics */}
          <rect x="88" y="76" width="6" height="26" rx="2" fill={`${accentColor}40`} stroke={accentColor} strokeWidth="1" />
          <rect x="98" y="64" width="6" height="38" rx="2" fill={`${accentColor}60`} stroke={accentColor} strokeWidth="1" />
          <rect x="108" y="52" width="6" height="50" rx="2" fill={accentColor} />
          {/* Connected Network Nodes */}
          <circle cx="54" cy="70" r="2.5" fill={accentColor} />
          <circle cx="78" cy="80" r="2.5" fill={accentColor} />
          <circle cx="112" cy="44" r="3" fill="#FFF" />
          <line x1="64" y1="42" x2="88" y2="42" stroke={accentColor} strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
        </svg>
      </div>
    );
  }

  // 05: Energy & Sustainability
  return (
    <div
      className={`absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 w-28 h-24 sm:w-36 sm:h-28 pointer-events-none transition-all duration-500 ${
        isSelected ? 'opacity-90 scale-105' : 'opacity-35 hover:opacity-55'
      }`}
    >
      <svg viewBox="0 0 160 120" fill="none" className="w-full h-full">
        {/* High-Voltage Clean Energy Lightning Surge */}
        <path
          d="M72 16 L48 60 H68 L58 104 L96 52 H76 L90 16 Z"
          stroke={accentColor}
          strokeWidth="2"
          fill={`${accentColor}20`}
          strokeLinejoin="round"
        />
        {/* Eco Leaf Circuit Veins */}
        <path
          d="M128 32 C102 32 88 56 88 84 C114 84 140 74 140 48 C140 36 135 32 128 32 Z"
          stroke={accentColor}
          strokeWidth="1.8"
          fill={`${accentColor}14`}
        />
        <path d="M88 84 C100 70 116 54 134 46" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="102" y1="72" x2="114" y2="78" stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="114" y1="60" x2="128" y2="65" stroke={accentColor} strokeWidth="1.2" strokeLinecap="round" />
        {/* Renewable Energy Grid Nodes */}
        <circle cx="120" cy="88" r="9" fill="none" stroke={accentColor} strokeWidth="1.3" strokeDasharray="3 2" />
        <circle cx="120" cy="88" r="3" fill="#FFF" />
        <circle cx="72" cy="16" r="2.5" fill="#FFF" />
        <circle cx="58" cy="104" r="2.5" fill={accentColor} />
      </svg>
    </div>
  );
};

export const TrackSelectionPage: React.FC = () => {
  const { team, selection, submission, isLoading } = useAuth();
  const navigate = useNavigate();

  const tracks = HACKATHON_CONFIG.tracks;

  // Find locked track if team has already committed their selection
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

  // When selection is present, lock the wheel & selector to their locked theme gate
  useEffect(() => {
    if (selection?.trackId) {
      setSelectedTrackId(selection.trackId);
    }
  }, [selection]);

// No login redirect - open arena directly

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
    if (selection) {
      // Team choice is locked. Re-selection of other tracks is disabled.
      return;
    }
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
    if (submission) {
      navigate('/submit');
    } else {
      navigate(`/theme/${selectedTrack.slug}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center text-gold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <span className="font-cinzel text-xs tracking-widest uppercase">Consulting The Chakravyuh...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F3E8CF] flex flex-col justify-between relative overflow-hidden">
      {/* Real-time Theme Atmosphere */}
      <PageCulturalAtmosphere selectedTrackId={selectedTrack.id} />

      <div className="relative z-10">
        <BannerDemo />
        <Navbar />
        <ProgressSteps currentStep={1} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-6">
            <span className="text-xs font-sans font-semibold tracking-[0.25em] text-gold uppercase">
              {selection ? 'STAGE 01 • STRATEGIC FORMATION ALIGNMENT (LOCKED)' : 'STAGE 01 • STRATEGIC FORMATION ALIGNMENT'}
            </span>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-ivory tracking-wide mt-2">
              {selection ? 'YOUR LOCKED THEME GATE' : 'ALIGN YOUR THEME GATE'}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ivory-muted/90 mt-2 max-w-xl mx-auto leading-relaxed">
              {submission
                ? 'Your squad has completed problem statement submission for this theme. Your assigned theme gate is permanently locked in the arena records.'
                : selection
                ? 'Your squad has officially committed to this theme gate. Track re-selection is locked. You may inspect your theme challenges or proceed to submission.'
                : "Select one of the five strategic hackathon themes below. The circular formation will reorient, unlocking your squad's dedicated 10-problem challenge chamber."}
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
                isLocked={Boolean(selection)}
              />
            </div>

            {/* Right: Five Selectable Theme Cards */}
            <div className="lg:col-span-5 flex flex-col space-y-3.5">
              <span className="text-xs font-sans font-semibold text-gold tracking-widest uppercase">
                OFFICIAL HACKATHON THEMES (5 DOMAINS)
              </span>

              {/* Five Theme Cards */}
              <div className="space-y-2.5">
                {tracks.map((track, idx) => {
                  const isLockedTrack = Boolean(selection && (track.id === selection.trackId || track.slug === selection.trackId));
                  const isOtherLockedOut = Boolean(selection && !isLockedTrack);
                  const isSelected = track.id === selectedTrack.id;

                  return (
                    <motion.div
                      key={track.id}
                      onClick={() => handleSelectTrack(track.id)}
                      whileHover={!selection ? { x: 5 } : undefined}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className={`relative overflow-hidden p-3.5 sm:p-4 rounded-2xl transition-all duration-300 border ${
                        isLockedTrack
                          ? 'bg-charcoal/95 border-2 shadow-gold-glow ring-1 ring-gold/40 cursor-default'
                          : isOtherLockedOut
                          ? 'bg-charcoal/30 border-charcoal-border/40 opacity-40 cursor-not-allowed'
                          : isSelected
                          ? 'bg-charcoal/90 border-2 shadow-gold-subtle cursor-pointer'
                          : 'bg-charcoal/60 border-charcoal-border hover:border-gold/30 hover:bg-charcoal/80 cursor-pointer'
                      }`}
                      style={{
                        borderColor: isLockedTrack || isSelected ? track.accentColor : undefined,
                      }}
                    >
                      {/* Domain-Reflecting Modern Vector Artwork on Right Side */}
                      <ThemeDomainArtwork
                        themeKey={track.themeKey || track.slug}
                        accentColor={track.accentColor}
                        isSelected={isSelected}
                      />

                      {/* Active indicator line */}
                      {(isSelected || isLockedTrack) && (
                        <div
                          className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full z-10"
                          style={{ backgroundColor: track.accentColor }}
                        />
                      )}

                      <div className="relative z-10 flex items-start justify-between gap-3 max-w-[70%] sm:max-w-[75%]">
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
                              <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded bg-obsidian/90 text-ivory-muted border border-charcoal-border backdrop-blur-sm">
                                {`0${idx + 1}`}
                              </span>
                              <h3 className="font-cinzel text-base font-bold text-ivory tracking-wide">
                                {track.officialTitle}
                              </h3>
                            </div>
                            <span className="text-xs text-ivory-muted/80 font-sans italic line-clamp-1 mt-0.5">
                              "{track.motto}"
                            </span>
                          </div>
                        </div>

                        {isLockedTrack ? (
                          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold/20 border border-gold/50 text-gold text-[10px] font-sans font-bold uppercase tracking-wider shrink-0 mt-1 z-10">
                            <Lock className="w-3 h-3 text-gold" />
                            <span>LOCKED TRACK</span>
                          </div>
                        ) : isOtherLockedOut ? (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-charcoal border border-charcoal-border text-ivory-muted/50 text-[10px] font-sans shrink-0 mt-1 z-10">
                            <Lock className="w-2.5 h-2.5" />
                            <span>LOCKED</span>
                          </div>
                        ) : isSelected ? (
                          <div
                            className="w-2.5 h-2.5 rounded-full animate-ping shrink-0 mt-2 z-10"
                            style={{ backgroundColor: track.accentColor }}
                          />
                        ) : null}
                      </div>

                      <p className="relative z-10 text-xs sm:text-[13px] text-ivory-muted/90 font-sans font-normal mt-2 leading-relaxed max-w-[72%] sm:max-w-[78%]">
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
                    <span className="text-xs font-sans font-semibold text-ivory-muted uppercase tracking-wider">
                      {selection ? 'Locked Theme Gate:' : 'Ready to Inspect:'}
                    </span>
                    <span
                      className="font-cinzel font-bold text-sm"
                      style={{ color: selectedTrack.accentColor }}
                    >
                      {selectedTrack.officialTitle}
                    </span>
                  </div>
                  {selection && (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-sans font-semibold">
                      <Lock className="w-3 h-3" /> {submission ? 'SOLUTION SUBMITTED' : 'SELECTION LOCKED'}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full py-3.5 px-4 rounded-xl font-sans font-bold text-xs sm:text-sm tracking-widest text-obsidian uppercase transition-all duration-300 shadow-gold-glow flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, #D8B46A 0%, ${selectedTrack.accentColor} 100%)`,
                  }}
                >
                  <span>
                    {submission
                      ? 'VIEW FINAL SUBMISSION'
                      : selection
                      ? 'PROCEED TO LOCKED CHALLENGES'
                      : 'EXPLORE PROBLEM STATEMENTS'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <footer className="w-full py-6 text-center text-xs text-ivory-muted/40 border-t border-charcoal-border/40 mt-12">
        <span>{HACKATHON_CONFIG.hackathonName} • {HACKATHON_CONFIG.collegeName}</span>
      </footer>
    </div>
  );
};
