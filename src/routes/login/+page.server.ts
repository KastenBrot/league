import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import {
  getSessionCookieName,
  getUserForLogin,
  signSession,
  touchLastLogin,
  verifyPassword
} from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) throw redirect(303, '/admin');
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = String(data.get('username') ?? '').trim();
    const password = String(data.get('password') ?? '');

    const u = getUserForLogin(username);
    if (!u) return fail(400, { username, error: 'Invalid username or password.' });

    const ok = await verifyPassword(password, u.passwordHash);
    if (!ok) return fail(400, { username, error: 'Invalid username or password.' });

    touchLastLogin(u.id);
    cookies.set(getSessionCookieName(), signSession({ uid: u.id }), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 60 * 60 * 24 * 30
    });

    throw redirect(303, '/admin');
  }
};
