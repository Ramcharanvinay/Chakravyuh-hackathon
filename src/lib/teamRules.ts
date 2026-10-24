import { TeamMember } from '../types';

// A squad is the leader plus extra members: 2 to 4 people in total.
export const TEAM_MIN_SIZE = 2;
export const TEAM_MAX_SIZE = 4;
export const MIN_EXTRA_MEMBERS = TEAM_MIN_SIZE - 1;
export const MAX_EXTRA_MEMBERS = TEAM_MAX_SIZE - 1;

export function cleanMembers(members: TeamMember[] | undefined): TeamMember[] {
  return (members || [])
    .map(m => ({
      name: (m.name || '').trim(),
      email: m.email?.trim() || undefined,
      role: m.role?.trim() || 'Member',
    }))
    .filter(m => m.name !== '');
}

/** Returns an error message if the roster (excluding the leader) breaks the 2-4 rule. */
export function rosterError(members: TeamMember[] | undefined): string | null {
  const n = cleanMembers(members).length;
  if (n < MIN_EXTRA_MEMBERS) {
    return `A squad needs ${TEAM_MIN_SIZE} to ${TEAM_MAX_SIZE} people including the leader. Add at least one team member.`;
  }
  if (n > MAX_EXTRA_MEMBERS) {
    return `A squad can have at most ${TEAM_MAX_SIZE} people including the leader.`;
  }
  return null;
}
