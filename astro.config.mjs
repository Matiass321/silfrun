// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

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


  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
});
