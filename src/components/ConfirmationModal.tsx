import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Lock, ShieldAlert, Check, X } from 'lucide-react';
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
          className="fixed inset-0 bg-[#08090C]/90 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          className="relative w-full max-w-xl rounded-3xl bg-[#12141C] border border-white/[0.15] shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-6 sm:p-8 overflow-hidden z-10 text-white"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-[#FF3B30] shrink-0">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold tracking-[0.22em] text-[#FF3B30] uppercase">
                  IRREVOCABLE SQUAD COMMITMENT
                </span>
                <h2 className="font-cinzel text-xl sm:text-2xl font-black text-white tracking-wide">
                  Lock Challenge Statement?
                </h2>
              </div>
            </div>

            <button
              onClick={onCancel}
              disabled={isLocking}
              className="p-1 rounded-lg text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selection Recap Box */}
          <div className="my-6 p-5 rounded-2xl bg-[#090A0E] border border-white/[0.08] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
              <span className="text-zinc-500 uppercase tracking-wider">COMMITTED SQUAD:</span>
              <span className="font-bold text-white tracking-wide">{teamName}</span>
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
              <span className="text-zinc-500 uppercase tracking-wider">CHOSEN BATTLE GATE:</span>
              <div className="flex items-center gap-2 font-bold" style={{ color: track.accentColor }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: track.accentColor }} />
                <span>{track.name}</span>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold text-[10px] tracking-wider">
                  {problem.problemCode}
                </span>
                <span className="font-cinzel font-bold text-white text-sm">
                  {problem.title}
                </span>
              </div>
              <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed font-sans">
                {problem.summary}
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#FF3B30]" />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          {/* Strict Warning Notice */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <p className="leading-relaxed text-[11px] font-mono">
              NOTICE: Once locked, this challenge selection is permanent in the database. Your squad cannot switch tracks or select another problem statement.
            </p>
          </div>

          {/* Checkbox Confirmation */}
          <label className="mt-5 flex items-start gap-3 cursor-pointer group select-none">
            <div
              onClick={() => setAcknowledged(!acknowledged)}
              className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-all ${
                acknowledged
                  ? 'bg-white border-white text-black'
                  : 'bg-[#090A0E] border-white/20 group-hover:border-white/50'
              }`}
            >
              {acknowledged && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <span
              onClick={() => setAcknowledged(!acknowledged)}
              className="text-xs text-zinc-400 leading-tight group-hover:text-zinc-200 transition-colors font-mono"
            >
              I confirm on behalf of <strong className="text-white font-bold">{teamName}</strong> that we understand this lock is immutable and permanent.
            </span>
          </label>

          {/* Actions */}
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-end gap-3 font-mono">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLocking}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/[0.1] text-zinc-400 hover:text-white hover:border-white/30 text-xs tracking-wider uppercase transition-all"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={!acknowledged || isLocking}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-xs tracking-wider font-bold uppercase transition-all shadow-md ${
                acknowledged && !isLocking
                  ? 'bg-white text-[#08090C] hover:bg-zinc-200 active:scale-[0.98] cursor-pointer'
                  : 'bg-white/10 text-zinc-500 cursor-not-allowed'
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
                  <span>CONFIRM & LOCK CHALLENGE</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
