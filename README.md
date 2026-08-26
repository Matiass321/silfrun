# Silfrun

Specialist upholstery, rug and carpet care in the Reykjavík capital area.

Astro + TypeScript, deployed to Cloudflare Pages. Every page is prerendered to
static HTML and ships no external JavaScript.

**Live at https://silfrun.is.** `silfrun.com` is attached to the same Pages
project and serves the same pages; every page canonicalises to `.com`, so the
two consolidate rather than compete. If `.is` should become primary — a good
argument for an Icelandic business, since a local TLD carries weight in local
results — change `SITE.url` in `src/config/site.ts`, redeploy, and add a
redirect rule the other way. Do not leave both live without one pointing at the
other.

Icelandic is the canonical language; English is a full second language with
genuinely translated URLs, not a prefix on the Icelandic ones:

```
/is/sofahreinsun/
/en/sofa-cleaning/
```

`/` is not a content page — it is a language chooser, marked `noindex` and
excluded from the sitemap. hreflang alternates plus `x-default` are generated
from the slug table in `src/i18n/routes.ts`, so a page can never advertise a
URL that does not exist.

## Commands

```bash
npm run dev      # local dev server on :4322
npm run build    # type check + production build into dist/
npm run check    # type check only
```

## Deploying

The Pages project has no Git provider connected, so a push publishes nothing on
its own — pushing to GitHub and deploying are two separate actions. Deploys are
direct uploads:

```bash
npm run build
npx wrangler pages deploy ./dist --project-name silfrun
```

| Setting | Value |
| --- | --- |
| Build command | `npm run build:ci` |
| Build output directory | `dist` |
| Node version | 20 or later |

`build:ci` skips `astro check` so a type warning never blocks a deploy; the
full check runs locally.

## Design system

The site runs the Silfrun system, "cold light on black stone". Clean is read
from brightness and cool hue — which is why every mass-market cleaning brand is
cyan on white, and why they all read as hygiene rather than luxury. Expensive is
read from dark values, few hues, real material and unearned space.

| | |
| --- | --- |
| Ground | Basalt `#0B0D0F` — the colour of the uniform |
| Light | Silver and glacier, achromatic and cold |
| Paper | Warm limestone (`[data-theme="vellum"]`), because cold white reads as a dental practice |
| Accent | Kelp, the single saturated tone. It only ever confirms |
| Proportion | 75% basalt · 15% silver · 7% stone · 3% kelp |

Marcellus speaks (display, **one weight only**), Archivo works (UI, body),
IBM Plex Mono annotates specifications and never prose. All three are
self-hosted through `@fontsource`, so the page still makes zero external
requests, and all three cover Icelandic (ð þ æ ö á í).

Rules that are not negotiable:

- **1px is the only border weight.** Only its colour changes.
- **Nothing is rounded.** 2px is the house default, 8px the absolute maximum.
  The pill radius exists only for chips, which read as physical tokens.
- **The wordmark's 0.34em tracking is never tightened.** On narrow screens the
  type size comes down instead.
- **Nothing bounces or springs.** Glide and settle, opacity and 4–16px
  translation only. Hover lifts 1px, press pushes 1px.
- **Voice: sentence case, no exclamation marks, no emoji, no superlatives.**
  The word "luxury" never appears in copy. Figures as numerals.
- **Foil is used once per view at most** — the hero action, the wordmark, a
  section edge. Foil everywhere is foil nowhere.

Marcellus and Archivo are stand-ins proxying a licensed pairing (an
inscriptional display face and a neutral grotesque). Swap the `@fontsource`
imports in `src/layouts/Base.astro` and `src/pages/index.astro` when the
licences are bought.

No photography exists, so every image position renders as a hatched plate
carrying the brief for the shot to commission — a shot list a photographer can
work from, rather than a stock photograph.

## Where things live

| Path | What |
| --- | --- |
| `src/config/site.ts` | **Single source of truth** — contact details, hours, areas |
| `src/i18n/locales/` | Interface copy, one file per language (`is` is canonical) |
| `src/i18n/routes.ts` | Localized URL slugs for every page in every language |
| `src/i18n/meta.ts` | Titles and descriptions, one entry per page per language |
| `src/data/services.ts` | Per-service page content |
| `src/data/content.ts` | FAQ, prose pages and draft legal text |
| `src/styles/tokens.css` | Design tokens — colour ramps, type, space, material, motion |
| `src/styles/base.css` | Base layer plus the `sf-*` components and layout primitives |

Contact details, hours and service areas are read from `site.ts` and nowhere
else. Never hardcode them into a page or a translation string.

## Placeholder data

**Nothing is ever invented.** Values awaiting real business data render with a
visible marker and a screen-reader note, and are omitted entirely from
structured data — publishing a placeholder as a machine-readable telephone
number is worse than publishing none.

Placeholder *labels* live in `src/i18n/locales/`, not in `site.ts`. This is
deliberate: holding them in the single-language config is how a site ends up
printing one language's placeholder on every other language's page.

Search `TODO(` in `src/config/site.ts` for the outstanding list. Currently:

- Registered company name and kennitala
- Email address
- Street address and postcode
- Social profiles, including the Messenger handle
- Reviews (none published until genuine ones exist)

Filled in: the telephone number and WhatsApp number, `+354 771 3011`.

Also outstanding:

- **Photography.** No stock imagery is used. `/is/verkin-okkar/` stays empty
  until real before-and-after pairs are shot in matching light and framing.
- **Six FAQ answers** that depend on company policy nobody has set — pricing,
  notice period, payment, cancellation, and product safety around children and
  pets. These render as clearly marked pending items rather than invented
  answers, and are excluded from the FAQ structured data.
- **Legal review.** `/is/personuvernd/` and `/is/skilmalar/` are drafted
  against Icelandic law (lög nr. 90/2018, lög nr. 16/2016) but carry a visible
  draft notice until a lawyer has read them.

## The site is indexable

`robots.txt` allows everything and the `X-Robots-Tag` header is gone. Both had
to change together — robots.txt alone would not have lifted a noindex header.

This was done deliberately, before all the placeholder data was filled. The
consequence is that the values still listed above are crawlable, and a snippet
carrying "Kennitala væntanleg" can persist in results after the real value goes
in. **The kennitala is the urgent one: Icelandic law requires a registration
number on a commercial website, and it currently renders in the footer of every
page as a placeholder.**

Still outstanding, in the order they cost the most:

1. **Kennitala and registered company name** — legally required, on every page.
2. **Email address** — the only channel a visitor can use without WhatsApp.
3. **Photography.** `/is/verkin-okkar/` and the homepage plates carry briefs for
   the shots to commission rather than stock imagery.
4. **Legal review.** `/is/personuvernd/` and `/is/skilmalar/` are drafted against
   Icelandic law (lög nr. 90/2018, lög nr. 16/2016) but carry a visible draft
   notice until a lawyer has read them.
5. **Six FAQ answers** that depend on company policy nobody has set.
6. **Messenger handle**, if the business wants that channel as well.

## Search and answer engines

- `/llms.txt` is generated at build time from the same tables that build the
  pages, so a renamed slug or a changed price cannot leave it stale. It also
  states what is *not* known, so an engine that finds no telephone number does
  not go and attribute a competitor's to this business.
- One JSON-LD graph per page rather than loose blocks, so `@id` references
  resolve: `LocalBusiness` on the homepage, `Service` with a real "from" offer on
  each service and area page, `HowTo` on the process page, `FAQPage` where every
  answer is genuinely written, `BreadcrumbList` everywhere.
- No `aggregateRating` until genuine reviews exist. Self-serving review markup
  is both a manual-action risk and a lie.
- The social card is generated by `npm run og` into `public/og.png`. Re-run it
  only when the brand changes.

After DNS changes settle, add the site to Google Search Console and Bing
Webmaster Tools and submit `https://silfrun.is/sitemap-index.xml`. Submitting
the sitemap is what triggers the first crawl; without it discovery takes weeks.
