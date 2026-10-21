import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Database, Sparkles, CheckCircle2 } from 'lucide-react';

export const BannerDemo: React.FC = () => {
  const { isConfigured } = useAuth();

  if (isConfigured) {
    return (
      <div className="bg-emerald-950/40 border-b border-emerald-500/20 px-4 py-1.5 text-center text-[11px] text-emerald-300 flex items-center justify-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>VIT-AP University Hackathon Portal • Connected to Live Supabase Backend</span>
      </div>
    );
  }

  return (
    <div className="bg-[#12141B] border-b border-gold/20 px-4 py-2 text-center text-xs text-ivory-muted flex items-center justify-center flex-wrap gap-2">
      <div className="flex items-center gap-1.5 text-gold font-semibold">
        <Sparkles className="w-3.5 h-3.5" />
        <span>VIT-AP UNIVERSITY • CHAKRAVYUH HACKATHON ARENA</span>
      </div>
      <span className="text-ivory-muted/40">•</span>
      <span className="text-[11px]">
        Running in local sandbox mode. Complete registration, explore 50 problem statements across 5 official themes, and submit solutions.
      </span>
    </div>
  );
};
