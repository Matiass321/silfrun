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
  | 'prices'
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
  prices:  { is: 'verd',             en: 'prices' },
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
