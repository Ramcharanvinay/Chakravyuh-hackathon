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
  Check, 
  Globe, 
  ExternalLink,
  Users,
  Hash,
  Mail,
  FileCheck
} from 'lucide-react';

// Google Form live responses integration
const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeUC_UCxGnFy2D2aX9fzGvYSw_o-wiDsCU-rILZMt4CjVGQ6Q/formResponse';

const GOOGLE_FORM_ENTRIES = {
  teamName: 'entry.1494327606',
  leaderRegNo: 'entry.1069076889',
  leaderEmail: 'entry.1626956049',
  githubUrl: 'entry.247861483',
  deployedUrl: 'entry.1971623563',
};

// Dual-channel submission (Fetch no-cors + Hidden IFrame) to guarantee 100% delivery into Google Sheet
const sendDataToGoogleForm = async (payload: {
  teamName: string;
  leaderRegNo: string;
  leaderEmail: string;
  githubUrl: string;
  deployedUrl: string;
}) => {
  // Channel 1: Background URL-encoded POST with no-cors
  try {
    const formParams = new URLSearchParams();
    formParams.append(GOOGLE_FORM_ENTRIES.teamName, payload.teamName);
    formParams.append(GOOGLE_FORM_ENTRIES.leaderRegNo, payload.leaderRegNo);
    formParams.append(GOOGLE_FORM_ENTRIES.leaderEmail, payload.leaderEmail);
    formParams.append(GOOGLE_FORM_ENTRIES.githubUrl, payload.githubUrl);
    formParams.append(GOOGLE_FORM_ENTRIES.deployedUrl, payload.deployedUrl);

    fetch(GOOGLE_FORM_ACTION_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formParams.toString(),
    }).catch(err => {
      console.warn('Google Form background fetch sync:', err);
    });
  } catch (e) {
    console.warn('Google Form URLSearchParams error:', e);
  }

  // Channel 2: Hidden Iframe submission (bypasses browser CORS & adblocker restrictions)
  try {
    const iframeId = 'gform_submission_bridge';
    let iframe = document.getElementById(iframeId) as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = iframeId;
      iframe.name = iframeId;
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }

    const form = document.createElement('form');
    form.action = GOOGLE_FORM_ACTION_URL;
    form.method = 'POST';
    form.target = iframeId;
    form.style.display = 'none';

    const appendHiddenInput = (name: string, val: string) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = val;
      form.appendChild(input);
    };

    appendHiddenInput(GOOGLE_FORM_ENTRIES.teamName, payload.teamName);
    appendHiddenInput(GOOGLE_FORM_ENTRIES.leaderRegNo, payload.leaderRegNo);
    appendHiddenInput(GOOGLE_FORM_ENTRIES.leaderEmail, payload.leaderEmail);
    appendHiddenInput(GOOGLE_FORM_ENTRIES.githubUrl, payload.githubUrl);
    appendHiddenInput(GOOGLE_FORM_ENTRIES.deployedUrl, payload.deployedUrl);

    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
      try {
        if (form.parentNode) {
          form.parentNode.removeChild(form);
        }
      } catch {
        // ignore cleanup error
      }
    }, 2500);
  } catch (err) {
    console.warn('Google Form hidden iframe submission error:', err);
  }
};

export const SubmissionPage: React.FC = () => {
  const { team, selection, submission, isLoading, submitSolution } = useAuth();
  const navigate = useNavigate();

  // Form states without assumption of 'Garuda'
  const [teamName, setTeamName] = useState<string>(() => {
    if (team?.teamName && !team.teamName.toLowerCase().includes('garuda')) {
      return team.teamName;
    }
    return '';
  });
  const [leaderRegNo, setLeaderRegNo] = useState<string>('');
  const [leaderEmail, setLeaderEmail] = useState<string>(() => {
    if (team?.leaderEmail && !team.leaderEmail.toLowerCase().includes('garuda') && !team.leaderEmail.includes('warrior.817')) {
      return team.leaderEmail;
    }
    return '';
  });
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [deployedUrl, setDeployedUrl] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Guarantee window is always at top (0, 0) when entering submission chamber
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Guard: If team has NOT locked a selection yet, redirect to /tracks
  useEffect(() => {
    if (!isLoading && team && !selection && !submission) {
      navigate('/tracks', { replace: true });
    }
  }, [team, selection, submission, isLoading, navigate]);

  // Find locked track and problem if present
  const lockedTrack = useMemo(() => {
    if (!selection) return null;
    return HACKATHON_CONFIG.tracks.find(t => t.id === selection.trackId) || null;
  }, [selection]);

  const lockedProblem = useMemo(() => {
    if (!selection) return null;
    return HACKATHON_CONFIG.problemStatements.find(p => p.id === selection.problemStatementId) || null;
  }, [selection]);

  // Validation rules
  const isTeamNameValid = useMemo(() => teamName.trim().length >= 2, [teamName]);
  const isRegNoValid = useMemo(() => leaderRegNo.trim().length >= 3, [leaderRegNo]);
  const isEmailValid = useMemo(() => {
    const clean = leaderEmail.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean);
  }, [leaderEmail]);

  const isGithubValid = useMemo(() => {
    const clean = githubUrl.trim();
    const regex = /^https:\/\/github\.com\/[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+\/?$/;
    return regex.test(clean);
  }, [githubUrl]);

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

  const isFormComplete = Boolean(
    isTeamNameValid &&
    isRegNoValid &&
    isEmailValid &&
    isGithubValid &&
    isDeployedUrlValid &&
    isConfirmed
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanTeamName = teamName.trim();
    const cleanRegNo = leaderRegNo.trim();
    const cleanEmail = leaderEmail.trim();
    const cleanGithub = githubUrl.trim();
    const cleanDeployed = deployedUrl.trim();

    if (!cleanTeamName) {
      setError('Team name is required.');
      return;
    }
    if (!cleanRegNo) {
      setError('Team lead registration number is required.');
      return;
    }
    if (!isEmailValid) {
      setError('Please provide a valid email address for the team lead.');
      return;
    }
    if (!cleanGithub) {
      setError('GitHub repository URL is required.');
      return;
    }
    if (!isGithubValid) {
      setError('Please provide a valid HTTPS GitHub repository URL (e.g. https://github.com/organization/repo).');
      return;
    }
    if (!cleanDeployed) {
      setError('Live deployed website URL is required.');
      return;
    }
    if (!isDeployedUrlValid) {
      setError('Please enter a valid live deployed URL starting with http:// or https:// (e.g. https://my-app.vercel.app).');
      return;
    }
    if (!isConfirmed) {
      setError('Please check the confirmation box at the bottom to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Sync actual user entered team details so receipt displays the correct squad information
      if (team) {
        team.teamName = cleanTeamName;
        team.leaderEmail = cleanEmail;
        team.leaderName = cleanRegNo;
        try {
          const stored = localStorage.getItem('chakravyuh_local_teams');
          if (stored) {
            const list = JSON.parse(stored);
            const idx = list.findIndex((t: any) => t.id === team.id);
            if (idx >= 0) {
              list[idx].teamName = cleanTeamName;
              list[idx].leaderEmail = cleanEmail;
              list[idx].leaderPhone = cleanRegNo;
              localStorage.setItem('chakravyuh_local_teams', JSON.stringify(list));
            }
          }
        } catch {
          // ignore localStorage sync error
        }
      }

      // 2. Transmit to Google Form & Linked Spreadsheet
      await sendDataToGoogleForm({
        teamName: cleanTeamName,
        leaderRegNo: cleanRegNo,
        leaderEmail: cleanEmail,
        githubUrl: cleanGithub,
        deployedUrl: cleanDeployed,
      });

      await submitSolution(cleanGithub, cleanDeployed);
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
          <span className="font-sans font-semibold text-xs tracking-widest uppercase">Opening The Submission Chamber...</span>
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
            team={{
              ...team,
              teamName: teamName.trim() || team.teamName,
              leaderEmail: leaderEmail.trim() || team.leaderEmail,
            }}
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

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-sans font-semibold tracking-[0.25em] text-gold uppercase">
              STAGE 03 • FINAL SUBMISSION
            </span>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-extrabold text-ivory tracking-wide mt-2">
              THE INNER CHAMBER
            </h1>
            <p className="font-sans text-sm sm:text-base text-gold/90 mt-2 italic">
              "Enter your squad details and project links for official evaluation."
            </p>
          </div>

          {/* Locked Track & Problem Banner (Informational Context) */}
          {(lockedTrack || lockedProblem) && (
            <div className="rounded-xl bg-charcoal/90 border border-charcoal-border p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: lockedTrack?.accentColor || '#D8B46A' }} />
                <span className="text-ivory-muted">Track:</span>
                <span className="font-cinzel font-bold text-ivory">{lockedTrack?.name || 'Selected Track'}</span>
              </div>
              {lockedProblem && (
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-gold/15 text-gold font-mono text-[10px]">
                    {lockedProblem.problemCode}
                  </span>
                  <span className="text-ivory-muted/90 font-medium truncate max-w-[280px] sm:max-w-[320px]">
                    {lockedProblem.title}
                  </span>
                </div>
              )}
            </div>
          )}

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

          {/* Redesigned Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl bg-charcoal-card border border-charcoal-border p-6 sm:p-8 space-y-6 shadow-gold-subtle">
              
              {/* Component 1: Team Name */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-sans font-bold text-ivory uppercase tracking-wider">
                  <Users className="w-4 h-4 text-gold" />
                  <span>1. Team Name <span className="text-gold">*</span></span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your registered team name"
                  className="w-full px-4 py-3 rounded-xl bg-obsidian border border-charcoal-border focus:border-gold focus:ring-1 focus:ring-gold font-sans text-xs sm:text-sm text-ivory placeholder-ivory-muted/40 transition-colors"
                />
              </div>

              {/* Component 2 & 3: Team Lead Reg No & Email ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Component 2: Team Lead Registration Number */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-sans font-bold text-ivory uppercase tracking-wider">
                    <Hash className="w-4 h-4 text-gold" />
                    <span>2. Team Lead Reg Number <span className="text-gold">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={leaderRegNo}
                    onChange={(e) => setLeaderRegNo(e.target.value.toUpperCase())}
                    placeholder="e.g. 21BCE10042 / 22MIS0128"
                    className="w-full px-4 py-3 rounded-xl bg-obsidian border border-charcoal-border focus:border-gold focus:ring-1 focus:ring-gold font-mono text-xs sm:text-sm text-ivory placeholder-ivory-muted/40 transition-colors uppercase"
                  />
                </div>

                {/* Component 3: Team Lead Email ID */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-sans font-bold text-ivory uppercase tracking-wider">
                    <Mail className="w-4 h-4 text-gold" />
                    <span>3. Team Lead Email ID <span className="text-gold">*</span></span>
                  </label>
                  <input
                    type="email"
                    required
                    disabled={isSubmitting}
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value)}
                    placeholder="e.g. teamlead@vitap.ac.in"
                    className={`w-full px-4 py-3 rounded-xl bg-obsidian border font-sans text-xs sm:text-sm text-ivory placeholder-ivory-muted/40 transition-colors ${
                      leaderEmail && !isEmailValid
                        ? 'border-ember focus:border-ember focus:ring-1 focus:ring-ember'
                        : leaderEmail && isEmailValid
                        ? 'border-emerald-500/70 focus:border-emerald-500'
                        : 'border-charcoal-border focus:border-gold focus:ring-1 focus:ring-gold'
                    }`}
                  />
                </div>
              </div>

              {/* Component 4: GitHub Repository */}
              <div className="space-y-2 pt-2 border-t border-charcoal-border/60">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label className="flex items-center gap-2 text-xs font-sans font-bold text-ivory uppercase tracking-wider">
                    <Github className="w-4 h-4 text-gold" />
                    <span>4. GitHub Repository URL <span className="text-gold">*</span></span>
                  </label>
                  {githubUrl && isGithubValid && (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-sans">
                      <Check className="w-3.5 h-3.5" /> Valid GitHub Repository URL
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  required
                  disabled={isSubmitting}
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/your-organization/your-repo"
                  className={`w-full px-4 py-3 rounded-xl bg-obsidian border font-mono text-xs sm:text-sm text-ivory placeholder-ivory-muted/40 transition-colors ${
                    githubUrl && !isGithubValid
                      ? 'border-ember focus:border-ember focus:ring-1 focus:ring-ember'
                      : githubUrl && isGithubValid
                      ? 'border-emerald-500/70 focus:border-emerald-500'
                      : 'border-charcoal-border focus:border-gold focus:ring-1 focus:ring-gold'
                  }`}
                />
                {githubUrl && !isGithubValid && (
                  <span className="text-[11px] text-ember block font-sans">
                    Must be a valid HTTPS GitHub repository URL (e.g. https://github.com/user/repo).
                  </span>
                )}
              </div>

              {/* Component 5: Deployed Link */}
              <div className="space-y-2 pt-2 border-t border-charcoal-border/60">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label className="flex items-center gap-2 text-xs font-sans font-bold text-ivory uppercase tracking-wider">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>5. Deployed Website Link <span className="text-gold">*</span></span>
                  </label>
                  {isDeployedUrlValid && (
                    <a
                      href={deployedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-sans font-semibold hover:bg-emerald-500/25 transition-colors cursor-pointer"
                    >
                      <span>Test Live Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  required
                  disabled={isSubmitting}
                  value={deployedUrl}
                  onChange={(e) => setDeployedUrl(e.target.value)}
                  placeholder="https://your-project.vercel.app or https://your-domain.com"
                  className={`w-full px-4 py-3 rounded-xl bg-obsidian border font-mono text-xs sm:text-sm text-ivory placeholder-ivory-muted/40 transition-colors ${
                    deployedUrl && !isDeployedUrlValid
                      ? 'border-ember focus:border-ember focus:ring-1 focus:ring-ember'
                      : deployedUrl && isDeployedUrlValid
                      ? 'border-emerald-500/70 focus:border-emerald-500'
                      : 'border-charcoal-border focus:border-gold focus:ring-1 focus:ring-gold'
                  }`}
                />
                {deployedUrl && !isDeployedUrlValid && (
                  <span className="text-[11px] text-ember block font-sans">
                    Must be a valid URL starting with http:// or https:// (e.g. https://my-app.vercel.app).
                  </span>
                )}
              </div>

              {/* Tick Box at the bottom */}
              <div className="pt-4 border-t border-charcoal-border/70">
                <label 
                  onClick={() => !isSubmitting && setIsConfirmed(!isConfirmed)}
                  className="flex items-start gap-3.5 p-4 rounded-xl bg-obsidian/70 border border-charcoal-border hover:border-gold/40 transition-colors cursor-pointer select-none group"
                >
                  <div
                    className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                      isConfirmed
                        ? 'bg-gold border-gold text-obsidian shadow-gold-subtle'
                        : 'bg-charcoal border-charcoal-border group-hover:border-gold/60'
                    }`}
                  >
                    {isConfirmed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs sm:text-[13px] text-ivory-muted leading-relaxed group-hover:text-ivory transition-colors">
                    I confirm that all team details, GitHub repository, and live deployment link provided above are accurate and ready for final evaluation.
                  </span>
                </label>
              </div>

              {/* Submission Button */}
              <button
                type="submit"
                disabled={!isFormComplete || isSubmitting}
                className={`w-full py-4 rounded-xl font-sans font-bold text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                  isFormComplete && !isSubmitting
                    ? 'bg-gradient-to-r from-gold via-amber-400 to-gold text-obsidian hover:brightness-110 active:scale-[0.99] shadow-gold-glow cursor-pointer'
                    : 'bg-charcoal-border text-ivory-muted/40 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Lock className="w-4 h-4 animate-spin text-obsidian" />
                    <span>RECORDING & SEALING SUBMISSION...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>SUBMIT FINAL SOLUTION</span>
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
