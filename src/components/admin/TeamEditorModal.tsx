import React, { useEffect, useState } from 'react';
import { AlertCircle, Loader2, Plus, Trash2, X } from 'lucide-react';
import { dataService } from '../../lib/dataService';
import { HACKATHON_CONFIG } from '../../config/hackathonConfig';
import { MAX_EXTRA_MEMBERS, MIN_EXTRA_MEMBERS, TEAM_MAX_SIZE, TEAM_MIN_SIZE, rosterError } from '../../lib/teamRules';
import { AdminTeamRow, TeamMember } from '../../types';

type Confirm = null | 'delete' | 'selection' | 'submission';

interface Props {
  team: AdminTeamRow;
  onClose: () => void;
  onChanged: () => void;
}

const field =
  'w-full px-3 py-2 rounded-lg bg-[#08090C] border border-white/[0.12] focus:border-white focus:ring-1 focus:ring-white text-sm text-white placeholder-zinc-600 outline-none transition-colors';
const label = 'block font-mono text-[10px] font-semibold tracking-wider uppercase text-zinc-400 mb-1.5';

export const TeamEditorModal: React.FC<Props> = ({ team, onClose, onChanged }) => {
  const [teamName, setTeamName] = useState(team.teamName);
  const [leaderName, setLeaderName] = useState(team.leaderName);
  const [leaderRegNo, setLeaderRegNo] = useState(team.leaderRegNo);
  const [leaderEmail, setLeaderEmail] = useState(team.leaderEmail);
  const [members, setMembers] = useState<TeamMember[]>(team.members.map(m => ({ ...m })));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<Confirm>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !busy && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy, onClose]);

  const track = HACKATHON_CONFIG.tracks.find(t => t.id === team.trackId);
  const problem = HACKATHON_CONFIG.problemStatements.find(p => p.id === team.problemId);
  const size = 1 + members.filter(m => m.name.trim()).length;
  const sizeIssue = rosterError(members);

  const run = async (action: () => Promise<void>, closeAfter = true) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      onChanged();
      if (closeAfter) onClose();
    } catch (e: any) {
      setError(e?.message || 'Something went wrong.');
      setConfirm(null);
    } finally {
      setBusy(false);
    }
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    run(() => dataService.adminUpdateTeam(team.id, { teamName, leaderName, leaderRegNo, leaderEmail, members }));
  };

  const setMember = (i: number, key: keyof TeamMember, value: string) =>
    setMembers(members.map((m, idx) => (idx === i ? { ...m, [key]: value } : m)));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !busy && onClose()} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Edit team ${team.teamName}`}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0E1016] border border-white/[0.1] shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-[#0E1016]/95 backdrop-blur border-b border-white/[0.08]">
          <div>
            <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-500">Admin edit</div>
            <h2 className="font-cinzel text-xl font-black text-white">{team.teamName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={save} className="px-6 py-5 space-y-5">
          {error && (
            <div role="alert" className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-[#FF3B30] shrink-0 mt-0.5" />
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          <div>
            <label className={label} htmlFor="te-name">Team name</label>
            <input id="te-name" className={field} value={teamName} onChange={e => setTeamName(e.target.value)} required minLength={3} maxLength={60} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={label} htmlFor="te-lead">Leader name</label>
              <input id="te-lead" className={field} value={leaderName} onChange={e => setLeaderName(e.target.value)} required />
            </div>
            <div>
              <label className={label} htmlFor="te-reg">Registration no.</label>
              <input id="te-reg" className={`${field} font-mono`} value={leaderRegNo} onChange={e => setLeaderRegNo(e.target.value)} required />
            </div>
            <div>
              <label className={label} htmlFor="te-email">Leader email</label>
              <input id="te-email" type="email" className={field} value={leaderEmail} onChange={e => setLeaderEmail(e.target.value)} required />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`${label} mb-0`}>
                Members · team size {size}/{TEAM_MAX_SIZE} (allowed {TEAM_MIN_SIZE} to {TEAM_MAX_SIZE})
              </span>
              {members.length < MAX_EXTRA_MEMBERS && (
                <button
                  type="button"
                  onClick={() => setMembers([...members, { name: '', email: '', role: 'Member' }])}
                  className="flex items-center gap-1 font-mono text-[10px] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> ADD MEMBER
                </button>
              )}
            </div>
            <div className="space-y-2">
              {members.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    aria-label={`Member ${i + 2} name`}
                    className={field}
                    value={m.name}
                    onChange={e => setMember(i, 'name', e.target.value)}
                    placeholder={`Member ${i + 2} name`}
                  />
                  <input
                    aria-label={`Member ${i + 2} email or roll number`}
                    className={field}
                    value={m.email || ''}
                    onChange={e => setMember(i, 'email', e.target.value)}
                    placeholder="Email / roll no."
                  />
                  <button
                    type="button"
                    onClick={() => setMembers(members.filter((_, idx) => idx !== i))}
                    disabled={members.length <= MIN_EXTRA_MEMBERS}
                    aria-label={`Remove member ${i + 2}`}
                    title={members.length <= MIN_EXTRA_MEMBERS ? `A team needs at least ${TEAM_MIN_SIZE} people` : 'Remove member'}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-zinc-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {sizeIssue && <p className="mt-2 text-xs text-amber-400">{sizeIssue}</p>}
          </div>

          <div className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-4 space-y-2 text-xs">
            <div className="font-mono text-[10px] tracking-wider uppercase text-zinc-500">Progress (read-only)</div>
            <div className="text-zinc-300">
              {track ? (
                <>
                  <span style={{ color: track.accentColor }} className="font-semibold">{track.name}</span>
                  {problem && <span className="text-zinc-400"> · {problem.problemCode} {problem.title}</span>}
                </>
              ) : (
                <span className="text-zinc-500">No problem locked yet</span>
              )}
            </div>
            {team.submission && (
              <div className="text-zinc-400 break-all">
                Repo: <a className="text-sky-400 hover:underline" href={team.submission.githubRepoUrl} target="_blank" rel="noopener noreferrer">{team.submission.githubRepoUrl}</a>
                <br />
                Live: <a className="text-sky-400 hover:underline" href={team.submission.deployedUrl} target="_blank" rel="noopener noreferrer">{team.submission.deployedUrl}</a>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 -mx-6 px-6 py-3 bg-[#0E1016]/95 backdrop-blur border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {team.status !== 'registered' && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirm('selection')}
                  className="px-3 py-2 rounded-lg border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 font-mono text-[10px] tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50"
                >
                  Reset problem lock
                </button>
              )}
              {team.submission && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirm('submission')}
                  className="px-3 py-2 rounded-lg border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 font-mono text-[10px] tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50"
                >
                  Reset submission
                </button>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirm('delete')}
                className="px-3 py-2 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 font-mono text-[10px] tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50"
              >
                Delete team
              </button>
            </div>
            <button
              type="submit"
              disabled={busy || Boolean(sizeIssue)}
              className="px-5 py-2.5 rounded-lg bg-white text-black hover:bg-zinc-200 font-mono text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save changes
            </button>
          </div>

          {confirm && (
            <div role="alertdialog" className="rounded-xl border border-red-500/30 bg-red-950/30 p-4 space-y-3">
              <p className="text-xs text-red-200 leading-relaxed">
                {confirm === 'delete' &&
                  `Delete "${team.teamName}" permanently? This also removes its problem lock and submission. The leader can register again.`}
                {confirm === 'selection' && 'Reset the problem lock? The submission (if any) is removed too, and the team can choose again.'}
                {confirm === 'submission' && 'Reset the submission? The team will be able to submit again.'}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    run(() =>
                      confirm === 'delete'
                        ? dataService.adminDeleteTeam(team.id)
                        : confirm === 'selection'
                        ? dataService.adminResetSelection(team.id)
                        : dataService.adminResetSubmission(team.id)
                    )
                  }
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-mono text-[10px] font-bold tracking-wider uppercase cursor-pointer disabled:opacity-50"
                >
                  Yes, continue
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setConfirm(null)}
                  className="px-4 py-2 rounded-lg border border-white/[0.15] text-zinc-300 hover:bg-white/[0.06] font-mono text-[10px] tracking-wider uppercase cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TeamEditorModal;
