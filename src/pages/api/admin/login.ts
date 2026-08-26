import type { APIRoute } from 'astro';
import { env, resolvePasswordHash, resolveAdminEmail, normaliseEmail } from '~/lib/admin-guard';
import {
  verifyPassword, createSession, sessionCookie,
  checkThrottle, clearThrottle,
} from '~/lib/auth';

export const prerender = false;

/**
 * Login.
 *
 * Redirects rather than returning JSON: the form is a plain HTML form, and the
 * site ships no JavaScript to handle a fetch response. The error is passed as
 * a short code in the query string and never echoes what was typed.
 */
export const POST: APIRoute = async (context) => {
  const { DB, ADMIN_EMAIL, ADMIN_PASSWORD_HASH, ADMIN_SESSION_SECRET } = env(context);

  const fail = (code: string) =>
    context.redirect(`/admin/login/?e=${code}`, 303);

  if (!ADMIN_SESSION_SECRET) {
    return new Response('Admin is not configured. Set ADMIN_SESSION_SECRET.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const form = await context.request.formData();
  const email = normaliseEmail(String(form.get('email') ?? ''));
  const password = String(form.get('password') ?? '');
  if (!password) return fail('missing');

  /**
   * Throttle before verifying, keyed on IP.
   *
   * PBKDF2 here is capped at 100k iterations by the platform, which is below
   * what OWASP asks for, so this limiter is doing real work rather than being
   * belt-and-braces.
   */
  const ip =
    context.request.headers.get('CF-Connecting-IP') ??
    context.request.headers.get('x-forwarded-for') ??
    'unknown';

  if (DB) {
    const { allowed } = await checkThrottle(DB, `login:${ip}`);
    if (!allowed) return fail('rate');
  }

  const hash = await resolvePasswordHash(DB, ADMIN_PASSWORD_HASH);
  if (!hash) return context.redirect('/admin/setup/', 303);

  /**
   * Address and password are checked together and reported as one failure.
   *
   * Saying which half was wrong would confirm to a stranger that a given
   * address is the one that owns this admin, and the throttle above counts
   * both against the same budget either way.
   *
   * The password is still verified even when the address is already wrong, so
   * a bad address does not return measurably faster than a bad password.
   */
  const expectedEmail = await resolveAdminEmail(DB, ADMIN_EMAIL);
  const passwordOk = await verifyPassword(password, hash);
  const emailOk = expectedEmail === null || normaliseEmail(expectedEmail) === email;

  if (!passwordOk || !emailOk) return fail('bad');

  if (DB) await clearThrottle(DB, `login:${ip}`);

  const token = await createSession(ADMIN_SESSION_SECRET);

  return new Response(null, {
    status: 303,
    headers: {
      Location: '/admin/',
      'Set-Cookie': sessionCookie(token),
      'Cache-Control': 'no-store',
    },
  });
};
