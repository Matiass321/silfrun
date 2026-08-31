import type { APIRoute } from 'astro';
import { requireAdmin, env } from '~/lib/admin-guard';
import { setLaunchState } from '~/lib/launch';

export const prerender = false;

/**
 * Opens or closes the site.
 *
 * Two steps in the UI, one POST here. Opening is not destructive, but it is
 * the moment the whole site becomes visible to the public and to search
 * engines, so it is worth a deliberate second tap rather than a switch that
 * can be brushed.
 */
export const POST: APIRoute = async (context) => {
  const gate = await requireAdmin(context);
  if (gate) return gate;

  const { DB } = env(context) as { DB?: D1Database };
  if (!DB) return new Response('No database binding.', { status: 503 });

  const form = await context.request.formData();
  const open = String(form.get('state')) === 'open';

  await setLaunchState(DB, open);

  return context.redirect('/admin/settings/?launched=' + (open ? '1' : '0'), 303);
};
