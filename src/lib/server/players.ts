import { sqlite } from '$lib/server/db';

export type Player = {
  id: number;
  leagueId: number;
  name: string;
  createdAt: number;
};

export function listPlayers(leagueId: number): Player[] {
  return sqlite
    .prepare(
      'select id, league_id as leagueId, name, created_at as createdAt from players where league_id = ? order by name asc'
    )
    .all(leagueId) as Player[];
}

export function addPlayer(leagueId: number, name: string): Player {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Player name is required.');
  if (trimmed.length > 80) throw new Error('Player name is too long (max 80 chars).');

  try {
    const info = sqlite
      .prepare('insert into players (league_id, name) values (?, ?)')
      .run(leagueId, trimmed);
    return sqlite
      .prepare(
        'select id, league_id as leagueId, name, created_at as createdAt from players where id = ?'
      )
      .get(Number(info.lastInsertRowid)) as Player;
  } catch (e: any) {
    if (String(e?.message ?? '').includes('UNIQUE')) {
      throw new Error('A player with that name already exists in this league.', { cause: e });
    }
    throw e;
  }
}

export function removePlayer(leagueId: number, playerId: number): void {
  sqlite.prepare('delete from players where id = ? and league_id = ?').run(playerId, leagueId);
}

export function countPlayers(leagueId: number): number {
  const row = sqlite
    .prepare('select count(1) as c from players where league_id = ?')
    .get(leagueId) as { c: number };
  return row.c;
}
