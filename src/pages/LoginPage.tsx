import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Mail,
  Shield,
  AlertCircle,
  ArrowLeft,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  UserCheck,
  Zap,
  Plus,
  Trash2,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { TeamMember } from '../types';
import { RegistrationPendingError } from '../lib/dataService';
import { isSupabaseConfigured } from '../lib/supabase';
import { rosterError, MAX_EXTRA_MEMBERS, TEAM_MIN_SIZE, TEAM_MAX_SIZE } from '../lib/teamRules';

export const LoginPage: React.FC = () => {
  const { user, team, selection, submission, isLoading, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Only same-site absolute paths are valid redirect targets (blocks //host and scheme URLs)
  const rawRedirect = searchParams.get('redirect');
  const redirectTarget = rawRedirect && /^\/(?![/\\])/.test(rawRedirect) ? rawRedirect : null;

  // Mode: 'signin' | 'register'
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Register State
  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [leaderRegNo, setLeaderRegNo] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>([
    { name: '', email: '', role: 'Developer' },
  ]);

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to target or active stage
  useEffect(() => {
    if (!isLoading && user && team && !searchParams.get('manage')) {
      if (redirectTarget) {
        navigate(redirectTarget, { replace: true });
      } else if (submission) {
        navigate('/submit', { replace: true });
      } else if (selection) {
        navigate('/problems', { replace: true });
      } else {
        navigate('/tracks', { replace: true });
      }
    }
  }, [user, team, selection, submission, isLoading, navigate, redirectTarget, searchParams]);

  // Handle 1-Click Demo Squad Login
  const handleQuickDemoLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn('leader@apexpredators.io', 'squad2026');
    } catch (err: any) {
      setError(err?.message || 'Demo authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Sign In Submit
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const ident = signInIdentifier.trim();
    const pass = signInPassword.trim();

    if (!ident) {
      setError('Please provide your squad leader email or registration ID.');
      return;
    }
    if (!pass) {
      setError('Please provide your squad passcode.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(ident, pass);
    } catch (err: any) {
      setError(err?.message || 'Invalid squad credentials. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const tName = teamName.trim();
    const lName = leaderName.trim();
    const lReg = leaderRegNo.trim();
    const lEmail = leaderEmail.trim();
    const pass = registerPassword.trim();

    if (tName.length < 3) {
      setError('Squad name must be at least 3 characters long.');
      return;
    }
    if (!lName) {
      setError('Please provide team leader full name.');
      return;
    }
    if (!lReg) {
      setError('Please provide leader registration number (e.g. 23BCE1001).');
      return;
    }
    if (!lEmail || !lEmail.includes('@')) {
      setError('Please provide a valid leader email address.');
      return;
    }
    if (pass.length < 4) {
      setError('Passcode must be at least 4 characters.');
      return;
    }

    // Filter valid members
    const validMembers: TeamMember[] = members
      .filter((m) => m.name.trim() !== '')
      .map((m) => ({
        name: m.name.trim(),
        email: m.email?.trim() || undefined,
        role: m.role || 'Member',
      }));

    const rosterIssue = rosterError(validMembers);
    if (rosterIssue) {
      setError(rosterIssue);
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp(lEmail, pass, tName, {
        leaderName: lName,
        leaderPhone: lReg,
        members: validMembers,
      });
    } catch (err: any) {
      if (err instanceof RegistrationPendingError) {
        setNotice(err.message);
        setSignInIdentifier(lEmail);
        setAuthMode('signin');
      } else {
        setError(err?.message || 'Squad registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for dynamic member inputs
  const handleAddMember = () => {
    if (members.length >= MAX_EXTRA_MEMBERS) return; // Leader + 3 members = max 4
    setMembers([...members, { name: '', email: '', role: 'Developer' }]);
  };

  const handleRemoveMember = (idx: number) => {
    if (members.length <= 1) return; // a squad needs at least 2 people
    setMembers(members.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx: number, field: keyof TeamMember, val: string) => {
    const updated = [...members];
    updated[idx] = { ...updated[idx], [field]: val };
    setMembers(updated);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#08090C] text-[#F3F4F6] flex flex-col justify-between items-center px-4 py-8 overflow-x-hidden select-none">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-tactical-grid opacity-35" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#08090C]/70 to-[#08090C]" />
      </div>

      {/* Return to Landing Navigation */}
      <div className="w-full max-w-5xl flex items-center justify-between z-20 pt-2 pb-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-500 group-hover:-translate-x-1 group-hover:text-white transition-all" />
          <span>RETURN TO ARENA HOME</span>
        </Link>

        <div className="font-mono text-[10px] tracking-[0.24em] text-zinc-500 uppercase">
          VIT-AP UNIVERSITY • CHAKRAVYUH 2026
        </div>
      </div>

      {/* ── Central Authentication Card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[520px] rounded-3xl bg-[#10121A] border border-white/[0.12] shadow-[0_30px_70px_rgba(0,0,0,0.9)] p-6 sm:p-9 my-auto"
      >
        {/* If user is already authenticated and browsing login, show active profile status */}
        {user && team ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-xs tracking-widest text-zinc-300 uppercase font-bold">
                  SQUAD ACTIVE & VERIFIED
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-wider text-emerald-400 uppercase bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                AUTHENTICATED
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
              <div className="text-xs font-mono text-zinc-400 uppercase">Registered Squad</div>
              <div className="font-cinzel text-2xl font-black text-white">{team.teamName}</div>
              <div className="text-xs text-zinc-400">
                Leader: <span className="text-zinc-200 font-medium">{team.leaderName || team.leaderEmail}</span>
                {team.leaderPhone && (
                  <span className="text-zinc-500 font-mono ml-2">({team.leaderPhone})</span>
                )}
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (submission) navigate('/submit');
                  else if (selection) navigate('/problems');
                  else navigate('/tracks');
                }}
                className="w-full py-4 rounded-xl bg-white text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>CONTINUE TO ARENA STAGE</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </button>

              <button
                type="button"
                onClick={async () => {
                  await signOut();
                  navigate('/login', { replace: true });
                }}
                className="w-full py-3 rounded-xl border border-white/[0.1] hover:bg-white/[0.05] text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5 text-zinc-400" />
                <span>SWITCH SQUAD / SIGN OUT</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Top Eyebrow Tag */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/[0.08]">
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-400 uppercase font-semibold">
                  SQUAD VERIFICATION PORTAL
                </span>
              </div>

              <span className="font-mono text-[10px] tracking-wider text-zinc-500 uppercase">
                STAGE 01
              </span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-black/40 border border-white/[0.08] mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setError(null);
                }}
                className={`py-2 rounded-lg font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                SIGN IN SQUAD
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setError(null);
                }}
                className={`py-2 rounded-lg font-mono text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                REGISTER SQUAD
              </button>
            </div>

            {/* Header Titles */}
            <div className="mb-4">
              <h1 className="font-cinzel text-2xl sm:text-3xl text-white font-black tracking-wide">
                {authMode === 'signin' ? 'ENTER THE ARENA' : 'COMMISSION YOUR SQUAD'}
              </h1>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                {authMode === 'signin'
                  ? 'Access your squad formation, inspect challenges, and lock your battle gate.'
                  : 'Register your squad roster to enter the 48-hour national competition.'}
              </p>
            </div>

            {/* 1-Click Demo Squad Quick Evaluation Badge */}
            {authMode === 'signin' && !isSupabaseConfigured && (
              <div className="mb-5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-amber-300">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>EVALUATION DEMO SQUAD</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-sans">
                    Auto-fill and log in as <span className="text-white font-medium">Apex Predators</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 active:scale-95 text-black font-mono font-bold text-[10px] tracking-wider uppercase transition-all cursor-pointer shrink-0 disabled:opacity-50"
                >
                  1-CLICK LOGIN
                </button>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
                <p className="leading-relaxed">{error}</p>
              </div>
            )}

            {/* Info Notice */}
            {notice && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{notice}</p>
              </div>
            )}

            {/* Form Container */}
            <AnimatePresence mode="wait">
              {authMode === 'signin' ? (
                /* ── SIGN IN FORM ── */
                <motion.form
                  key="signin-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSignInSubmit}
                  className="space-y-3.5"
                >
                  <div className="space-y-1">
                    <label className="block font-mono text-[11px] font-semibold tracking-wider uppercase text-zinc-300">
                      Leader Email or Registration ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={signInIdentifier}
                        onChange={(e) => setSignInIdentifier(e.target.value)}
                        placeholder="e.g. leader@apexpredators.io or 23BCE1099"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#08090C] border border-white/[0.1] focus:border-white focus:ring-1 focus:ring-white text-xs sm:text-sm text-white placeholder-zinc-600 outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-mono text-[11px] font-semibold tracking-wider uppercase text-zinc-300">
                      Squad Passcode / Secret Key
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter squad passcode"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#08090C] border border-white/[0.1] focus:border-white focus:ring-1 focus:ring-white text-xs sm:text-sm text-white placeholder-zinc-600 outline-none transition-colors font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
                      >
                        {showSignInPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-3 py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-200 active:scale-[0.99] text-[#08090C] font-mono font-bold text-xs uppercase tracking-[0.2em] shadow-[0_4px_25px_rgba(255,255,255,0.12)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#08090C]" />
                        <span>AUTHENTICATING SQUAD...</span>
                      </>
                    ) : (
                      <span>SIGN IN TO SQUAD ARENA</span>
                    )}
                  </button>
                </motion.form>
              ) : (
                /* ── REGISTER FORM ── */
                <motion.form
                  key="register-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleRegisterSubmit}
                  className="space-y-3"
                >
                  {/* Squad Name */}
                  <div className="space-y-1">
                    <label className="block font-mono text-[11px] font-semibold tracking-wider uppercase text-zinc-300">
                      Squad / Team Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                        <Users className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Apex Predators"
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#08090C] border border-white/[0.1] focus:border-white focus:ring-1 focus:ring-white text-xs text-white placeholder-zinc-600 outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Leader Name and Reg No grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="block font-mono text-[11px] font-semibold tracking-wider uppercase text-zinc-300">
                        Leader Full Name
                      </label>
                      <input
                        type="text"
                        value={leaderName}
                        onChange={(e) => setLeaderName(e.target.value)}
                        placeholder="e.g. Arjun Sharma"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#08090C] border border-white/[0.1] focus:border-white focus:ring-1 focus:ring-white text-xs text-white placeholder-zinc-600 outline-none transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-mono text-[11px] font-semibold tracking-wider uppercase text-zinc-300">
                        Registration / Roll No.
                      </label>
                      <input
                        type="text"
                        value={leaderRegNo}
                        onChange={(e) => setLeaderRegNo(e.target.value)}
                        placeholder="e.g. 23BCE1099"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#08090C] border border-white/[0.1] focus:border-white focus:ring-1 focus:ring-white text-xs text-white placeholder-zinc-600 outline-none transition-colors font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Leader Email and Password grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="block font-mono text-[11px] font-semibold tracking-wider uppercase text-zinc-300">
                        Leader Email
                      </label>
                      <input
                        type="email"
                        value={leaderEmail}
                        onChange={(e) => setLeaderEmail(e.target.value)}
                        placeholder="arjun@vitap.ac.in"
                        className="w-full px-3.5 py-2 rounded-xl bg-[#08090C] border border-white/[0.1] focus:border-white focus:ring-1 focus:ring-white text-xs text-white placeholder-zinc-600 outline-none transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block font-mono text-[11px] font-semibold tracking-wider uppercase text-zinc-300">
                        Passcode (Min 4 chars)
                      </label>
                      <div className="relative">
                        <input
                          type={showRegisterPassword ? 'text' : 'password'}
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          placeholder="Passcode"
                          className="w-full pl-3 pr-8 py-2 rounded-xl bg-[#08090C] border border-white/[0.1] focus:border-white focus:ring-1 focus:ring-white text-xs text-white placeholder-zinc-600 outline-none transition-colors font-mono"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
                        >
                          {showRegisterPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Squad Members (Optional, up to 3) */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-[10px] font-semibold tracking-wider uppercase text-zinc-400">
                        Squad Members ({members.length + 1}/{TEAM_MAX_SIZE} including lead)
                      </label>
                      {members.length < MAX_EXTRA_MEMBERS && (
                        <button
                          type="button"
                          onClick={handleAddMember}
                          className="flex items-center gap-1 font-mono text-[10px] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>ADD MEMBER</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {members.map((m, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 p-1.5 rounded-lg bg-black/40 border border-white/[0.06]"
                        >
                          <input
                            type="text"
                            value={m.name}
                            onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                            required
                            placeholder={`Member ${idx + 2} Name`}
                            className="flex-1 px-2.5 py-1 rounded bg-transparent border border-white/[0.08] text-[11px] text-white placeholder-zinc-600 outline-none"
                          />
                          <input
                            type="text"
                            value={m.email || ''}
                            onChange={(e) => handleMemberChange(idx, 'email', e.target.value)}
                            placeholder="Email / Roll No."
                            className="flex-1 px-2.5 py-1 rounded bg-transparent border border-white/[0.08] text-[11px] text-white placeholder-zinc-600 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(idx)}
                            disabled={members.length <= 1}
                            title={members.length <= 1 ? `A squad needs at least ${TEAM_MIN_SIZE} people` : 'Remove member'}
                            className="p-1 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-zinc-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                    Squads have {TEAM_MIN_SIZE} to {TEAM_MAX_SIZE} people including the leader. After registering, only an admin can change your squad.
                  </p>

                  {/* Register Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-3 py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-200 active:scale-[0.99] text-[#08090C] font-mono font-bold text-xs uppercase tracking-[0.2em] shadow-[0_4px_25px_rgba(255,255,255,0.12)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#08090C]" />
                        <span>REGISTERING SQUAD...</span>
                      </>
                    ) : (
                      <span>REGISTER SQUAD & ENTER ARENA</span>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Security Note */}
            <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-center gap-2 text-xs text-zinc-500 font-mono text-[10px]">
              <Shield className="w-3.5 h-3.5 text-zinc-500" />
              <span>Persistent Squad Roster & Problem Lock Records</span>
            </div>
          </>
        )}
      </motion.div>

      {/* Footer Branding */}
      <div className="w-full text-center text-zinc-600 font-mono text-[10px] tracking-[0.25em] uppercase pt-4">
        CHAKRAVYUH HACKATHON • VIT-AP UNIVERSITY • POWERED BY UNSTOP
      </div>
    </div>
  );
};

export default LoginPage;
