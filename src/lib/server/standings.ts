import { sqlite } from '$lib/server/db';
import { POINTS_DRAW, POINTS_LOSS, POINTS_WIN, type MatchResult } from '$lib/server/scoring';

export type StandingsRow = {
  playerId: number;
  playerName: string;
  factionId: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
};

export type StandingsMatchInput = {
  playerAId: number;
  playerBId: number;
  result: MatchResult | null;
};

export type StandingsPlayerInput = {
  id: number;
  name: string;
  factionId: string;
};

/**
 * Pure standings calculation, used both directly (with array input) and as the
 * implementation behind the SQL-backed `computeStandings` helper. Sorted desc
 * by points, then wins, then name.
 */
export function buildStandings(
  players: StandingsPlayerInput[],
  matches: StandingsMatchInput[]
): StandingsRow[] {
  const byId = new Map<number, StandingsRow>();
  for (const p of players) {
    byId.set(p.id, {
      playerId: p.id,
      playerName: p.name,
      factionId: p.factionId,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0
    });
  }

  for (const m of matches) {
    if (m.result === null) continue;
    const a = byId.get(m.playerAId);
    const b = byId.get(m.playerBId);
    if (!a || !b) continue;

    a.played += 1;
    b.played += 1;

    if (m.result === 'a') {
      a.wins += 1;
      b.losses += 1;
      a.points += POINTS_WIN;
      b.points += POINTS_LOSS;
    } else if (m.result === 'b') {
      b.wins += 1;
      a.losses += 1;
      b.points += POINTS_WIN;
      a.points += POINTS_LOSS;
    } else {
      a.draws += 1;
      b.draws += 1;
      a.points += POINTS_DRAW;
      b.points += POINTS_DRAW;
    }
  }

  return [...byId.values()].sort((x, y) => {
    if (y.points !== x.points) return y.points - x.points;
    if (y.wins !== x.wins) return y.wins - x.wins;
    return x.playerName.localeCompare(y.playerName);
  });
}

export function computeStandings(leagueId: number): StandingsRow[] {
  const players = sqlite
    .prepare('select id, name, faction_id as factionId from players where league_id = ? order by name asc')
    .all(leagueId) as StandingsPlayerInput[];

  const matches = sqlite
    .prepare(
      'select player_a_id as playerAId, player_b_id as playerBId, result from matches where league_id = ?'
    )
    .all(leagueId) as StandingsMatchInput[];

  return buildStandings(players, matches);
}
