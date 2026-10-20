export interface Track {
  id: string;
  name: string;
  themeKey: 'agni' | 'vajra' | 'vayu' | 'vanam' | 'surya';
  accentColor: string;
  secondaryColor: string;
  glowColor: string;
  description: string;
  motto: string;
  iconName: string;
  displayOrder: number;
}

export interface ProblemStatement {
  id: string;
  trackId: string;
  problemCode: string; // e.g. AGNI-01
  title: string;
  summary: string;
  fullDescription: string;
  keyRequirements: string[];
  suggestedTech: string[];
  difficulty: 'Novice' | 'Challenger' | 'Grandmaster';
  displayOrder: number;
}

export interface Team {
  id: string;
  ownerUserId: string;
  teamName: string;
  leaderEmail: string;
  createdAt: string;
}

export interface TeamSelection {
  id: string;
  teamId: string;
  trackId: string;
  problemStatementId: string;
  lockedAt: string;
}

export interface Submission {
  id: string;
  teamId: string;
  githubRepoUrl: string;
  pptFileName: string;
  pptStoragePath: string;
  pptSizeBytes: number;
  pptMimeType: string;
  submittedAt: string;
  spreadsheetSyncStatus: 'synced' | 'pending' | 'failed' | 'not_configured';
  syncError?: string;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
  } | null;
  team: Team | null;
  selection: TeamSelection | null;
  submission: Submission | null;
  isLoading: boolean;
}
