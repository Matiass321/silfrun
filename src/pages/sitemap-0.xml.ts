import type { APIRoute } from 'astro';
import { LOCALES, SITE, type Locale } from '~/config/site';
import { SLUGS, type PageKey } from '~/i18n/routes';

export const prerender = false;

/**
 * The sitemap, generated from the slug table.
 *
 * @astrojs/sitemap crawled the routes the build emitted. Those routes render
 * per request now, so it had nothing left to enumerate and quietly produced no
 * sitemap at all — the kind of regression that costs a month of indexing
 * before anybody notices.
 *
 * Driving it from SLUGS is the better answer regardless: the table is already
 * the single source of truth for every internal href and for hreflang, so a
 * page cannot exist without appearing here, and a URL cannot appear here
 * without the router serving it.
 *
 * Each entry carries its own xhtml:link alternates. Google treats the sitemap
 * and the on-page hreflang as one claim, and they are built from the same
 * table, so they cannot disagree.
 */

const PAGES: PageKey[] = [
  'home', 'services', 'sofa', 'rug', 'carpet', 'stains',
  'process', 'results', 'areas', 'about', 'faq', 'quote', 'contact',
  'privacy', 'terms',
];

/** Legal boilerplate is real but not what anyone should land on from search. */
const LOW_PRIORITY: PageKey[] = ['privacy', 'terms'];

const url = (locale: Locale, slug: string): string =>
  slug ? `${SITE.url}/${locale}/${slug}/` : `${SITE.url}/${locale}/`;

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface Entry { loc: string; alts: { hreflang: string; href: string }[]; priority: string }

function entries(): Entry[] {
  const out: Entry[] = [];

  for (const key of PAGES) {
    const byLocale = LOCALES.map((l) => ({ locale: l, href: url(l, SLUGS[key][l]) }));
    const alts = [
      ...byLocale.map((b) => ({ hreflang: b.locale, href: b.href })),
      { hreflang: 'x-default', href: byLocale.find((b) => b.locale === 'is')!.href },
    ];
    for (const b of byLocale) {
      out.push({
        loc: b.href,
        alts,
        priority: key === 'home' ? '1.0' : LOW_PRIORITY.includes(key) ? '0.2' : '0.7',
      });
    }
  }

  for (const area of SITE.areas) {
    const byLocale = LOCALES.map((l) => ({
      locale: l,
      href: `${SITE.url}/${l}/${SLUGS.areas[l]}/${area.slug}/`,
    }));
    const alts = [
      ...byLocale.map((b) => ({ hreflang: b.locale, href: b.href })),
      { hreflang: 'x-default', href: byLocale.find((b) => b.locale === 'is')!.href },
    ];
    for (const b of byLocale) out.push({ loc: b.href, alts, priority: '0.6' });
  }

  return out;
}

export const GET: APIRoute = () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries()
  .map(
    (e) => `  <url>
    <loc>${esc(e.loc)}</loc>
${e.alts
  .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}" />`)
  .join('\n')}
    <priority>${e.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};
