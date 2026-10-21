import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Team, TeamSelection, Submission, TeamMember } from '../types';
import { dataService } from '../lib/dataService';

interface AuthContextType {
  user: { id: string; email: string } | null;
  team: Team | null;
  selection: TeamSelection | null;
  submission: Submission | null;
  isLoading: boolean;
  isConfigured: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (
    email: string,
    pass: string,
    teamName: string,
    extra?: {
      leaderName?: string;
      leaderPhone?: string;
      members?: TeamMember[];
    }
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshState: () => Promise<void>;
  lockSelection: (trackId: string, problemStatementId: string) => Promise<TeamSelection>;
  submitSolution: (githubUrl: string, deployedUrl: string, onProgress?: (p: number) => void) => Promise<Submission>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [selection, setSelection] = useState<TeamSelection | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isConfigured = dataService.isConfigured();

  const loadUserData = useCallback(async (currentTeam: Team | null) => {
    if (!currentTeam) {
      setSelection(null);
      setSubmission(null);
      return;
    }

    try {
      const [sel, sub] = await Promise.all([
        dataService.getTeamSelection(currentTeam.id),
        dataService.getTeamSubmission(currentTeam.id),
      ]);
      setSelection(sel);
      setSubmission(sub);
    } catch (err) {
      console.error('Error fetching team stage metadata:', err);
    }
  }, []);

  const refreshState = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await dataService.getCurrentSession();
      setUser(session.user);
      setTeam(session.team);
      if (session.team) {
        await loadUserData(session.team);
      } else {
        setSelection(null);
        setSubmission(null);
      }
    } catch (err) {
      console.error('Error restoring session:', err);
    } finally {
      setIsLoading(false);
    }
  }, [loadUserData]);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const result = await dataService.signIn(email, pass);
      setUser(result.user);
      setTeam(result.team);
      await loadUserData(result.team);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    pass: string,
    teamName: string,
    extra?: {
      leaderName?: string;
      leaderPhone?: string;
      members?: TeamMember[];
    }
  ) => {
    setIsLoading(true);
    try {
      const result = await dataService.signUpAndRegisterTeam(email, pass, teamName, extra);
      setUser(result.user);
      setTeam(result.team);
      setSelection(null);
      setSubmission(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await dataService.signOut();
      setUser(null);
      setTeam(null);
      setSelection(null);
      setSubmission(null);
    } finally {
      setIsLoading(false);
    }
  };

  const lockSelection = async (trackId: string, problemStatementId: string): Promise<TeamSelection> => {
    if (!team) throw new Error('No authenticated team found.');
    const locked = await dataService.lockTeamSelection(team.id, trackId, problemStatementId);
    setSelection(locked);
    return locked;
  };

  const submitSolution = async (githubUrl: string, deployedUrl: string, onProgress?: (p: number) => void): Promise<Submission> => {
    if (!team) throw new Error('No authenticated team found.');
    if (!selection) throw new Error('Cannot submit before locking a problem statement.');
    const sub = await dataService.submitSolution(team.id, githubUrl, deployedUrl, onProgress);
    setSubmission(sub);
    return sub;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        team,
        selection,
        submission,
        isLoading,
        isConfigured,
        signIn,
        signUp,
        signOut,
        refreshState,
        lockSelection,
        submitSolution,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
