/**
 * Media library.
 *
 * The binary lives in KV; everything queryable about it lives in D1. That split
 * is the whole design: a page render reads rows, never bytes, so putting a
 * photograph on a page costs one indexed query rather than dragging megabytes
 * through the database.
 *
 * Keys are content-addressed — the SHA-256 of the file — so uploading the same
 * photograph twice writes one object and reuses it. That is not a
 * micro-optimisation: on a phone it is genuinely common to pick the same image
 * twice, and a second copy under a second key would be undetectable later.
 */

export type MediaKind = 'image' | 'video';

export interface MediaRow {
  id: number;
  key: string;
  kind: MediaKind;
  mime: string;
  bytes: number;
  width: number | null;
  height: number | null;
  slot: string | null;
  position: number;
  alt_is: string | null;
  alt_en: string | null;
  caption_is: string | null;
  caption_en: string | null;
  pair_id: number | null;
  pair_role: 'before' | 'after' | null;
  poster_id: number | null;
  created_at: number;
  updated_at: number;
}

/**
 * The slots a page can place media into.
 *
 * A closed list rather than a free-text field. An open one means a typo in the
 * admin silently produces a slot nothing renders, and no way to tell that from
 * a slot that is simply empty.
 */
export const SLOTS: { key: string; label: string; ratio: string; kinds: MediaKind[] }[] = [
  /**
   * The hero is TWO slots, not one image scaled.
   *
   * A landscape 3:2 frame cropped to a phone either shows a letterboxed strip
   * or centre-crops away whatever made the shot worth taking. The subject of a
   * sofa photograph is usually wide; the subject of the same scene on a phone
   * is a detail of it. Those are different photographs, so they are different
   * slots and the page picks between them with a media query.
   */
  { key: 'hero',        label: 'Forsíða — aðalmynd (tölva)', ratio: '16 / 9', kinds: ['image', 'video'] },
  { key: 'hero-mobile', label: 'Forsíða — aðalmynd (sími)',  ratio: '4 / 5',  kinds: ['image', 'video'] },
  { key: 'home-1',     label: 'Forsíða — plata 1',          ratio: '4 / 5',  kinds: ['image'] },
  { key: 'home-2',     label: 'Forsíða — plata 2',          ratio: '4 / 5',  kinds: ['image'] },
  { key: 'home-3',     label: 'Forsíða — plata 3',          ratio: '4 / 5',  kinds: ['image'] },
  { key: 'process-1',  label: 'Ferlið — skref 1',           ratio: '4 / 5',  kinds: ['image'] },
  { key: 'process-2',  label: 'Ferlið — skref 2',           ratio: '4 / 5',  kinds: ['image'] },
  { key: 'process-3',  label: 'Ferlið — skref 3',           ratio: '4 / 5',  kinds: ['image'] },
  { key: 'process-4',  label: 'Ferlið — skref 4',           ratio: '4 / 5',  kinds: ['image'] },
  { key: 'gallery',    label: 'Verkin okkar — myndasafn',   ratio: '4 / 5',  kinds: ['image', 'video'] },
  { key: 'sofa',       label: 'Sófahreinsun',               ratio: '3 / 2',  kinds: ['image'] },
  { key: 'rug',        label: 'Teppahreinsun',              ratio: '3 / 2',  kinds: ['image'] },
  { key: 'carpet',     label: 'Gólfteppahreinsun',          ratio: '3 / 2',  kinds: ['image'] },
  { key: 'stains',     label: 'Blettir og lykt',            ratio: '3 / 2',  kinds: ['image'] },
  { key: 'about',      label: 'Um okkur',                   ratio: '3 / 2',  kinds: ['image'] },
];

export type SlotKey = string;

export const isSlot = (v: string): v is SlotKey => SLOTS.some((s) => s.key === v);
export const slotMeta = (v: string) => SLOTS.find((s) => s.key === v);

/** 25 MB is the KV value ceiling. Refused before upload, not after. */
export const MAX_BYTES = 25 * 1024 * 1024;

export const ACCEPTED: Record<string, MediaKind> = {
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/webp': 'image',
  'image/avif': 'image',
  'video/mp4': 'video',
  'video/webm': 'video',
};

/** Content address, so the same file uploaded twice is one object. */
export async function hashKey(bytes: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Reads intrinsic dimensions from the file header.
 *
 * Worth doing rather than trusting the browser: width and height go into the
 * img tag, and without them every image on the page causes a layout shift as
 * it loads — which is both a Core Web Vitals penalty and the specific jolt
 * that makes a site feel cheap.
 *
 * Only the formats that carry it simply are parsed; anything else stores null
 * and the page falls back to the slot's own aspect ratio.
 */
export function dimensions(buf: ArrayBuffer): { width: number; height: number } | null {
  const d = new DataView(buf);
  if (d.byteLength < 24) return null;

  /* PNG: IHDR is always the first chunk. */
  if (d.getUint32(0) === 0x89504e47) {
    return { width: d.getUint32(16), height: d.getUint32(20) };
  }

  /* GIF */
  if (d.getUint32(0) === 0x47494638) {
    return { width: d.getUint16(6, true), height: d.getUint16(8, true) };
  }

  /* JPEG: walk the segments to the first start-of-frame. */
  if (d.getUint16(0) === 0xffd8) {
    let off = 2;
    while (off + 9 < d.byteLength) {
      if (d.getUint8(off) !== 0xff) { off++; continue; }
      const marker = d.getUint8(off + 1);
      /* SOF0..SOF15, skipping the four that are not frame headers. */
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: d.getUint16(off + 5), width: d.getUint16(off + 7) };
      }
      off += 2 + d.getUint16(off + 2);
    }
    return null;
  }

  /* WebP (VP8X / VP8 / VP8L) */
  if (d.byteLength > 30 && d.getUint32(0) === 0x52494646 && d.getUint32(8) === 0x57454250) {
    const fourcc = d.getUint32(12);
    if (fourcc === 0x56503858) {
      return {
        width: 1 + (d.getUint8(24) | (d.getUint8(25) << 8) | (d.getUint8(26) << 16)),
        height: 1 + (d.getUint8(27) | (d.getUint8(28) << 8) | (d.getUint8(29) << 16)),
      };
    }
    if (fourcc === 0x56503820) {
      return { width: d.getUint16(26, true) & 0x3fff, height: d.getUint16(28, true) & 0x3fff };
    }
  }

  return null;
}

/* ------------------------------------------------------------------ *
 * Queries
 * ------------------------------------------------------------------ */

/** Everything in one slot, in order. */
export async function bySlot(db: D1Database, slot: string): Promise<MediaRow[]> {
  const res = await db
    .prepare('SELECT * FROM media WHERE slot = ? ORDER BY position ASC, id ASC')
    .bind(slot)
    .all<MediaRow>();
  return res.results ?? [];
}

/**
 * One row per slot, for pages that show a single image.
 *
 * A single query for the whole page rather than one per slot: a service page
 * asking for four slots individually is four round trips to render one screen.
 */
export async function slotMap(
  db: D1Database,
  slots: string[]
): Promise<Record<string, MediaRow | undefined>> {
  if (!slots.length) return {};
  const holes = slots.map(() => '?').join(',');
  const res = await db
    .prepare(
      `SELECT * FROM media WHERE slot IN (${holes})
        ORDER BY slot ASC, position ASC, id ASC`
    )
    .bind(...slots)
    .all<MediaRow>();

  const out: Record<string, MediaRow | undefined> = {};
  for (const r of res.results ?? []) {
    if (r.slot && !out[r.slot]) out[r.slot] = r; // first per slot wins
  }
  return out;
}

/** The whole library, newest first, for the admin. */
export async function listAll(db: D1Database, limit = 200): Promise<MediaRow[]> {
  const res = await db
    .prepare('SELECT * FROM media ORDER BY created_at DESC LIMIT ?')
    .bind(Math.min(limit, 500))
    .all<MediaRow>();
  return res.results ?? [];
}

export async function getMedia(db: D1Database, id: number): Promise<MediaRow | null> {
  return db.prepare('SELECT * FROM media WHERE id = ?').bind(id).first<MediaRow>();
}

/** Public URL for a stored object. */
export const mediaUrl = (key: string): string => `/media/${key}`;

/** Alt text in the page's language, falling back to the other. */
export const altFor = (m: MediaRow | undefined, locale: 'is' | 'en'): string =>
  (locale === 'is' ? m?.alt_is || m?.alt_en : m?.alt_en || m?.alt_is) ?? '';

export const captionFor = (m: MediaRow | undefined, locale: 'is' | 'en'): string =>
  (locale === 'is' ? m?.caption_is || m?.caption_en : m?.caption_en || m?.caption_is) ?? '';
