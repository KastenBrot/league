import type { RequestHandler } from './$types';
import { getSessionCookieName } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
  cookies.delete(getSessionCookieName(), { path: '/' });
  throw redirect(303, '/login');
};
