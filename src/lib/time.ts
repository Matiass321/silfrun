/**
 * Time helpers.
 *
 * Iceland sits on UTC year round and does not observe daylight saving, so
 * local time and stored time agree. That is a fact about Iceland, not a
 * shortcut: everything here still goes through an explicit timezone so the
 * code stays correct if the business ever works somewhere that does shift.
 */

export const TZ = 'Atlantic/Reykjavik';

/** 'YYYY-MM-DD' for a unix-seconds instant, in Reykjavík. */
export function isoDate(unix: number): string {
  const d = new Date(unix * 1000);
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Today in Reykjavík, as 'YYYY-MM-DD'. */
export const today = (now = Date.now()): string => isoDate(Math.floor(now / 1000));

/** Midnight at the start of a 'YYYY-MM-DD', as unix seconds. */
export function startOfDay(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Math.floor(Date.UTC(y!, (m ?? 1) - 1, d ?? 1, 0, 0, 0) / 1000);
}

export const endOfDay = (iso: string): number => startOfDay(iso) + 86400;

/** Shifts an ISO date by whole days, staying on date boundaries. */
export function addDays(iso: string, days: number): string {
  return isoDate(startOfDay(iso) + days * 86400);
}

/** 'HH:MM' in Reykjavík. */
export function clock(unix: number): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(unix * 1000));
}

/** A date written the way each language writes it. */
export function longDate(iso: string, locale: 'is' | 'en' = 'is'): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat(locale === 'is' ? 'is-IS' : 'en-GB', {
    timeZone: TZ,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(Date.UTC(y!, (m ?? 1) - 1, d ?? 1)));
}

/** Combines a date and 'HH:MM' into unix seconds. */
export function at(iso: string, hhmm: string): number {
  const [h, mi] = hhmm.split(':').map(Number);
  return startOfDay(iso) + (h ?? 0) * 3600 + (mi ?? 0) * 60;
}

/** Whole krónur, written the Icelandic way. Iceland has no subunit in use. */
export function isk(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('is-IS', {
    style: 'currency',
    currency: 'ISK',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** "in 3 days", "yesterday" — relative to today, for list rows. */
export function relativeDays(iso: string, from = today()): string {
  const diff = Math.round((startOfDay(iso) - startOfDay(from)) / 86400);
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff === -1) return 'yesterday';
  if (diff > 0) return `in ${diff} days`;
  return `${Math.abs(diff)} days ago`;
}
