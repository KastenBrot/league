import { describe, expect, it } from 'vitest';
import { playersOnFire, trailingWinStreak, type StreakMatch } from './streaks';

function m(
  id: number,
  playerAId: number,
  playerBId: number,
  result: 'a' | 'b' | 'draw',
  recordedAt: number
): StreakMatch {
  return { id, playerAId, playerBId, result, recordedAt };
}

describe('trailingWinStreak', () => {
  it('returns 0 with no completed matches', () => {
    expect(trailingWinStreak(1, [])).toBe(0);
  });

  it('counts consecutive wins at the end of history', () => {
    const matches = [
      m(1, 1, 2, 'a', 100),
      m(2, 1, 3, 'b', 200),
      m(3, 1, 4, 'a', 300),
      m(4, 1, 5, 'a', 400)
    ];
    expect(trailingWinStreak(1, matches)).toBe(2);
  });

  it('stops at a loss', () => {
    const matches = [
      m(1, 1, 2, 'a', 100),
      m(2, 1, 3, 'a', 200),
      m(3, 1, 4, 'b', 300),
      m(4, 1, 5, 'a', 400)
    ];
    expect(trailingWinStreak(1, matches)).toBe(1);
  });

  it('stops at a draw', () => {
    const matches = [
      m(1, 1, 2, 'a', 100),
      m(2, 1, 3, 'a', 200),
      m(3, 1, 4, 'draw', 300),
      m(4, 1, 5, 'a', 400)
    ];
    expect(trailingWinStreak(1, matches)).toBe(1);
  });
});

describe('playersOnFire', () => {
  it('returns players with at least two trailing wins', () => {
    const matches = [
      m(1, 1, 2, 'a', 100),
      m(2, 1, 3, 'a', 200),
      m(3, 4, 5, 'a', 300),
      m(4, 4, 6, 'b', 400)
    ];
    expect(playersOnFire([1, 4], matches)).toEqual([1]);
  });
});
