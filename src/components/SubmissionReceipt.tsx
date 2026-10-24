import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { CheckCircle2, Github, Globe, Calendar, ShieldCheck, ExternalLink } from 'lucide-react';
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
      const colors = ['#FFFFFF', '#38BDF8', '#FF3B30', '#10B981'];

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-3xl mx-auto my-8 px-4"
    >
      <div className="relative rounded-3xl bg-[#0E1118] border border-white/[0.15] p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Verification Checkmark Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
          </div>

          <span className="text-xs font-mono font-bold tracking-[0.25em] text-emerald-400 uppercase">
            OFFICIAL ARENA RECEIPT // RECORD IMMUTABLY SEALED
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-black text-white tracking-wide mt-2">
            SUBMISSION COMPLETE
          </h1>
          <p className="font-sans text-xs sm:text-sm text-zinc-400 mt-2 max-w-lg">
            Your squad's solution and deployment credentials have been securely stored in the
            Chakravyuh database.
          </p>
        </div>

        {/* Receipt Details Card */}
        <div className="mt-8 rounded-2xl bg-[#08090C] border border-white/[0.08] p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-white/[0.08] text-xs">
            <div>
              <span className="text-zinc-500 block mb-1 font-mono uppercase tracking-wider">
                AUTHENTICATED SQUAD:
              </span>
              <span className="text-sm font-bold text-white font-cinzel">{team.teamName}</span>
              <span className="text-[11px] text-zinc-400 block mt-0.5 font-sans">
                Leader: {team.leaderName || 'Leader'} ({team.leaderEmail})
              </span>
            </div>
            <div>
              <span className="text-zinc-500 block mb-1 font-mono uppercase tracking-wider">
                TIMESTAMP:
              </span>
              <div className="flex items-center gap-1.5 text-zinc-300 font-mono">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Members List if present */}
          {team.members && team.members.length > 0 && (
            <div className="pb-4 border-b border-white/[0.08] text-xs">
              <span className="text-zinc-500 block mb-2 font-mono uppercase tracking-wider">
                REGISTERED SQUAD MEMBERS:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {team.members.map((m, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#121622] border border-white/[0.08] text-zinc-300 text-[11px] font-mono"
                  >
                    {m.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Locked Track & Problem */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-white/[0.08] text-xs">
            <div>
              <span className="text-zinc-500 block mb-1 font-mono uppercase tracking-wider">
                THEME GATE:
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: track?.accentColor || '#38BDF8' }}
                />
                <span className="font-cinzel font-bold text-white text-sm">
                  {track?.officialTitle || track?.name || 'Selected Theme'}
                </span>
              </div>
            </div>
            <div>
              <span className="text-zinc-500 block mb-1 font-mono uppercase tracking-wider">
                BOUND CHALLENGE:
              </span>
              <div className="text-white font-medium">
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px] mr-1.5 font-bold">
                  {problem?.problemCode || 'CHALLENGE'}
                </span>
                <span className="font-cinzel font-bold">
                  {problem?.title || 'Locked Problem Statement'}
                </span>
              </div>
            </div>
          </div>

          {/* Submitted Artifacts */}
          <div className="space-y-3 text-xs">
            <span className="text-zinc-500 block font-mono uppercase tracking-wider">
              SUBMITTED REPOSITORIES & DEPLOYMENTS:
            </span>

            {/* GitHub URL */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#121622] border border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <Github className="w-4 h-4 text-zinc-400" />
                <span className="font-mono text-zinc-300 break-all">{submission.githubUrl}</span>
              </div>
              <a
                href={submission.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[11px] shrink-0 ml-3"
              >
                <span>Inspect</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Deployed Web App URL */}
            {submission.deployedUrl && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#121622] border border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-zinc-300 break-all">{submission.deployedUrl}</span>
                </div>
                <a
                  href={submission.deployedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono text-[11px] shrink-0 ml-3"
                >
                  <span>Launch Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>CRYPTOGRAPHIC HASH VERIFIED & RECORDED IN CHAKRAVYUH ARENA</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SubmissionReceipt;
