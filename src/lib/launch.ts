import { getSettingOrNull, setSetting } from './auth';

/**
 * Whether the site is still behind the holding page.
 *
 * A setting rather than an environment variable, so launching is a switch in
 * the admin instead of a redeploy — the moment somebody decides they are ready
 * is not usually a moment they want to be waiting on a build.
 *
 * Default is CLOSED. An unmigrated or unreachable database therefore shows the
 * holding page rather than the full site, which is the safe direction to fail:
 * a business that is not open yet showing a coming-soon page is correct, where
 * an unfinished site opening itself to the public because a query threw is not.
 */
const KEY = 'launch_state';

/**
 * Cached per isolate for a minute.
 *
 * This is consulted on every single request, including every asset the
 * middleware sees, so reading D1 each time would put a database round trip in
 * front of the whole site. A minute is short enough that flipping the switch
 * feels immediate and long enough that the read effectively disappears.
 */
let cache: { value: boolean; until: number } | null = null;

export async function isComingSoon(db: D1Database | undefined): Promise<boolean> {
  const now = Date.now();
  if (cache && cache.until > now) return cache.value;

  /* No database is not a reason to open the site. */
  if (!db) return true;

  const raw = await getSettingOrNull(db, KEY);
  const value = raw !== 'open';

  cache = { value, until: now + 60_000 };
  return value;
}

/** Flips the switch and drops the cache in this isolate immediately. */
export async function setLaunchState(db: D1Database, open: boolean): Promise<void> {
  await setSetting(db, KEY, open ? 'open' : 'coming-soon');
  cache = { value: !open, until: Date.now() + 60_000 };
}

/**
 * Paths that stay reachable while the holding page is up.
 *
 * The admin obviously. The API, because the holding page's own signup form
 * posts to it. The media and beacon routes, because the holding page shows a
 * photograph and still counts its own visitors — knowing how many people
 * arrived before opening is the entire reason for collecting an email address
 * from them.
 */
const OPEN_PREFIXES = ['/admin', '/api/', '/media/', '/go/', '/_astro/', '/fonts/'];
const OPEN_EXACT = new Set([
  '/',
  '/px.gif',
  '/favicon.svg',
  '/favicon.ico',
  '/robots.txt',
  '/admin.webmanifest',
  '/site.webmanifest',
]);

export function isOpenPath(pathname: string): boolean {
  if (OPEN_EXACT.has(pathname)) return true;
  if (OPEN_PREFIXES.some((p) => pathname.startsWith(p))) return true;
  /* Anything with a file extension is an asset, not a page. */
  return /\.[a-z0-9]{2,5}$/i.test(pathname);
}
