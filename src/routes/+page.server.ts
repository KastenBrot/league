import type { PageServerLoad } from './$types';
import { listPublicLeagues } from '$lib/server/leagues';

export const load: PageServerLoad = async ({ locals }) => {
  return {
    user: locals.user,
    leagues: listPublicLeagues()
  };
};
