import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { RECENT_RESULTS_MAX, RECENT_RESULTS_STEP } from '$lib/constants';
import { getLeagueBySlug } from '$lib/server/leagues';
import { listPlayers } from '$lib/server/players';
import { listMatches, listRecentResults, countMatches } from '$lib/server/matches';
import { computeStandings } from '$lib/server/standings';

export const load: PageServerLoad = async ({ params, url }) => {
  const league = getLeagueBySlug(params.slug);
  if (!league) throw error(404, 'League not found');
  if (league.status === 'draft') throw error(404, 'League not yet started');

  const players = listPlayers(league.id);
  const matches = listMatches(league.id);
  const standings = computeStandings(league.id);
  const recentLimit = Math.min(
    Math.max(Number(url.searchParams.get('recent') || RECENT_RESULTS_STEP), RECENT_RESULTS_STEP),
    RECENT_RESULTS_MAX
  );
  const recent = listRecentResults(league.id, recentLimit);
  const stats = countMatches(league.id);

  type Opponent = { id: number; name: string; factionId: string };
  const openByPlayer = new Map<number, Opponent[]>();
  for (const p of players) openByPlayer.set(p.id, []);
  for (const m of matches) {
    if (m.result !== null) continue;
    openByPlayer.get(m.playerAId)?.push({
      id: m.playerBId,
      name: m.playerBName,
      factionId: m.playerBFactionId
    });
    openByPlayer.get(m.playerBId)?.push({
      id: m.playerAId,
      name: m.playerAName,
      factionId: m.playerAFactionId
    });
  }
  const openMatchesPerPlayer = players
    .map((p) => ({
      playerId: p.id,
      playerName: p.name,
      factionId: p.factionId,
      opponents: (openByPlayer.get(p.id) ?? []).sort((a, b) => a.name.localeCompare(b.name))
    }))
    .sort((a, b) => a.playerName.localeCompare(b.playerName));

  return { league, standings, recent, recentLimit, stats, openMatchesPerPlayer };
};
