# Silfrún

Specialist upholstery, rug and carpet care in the Reykjavík capital area.

Astro + TypeScript, deployed to Cloudflare Pages. Every page is prerendered to
static HTML and ships no external JavaScript.

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
its own. Deploys are direct uploads:

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

## Where things live

| Path | What |
| --- | --- |
| `src/config/site.ts` | **Single source of truth** — contact details, hours, areas |
| `src/i18n/locales/` | Interface copy, one file per language (`is` is canonical) |
| `src/i18n/routes.ts` | Localized URL slugs for every page in every language |
| `src/i18n/meta.ts` | Titles and descriptions, one entry per page per language |
| `src/data/services.ts` | Per-service page content |
| `src/data/content.ts` | FAQ, prose pages and draft legal text |
| `src/styles/tokens.css` | Design tokens — colour, type scale, spacing |

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
- Phone number and email address
- Street address and postcode
- Social profiles
- Reviews (none published until genuine ones exist)

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

## Before launch

1. Fill the `TODO()` values in `src/config/site.ts`.
2. Shoot the before-and-after photography.
3. Have the legal pages reviewed and remove the draft notice.
4. Replace `public/robots.txt` with the allow block written inside it.
5. Remove the `X-Robots-Tag` line from `public/_headers`.

The site is deliberately `noindex` in both places until then.
