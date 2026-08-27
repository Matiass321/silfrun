/**
 * Visit and customer queries.
 *
 * All SQL for the admin lives here rather than in the pages, so a change to
 * the shape of a visit is one edit and not eleven. Every query is parameter-
 * bound; no admin page builds SQL from a string.
 */

export type VisitStatus = 'new' | 'quoted' | 'scheduled' | 'done' | 'cancelled';
export type VisitWindow = 'morning' | 'afternoon' | 'either';

export const VISIT_STATUSES: VisitStatus[] = ['new', 'quoted', 'scheduled', 'done', 'cancelled'];
export const VISIT_WINDOWS: VisitWindow[] = ['morning', 'afternoon', 'either'];

export interface Visit {
  id: number;
  ref: string;
  customer_id: number;
  preferred_date: string;
  window: VisitWindow;
  scheduled_at: number | null;
  items: string;
  address: string | null;
  area: string | null;
  notes: string | null;
  status: VisitStatus;
  quote_isk: number | null;
  locale: string | null;
  created_at: number;
  updated_at: number;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  area: string | null;
  notes: string | null;
  created_at: number;
}

/** A visit joined to the customer it belongs to, which is how it is always shown. */
export interface VisitRow extends Visit {
  name: string;
  phone: string;
  email: string | null;
}

const SELECT_JOINED = `
  SELECT v.*, c.name, c.phone, c.email
  FROM visits v
  JOIN customers c ON c.id = v.customer_id
`;

/**
 * References are derived from the row's own id, never from a prior read.
 *
 * The old version did SELECT-max-then-INSERT with nothing holding a lock
 * between them, against a column declared UNIQUE. Two submissions in flight at
 * once — two visitors, or one person double-tapping a slow button — both read
 * the same last ref and the second insert threw, which the booking endpoint
 * turned into "something went wrong" for an enquiry that was otherwise valid.
 *
 * The id is allocated by SQLite itself, so it cannot collide.
 */
export const refFromId = (id: number): string => `S-${String(id).padStart(4, '0')}`;

/** Finds a customer by phone, or creates one. Phone is the identity. */
export async function upsertCustomer(
  db: D1Database,
  input: { name: string; phone: string; email?: string | null; area?: string | null; notes?: string | null }
): Promise<number> {
  const phone = normalisePhone(input.phone);

  const existing = await db
    .prepare('SELECT id FROM customers WHERE phone = ? LIMIT 1')
    .bind(phone)
    .first<{ id: number }>();

  if (existing) {
    // Fill blanks without overwriting what is already known: a booking that
    // omits an email must not erase the address already on file.
    await db
      .prepare(
        `UPDATE customers
            SET name  = COALESCE(NULLIF(?, ''), name),
                email = COALESCE(NULLIF(?, ''), email),
                area  = COALESCE(NULLIF(?, ''), area)
          WHERE id = ?`
      )
      .bind(input.name ?? '', input.email ?? '', input.area ?? '', existing.id)
      .run();
    return existing.id;
  }

  const res = await db
    .prepare('INSERT INTO customers (name, phone, email, area, notes) VALUES (?, ?, ?, ?, ?)')
    .bind(input.name, phone, input.email ?? null, input.area ?? null, input.notes ?? null)
    .run();

  return Number(res.meta.last_row_id);
}

/**
 * Icelandic numbers are written 771 3011, +354 771 3011 or 3547713011 by
 * different people meaning the same line. Stored digits-only with the country
 * code so the same household is one customer however they were entered.
 */
export function normalisePhone(raw: string): string {
  const digits = (raw ?? '').replace(/[^0-9]/g, '');
  if (!digits) return '';
  if (digits.startsWith('354')) return digits;
  if (digits.length === 7) return `354${digits}`;
  return digits;
}

/** Display form: +354 771 3011. */
export function formatPhone(stored: string): string {
  const d = (stored ?? '').replace(/[^0-9]/g, '');
  if (d.startsWith('354') && d.length === 10) {
    return `+354 ${d.slice(3, 6)} ${d.slice(6)}`;
  }
  return stored ?? '';
}

export async function createVisit(
  db: D1Database,
  input: {
    customer_id: number;
    preferred_date: string;
    window: VisitWindow;
    items: string[];
    address?: string | null;
    area?: string | null;
    notes?: string | null;
    status?: VisitStatus;
    quote_isk?: number | null;
    locale?: string | null;
  }
): Promise<string> {
  /* A placeholder unique enough to survive the insert, replaced immediately
     with the id-derived reference. crypto.randomUUID is available in Workers. */
  const placeholder = `tmp-${crypto.randomUUID()}`;

  const res = await db
    .prepare(
      `INSERT INTO visits
         (ref, customer_id, preferred_date, window, items, address, area, notes, status, quote_isk, locale)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      placeholder,
      input.customer_id,
      input.preferred_date,
      input.window,
      JSON.stringify(input.items ?? []),
      input.address ?? null,
      input.area ?? null,
      input.notes ?? null,
      input.status ?? 'new',
      input.quote_isk ?? null,
      input.locale ?? null
    )
    .run();

  const id = Number(res.meta.last_row_id);
  const ref = refFromId(id);

  await db.prepare('UPDATE visits SET ref = ? WHERE id = ?').bind(ref, id).run();

  return ref;
}

export async function listVisits(
  db: D1Database,
  opts: { status?: VisitStatus | 'open' | 'all'; limit?: number } = {}
): Promise<VisitRow[]> {
  const limit = Math.min(opts.limit ?? 200, 500);
  const status = opts.status ?? 'open';

  let where = '';
  const binds: unknown[] = [];

  if (status === 'open') {
    where = `WHERE v.status IN ('new','quoted','scheduled')`;
  } else if (status !== 'all') {
    where = 'WHERE v.status = ?';
    binds.push(status);
  }

  const sql = `${SELECT_JOINED} ${where}
    ORDER BY COALESCE(v.scheduled_at, strftime('%s', v.preferred_date)) ASC, v.id ASC
    LIMIT ?`;

  const res = await db.prepare(sql).bind(...binds, limit).all<VisitRow>();
  return res.results ?? [];
}

export async function getVisit(db: D1Database, ref: string): Promise<VisitRow | null> {
  return db.prepare(`${SELECT_JOINED} WHERE v.ref = ?`).bind(ref).first<VisitRow>();
}

/**
 * Updates the fields the admin can change.
 *
 * Status is validated against the allowed set here as well as by the CHECK
 * constraint. The constraint is the backstop; rejecting early gives the caller
 * a usable error instead of a D1 exception.
 */
export async function updateVisit(
  db: D1Database,
  ref: string,
  patch: {
    status?: VisitStatus;
    scheduled_at?: number | null;
    quote_isk?: number | null;
    notes?: string | null;
    address?: string | null;
    area?: string | null;
  }
): Promise<boolean> {
  const sets: string[] = [];
  const binds: unknown[] = [];

  if (patch.status !== undefined) {
    if (!VISIT_STATUSES.includes(patch.status)) return false;
    sets.push('status = ?');
    binds.push(patch.status);
  }
  if (patch.scheduled_at !== undefined) { sets.push('scheduled_at = ?'); binds.push(patch.scheduled_at); }
  if (patch.quote_isk !== undefined) { sets.push('quote_isk = ?'); binds.push(patch.quote_isk); }
  if (patch.notes !== undefined) { sets.push('notes = ?'); binds.push(patch.notes); }
  if (patch.address !== undefined) { sets.push('address = ?'); binds.push(patch.address); }
  if (patch.area !== undefined) { sets.push('area = ?'); binds.push(patch.area); }

  if (!sets.length) return false;

  sets.push('updated_at = unixepoch()');

  const res = await db
    .prepare(`UPDATE visits SET ${sets.join(', ')} WHERE ref = ?`)
    .bind(...binds, ref)
    .run();

  return (res.meta.changes ?? 0) > 0;
}

/**
 * Deletes one visit for good.
 *
 * Cancelling and deleting are different acts and the admin offers both. A
 * cancelled visit is a fact about the business — somebody asked, it did not go
 * ahead — and it belongs in the record. Deletion is for rows that were never a
 * customer at all: a duplicate submit, a test booking, obvious junk. Those
 * pollute every count on the dashboard and there is no honest reason to keep
 * them.
 *
 * The customer goes too, but only when this was their last visit. A household
 * that has booked twice must not lose its history because one of the two was a
 * duplicate; a row created by a test submission should not sit in the people
 * list forever.
 *
 * Reminders go with it — they key on the visit ref, not its id. One left
 * pointing at a deleted visit would either break the dashboard join or, worse,
 * send a message about work that no longer exists.
 */
export async function deleteVisit(db: D1Database, ref: string): Promise<boolean> {
  const row = await db
    .prepare('SELECT id, customer_id FROM visits WHERE ref = ?')
    .bind(ref)
    .first<{ id: number; customer_id: number }>();

  if (!row) return false;

  await db.batch([
    db.prepare('DELETE FROM reminders WHERE subject = ?').bind(ref),
    db.prepare('DELETE FROM visits WHERE id = ?').bind(row.id),
    db
      .prepare(
        'DELETE FROM customers WHERE id = ? ' +
          'AND NOT EXISTS (SELECT 1 FROM visits WHERE customer_id = ?)'
      )
      .bind(row.customer_id, row.customer_id),
  ]);

  return true;
}

/** Counts by status, for the dashboard. One query rather than five. */
export async function statusCounts(db: D1Database): Promise<Record<string, number>> {
  const res = await db
    .prepare('SELECT status, COUNT(*) AS n FROM visits GROUP BY status')
    .all<{ status: string; n: number }>();

  const out: Record<string, number> = {};
  for (const r of res.results ?? []) out[r.status] = r.n;
  return out;
}

/** Everything scheduled between two unix seconds, for the calendar and today view. */
export async function visitsBetween(db: D1Database, from: number, to: number): Promise<VisitRow[]> {
  const res = await db
    .prepare(
      `${SELECT_JOINED}
        WHERE v.scheduled_at IS NOT NULL
          AND v.scheduled_at >= ? AND v.scheduled_at < ?
          AND v.status IN ('scheduled','done')
        ORDER BY v.scheduled_at ASC`
    )
    .bind(from, to)
    .all<VisitRow>();
  return res.results ?? [];
}

export async function listCustomers(db: D1Database, limit = 300): Promise<Customer[]> {
  const res = await db
    .prepare('SELECT * FROM customers ORDER BY created_at DESC LIMIT ?')
    .bind(Math.min(limit, 1000))
    .all<Customer>();
  return res.results ?? [];
}

/** How many visits each customer has, so the list can show repeat business. */
export async function customerVisitCounts(db: D1Database): Promise<Record<number, number>> {
  const res = await db
    .prepare('SELECT customer_id, COUNT(*) AS n FROM visits GROUP BY customer_id')
    .all<{ customer_id: number; n: number }>();
  const out: Record<number, number> = {};
  for (const r of res.results ?? []) out[r.customer_id] = r.n;
  return out;
}

/** Parses the JSON items column, tolerating a bad row rather than throwing. */
export function parseItems(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}
