import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { ProblemStatement } from '../types';
import { Navbar } from '../components/Navbar';
import { ChevronDown, ChevronUp, ArrowLeft, ExternalLink } from 'lucide-react';

const getDifficultyBadge = (difficulty: ProblemStatement['difficulty']) => {
  switch (difficulty) {
    case 'Flagship':
    case 'Grandmaster':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold';
    case 'Hard':
    case 'Challenger':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-semibold';
    default:
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  }
};

export const ThemeDetailPage: React.FC = () => {
  const { themeSlug } = useParams<{ themeSlug: string }>();
  const formUrl = HACKATHON_CONFIG.choiceFormUrl;

  const matchedTrack = useMemo(
    () =>
      HACKATHON_CONFIG.tracks.find(
        t =>
          t.slug === themeSlug ||
          t.id === themeSlug ||
          t.themeKey === themeSlug ||
          t.name.toLowerCase() === (themeSlug || '').toLowerCase()
      ),
    [themeSlug]
  );
  const currentTrack = matchedTrack || HACKATHON_CONFIG.tracks[0];

  const themeProblems = useMemo(
    () =>
      HACKATHON_CONFIG.problemStatements
        .filter(p => p.trackId === currentTrack.id)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [currentTrack.id]
  );

  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(themeProblems[0]?.id || null);

  // Switching gates starts at the top with the first problem open.
  useEffect(() => {
    setExpandedProblemId(themeProblems[0]?.id || null);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [themeProblems]);

  if (!matchedTrack) return <Navigate to="/tracks" replace />;

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col justify-between relative overflow-hidden bg-dot-matrix">
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back link and gate badge */}
          <div className="pb-8 border-b border-white/[0.08]">
            <div className="flex items-center justify-between gap-4 mb-4">
              <Link
                to="/tracks"
                className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-zinc-400 hover:text-white transition-colors group uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>ALL BATTLE GATES</span>
              </Link>

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

            <div className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-zinc-400 uppercase mb-2">
              OFFICIAL CHALLENGE DOSSIER
            </div>
            <h1 className="font-cinzel text-3xl sm:text-5xl font-black text-white tracking-wide">{currentTrack.officialTitle}</h1>
            <p className="font-sans text-xs sm:text-sm text-zinc-400 mt-2.5 max-w-3xl leading-relaxed">{currentTrack.description}</p>
            <div className="mt-2 text-xs font-sans italic text-zinc-400">"{currentTrack.motto}"</div>

            {/* Jump between the five gates */}
            <nav aria-label="Battle gates" className="mt-6 flex flex-wrap gap-2">
              {HACKATHON_CONFIG.tracks.map((t, i) => {
                const active = t.id === currentTrack.id;
                return (
                  <Link
                    key={t.id}
                    to={`/theme/${t.slug}`}
                    aria-current={active ? 'page' : undefined}
                    className={`px-3 py-1.5 rounded-full border font-mono text-[11px] font-semibold tracking-wider uppercase transition-all ${
                      active ? 'text-black font-bold' : 'border-white/[0.12] text-zinc-400 hover:text-white hover:border-white/30'
                    }`}
                    style={active ? { backgroundColor: t.accentColor, borderColor: t.accentColor } : undefined}
                  >
                    {`0${i + 1}`} · {t.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Problem statements */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5 sm:gap-6 mt-8">
            {themeProblems.map(problem => {
              const isExpanded = expandedProblemId === problem.id;
              return (
                <article
                  key={problem.id}
                  className={`relative rounded-2xl p-5 sm:p-6 transition-colors duration-300 border flex flex-col justify-between ${
                    isExpanded ? 'bg-[#121622] border-white/25' : 'bg-[#0E1118]/80 border-white/[0.08] hover:border-white/25'
                  }`}
                  style={isExpanded ? { borderColor: `${currentTrack.accentColor}80` } : undefined}
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span
                        className="font-mono text-xs px-2.5 py-1 rounded bg-black/60 font-bold border"
                        style={{ borderColor: `${currentTrack.accentColor}50`, color: currentTrack.accentColor }}
                      >
                        {problem.problemCode}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${getDifficultyBadge(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </div>

                    <h3 className="font-cinzel text-lg font-bold text-white tracking-wide leading-snug">{problem.title}</h3>

                    {problem.objective && (
                      <p className="text-xs text-zinc-300 mt-2 font-sans italic">Objective: {problem.objective}</p>
                    )}
                    <p className="text-xs font-sans text-zinc-400 mt-2 leading-relaxed">{problem.summary}</p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => setExpandedProblemId(isExpanded ? null : problem.id)}
                      aria-expanded={isExpanded}
                      className="flex items-center justify-between w-full text-xs font-mono font-semibold text-zinc-400 hover:text-white transition-colors py-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'COLLAPSE SPECIFICATIONS' : 'INSPECT FULL REQUIREMENTS & DATASETS'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3.5 space-y-3.5 text-xs text-zinc-300">
                            <div>
                              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                                CHALLENGE OVERVIEW & SPECIFICATION:
                              </span>
                              <p className="leading-relaxed bg-black/50 p-3 rounded-xl border border-white/[0.06] text-zinc-300 font-sans">
                                {problem.fullDescription}
                              </p>
                            </div>

                            {problem.expectedOutcomes?.length > 0 && (
                              <div>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
                                  DELIVERABLES & OUTCOMES:
                                </span>
                                <ul className="space-y-1">
                                  {problem.expectedOutcomes.map((outcome, i) => (
                                    <li key={i} className="flex items-start gap-2 text-[11px]">
                                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: currentTrack.accentColor }} />
                                      <span className="text-zinc-300">{outcome}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {problem.datasets && problem.datasets.length > 0 && (
                              <div>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
                                  REQUIRED & PUBLIC DATASETS:
                                </span>
                                <div className="space-y-1">
                                  {problem.datasets.map((ds, i) => (
                                    <div key={i} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-black/40 border border-white/[0.06] text-[11px]">
                                      <span className="text-white font-medium">{ds.name}</span>
                                      {ds.url && (
                                        <a
                                          href={ds.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[10px] shrink-0"
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

                            {problem.suggestedTech?.length > 0 && (
                              <div>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">
                                  RECOMMENDED ARSENAL / TECH STACK:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {problem.suggestedTech.map((tech, i) => (
                                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#10141E] border border-white/[0.08] text-zinc-400">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Shown only once the organizers add their Google Form link */}
          {formUrl && (
            <div className="mt-10 p-5 rounded-2xl bg-[#10141E]/95 border border-white/[0.15] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-zinc-300 font-sans">Decided on a challenge? Tell the organizers through the official form.</p>
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-[#08090C] hover:bg-zinc-200 font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>SUBMIT YOUR CHOICE</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </main>
      </div>

      <footer className="w-full py-6 text-center text-xs text-zinc-500 border-t border-white/[0.08] mt-12 font-mono">
        <span>{HACKATHON_CONFIG.hackathonName} • {HACKATHON_CONFIG.collegeName}</span>
      </footer>
    </div>
  );
};

export default ThemeDetailPage;
