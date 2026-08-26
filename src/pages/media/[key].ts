import type { APIRoute } from 'astro';
import { env } from '~/lib/admin-guard';

export const prerender = false;

/**
 * Serves one stored file from KV.
 *
 * Keys are the SHA-256 of the content, so the URL changes whenever the bytes
 * do. That makes the response immutable and lets it be cached for a year —
 * there is no such thing as a stale version of a content-addressed object.
 *
 * The key is validated as 64 hex characters before it is used. Without that,
 * the path segment is attacker-controlled input going straight into a KV
 * lookup.
 */
export const GET: APIRoute = async (context) => {
  const { MEDIA } = env(context) as { MEDIA?: KVNamespace };
  const raw = String(context.params.key ?? '');

  if (!MEDIA) return new Response('Media store unavailable.', { status: 503 });

  const key = raw.replace(/\.[a-z0-9]+$/i, '');
  if (!/^[a-f0-9]{64}$/.test(key)) return new Response('Not found.', { status: 404 });

  const object = await MEDIA.getWithMetadata<{ mime?: string }>(key, { type: 'arrayBuffer' });
  if (!object.value) return new Response('Not found.', { status: 404 });

  /* If-None-Match: the key IS the hash, so the ETag is free and always right. */
  if (context.request.headers.get('if-none-match') === `"${key}"`) {
    return new Response(null, { status: 304 });
  }

  return new Response(object.value, {
    headers: {
      'Content-Type': object.metadata?.mime ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
      ETag: `"${key}"`,
      'X-Content-Type-Options': 'nosniff',
      /* Must be fetchable cross-origin so social previews can load it. */
      'Cross-Origin-Resource-Policy': 'cross-origin',
    },
  });
};
