import type { APIRoute } from 'astro';
import { env, resolvePasswordHash, PASSWORD_KEY, EMAIL_KEY, normaliseEmail } from '~/lib/admin-guard';
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

  /**
   * Fail CLOSED. If we cannot establish whether a password already exists, we
   * must assume it does — the alternative is letting a database hiccup reopen
   * an unauthenticated endpoint that sets the admin password.
   */
  let existing: string | null;
  try {
    existing = await resolvePasswordHash(DB, ADMIN_PASSWORD_HASH);
  } catch {
    return fail('nodb');
  }
  if (existing) return fail('taken');

  const form = await context.request.formData();
  const email = normaliseEmail(String(form.get('email') ?? ''));
  const password = String(form.get('password') ?? '');
  const confirm = String(form.get('confirm') ?? '');

  if (!email || !email.includes('@') || email.length > 200) return fail('email');
  if (password.length < MIN_LENGTH) return fail('short');
  if (password !== confirm) return fail('mismatch');

  await setSetting(DB, EMAIL_KEY, email);
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
