import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { ProblemStatement } from '../types';
import { Navbar } from '../components/Navbar';
import { ProgressSteps } from '../components/ProgressSteps';
import { ConfirmationModal } from '../components/ConfirmationModal';
import {
  Lock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Shield,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ThemeDetailPage: React.FC = () => {
  const { themeSlug } = useParams<{ themeSlug: string }>();
  const navigate = useNavigate();
  const { team, selection, submission, isLoading, lockSelection } = useAuth();

  // Find track matching slug or id
  const currentTrack = useMemo(() => {
    return (
      HACKATHON_CONFIG.tracks.find(
        t =>
          t.slug === themeSlug ||
          t.id === themeSlug ||
          t.themeKey === themeSlug ||
          t.name.toLowerCase() === (themeSlug || '').toLowerCase()
      ) || HACKATHON_CONFIG.tracks[0]
    );
  }, [themeSlug]);

  // Filter 10 problems belonging to this theme
  const themeProblems = useMemo(() => {
    return HACKATHON_CONFIG.problemStatements
      .filter(p => p.trackId === currentTrack.id)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [currentTrack.id]);

  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    selection?.trackId === currentTrack.id
      ? selection.problemStatementId
      : themeProblems[0]?.id || null
  );

  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(
    selection?.trackId === currentTrack.id
      ? selection.problemStatementId
      : themeProblems[0]?.id || null
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
    if (!team) {
      navigate(`/login?redirect=${encodeURIComponent(`/theme/${currentTrack.slug}`)}`);
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmLock = async () => {
    if (!selectedProblem) return;
    setIsLocking(true);
    setErrorMessage(null);

    try {
      await lockSelection(currentTrack.id, selectedProblem.id);
      setIsModalOpen(false);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
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
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold';
      case 'Hard':
      case 'Challenger':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-semibold';
      case 'Easy':
      case 'Novice':
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090C] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase">
            CALIBRATING THEME DOSSIER...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col justify-between relative overflow-hidden bg-dot-matrix">
      <div className="relative z-10">
        <Navbar />
        <ProgressSteps currentStep={2} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Top Bar with Back Navigation & Theme Header */}
          <div className="pb-8 border-b border-white/[0.08]">
            <div className="flex items-center justify-between gap-4 mb-4">
              <Link
                to="/tracks"
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-zinc-400 hover:text-white transition-colors group cursor-pointer uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>RETURN TO FORMATION GATE</span>
              </Link>

              {/* Theme Badge */}
              <div
                className="px-3.5 py-1 rounded-full border text-xs font-mono font-bold tracking-widest uppercase backdrop-blur-md"
                style={{
                  backgroundColor: `${currentTrack.accentColor}15`,
                  borderColor: `${currentTrack.accentColor}40`,
                  color: currentTrack.accentColor,
                }}
              >
                THEME GATE • {currentTrack.name.toUpperCase()}
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-zinc-400 uppercase mb-2">
                  <span>STAGE 02 // OFFICIAL CHALLENGE DOSSIER</span>
                </div>
                <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white tracking-wide">
                  {currentTrack.officialTitle}
                </h1>
                <p className="font-sans text-xs sm:text-sm text-zinc-400 mt-2.5 max-w-3xl leading-relaxed">
                  {currentTrack.description}
                </p>
                <div className="mt-2 text-xs font-sans italic text-zinc-400">
                  "{currentTrack.motto}"
                </div>
              </div>

              {/* Lock Status / Action Button */}
              <div className="flex items-center gap-3 shrink-0">
                {isLockedToThisTheme ? (
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-semibold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>THEME LOCKED IN ARENA RECORDS</span>
                    </div>
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                        navigate('/submit');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white text-[#08090C] hover:bg-zinc-200 font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg cursor-pointer transition-transform hover:scale-[1.02]"
                    >
                      <span>PROCEED TO SUBMISSION</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : isLockedToOtherTheme ? (
                  <div className="p-3 rounded-xl bg-[#10141E] border border-white/[0.08] text-xs font-mono text-zinc-400 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-zinc-500" />
                    <span>Your squad is locked to another theme</span>
                  </div>
                ) : (
                  <button
                    onClick={handleOpenLockModal}
                    disabled={!selectedProblemId}
                    className="px-6 py-3 rounded-xl bg-white text-[#08090C] hover:bg-zinc-200 font-mono font-bold text-xs tracking-widest uppercase flex items-center gap-2 active:scale-[0.99] transition-all shadow-xl cursor-pointer disabled:opacity-40"
                  >
                    <Lock className="w-4 h-4" />
                    <span>COMMIT & LOCK THIS CHALLENGE</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 10 Problem Statements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mt-8">
            {themeProblems.map(problem => {
              const isSelected = selectedProblemId === problem.id;
              const isExpanded = expandedProblemId === problem.id;
              const isLockedSelection =
                isLockedToThisTheme && selection?.problemStatementId === problem.id;

              return (
                <motion.div
                  key={problem.id}
                  onClick={() => handleCardClick(problem)}
                  whileHover={!selection ? { y: -2 } : undefined}
                  transition={{ duration: 0.2 }}
                  className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-300 border flex flex-col justify-between ${
                    isLockedSelection
                      ? 'bg-[#121622] border-2 shadow-2xl ring-1 ring-white/20'
                      : isSelected && !selection
                      ? 'bg-[#121622] border-2 shadow-2xl'
                      : 'bg-[#0E1118]/80 border-white/[0.08] hover:border-white/25 hover:bg-[#121622]/90 cursor-pointer'
                  }`}
                  style={{
                    borderColor:
                      isSelected && !isLockedSelection ? currentTrack.accentColor : undefined,
                  }}
                >
                  <div>
                    {/* Header: Code & Difficulty */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="font-mono text-xs px-2.5 py-1 rounded bg-black/60 font-bold border"
                          style={{
                            borderColor: `${currentTrack.accentColor}50`,
                            color: currentTrack.accentColor,
                          }}
                        >
                          {problem.problemCode}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${getDifficultyBadge(
                            problem.difficulty
                          )}`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>

                      {/* Selection Indicator */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isLockedSelection ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                            <Lock className="w-3 h-3" /> LOCKED
                          </span>
                        ) : (
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-white border-white text-[#08090C]'
                                : 'border-white/20 bg-black/40'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#08090C]" />}
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="font-cinzel text-lg font-bold text-white tracking-wide leading-snug">
                      {problem.title}
                    </h3>

                    {problem.objective && (
                      <p className="text-xs text-zinc-300 mt-2 font-sans italic">
                        Objective: {problem.objective}
                      </p>
                    )}

                    <p className="text-xs font-sans text-zinc-400 mt-2 leading-relaxed">
                      {problem.summary}
                    </p>
                  </div>

                  {/* Expandable Tactical Dossier */}
                  <div className="mt-5 pt-3.5 border-t border-white/[0.08]">
                    <button
                      type="button"
                      onClick={e => handleToggleExpand(e, problem.id)}
                      className="flex items-center justify-between w-full text-xs font-mono font-semibold text-zinc-400 hover:text-white transition-colors py-1 cursor-pointer"
                    >
                      <span>
                        {isExpanded
                          ? 'COLLAPSE SPECIFICATIONS'
                          : 'INSPECT FULL REQUIREMENTS & DATASETS'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="pt-3.5 space-y-3.5 text-xs text-zinc-300"
                        >
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                              CHALLENGE OVERVIEW & SPECIFICATION:
                            </span>
                            <p className="leading-relaxed bg-black/50 p-3 rounded-xl border border-white/[0.06] text-zinc-300 font-sans">
                              {problem.fullDescription}
                            </p>
                          </div>

                          {/* Expected Outcomes */}
                          {problem.expectedOutcomes && problem.expectedOutcomes.length > 0 && (
                            <div>
                              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
                                DELIVERABLES & OUTCOMES:
                              </span>
                              <ul className="space-y-1">
                                {problem.expectedOutcomes.map((outcome, oIdx) => (
                                  <li key={oIdx} className="flex items-start gap-2 text-[11px]">
                                    <span
                                      className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                                      style={{ backgroundColor: currentTrack.accentColor }}
                                    />
                                    <span className="text-zinc-300">{outcome}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Datasets */}
                          {problem.datasets && problem.datasets.length > 0 && (
                            <div>
                              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
                                REQUIRED & PUBLIC DATASETS:
                              </span>
                              <div className="space-y-1">
                                {problem.datasets.map((ds, dIdx) => (
                                  <div
                                    key={dIdx}
                                    className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/[0.06] text-[11px]"
                                  >
                                    <span className="text-white font-medium">{ds.name}</span>
                                    {ds.url && (
                                      <a
                                        href={ds.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[10px]"
                                        onClick={e => e.stopPropagation()}
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
                              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
                                RECOMMENDED ARSENAL / TECH STACK:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {problem.suggestedTech.map((tech, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#10141E] border border-white/[0.08] text-zinc-400"
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
            <div className="sticky bottom-4 z-30 mt-10 p-4 rounded-2xl bg-[#10141E]/95 border border-white/[0.15] backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  {selection ? <Lock className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                </div>
                <div className="text-xs">
                  <span className="text-zinc-400 font-mono block">
                    {selection ? 'LOCKED CHALLENGE:' : 'READY TO BIND TO SQUAD:'}
                  </span>
                  <span className="text-white font-cinzel font-bold text-sm">
                    [{selectedProblem?.problemCode}] {selectedProblem?.title}
                  </span>
                </div>
              </div>

              {selection ? (
                <button
                  type="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    navigate('/submit');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-[#08090C] hover:bg-zinc-200 font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>PROCEED TO SUBMISSION</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenLockModal}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-[#08090C] hover:bg-zinc-200 font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>LOCK THIS CHALLENGE</span>
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
          isLocking={isLocking}
          onConfirm={handleConfirmLock}
          onCancel={() => setIsModalOpen(false)}
        />
      )}

      <footer className="w-full py-6 text-center text-xs text-zinc-500 border-t border-white/[0.08] mt-12 font-mono">
        <span>{HACKATHON_CONFIG.hackathonName} • {HACKATHON_CONFIG.collegeName}</span>
      </footer>
    </div>
  );
};

export default ThemeDetailPage;
