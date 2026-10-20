import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { Shield, Eye, EyeOff, Lock, Mail, Users, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { user, team, selection, submission, isLoading, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'register'>('register');
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to active stage immediately
  useEffect(() => {
    if (!isLoading && user && team) {
      if (submission) {
        navigate('/submit');
      } else if (selection) {
        navigate('/problems');
      } else {
        navigate('/tracks');
      }
    }
  }, [user, team, selection, submission, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        if (!teamName.trim()) {
          throw new Error('Please enter your warrior team name.');
        }
        if (!email.trim() || !email.includes('@')) {
          throw new Error('Please enter a valid email address.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        await signUp(email, password, teamName);
      } else {
        if (!email.trim() || !email.includes('@')) {
          throw new Error('Please enter your registered email address.');
        }
        if (!password) {
          throw new Error('Please enter your password.');
        }
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#08090D] flex flex-col justify-between overflow-hidden">
      {/* Dynamic Background Chakravyuh Formation */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute w-[650px] h-[650px] rounded-full bg-gold/5 blur-[120px]" />
        
        {/* Atmospheric slow-spinning ancient Chakravyuha backdrop */}
        <div className="w-[850px] h-[850px] opacity-[0.07] animate-spin-slow">
          <svg viewBox="-300 -300 600 600" className="w-full h-full text-gold">
            <circle cx="0" cy="0" r="280" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="16 8" />
            <circle cx="0" cy="0" r="240" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="0" cy="0" r="200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
            <circle cx="0" cy="0" r="160" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="0" cy="0" r="120" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 6" />
            <circle cx="0" cy="0" r="80" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="0" cy="0" r="40" fill="none" stroke="currentColor" strokeWidth="4" />
            <path
              d="M 0,-280 A 280,280 0 0,1 200,0 A 200,200 0 0,1 0,160 A 120,120 0 0,1 -80,0 A 40,40 0 0,1 0,-20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>

      {/* Top Banner / College Header */}
      <header className="relative z-10 w-full pt-8 pb-4 px-6 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-charcoal border border-gold/30 text-gold text-xs font-mono tracking-widest shadow-gold-subtle">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{HACKATHON_CONFIG.edition} • BATTLE FOR EXCELLENCE</span>
        </div>
        <h2 className="text-xs sm:text-sm font-semibold tracking-widest text-ivory-muted uppercase">
          {HACKATHON_CONFIG.collegeName}
        </h2>
        <span className="text-[11px] text-ivory-muted/60 tracking-wider">
          {HACKATHON_CONFIG.departmentName}
        </span>
      </header>

      {/* Center Arena Section: Split Screen on Large Screens */}
      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12">
        {/* Left Column: Epic Visual & Narrative */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 text-gold font-cinzel text-sm tracking-widest">
            <span className="w-8 h-[1px] bg-gold" />
            <span>SACRED FORMATION</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-6xl font-black text-ivory tracking-wider leading-tight">
            ENTER THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-ivory to-amber-500">
              CHAKRAVYUH
            </span>
          </h1>

          <p className="font-cinzel text-lg sm:text-xl text-ivory-muted italic max-w-lg">
            "Every great solution begins with the courage to enter."
          </p>

          <p className="text-sm text-ivory-muted/80 max-w-lg leading-relaxed">
            Inspired by the legendary strategic warfare labyrinth of the Mahabharata, the arena demands technological precision, tactical unity, and unyielding code. Choose your gate, lock your challenge, and emerge victorious.
          </p>

          {/* Quick Stats Pills */}
          <div className="grid grid-cols-3 gap-3 pt-2 w-full max-w-md">
            <div className="p-3 rounded-xl bg-charcoal/80 border border-charcoal-border text-center">
              <span className="font-cinzel text-xl font-bold text-gold block">7</span>
              <span className="text-[10px] text-ivory-muted uppercase tracking-wider">Concentric Rings</span>
            </div>
            <div className="p-3 rounded-xl bg-charcoal/80 border border-charcoal-border text-center">
              <span className="font-cinzel text-xl font-bold text-gold block">5</span>
              <span className="text-[10px] text-ivory-muted uppercase tracking-wider">Battle Tracks</span>
            </div>
            <div className="p-3 rounded-xl bg-charcoal/80 border border-charcoal-border text-center">
              <span className="font-cinzel text-xl font-bold text-gold block">50</span>
              <span className="text-[10px] text-ivory-muted uppercase tracking-wider">Challenges</span>
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Glassmorphic Login/Register Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="relative rounded-3xl bg-charcoal/90 border-2 border-gold/40 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(216,180,106,0.15)] overflow-hidden">
            {/* Ancient Indian Ornamental Corner Markers */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gold/60" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gold/60" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gold/60" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gold/60" />

            {/* Mode Switch Tabs */}
            <div className="flex rounded-xl bg-obsidian/80 border border-charcoal-border p-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-cinzel font-bold tracking-wider rounded-lg transition-all ${
                  mode === 'register'
                    ? 'bg-gold text-obsidian shadow-gold-subtle'
                    : 'text-ivory-muted hover:text-ivory'
                }`}
              >
                REGISTER TEAM
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                className={`flex-1 py-2 text-xs font-cinzel font-bold tracking-wider rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-gold text-obsidian shadow-gold-subtle'
                    : 'text-ivory-muted hover:text-ivory'
                }`}
              >
                SIGN IN
              </button>
            </div>

            {/* Form Title */}
            <div className="mb-6">
              <h2 className="font-cinzel text-xl font-bold text-ivory tracking-wide">
                {mode === 'register' ? 'Enlist Your Battle Squad' : 'Return to the Formation'}
              </h2>
              <p className="text-xs text-ivory-muted mt-1">
                {mode === 'register'
                  ? 'Associate one team leader account to navigate the Chakravyuh.'
                  : 'Access your team\'s locked track and solution chamber.'}
              </p>
            </div>

            {/* Error Notification */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 p-3 rounded-xl bg-ember/15 border border-ember/40 text-ember text-xs flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="leading-snug">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Team Name (Register Only) */}
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-cinzel text-ivory-muted mb-1.5 uppercase tracking-wider">
                    Team / Squad Name <span className="text-gold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold/60">
                      <Users className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g. Garuda Cyber Vanguard"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian/70 border border-charcoal-border focus:border-gold focus:ring-1 focus:ring-gold text-sm text-ivory placeholder-ivory-muted/40 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Team Leader Email */}
              <div>
                <label className="block text-xs font-cinzel text-ivory-muted mb-1.5 uppercase tracking-wider">
                  Team Leader Email <span className="text-gold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold/60">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="leader@college.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian/70 border border-charcoal-border focus:border-gold focus:ring-1 focus:ring-gold text-sm text-ivory placeholder-ivory-muted/40 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-cinzel text-ivory-muted mb-1.5 uppercase tracking-wider">
                  Secret Key / Password <span className="text-gold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold/60">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-obsidian/70 border border-charcoal-border focus:border-gold focus:ring-1 focus:ring-gold text-sm text-ivory placeholder-ivory-muted/40 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ivory-muted hover:text-gold transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-gold via-amber-400 to-gold text-obsidian font-cinzel font-bold text-xs tracking-widest flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-gold-glow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Lock className="w-4 h-4 animate-spin" />
                    <span>VERIFYING WITH ARENA...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'register' ? 'CROSS THE OUTER PERIMETER' : 'BREACH THE GATES'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={async () => {
                  const demoEmail = `warrior_${Math.floor(Math.random() * 8999 + 1000)}@chakravyuh.org`;
                  const demoTeam = `Garuda Squad ${Math.floor(Math.random() * 899 + 100)}`;
                  setIsSubmitting(true);
                  try {
                    await signUp(demoEmail, 'password123', demoTeam);
                  } catch (err: any) {
                    setError(err?.message || 'Demo registration failed.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="w-full py-2 px-3 rounded-xl bg-charcoal border border-gold/30 hover:border-gold text-gold/80 hover:text-gold text-xs font-mono tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>[QUICK SANDBOX ENTRY: ENLIST RANDOM SQUAD]</span>
              </button>
              <div className="text-center text-[11px] text-ivory-muted/60">
                Protected by Supabase Row-Level Security • One team per account
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 px-4 text-center text-xs text-ivory-muted/50 border-t border-charcoal-border/50">
        <span>© {HACKATHON_CONFIG.year} {HACKATHON_CONFIG.hackathonName} • {HACKATHON_CONFIG.collegeName}</span>
      </footer>
    </div>
  );
};
