// @ts-check
import { defineConfig } from 'astro/config';
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
  output: 'static',

  integrations: [
    sitemap({
      /**
       * Deliberately not using the integration's `i18n` option: it assumes one
       * shared path per language under different prefixes, but our slugs are
       * genuinely translated. hreflang is generated from the slug table in
       * src/i18n/routes.ts instead, which is correct by construction.
       */
      filter: (page) => new URL(page).pathname !== '/',
    }),
  ],

  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
});
