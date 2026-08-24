import { LOCALES, SITE, type Locale } from '~/config/site';
import { SLUGS, type PageKey } from './routes';
import { is } from './locales/is';
import { en } from './locales/en';

/**
 * Icelandic is canonical: it is written first and the English file is a
 * translation of it. Typing `en` against `typeof is` means a key added to
 * Icelandic and forgotten in English is a build error, not a missing string
 * discovered in production.
 */
export type Dictionary = typeof is;

const DICTIONARIES: Record<Locale, Dictionary> = { is, en };

export const t = (locale: Locale): Dictionary => DICTIONARIES[locale];

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);

export interface Alternate {
  locale: Locale;
  /** BCP 47 tag for the hreflang attribute. */
  hreflang: string;
  href: string;
}

const HREFLANG: Record<Locale, string> = { is: 'is', en: 'en' };

/**
 * hreflang alternates for a page, built from the slug table.
 *
 * Absolute URLs, because hreflang requires them. x-default points at the
 * canonical locale, which is what a crawler arriving without a language
 * preference should be shown.
 */
export function alternates(key: PageKey, locale: Locale): { list: Alternate[]; canonical: string; xDefault: string } {
  const abs = (l: Locale) => {
    const slug = SLUGS[key][l];
    return `${SITE.url}${slug ? `/${l}/${slug}/` : `/${l}/`}`;
  };

  return {
    list: LOCALES.map((l) => ({ locale: l, hreflang: HREFLANG[l], href: abs(l) })),
    canonical: abs(locale),
    xDefault: abs(SITE.defaultLocale),
  };
}

/** hreflang alternates for a service-area page. */
export function areaAlternates(areaSlug: string, locale: Locale) {
  const abs = (l: Locale) => `${SITE.url}/${l}/${SLUGS.areas[l]}/${areaSlug}/`;
  return {
    list: LOCALES.map((l) => ({ locale: l, hreflang: HREFLANG[l], href: abs(l) })),
    canonical: abs(locale),
    xDefault: abs(SITE.defaultLocale),
  };
}
