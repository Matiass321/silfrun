import type { APIContext } from 'astro';
import { SESSION_COOKIE, verifySession, getSetting } from './auth';

export const PASSWORD_KEY = 'admin_password_hash';
export const SETUP_TOKEN_KEY = 'setup_token_hash';

/**
 * The active password hash.
 *
 * D1 wins over the environment secret, because the browser setup page can
 * write to D1 and a Worker cannot write its own Cloudflare secrets. The env
 * secret remains supported so an install configured from a terminal keeps
 * working.
 */
export async function resolvePasswordHash(
  db: D1Database | undefined,
  envHash: string | undefined
): Promise<string | null> {
  if (db) {
    const stored = await getSetting(db, PASSWORD_KEY);
    if (stored) return stored;
  }
  return envHash ?? null;
}

export interface AdminEnv {
  DB?: D1Database;
  ADMIN_EMAIL?: string;
  ADMIN_PASSWORD_HASH?: string;
  ADMIN_SESSION_SECRET?: string;
}

export function env(context: APIContext | { locals: unknown }): AdminEnv {
  return (
    (context.locals as { runtime?: { env?: AdminEnv } })?.runtime?.env ?? {}
  );
}

/**
 * Gate for every admin route.
 *
 * Returns a Response to send when access is refused, or null when the request
 * may proceed. Fails CLOSED: if the session secret is not configured, nobody
 * gets in. A missing secret must never mean "skip the check" — that is how an
 * admin tool ends up open to the internet after a bad deploy.
 */
export async function requireAdmin(
  context: APIContext
): Promise<Response | null> {
  const { ADMIN_SESSION_SECRET } = env(context);

  if (!ADMIN_SESSION_SECRET) {
    return new Response(
      'Admin is not configured. Set ADMIN_SESSION_SECRET and ADMIN_PASSWORD_HASH.',
      { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }

  const token = context.cookies.get(SESSION_COOKIE)?.value;
  const ok = await verifySession(token, ADMIN_SESSION_SECRET);

  if (!ok) {
    return context.redirect('/admin/login/', 302);
  }

  return null;
}
