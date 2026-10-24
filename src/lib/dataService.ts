import { supabase, isSupabaseConfigured } from './supabase';
import { Team, TeamSelection, Submission, TeamMember } from '../types';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';

const LOCAL_TEAMS_KEY = 'chakravyuh_local_teams';
const LOCAL_USERS_KEY = 'chakravyuh_local_users';
const LOCAL_SELECTIONS_KEY = 'chakravyuh_local_selections';
const LOCAL_SUBMISSIONS_KEY = 'chakravyuh_local_submissions';
const LOCAL_ACTIVE_SESSION_KEY = 'chakravyuh_local_active_session';
const LOCAL_SPREADSHEET_LOG_KEY = 'chakravyuh_spreadsheet_queue';

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
    const members = extra?.members || [];

    if (trimmedTeamName.length < 3) {
      throw new Error('Team name must be at least 3 characters long.');
    }
    if (trimmedTeamName.length > 60) {
      throw new Error('Team name cannot exceed 60 characters.');
    }

    // 1. SUPABASE LIVE MODE
    if (isSupabaseConfigured && supabase) {
      const { data: existingTeam } = await supabase
        .from('teams')
        .select('id')
        .ilike('team_name', trimmedTeamName)
        .maybeSingle();

      if (existingTeam) {
        throw new Error(`The team name "${trimmedTeamName}" is already registered. Please choose another.`);
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: password,
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Failed to register team leader account.');
      }

      const userId = authData.user.id;

      const { data: newTeam, error: teamInsertError } = await supabase
        .from('teams')
        .insert({
          owner_user_id: userId,
          team_name: trimmedTeamName,
          leader_email: trimmedEmail,
        })
        .select()
        .single();

      if (teamInsertError || !newTeam) {
        throw new Error(teamInsertError?.message || 'Failed to create team record in database.');
      }

      const team: Team = {
        id: newTeam.id,
        ownerUserId: newTeam.owner_user_id,
        teamName: newTeam.team_name,
        leaderName,
        leaderEmail: newTeam.leader_email,
        leaderPhone,
        members,
        createdAt: newTeam.created_at,
      };

      // Record to spreadsheet queue
      logToSpreadsheetQueue({
        registrationId: team.id,
        timestamp: team.createdAt,
        teamName: team.teamName,
        leaderName,
        leaderEmail: team.leaderEmail,
        leaderPhone,
        teamMembers: members.map(m => m.name).join(', ') || 'N/A',
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
        password: password,
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Invalid credentials or user not found.');
      }

      const userId = authData.user.id;

      const { data: teamData, error: teamErr } = await supabase
        .from('teams')
        .select('*')
        .eq('owner_user_id', userId)
        .single();

      if (teamErr || !teamData) {
        throw new Error('Authenticated, but no team profile is associated with this account.');
      }

      const team: Team = {
        id: teamData.id,
        ownerUserId: teamData.owner_user_id,
        teamName: teamData.team_name,
        leaderEmail: teamData.leader_email,
        createdAt: teamData.created_at,
      };

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
  },

  async getCurrentSession(): Promise<{ user: { id: string; email: string } | null; team: Team | null }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const client = supabase;
        const fetchSupabaseSession = async () => {
          if (!client) return { user: null, team: null };
          const { data: { session }, error: sessionError } = await client.auth.getSession();
          if (sessionError || !session || !session.user) {
            return { user: null, team: null };
          }

          const userId = session.user.id;
          const { data: teamData } = await client
            .from('teams')
            .select('*')
            .eq('owner_user_id', userId)
            .maybeSingle();

          if (!teamData) {
            return { user: { id: userId, email: session.user.email || '' }, team: null };
          }

          return {
            user: { id: userId, email: session.user.email || '' },
            team: {
              id: teamData.id,
              ownerUserId: teamData.owner_user_id,
              teamName: teamData.team_name,
              leaderEmail: teamData.leader_email,
              createdAt: teamData.created_at,
            },
          };
        };

        const timeoutPromise = new Promise<{ user: null; team: null }>((resolve) =>
          setTimeout(() => resolve({ user: null, team: null }), 3500)
        );

        const result = await Promise.race([fetchSupabaseSession(), timeoutPromise]);
        if (result.user) return result;
      } catch (err) {
        console.warn('Supabase session fetch failed, falling back to local storage:', err);
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
        deployedUrl: data.deployed_url || data.ppt_storage_path || '',
        pptFileName: data.ppt_file_name,
        pptStoragePath: data.ppt_storage_path,
        pptSizeBytes: data.ppt_size_bytes,
        pptMimeType: data.ppt_mime_type,
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

      const { data: newSub, error: subError } = await supabase
        .from('submissions')
        .insert({
          team_id: teamId,
          github_repo_url: cleanGithub,
          ppt_file_name: cleanDeployed,
          ppt_storage_path: cleanDeployed,
          ppt_size_bytes: 0,
          ppt_mime_type: 'text/uri-list',
          spreadsheet_sync_status: 'pending',
        })
        .select()
        .single();

      if (subError || !newSub) {
        throw new Error(`Failed to record submission: ${subError?.message || 'Database error'}`);
      }

      if (onProgress) onProgress(75);

      let syncStatus: 'synced' | 'pending' | 'failed' | 'not_configured' = 'pending';
      let syncError: string | undefined;

      try {
        const { data: edgeData, error: edgeError } = await supabase.functions.invoke('sync-sheets', {
          body: { submissionId: newSub.id, teamId, deployedUrl: cleanDeployed },
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
        id: newSub.id,
        teamId: newSub.team_id,
        githubRepoUrl: newSub.github_repo_url,
        deployedUrl: cleanDeployed,
        pptFileName: cleanDeployed,
        pptStoragePath: cleanDeployed,
        pptSizeBytes: 0,
        pptMimeType: 'text/uri-list',
        submittedAt: newSub.submitted_at,
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
