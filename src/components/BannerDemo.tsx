import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Database, Sparkles, CheckCircle2 } from 'lucide-react';

export const BannerDemo: React.FC = () => {
  const { isConfigured } = useAuth();

  if (isConfigured) {
    return (
      <div className="bg-emerald-950/40 border-b border-emerald-500/20 px-4 py-1.5 text-center text-[11px] text-emerald-300 flex items-center justify-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>Connected to Live Supabase PostgreSQL & Storage Cloud</span>
      </div>
    );
  }

  return (
    <div className="bg-[#12141B] border-b border-gold/20 px-4 py-2 text-center text-xs text-ivory-muted flex items-center justify-center flex-wrap gap-2">
      <div className="flex items-center gap-1.5 text-gold font-semibold">
        <Sparkles className="w-3.5 h-3.5" />
        <span>DEMO / PREVIEW ARENA MODE</span>
      </div>
      <span className="text-ivory-muted/40">•</span>
      <span className="text-[11px]">
        Running with persistent browser sandbox. To connect your live PostgreSQL database & storage, provide <code className="text-gold font-mono bg-charcoal px-1.5 py-0.5 rounded border border-charcoal-border">VITE_SUPABASE_URL</code> in <code className="text-gold font-mono bg-charcoal px-1.5 py-0.5 rounded border border-charcoal-border">.env</code>.
      </span>
    </div>
  );
};
