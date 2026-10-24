import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { Shield, LogOut, CheckCircle, Lock, Compass, User, LogIn, ChevronRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { team, selection, submission, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/tracks');
  };

  const selectedTrack = selection
    ? HACKATHON_CONFIG.tracks.find(t => t.id === selection.trackId)
    : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#08090C]/90 backdrop-blur-xl">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Brand & College Title */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="relative w-10 h-10 rounded-xl bg-[#12141C] border border-white/[0.12] flex items-center justify-center p-2 group-hover:border-white/40 transition-all duration-300">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white animate-spin-slow">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
              <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 6" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="50" cy="50" r="6" fill="#FF3B30" />
              <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="1.5" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="1.5" />
            </svg>
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

        {/* Navigation & Team Status */}
        {team ? (
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Status Pills */}
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

            {/* Team Identity Card */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#12141C] border border-white/[0.1]">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-mono font-semibold text-white tracking-wide truncate max-w-[120px] sm:max-w-[180px]">
                  {team.teamName}
                </span>
                <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[120px] sm:max-w-[180px]">
                  {team.leaderEmail}
                </span>
              </div>
            </div>

            {/* Sign Out Action */}
            <button
              onClick={handleSignOut}
              title="Sign Out / Exit Squad Session"
              className="p-2.5 rounded-xl bg-[#12141C] border border-white/[0.1] text-zinc-400 hover:text-white hover:border-red-500/40 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
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
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
