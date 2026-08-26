/**
 * Admin authentication.
 *
 * Deliberately small: one shared staff login, a signed cookie, no user table.
 * The tool is used by the people who run the business, on their own phones,
 * and a full account system would be more surface area than value.
 *
 * The password is never stored anywhere in this repo. It lives as a
 * Cloudflare secret holding a PBKDF2 hash:
 *
 *   npx wrangler pages secret put ADMIN_PASSWORD_HASH --project-name silfrun
 *   npx wrangler pages secret put ADMIN_SESSION_SECRET --project-name silfrun
 *
 * Generate the hash with `node scripts/hash-password.mjs`, which prints it
 * without it ever touching a file.
 */

/**
 * Cloudflare Workers reject PBKDF2 above 100,000 iterations outright:
 *   "Pbkdf2 failed: iteration counts above 100000 are not supported"
 *
 * This is the platform ceiling, not a preference. It is below the 600k OWASP
 * suggests for PBKDF2-SHA256, so the login throttle in D1 (8 attempts per 15
 * minutes per IP) is doing real work here rather than being belt-and-braces.
 */
const ITERATIONS = 100_000;
const KEY_LENGTH = 32;
const SESSION_HOURS = 12;

/** The platform will not verify a hash written above this. */
const MAX_ITERATIONS = 100_000;

export const SESSION_COOKIE = 'sf_admin';

/**
 * PBKDF2-SHA256. Format: pbkdf2$<iterations>$<salt-b64>$<hash-b64>
 *
 * Buffers are explicitly `Uint8Array<ArrayBuffer>` because WebCrypto's
 * `BufferSource` rejects the `ArrayBufferLike` default, which could be a
 * SharedArrayBuffer.
 */
export async function hashPassword(
  password: string,
  saltBytes?: Uint8Array<ArrayBuffer>
): Promise<string> {
  const salt = saltBytes ?? crypto.getRandomValues(new Uint8Array(new ArrayBuffer(16)));
  const key = await crypto.subtle.importKey('raw', encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS },
    key,
    KEY_LENGTH * 8
  );
  return `pbkdf2$${ITERATIONS}$${b64(salt)}$${b64(new Uint8Array(bits))}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;

  const iterations = Number(parts[1]);
  // A hash stored above the platform ceiling can never be verified here, so
  // reject it clearly rather than throwing deep inside WebCrypto.
  if (!Number.isFinite(iterations) || iterations > MAX_ITERATIONS) return false;

  const salt = unb64(parts[2]!);
  const expected = unb64(parts[3]!);

  const key = await crypto.subtle.importKey('raw', encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    key,
    expected.length * 8
  );

  return timingSafeEqual(new Uint8Array(bits), expected);
}

/**
 * Compares in constant time.
 *
 * A plain `===` on the derived bits leaks how many leading bytes matched
 * through response timing, which is enough to reconstruct a hash byte by
 * byte given enough attempts.
 */
function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

/** Signed session token: <expiry>.<hmac>. No data, so nothing to tamper with. */
export async function createSession(secret: string): Promise<string> {
  const expiry = Math.floor(Date.now() / 1000) + SESSION_HOURS * 3600;
  const sig = await sign(String(expiry), secret);
  return `${expiry}.${sig}`;
}

export async function verifySession(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  const [expiryRaw, sig] = token.split('.');
  if (!expiryRaw || !sig) return false;

  const expiry = Number(expiryRaw);
  if (!Number.isFinite(expiry) || expiry < Math.floor(Date.now() / 1000)) return false;

  const expected = await sign(expiryRaw, secret);
  return timingSafeEqual(encode(sig), encode(expected));
}

async function sign(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encode(data));
  return b64(new Uint8Array(sig));
}

export function sessionCookie(token: string): string {
  return [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    `Max-Age=${SESSION_HOURS * 3600}`,
  ].join('; ');
}

export const clearCookie = () =>
  `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

const encode = (s: string): Uint8Array<ArrayBuffer> =>
  new TextEncoder().encode(s) as Uint8Array<ArrayBuffer>;

const b64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));

const unb64 = (s: string): Uint8Array<ArrayBuffer> => {
  const bin = atob(s);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

/**
 * Login throttle, in D1 rather than KV.
 *
 * A rate limiter has to read its own writes. KV is eventually consistent, so
 * attempts fired faster than the reads converge would slip past it, which
 * defeats the point.
 */
export async function checkThrottle(
  db: D1Database,
  key: string,
  limit = 8,
  windowSeconds = 900
): Promise<{ allowed: boolean; retryAfter: number }> {
  const now = Math.floor(Date.now() / 1000);

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS throttle (
         key TEXT PRIMARY KEY, n INTEGER NOT NULL, reset INTEGER NOT NULL)`
    )
    .run();

  const row = await db
    .prepare('SELECT n, reset FROM throttle WHERE key = ?')
    .bind(key)
    .first<{ n: number; reset: number }>();

  if (!row || row.reset < now) {
    await db
      .prepare('INSERT OR REPLACE INTO throttle (key, n, reset) VALUES (?, 1, ?)')
      .bind(key, now + windowSeconds)
      .run();
    return { allowed: true, retryAfter: 0 };
  }

  if (row.n >= limit) {
    return { allowed: false, retryAfter: row.reset - now };
  }

  await db.prepare('UPDATE throttle SET n = n + 1 WHERE key = ?').bind(key).run();
  return { allowed: true, retryAfter: 0 };
}

export async function clearThrottle(db: D1Database, key: string): Promise<void> {
  await db.prepare('DELETE FROM throttle WHERE key = ?').bind(key).run();
}

/* ------------------------------------------------------------------ *
 * Settings — the password hash lives here so it can be set from the
 * browser on first run. A Worker cannot write its own Cloudflare
 * secrets, so a terminal would otherwise be the only way in.
 * ------------------------------------------------------------------ */

/**
 * Reads one setting. Throws if the read FAILS.
 *
 * It used to catch everything and return null, which collapsed "no such row"
 * and "the database did not answer" into the same value. That mattered in one
 * specific place: resolvePasswordHash treats null as "no password set", and
 * the setup page treats no-password as "first run, let anyone choose one". A
 * transient D1 error was therefore enough to re-open an unauthenticated
 * endpoint that overwrites the admin password.
 *
 * Callers that genuinely do not care can use getSettingOrNull.
 */
export async function getSetting(db: D1Database, key: string): Promise<string | null> {
  const row = await db
    .prepare('SELECT value FROM settings WHERE key = ?')
    .bind(key)
    .first<{ value: string }>();
  return row?.value ?? null;
}

/** For display only — never for an authorisation decision. */
export async function getSettingOrNull(db: D1Database, key: string): Promise<string | null> {
  try { return await getSetting(db, key); } catch { return null; }
}

export async function setSetting(db: D1Database, key: string, value: string): Promise<void> {
  await db
    .prepare(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, unixepoch())
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = unixepoch()`
    )
    .bind(key, value)
    .run();
}

export async function deleteSetting(db: D1Database, key: string): Promise<void> {
  await db.prepare('DELETE FROM settings WHERE key = ?').bind(key).run();
}

/** SHA-256 hex, for the one-time setup token. */
export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export { timingSafeEqual };
