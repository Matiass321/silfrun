/**
 * Analytics.
 *
 * The site ships no JavaScript, so nothing here is measured the usual way.
 * Views are counted by a one-pixel image the page requests, and outbound
 * clicks by routing the link through a redirect that logs and forwards. Both
 * work with scripting disabled, which is the point: a measurement that only
 * counts visitors who allow JavaScript quietly under-reports exactly the
 * people most likely to be on a locked-down phone.
 *
 * Nothing identifying is stored. No IP address, no cookie, no session id, no
 * user agent string — only a coarse device class and a two-letter country.
 * That is a deliberate design constraint, not an oversight: it is what lets
 * the site collect this at all without a consent banner, and a banner on a
 * cleaning company's website costs more enquiries than the data is worth.
 */

import { isoDate } from './time';

export type EventKind =
  | 'view'
  | 'whatsapp'
  | 'messenger'
  | 'call'
  | 'email'
  | 'booking'
  | 'subscribe';

export const OUTBOUND_KINDS: EventKind[] = ['whatsapp', 'messenger', 'call', 'email'];

/**
 * Records one event, and never throws.
 *
 * Analytics must not be able to break a page. A failed insert here — a
 * migration not yet applied, D1 briefly unavailable — has to end with the
 * visitor still getting their redirect or their pixel.
 */
export async function record(
  db: D1Database | undefined,
  request: Request,
  input: { kind: EventKind; path?: string | null; locale?: string | null }
): Promise<void> {
  if (!db) return;

  try {
    const ua = request.headers.get('user-agent') ?? '';

    /**
     * Bots are dropped before the insert.
     *
     * robots.txt asks crawlers not to fetch /go/ and /px.gif, but a Disallow is
     * a request, not a control — and the ones that ignore it are exactly the
     * ones that would inflate the conversion numbers this table exists to
     * report. A missed real visit costs a row; a counted crawler costs trust in
     * every figure on the stats page.
     */
    if (/bot|crawl|spider|slurp|bingpreview|facebookexternalhit|headless|monitor|preview|scrape/i.test(ua)) return;

    const device = /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? 'mobile' : 'desktop';

    /* Host only. A full referrer URL can carry a search query, which is
       personal data the moment somebody searches for something revealing. */
    let referrer: string | null = null;
    const raw = request.headers.get('referer');
    if (raw) {
      try {
        const host = new URL(raw).host;
        referrer = host.endsWith('silfrun.is') || host.endsWith('silfrun.com') ? null : host;
      } catch { /* malformed referrer, drop it */ }
    }

    const country = request.headers.get('CF-IPCountry');

    await db
      .prepare(
        `INSERT INTO events (kind, path, locale, referrer, country, device, day)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        input.kind,
        (input.path ?? null)?.slice(0, 200) ?? null,
        input.locale ?? null,
        referrer?.slice(0, 120) ?? null,
        country && country !== 'XX' ? country : null,
        device,
        isoDate(Math.floor(Date.now() / 1000))
      )
      .run();
  } catch {
    /* Never let measurement break the thing being measured. */
  }
}

/* ------------------------------------------------------------------ *
 * Reporting
 * ------------------------------------------------------------------ */

export interface DayCount { day: string; n: number }
export interface LabelCount { label: string; n: number }

/** Totals per kind over the last N days. */
export async function totals(db: D1Database, days = 30): Promise<Record<string, number>> {
  const from = isoDate(Math.floor(Date.now() / 1000) - days * 86400);
  const res = await db
    .prepare('SELECT kind, COUNT(*) AS n FROM events WHERE day >= ? GROUP BY kind')
    .bind(from)
    .all<{ kind: string; n: number }>();

  const out: Record<string, number> = {};
  for (const r of res.results ?? []) out[r.kind] = r.n;
  return out;
}

/**
 * A dense daily series — every day present, zeros included.
 *
 * SQL returns only days that have rows. A chart drawn straight from that
 * silently closes the gaps and turns a quiet week into a straight line
 * between two busy days, which reads as steady traffic that never happened.
 */
export async function series(
  db: D1Database,
  kind: EventKind,
  days = 30
): Promise<DayCount[]> {
  const now = Math.floor(Date.now() / 1000);
  const from = isoDate(now - (days - 1) * 86400);

  const res = await db
    .prepare('SELECT day, COUNT(*) AS n FROM events WHERE kind = ? AND day >= ? GROUP BY day')
    .bind(kind, from)
    .all<DayCount>();

  const found = new Map((res.results ?? []).map((r) => [r.day, r.n]));

  const out: DayCount[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = isoDate(now - i * 86400);
    out.push({ day: d, n: found.get(d) ?? 0 });
  }
  return out;
}

/** The most-viewed pages. */
export async function topPages(db: D1Database, days = 30, limit = 12): Promise<LabelCount[]> {
  const from = isoDate(Math.floor(Date.now() / 1000) - days * 86400);
  const res = await db
    .prepare(
      `SELECT path AS label, COUNT(*) AS n FROM events
        WHERE kind = 'view' AND day >= ? AND path IS NOT NULL
     GROUP BY path ORDER BY n DESC LIMIT ?`
    )
    .bind(from, limit)
    .all<LabelCount>();
  return res.results ?? [];
}

/** Where visitors came from. Internal traffic is already excluded on write. */
export async function topReferrers(db: D1Database, days = 30, limit = 8): Promise<LabelCount[]> {
  const from = isoDate(Math.floor(Date.now() / 1000) - days * 86400);
  const res = await db
    .prepare(
      `SELECT referrer AS label, COUNT(*) AS n FROM events
        WHERE day >= ? AND referrer IS NOT NULL
     GROUP BY referrer ORDER BY n DESC LIMIT ?`
    )
    .bind(from, limit)
    .all<LabelCount>();
  return res.results ?? [];
}

/** Split by a single column, for device and country. */
export async function splitBy(
  db: D1Database,
  column: 'device' | 'country',
  days = 30
): Promise<LabelCount[]> {
  const from = isoDate(Math.floor(Date.now() / 1000) - days * 86400);
  const res = await db
    .prepare(
      `SELECT ${column} AS label, COUNT(*) AS n FROM events
        WHERE kind = 'view' AND day >= ? AND ${column} IS NOT NULL
     GROUP BY ${column} ORDER BY n DESC LIMIT 12`
    )
    .bind(from)
    .all<LabelCount>();
  return res.results ?? [];
}

/**
 * Views on a set of paths, for the pages the business actually cares about.
 *
 * Matched with LIKE on a prefix so both languages of the same page count
 * together — /is/hafa-samband/ and /en/contact/ are one question.
 */
export async function viewsOf(db: D1Database, paths: string[], days = 30): Promise<number> {
  if (!paths.length) return 0;
  const from = isoDate(Math.floor(Date.now() / 1000) - days * 86400);
  const clause = paths.map(() => 'path = ?').join(' OR ');
  const row = await db
    .prepare(`SELECT COUNT(*) AS n FROM events WHERE kind = 'view' AND day >= ? AND (${clause})`)
    .bind(from, ...paths)
    .first<{ n: number }>();
  return row?.n ?? 0;
}
