import { describe, expect, it } from 'vitest';
import { buildStandings } from './standings';

const players = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Carol' },
  { id: 4, name: 'Dave' }
];

describe('buildStandings', () => {
  it('returns zeros for all players when no matches recorded', () => {
    const out = buildStandings(players, []);
    expect(out).toHaveLength(4);
    for (const row of out) {
      expect(row.played).toBe(0);
      expect(row.wins).toBe(0);
      expect(row.draws).toBe(0);
      expect(row.losses).toBe(0);
      expect(row.points).toBe(0);
    }
  });

  it('ignores open matches', () => {
    const out = buildStandings(players, [
      { playerAId: 1, playerBId: 2, result: null },
      { playerAId: 1, playerBId: 2, result: 'a' }
    ]);
    const alice = out.find((r) => r.playerId === 1)!;
    expect(alice.played).toBe(1);
    expect(alice.wins).toBe(1);
  });

  it('awards 1 for win, 0.5 for draw, 0 for loss', () => {
    const out = buildStandings(players, [
      { playerAId: 1, playerBId: 2, result: 'a' },
      { playerAId: 1, playerBId: 3, result: 'draw' },
      { playerAId: 2, playerBId: 3, result: 'b' },
      { playerAId: 3, playerBId: 4, result: 'b' }
    ]);

    const byName = Object.fromEntries(out.map((r) => [r.playerName, r]));
    expect(byName.Alice.points).toBe(1.5);
    expect(byName.Alice.wins).toBe(1);
    expect(byName.Alice.draws).toBe(1);
    expect(byName.Alice.losses).toBe(0);

    expect(byName.Bob.points).toBe(0);
    expect(byName.Bob.wins).toBe(0);
    expect(byName.Bob.draws).toBe(0);
    expect(byName.Bob.losses).toBe(2);

    expect(byName.Carol.points).toBe(1.5);
    expect(byName.Carol.wins).toBe(1);
    expect(byName.Carol.draws).toBe(1);
    expect(byName.Carol.losses).toBe(1);

    expect(byName.Dave.points).toBe(1);
    expect(byName.Dave.wins).toBe(1);
    expect(byName.Dave.draws).toBe(0);
    expect(byName.Dave.losses).toBe(0);
  });

  it('sorts by points desc, then wins desc, then name asc', () => {
    const out = buildStandings(players, [
      { playerAId: 1, playerBId: 2, result: 'a' },
      { playerAId: 1, playerBId: 3, result: 'draw' },
      { playerAId: 2, playerBId: 3, result: 'b' },
      { playerAId: 3, playerBId: 4, result: 'b' }
    ]);
    expect(out.map((r) => r.playerName)).toEqual(['Alice', 'Carol', 'Dave', 'Bob']);
  });
});
