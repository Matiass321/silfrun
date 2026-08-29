import type { APIRoute } from 'astro';
import { requireAdmin, env } from '~/lib/admin-guard';
import { hashKey, dimensions, ACCEPTED, MAX_BYTES, isSlot, slotMeta, type MediaKind } from '~/lib/media';

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

  /* ---- assign a library file to a slot ---------------------------- */
  /**
   * "Put this photograph here", as one tap from the slot itself.
   *
   * Placing used to mean opening the file, finding the right entry in a
   * seventeen-option select, and saving. This is the same operation from the
   * other end, which is the end somebody actually starts from — they are
   * looking at an empty frame on the page and want something in it.
   *
   * A single slot is exclusive: whatever was there is returned to the library
   * rather than deleted, so swapping a hero shot never loses the old one. A
   * gallery slot accumulates instead, because that is what a gallery is.
   */
  if (action === 'assign') {
    const id = Number(form.get('id'));
    const slotRaw = String(form.get('slot') ?? '').trim();
    if (!Number.isFinite(id) || !isSlot(slotRaw)) return back('?e=bad');

    const row = await DB
      .prepare('SELECT id, key, kind, mime, bytes, width, height, alt_is, alt_en FROM media WHERE id = ?')
      .bind(id)
      .first<{
        id: number; key: string; kind: string; mime: string; bytes: number;
        width: number | null; height: number | null; alt_is: string | null; alt_en: string | null;
      }>();
    if (!row) return back('?e=bad');

    const meta = slotMeta(slotRaw);

    if (!meta?.multi) {
      /* Return the current occupant to the library. */
      await DB.prepare('UPDATE media SET slot = NULL, updated_at = unixepoch() WHERE slot = ? AND id != ?')
        .bind(slotRaw, id).run();
    }

    /* If this file is already placed somewhere else, copy it rather than move
       it — the person picking it for a second slot did not ask to empty the
       first one. */
    const alreadyPlaced = await DB
      .prepare('SELECT slot FROM media WHERE id = ?').bind(id).first<{ slot: string | null }>();

    if (alreadyPlaced?.slot && alreadyPlaced.slot !== slotRaw) {
      await DB.prepare(
        `INSERT INTO media (key, kind, mime, bytes, width, height, slot, alt_is, alt_en)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(row.key, row.kind, row.mime, row.bytes, row.width, row.height, slotRaw, row.alt_is, row.alt_en).run();
    } else {
      await DB.prepare('UPDATE media SET slot = ?, updated_at = unixepoch() WHERE id = ?')
        .bind(slotRaw, id).run();
    }

    return back('?saved=1&slot=' + encodeURIComponent(slotRaw));
  }

  /* ---- take a file out of its slot, without deleting it ----------- */
  if (action === 'unassign') {
    const id = Number(form.get('id'));
    if (!Number.isFinite(id)) return back('?e=bad');
    await DB.prepare('UPDATE media SET slot = NULL, updated_at = unixepoch() WHERE id = ?').bind(id).run();
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

  /**
   * The same file uploaded twice is not an error.
   *
   * It used to be refused outright, which meant one photograph could never
   * appear in two places — and the obvious thing somebody wants is the same
   * hero shot on the phone slot as well as the desktop one. The bytes are
   * content-addressed so there is still only one object in KV; what is created
   * is a second ROW pointing at it, which is exactly what a second placement
   * is. The delete path already refuses to drop the object while another row
   * references the key.
   */
  const existing = await DB.prepare('SELECT id FROM media WHERE key = ?').bind(key).first<{ id: number }>();
  if (existing) return back('?e=dupe&have=' + existing.id);

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
