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
