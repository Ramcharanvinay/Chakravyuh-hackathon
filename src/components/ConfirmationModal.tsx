import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Lock, ShieldAlert, Check } from 'lucide-react';
import { Track, ProblemStatement } from '../types';

interface ConfirmationModalProps {
  isOpen: boolean;
  track: Track;
  problem: ProblemStatement;
  teamName: string;
  isLocking: boolean;
  error?: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  track,
  problem,
  teamName,
  isLocking,
  error,
  onCancel,
  onConfirm,
}) => {
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isLocking ? onCancel : undefined}
          className="fixed inset-0 bg-[#08090D]/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          className="relative w-full max-w-xl rounded-2xl bg-charcoal border-2 border-gold/50 shadow-[0_0_50px_rgba(216,180,106,0.2)] p-6 sm:p-8 overflow-hidden z-10"
        >
          {/* Ancient Ornamental Corner Accents */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gold/60" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gold/60" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gold/60" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gold/60" />

          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-ember/15 border border-ember/40 flex items-center justify-center text-ember shrink-0">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-sans font-semibold tracking-widest text-ember uppercase">
                IRREVOCABLE BATTLE PLEDGE
              </span>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-ivory tracking-wide">
                Lock Track & Challenge Choice?
              </h2>
            </div>
          </div>

          {/* Selection Recap Box */}
          <div className="my-6 p-4 rounded-xl bg-charcoal-card border border-charcoal-border space-y-3 font-sans">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-charcoal-border/70">
              <span className="text-ivory-muted font-sans font-semibold">Pledging Team:</span>
              <span className="font-sans font-semibold text-ivory">{teamName}</span>
            </div>

            <div className="flex items-center justify-between text-xs pb-2 border-b border-charcoal-border/70">
              <span className="text-ivory-muted font-sans font-semibold">Chosen Track Gate:</span>
              <div className="flex items-center gap-1.5 font-cinzel font-bold" style={{ color: track.accentColor }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: track.accentColor }} />
                <span>{track.name}</span>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/30 font-sans font-bold text-[10px]">
                  {problem.problemCode}
                </span>
                <span className="font-cinzel font-semibold text-ivory text-sm">
                  {problem.title}
                </span>
              </div>
              <p className="text-ivory-muted/80 text-[11px] font-sans line-clamp-2 pt-1">
                {problem.summary}
              </p>
            </div>
          </div>

          {/* Error Alert if lock failed */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 font-sans">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          {/* Strict Warning Banner */}
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3 font-sans">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <p className="leading-relaxed font-sans text-xs">
              Once you lock your choice, your team is permanently committed in the Supabase database. You cannot re-select another track or problem statement under any circumstances.
            </p>
          </div>

          {/* Mandatory Checkbox for Second Explicit Confirmation */}
          <label className="mt-5 flex items-start gap-3 cursor-pointer group select-none font-sans">
            <div
              onClick={() => setAcknowledged(!acknowledged)}
              className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-all ${
                acknowledged
                  ? 'bg-gold border-gold text-obsidian'
                  : 'bg-charcoal-card border-charcoal-border group-hover:border-gold/50'
              }`}
            >
              {acknowledged && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span
              onClick={() => setAcknowledged(!acknowledged)}
              className="text-xs text-ivory-muted leading-tight group-hover:text-ivory transition-colors font-sans"
            >
              I solemnly confirm on behalf of <strong className="text-gold font-semibold font-sans">{teamName}</strong> that we understand this lock is irrevocable and permanent.
            </span>
          </label>

          {/* Actions */}
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-end gap-3 font-sans">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLocking}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-charcoal-border text-ivory-muted hover:text-ivory hover:border-gold/40 text-xs tracking-wider font-sans font-semibold uppercase transition-all"
            >
              RETREAT & REVIEW
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={!acknowledged || isLocking}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-sans text-xs tracking-widest font-bold uppercase transition-all duration-300 shadow-gold-subtle ${
                acknowledged && !isLocking
                  ? 'bg-gradient-to-r from-gold to-amber-500 text-obsidian hover:brightness-110 cursor-pointer shadow-gold-glow'
                  : 'bg-charcoal-border text-ivory-muted/50 cursor-not-allowed'
              }`}
            >
              {isLocking ? (
                <>
                  <Lock className="w-4 h-4 animate-spin" />
                  <span>ENGRAVING IN DATABASE...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>CONFIRM & PROCEED TO SUBMISSION</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
