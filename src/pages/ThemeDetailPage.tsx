import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { ProblemStatement, Track } from '../types';
import { Navbar } from '../components/Navbar';
import { BannerDemo } from '../components/BannerDemo';
import { ProgressSteps } from '../components/ProgressSteps';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  TrackCulturalBackground,
  PageCulturalAtmosphere
} from '../components/cultural-backgrounds';
import {
  Lock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Shield,
  ExternalLink,
  Flame,
  Zap,
  Wind,
  Trees,
  Sun,
  AlertCircle,
  FileText,
  Database,
  Cpu,
  Layers
} from 'lucide-react';

export const ThemeDetailPage: React.FC = () => {
  const { themeSlug } = useParams<{ themeSlug: string }>();
  const navigate = useNavigate();
  const { team, selection, submission, isLoading, lockSelection } = useAuth();

  // Guard: Redirect to /login if not authenticated
  useEffect(() => {
    if (!isLoading && !team) {
      navigate('/login', { replace: true });
    }
  }, [team, isLoading, navigate]);

  // Find track matching slug or id
  const currentTrack = useMemo(() => {
    return (
      HACKATHON_CONFIG.tracks.find(t => t.slug === themeSlug || t.id === themeSlug || t.themeKey === themeSlug || t.name.toLowerCase() === (themeSlug || '').toLowerCase()) ||
      HACKATHON_CONFIG.tracks[0]
    );
  }, [themeSlug]);

  // Filter 10 problems belonging to this theme
  const themeProblems = useMemo(() => {
    return HACKATHON_CONFIG.problemStatements
      .filter(p => p.trackId === currentTrack.id)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [currentTrack.id]);

  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    selection?.trackId === currentTrack.id ? selection.problemStatementId : (themeProblems[0]?.id || null)
  );

  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(
    selection?.trackId === currentTrack.id ? selection.problemStatementId : (themeProblems[0]?.id || null)
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (selection && selection.trackId === currentTrack.id) {
      setSelectedProblemId(selection.problemStatementId);
      setExpandedProblemId(selection.problemStatementId);
    }
  }, [selection, currentTrack.id]);

  const isLockedToThisTheme = Boolean(selection && selection.trackId === currentTrack.id);
  const isLockedToOtherTheme = Boolean(selection && selection.trackId !== currentTrack.id);

  const selectedProblem = useMemo(() => {
    return themeProblems.find(p => p.id === selectedProblemId) || themeProblems[0];
  }, [themeProblems, selectedProblemId]);

  const handleCardClick = (problem: ProblemStatement) => {
    if (selection) {
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
      await lockSelection(currentTrack.id, selectedProblemId);
      setIsModalOpen(false);
      navigate('/submit');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to lock choice in arena database.');
    } finally {
      setIsLocking(false);
    }
  };

  const getDifficultyBadge = (difficulty: ProblemStatement['difficulty']) => {
    switch (difficulty) {
      case 'Flagship':
      case 'Grandmaster':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-bold';
      case 'Hard':
      case 'Challenger':
        return 'bg-red-500/15 text-red-300 border-red-500/40 font-semibold';
      case 'Easy':
      case 'Novice':
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center text-gold">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <span className="font-cinzel text-xs tracking-widest uppercase">Loading Hackathon Theme...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F3E8CF] flex flex-col justify-between relative overflow-hidden">
      {/* Real-time Theme Atmosphere */}
      <PageCulturalAtmosphere selectedTrackId={currentTrack.id} />

      <div className="relative z-10">
        <BannerDemo />
        <Navbar />
        <ProgressSteps currentStep={2} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Top Bar with Back Navigation & Theme Header */}
          <div className="pb-6 border-b border-charcoal-border/70">
            <div className="flex items-center justify-between gap-4 mb-4">
              <Link
                to="/tracks"
                className="inline-flex items-center gap-2 text-xs font-cinzel text-gold/80 hover:text-gold transition-colors group cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>RETURN TO THEME SELECTION</span>
              </Link>

              {/* Theme Badge */}
              <div
                className="px-3 py-1 rounded-full border text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md"
                style={{
                  backgroundColor: `${currentTrack.accentColor}20`,
                  borderColor: `${currentTrack.accentColor}60`,
                  color: currentTrack.accentColor,
                }}
              >
                THEME • {currentTrack.name.toUpperCase()}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-gold uppercase font-semibold">
                  STAGE 02 • OFFICIAL THEME DOSSIER
                </span>
                <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-ivory tracking-wide mt-1.5 flex items-center gap-3">
                  <span>{currentTrack.officialTitle}</span>
                </h1>
                <p className="text-xs sm:text-sm text-ivory-muted/90 mt-2 max-w-3xl leading-relaxed">
                  {currentTrack.description}
                </p>
                <div className="mt-2 text-xs font-cinzel italic text-gold/90">
                  "{currentTrack.motto}"
                </div>
              </div>

              {/* Lock Status / Action Button */}
              <div className="flex items-center gap-3 shrink-0">
                {isLockedToThisTheme ? (
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-semibold">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>THEME LOCKED IN ARENA DATABASE</span>
                    </div>
                    <button
                      onClick={() => navigate('/submit')}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold via-amber-400 to-gold text-obsidian font-cinzel font-bold text-xs tracking-wider flex items-center gap-2 hover:brightness-110 shadow-gold-glow cursor-pointer"
                    >
                      <span>PROCEED TO SUBMISSION</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : isLockedToOtherTheme ? (
                  <div className="p-3 rounded-xl bg-charcoal border border-charcoal-border text-xs text-ivory-muted flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gold" />
                    <span>Your team is locked to another theme</span>
                  </div>
                ) : (
                  <button
                    onClick={handleOpenLockModal}
                    disabled={!selectedProblemId}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold via-amber-400 to-gold text-obsidian font-cinzel font-bold text-xs tracking-widest flex items-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-gold-glow cursor-pointer disabled:opacity-50"
                  >
                    <Lock className="w-4 h-4" />
                    <span>CONFIRM & LOCK THIS CHALLENGE</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Locked Notice Banner */}
          {isLockedToThisTheme && (
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
                onClick={() => navigate('/submit')}
                className="px-4 py-2 rounded-xl bg-gold text-obsidian font-cinzel text-xs font-bold tracking-wider hover:brightness-110 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>PROCEED TO SUBMISSION</span>
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

          {/* 10 Problem Statements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mt-8">
            {themeProblems.map((problem) => {
              const isSelected = selectedProblemId === problem.id;
              const isExpanded = expandedProblemId === problem.id;
              const isLockedSelection = isLockedToThisTheme && selection?.problemStatementId === problem.id;

              return (
                <motion.div
                  key={problem.id}
                  onClick={() => handleCardClick(problem)}
                  whileHover={!selection ? { y: -2 } : undefined}
                  transition={{ duration: 0.2 }}
                  className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-300 border flex flex-col justify-between ${
                    isLockedSelection
                      ? 'bg-charcoal border-2 border-gold shadow-gold-subtle'
                      : isSelected && !selection
                      ? 'bg-charcoal border-2 shadow-gold-subtle'
                      : 'bg-charcoal/70 border-charcoal-border hover:border-gold/30 hover:bg-charcoal cursor-pointer'
                  }`}
                  style={{
                    borderColor: isSelected && !isLockedSelection ? currentTrack.accentColor : undefined,
                  }}
                >
                  <div>
                    {/* Header: Code & Difficulty */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="font-mono text-xs px-2.5 py-1 rounded bg-obsidian text-gold border font-bold"
                          style={{ borderColor: `${currentTrack.accentColor}50` }}
                        >
                          {problem.problemCode}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${getDifficultyBadge(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>

                      {/* Selection Indicator */}
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

                    <h3 className="font-cinzel text-lg font-bold text-ivory tracking-wide leading-snug">
                      {problem.title}
                    </h3>

                    {problem.objective && (
                      <p className="text-xs text-gold/90 mt-2 font-medium italic">
                        Objective: {problem.objective}
                      </p>
                    )}

                    <p className="text-xs text-ivory-muted/90 mt-2 leading-relaxed">
                      {problem.summary}
                    </p>
                  </div>

                  {/* Expandable Tactical Dossier */}
                  <div className="mt-4 pt-3 border-t border-charcoal-border/60">
                    <button
                      type="button"
                      onClick={(e) => handleToggleExpand(e, problem.id)}
                      className="flex items-center justify-between w-full text-xs font-mono text-ivory-muted hover:text-gold transition-colors py-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Tactical Specifications' : 'Inspect Full Requirements & Datasets'}</span>
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
                              Battlefield Scenario & Overview:
                            </span>
                            <p className="leading-relaxed bg-obsidian/70 p-3 rounded-xl border border-charcoal-border/70 text-ivory/90">
                              {problem.fullDescription}
                            </p>
                          </div>

                          {/* Expected Outcomes */}
                          {problem.expectedOutcomes && problem.expectedOutcomes.length > 0 && (
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-widest text-gold block mb-1.5">
                                Expected Deliverables & Outcomes:
                              </span>
                              <ul className="space-y-1">
                                {problem.expectedOutcomes.map((outcome, oIdx) => (
                                  <li key={oIdx} className="flex items-start gap-2 text-[11px]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-1.5" />
                                    <span>{outcome}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Datasets */}
                          {problem.datasets && problem.datasets.length > 0 && (
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-widest text-gold block mb-1.5">
                                Required & Public Datasets:
                              </span>
                              <div className="space-y-1">
                                {problem.datasets.map((ds, dIdx) => (
                                  <div key={dIdx} className="flex items-center justify-between p-2 rounded-lg bg-obsidian/60 border border-charcoal-border text-[11px]">
                                    <span className="text-ivory font-medium">{ds.name}</span>
                                    {ds.url && (
                                      <a
                                        href={ds.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gold hover:underline flex items-center gap-1 font-mono text-[10px]"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <span>Link</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Recommended Arsenal / Tech */}
                          {problem.suggestedTech && problem.suggestedTech.length > 0 && (
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-widest text-gold block mb-1.5">
                                Recommended Arsenal / Tech Stack:
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
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Floating Lock Control Bar if not locked */}
          {selectedProblem && (
            <div className="sticky bottom-4 z-30 mt-10 p-4 rounded-2xl bg-[#12141B]/95 border border-gold/40 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
                  {selection ? <Lock className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                </div>
                <div className="text-xs">
                  <span className="text-ivory-muted">
                    {selection ? 'Locked Assignment:' : 'Ready to bind to squad:'}
                  </span>{' '}
                  <strong className="text-gold font-cinzel">
                    [{selectedProblem?.problemCode}] {selectedProblem?.title}
                  </strong>
                </div>
              </div>

              {selection ? (
                <button
                  type="button"
                  onClick={() => navigate('/submit')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold via-amber-400 to-gold text-obsidian font-cinzel font-bold text-xs tracking-widest hover:brightness-110 active:scale-[0.99] transition-all shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>PROCEED TO SUBMISSION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenLockModal}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold via-amber-400 to-gold text-obsidian font-cinzel font-bold text-xs tracking-widest hover:brightness-110 active:scale-[0.99] transition-all shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>CONFIRM & PROCEED TO SUBMISSION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modal */}
      {selectedProblem && (
        <ConfirmationModal
          isOpen={isModalOpen}
          track={currentTrack}
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
