import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, KeyRound, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { dataService } from '../lib/dataService';

type Phase = 'checking' | 'ready' | 'invalid' | 'done';

export const ResetPasswordPage: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('checking');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The emailed link signs the visitor in with a short-lived recovery session.
  useEffect(() => {
    if (!supabase) {
      setPhase('invalid');
      return;
    }
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) setPhase(p => (p === 'done' ? p : 'ready'));
    });
    supabase.auth.getSession().then(({ data: s }) => setPhase(p => (p === 'checking' ? (s.session ? 'ready' : 'invalid') : p)));
    return () => data.subscription.unsubscribe();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError('Passcode must be at least 6 characters.');
    if (password !== confirm) return setError('The two passcodes do not match.');
    setBusy(true);
    try {
      await dataService.updatePassword(password);
      await dataService.signOut();
      setPhase('done');
    } catch (err: any) {
      setError(err?.message || 'Could not update your passcode. The link may have expired.');
    } finally {
      setBusy(false);
    }
  };

  const input =
    'w-full px-3.5 py-2.5 rounded-xl bg-[#08090C] border border-white/[0.1] focus:border-white focus:ring-1 focus:ring-white text-sm text-white placeholder-zinc-600 outline-none transition-colors font-mono';

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F3F4F6] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-[#12141C] border border-white/[0.1] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-2 mb-6">
          <KeyRound className="w-4 h-4 text-zinc-400" />
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-400">Reset passcode</span>
        </div>

        {phase === 'checking' && (
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <Loader2 className="w-5 h-5 animate-spin" /> Verifying your link...
          </div>
        )}

        {phase === 'invalid' && (
          <>
            <h1 className="font-cinzel text-2xl font-black text-white">Link not valid</h1>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              This reset link is invalid or has expired. Request a new one with "Forgot passcode?" on the sign-in page.
            </p>
            <Link to="/login" className="mt-6 block w-full py-3 rounded-xl bg-white text-black text-center font-mono text-xs font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors">
              Back to sign in
            </Link>
          </>
        )}

        {phase === 'ready' && (
          <form onSubmit={submit} className="space-y-4">
            <h1 className="font-cinzel text-2xl font-black text-white">Choose a new passcode</h1>
            {error && (
              <div role="alert" className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            <div>
              <label htmlFor="rp-new" className="block font-mono text-[10px] tracking-wider uppercase text-zinc-400 mb-1.5">New passcode (min 6 chars)</label>
              <input id="rp-new" type="password" autoComplete="new-password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className={input} />
            </div>
            <div>
              <label htmlFor="rp-confirm" className="block font-mono text-[10px] tracking-wider uppercase text-zinc-400 mb-1.5">Confirm passcode</label>
              <input id="rp-confirm" type="password" autoComplete="new-password" required value={confirm} onChange={e => setConfirm(e.target.value)} className={input} />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-xl bg-white text-black font-mono text-xs font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}
              Update passcode
            </button>
          </form>
        )}

        {phase === 'done' && (
          <>
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h1 className="font-cinzel text-2xl font-black text-white">Passcode updated</h1>
            </div>
            <p className="mt-2 text-sm text-zinc-400">You can now sign in with your new passcode.</p>
            <Link to="/login" className="mt-6 block w-full py-3 rounded-xl bg-white text-black text-center font-mono text-xs font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors">
              Go to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
