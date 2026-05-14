import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createLeague } from '$lib/server/leagues';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const name = String(data.get('name') ?? '').trim();
    const slug = String(data.get('slug') ?? '').trim();

    try {
      const league = createLeague({ name, slug: slug || undefined });
      throw redirect(303, `/admin/leagues/${league.slug}`);
    } catch (e: any) {
      if (e && typeof e === 'object' && 'status' in e && 'location' in e) throw e;
      return fail(400, { name, slug, error: e?.message ?? 'Failed to create league.' });
    }
  }
};
