export type MatchOutcome = 'win' | 'loss' | 'draw';

export type StreakMatch = {
  id: number;
  playerAId: number;
  playerBId: number;
  result: 'a' | 'b' | 'draw' | null;
  recordedAt: number | null;
};

export const WIN_STREAK_FOR_FIRE = 2;

export function playerMatchOutcome(match: StreakMatch, playerId: number): MatchOutcome | null {
  if (match.result === null) return null;
  if (match.result === 'draw') return 'draw';
  const won =
    (match.result === 'a' && match.playerAId === playerId) ||
    (match.result === 'b' && match.playerBId === playerId);
  return won ? 'win' : 'loss';
}

/** Consecutive wins at the end of the player's completed match history (draws and losses break the streak). */
export function trailingWinStreak(playerId: number, matches: StreakMatch[]): number {
  const completed = matches
    .filter((m) => m.result !== null)
    .filter((m) => m.playerAId === playerId || m.playerBId === playerId)
    .sort((a, b) => (a.recordedAt ?? 0) - (b.recordedAt ?? 0) || a.id - b.id);

  let streak = 0;
  for (let i = completed.length - 1; i >= 0; i--) {
    const outcome = playerMatchOutcome(completed[i], playerId);
    if (outcome === 'win') streak++;
    else break;
  }
  return streak;
}

export function playersOnFire(
  playerIds: number[],
  matches: StreakMatch[],
  minStreak = WIN_STREAK_FOR_FIRE
): number[] {
  return playerIds.filter((id) => trailingWinStreak(id, matches) >= minStreak);
}
