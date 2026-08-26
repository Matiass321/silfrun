import type { APIRoute } from 'astro';
import { env } from '~/lib/admin-guard';
import { parseItems, formatPhone } from '~/lib/visits';
import { SITE } from '~/config/site';

export const prerender = false;

/**
 * iCalendar feed, one per token.
 *
 * Google Calendar fetches this from Google's servers with none of our cookies,
 * so it cannot be behind the admin session — hence a token in the path. The
 * token lives in its own table so revoking access is deleting a row.
 *
 * A subscribed feed rather than the Google Calendar API on purpose. The API
 * would mean an OAuth app, a consent screen, refresh tokens to store and
 * rotate, and a re-auth every time Google expires the grant. A feed URL is one
 * paste into "Add calendar → From URL" and keeps working. The trade is that it
 * is one-way: visits appear in Google, but an event created in Google does not
 * come back here. For a business whose bookings all originate in this admin,
 * that is the correct direction anyway.
 *
 * Google refreshes external feeds on its own schedule — often hourly, sometimes
 * slower. This is not a live mirror and is not sold as one.
 */

/** Escapes per RFC 5545: backslash, semicolon, comma and newline. */
const esc = (v: string) =>
  (v ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');

/** UTC basic format: 20260826T090000Z. */
const stamp = (unix: number) =>
  new Date(unix * 1000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** Lines must not exceed 75 octets; continuations begin with one space. */
function fold(line: string): string {
  if (line.length <= 74) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 74));
  rest = rest.slice(74);
  while (rest.length > 73) {
    parts.push(' ' + rest.slice(0, 73));
    rest = rest.slice(73);
  }
  if (rest.length) parts.push(' ' + rest);
  return parts.join('\r\n');
}

const ITEM: Record<string, string> = {
  sofa: 'Sófi', rug: 'Teppi', carpet: 'Gólfteppi', stains: 'Blettir',
};

/** Two hours. Long enough that a calendar does not imply a 30-minute visit. */
const DEFAULT_MINUTES = 120;

export const GET: APIRoute = async (context) => {
  const { DB } = env(context);
  const token = String(context.params.token ?? '');

  if (!DB) return new Response('Calendar unavailable.', { status: 503 });
  if (!/^[a-f0-9]{32}$/.test(token)) return new Response('Not found.', { status: 404 });

  const row = await DB.prepare('SELECT token FROM calendar_tokens WHERE token = ?')
    .bind(token)
    .first<{ token: string }>();

  if (!row) return new Response('Not found.', { status: 404 });

  /* Fire-and-forget: a "last fetched" timestamp must not delay the feed, and
     must not fail it either if the write errors. */
  void DB.prepare('UPDATE calendar_tokens SET last_used_at = unixepoch() WHERE token = ?')
    .bind(token)
    .run()
    .catch(() => {});

  /* A rolling window: 90 days back for reference, a year forward. */
  const now = Math.floor(Date.now() / 1000);
  const res = await DB.prepare(
    `SELECT v.*, c.name, c.phone, c.email
       FROM visits v JOIN customers c ON c.id = v.customer_id
      WHERE v.scheduled_at IS NOT NULL
        AND v.scheduled_at >= ? AND v.scheduled_at <= ?
        AND v.status IN ('scheduled','done')
      ORDER BY v.scheduled_at`
  )
    .bind(now - 90 * 86400, now + 365 * 86400)
    .all<any>();

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${SITE.brandAscii}//Admin//IS`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(SITE.brand)}`,
    `X-WR-TIMEZONE:${SITE.timezone}`,
    /* Hint only — Google honours its own refresh schedule regardless. */
    'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
    'X-PUBLISHED-TTL:PT1H',
  ];

  for (const v of res.results ?? []) {
    const start = v.scheduled_at as number;
    const end = start + DEFAULT_MINUTES * 60;
    const items = parseItems(v.items).map((i) => ITEM[i] ?? i).join(', ');

    const description = [
      items ? `Verk: ${items}` : null,
      `Sími: ${formatPhone(v.phone)}`,
      v.email ? `Netfang: ${v.email}` : null,
      v.quote_isk ? `Verð: ${v.quote_isk} ISK` : null,
      v.notes ? `\nAthugasemdir: ${v.notes}` : null,
      `\n${SITE.url}/admin/visits/?ref=${v.ref}`,
    ].filter(Boolean).join('\n');

    lines.push(
      'BEGIN:VEVENT',
      /* Stable UID: the same visit must update its event, not duplicate it. */
      `UID:${v.ref}@silfrun.is`,
      `DTSTAMP:${stamp(v.updated_at ?? v.created_at ?? now)}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(end)}`,
      fold(`SUMMARY:${esc(`${v.name}${items ? ' — ' + items : ''}`)}`),
      fold(`DESCRIPTION:${esc(description)}`),
      v.address ? fold(`LOCATION:${esc([v.address, v.area].filter(Boolean).join(', '))}`) : '',
      `STATUS:${v.status === 'done' ? 'CONFIRMED' : 'CONFIRMED'}`,
      fold(`URL:${SITE.url}/admin/visits/?ref=${v.ref}`),
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');

  return new Response(lines.filter(Boolean).join('\r\n'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="silfrun.ics"',
      'Cache-Control': 'private, max-age=300',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
};
