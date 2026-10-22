import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { Navbar } from '../components/Navbar';
import { BannerDemo } from '../components/BannerDemo';
import { ProgressSteps } from '../components/ProgressSteps';
import { SubmissionReceipt } from '../components/SubmissionReceipt';
import { 
  Github, 
  Lock, 
  Send, 
  AlertCircle, 
  ShieldCheck, 
  Check, 
  Globe, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const SubmissionPage: React.FC = () => {
  const { team, selection, submission, isLoading, submitSolution } = useAuth();
  const navigate = useNavigate();

  const [githubUrl, setGithubUrl] = useState('');
  const [deployedUrl, setDeployedUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmPledge, setConfirmPledge] = useState<boolean>(false);

  // Guarantee window is always at top (0, 0) when entering submission chamber
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Guards: If not authenticated, redirect to /login
  useEffect(() => {
    if (!isLoading && !team) {
      navigate('/login', { replace: true });
    }
  }, [team, isLoading, navigate]);

  // Guard: If team has NOT locked a selection yet, redirect to /tracks
  useEffect(() => {
    if (!isLoading && team && !selection && !submission) {
      navigate('/tracks', { replace: true });
    }
  }, [team, selection, submission, isLoading, navigate]);

  // Find locked track and problem
  const lockedTrack = useMemo(() => {
    if (!selection) return null;
    return HACKATHON_CONFIG.tracks.find(t => t.id === selection.trackId) || null;
  }, [selection]);

  const lockedProblem = useMemo(() => {
    if (!selection) return null;
    return HACKATHON_CONFIG.problemStatements.find(p => p.id === selection.problemStatementId) || null;
  }, [selection]);

  // GitHub validation
  const isGithubValid = useMemo(() => {
    const clean = githubUrl.trim();
    const regex = /^https:\/\/github\.com\/[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+\/?$/;
    return regex.test(clean);
  }, [githubUrl]);

  // Deployed URL validation
  const isDeployedUrlValid = useMemo(() => {
    const clean = deployedUrl.trim();
    if (!clean) return false;
    try {
      const parsed = new URL(clean);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }, [deployedUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!githubUrl.trim()) {
      setError('GitHub repository URL is required.');
      return;
    }
    if (!isGithubValid) {
      setError('Please provide a valid HTTPS GitHub repository URL (e.g. https://github.com/organization/repo).');
      return;
    }
    if (!deployedUrl.trim()) {
      setError('Live deployed website URL is required.');
      return;
    }
    if (!isDeployedUrlValid) {
      setError('Please enter a valid live deployed URL starting with http:// or https:// (e.g. https://my-app.vercel.app).');
      return;
    }
    if (!confirmPledge) {
      setError('Please confirm the accuracy of your submission pledge.');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitSolution(githubUrl.trim(), deployedUrl.trim());
    } catch (err: any) {
      setError(err?.message || 'Failed to complete submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center text-gold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <span className="font-sans font-semibold text-xs tracking-widest uppercase">Opening The Inner Chamber...</span>
        </div>
      </div>
    );
  }

  // If already submitted, render full-screen completion receipt!
  if (submission && team) {
    return (
      <div className="min-h-screen bg-[#08090D] text-[#F3E8CF] flex flex-col justify-between">
        <div>
          <BannerDemo />
          <Navbar />
          <ProgressSteps currentStep={3} />
          <SubmissionReceipt
            submission={submission}
            team={team}
            track={lockedTrack || undefined}
            problem={lockedProblem || undefined}
          />
        </div>
        <footer className="w-full py-6 text-center text-xs text-ivory-muted/40 border-t border-charcoal-border/40">
          <span>{HACKATHON_CONFIG.hackathonName} • {HACKATHON_CONFIG.collegeName}</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F3E8CF] flex flex-col justify-between relative overflow-hidden">
      {/* Dynamic Background Chakravyuh Formation */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-5">
        <svg viewBox="-300 -300 600 600" className="w-full h-full text-gold animate-spin-slow">
          <circle cx="0" cy="0" r="280" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="16 8" />
          <circle cx="0" cy="0" r="200" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="0" cy="0" r="120" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="0" cy="0" r="50" fill="currentColor" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <BannerDemo />
        <Navbar />
        <ProgressSteps currentStep={3} />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-sans font-semibold tracking-[0.25em] text-gold uppercase">
              STAGE 03 • THE INNER SANCTUM
            </span>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-ivory tracking-wide mt-2">
              THE INNER CHAMBER
            </h1>
            <p className="font-sans text-sm sm:text-base text-gold/90 mt-2 italic">
              "Your challenge is chosen. Now present your solution."
            </p>
          </div>

          {/* Locked Assignment Summary Card */}
          <div className="rounded-2xl bg-charcoal border border-gold/40 p-5 sm:p-6 mb-8 shadow-gold-subtle">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-border/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-ivory-muted/70">
                    PLEDGING TEAM
                  </span>
                  <div className="font-cinzel font-bold text-base text-ivory">
                    {team?.teamName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>SELECTION STATUS: LOCKED</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
              <div>
                <span className="text-ivory-muted/70 block mb-1">Locked Track:</span>
                <div className="flex items-center gap-2 font-cinzel font-bold text-sm" style={{ color: lockedTrack?.accentColor || '#D8B46A' }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lockedTrack?.accentColor || '#D8B46A' }} />
                  <span>{lockedTrack?.name}</span>
                </div>
              </div>
              <div>
                <span className="text-ivory-muted/70 block mb-1">Locked Challenge:</span>
                <div className="text-ivory font-medium">
                  <span className="px-1.5 py-0.5 rounded bg-gold/15 text-gold font-mono text-[10px] mr-1.5">
                    {lockedProblem?.problemCode}
                  </span>
                  <span className="font-cinzel font-bold">{lockedProblem?.title}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-ember/15 border border-ember/40 text-ember text-xs flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: GitHub Repository */}
            <div className="rounded-2xl bg-charcoal-card border border-charcoal-border p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-xs sm:text-sm text-ivory uppercase tracking-wider">
                    1. GitHub Repository URL <span className="text-gold">*</span>
                  </h3>
                  <p className="text-[11px] text-ivory-muted">
                    Provide the official repository containing your codebase, documentation, and README.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <input
                  type="url"
                  required
                  disabled={isSubmitting}
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/your-team/chakravyuh-solution"
                  className={`w-full px-4 py-3 rounded-xl bg-obsidian border font-mono text-xs text-ivory placeholder-ivory-muted/40 transition-colors ${
                    githubUrl && !isGithubValid
                      ? 'border-ember focus:border-ember focus:ring-1 focus:ring-ember'
                      : githubUrl && isGithubValid
                      ? 'border-emerald-500/70 focus:border-emerald-500'
                      : 'border-charcoal-border focus:border-gold'
                  }`}
                />

                {githubUrl && !isGithubValid && (
                  <span className="text-[11px] text-ember mt-1 block">
                    Must be a valid HTTPS GitHub repository URL (e.g. https://github.com/user/repo).
                  </span>
                )}
                {githubUrl && isGithubValid && (
                  <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Valid GitHub Repository URL format
                  </span>
                )}
              </div>
            </div>

            {/* Section 2: Deployed Website Link Column */}
            <div className="rounded-2xl bg-charcoal-card border border-charcoal-border p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between gap-2.5 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-xs sm:text-sm text-ivory uppercase tracking-wider">
                      2. Deployed Website Link <span className="text-gold">*</span>
                    </h3>
                    <p className="text-[11px] text-ivory-muted">
                      Provide the live public URL where your web application, dashboard, or deployed project is hosted.
                    </p>
                  </div>
                </div>

                {isDeployedUrlValid && (
                  <a
                    href={deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-sans font-semibold hover:bg-emerald-500/25 transition-colors cursor-pointer"
                  >
                    <span>Test Live Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="pt-2">
                <div className="relative">
                  <input
                    type="url"
                    required
                    disabled={isSubmitting}
                    value={deployedUrl}
                    onChange={(e) => setDeployedUrl(e.target.value)}
                    placeholder="https://your-project.vercel.app or https://your-domain.com"
                    className={`w-full px-4 py-3 rounded-xl bg-obsidian border font-mono text-xs text-ivory placeholder-ivory-muted/40 transition-colors ${
                      deployedUrl && !isDeployedUrlValid
                        ? 'border-ember focus:border-ember focus:ring-1 focus:ring-ember'
                        : deployedUrl && isDeployedUrlValid
                        ? 'border-emerald-500/70 focus:border-emerald-500'
                        : 'border-charcoal-border focus:border-gold'
                    }`}
                  />
                </div>

                {deployedUrl && !isDeployedUrlValid && (
                  <span className="text-[11px] text-ember mt-1 block">
                    Must be a valid web URL starting with https:// or http:// (e.g. https://my-app.vercel.app).
                  </span>
                )}
                {deployedUrl && isDeployedUrlValid && (
                  <div className="mt-1 flex items-center justify-between text-[11px] text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" /> Live deployment URL validated
                    </span>
                    <span className="text-ivory-muted/70 font-mono">
                      (Vercel, Netlify, Render, Cloudflare, GitHub Pages, etc.)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Final Confirmation & Submission Pledge */}
            <div className="rounded-2xl bg-[#0F121A] border border-charcoal-border p-5 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <div
                  onClick={() => !isSubmitting && setConfirmPledge(!confirmPledge)}
                  className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-all ${
                    confirmPledge
                      ? 'bg-gold border-gold text-obsidian'
                      : 'bg-charcoal border-charcoal-border group-hover:border-gold/50'
                  }`}
                >
                  {confirmPledge && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span
                  onClick={() => !isSubmitting && setConfirmPledge(!confirmPledge)}
                  className="text-xs text-ivory-muted leading-relaxed group-hover:text-ivory transition-colors"
                >
                  I solemnly certify that this solution, source code repository, and live deployed web application were developed solely by team <strong className="text-gold">{team?.teamName}</strong> during the hackathon. We understand that this final submission is immutable once recorded.
                </span>
              </label>

              <button
                type="submit"
                disabled={!isGithubValid || !isDeployedUrlValid || !confirmPledge || isSubmitting}
                className={`w-full py-3.5 rounded-xl font-sans font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 shadow-gold-subtle ${
                  isGithubValid && isDeployedUrlValid && confirmPledge && !isSubmitting
                    ? 'bg-gradient-to-r from-gold via-amber-400 to-gold text-obsidian hover:brightness-110 active:scale-[0.99] shadow-gold-glow cursor-pointer'
                    : 'bg-charcoal-border text-ivory-muted/40 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Lock className="w-4 h-4 animate-spin" />
                    <span>RECORDING & IMMUTABLY SEALING SUBMISSION...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SUBMIT FINAL SOLUTION TO THE CHAKRAVYUH</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </motion.div>

      <footer className="w-full py-6 text-center text-xs font-sans text-ivory-muted/40 border-t border-charcoal-border/40 mt-12">
        <span>{HACKATHON_CONFIG.hackathonName} • {HACKATHON_CONFIG.collegeName}</span>
      </footer>
    </div>
  );
};
