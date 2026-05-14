import type { Handle } from '@sveltejs/kit';
import { countUsers, getSessionCookieName, getUserById, verifySession } from '$lib/server/auth';

const ADMIN_PATH_PREFIX = '/admin';

export const handle: Handle = async ({ event, resolve }) => {
  const userCount = countUsers();
  const pathname = event.url.pathname;

  if (userCount === 0) {
    if (!pathname.startsWith('/setup')) {
      return new Response(null, { status: 303, headers: { location: '/setup' } });
    }
    return resolve(event);
  }

  const session = event.cookies.get(getSessionCookieName());
  if (session) {
    const payload = verifySession(session);
    const userId = payload?.uid;
    if (typeof userId === 'number') {
      const u = getUserById(userId);
      if (u) event.locals.user = { id: u.id, username: u.username };
    }
  }

  if (pathname.startsWith('/setup')) {
    return new Response('Not Found', { status: 404 });
  }

  const needsAuth = pathname === ADMIN_PATH_PREFIX || pathname.startsWith(`${ADMIN_PATH_PREFIX}/`);
  if (needsAuth && !event.locals.user) {
    return new Response(null, { status: 303, headers: { location: '/login' } });
  }

  return resolve(event);
};
