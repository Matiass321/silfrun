/**
 * SINGLE SOURCE OF TRUTH for everything business staff need to change.
 *
 * Nothing here may be duplicated into a component, a page or a translation
 * string. Phone numbers, prices, hours and areas are read from this file and
 * nowhere else.
 *
 * Values wrapped in `TODO('')` are placeholders awaiting real business data.
 * They render as visibly marked placeholders so they cannot reach production
 * unnoticed. Never replace them with invented values.
 */

export const LOCALES = ['is', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

/**
 * Registers a value as an unfilled placeholder.
 *
 * Exact rather than heuristic: `isPlaceholder` asks whether the value passed
 * through here, not whether it looks fake. A plausible-looking placeholder
 * such as `hallo@silfrun.is` would otherwise be published as a real address.
 */
const PLACEHOLDERS = new Set<string>();

export const TODO = <T,>(placeholder: T): T => {
  if (typeof placeholder === 'string' && placeholder.length > 0) {
    PLACEHOLDERS.add(placeholder);
  }
  return placeholder;
};

/**
 * A published "from" price.
 *
 * `unit` decides how it reads: a flat item price, a rate per square metre,
 * or a surcharge added to another line. `from` is null until supplied.
 */
export interface PriceItem {
  key: string;
  from: number | null;
  unit?: "item" | "m2" | "surcharge";
  minQty?: number;
}

export const SITE = {
  url: 'https://silfrun.is',

  /**
   * Iceland does not observe daylight saving and sits on UTC year round, but
   * naming the zone explicitly keeps date handling honest if that ever changes
   * or if the site is ever rendered from another region.
   */
  timezone: 'Atlantic/Reykjavik',

  brand: 'Silfrún',
  /** ASCII form, for places that cannot carry the accent (domains, handles). */
  brandAscii: 'Silfrun',

  legalName: TODO(''),
  /** Icelandic company registration number. Required on commercial websites. */
  kennitala: TODO(''),
  /** VSK (VAT) number, if the business is VSK-registered. */
  vskNumber: TODO(''),

  defaultLocale: 'is' as Locale,
  locales: LOCALES,

  contact: {
    phone: TODO(''),
    phoneE164: TODO(''),
    email: TODO(''),
  },

  address: {
    street: TODO(''),
    postalCode: TODO(''),
    city: 'Reykjavík',
    country: 'IS',
    latitude: null as number | null,
    longitude: null as number | null,
  },

  /** Opening hours in 24h local time. Drives display and LocalBusiness JSON-LD. */
  hours: [
    { days: [1, 2, 3, 4, 5], opens: '08:00', closes: '17:00' },
  ],

  social: {
    instagram: TODO(''),
    facebook: TODO(''),
    googleBusinessProfile: TODO(''),
  },

  /**
   * Genuine review data only. While `rating` is null the site shows no rating
   * anywhere and emits no AggregateRating structured data.
   */
  reviews: {
    rating: null as number | null,
    count: null as number | null,
  },

  /**
   * Service areas on the caputal region. Only list places genuinely covered —
   * each gets a real page with local detail, never a name-swapped template.
   */
  areas: [
    { slug: 'reykjavik', name: 'Reykjavík', primary: true },
    { slug: 'kopavogur', name: 'Kópavogur', primary: true },
    { slug: 'gardabaer', name: 'Garðabær', primary: true },
    { slug: 'hafnarfjordur', name: 'Hafnarfjörður', primary: true },
    { slug: 'seltjarnarnes', name: 'Seltjarnarnes', primary: false },
    { slug: 'mosfellsbaer', name: 'Mosfellsbær', primary: false },
  ],

  /**
   * Pricing.
   *
   * `strategy` decides whether the site publishes figures or routes everyone
   * to an assessment. Premium positioning does not require hiding prices, but
   * it does require never publishing a number the business has not agreed to —
   * so this stays 'on-request' until real figures exist.
   */
  /**
   * Published "from" prices.
   *
   * Publishing is the differentiator: most cleaning firms here hide prices
   * behind a quote form, and someone who cannot find a number assumes
   * expensive and leaves. They stay "from" prices because condition genuinely
   * changes the work, and the final figure is confirmed from photographs.
   *
   * Every amount is null until the business supplies it. A null renders as a
   * visibly pending value and is omitted from structured data — it is never
   * shown as a real price and never guessed at.
   */
  pricing: {
    currency: "ISK",
    /** Whether the published figures already include VSK. */
    includesVsk: true,
    /**
     * Minimum charge for a visit. Not optional: a single armchair does not
     * cover the trip once travel and setup are counted.
     */
    minimumCallout: null as number | null,
    items: [
      { key: "sofa2", from: null },
      { key: "sofa3", from: null },
      { key: "sofaCorner", from: null },
      { key: "armchair", from: null },
      { key: "diningChair", from: null, minQty: 4 },
      { key: "rug", from: null, unit: "m2" },
      { key: "carpet", from: null, unit: "m2" },
      { key: "odour", from: null, unit: "surcharge" },
    ] as PriceItem[],
  },
};

/** True when a value is still an unfilled placeholder. */
export const isPlaceholder = (v: unknown): boolean =>
  v === null || v === undefined || v === '' || (typeof v === 'string' && PLACEHOLDERS.has(v));

const NUMBER_TAGS: Record<Locale, string> = { is: 'is-IS', en: 'en-GB' };

/** An amount in krónur, written the way each language writes it. */
export function money(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(NUMBER_TAGS[locale], {
    style: 'currency',
    currency: 'ISK',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** A number with the separator each language uses: 9,4 in Icelandic, 9.4 in English. */
export function decimal(n: number, locale: Locale): string {
  return new Intl.NumberFormat(NUMBER_TAGS[locale]).format(n);
}

/**
 * A date written the way each language writes it.
 *
 * Exists because the Mallorca site shipped raw ISO strings on every legal page
 * in all three languages while formatting its prices meticulously — dates were
 * simply the one thing nobody built a helper for.
 */
export function date(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Intl.DateTimeFormat(NUMBER_TAGS[locale], {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
