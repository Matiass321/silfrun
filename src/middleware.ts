import { defineMiddleware } from 'astro:middleware';

/**
 * Security headers for on-demand responses.
 *
 * `public/_headers` is applied by Cloudflare Pages to STATIC assets only. Every
 * route rendered by the Worker — the whole admin, the API and the booking
 * confirmation — bypasses it entirely and would otherwise ship with no
 * security headers at all.
 *
 * That is not a theoretical gap: it is exactly the half of the site that holds
 * customer names, telephone numbers and home addresses. Found by reading the
 * live response headers rather than by trusting the config.
 *
 * The values are kept deliberately in step with `_headers`. If one changes,
 * change both, or a page will be hardened differently depending on whether it
 * happened to be prerendered.
 */

/** No JavaScript is executed anywhere, so nothing needs a scripting origin. */
const CSP = [
  "default-src 'self'",
  "script-src 'none'",
  // Astro inlines small scoped stylesheets; a few elements carry style
  // attributes. With script-src 'none' there is no scripting context for a
  // style-based attack to escalate out of.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  // Stops an injected form posting a visitor's details somewhere else.
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const PERMISSIONS = [
  'accelerometer=()', 'autoplay=()', 'camera=()', 'clipboard-read=()',
  'display-capture=()', 'encrypted-media=()', 'fullscreen=()', 'geolocation=()',
  'gyroscope=()', 'interest-cohort=()', 'magnetometer=()', 'microphone=()',
  'midi=()', 'payment=()', 'publickey-credentials-get=()', 'screen-wake-lock=()',
  'sync-xhr=()', 'usb=()', 'xr-spatial-tracking=()',
].join(', ');

const BASE: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy': CSP,
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': PERMISSIONS,
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-site',
};

/**
 * Paths that must never be cached or indexed.
 *
 * no-store rather than no-cache: customer names, telephone numbers and home
 * addresses must not survive in a browser's disk cache or an intermediate
 * proxy after somebody signs out. The booking confirmation is included because
 * it carries a reference number and exists for one visitor at one moment.
 */
const PRIVATE = [/^\/admin(\/|$)/, /^\/api(\/|$)/, /^\/booking-received(\/|$)/];

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  /* A redirect's body is never rendered, but its headers still travel. */
  for (const [k, v] of Object.entries(BASE)) {
    if (!response.headers.has(k)) response.headers.set(k, v);
  }

  const path = context.url.pathname;

  if (PRIVATE.some((re) => re.test(path))) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
  }

  return response;
});
