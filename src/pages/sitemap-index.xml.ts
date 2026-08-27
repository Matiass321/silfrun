import type { APIRoute } from 'astro';
import { SITE } from '~/config/site';

export const prerender = false;

/**
 * The index Search Console was given.
 *
 * Kept at this exact filename because it is the URL already submitted and
 * already in robots.txt. One child is enough for a site of this size; the
 * index exists so that adding a second — a gallery or a blog — never means
 * resubmitting anything.
 */
export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE.url}/sitemap-0.xml</loc></sitemap>
</sitemapindex>
`,
    {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
