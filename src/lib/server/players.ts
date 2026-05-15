import { isSpearheadFactionId } from '$lib/factions';
import { sqlite } from '$lib/server/db';

export type Player = {
  id: number;
  leagueId: number;
  name: string;
  factionId: string;
  createdAt: number;
};

export function listPlayers(leagueId: number): Player[] {
  return sqlite
    .prepare(
      'select id, league_id as leagueId, name, faction_id as factionId, created_at as createdAt from players where league_id = ? order by name asc'
    )
    .all(leagueId) as Player[];
}

function validatePlayerFields(name: string, factionId: string): string {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Player name is required.');
  if (trimmed.length > 80) throw new Error('Player name is too long (max 80 chars).');
  if (!isSpearheadFactionId(factionId)) throw new Error('Choose a valid Spearhead faction.');
  return trimmed;
}

export function addPlayer(leagueId: number, name: string, factionId: string): Player {
  const trimmed = validatePlayerFields(name, factionId);

  try {
    const info = sqlite
      .prepare('insert into players (league_id, name, faction_id) values (?, ?, ?)')
      .run(leagueId, trimmed, factionId);
    return sqlite
      .prepare(
        'select id, league_id as leagueId, name, faction_id as factionId, created_at as createdAt from players where id = ?'
      )
      .get(Number(info.lastInsertRowid)) as Player;
  } catch (e: any) {
    if (String(e?.message ?? '').includes('UNIQUE')) {
      throw new Error('A player with that name already exists in this league.', { cause: e });
    }
    throw e;
  }
}

export function updatePlayer(
  leagueId: number,
  playerId: number,
  name: string,
  factionId: string
): Player {
  const trimmed = validatePlayerFields(name, factionId);

  try {
    const info = sqlite
      .prepare('update players set name = ?, faction_id = ? where id = ? and league_id = ?')
      .run(trimmed, factionId, playerId, leagueId);
    if (info.changes === 0) throw new Error('Player not found.');
    return sqlite
      .prepare(
        'select id, league_id as leagueId, name, faction_id as factionId, created_at as createdAt from players where id = ?'
      )
      .get(playerId) as Player;
  } catch (e: any) {
    if (String(e?.message ?? '').includes('UNIQUE')) {
      throw new Error('A player with that name already exists in this league.', { cause: e });
    }
    throw e;
  }
}

export function removePlayer(leagueId: number, playerId: number): void {
  const info = sqlite
    .prepare('delete from players where id = ? and league_id = ?')
    .run(playerId, leagueId);
  if (info.changes === 0) throw new Error('Player not found.');
}

export function playerHasRecordedResults(leagueId: number, playerId: number): boolean {
  const row = sqlite
    .prepare(
      `select 1 from matches
        where league_id = ?
          and result is not null
          and (player_a_id = ? or player_b_id = ?)
        limit 1`
    )
    .get(leagueId, playerId, playerId);
  return row != null;
}

export function countPlayers(leagueId: number): number {
  const row = sqlite
    .prepare('select count(1) as c from players where league_id = ?')
    .get(leagueId) as { c: number };
  return row.c;
}
