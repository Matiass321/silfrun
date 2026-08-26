// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

import { SITE } from './src/config/site.ts';

/**
 * Every page is prerendered to static HTML and ships no JavaScript beyond a
 * few hundred bytes of progressive enhancement. A cleaning company's site has
 * no need for a framework runtime, and the speed is a competitive advantage.
 */
/**
 * SITE_URL and BASE_PATH are read from the environment so one build can target
 * either a subpath host (GitHub Pages serves at /silfrun/) or a real domain at
 * the root, with no code change. Defaults are the production domain.
 */
const SITE_URL = process.env.SITE_URL ?? SITE.url;
const BASE_PATH = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,

  /**
   * Static by default. All 45 marketing pages are prerendered to HTML and
   * ship no JavaScript; only the admin tool and its API opt out with
   *
   *   export const prerender = false;
   *
   * so the public site keeps its speed and the adapter exists purely to give
   * the admin routes a server and a D1 binding.
   */
  output: 'static',

  adapter: cloudflare({
    // Images are built at compile time; no image-resizing worker at runtime.
    imageService: 'compile',
    platformProxy: {
      // Gives `astro dev` a local D1 database through wrangler.
      enabled: true,
    },
  }),

  integrations: [
    sitemap({
      /**
       * Deliberately not using the integration's `i18n` option: it assumes one
       * shared path per language under different prefixes, but our slugs are
       * genuinely translated. hreflang is generated from the slug table in
       * src/i18n/routes.ts instead, which is correct by construction.
       */
      filter: (page) => {
        const path = new URL(page).pathname;
        // '/' is a language chooser, not content. The admin is not public,
        // and the booking confirmation exists for one visitor at one moment.
        if (path === '/') return false;
        if (path.startsWith('/booking-received')) return false;
        if (path === '/404' || path === '/404/') return false;
        return !path.startsWith('/admin');
      },
    }),
  ],

  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
});
