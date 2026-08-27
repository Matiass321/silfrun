import type { Locale } from '~/config/site';

/**
 * Localized URL registry.
 *
 * Every page has a real slug in each language — never one English slug behind
 * a language prefix. Pages are looked up by key so no slug string is written
 * twice, and hreflang alternates are generated from this one table, which
 * makes it impossible to advertise a URL that does not exist.
 *
 * Icelandic slugs are transliterated to ASCII (þ→th, ð→d, æ→ae, ö→o). The
 * accented forms belong in headings and copy, not in URLs.
 */
export type PageKey =
  | 'home'
  | 'services'
  | 'sofa'
  | 'rug'
  | 'carpet'
  | 'stains'
  | 'process'
  | 'results'
  | 'areas'
  | 'about'
  | 'faq'
  | 'quote'
  | 'contact'
  | 'privacy'
  | 'terms';

type SlugTable = Record<PageKey, Record<Locale, string>>;

export const SLUGS: SlugTable = {
  home: { is: '', en: '' },

  services: { is: 'thjonusta', en: 'services' },

  sofa:    { is: 'sofahreinsun',       en: 'sofa-cleaning' },
  rug:     { is: 'teppahreinsun',      en: 'rug-cleaning' },
  carpet:  { is: 'golfteppahreinsun',  en: 'carpet-cleaning' },
  stains:  { is: 'blettir-og-lykt',    en: 'stain-and-odour-treatment' },

  process: { is: 'ferlid',           en: 'how-it-works' },
  results: { is: 'verkin-okkar',     en: 'our-work' },
  areas:   { is: 'thjonustusvaedi',  en: 'service-areas' },
  about:   { is: 'um-okkur',         en: 'about' },
  faq:     { is: 'algengar-spurningar', en: 'faq' },
  quote:   { is: 'fa-tilbod',        en: 'request-a-quote' },
  contact: { is: 'hafa-samband',     en: 'contact' },

  privacy: { is: 'personuvernd', en: 'privacy' },
  terms:   { is: 'skilmalar',    en: 'terms' },
};

/**
 * The deployment base, e.g. "/" on a real domain or "/silfrun/" on GitHub
 * Pages. Every internal href is built through the two helpers below, so
 * honouring the base here is what makes a subpath deploy work at all — a
 * hand-written "/is/..." href would 404 there.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Site-root-relative path for a page in a locale. Always trailing-slashed. */
export function path(key: PageKey, locale: Locale): string {
  const slug = SLUGS[key][locale];
  return slug ? `${BASE}/${locale}/${slug}/` : `${BASE}/${locale}/`;
}

/** Path to a service-area page, e.g. /en/service-areas/reykjavik/ */
export function areaPath(areaSlug: string, locale: Locale): string {
  return `${path('areas', locale)}${areaSlug}/`;
}

/**
 * The services offered, in the order they are presented.
 *
 * Mattress cleaning is deliberately absent for now. Adding it later is one
 * entry here plus one slug pair above — no restructuring, and no URL changes
 * to anything already published.
 */
export const SERVICE_KEYS = ['sofa', 'rug', 'carpet', 'stains'] as const satisfies readonly PageKey[];

export type ServiceKey = (typeof SERVICE_KEYS)[number];

/**
 * The reverse of SLUGS: a translated path back to the page that owns it.
 *
 * getStaticPaths could hand the page its key as a prop because the route was
 * built ahead of time. These routes render per request now — so that photographs
 * uploaded in the admin appear without a redeploy — and a request arrives with
 * nothing but a language and a slug. This is what turns those two back into a
 * page key.
 *
 * Built once at module scope rather than per request: it is a fixed table of
 * about thirty entries and rebuilding it on every render would be pure waste.
 */
const BUILT: PageKey[] = [
  ...SERVICE_KEYS,
  'services', 'process', 'results', 'areas', 'about',
  'faq', 'quote', 'contact', 'privacy', 'terms',
];

const SLUG_LOOKUP: Record<string, PageKey> = (() => {
  const out: Record<string, PageKey> = {};
  for (const locale of ['is', 'en'] as const) {
    for (const key of BUILT) out[`${locale}/${SLUGS[key][locale]}`] = key;
  }
  return out;
})();

export interface ResolvedRoute {
  pageKey: PageKey;
  /** Set only for a single service-area page, e.g. /is/thjonustusvaedi/kopavogur/. */
  areaSlug: string | null;
}

/**
 * Resolves one request, or returns null so the caller can 404.
 *
 * Returning null rather than falling back to a default page is the point: a
 * URL that resolves to *something* is how a site accumulates soft 404s, which
 * Google keeps indexed and which quietly outrank the real pages.
 */
export function resolveRoute(locale: Locale, slug: string): ResolvedRoute | null {
  const clean = slug.replace(/^\/+|\/+$/g, '');

  const direct = SLUG_LOOKUP[`${locale}/${clean}`];
  if (direct) return { pageKey: direct, areaSlug: null };

  /* A service area sits one level under the translated areas slug. */
  const areasPrefix = `${SLUGS.areas[locale]}/`;
  if (clean.startsWith(areasPrefix)) {
    const areaSlug = clean.slice(areasPrefix.length);
    if (areaSlug && !areaSlug.includes('/')) return { pageKey: 'areas', areaSlug };
  }

  return null;
}
