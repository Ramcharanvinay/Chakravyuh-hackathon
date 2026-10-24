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

const LOCAL_TEAMS_KEY = 'chakravyuh_local_teams';
const LOCAL_USERS_KEY = 'chakravyuh_local_users';
const LOCAL_SELECTIONS_KEY = 'chakravyuh_local_selections';
const LOCAL_SUBMISSIONS_KEY = 'chakravyuh_local_submissions';
const LOCAL_ACTIVE_SESSION_KEY = 'chakravyuh_local_active_session';
const LOCAL_SPREADSHEET_LOG_KEY = 'chakravyuh_spreadsheet_queue';
const LOCAL_ADMIN_KEY = 'chakravyuh_local_admin';

// Sandbox-only admin login (used when Supabase is not configured). Live mode uses real accounts.
export const DEMO_ADMIN = { email: 'admin@chakravyuh.local', password: 'admin2026' };

/** Thrown when Supabase requires email confirmation before the squad can be created. */
export class RegistrationPendingError extends Error {
  constructor() {
    super(
      'Registration received. Confirm your email using the link we just sent, then sign in here to finish setting up your squad.'
    );
    this.name = 'RegistrationPendingError';
  }
}

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
  const { data, error } = await supabase!.rpc('register_team', {
    p_team_name: p.teamName,
    p_leader_name: p.leaderName,
    p_leader_reg_no: p.leaderRegNo,
    p_members: toRpcMembers(p.members),
  });
  if (error || !data) throw new Error(error?.message || 'Failed to register team.');
  return mapTeamRow(data);
}

interface LocalUserRecord {
  id: string;
  email: string;
  passwordHash: string;
  teamId: string;
}

export interface SpreadsheetRow {
  registrationId: string;
  timestamp: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  teamMembers: string;
  themeId: string;
  themeTitle: string;
  problemCode: string;
  problemTitle: string;
  status: string;
}

function getLocalUsers(): LocalUserRecord[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function getLocalTeams(): Team[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_TEAMS_KEY) || '[]');
  } catch {
    return [];
  }
}

function getLocalSelections(): TeamSelection[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SELECTIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

function getLocalSubmissions(): Submission[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SUBMISSIONS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getSpreadsheetQueue(): SpreadsheetRow[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SPREADSHEET_LOG_KEY) || '[]');
  } catch {
    return [];
  }
}

export function logToSpreadsheetQueue(row: SpreadsheetRow) {
  try {
    const queue = getSpreadsheetQueue();
    // Idempotent by registrationId / teamName
    const filtered = queue.filter(r => r.registrationId !== row.registrationId);
    filtered.push(row);
    localStorage.setItem(LOCAL_SPREADSHEET_LOG_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to log to local spreadsheet queue:', e);
  }
}

export const dataService = {
  isConfigured(): boolean {
    return isSupabaseConfigured;
  },

  // ==========================================
  // AUTH & EXTENDED TEAM REGISTRATION
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
    const leaderName = extra?.leaderName || 'Team Leader';
    const leaderPhone = extra?.leaderPhone || '';
    const members = cleanMembers(extra?.members);

    if (trimmedTeamName.length < 3) {
      throw new Error('Team name must be at least 3 characters long.');
    }
    if (trimmedTeamName.length > 60) {
      throw new Error('Team name cannot exceed 60 characters.');
    }

    const rosterIssue = rosterError(members);
    if (rosterIssue) throw new Error(rosterIssue);

    // 1. SUPABASE LIVE MODE
    if (isSupabaseConfigured && supabase) {
      // The roster rides along in the account metadata so registration can finish after
      // email confirmation (if the project requires it).
      const pending = {
        team_name: trimmedTeamName,
        leader_name: leaderName,
        leader_reg_no: leaderPhone,
        members,
      };

      const signUp = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: { data: { pending_registration: pending } },
      });

      let userId = signUp.data.user?.id ?? null;
      let hasSession = Boolean(signUp.data.session);
      const alreadyExists =
        (signUp.error && /already (registered|exists)/i.test(signUp.error.message)) ||
        (signUp.data.user && signUp.data.user.identities?.length === 0);

      if (alreadyExists) {
        // Account exists (e.g. an admin removed the team): the owner can finish by signing in.
        const retry = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
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
      void supabase.auth.updateUser({ data: { pending_registration: null } }).then(
        () => undefined,
        () => undefined
      );

      logToSpreadsheetQueue({
        registrationId: team.id,
        timestamp: team.createdAt,
        teamName: team.teamName,
        leaderName,
        leaderEmail: team.leaderEmail,
        leaderPhone,
        teamMembers: members.map(m => m.name).join(', '),
        themeId: 'pending',
        themeTitle: 'Not Selected',
        problemCode: 'pending',
        problemTitle: 'Not Selected',
        status: 'Registered',
      });

      return { team, user: { id: userId, email: trimmedEmail } };
    }

    // 2. SANDBOX / DEMO MODE
    const existingTeams = getLocalTeams();
    const duplicate = existingTeams.find(
      t => t.teamName.toLowerCase() === trimmedTeamName.toLowerCase()
    );
    if (duplicate) {
      throw new Error(`The team name "${trimmedTeamName}" is already registered. Choose a distinct name.`);
    }

    const existingUsers = getLocalUsers();
    if (existingUsers.some(u => u.email === trimmedEmail)) {
      throw new Error(`An account with email "${trimmedEmail}" already exists. Please sign in instead.`);
    }

    const userId = 'usr_' + Math.random().toString(36).substring(2, 9);
    const teamId = 'team_' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();

    const team: Team = {
      id: teamId,
      ownerUserId: userId,
      teamName: trimmedTeamName,
      leaderName,
      leaderEmail: trimmedEmail,
      leaderPhone,
      members,
      createdAt: now,
    };

    const userRecord: LocalUserRecord = {
      id: userId,
      email: trimmedEmail,
      passwordHash: btoa(password),
      teamId: teamId,
    };

    localStorage.setItem(LOCAL_TEAMS_KEY, JSON.stringify([...existingTeams, team]));
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify([...existingUsers, userRecord]));
    localStorage.setItem(LOCAL_ACTIVE_SESSION_KEY, JSON.stringify({ userId, teamId, email: trimmedEmail }));

    // Record initial registration in spreadsheet queue
    logToSpreadsheetQueue({
      registrationId: team.id,
      timestamp: team.createdAt,
      teamName: team.teamName,
      leaderName,
      leaderEmail: team.leaderEmail,
      leaderPhone,
      teamMembers: members.map(m => m.name).join(', ') || 'Solo',
      themeId: 'pending',
      themeTitle: 'Pending Selection',
      problemCode: 'pending',
      problemTitle: 'Pending Selection',
      status: 'Registered',
    });

    return { team, user: { id: userId, email: trimmedEmail } };
  },

  async signIn(email: string, password: string): Promise<{ team: Team; user: { id: string; email: string } }> {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. SUPABASE LIVE MODE
    if (isSupabaseConfigured && supabase) {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Invalid credentials or user not found.');
      }

      const userId = authData.user.id;
      const { data: teamData } = await supabase
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
            void supabase.auth.updateUser({ data: { pending_registration: null } }).then(
              () => undefined,
              () => undefined
            );
          } catch (err) {
            await supabase.auth.signOut();
            throw err;
          }
        }
      }

      if (!team) {
        await supabase.auth.signOut();
        throw new Error('No squad is registered for this account yet. Use "Register Squad" to create one.');
      }

      return { team, user: { id: userId, email: trimmedEmail } };
    }

    // 2. SANDBOX / DEMO MODE
    let users = getLocalUsers();
    let teams = getLocalTeams();

    // Auto-provision demo squad if testing with demo credentials
    if (
      (trimmedEmail === 'leader@apexpredators.io' || trimmedEmail === '23bce1099' || trimmedEmail === 'apex predators') &&
      password === 'squad2026'
    ) {
      let demoTeam = teams.find(t => t.teamName.toLowerCase() === 'apex predators');
      if (!demoTeam) {
        const demoUserId = 'usr_apex_demo';
        const demoTeamId = 'team_apex_demo';
        demoTeam = {
          id: demoTeamId,
          ownerUserId: demoUserId,
          teamName: 'Apex Predators',
          leaderName: 'Arjun Sharma',
          leaderEmail: 'leader@apexpredators.io',
          leaderPhone: '23BCE1099',
          members: [
            { name: 'Arjun Sharma', email: 'arjun@vitap.ac.in', role: 'Team Lead' },
            { name: 'Priya Verma', email: 'priya@vitap.ac.in', role: 'Systems Engineer' },
            { name: 'Rohan Iyer', email: 'rohan@vitap.ac.in', role: 'Fullstack Dev' },
          ],
          createdAt: new Date().toISOString(),
        };
        const demoUser: LocalUserRecord = {
          id: demoUserId,
          email: 'leader@apexpredators.io',
          passwordHash: btoa('squad2026'),
          teamId: demoTeamId,
        };
        teams.push(demoTeam);
        users.push(demoUser);
        localStorage.setItem(LOCAL_TEAMS_KEY, JSON.stringify(teams));
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
      }
    }

    // Match by email, team name, or leader registration ID
    let user = users.find(u => u.email === trimmedEmail);
    if (!user) {
      const matchingTeam = teams.find(
        t =>
          (t.leaderPhone && t.leaderPhone.toLowerCase() === trimmedEmail) ||
          t.teamName.toLowerCase() === trimmedEmail
      );
      if (matchingTeam) {
        user = users.find(u => u.teamId === matchingTeam.id);
      }
    }

    if (!user || user.passwordHash !== btoa(password)) {
      throw new Error('Invalid squad email/registration ID or passcode. Please verify your credentials.');
    }

    const team = teams.find(t => t.id === user.teamId);
    if (!team) {
      throw new Error('Squad profile record not found for this account.');
    }

    localStorage.setItem(LOCAL_ACTIVE_SESSION_KEY, JSON.stringify({ userId: user.id, teamId: team.id, email: user.email }));
    return { team, user: { id: user.id, email: user.email } };
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_ACTIVE_SESSION_KEY);
    localStorage.removeItem(LOCAL_ADMIN_KEY);
  },

  async getCurrentSession(): Promise<{ user: { id: string; email: string } | null; team: Team | null }> {
    if (isSupabaseConfigured && supabase) {
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
        setTimeout(() => resolve({ user: null, team: null }), 6000)
      );
      try {
        return await Promise.race([load(), timeout]);
      } catch (err) {
        console.warn('Supabase session fetch failed:', err);
        return { user: null, team: null };
      }
    }

    const sessionStr = localStorage.getItem(LOCAL_ACTIVE_SESSION_KEY);
    if (!sessionStr) {
      return { user: null, team: null };
    }

    try {
      const parsed = JSON.parse(sessionStr);
      const team = getLocalTeams().find(t => t.id === parsed.teamId) || null;
      if (team) return { user: { id: parsed.userId, email: parsed.email }, team };
    } catch {
      // fall through to a clean signed-out state
    }
    localStorage.removeItem(LOCAL_ACTIVE_SESSION_KEY);
    return { user: null, team: null };
  },

  // ==========================================
  // SELECTION & ATOMIC LOCKING
  // ==========================================
  async getTeamSelection(teamId: string): Promise<TeamSelection | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('team_selections')
        .select('*')
        .eq('team_id', teamId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        teamId: data.team_id,
        trackId: data.track_id,
        problemStatementId: data.problem_statement_id,
        lockedAt: data.locked_at,
      };
    }

    const selections = getLocalSelections();
    return selections.find(s => s.teamId === teamId) || null;
  },

  async lockTeamSelection(teamId: string, trackId: string, problemStatementId: string): Promise<TeamSelection> {
    const prob = HACKATHON_CONFIG.problemStatements.find(p => p.id === problemStatementId);
    if (!prob || prob.trackId !== trackId) {
      throw new Error(`Problem statement does not belong to track ${trackId}`);
    }

    const track = HACKATHON_CONFIG.tracks.find(t => t.id === trackId);

    // 1. SUPABASE LIVE MODE
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.rpc('lock_team_selection', {
        p_team_id: teamId,
        p_track_id: trackId,
        p_problem_statement_id: problemStatementId,
      });

      if (error) {
        throw new Error(error.message || 'Failed to lock choice in Supabase database.');
      }

      return {
        id: data.selection_id,
        teamId: data.team_id,
        trackId: data.track_id,
        problemStatementId: data.problem_statement_id,
        lockedAt: data.locked_at,
      };
    }

    // 2. SANDBOX / DEMO MODE
    const existing = getLocalSelections();
    const alreadyLocked = existing.find(s => s.teamId === teamId);
    if (alreadyLocked) {
      throw new Error('Selection is already locked and cannot be changed.');
    }

    const newSelection: TeamSelection = {
      id: 'sel_' + Math.random().toString(36).substring(2, 9),
      teamId,
      trackId,
      problemStatementId,
      lockedAt: new Date().toISOString(),
    };

    localStorage.setItem(LOCAL_SELECTIONS_KEY, JSON.stringify([...existing, newSelection]));

    // Update spreadsheet queue record
    const teams = getLocalTeams();
    const team = teams.find(t => t.id === teamId);
    if (team) {
      logToSpreadsheetQueue({
        registrationId: team.id,
        timestamp: newSelection.lockedAt,
        teamName: team.teamName,
        leaderName: team.leaderName || 'Leader',
        leaderEmail: team.leaderEmail,
        leaderPhone: team.leaderPhone || '',
        teamMembers: team.members?.map(m => m.name).join(', ') || 'N/A',
        themeId: track?.slug || trackId,
        themeTitle: track?.officialTitle || track?.name || trackId,
        problemCode: prob.problemCode,
        problemTitle: prob.title,
        status: 'Problem Locked',
      });
    }

    return newSelection;
  },

  // ==========================================
  // SUBMISSIONS & DEPLOYED LINK
  // ==========================================
  async getTeamSubmission(teamId: string): Promise<Submission | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('team_id', teamId)
        .maybeSingle();

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
    }

    const submissions = getLocalSubmissions();
    const sub = submissions.find(s => s.teamId === teamId);
    if (!sub) return null;
    return {
      ...sub,
      deployedUrl: sub.deployedUrl || sub.pptStoragePath || '',
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

    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+\/?$/;
    if (!githubRegex.test(cleanGithub)) {
      throw new Error('Please enter a valid HTTPS GitHub repository URL (e.g. https://github.com/team/chakravyuh-solution).');
    }

    try {
      const parsed = new URL(cleanDeployed);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error('Deployed website link must use HTTP or HTTPS protocol.');
      }
    } catch {
      throw new Error('Please enter a valid deployed website URL (e.g. https://your-project.vercel.app).');
    }

    // 1. SUPABASE LIVE MODE
    if (isSupabaseConfigured && supabase) {
      if (onProgress) onProgress(25);

      const { data: sub, error: subError } = await supabase.rpc('submit_solution', {
        p_github_url: cleanGithub,
        p_deployed_url: cleanDeployed,
      });
      if (subError || !sub) {
        throw new Error(subError?.message || 'Failed to record submission.');
      }

      if (onProgress) onProgress(75);

      let syncStatus: 'synced' | 'pending' | 'failed' | 'not_configured' = 'pending';
      let syncError: string | undefined;

      try {
        const { data: edgeData, error: edgeError } = await supabase.functions.invoke('sync-sheets', {
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

      if (onProgress) onProgress(100);

      return {
        id: sub.id,
        teamId: sub.team_id,
        githubRepoUrl: sub.github_repo_url,
        deployedUrl: sub.deployed_url,
        submittedAt: sub.submitted_at,
        spreadsheetSyncStatus: syncStatus,
        syncError,
      };
    }

    // 2. SANDBOX / DEMO MODE
    if (onProgress) {
      onProgress(35);
      await new Promise(r => setTimeout(r, 120));
      onProgress(75);
      await new Promise(r => setTimeout(r, 120));
      onProgress(100);
    }

    const existing = getLocalSubmissions();
    const alreadySubmitted = existing.find(s => s.teamId === teamId);
    if (alreadySubmitted) {
      throw new Error('Your team has already finalized its submission.');
    }

    const submission: Submission = {
      id: 'sub_' + Math.random().toString(36).substring(2, 9),
      teamId,
      githubRepoUrl: cleanGithub,
      deployedUrl: cleanDeployed,
      pptFileName: cleanDeployed,
      pptStoragePath: cleanDeployed,
      pptSizeBytes: 0,
      pptMimeType: 'text/uri-list',
      submittedAt: new Date().toISOString(),
      spreadsheetSyncStatus: 'synced' as const,
    };

    localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify([...existing, submission]));

    // Update spreadsheet row status
    const teams = getLocalTeams();
    const team = teams.find(t => t.id === teamId);
    const selections = getLocalSelections();
    const sel = selections.find(s => s.teamId === teamId);
    const prob = HACKATHON_CONFIG.problemStatements.find(p => p.id === sel?.problemStatementId);
    const track = HACKATHON_CONFIG.tracks.find(t => t.id === sel?.trackId);

    if (team) {
      logToSpreadsheetQueue({
        registrationId: team.id,
        timestamp: submission.submittedAt,
        teamName: team.teamName,
        leaderName: team.leaderName || 'Leader',
        leaderEmail: team.leaderEmail,
        leaderPhone: team.leaderPhone || '',
        teamMembers: team.members?.map(m => m.name).join(', ') || 'N/A',
        themeId: track?.slug || sel?.trackId || 'N/A',
        themeTitle: track?.officialTitle || track?.name || 'N/A',
        problemCode: prob?.problemCode || 'N/A',
        problemTitle: prob?.title || 'N/A',
        status: `Solution Submitted (Live: ${cleanDeployed})`,
      });
    }

    return submission;
  },

  // ==========================================
  // ADMIN: live mode calls SECURITY DEFINER functions that check is_admin();
  // sandbox mode works on the local demo data.
  // ==========================================
  async adminSession(): Promise<{ signedIn: boolean; isAdmin: boolean; email: string }> {
    if (isSupabaseConfigured && supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return { signedIn: false, isAdmin: false, email: '' };
      const { data, error } = await supabase.rpc('is_admin');
      return { signedIn: true, isAdmin: !error && data === true, email: session.user.email || '' };
    }
    const isAdmin = localStorage.getItem(LOCAL_ADMIN_KEY) === '1';
    return { signedIn: isAdmin, isAdmin, email: isAdmin ? DEMO_ADMIN.email : '' };
  },

  async adminSignIn(email: string, password: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error || !data.user) throw new Error(error?.message || 'Invalid admin credentials.');
      const session = await this.adminSession();
      if (!session.isAdmin) {
        await supabase.auth.signOut();
        throw new Error('This account does not have admin access.');
      }
      return;
    }
    if (email.trim().toLowerCase() === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      localStorage.setItem(LOCAL_ADMIN_KEY, '1');
      return;
    }
    throw new Error('Invalid admin credentials.');
  },

  async adminGetOverview(): Promise<{ stats: AdminStats; teams: AdminTeamRow[] }> {
    if (isSupabaseConfigured && supabase) {
      const [statsRes, listRes] = await Promise.all([supabase.rpc('admin_stats'), supabase.rpc('admin_list_teams')]);
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
    }

    if (localStorage.getItem(LOCAL_ADMIN_KEY) !== '1') throw new Error('Forbidden: admin only.');
    const selections = getLocalSelections();
    const submissions = getLocalSubmissions();
    const teams: AdminTeamRow[] = getLocalTeams()
      .map(t => {
        const sel = selections.find(x => x.teamId === t.id);
        const sub = submissions.find(x => x.teamId === t.id);
        return {
          id: t.id,
          teamName: t.teamName,
          leaderName: t.leaderName || '',
          leaderRegNo: t.leaderPhone || '',
          leaderEmail: t.leaderEmail,
          members: t.members || [],
          teamSize: 1 + (t.members?.length || 0),
          trackId: sel?.trackId ?? null,
          problemId: sel?.problemStatementId ?? null,
          lockedAt: sel?.lockedAt ?? null,
          submission: sub
            ? { githubRepoUrl: sub.githubRepoUrl, deployedUrl: sub.deployedUrl, submittedAt: sub.submittedAt }
            : null,
          createdAt: t.createdAt,
          status: statusOf(Boolean(sel), Boolean(sub)),
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const count = (keys: (string | null)[]) =>
      keys.reduce<Record<string, number>>((acc, k) => {
        if (k) acc[k] = (acc[k] || 0) + 1;
        return acc;
      }, {});
    const since = Date.now() - 14 * 86400000;
    return {
      teams,
      stats: {
        teams: teams.length,
        participants: teams.reduce((n, t) => n + t.teamSize, 0),
        locked: teams.filter(t => t.trackId).length,
        submitted: teams.filter(t => t.submission).length,
        sizeDistribution: count(teams.map(t => String(t.teamSize))),
        byTrack: count(teams.map(t => t.trackId)),
        registrationsByDay: count(
          teams.filter(t => new Date(t.createdAt).getTime() > since).map(t => t.createdAt.slice(0, 10))
        ),
      },
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

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.rpc('admin_update_team', {
        p_team_id: teamId,
        p_team_name: name,
        p_leader_name: input.leaderName.trim(),
        p_leader_reg_no: input.leaderRegNo.trim(),
        p_leader_email: input.leaderEmail.trim(),
        p_members: toRpcMembers(members),
      });
      if (error) throw new Error(error.message);
      return;
    }

    if (localStorage.getItem(LOCAL_ADMIN_KEY) !== '1') throw new Error('Forbidden: admin only.');
    const teams = getLocalTeams();
    const idx = teams.findIndex(t => t.id === teamId);
    if (idx < 0) throw new Error('Team not found.');
    if (teams.some(t => t.id !== teamId && t.teamName.toLowerCase() === name.toLowerCase())) {
      throw new Error(`The team name "${name}" is already registered.`);
    }
    teams[idx] = {
      ...teams[idx],
      teamName: name,
      leaderName: input.leaderName.trim(),
      leaderPhone: input.leaderRegNo.trim(),
      leaderEmail: input.leaderEmail.trim(),
      members,
    };
    localStorage.setItem(LOCAL_TEAMS_KEY, JSON.stringify(teams));
  },

  async adminDeleteTeam(teamId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.rpc('admin_delete_team', { p_team_id: teamId });
      if (error) throw new Error(error.message);
      return;
    }
    if (localStorage.getItem(LOCAL_ADMIN_KEY) !== '1') throw new Error('Forbidden: admin only.');
    localStorage.setItem(LOCAL_TEAMS_KEY, JSON.stringify(getLocalTeams().filter(t => t.id !== teamId)));
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(getLocalUsers().filter(u => u.teamId !== teamId)));
    localStorage.setItem(LOCAL_SELECTIONS_KEY, JSON.stringify(getLocalSelections().filter(x => x.teamId !== teamId)));
    localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(getLocalSubmissions().filter(x => x.teamId !== teamId)));
  },

  async adminResetSelection(teamId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.rpc('admin_reset_selection', { p_team_id: teamId });
      if (error) throw new Error(error.message);
      return;
    }
    if (localStorage.getItem(LOCAL_ADMIN_KEY) !== '1') throw new Error('Forbidden: admin only.');
    localStorage.setItem(LOCAL_SELECTIONS_KEY, JSON.stringify(getLocalSelections().filter(x => x.teamId !== teamId)));
    localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(getLocalSubmissions().filter(x => x.teamId !== teamId)));
  },

  async adminResetSubmission(teamId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.rpc('admin_reset_submission', { p_team_id: teamId });
      if (error) throw new Error(error.message);
      return;
    }
    if (localStorage.getItem(LOCAL_ADMIN_KEY) !== '1') throw new Error('Forbidden: admin only.');
    localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(getLocalSubmissions().filter(x => x.teamId !== teamId)));
  },

  // Retain for backward compatibility
  async uploadPptAndSubmit(
    teamId: string,
    githubRepoUrl: string,
    fileOrUrl: any,
    onProgress?: (percent: number) => void
  ): Promise<Submission> {
    if (typeof fileOrUrl === 'string') {
      return this.submitSolution(teamId, githubRepoUrl, fileOrUrl, onProgress);
    }
    return this.submitSolution(teamId, githubRepoUrl, 'https://deployed-project-demo.com', onProgress);
  },
};
