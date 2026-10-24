import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { Navbar } from '../components/Navbar';
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

  // Guard: If unauthenticated, redirect to login; if no lock, redirect to /tracks
  useEffect(() => {
    if (!isLoading) {
      if (!team) {
        navigate('/login?redirect=/submit', { replace: true });
      } else if (!selection && !submission) {
        navigate('/tracks', { replace: true });
      }
    }
  }, [team, selection, submission, isLoading, navigate]);

  // Find locked track and problem
  const lockedTrack = useMemo(() => {
    if (!selection) return null;
    return HACKATHON_CONFIG.tracks.find(t => t.id === selection.trackId) || null;
  }, [selection]);

  const lockedProblem = useMemo(() => {
    if (!selection) return null;
    return (
      HACKATHON_CONFIG.problemStatements.find(p => p.id === selection.problemStatementId) || null
    );
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
      setError(
        'Please provide a valid HTTPS GitHub repository URL (e.g. https://github.com/organization/repo).'
      );
      return;
    }
    if (!deployedUrl.trim()) {
      setError('Live deployed website URL is required.');
      return;
    }
    if (!isDeployedUrlValid) {
      setError(
        'Please enter a valid live deployed URL starting with http:// or https:// (e.g. https://my-app.vercel.app).'
      );
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
      <div className="min-h-screen bg-[#08090C] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
            OPENING THE INNER CHAMBER...
          </span>
        </div>
      </div>
    );
  }

  // If already submitted, render full-screen completion receipt!
  if (submission && team) {
    return (
      <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col justify-between bg-dot-matrix">
        <div>
          <Navbar />
          <ProgressSteps currentStep={3} />
          <SubmissionReceipt
            submission={submission}
            team={team}
            track={lockedTrack || undefined}
            problem={lockedProblem || undefined}
          />
        </div>
        <footer className="w-full py-6 text-center text-xs font-mono text-zinc-500 border-t border-white/[0.08]">
          <span>{HACKATHON_CONFIG.hackathonName} • {HACKATHON_CONFIG.collegeName}</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col justify-between relative overflow-hidden bg-dot-matrix">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Navbar />
        <ProgressSteps currentStep={3} />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-zinc-300 uppercase">
                STAGE 03 // THE INNER SANCTUM
              </span>
            </div>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white tracking-wide">
              SUBMIT FINAL SOLUTION
            </h1>
            <p className="font-sans text-xs sm:text-sm text-zinc-400 mt-2.5">
              Your challenge is locked. Present your repository and live deployment URL to seal
              your submission.
            </p>
          </div>

          {/* Locked Assignment Summary Card */}
          <div className="rounded-2xl bg-[#0E1118] border border-white/[0.12] p-5 sm:p-6 mb-8 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                    AUTHENTICATED SQUAD:
                  </span>
                  <div className="font-cinzel font-bold text-base text-white">
                    {team?.teamName}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>SELECTION STATUS: LOCKED</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-mono">
              <div>
                <span className="text-zinc-500 block mb-1 uppercase">Locked Track:</span>
                <div className="flex items-center gap-2 font-cinzel font-bold text-sm text-white">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: lockedTrack?.accentColor || '#38BDF8' }}
                  />
                  <span>{lockedTrack?.officialTitle || lockedTrack?.name}</span>
                </div>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1 uppercase">Locked Challenge:</span>
                <div className="text-white font-medium">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px] mr-1.5 font-bold">
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
                className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: GitHub Repository */}
            <div className="rounded-2xl bg-[#0E1118] border border-white/[0.08] p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-xs sm:text-sm text-white uppercase tracking-wider">
                    1. GITHUB REPOSITORY URL <span className="text-rose-400">*</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
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
                  onChange={e => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/your-team/chakravyuh-solution"
                  className={`w-full px-4 py-3 rounded-xl bg-black/60 border font-mono text-xs text-white placeholder-zinc-600 transition-colors ${
                    githubUrl && !isGithubValid
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : githubUrl && isGithubValid
                      ? 'border-emerald-500 focus:border-emerald-500'
                      : 'border-white/10 focus:border-white/40'
                  }`}
                />

                {githubUrl && !isGithubValid && (
                  <span className="text-[11px] text-rose-400 mt-1.5 font-mono block">
                    Must be a valid HTTPS GitHub repository URL (e.g. https://github.com/user/repo).
                  </span>
                )}
                {githubUrl && isGithubValid && (
                  <span className="text-[11px] text-emerald-400 mt-1.5 font-mono flex items-center gap-1">
                    <Check className="w-3 h-3" /> Valid GitHub Repository URL format
                  </span>
                )}
              </div>
            </div>

            {/* Section 2: Deployed Website Link Column */}
            <div className="rounded-2xl bg-[#0E1118] border border-white/[0.08] p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between gap-2.5 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-xs sm:text-sm text-white uppercase tracking-wider">
                      2. DEPLOYED WEBSITE LINK <span className="text-rose-400">*</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Provide the live public URL where your application or project is hosted.
                    </p>
                  </div>
                </div>

                {isDeployedUrlValid && (
                  <a
                    href={deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold hover:bg-emerald-500/25 transition-colors cursor-pointer"
                  >
                    <span>Test Live Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="pt-2">
                <input
                  type="url"
                  required
                  disabled={isSubmitting}
                  value={deployedUrl}
                  onChange={e => setDeployedUrl(e.target.value)}
                  placeholder="https://your-project.vercel.app or https://your-domain.com"
                  className={`w-full px-4 py-3 rounded-xl bg-black/60 border font-mono text-xs text-white placeholder-zinc-600 transition-colors ${
                    deployedUrl && !isDeployedUrlValid
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : deployedUrl && isDeployedUrlValid
                      ? 'border-emerald-500 focus:border-emerald-500'
                      : 'border-white/10 focus:border-white/40'
                  }`}
                />

                {deployedUrl && !isDeployedUrlValid && (
                  <span className="text-[11px] text-rose-400 mt-1.5 font-mono block">
                    Must be a valid web URL starting with https:// or http:// (e.g.
                    https://my-app.vercel.app).
                  </span>
                )}
                {deployedUrl && isDeployedUrlValid && (
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-emerald-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3" /> Live deployment URL validated
                    </span>
                    <span className="text-zinc-500">
                      (Vercel, Netlify, Render, Cloudflare, etc.)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Final Confirmation & Submission Pledge */}
            <div className="rounded-2xl bg-[#0E1118] border border-white/[0.08] p-5 sm:p-6 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group select-none">
                <div
                  onClick={() => !isSubmitting && setConfirmPledge(!confirmPledge)}
                  className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-all ${
                    confirmPledge
                      ? 'bg-white border-white text-[#08090C]'
                      : 'bg-black/40 border-white/20 group-hover:border-white/40'
                  }`}
                >
                  {confirmPledge && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span
                  onClick={() => !isSubmitting && setConfirmPledge(!confirmPledge)}
                  className="text-xs text-zinc-400 leading-relaxed group-hover:text-zinc-200 transition-colors"
                >
                  I solemnly certify that this solution, source code repository, and live deployed web
                  application were developed solely by team{' '}
                  <strong className="text-white">{team?.teamName}</strong> during the hackathon. We
                  understand that this final submission is immutable once recorded.
                </span>
              </label>

              <button
                type="submit"
                disabled={!isGithubValid || !isDeployedUrlValid || !confirmPledge || isSubmitting}
                className={`w-full py-4 rounded-xl font-mono font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                  isGithubValid && isDeployedUrlValid && confirmPledge && !isSubmitting
                    ? 'bg-white text-[#08090C] hover:bg-zinc-200 active:scale-[0.99] shadow-xl cursor-pointer'
                    : 'bg-white/10 text-zinc-600 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Lock className="w-4 h-4 animate-spin" />
                    <span>RECORDING & SEALING SUBMISSION...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SEAL & SUBMIT FINAL SOLUTION</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </main>
      </motion.div>

      <footer className="w-full py-6 text-center text-xs font-mono text-zinc-500 border-t border-white/[0.08] mt-12">
        <span>{HACKATHON_CONFIG.hackathonName} • {HACKATHON_CONFIG.collegeName}</span>
      </footer>
    </div>
  );
};

export default SubmissionPage;
