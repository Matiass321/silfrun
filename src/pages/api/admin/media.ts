import type { APIRoute } from 'astro';
import { requireAdmin, env } from '~/lib/admin-guard';
import { hashKey, dimensions, ACCEPTED, MAX_BYTES, isSlot, type MediaKind } from '~/lib/media';

export const prerender = false;

/**
 * Upload, place, describe, reorder and delete media.
 *
 * One endpoint with an `action` field rather than five routes: every one of
 * these is a form post from the same page, and five routes would be five
 * copies of the same guard and the same redirect.
 */
export const POST: APIRoute = async (context) => {
  const gate = await requireAdmin(context);
  if (gate) return gate;

  const { DB, MEDIA } = env(context) as { DB?: D1Database; MEDIA?: KVNamespace };
  if (!DB) return new Response('No database binding.', { status: 503 });

  const back = (q = '') => context.redirect(`/admin/media/${q}`, 303);

  const form = await context.request.formData();
  const action = String(form.get('action') ?? 'upload');

  /* ---- delete ---------------------------------------------------- */
  if (action === 'delete') {
    const id = Number(form.get('id'));
    if (!Number.isFinite(id)) return back('?e=bad');

    const row = await DB.prepare('SELECT key FROM media WHERE id = ?').bind(id).first<{ key: string }>();
    if (row) {
      /* Only drop the object once no row references it — the same file can be
         placed twice under one content hash. */
      const others = await DB
        .prepare('SELECT COUNT(*) AS n FROM media WHERE key = ? AND id != ?')
        .bind(row.key, id)
        .first<{ n: number }>();
      await DB.prepare('DELETE FROM media WHERE id = ?').bind(id).run();
      if (MEDIA && (others?.n ?? 0) === 0) await MEDIA.delete(row.key);
    }
    return back('?saved=1');
  }

  /* ---- place / describe ------------------------------------------ */
  if (action === 'update') {
    const id = Number(form.get('id'));
    if (!Number.isFinite(id)) return back('?e=bad');

    const slotRaw = String(form.get('slot') ?? '').trim();
    const slot = slotRaw && isSlot(slotRaw) ? slotRaw : null;
    const altIs = String(form.get('alt_is') ?? '').trim().slice(0, 300);
    const altEn = String(form.get('alt_en') ?? '').trim().slice(0, 300);

    /**
     * A placed image must have Icelandic alt text.
     *
     * Refused here rather than warned about: an image on a live page with no
     * alt text is an accessibility failure that nobody notices later, and the
     * only moment anyone knows what the photograph shows is right now.
     */
    if (slot && !altIs) return back('?e=alt');

    await DB
      .prepare(
        `UPDATE media SET slot = ?, alt_is = ?, alt_en = ?,
                caption_is = ?, caption_en = ?, position = ?,
                pair_role = ?, updated_at = unixepoch()
          WHERE id = ?`
      )
      .bind(
        slot,
        altIs || null,
        altEn || null,
        String(form.get('caption_is') ?? '').trim().slice(0, 300) || null,
        String(form.get('caption_en') ?? '').trim().slice(0, 300) || null,
        Math.max(0, Math.round(Number(form.get('position')) || 0)),
        ['before', 'after'].includes(String(form.get('pair_role'))) ? String(form.get('pair_role')) : null,
        id
      )
      .run();

    return back('?saved=1');
  }

  /* ---- upload ----------------------------------------------------- */
  if (!MEDIA) return back('?e=nokv');

  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) return back('?e=nofile');

  const kind: MediaKind | undefined = ACCEPTED[file.type];
  if (!kind) return back('?e=type');
  if (file.size > MAX_BYTES) return back('?e=big');

  const buf = await file.arrayBuffer();
  const key = await hashKey(buf);

  const existing = await DB.prepare('SELECT id FROM media WHERE key = ?').bind(key).first<{ id: number }>();
  if (existing) return back('?e=dupe');

  await MEDIA.put(key, buf, { metadata: { mime: file.type } });

  const dim = kind === 'image' ? dimensions(buf) : null;

  await DB
    .prepare(
      `INSERT INTO media (key, kind, mime, bytes, width, height)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(key, kind, file.type, file.size, dim?.width ?? null, dim?.height ?? null)
    .run();

  return back('?saved=1');
};
