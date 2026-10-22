import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { Shield, LogOut, CheckCircle, Lock, Compass } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { team, selection, submission, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const selectedTrack = selection
    ? HACKATHON_CONFIG.tracks.find(t => t.id === selection.trackId)
    : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-charcoal-border/80 bg-[#08090D]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand & College Title */}
        <Link to="/tracks" className="flex items-center gap-3.5 group">
          {/* Animated Ancient Wheel Icon */}
          <div className="relative w-11 h-11 rounded-xl bg-charcoal-card border border-gold/40 flex items-center justify-center p-2 group-hover:border-gold transition-all duration-300 shadow-gold-subtle">
            <svg viewBox="0 0 100 100" className="w-full h-full text-gold animate-spin-slow">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
              <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 6" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
              <circle cx="50" cy="50" r="7" fill="currentColor" />
              <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="2" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xl sm:text-2xl font-black tracking-[0.15em] text-ivory group-hover:text-gold transition-colors">
                {HACKATHON_CONFIG.hackathonName}
              </span>
            </div>
            <span className="text-[11px] font-sans font-semibold text-gold/80 tracking-widest uppercase truncate max-w-[220px] sm:max-w-none">
              {HACKATHON_CONFIG.collegeName}
            </span>
          </div>
        </Link>

        {/* Navigation & Team Status */}
        {team ? (
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Status Pills */}
            <div className="hidden md:flex items-center gap-2">
              {submission ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="font-sans font-medium tracking-wide">Solution Submitted</span>
                </div>
              ) : selection ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal border border-gold/40 text-xs">
                  <Lock className="w-3 h-3 text-gold" />
                  <span className="text-ivory-muted font-sans font-semibold">Locked Track:</span>
                  <span className="font-cinzel text-gold font-bold">{selectedTrack?.officialTitle || selectedTrack?.name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal border border-charcoal-border text-xs text-ivory-muted">
                  <Compass className="w-3.5 h-3.5 text-gold animate-spin-slow" />
                  <span className="font-sans font-medium">Explore Themes</span>
                </div>
              )}
            </div>

            {/* Team Identity Card */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-charcoal-card border border-charcoal-border">
              <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-sans font-semibold text-ivory tracking-wide truncate max-w-[130px] sm:max-w-[180px]">
                  {team.teamName}
                </span>
                <span className="text-[10px] font-sans text-ivory-muted/60 truncate max-w-[130px] sm:max-w-[180px]">
                  {team.leaderEmail}
                </span>
              </div>
            </div>

            {/* Sign Out Action */}
            <button
              onClick={handleSignOut}
              title="Exit Arena / Sign Out"
              className="p-2.5 rounded-xl bg-charcoal-card border border-charcoal-border text-ivory-muted hover:text-ember hover:border-ember/40 hover:bg-ember/10 transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-gold/15 text-gold border border-gold/40 hover:bg-gold hover:text-obsidian font-sans text-xs tracking-widest font-bold uppercase transition-all duration-300 shadow-gold-subtle"
            >
              ENTER ARENA
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
