export const POINTS_WIN = 1;
export const POINTS_DRAW = 0.5;
export const POINTS_LOSS = 0;

export type MatchResult = 'a' | 'b' | 'draw';

export type LeagueStatus = 'draft' | 'active' | 'finished';

export function isValidLeagueStatus(s: string): s is LeagueStatus {
  return s === 'draft' || s === 'active' || s === 'finished';
}

export function isValidResult(s: string): s is MatchResult {
  return s === 'a' || s === 'b' || s === 'draw';
}
