export interface Track {
  id: string;
  name: string;
  officialTitle: string;
  slug: string;
  themeKey: 'agni' | 'vajra' | 'vayu' | 'vanam' | 'surya' | string;
  accentColor: string;
  secondaryColor: string;
  glowColor: string;
  description: string;
  motto: string;
  iconName: string;
  displayOrder: number;
}

export interface ProblemDataset {
  name: string;
  url?: string;
  notes?: string;
}

export interface ProblemStatement {
  id: string;
  trackId: string;
  problemCode: string; // e.g. CB-01, ST-01, QC-01, FT-01, ES-01
  title: string;
  summary: string;
  fullDescription: string;
  objective?: string;
  expectedOutcomes: string[];
  keyRequirements: string[];
  suggestedTech: string[];
  datasets?: ProblemDataset[];
  difficulty: 'Easy' | 'Hard' | 'Flagship' | 'Novice' | 'Challenger' | 'Grandmaster';
  displayOrder: number;
}

export interface TeamMember {
  name: string;
  email?: string;
  role?: string;
}

export interface Team {
  id: string;
  ownerUserId: string;
  teamName: string;
  leaderName?: string;
  leaderEmail: string;
  leaderPhone?: string;
  members?: TeamMember[];
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
  githubUrl?: string;
  deployedUrl: string;
  pptFileName?: string;
  pptStoragePath?: string;
  pptSizeBytes?: number;
  pptMimeType?: string;
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
