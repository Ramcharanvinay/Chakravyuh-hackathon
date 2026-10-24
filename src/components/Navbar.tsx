import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { Shield, LogOut, CheckCircle, Lock, Compass, LogIn } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { team, selection, submission, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const selectedTrack = selection
    ? HACKATHON_CONFIG.tracks.find(t => t.id === selection.trackId)
    : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#08090C]/90 backdrop-blur-xl">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Brand & College Title */}
        <Link to="/" className="flex items-center gap-3.5 group">
          {/* Animated Ancient Luxury Wheel Emblem */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
            <img
              src="/chakravyuh-luxury-wheel.svg"
              alt="Chakravyuh Emblem"
              className="w-full h-full object-contain animate-spin-wheel drop-shadow-[0_0_12px_rgba(216,180,106,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(216,180,106,0.8)] transition-all duration-300"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xl sm:text-2xl font-black tracking-[0.14em] text-white group-hover:text-zinc-200 transition-colors">
                CHAKRAVYUH
              </span>
            </div>
            <span className="font-mono text-[10px] font-semibold text-zinc-500 tracking-widest uppercase truncate max-w-[220px] sm:max-w-none">
              {HACKATHON_CONFIG.collegeName} • {HACKATHON_CONFIG.edition}
            </span>
          </div>
        </Link>

        {/* Navigation & Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Status Pills */}
          {team && (
            <div className="hidden md:flex items-center gap-2">
              {submission ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>SOLUTION COMMITTED</span>
                </div>
              ) : selection ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12141C] border border-white/[0.12] text-xs font-mono">
                  <Lock className="w-3 h-3 text-[#FF3B30]" />
                  <span className="text-zinc-400">LOCKED:</span>
                  <span className="text-white font-bold">{selectedTrack?.officialTitle || selectedTrack?.name}</span>
                </div>
              ) : (
                <Link
                  to="/tracks"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12141C] border border-white/[0.1] text-xs font-mono text-zinc-400 hover:text-white"
                >
                  <Compass className="w-3.5 h-3.5 text-zinc-400 animate-spin-slow" />
                  <span>SELECT TRACK GATE</span>
                </Link>
              )}
            </div>
          )}

          {/* Collaborated Clubs Logo: ACS X IQUEST */}
          <div className="flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-xl bg-[#12141C] border border-white/[0.1] shadow-sm">
            {/* ACS Logo */}
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden bg-[#3428d8] border border-indigo-400/30 flex items-center justify-center p-0.5 shadow-sm">
                <img
                  src="/acs.jpeg"
                  alt="ACS Club Logo"
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
              <span className="font-mono font-bold text-xs tracking-wider text-zinc-200">
                ACS
              </span>
            </div>

            {/* Theme-matching X separator */}
            <span className="font-cinzel font-black text-xs sm:text-sm text-gold select-none px-0.5 drop-shadow-[0_0_8px_rgba(216,180,106,0.4)]">
              ✕
            </span>

            {/* IQUEST Logo */}
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden bg-white border border-white/40 flex items-center justify-center p-0.5 shadow-sm">
                <img
                  src="/iquest.jpeg"
                  alt="IQUEST Club Logo"
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
              <span className="font-mono font-bold text-xs tracking-wider text-zinc-200">
                IQUEST
              </span>
            </div>
          </div>

          {/* Team Identity Card (when logged in) */}
          {team && (
            <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#12141C] border border-white/[0.1]">
              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-mono font-semibold text-white tracking-wide truncate max-w-[120px] sm:max-w-[150px]">
                  {team.teamName}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[120px] sm:max-w-[150px]">
                  {team.leaderEmail}
                </span>
              </div>
            </div>
          )}

          {/* Action Button: Sign Out if team exists, or Enter Arena */}
          {team ? (
            <button
              onClick={handleSignOut}
              title="Sign Out / Exit Squad Session"
              className="p-2.5 rounded-xl bg-[#12141C] border border-white/[0.1] text-zinc-400 hover:text-white hover:border-red-500/40 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <>
              <Link
                to="/tracks"
                className="hidden sm:inline-flex px-4 py-2 rounded-full border border-white/[0.12] bg-[#12141C] hover:bg-white/[0.06] text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all"
              >
                EXPLORE TRACKS
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#08090C] hover:bg-zinc-200 active:scale-[0.98] font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)] cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>SQUAD SIGN IN</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
