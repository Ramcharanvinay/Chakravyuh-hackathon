import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { ProblemStatement, Track } from '../types';
import { Navbar } from '../components/Navbar';
import { BannerDemo } from '../components/BannerDemo';
import { ProgressSteps } from '../components/ProgressSteps';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { 
  Lock, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Flame, 
  Zap, 
  Wind, 
  Trees, 
  Sun,
  Shield, 
  Sparkles,
  Cpu,
  Layers,
  AlertCircle
} from 'lucide-react';

export const ProblemSelectionPage: React.FC = () => {
  const { team, selection, submission, isLoading, lockSelection } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Guard: Redirect to /login if not authenticated
  useEffect(() => {
    if (!isLoading && !team) {
      navigate('/login');
    }
  }, [team, isLoading, navigate]);

  // Determine active track
  const queryTrackId = searchParams.get('track');
  const activeTrackId = selection ? selection.trackId : (queryTrackId || HACKATHON_CONFIG.tracks[0].id);

  const activeTrack = useMemo(() => {
    return HACKATHON_CONFIG.tracks.find(t => t.id === activeTrackId) || HACKATHON_CONFIG.tracks[0];
  }, [activeTrackId]);

  // Track problem statements (10 problems)
  const trackProblems = useMemo(() => {
    return HACKATHON_CONFIG.problemStatements
      .filter(p => p.trackId === activeTrack.id)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [activeTrack.id]);

  // Selected problem statement in UI
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    selection ? selection.problemStatementId : (trackProblems[0]?.id || null)
  );

  // Expanded cards for full details
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(
    selection ? selection.problemStatementId : (trackProblems[0]?.id || null)
  );

  // Confirmation modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Keep selected problem in sync if selection changes
  useEffect(() => {
    if (selection) {
      setSelectedProblemId(selection.problemStatementId);
      setExpandedProblemId(selection.problemStatementId);
    }
  }, [selection]);

  const isLocked = Boolean(selection);

  const selectedProblem = useMemo(() => {
    return trackProblems.find(p => p.id === selectedProblemId) || trackProblems[0];
  }, [trackProblems, selectedProblemId]);

  const handleCardClick = (problem: ProblemStatement) => {
    if (isLocked) {
      // Allow expanding details even when locked
      setExpandedProblemId(expandedProblemId === problem.id ? null : problem.id);
      return;
    }
    setSelectedProblemId(problem.id);
    setExpandedProblemId(problem.id);
  };

  const handleToggleExpand = (e: React.MouseEvent, problemId: string) => {
    e.stopPropagation();
    setExpandedProblemId(expandedProblemId === problemId ? null : problemId);
  };

  const handleOpenLockModal = () => {
    if (!selectedProblemId) {
      setErrorMessage('Please select one problem statement to lock.');
      return;
    }
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleConfirmLock = async () => {
    if (!selectedProblemId) return;
    setIsLocking(true);
    setErrorMessage(null);

    try {
      await lockSelection(activeTrack.id, selectedProblemId);
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to lock choice in database.');
    } finally {
      setIsLocking(false);
    }
  };

  const handleProceedToSubmission = () => {
    navigate('/submit');
  };

  const getDifficultyBadge = (difficulty: ProblemStatement['difficulty']) => {
    switch (difficulty) {
      case 'Grandmaster':
        return 'bg-ember/15 text-ember border-ember/30';
      case 'Challenger':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Novice':
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center text-gold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <span className="font-cinzel text-xs tracking-widest uppercase">Fetching Sealed Challenges...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F3E8CF] flex flex-col justify-between relative overflow-hidden">
      {/* Background Animated Chakravyuh Graphic Watermark */}
      <div className="absolute right-0 top-1/4 translate-x-1/3 w-[600px] h-[600px] pointer-events-none opacity-5">
        <svg viewBox="-300 -300 600 600" className="w-full h-full text-gold animate-spin-reverse-slow">
          <circle cx="0" cy="0" r="280" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="16 8" />
          <circle cx="0" cy="0" r="210" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="0" cy="0" r="140" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="12 6" />
          <circle cx="0" cy="0" r="70" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>

      <div>
        <BannerDemo />
        <Navbar />
        <ProgressSteps currentStep={2} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-charcoal-border/70">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono tracking-widest text-gold uppercase font-semibold">
                  STAGE 02 • PROBLEM STATEMENT SELECTION
                </span>
                <span className="text-ivory-muted/40">•</span>
                <div className="flex items-center gap-1.5 text-xs font-cinzel font-bold" style={{ color: activeTrack.accentColor }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeTrack.accentColor }} />
                  <span>TRACK: {activeTrack.name}</span>
                </div>
              </div>
              <h1 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-ivory tracking-wide">
                Choose Your Challenge
              </h1>
              <p className="text-xs sm:text-sm text-ivory-muted/80 mt-1 max-w-2xl">
                Ten strategic problem statements forged for the <strong className="text-ivory">{activeTrack.name}</strong> track. Choose wisely: each squad may conquer exactly one challenge.
              </p>
            </div>

            {/* Lock Status & Action Pill */}
            <div className="flex items-center gap-3">
              {isLocked ? (
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>CHOICE LOCKED IN ARENA DATABASE</span>
                  </div>
                  <button
                    onClick={handleProceedToSubmission}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold via-amber-400 to-gold text-obsidian font-cinzel font-bold text-xs tracking-wider flex items-center gap-2 hover:brightness-110 shadow-gold-glow cursor-pointer"
                  >
                    <span>PROCEED TO SUBMISSION</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleOpenLockModal}
                  disabled={!selectedProblemId}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-amber-500 text-obsidian font-cinzel font-bold text-xs tracking-widest flex items-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-gold-glow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  <span>CONFIRM & LOCK CHOICE</span>
                </button>
              )}
            </div>
          </div>

          {/* Locked Notice Banner if locked */}
          {isLocked && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-2xl bg-charcoal-card border-2 border-gold/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-gold-subtle"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gold font-bold">
                    PERMANENTLY SEALED ASSIGNMENT
                  </span>
                  <div className="text-sm font-cinzel font-bold text-ivory">
                    Your team is bound to <span className="text-gold">[{selectedProblem?.problemCode}] {selectedProblem?.title}</span>
                  </div>
                  <span className="text-xs text-ivory-muted">
                    Locked at: {new Date(selection?.lockedAt || '').toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToSubmission}
                className="px-4 py-2 rounded-xl bg-gold text-obsidian font-cinzel text-xs font-bold tracking-wider hover:brightness-110 flex items-center gap-2 shrink-0"
              >
                <span>ENTER SUBMISSION CHAMBER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-ember/15 border border-ember/40 text-ember text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Problem Cards: Responsive 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8">
            {trackProblems.map((problem, idx) => {
              const isSelected = selectedProblemId === problem.id;
              const isExpanded = expandedProblemId === problem.id;
              const isLockedSelection = isLocked && selection?.problemStatementId === problem.id;
              const isOtherWhenLocked = isLocked && selection?.problemStatementId !== problem.id;

              return (
                <motion.div
                  key={problem.id}
                  onClick={() => handleCardClick(problem)}
                  whileHover={!isLocked ? { y: -2 } : undefined}
                  transition={{ duration: 0.2 }}
                  className={`relative rounded-2xl p-5 transition-all duration-300 border flex flex-col justify-between ${
                    isLockedSelection
                      ? 'bg-charcoal border-2 border-gold shadow-gold-subtle'
                      : isSelected && !isLocked
                      ? 'bg-charcoal border-2 shadow-gold-subtle'
                      : isOtherWhenLocked
                      ? 'bg-[#0D0F16]/50 border-charcoal-border/50 opacity-40 cursor-not-allowed'
                      : 'bg-charcoal/70 border-charcoal-border hover:border-gold/30 hover:bg-charcoal cursor-pointer'
                  }`}
                  style={{
                    borderColor: isSelected && !isLockedSelection ? activeTrack.accentColor : undefined,
                  }}
                >
                  {/* Card Header: Code, Title, Difficulty */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-obsidian text-gold border border-gold/30 font-bold">
                          {problem.problemCode}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${getDifficultyBadge(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>

                      {/* Select/Radio Indicator */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isLockedSelection ? (
                          <span className="flex items-center gap-1 text-[10px] font-cinzel font-bold text-gold bg-gold/15 px-2 py-0.5 rounded-full border border-gold/40">
                            <Lock className="w-3 h-3" /> LOCKED
                          </span>
                        ) : (
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-gold border-gold text-obsidian shadow-gold-subtle'
                                : 'border-charcoal-border bg-obsidian'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-obsidian" />}
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="font-cinzel text-base sm:text-lg font-bold text-ivory tracking-wide leading-snug">
                      {problem.title}
                    </h3>

                    <p className="text-xs text-ivory-muted/80 mt-2 leading-relaxed">
                      {problem.summary}
                    </p>
                  </div>

                  {/* Expandable Full Problem Description */}
                  <div className="mt-4 pt-3 border-t border-charcoal-border/60">
                    <button
                      type="button"
                      onClick={(e) => handleToggleExpand(e, problem.id)}
                      className="flex items-center justify-between w-full text-xs font-mono text-ivory-muted hover:text-gold transition-colors py-1"
                    >
                      <span>{isExpanded ? 'Hide Tactical Dossier' : 'Inspect Full Requirements'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pt-3 space-y-3.5 text-xs text-ivory-muted/90"
                        >
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-gold block mb-1">
                              Battlefield Scenario:
                            </span>
                            <p className="leading-relaxed bg-obsidian/70 p-3 rounded-xl border border-charcoal-border/70 text-ivory/90">
                              {problem.fullDescription}
                            </p>
                          </div>

                          {/* Key Deliverables */}
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-gold block mb-1.5">
                              Key Technical Deliverables:
                            </span>
                            <ul className="space-y-1">
                              {problem.keyRequirements.map((req, rIdx) => (
                                <li key={rIdx} className="flex items-start gap-2 text-[11px]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Suggested Tech Stack */}
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-gold block mb-1.5">
                              Recommended Arsenal / Tech:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {problem.suggestedTech.map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-charcoal border border-charcoal-border text-ivory-muted"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Floating Lock Control Bar if not locked */}
          {!isLocked && (
            <div className="sticky bottom-4 z-30 mt-10 p-4 rounded-2xl bg-[#12141B]/95 border border-gold/40 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="text-ivory-muted">Ready to bind to squad:</span>{' '}
                  <strong className="text-gold font-cinzel">
                    [{selectedProblem?.problemCode}] {selectedProblem?.title}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenLockModal}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold via-amber-400 to-gold text-obsidian font-cinzel font-bold text-xs tracking-widest hover:brightness-110 active:scale-[0.99] transition-all shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>CONFIRM AND LOCK CHOICE</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modal */}
      {selectedProblem && (
        <ConfirmationModal
          isOpen={isModalOpen}
          track={activeTrack}
          problem={selectedProblem}
          teamName={team?.teamName || 'Your Team'}
          isLocking={isLocking}
          onCancel={() => setIsModalOpen(false)}
          onConfirm={handleConfirmLock}
        />
      )}

      <footer className="w-full py-6 text-center text-xs text-ivory-muted/40 border-t border-charcoal-border/40 mt-12">
        <span>{HACKATHON_CONFIG.hackathonName} • {HACKATHON_CONFIG.collegeName}</span>
      </footer>
    </div>
  );
};
