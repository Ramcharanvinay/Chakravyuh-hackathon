import { supabase, isSupabaseConfigured } from './supabase';
import { Team, TeamSelection, Submission } from '../types';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';

const LOCAL_TEAMS_KEY = 'chakravyuh_local_teams';
const LOCAL_USERS_KEY = 'chakravyuh_local_users';
const LOCAL_SELECTIONS_KEY = 'chakravyuh_local_selections';
const LOCAL_SUBMISSIONS_KEY = 'chakravyuh_local_submissions';
const LOCAL_ACTIVE_SESSION_KEY = 'chakravyuh_local_active_session';

// --- Local Storage Helpers for Sandbox Mode ---
interface LocalUserRecord {
  id: string;
  email: string;
  passwordHash: string;
  teamId: string;
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

export const dataService = {
  isConfigured(): boolean {
    return isSupabaseConfigured;
  },

  // ==========================================
  // AUTH & TEAM REGISTRATION
  // ==========================================
  async signUpAndRegisterTeam(email: string, password: string, teamName: string): Promise<{ team: Team; user: { id: string; email: string } }> {
    const trimmedTeamName = teamName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedTeamName.length < 3) {
      throw new Error('Team name must be at least 3 characters long.');
    }
    if (trimmedTeamName.length > 60) {
      throw new Error('Team name cannot exceed 60 characters.');
    }

    // 1. SUPABASE LIVE MODE
    if (isSupabaseConfigured && supabase) {
      // Check duplicate team name in Supabase
      const { data: existingTeam, error: checkErr } = await supabase
        .from('teams')
        .select('id')
        .ilike('team_name', trimmedTeamName)
        .maybeSingle();

      if (checkErr) {
        console.warn('Team check warning:', checkErr);
      }
      if (existingTeam) {
        throw new Error(`The team name "${trimmedTeamName}" is already registered. Please choose another.`);
      }

      // Create Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: password,
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Failed to register team leader account.');
      }

      const userId = authData.user.id;

      // Insert team record
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
        leaderEmail: newTeam.leader_email,
        createdAt: newTeam.created_at,
      };

      return { team, user: { id: userId, email: trimmedEmail } };
    }

    // 2. SANDBOX / DEMO MODE
    const existingTeams = getLocalTeams();
    const duplicate = existingTeams.find(
      t => t.teamName.toLowerCase() === trimmedTeamName.toLowerCase()
    );
    if (duplicate) {
      throw new Error(`The team name "${trimmedTeamName}" is already registered in this arena. Choose a distinct name.`);
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
      leaderEmail: trimmedEmail,
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
    const users = getLocalUsers();
    const user = users.find(u => u.email === trimmedEmail);
    if (!user || user.passwordHash !== btoa(password)) {
      throw new Error('Invalid email or password. Please verify your credentials.');
    }

    const teams = getLocalTeams();
    const team = teams.find(t => t.id === user.teamId);
    if (!team) {
      throw new Error('Team record not found for this user account.');
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
    // 1. SUPABASE LIVE MODE
    if (isSupabaseConfigured && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        return { user: null, team: null };
      }

      const userId = session.user.id;
      const { data: teamData } = await supabase
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
    }

    // 2. SANDBOX / DEMO MODE
    const sessionStr = localStorage.getItem(LOCAL_ACTIVE_SESSION_KEY);
    if (!sessionStr) {
      return { user: null, team: null };
    }

    try {
      const parsed = JSON.parse(sessionStr);
      const teams = getLocalTeams();
      const team = teams.find(t => t.id === parsed.teamId) || null;
      return {
        user: { id: parsed.userId, email: parsed.email },
        team,
      };
    } catch {
      return { user: null, team: null };
    }
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
    // Validate problem belongs to track
    const prob = HACKATHON_CONFIG.problemStatements.find(p => p.id === problemStatementId);
    if (!prob || prob.trackId !== trackId) {
      throw new Error(`Problem statement does not belong to track ${trackId}`);
    }

    // 1. SUPABASE LIVE MODE
    if (isSupabaseConfigured && supabase) {
      // Call atomic RPC function
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
    return newSelection;
  },

  // ==========================================
  // SUBMISSIONS & POWERPOINT UPLOAD
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
    return submissions.find(s => s.teamId === teamId) || null;
  },

  async uploadPptAndSubmit(
    teamId: string,
    githubRepoUrl: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<Submission> {
    // 1. Validation
    const cleanGithub = githubRepoUrl.trim();
    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+\/?$/;
    if (!githubRegex.test(cleanGithub)) {
      throw new Error('Please enter a valid HTTPS GitHub repository URL (e.g. https://github.com/team/chakravyuh-solution).');
    }

    const validExtensions = ['.ppt', '.pptx'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      throw new Error('Invalid file type. Only PowerPoint presentations (.ppt, .pptx) are accepted.');
    }

    if (file.size > HACKATHON_CONFIG.maxPptSizeBytes) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      throw new Error(`File size (${sizeMb} MB) exceeds maximum allowed limit of 25 MB.`);
    }

    // 2. SUPABASE LIVE MODE
    if (isSupabaseConfigured && supabase) {
      // Simulate/trigger progress
      if (onProgress) onProgress(20);

      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storagePath = `team_${teamId}/${timestamp}_${sanitizedName}`;

      if (onProgress) onProgress(45);

      // Upload to private Supabase Storage bucket 'hackathon-ppts'
      const { error: uploadError } = await supabase.storage
        .from('hackathon-ppts')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Failed to upload PowerPoint to storage: ${uploadError.message}`);
      }

      if (onProgress) onProgress(80);

      // Save submission record in Supabase PostgreSQL
      const { data: newSub, error: subError } = await supabase
        .from('submissions')
        .insert({
          team_id: teamId,
          github_repo_url: cleanGithub,
          ppt_file_name: file.name,
          ppt_storage_path: storagePath,
          ppt_size_bytes: file.size,
          ppt_mime_type: file.type || 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          spreadsheet_sync_status: 'pending',
        })
        .select()
        .single();

      if (subError || !newSub) {
        throw new Error(`Failed to record submission: ${subError?.message || 'Database error'}`);
      }

      if (onProgress) onProgress(95);

      // Trigger Google Sheets sync edge function
      let syncStatus: 'synced' | 'pending' | 'failed' | 'not_configured' = 'pending';
      let syncError: string | undefined;

      try {
        const { data: edgeData, error: edgeError } = await supabase.functions.invoke('sync-sheets', {
          body: { submissionId: newSub.id, teamId },
        });

        if (edgeError) {
          syncStatus = 'failed';
          syncError = edgeError.message;
        } else if (edgeData?.status) {
          syncStatus = edgeData.status;
        }
      } catch (e: any) {
        syncStatus = 'not_configured';
        syncError = e.message;
      }

      if (onProgress) onProgress(100);

      return {
        id: newSub.id,
        teamId: newSub.team_id,
        githubRepoUrl: newSub.github_repo_url,
        pptFileName: newSub.ppt_file_name,
        pptStoragePath: newSub.ppt_storage_path,
        pptSizeBytes: newSub.ppt_size_bytes,
        pptMimeType: newSub.ppt_mime_type,
        submittedAt: newSub.submitted_at,
        spreadsheetSyncStatus: syncStatus,
        syncError,
      };
    }

    // 3. SANDBOX / DEMO MODE
    // Simulate upload progress
    if (onProgress) {
      onProgress(30);
      await new Promise(r => setTimeout(r, 200));
      onProgress(70);
      await new Promise(r => setTimeout(r, 250));
      onProgress(100);
    }

    const existing = getLocalSubmissions();
    const alreadySubmitted = existing.find(s => s.teamId === teamId);
    if (alreadySubmitted) {
      throw new Error('Your team has already finalized its submission.');
    }

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `hackathon-ppts/team_${teamId}/${timestamp}_${sanitizedName}`;

    const submission: Submission = {
      id: 'sub_' + Math.random().toString(36).substring(2, 9),
      teamId,
      githubRepoUrl: cleanGithub,
      pptFileName: file.name,
      pptStoragePath: storagePath,
      pptSizeBytes: file.size,
      pptMimeType: file.type || 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      submittedAt: new Date().toISOString(),
      spreadsheetSyncStatus: 'not_configured',
      syncError: 'Google Sheets synchronization requires deployed Supabase Edge Function & configured credentials.',
    };

    localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify([...existing, submission]));
    return submission;
  },
};
