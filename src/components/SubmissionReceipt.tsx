import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { CheckCircle2, Github, FileText, Calendar, ShieldCheck, Database, FileSpreadsheet, ExternalLink, Users } from 'lucide-react';
import { Submission, Team, Track, ProblemStatement } from '../types';

interface SubmissionReceiptProps {
  submission: Submission;
  team: Team;
  track?: Track;
  problem?: ProblemStatement;
}

export const SubmissionReceipt: React.FC<SubmissionReceiptProps> = ({
  submission,
  team,
  track,
  problem,
}) => {
  useEffect(() => {
    try {
      const end = Date.now() + 1.2 * 1000;
      const colors = ['#D8B46A', '#F3E8CF', '#F59E0B', '#E05A47'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch {
      // Confetti fallback
    }
  }, []);

  const formattedDate = new Date(submission.submittedAt).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getSyncBadge = (status: Submission['spreadsheetSyncStatus']) => {
    switch (status) {
      case 'synced':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Synced with Organiser Spreadsheet
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" /> Sync In Progress
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/70 border border-rose-500/40 text-rose-400 text-xs font-medium">
            Sync Retry Queued
          </span>
        );
      case 'not_configured':
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 text-gold" /> Recorded in Spreadsheet Queue
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto my-8 px-4"
    >
      <div className="relative rounded-3xl bg-charcoal border-2 border-gold/60 p-6 sm:p-10 shadow-[0_0_60px_rgba(216,180,106,0.25)] overflow-hidden">
        {/* Ancient Indian War Emblem Watermark */}
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 pointer-events-none opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gold">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
            <circle cx="50" cy="50" r="15" fill="currentColor" />
          </svg>
        </div>

        {/* Golden Seal & Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gold/20 animate-ping" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gold via-amber-400 to-bronze flex items-center justify-center shadow-gold-glow border-2 border-ivory p-3">
              <svg viewBox="0 0 100 100" className="w-full h-full text-obsidian animate-spin-slow">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
                <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
                <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="3" />
                <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="2" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-obsidian font-black">
                <CheckCircle2 className="w-8 h-8 stroke-[3]" />
              </div>
            </div>
          </div>

          <span className="text-xs font-mono tracking-[0.3em] text-gold uppercase font-semibold">
            OFFICIAL ARENA RECEIPT • RECORD IMMUTABLY SEALED
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-ivory tracking-wide mt-2">
            SUBMISSION COMPLETE
          </h1>
          <p className="font-cinzel text-sm sm:text-base text-gold/90 mt-2 max-w-lg italic">
            "Your solution has entered the eternal records of the Chakravyuh."
          </p>
        </div>

        {/* Receipt Details Card */}
        <div className="mt-8 rounded-2xl bg-[#0B0D13] border border-charcoal-border p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-charcoal-border/70 text-xs">
            <div>
              <span className="text-ivory-muted/70 block mb-1">Authenticated Team:</span>
              <span className="text-sm font-bold text-ivory font-cinzel">{team.teamName}</span>
              <span className="text-[11px] text-ivory-muted/80 block font-mono">Leader: {team.leaderName || 'Leader'} ({team.leaderEmail})</span>
              {team.leaderPhone && (
                <span className="text-[11px] text-gold/80 block font-mono">Contact: {team.leaderPhone}</span>
              )}
            </div>
            <div>
              <span className="text-ivory-muted/70 block mb-1">Time of Conquest:</span>
              <div className="flex items-center gap-1.5 text-ivory font-mono">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Members List if present */}
          {team.members && team.members.length > 0 && (
            <div className="pb-4 border-b border-charcoal-border/70 text-xs">
              <span className="text-ivory-muted/70 block mb-1">Registered Squad Members:</span>
              <div className="flex flex-wrap gap-1.5">
                {team.members.map((m, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-charcoal border border-charcoal-border text-ivory text-[11px]">
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Locked Track & Problem */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-charcoal-border/70 text-xs">
            <div>
              <span className="text-ivory-muted/70 block mb-1">Theme Gate:</span>
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: track?.accentColor || '#D8B46A' }}
                />
                <span className="font-cinzel font-bold text-ivory text-sm">
                  {track?.officialTitle || track?.name || 'Selected Theme'}
                </span>
              </div>
            </div>
            <div>
              <span className="text-ivory-muted/70 block mb-1">Bound Challenge:</span>
              <div className="text-ivory font-medium">
                <span className="px-1.5 py-0.5 rounded bg-gold/15 text-gold font-mono text-[10px] mr-1.5 font-bold">
                  {problem?.problemCode || 'CHALLENGE'}
                </span>
                <span className="font-cinzel">{problem?.title || 'Locked Problem Statement'}</span>
              </div>
            </div>
          </div>

          {/* Submitted Artifacts */}
          <div className="space-y-3 text-xs">
            <span className="text-ivory-muted/70 block">Submitted Artifacts & Repositories:</span>
            
            {/* GitHub Repo */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-card border border-charcoal-border">
              <div className="flex items-center gap-3 min-w-0">
                <Github className="w-4 h-4 text-gold shrink-0" />
                <span className="text-ivory font-mono truncate">{submission.githubRepoUrl}</span>
              </div>
              <a
                href={submission.githubRepoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-gold hover:underline text-xs shrink-0 ml-2 cursor-pointer"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* PowerPoint File */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-charcoal-card border border-charcoal-border">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-gold shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-ivory font-medium truncate">{submission.pptFileName}</span>
                  <span className="text-[10px] text-ivory-muted/60 font-mono">
                    {formatFileSize(submission.pptSizeBytes)} • PowerPoint Presentation
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/30">
                Encrypted Vault
              </span>
            </div>
          </div>

          {/* Verification & Sync Footnote */}
          <div className="pt-3 border-t border-charcoal-border/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-ivory-muted">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Selection & Submission: <strong className="text-emerald-400">LOCKED & VERIFIED</strong></span>
            </div>
            <div>
              {getSyncBadge(submission.spreadsheetSyncStatus)}
            </div>
          </div>
        </div>

        {/* Permanent Lock Notice */}
        <p className="mt-6 text-center text-xs text-ivory-muted/60">
          This submission receipt is permanently tied to your team. Edits are locked per hackathon bylaws.
        </p>
      </div>
    </motion.div>
  );
};
