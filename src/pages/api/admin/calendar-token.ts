import type { APIRoute } from 'astro';
import { requireAdmin, env } from '~/lib/admin-guard';

export const prerender = false;

/**
 * Issues or revokes the calendar feed token.
 *
 * Creating a new one does not delete the old: a feed already subscribed in
 * somebody's Google Calendar keeps working until it is explicitly revoked,
 * which is what stops "regenerate" from silently breaking a calendar somebody
 * relies on.
 */
export const POST: APIRoute = async (context) => {
  const gate = await requireAdmin(context);
  if (gate) return gate;

  const { DB } = env(context);
  if (!DB) return new Response('No database binding.', { status: 503 });

  const form = await context.request.formData();
  const action = String(form.get('action') ?? '');

  if (action === 'revoke') {
    const token = String(form.get('token') ?? '');
    if (/^[a-f0-9]{32}$/.test(token)) {
      await DB.prepare('DELETE FROM calendar_tokens WHERE token = ?').bind(token).run();
    }
  } else {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    const token = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
    await DB.prepare('INSERT INTO calendar_tokens (token, label) VALUES (?, ?)')
      .bind(token, String(form.get('label') ?? 'Google Calendar').slice(0, 60))
      .run();
  }

  return context.redirect('/admin/settings/?saved=1', 303);
};
