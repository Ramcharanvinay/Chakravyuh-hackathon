import { supabase, isSupabaseConfigured } from './supabase';
import {
  Team,
  TeamSelection,
  Submission,
  TeamMember,
  AdminStats,
  AdminTeamInput,
  AdminTeamRow,
  TeamStatus,
} from '../types';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';
import { cleanMembers, rosterError } from './teamRules';

/** Thrown when Supabase requires email confirmation before the squad can be created. */
export class RegistrationPendingError extends Error {
  constructor() {
    super(
      'Registration received. Confirm your email using the link we just sent, then sign in here to finish setting up your squad.'
    );
    this.name = 'RegistrationPendingError';
  }
}

const NOT_CONFIGURED =
  'The registration service is not configured. Please contact the organizers.';

const db = () => {
  if (!supabase) throw new Error(NOT_CONFIGURED);
  return supabase;
};

const toRpcMembers = (members: TeamMember[]) =>
  members.map(m => ({ name: m.name, contact: m.email ?? null, role: m.role ?? 'Member' }));

const mapMembers = (rows: any[] | null | undefined): TeamMember[] =>
  [...(rows || [])]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map(m => ({ name: m.name, email: m.contact || undefined, role: m.role || 'Member' }));

// Accepts both the register_team JSON ({members}) and a PostgREST row ({team_members}).
const mapTeamRow = (row: any): Team => ({
  id: row.id,
  ownerUserId: row.owner_user_id,
  teamName: row.team_name,
  leaderName: row.leader_name || undefined,
  leaderEmail: row.leader_email,
  leaderPhone: row.leader_reg_no || undefined,
  members: mapMembers(row.members ?? row.team_members),
  createdAt: row.created_at,
});

const statusOf = (locked: boolean, submitted: boolean): TeamStatus =>
  submitted ? 'submitted' : locked ? 'locked' : 'registered';

async function registerViaRpc(p: {
  teamName: string;
  leaderName: string;
  leaderRegNo: string;
  members: TeamMember[];
}): Promise<Team> {
  const { data, error } = await db().rpc('register_team', {
    p_team_name: p.teamName,
    p_leader_name: p.leaderName,
    p_leader_reg_no: p.leaderRegNo,
    p_members: toRpcMembers(p.members),
  });
  if (error || !data) throw new Error(error?.message || 'Failed to register team.');
  return mapTeamRow(data);
}

const clearPending = () =>
  void db()
    .auth.updateUser({ data: { pending_registration: null } })
    .then(
      () => undefined,
      () => undefined
    );

export const dataService = {
  isConfigured(): boolean {
    return isSupabaseConfigured;
  },

  // ==========================================
  // AUTH & TEAM REGISTRATION
  // ==========================================
  async signUpAndRegisterTeam(
    email: string,
    password: string,
    teamName: string,
    extra?: {
      leaderName?: string;
      leaderPhone?: string;
      members?: TeamMember[];
    }
  ): Promise<{ team: Team; user: { id: string; email: string } }> {
    const trimmedTeamName = teamName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const leaderName = (extra?.leaderName || '').trim();
    const leaderPhone = (extra?.leaderPhone || '').trim();
    const members = cleanMembers(extra?.members);

    if (trimmedTeamName.length < 3) throw new Error('Team name must be at least 3 characters long.');
    if (trimmedTeamName.length > 60) throw new Error('Team name cannot exceed 60 characters.');
    if (!leaderName) throw new Error('Please provide the team leader full name.');
    if (!leaderPhone) throw new Error('Please provide the leader registration number.');
    const rosterIssue = rosterError(members);
    if (rosterIssue) throw new Error(rosterIssue);

    const client = db();

    // The roster rides along in the account metadata so registration can finish after
    // email confirmation (if the project requires it).
    const pending = {
      team_name: trimmedTeamName,
      leader_name: leaderName,
      leader_reg_no: leaderPhone,
      members,
    };

    const signUp = await client.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: { pending_registration: pending },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    let userId = signUp.data.user?.id ?? null;
    let hasSession = Boolean(signUp.data.session);
    const alreadyExists =
      (signUp.error && /already (registered|exists)/i.test(signUp.error.message)) ||
      (signUp.data.user && signUp.data.user.identities?.length === 0);

    if (alreadyExists) {
      // Account exists (e.g. an admin removed the team): the owner can finish by signing in.
      const retry = await client.auth.signInWithPassword({ email: trimmedEmail, password });
      if (retry.error || !retry.data.user) {
        throw new Error('An account with this email already exists. Sign in with your passcode instead.');
      }
      userId = retry.data.user.id;
      hasSession = true;
    } else if (signUp.error) {
      throw new Error(signUp.error.message);
    }

    if (!userId) throw new Error('Failed to register team leader account.');
    if (!hasSession) throw new RegistrationPendingError();

    const team = await registerViaRpc({
      teamName: trimmedTeamName,
      leaderName,
      leaderRegNo: leaderPhone,
      members,
    });
    clearPending();
    return { team, user: { id: userId, email: trimmedEmail } };
  },

  async signIn(email: string, password: string): Promise<{ team: Team; user: { id: string; email: string } }> {
    const client = db();
    const trimmedEmail = email.trim().toLowerCase();

    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });
    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Invalid credentials or user not found.');
    }

    const userId = authData.user.id;
    const { data: teamData } = await client
      .from('teams')
      .select('*, team_members(*)')
      .eq('owner_user_id', userId)
      .maybeSingle();

    let team: Team | null = teamData ? mapTeamRow(teamData) : null;

    // Finish a registration that was waiting on email confirmation.
    if (!team) {
      const pending = authData.user.user_metadata?.pending_registration;
      if (pending?.team_name) {
        try {
          team = await registerViaRpc({
            teamName: pending.team_name,
            leaderName: pending.leader_name,
            leaderRegNo: pending.leader_reg_no,
            members: pending.members || [],
          });
          clearPending();
        } catch (err) {
          await client.auth.signOut();
          throw err;
        }
      }
    }

    if (!team) {
      await client.auth.signOut();
      throw new Error('No squad is registered for this account yet. Use "Register Squad" to create one.');
    }

    return { team, user: { id: userId, email: trimmedEmail } };
  },

  async signOut(): Promise<void> {
    if (supabase) await supabase.auth.signOut();
  },

  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await db().auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw new Error(error.message);
  },

  async hasSession(): Promise<boolean> {
    if (!supabase) return false;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return Boolean(session);
  },

  async updatePassword(password: string): Promise<void> {
    const { error } = await db().auth.updateUser({ password });
    if (error) throw new Error(error.message);
  },

  async getCurrentSession(): Promise<{ user: { id: string; email: string } | null; team: Team | null }> {
    if (!supabase) return { user: null, team: null };
    const client = supabase;
    const load = async () => {
      const {
        data: { session },
      } = await client.auth.getSession();
      if (!session?.user) return { user: null, team: null };
      const user = { id: session.user.id, email: session.user.email || '' };
      const { data: teamData } = await client
        .from('teams')
        .select('*, team_members(*)')
        .eq('owner_user_id', user.id)
        .maybeSingle();
      return { user, team: teamData ? mapTeamRow(teamData) : null };
    };
    const timeout = new Promise<{ user: null; team: null }>(resolve =>
      setTimeout(() => resolve({ user: null, team: null }), 8000)
    );
    try {
      return await Promise.race([load(), timeout]);
    } catch (err) {
      console.warn('Supabase session fetch failed:', err);
      return { user: null, team: null };
    }
  },

  // ==========================================
  // SELECTION & ATOMIC LOCKING
  // ==========================================
  async getTeamSelection(teamId: string): Promise<TeamSelection | null> {
    const { data, error } = await db().from('team_selections').select('*').eq('team_id', teamId).maybeSingle();
    if (error || !data) return null;
    return {
      id: data.id,
      teamId: data.team_id,
      trackId: data.track_id,
      problemStatementId: data.problem_statement_id,
      lockedAt: data.locked_at,
    };
  },

  async lockTeamSelection(teamId: string, trackId: string, problemStatementId: string): Promise<TeamSelection> {
    const prob = HACKATHON_CONFIG.problemStatements.find(p => p.id === problemStatementId);
    if (!prob || prob.trackId !== trackId) {
      throw new Error(`Problem statement does not belong to track ${trackId}`);
    }

    const { data, error } = await db().rpc('lock_team_selection', {
      p_team_id: teamId,
      p_track_id: trackId,
      p_problem_statement_id: problemStatementId,
    });
    if (error || !data) throw new Error(error?.message || 'Failed to lock your choice.');

    return {
      id: data.selection_id,
      teamId: data.team_id,
      trackId: data.track_id,
      problemStatementId: data.problem_statement_id,
      lockedAt: data.locked_at,
    };
  },

  // ==========================================
  // SUBMISSIONS
  // ==========================================
  async getTeamSubmission(teamId: string): Promise<Submission | null> {
    const { data, error } = await db().from('submissions').select('*').eq('team_id', teamId).maybeSingle();
    if (error || !data) return null;
    return {
      id: data.id,
      teamId: data.team_id,
      githubRepoUrl: data.github_repo_url,
      deployedUrl: data.deployed_url || '',
      submittedAt: data.submitted_at,
      spreadsheetSyncStatus: data.spreadsheet_sync_status,
      syncError: data.sync_error,
    };
  },

  async submitSolution(
    teamId: string,
    githubRepoUrl: string,
    deployedUrl: string,
    onProgress?: (percent: number) => void
  ): Promise<Submission> {
    const cleanGithub = githubRepoUrl.trim();
    const cleanDeployed = deployedUrl.trim();

    if (!/^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/?$/i.test(cleanGithub)) {
      throw new Error('Please provide a valid HTTPS GitHub repository URL.');
    }
    try {
      const parsed = new URL(cleanDeployed);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error();
    } catch {
      throw new Error('Please enter a valid deployed website URL (e.g. https://your-project.vercel.app).');
    }

    const client = db();
    onProgress?.(25);

    const { data: sub, error: subError } = await client.rpc('submit_solution', {
      p_github_url: cleanGithub,
      p_deployed_url: cleanDeployed,
    });
    if (subError || !sub) throw new Error(subError?.message || 'Failed to record submission.');

    onProgress?.(75);

    let syncStatus: Submission['spreadsheetSyncStatus'] = 'pending';
    let syncError: string | undefined;
    try {
      const { data: edgeData, error: edgeError } = await client.functions.invoke('sync-sheets', {
        body: { submissionId: sub.id, teamId, deployedUrl: cleanDeployed },
      });
      if (edgeError) {
        syncStatus = 'failed';
        syncError = edgeError.message;
      } else if (edgeData?.status) {
        syncStatus = edgeData.status;
      }
    } catch (e: any) {
      syncStatus = 'not_configured';
      syncError = e?.message;
    }

    onProgress?.(100);

    return {
      id: sub.id,
      teamId: sub.team_id,
      githubRepoUrl: sub.github_repo_url,
      deployedUrl: sub.deployed_url,
      submittedAt: sub.submitted_at,
      spreadsheetSyncStatus: syncStatus,
      syncError,
    };
  },

  // ==========================================
  // ADMIN: SECURITY DEFINER functions that each check is_admin()
  // ==========================================
  async adminSession(): Promise<{ signedIn: boolean; isAdmin: boolean; email: string }> {
    if (!supabase) return { signedIn: false, isAdmin: false, email: '' };
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return { signedIn: false, isAdmin: false, email: '' };
    const { data, error } = await supabase.rpc('is_admin');
    return { signedIn: true, isAdmin: !error && data === true, email: session.user.email || '' };
  },

  async adminSignIn(email: string, password: string): Promise<void> {
    const client = db();
    const { data, error } = await client.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error || !data.user) throw new Error(error?.message || 'Invalid admin credentials.');
    const session = await this.adminSession();
    if (!session.isAdmin) {
      await client.auth.signOut();
      throw new Error('This account does not have admin access.');
    }
  },

  async adminGetOverview(): Promise<{ stats: AdminStats; teams: AdminTeamRow[] }> {
    const client = db();
    const [statsRes, listRes] = await Promise.all([client.rpc('admin_stats'), client.rpc('admin_list_teams')]);
    if (statsRes.error) throw new Error(statsRes.error.message);
    if (listRes.error) throw new Error(listRes.error.message);
    const st = statsRes.data || {};
    return {
      stats: {
        teams: st.teams ?? 0,
        participants: st.participants ?? 0,
        locked: st.locked ?? 0,
        submitted: st.submitted ?? 0,
        sizeDistribution: st.size_distribution ?? {},
        byTrack: st.by_track ?? {},
        registrationsByDay: st.registrations_by_day ?? {},
      },
      teams: ((listRes.data as any[]) || []).map(r => ({
        id: r.id,
        teamName: r.team_name,
        leaderName: r.leader_name || '',
        leaderRegNo: r.leader_reg_no || '',
        leaderEmail: r.leader_email,
        members: mapMembers(r.members),
        teamSize: r.team_size,
        trackId: r.track_id ?? null,
        problemId: r.problem_id ?? null,
        lockedAt: r.locked_at ?? null,
        submission: r.submission
          ? {
              githubRepoUrl: r.submission.github_repo_url,
              deployedUrl: r.submission.deployed_url,
              submittedAt: r.submission.submitted_at,
            }
          : null,
        createdAt: r.created_at,
        status: statusOf(Boolean(r.track_id), Boolean(r.submission)),
      })),
    };
  },

  async adminUpdateTeam(teamId: string, input: AdminTeamInput): Promise<void> {
    const name = input.teamName.trim();
    const members = cleanMembers(input.members);
    if (name.length < 3 || name.length > 60) throw new Error('Team name must be 3 to 60 characters.');
    if (!input.leaderName.trim() || !input.leaderRegNo.trim() || !input.leaderEmail.trim()) {
      throw new Error('Leader name, registration number and email are required.');
    }
    const rosterIssue = rosterError(members);
    if (rosterIssue) throw new Error(rosterIssue);

    const { error } = await db().rpc('admin_update_team', {
      p_team_id: teamId,
      p_team_name: name,
      p_leader_name: input.leaderName.trim(),
      p_leader_reg_no: input.leaderRegNo.trim(),
      p_leader_email: input.leaderEmail.trim(),
      p_members: toRpcMembers(members),
    });
    if (error) throw new Error(error.message);
  },

  async adminDeleteTeam(teamId: string): Promise<void> {
    const { error } = await db().rpc('admin_delete_team', { p_team_id: teamId });
    if (error) throw new Error(error.message);
  },

  async adminResetSelection(teamId: string): Promise<void> {
    const { error } = await db().rpc('admin_reset_selection', { p_team_id: teamId });
    if (error) throw new Error(error.message);
  },

  async adminResetSubmission(teamId: string): Promise<void> {
    const { error } = await db().rpc('admin_reset_submission', { p_team_id: teamId });
    if (error) throw new Error(error.message);
  },
};
