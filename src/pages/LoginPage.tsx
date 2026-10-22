import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { Users, Mail, Circle, Shield, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { user, team, selection, submission, isLoading, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to active stage immediately
  useEffect(() => {
    if (!isLoading && user && team) {
      if (submission) {
        navigate('/submit', { replace: true });
      } else if (selection) {
        navigate('/problems', { replace: true });
      } else {
        navigate('/tracks', { replace: true });
      }
    }
  }, [user, team, selection, submission, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTeam = teamName.trim();
    const trimmedEmail = email.trim();
    const trimmedReg = regNumber.trim();

    if (!trimmedTeam) {
      setError('Please enter your team name.');
      return;
    }
    if (!trimmedReg) {
      setError("Please enter team lead's registration number.");
      return;
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid registered email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Attempt sign in with email and registration number (used as verification secret)
      try {
        await signIn(trimmedEmail, trimmedReg);
      } catch (signInErr: any) {
        // 2. If team/account is not yet registered, register automatically
        const errMsg = (signInErr?.message || '').toLowerCase();
        if (
          errMsg.includes('invalid') ||
          errMsg.includes('not found') ||
          errMsg.includes('credentials') ||
          errMsg.includes('no team profile')
        ) {
          await signUp(trimmedEmail, trimmedReg, trimmedTeam, {
            leaderName: trimmedTeam,
            leaderPhone: trimmedReg,
          });
        } else {
          throw signInErr;
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#08090B] text-[#C7BDA9] flex flex-col justify-between items-center px-4 py-8 overflow-hidden select-none">

      {/* Return to Landing Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-sans font-medium tracking-wider text-[#898174]/70 hover:text-[#C6A15B] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#898174]/70 group-hover:-translate-x-1 transition-transform" />
          <span>RETURN TO ARENA</span>
        </Link>
      </div>

      {/* Atmospheric Background: Centered Ancient Formation Rings matching reference */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Subtle Ambient Gold Glow */}
        <div className="absolute w-[700px] h-[700px] rounded-full bg-[#C6A15B]/[0.03] blur-[150px]" />

        {/* Concentric Chakravyuh Maze Rings */}
        <div className="w-[1100px] h-[1100px] opacity-[0.11]">
          <svg viewBox="-550 -550 1100 1100" className="w-full h-full text-[#C6A15B]">
            {/* Outermost ring */}
            <circle cx="0" cy="0" r="500" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="30 20" />
            <circle cx="0" cy="0" r="430" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="140 10 40 10" />
            <circle cx="0" cy="0" r="360" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="290" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="80 15 20 15" />
            <circle cx="0" cy="0" r="230" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="170" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="40 12" />
            <circle cx="0" cy="0" r="120" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="0" cy="0" r="70" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="10 8" />

            {/* Radial battle-formation crosshairs */}
            <line x1="-540" y1="0" x2="540" y2="0" stroke="currentColor" strokeWidth="0.6" strokeDasharray="12 8" />
            <line x1="0" y1="-540" x2="0" y2="540" stroke="currentColor" strokeWidth="0.6" strokeDasharray="12 8" />
            <line x1="-380" y1="-380" x2="380" y2="380" stroke="currentColor" strokeWidth="0.4" strokeDasharray="6 14" opacity="0.6" />
            <line x1="380" y1="-380" x2="-380" y2="380" stroke="currentColor" strokeWidth="0.4" strokeDasharray="6 14" opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* Spacer to balance top & center */}
      <div className="w-full h-4" />

      {/* ── Central Authentication Card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[460px] rounded-2xl bg-[#0D0E12] border border-[#302920] shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-8 sm:p-10"
      >
        {/* Subtle Card Glow Frame */}
        <div className="absolute -inset-px rounded-2xl border border-[#806638]/20 pointer-events-none" />

        {/* Top Eyebrow Label */}
        <div className="text-center mb-3">
          <span className="text-[10px] font-sans tracking-[0.28em] text-[#C6A15B] uppercase font-semibold">
            CHAKRAVYUH • TEAM PORTAL
          </span>
        </div>

        {/* Header Title */}
        <div className="text-center mb-3">
          <h1 className="font-cinzel text-3xl sm:text-4xl text-[#F0E6D1] font-normal tracking-wide">
            WELCOME BACK
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-center mb-6 space-y-0.5">
          <p className="text-xs text-[#898174] leading-relaxed">
            The next chapter of your conquest awaits.
          </p>
          <p className="text-xs text-[#898174] leading-relaxed">
            Sign in to enter the arena.
          </p>
        </div>

        {/* Decorative Diamond Divider */}
        <div className="flex items-center justify-center gap-3 mb-7">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#806638]/60 to-[#806638]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#C6A15B] shadow-[0_0_6px_rgba(198,161,91,0.6)]" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent via-[#806638]/60 to-[#806638]" />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Field 1: Team Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#C7BDA9]">
              Team name:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#898174]">
                <Users className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team name"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090A0D] border border-[#252830] focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B] text-sm text-[#F0E6D1] placeholder-[#505460] outline-none transition-colors"
                autoComplete="organization"
              />
            </div>
          </div>

          {/* Field 2: Registration number of team lead */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#C7BDA9]">
              Registration number of team lead:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#898174]">
                <Circle className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="Enter team lead's registration number"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090A0D] border border-[#252830] focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B] text-sm text-[#F0E6D1] placeholder-[#505460] outline-none transition-colors"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Field 3: Team lead registration mail */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#C7BDA9]">
              Team lead registration mail:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#898174]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter team lead's registered email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#090A0D] border border-[#252830] focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B] text-sm text-[#F0E6D1] placeholder-[#505460] outline-none transition-colors"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D8B46A] via-[#E0BC70] to-[#C6A15B] hover:brightness-110 active:scale-[0.99] text-[#08090B] font-cinzel font-bold text-sm tracking-widest shadow-[0_4px_20px_rgba(198,161,91,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#08090B]" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <span>LOGIN</span>
            )}
          </button>
        </form>

        {/* Reserved Note */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-[#898174]">
          <Shield className="w-3.5 h-3.5 text-[#898174]" />
          <span>Reserved for registered teams</span>
        </div>
      </motion.div>

      {/* ── Footer Branding Line ── */}
      <footer className="relative z-10 mt-8 mb-2 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-[#806638]/50 to-[#806638]" />
          <div className="w-1 h-1 rotate-45 bg-[#C6A15B]" />
          <div className="h-px w-8 bg-gradient-to-l from-transparent via-[#806638]/50 to-[#806638]" />
        </div>
        <p className="text-[10px] text-[#898174] font-sans font-medium tracking-[0.25em] uppercase">
          CHAKRAVYUH HACKATHON • VIT-AP UNIVERSITY
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
