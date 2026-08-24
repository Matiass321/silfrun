// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { SITE } from './src/config/site.ts';

/**
 * Every page is prerendered to static HTML and ships no JavaScript beyond a
 * few hundred bytes of progressive enhancement. A cleaning company's site has
 * no need for a framework runtime, and the speed is a competitive advantage.
 */
export default defineConfig({
  site: SITE.url,
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
