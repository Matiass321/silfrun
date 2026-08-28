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
  /**
   * The canonical origin. Every canonical link, hreflang alternate, sitemap
   * entry, structured-data @id and the llms.txt map are built from this, so it
   * is the only place the live domain is written.
   *
   * .is rather than .com, deliberately. A ccTLD is an unambiguous geotargeting
   * signal for Iceland, and since Google retired the International Targeting
   * setting in Search Console there is no longer any way to tell it that a .com
   * targets a particular country — it can only infer it from language, address
   * and local signals.
   *
   * silfrun.com stays live and must 301 here. Two domains serving the same
   * pages without one redirecting to the other is what splits a site's ranking
   * across both.
   */
  url: 'https://silfrun.is',

  /**
   * Iceland does not observe daylight saving and sits on UTC year round, but
   * naming the zone explicitly keeps date handling honest if that ever changes
   * or if the site is ever rendered from another region.
   */
  timezone: 'Atlantic/Reykjavik',

  brand: 'Silfrun',
  /** ASCII form, for places that cannot carry the accent (domains, handles). */
  brandAscii: 'Silfrun',

  legalName: 'Studio Esja ehf.',
  /**
   * Icelandic company registration number. Required on a commercial website.
   *
   * Company form: the day carries +40, so 63 is the 23rd. Registered
   * 23.02.2026. The check digit was verified rather than trusted — a
   * transposed pair still looks like a kennitala but belongs to nobody.
   */
  kennitala: '630226-0580',
  /** VSK (VAT) number, if the business is VSK-registered. */
  vskNumber: TODO(''),

  defaultLocale: 'is' as Locale,
  locales: LOCALES,

  contact: {
    /** Display form. Icelandic seven-digit subscriber number, grouped 3-4. */
    phone: '+354 771 3011',
    /** E.164, for tel: links and structured data. No spaces, leading plus. */
    phoneE164: '+3547713011',
    email: 'hello@silfrun.is',

    /**
     * WhatsApp number in international digits, no plus and no spaces — an
     * Icelandic mobile is '354' followed by the seven digits, e.g. '3546601234'.
     *
     * Deliberately separate from phoneE164 rather than derived from it: the
     * business line is often a landline that cannot receive WhatsApp, and
     * silently pointing a WhatsApp button at a landline loses the enquiry with
     * no error anyone would see.
     */
    whatsapp: '3547713011',

    /**
     * Facebook page username for m.me, without the domain — the part after
     * facebook.com/. Found under Page settings, not the numeric page id.
     */
    messenger: 'silfrun',
  },

  /**
   * Registered address.
   *
   * `public: false` keeps it off the site and out of structured data. This is a
   * service-area business: the work happens in the customer's home, nobody
   * visits the office, and publishing it invites callers to an address that is
   * not set up to receive them.
   *
   * NOTE: Icelandic e-commerce law (lög nr. 30/2002) expects a commercial
   * website to state the trader's address alongside the name and kennitala.
   * Withholding it is a deliberate business decision, not an oversight — but it
   * is worth a lawyer's view when the legal pages are reviewed.
   *
   * The value is kept here so invoices, the legal pages and any future Google
   * Business Profile can read it from one place rather than a second copy.
   */
  address: {
    public: false,
    street: 'Álafossvegur 27',
    postalCode: '270',
    city: 'Mosfellsbær',
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
   * Service areas in the capital region.
   *
   * Each carries its DATIVE form and its preposition, because Icelandic
   * inflects after a preposition and every page here reads "cleaning in
   * <place>". Interpolating the nominative produced "í Kópavogur" instead of
   * "í Kópavogi" — on the H1, the title, the meta description and the
   * prefilled WhatsApp message of all twelve area pages. Neither the ending
   * nor the preposition is derivable from the name, so both are recorded
   * rather than computed. Only list places genuinely covered —
   * each gets a real page with local detail, never a name-swapped template.
   */
  areas: [
    { slug: 'reykjavik',     name: 'Reykjavík',      dative: 'Reykjavík',      prep: 'í', primary: true },
    { slug: 'kopavogur',     name: 'Kópavogur',      dative: 'Kópavogi',       prep: 'í', primary: true },
    { slug: 'gardabaer',     name: 'Garðabær',       dative: 'Garðabæ',        prep: 'í', primary: true },
    { slug: 'hafnarfjordur', name: 'Hafnarfjörður',  dative: 'Hafnarfirði',    prep: 'í', primary: true },
    /* Seltjarnarnes takes 'á', not 'í' — Icelandic place prepositions are
       lexical, not derivable from the word, so each one is recorded. */
    { slug: 'seltjarnarnes', name: 'Seltjarnarnes',  dative: 'Seltjarnarnesi', prep: 'á', primary: false },
    { slug: 'mosfellsbaer',  name: 'Mosfellsbær',    dative: 'Mosfellsbæ',     prep: 'í', primary: false },
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
   * An amount left null renders as a visibly pending value and is omitted from
   * structured data — never shown as a real price and never guessed at.
   *
   * THE FIGURES BELOW ARE A PROPOSAL, NOT RESEARCHED LOCAL DATA. They were set
   * by comparison: Iceland runs roughly 1.6x the Spanish price level, a
   * comparable Spanish operator charges EUR 105 for a three-seat sofa, and
   * premium positioning sits about 1.3-1.5x above the resulting mid-market
   * figure. They have NOT been checked against actual Reykjavik competitors.
   * Verify before launch, and against real job times.
   *
   * Round thousands are deliberate. Nine-endings read as discount retail;
   * round numbers read as a confident price.
   *
   * Amounts include VSK at 24%, so a 35,000 line is 28,226 net to the business.
   */
  pricing: {
    currency: "ISK",
    /** Whether the published figures already include VSK. */
    includesVsk: true,
    /**
     * Minimum charge for a visit. Not optional: a single armchair does not
     * cover the trip once travel and setup are counted.
     */
    minimumCallout: 27000 as number | null,
    items: [
      { key: "sofa2", from: 27000 },
      { key: "sofa3", from: 35000 },
      { key: "sofaCorner", from: 48000 },
      { key: "armchair", from: 15000 },
      { key: "diningChair", from: 6000, minQty: 4 },
      { key: "rug", from: 4500, unit: "m2" },
      { key: "carpet", from: 2200, unit: "m2" },
      { key: "odour", from: 12000, unit: "surcharge" },
    ] as PriceItem[],
  },
};

/**
 * Deep-link to a WhatsApp conversation, with the first message written for
 * the visitor.
 *
 * Returns null while the number is a placeholder, so a button can never point
 * at a wrong or empty number — sending a customer to a stranger's WhatsApp is
 * worse than showing no button at all.
 *
 * wa.me is used rather than api.whatsapp.com because it resolves to the
 * installed app on mobile and to WhatsApp Web on desktop without a redirect.
 */
export function whatsappUrl(prefill?: string): string | null {
  const number = SITE.contact.whatsapp;
  if (isPlaceholder(number)) return null;
  const digits = String(number).replace(/[^0-9]/g, '');
  if (!digits) return null;
  return prefill
    ? `https://wa.me/${digits}?text=${encodeURIComponent(prefill)}`
    : `https://wa.me/${digits}`;
}

/** Deep-link to Messenger, or null while the handle is a placeholder. */
export function messengerUrl(): string | null {
  const handle = SITE.contact.messenger;
  if (isPlaceholder(handle)) return null;
  const clean = String(handle)
    .replace(/^https?:\/\//, '')
    .replace(/^(?:www\.)?(?:facebook|fb)\.com\//, '')
    .replace(/^m\.me\//, '')
    .replace(/^\/+|\/+$/g, '');
  return clean ? `https://m.me/${clean}` : null;
}

/**
 * A contact link that counts the click before forwarding.
 *
 * Returns null for the same reason the direct helpers do — a channel that is
 * not configured must render no button at all rather than a dead one.
 *
 * `from` is the page the button sits on, so the admin can tell a click from
 * the rug page apart from one on the price list. That is the whole question a
 * cleaning business has about its website: which page produces enquiries.
 */
export function trackedUrl(
  channel: 'whatsapp' | 'messenger' | 'call' | 'email',
  opts: { from?: string; text?: string } = {}
): string | null {
  const live =
    channel === 'whatsapp' ? whatsappUrl() !== null
    : channel === 'messenger' ? messengerUrl() !== null
    : channel === 'call' ? !isPlaceholder(SITE.contact.phoneE164)
    : !isPlaceholder(SITE.contact.email);

  if (!live) return null;

  const q = new URLSearchParams();
  if (opts.from) q.set('p', opts.from);
  if (opts.text) q.set('t', opts.text);

  const qs = q.toString();
  return qs ? `/go/${channel}?${qs}` : `/go/${channel}`;
}

/** True when at least one instant-messaging channel is live. */
export function hasInstantChannel(): boolean {
  return whatsappUrl() !== null || messengerUrl() !== null;
}

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
