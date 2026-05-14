import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import {
  clearSchedule,
  deleteLeague,
  generateSchedule,
  getLeagueBySlug,
  setLeagueStatus
} from '$lib/server/leagues';
import { addPlayer, listPlayers, removePlayer } from '$lib/server/players';
import {
  clearMatchResult,
  countMatches,
  listMatches,
  listRecentResults,
  recordMatchResult
} from '$lib/server/matches';
import { computeStandings } from '$lib/server/standings';
import { isValidLeagueStatus, isValidResult } from '$lib/server/scoring';

export const load: PageServerLoad = async ({ params }) => {
  const league = getLeagueBySlug(params.slug);
  if (!league) throw error(404, 'League not found');

  const players = listPlayers(league.id);
  const matches = listMatches(league.id);
  const stats = countMatches(league.id);
  const standings = computeStandings(league.id);
  const recent = listRecentResults(league.id, 10);

  return { league, players, matches, stats, standings, recent };
};

function requireLeague(slug: string) {
  const league = getLeagueBySlug(slug);
  if (!league) throw error(404, 'League not found');
  return league;
}

export const actions: Actions = {
  addPlayer: async ({ request, params }) => {
    const league = requireLeague(params.slug);
    if (league.status !== 'draft') {
      return fail(400, { error: 'Players can only be added while the league is in draft.' });
    }
    const data = await request.formData();
    const name = String(data.get('name') ?? '');
    try {
      addPlayer(league.id, name);
    } catch (e: any) {
      return fail(400, { error: e?.message ?? 'Failed to add player.' });
    }
    return { success: true };
  },

  removePlayer: async ({ request, params }) => {
    const league = requireLeague(params.slug);
    if (league.status !== 'draft') {
      return fail(400, { error: 'Players can only be removed while the league is in draft.' });
    }
    const data = await request.formData();
    const playerId = Number(data.get('playerId'));
    if (!Number.isFinite(playerId)) return fail(400, { error: 'Invalid player.' });
    removePlayer(league.id, playerId);
    return { success: true };
  },

  startLeague: async ({ params }) => {
    const league = requireLeague(params.slug);
    if (league.status !== 'draft') {
      return fail(400, { error: 'League has already started.' });
    }
    try {
      generateSchedule(league.id);
      setLeagueStatus(league.id, 'active');
    } catch (e: any) {
      return fail(400, { error: e?.message ?? 'Failed to start league.' });
    }
    return { success: true };
  },

  reopen: async ({ params }) => {
    const league = requireLeague(params.slug);
    if (league.status !== 'finished') {
      return fail(400, { error: 'Only finished leagues can be reopened.' });
    }
    setLeagueStatus(league.id, 'active');
    return { success: true };
  },

  finish: async ({ params }) => {
    const league = requireLeague(params.slug);
    if (league.status !== 'active') {
      return fail(400, { error: 'Only active leagues can be finished.' });
    }
    setLeagueStatus(league.id, 'finished');
    return { success: true };
  },

  resetSchedule: async ({ params }) => {
    const league = requireLeague(params.slug);
    clearSchedule(league.id);
    setLeagueStatus(league.id, 'draft');
    return { success: true };
  },

  setStatus: async ({ request, params }) => {
    const league = requireLeague(params.slug);
    const data = await request.formData();
    const status = String(data.get('status') ?? '');
    if (!isValidLeagueStatus(status)) return fail(400, { error: 'Invalid status.' });
    setLeagueStatus(league.id, status);
    return { success: true };
  },

  recordResult: async ({ request, params }) => {
    const league = requireLeague(params.slug);
    if (league.status === 'draft') {
      return fail(400, { error: 'Generate the schedule before recording results.' });
    }
    const data = await request.formData();
    const matchId = Number(data.get('matchId'));
    const result = String(data.get('result') ?? '');
    if (!Number.isFinite(matchId)) return fail(400, { error: 'Invalid match.' });
    if (!isValidResult(result)) return fail(400, { error: 'Invalid result.' });
    try {
      recordMatchResult(league.id, matchId, result);
    } catch (e: any) {
      return fail(400, { error: e?.message ?? 'Failed to record result.' });
    }
    return { success: true };
  },

  clearResult: async ({ request, params }) => {
    const league = requireLeague(params.slug);
    const data = await request.formData();
    const matchId = Number(data.get('matchId'));
    if (!Number.isFinite(matchId)) return fail(400, { error: 'Invalid match.' });
    clearMatchResult(league.id, matchId);
    return { success: true };
  },

  delete: async ({ params }) => {
    const league = requireLeague(params.slug);
    deleteLeague(league.id);
    throw redirect(303, '/admin');
  }
};
