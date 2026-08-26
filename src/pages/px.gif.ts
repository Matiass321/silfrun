import type { APIRoute } from 'astro';
import { env } from '~/lib/admin-guard';
import { record } from '~/lib/analytics';

export const prerender = false;

/**
 * One transparent pixel, and a page view recorded as a side effect.
 *
 * Prerendered pages are served straight from Cloudflare's edge and never touch
 * the Worker, so there is no request to count them by. This is the smallest
 * thing that reaches the Worker on every view and works without JavaScript.
 *
 * 35 bytes. Sent with no-store so the browser asks again on every page rather
 * than counting one visit and going quiet.
 */
const GIF = Uint8Array.from([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x21, 0xf9, 0x04, 0x01, 0x00, 0x00, 0x00,
  0x00, 0x2c, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02,
  0x44, 0x01, 0x00, 0x3b,
]);

export const GET: APIRoute = async (context) => {
  const { DB } = env(context);

  const raw = context.url.searchParams.get('p') ?? '/';
  /* Only ever record a path from our own site, never an absolute URL. */
  const path = raw.startsWith('/') ? raw.slice(0, 200) : '/';
  const locale = path.startsWith('/en') ? 'en' : path.startsWith('/is') ? 'is' : null;

  await record(DB, context.request, { kind: 'view', path, locale });

  return new Response(GIF, {
    headers: {
      'Content-Type': 'image/gif',
      'Content-Length': String(GIF.length),
      'Cache-Control': 'no-store, max-age=0',
      'Content-Security-Policy': "default-src 'none'",
    },
  });
};
