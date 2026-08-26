/**
 * Reminders.
 *
 * A visit confirmed a fortnight ago is a visit the household has half
 * forgotten. A message the day before is the cheapest thing that exists for
 * cutting no-access callouts, where the van arrives and nobody is home.
 *
 * Rows are generated from visits and stored rather than computed on the fly.
 * Without a stored row, "sent" has nowhere to live: the reminder either never
 * goes out, or goes out again every time somebody opens the page.
 *
 * Sending is manual, through WhatsApp, by design. An automated sender needs a
 * WhatsApp Business API account, a message template approved by Meta, and a
 * billing relationship. Generating the text and handing it over as a prepared
 * link gets the same outcome today, and the person pressing send can see what
 * they are about to say.
 */

import { isoDate, clock, longDate } from './time';
import { formatPhone } from './visits';

export interface Reminder {
  id: number;
  kind: string;
  subject: string;
  customer_id: number | null;
  due_at: number;
  channel: string;
  body: string;
  sent_at: number | null;
  sent_by: string | null;
  dismissed_at: number | null;
  created_at: number;
}

export interface ReminderRow extends Reminder {
  name: string | null;
  phone: string | null;
  scheduled_at: number | null;
}

export const KIND_VISIT_TOMORROW = 'visit_tomorrow';

/** The message itself. Written out here so it can be read before it is sent. */
function tomorrowBody(name: string, whenIso: string, at: number): string {
  const first = (name ?? '').trim().split(/\s+/)[0] || '';
  return [
    `Sæl${first ? ' ' + first : ''}, þetta er Silfrun.`,
    '',
    `Við komum á morgun, ${longDate(whenIso, 'is')}, klukkan ${clock(at)}.`,
    '',
    'Gott er ef hægt er að taka lausa muni af og við hliðina á stykkinu áður en við mætum.',
    'Láttu okkur vita ef eitthvað hefur breyst.',
  ].join('\n');
}

/**
 * Creates the missing reminders for visits happening tomorrow.
 *
 * Idempotent: the UNIQUE index on (kind, subject) means a second run inserts
 * nothing, so this can be called on every dashboard load without ever
 * producing a duplicate message to a customer.
 *
 * Returns how many were newly created.
 */
export async function generateTomorrowReminders(
  db: D1Database,
  now = Math.floor(Date.now() / 1000)
): Promise<number> {
  const tomorrowStart = (Math.floor(now / 86400) + 1) * 86400;
  const tomorrowEnd = tomorrowStart + 86400;

  const due = await db
    .prepare(
      `SELECT v.ref, v.scheduled_at, v.customer_id, c.name
         FROM visits v
         JOIN customers c ON c.id = v.customer_id
        WHERE v.status = 'scheduled'
          AND v.scheduled_at >= ? AND v.scheduled_at < ?`
    )
    .bind(tomorrowStart, tomorrowEnd)
    .all<{ ref: string; scheduled_at: number; customer_id: number; name: string }>();

  const rows = due.results ?? [];
  if (!rows.length) return 0;

  /* One batch rather than a query per visit: D1 charges per round trip. */
  const statements = rows.map((r) =>
    db
      .prepare(
        `INSERT OR IGNORE INTO reminders (kind, subject, customer_id, due_at, channel, body)
         VALUES (?, ?, ?, ?, 'whatsapp', ?)`
      )
      .bind(
        KIND_VISIT_TOMORROW,
        r.ref,
        r.customer_id,
        r.scheduled_at - 20 * 3600, // early evening the day before
        tomorrowBody(r.name, isoDate(r.scheduled_at), r.scheduled_at)
      )
  );

  const results = await db.batch(statements);
  return results.reduce((n, r) => n + (r.meta?.changes ?? 0), 0);
}

/** Everything still waiting to be sent, soonest first. */
export async function pendingReminders(db: D1Database): Promise<ReminderRow[]> {
  const res = await db
    .prepare(
      `SELECT r.*, c.name, c.phone, v.scheduled_at
         FROM reminders r
    LEFT JOIN customers c ON c.id = r.customer_id
    LEFT JOIN visits v ON v.ref = r.subject
        WHERE r.sent_at IS NULL AND r.dismissed_at IS NULL
     ORDER BY r.due_at ASC
        LIMIT 50`
    )
    .all<ReminderRow>();
  return res.results ?? [];
}

export async function markSent(db: D1Database, id: number): Promise<boolean> {
  const res = await db
    .prepare('UPDATE reminders SET sent_at = unixepoch() WHERE id = ? AND sent_at IS NULL')
    .bind(id)
    .run();
  return (res.meta.changes ?? 0) > 0;
}

export async function dismiss(db: D1Database, id: number): Promise<boolean> {
  const res = await db
    .prepare('UPDATE reminders SET dismissed_at = unixepoch() WHERE id = ? AND dismissed_at IS NULL')
    .bind(id)
    .run();
  return (res.meta.changes ?? 0) > 0;
}

/** A wa.me link with the message already written into it. */
export function reminderLink(r: ReminderRow): string | null {
  if (!r.phone) return null;
  const digits = r.phone.replace(/[^0-9]/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(r.body)}`;
}

export { formatPhone };
