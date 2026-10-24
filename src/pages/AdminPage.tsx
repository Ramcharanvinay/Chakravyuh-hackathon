import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  Lock,
  LogOut,
  Pencil,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  UserCheck,
  Users,
} from 'lucide-react';
import { dataService, DEMO_ADMIN } from '../lib/dataService';
import { isSupabaseConfigured } from '../lib/supabase';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { TEAM_MAX_SIZE, TEAM_MIN_SIZE } from '../lib/teamRules';
import { AdminStats, AdminTeamRow, TeamStatus } from '../types';
import { TeamEditorModal } from '../components/admin/TeamEditorModal';

type Phase = 'loading' | 'login' | 'denied' | 'ready';
type StatusFilter = 'all' | TeamStatus;

const STATUS_STYLE: Record<TeamStatus, string> = {
  registered: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30',
  locked: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  submitted: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
};

const csvCell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;

function exportCsv(teams: AdminTeamRow[]) {
  const header = [
    'Team', 'Leader', 'Reg No', 'Leader Email', 'Team Size', 'Members', 'Track',
    'Problem Code', 'Problem Title', 'Status', 'Registered At', 'GitHub', 'Deployed URL',
  ];
  const rows = teams.map(t => {
    const track = HACKATHON_CONFIG.tracks.find(x => x.id === t.trackId);
    const prob = HACKATHON_CONFIG.problemStatements.find(x => x.id === t.problemId);
    return [
      t.teamName, t.leaderName, t.leaderRegNo, t.leaderEmail, t.teamSize,
      t.members.map(m => (m.email ? `${m.name} <${m.email}>` : m.name)).join('; '),
      track?.name || '', prob?.problemCode || '', prob?.title || '', t.status, t.createdAt,
      t.submission?.githubRepoUrl || '', t.submission?.deployedUrl || '',
    ];
  });
  const csv = [header, ...rows].map(r => r.map(csvCell).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `chakravyuh-teams-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; hint?: string }> = ({
  icon,
  label,
  value,
  hint,
}) => (
  <div className="rounded-2xl bg-[#12141C] border border-white/[0.08] p-5">
    <div className="flex items-center justify-between text-zinc-500">
      <span className="font-mono text-[10px] tracking-[0.2em] uppercase">{label}</span>
      {icon}
    </div>
    <div className="mt-3 font-cinzel text-4xl font-black text-white">{value}</div>
    {hint && <div className="mt-1 text-xs text-zinc-500">{hint}</div>}
  </div>
);

const Bar: React.FC<{ label: string; value: number; max: number; color: string; suffix?: string }> = ({
  label,
  value,
  max,
  color,
  suffix,
}) => (
  <div className="flex items-center gap-3 text-xs">
    <span className="w-28 shrink-0 truncate font-mono text-zinc-400">{label}</span>
    <div className="flex-1 h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${max ? (value / max) * 100 : 0}%`, background: color }} />
    </div>
    <span className="w-16 shrink-0 text-right font-mono text-zinc-300">
      {value}
      {suffix && (value === 1 ? suffix.replace(/s$/, '') : suffix)}
    </span>
  </div>
);

export const AdminPage: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('loading');
  const [email, setEmail] = useState('');
  const [data, setData] = useState<{ stats: AdminStats; teams: AdminTeamRow[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState<AdminTeamRow | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sizeFilter, setSizeFilter] = useState<'all' | '2' | '3' | '4'>('all');

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setRefreshing(true);
    try {
      setData(await dataService.adminGetOverview());
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Could not load registrations.');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const boot = useCallback(async () => {
    const s = await dataService.adminSession();
    setEmail(s.email);
    if (!s.signedIn) return setPhase('login');
    if (!s.isAdmin) return setPhase('denied');
    setPhase('ready');
    load();
  }, [load]);

  useEffect(() => {
    boot();
  }, [boot]);

  // Keep the numbers fresh while the dashboard is open.
  useEffect(() => {
    if (phase !== 'ready') return;
    const id = window.setInterval(() => load(true), 30000);
    return () => window.clearInterval(id);
  }, [phase, load]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setError(null);
    try {
      await dataService.adminSignIn(loginEmail, loginPassword);
      setLoginPassword('');
      await boot();
    } catch (err: any) {
      setError(err?.message || 'Sign in failed.');
    } finally {
      setLoggingIn(false);
    }
  };

  const signOut = async () => {
    await dataService.signOut();
    setData(null);
    setError(null);
    setPhase('login');
  };

  const teams = data?.teams ?? [];
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teams.filter(t => {
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (sizeFilter !== 'all' && String(t.teamSize) !== sizeFilter) return false;
      if (!q) return true;
      return [t.teamName, t.leaderName, t.leaderEmail, t.leaderRegNo, ...t.members.map(m => m.name)]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [teams, search, statusFilter, sizeFilter]);

  const shell = (children: React.ReactNode) => (
    <div className="min-h-screen bg-[#08090C] text-[#F3F4F6]">{children}</div>
  );

  if (phase === 'loading') {
    return shell(
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (phase === 'login' || phase === 'denied') {
    return shell(
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-3xl bg-[#12141C] border border-white/[0.1] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert className="w-4 h-4 text-zinc-400" />
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-400">Admin console</span>
          </div>

          {phase === 'denied' ? (
            <>
              <h1 className="font-cinzel text-2xl font-black text-white">Access denied</h1>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                {email} is signed in but is not an administrator. Sign out and use an admin account.
              </p>
              <button
                onClick={signOut}
                className="mt-6 w-full py-3 rounded-xl bg-white text-black font-mono text-xs font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Sign out
              </button>
            </>
          ) : (
            <form onSubmit={signIn} className="space-y-4">
              <h1 className="font-cinzel text-2xl font-black text-white">Sign in</h1>
              {error && (
                <div role="alert" className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
              <div>
                <label htmlFor="adm-email" className="block font-mono text-[10px] tracking-wider uppercase text-zinc-400 mb-1.5">Email</label>
                <input
                  id="adm-email"
                  type="email"
                  required
                  autoComplete="username"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#08090C] border border-white/[0.12] focus:border-white outline-none text-sm text-white"
                />
              </div>
              <div>
                <label htmlFor="adm-pass" className="block font-mono text-[10px] tracking-wider uppercase text-zinc-400 mb-1.5">Password</label>
                <input
                  id="adm-pass"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#08090C] border border-white/[0.12] focus:border-white outline-none text-sm text-white"
                />
              </div>
              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-3 rounded-xl bg-white text-black font-mono text-xs font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loggingIn && <Loader2 className="w-4 h-4 animate-spin" />}
                Enter console
              </button>
              {!isSupabaseConfigured && (
                <p className="text-[11px] font-mono text-amber-400/80 leading-relaxed">
                  Sandbox mode (no Supabase connected). Demo admin: {DEMO_ADMIN.email} / {DEMO_ADMIN.password}
                </p>
              )}
            </form>
          )}
        </div>
        <Link to="/" className="mt-6 font-mono text-[10px] tracking-widest uppercase text-zinc-500 hover:text-white transition-colors">
          Back to arena
        </Link>
      </div>
    );
  }

  const stats = data?.stats;
  const maxSize = Math.max(1, ...[2, 3, 4].map(n => stats?.sizeDistribution[String(n)] || 0));
  const maxTrack = Math.max(1, ...HACKATHON_CONFIG.tracks.map(t => stats?.byTrack[t.id] || 0));
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400000).toISOString().slice(0, 10);
    return { d, n: stats?.registrationsByDay[d] || 0 };
  });
  const maxDay = Math.max(1, ...days.map(x => x.n));
  const avg = stats && stats.teams ? (stats.participants / stats.teams).toFixed(1) : '0.0';

  return shell(
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#08090C]/90 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/chakravyuh-luxury-wheel.svg" alt="" className="w-9 h-9 shrink-0" />
            <div className="min-w-0">
              <div className="font-cinzel font-black tracking-[0.12em] text-white leading-none">CHAKRAVYUH</div>
              <div className="font-mono text-[10px] tracking-widest uppercase text-zinc-500 truncate">Admin console · {email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load()}
              disabled={refreshing}
              aria-label="Refresh"
              className="p-2.5 rounded-xl border border-white/[0.1] text-zinc-300 hover:bg-white/[0.06] transition-colors cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => exportCsv(filtered)}
              disabled={!filtered.length}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/[0.1] text-zinc-300 hover:bg-white/[0.06] font-mono text-[11px] tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-40"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-mono text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
        {error && (
          <div role="alert" className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <section aria-label="Registration totals" className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard icon={<Users className="w-4 h-4" />} label="Teams registered" value={stats?.teams ?? '–'} />
          <StatCard icon={<UserCheck className="w-4 h-4" />} label="People registered" value={stats?.participants ?? '–'} hint={`avg ${avg} per team`} />
          <StatCard icon={<Lock className="w-4 h-4" />} label="Problems locked" value={stats?.locked ?? '–'} />
          <StatCard icon={<Send className="w-4 h-4" />} label="Submissions" value={stats?.submitted ?? '–'} />
          <StatCard
            icon={<CheckCircle2 className="w-4 h-4" />}
            label="Team size rule"
            value={`${TEAM_MIN_SIZE}–${TEAM_MAX_SIZE}`}
            hint="leader + members"
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-[#12141C] border border-white/[0.08] p-5 space-y-3">
            <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400">Team size</h2>
            {[2, 3, 4].map(n => (
              <Bar key={n} label={`${n} people`} value={stats?.sizeDistribution[String(n)] || 0} max={maxSize} color="#ffffff" suffix={' teams'} />
            ))}
          </div>
          <div className="rounded-2xl bg-[#12141C] border border-white/[0.08] p-5 space-y-3">
            <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400">Teams per track</h2>
            {HACKATHON_CONFIG.tracks.map(t => (
              <Bar key={t.id} label={t.name} value={stats?.byTrack[t.id] || 0} max={maxTrack} color={t.accentColor} />
            ))}
          </div>
          <div className="rounded-2xl bg-[#12141C] border border-white/[0.08] p-5">
            <h2 className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-400">Registrations, last 14 days</h2>
            <div className="mt-4 flex items-end gap-1.5 h-28" role="img" aria-label="Registrations per day for the last 14 days">
              {days.map(x => (
                <div key={x.d} className="flex-1 flex flex-col items-center justify-end h-full" title={`${x.d}: ${x.n}`}>
                  <div className="w-full rounded-t bg-emerald-400/80" style={{ height: `${x.n ? Math.max(8, (x.n / maxDay) * 100) : 3}%`, opacity: x.n ? 1 : 0.25 }} />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] text-zinc-600">
              <span>{days[0].d.slice(5)}</span>
              <span>{days[13].d.slice(5)}</span>
            </div>
          </div>
        </section>

        <section aria-label="Registered teams" className="rounded-2xl bg-[#12141C] border border-white/[0.08]">
          <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-3 border-b border-white/[0.08]">
            <h2 className="font-cinzel text-xl font-black text-white lg:mr-auto">
              Teams <span className="text-zinc-500 font-mono text-sm font-normal">({filtered.length}/{teams.length})</span>
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search team, leader, email, member"
                aria-label="Search teams"
                className="w-full lg:w-80 pl-9 pr-3 py-2.5 rounded-xl bg-[#08090C] border border-white/[0.12] focus:border-white outline-none text-sm text-white placeholder-zinc-600"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap" role="group" aria-label="Filter by status">
              {(['all', 'registered', 'locked', 'submitted'] as StatusFilter[]).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  aria-pressed={statusFilter === s}
                  className={`px-3 py-2 rounded-lg font-mono text-[10px] tracking-wider uppercase border transition-colors cursor-pointer ${
                    statusFilter === s ? 'bg-white text-black border-white font-bold' : 'border-white/[0.12] text-zinc-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <select
              value={sizeFilter}
              onChange={e => setSizeFilter(e.target.value as typeof sizeFilter)}
              aria-label="Filter by team size"
              className="px-3 py-2.5 rounded-xl bg-[#08090C] border border-white/[0.12] text-sm text-zinc-300 outline-none"
            >
              <option value="all">Any size</option>
              <option value="2">2 people</option>
              <option value="3">3 people</option>
              <option value="4">4 people</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-zinc-500">
              {teams.length === 0 ? 'No teams have registered yet.' : 'No teams match these filters.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="font-mono text-[10px] tracking-[0.15em] uppercase text-zinc-500 border-b border-white/[0.06]">
                    <th className="px-5 py-3 font-semibold">Team</th>
                    <th className="px-3 py-3 font-semibold">Leader</th>
                    <th className="px-3 py-3 font-semibold">Size</th>
                    <th className="px-3 py-3 font-semibold">Track · Problem</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Registered</th>
                    <th className="px-5 py-3"><span className="sr-only">Edit</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => {
                    const track = HACKATHON_CONFIG.tracks.find(x => x.id === t.trackId);
                    const prob = HACKATHON_CONFIG.problemStatements.find(x => x.id === t.problemId);
                    return (
                      <tr key={t.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] align-top">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-white">{t.teamName}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">{t.members.map(m => m.name).join(', ')}</div>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="text-zinc-200">{t.leaderName || '–'}</div>
                          <div className="text-xs text-zinc-500 font-mono">{t.leaderRegNo}</div>
                          <div className="text-xs text-zinc-500">{t.leaderEmail}</div>
                        </td>
                        <td className="px-3 py-3.5 font-mono text-zinc-200">{t.teamSize}</td>
                        <td className="px-3 py-3.5 text-xs">
                          {track ? (
                            <>
                              <div style={{ color: track.accentColor }} className="font-semibold">{track.name}</div>
                              <div className="text-zinc-500 mt-0.5">{prob ? `${prob.problemCode} ${prob.title}` : ''}</div>
                            </>
                          ) : (
                            <span className="text-zinc-600">–</span>
                          )}
                        </td>
                        <td className="px-3 py-3.5">
                          <span className={`inline-block px-2.5 py-1 rounded-full border font-mono text-[10px] tracking-wider uppercase ${STATUS_STYLE[t.status]}`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-xs text-zinc-500 whitespace-nowrap">{new Date(t.createdAt).toLocaleString()}</td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => setEditing(t)}
                            aria-label={`Edit ${t.teamName}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.12] text-zinc-300 hover:bg-white hover:text-black font-mono text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {editing && (
        <TeamEditorModal key={editing.id} team={editing} onClose={() => setEditing(null)} onChanged={() => load(true)} />
      )}
    </>
  );
};

export default AdminPage;
