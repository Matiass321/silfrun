import type { APIRoute } from 'astro';
import { requireAdmin, env } from '~/lib/admin-guard';
import { markSent, dismiss } from '~/lib/reminders';

export const prerender = false;

/** Marks a reminder sent or dismissed, then returns to the dashboard. */
export const POST: APIRoute = async (context) => {
  const gate = await requireAdmin(context);
  if (gate) return gate;

  const { DB } = env(context);
  if (!DB) return new Response('No database binding.', { status: 503 });

  const form = await context.request.formData();
  const id = Number(form.get('id'));
  const action = String(form.get('action') ?? '');

  if (Number.isFinite(id)) {
    if (action === 'sent') await markSent(DB, id);
    else if (action === 'dismiss') await dismiss(DB, id);
  }

  return context.redirect('/admin/', 303);
};
