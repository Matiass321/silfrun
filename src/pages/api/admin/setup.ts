import type { APIRoute } from 'astro';
import { env, resolvePasswordHash, PASSWORD_KEY } from '~/lib/admin-guard';
import { hashPassword, setSetting, createSession, sessionCookie } from '~/lib/auth';

export const prerender = false;

const MIN_LENGTH = 12;

/**
 * First-run password.
 *
 * Refuses once a password exists. Without that check this is an
 * unauthenticated endpoint that overwrites the admin password, which would
 * hand away the entire security model — so the guard is re-checked here and
 * not only on the page that renders the form.
 */
export const POST: APIRoute = async (context) => {
  const { DB, ADMIN_PASSWORD_HASH, ADMIN_SESSION_SECRET } = env(context);

  const fail = (code: string) => context.redirect(`/admin/setup/?e=${code}`, 303);

  if (!DB) return fail('nodb');

  const existing = await resolvePasswordHash(DB, ADMIN_PASSWORD_HASH);
  if (existing) return fail('taken');

  const form = await context.request.formData();
  const password = String(form.get('password') ?? '');
  const confirm = String(form.get('confirm') ?? '');

  if (password.length < MIN_LENGTH) return fail('short');
  if (password !== confirm) return fail('mismatch');

  await setSetting(DB, PASSWORD_KEY, await hashPassword(password));

  /* Sign them straight in — they have just proved who they are. */
  if (ADMIN_SESSION_SECRET) {
    const token = await createSession(ADMIN_SESSION_SECRET);
    return new Response(null, {
      status: 303,
      headers: {
        Location: '/admin/',
        'Set-Cookie': sessionCookie(token),
        'Cache-Control': 'no-store',
      },
    });
  }

  return context.redirect('/admin/login/', 303);
};
