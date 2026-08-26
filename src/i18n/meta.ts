import type { Locale } from '~/config/site';
import type { PageKey } from './routes';

/**
 * Titles and descriptions, written once per page per language.
 *
 * Kept in its own table rather than reassembled from on-page copy. Body copy
 * is written to be read in place; a description is written to be read in a
 * result listing, and reusing one as the other is how a site ends up with six
 * pages sharing a description and its legal pages running past 200 characters.
 *
 * Titles are kept under about 55 characters so the brand suffix still fits
 * inside what a search result will actually show.
 */
export interface PageMeta {
  title: string;
  description: string;
}

type MetaTable = Record<Locale, Record<PageKey, PageMeta>>;

export const PAGE_META: MetaTable = {
  is: {
    home: {
      title: 'Sérhæfð hreinsun á sófum og teppum',
      description:
        'Silfrun sérhæfir sig í djúphreinsun á sófum, áklæðum, teppum og gólfteppum á höfuðborgarsvæðinu. Hvert efni metið áður en nokkuð er borið á.',
    },
    services: {
      title: 'Þjónusta: áklæði, teppi og blettir',
      description:
        'Djúphreinsun á sófum og áklæðum, teppum, gólfteppum og meðhöndlun bletta og lyktar. Unnið á staðnum á höfuðborgarsvæðinu.',
    },
    sofa: {
      title: 'Sófahreinsun og áklæðahreinsun',
      description:
        'Djúphreinsun með úðaútdrætti fyrir sófa, hægindastóla og stóla. Efni, merkingar og litheldni metin áður en nokkuð er borið á.',
    },
    rug: {
      title: 'Teppahreinsun: ull, silki og gæruskinn',
      description:
        'Teppi metin eftir trefjum og byggingu — ull, silki, jurtatrefjar, gerviefni og gæruskinn. Sandur og vetrarsalt fjarlægt þurrt fyrst.',
    },
    carpet: {
      title: 'Hreinsun á fastlögðum gólfteppum',
      description:
        'Gólfteppahreinsun með stýrðum raka fyrir heimili, sumarbústaði og atvinnuhúsnæði. Sérstök meðferð á gangvegum og álagssvæðum.',
    },
    stains: {
      title: 'Blettir og þrálát lykt',
      description:
        'Meðhöndlun á kaffi, rauðvíni, gæludýraþvagi, mat og þrálátri lykt. Við segjum fyrirfram hvað er raunhæft og hvað ekki.',
    },
    process: {
      title: 'Ferlið: hvernig verkið gengur fyrir sig',
      description:
        'Frá fyrstu myndum að þurru áklæði: hvernig við metum verkið, hvað gerist á staðnum og hverju má búast við á eftir.',
    },
    results: {
      title: 'Verkin okkar: fyrir og eftir',
      description:
        'Raunveruleg verk, mynduð fyrir og eftir í sömu birtu og sama ramma. Engar sviðsettar myndir og ekkert myndasafn af netinu.',
    },
    areas: {
      title: 'Þjónustusvæði á höfuðborgarsvæðinu',
      description:
        'Við vinnum í Reykjavík, Kópavogi, Garðabæ, Hafnarfirði, Seltjarnarnesi og Mosfellsbæ. Sé staðurinn þinn ekki á listanum, hafðu samband.',
    },
    about: {
      title: 'Um Silfrunu: sérhæfing í textílumhirðu',
      description:
        'Hverjir við erum, hvernig við vinnum og hvers vegna hvert efni er metið áður en það er meðhöndlað.',
    },
    faq: {
      title: 'Algengar spurningar um hreinsun',
      description:
        'Þurrktími, viðkvæm efni, blettir sem koma aftur og hvað er raunhæft að ná úr. Svör byggð á efnisfræði, ekki loforðum.',
    },
    quote: {
      title: 'Fá tilboð í hreinsun',
      description:
        'Sendu tvær til þrjár myndir og staðsetningu. Við metum verkið, segjum hvað er hægt og staðfestum verð fyrir heimsókn.',
    },
    prices: {
      title: "Verðskrá fyrir hreinsun",
      description:
        "Byrjunarverð fyrir hreinsun á sófum, áklæðum, teppum og gólfteppum. Endanlegt verð staðfest út frá myndum áður en við komum.",
    },
    contact: {
      title: 'Hafa samband við Silfrunu',
      description: 'Sími, netfang og opnunartími. Við svörum fyrirspurnum á íslensku og ensku.',
    },
    privacy: {
      title: 'Persónuverndarstefna',
      description:
        'Hvaða upplýsingum við söfnum, hvers vegna, hversu lengi þær eru geymdar og hvaða réttindi þú átt samkvæmt persónuverndarlögum.',
    },
    terms: {
      title: 'Skilmálar þjónustunnar',
      description:
        'Hvernig verk eru bókuð og metin, hvað verðmat felur í sér, afbókanir og hvernig farið er með ábendingar og kvartanir.',
    },
  },

  en: {
    home: {
      title: 'Specialist sofa and rug cleaning',
      description:
        'Deep cleaning for sofas, upholstery, rugs and fitted carpet across the Reykjavík capital area. Every material assessed before anything is applied.',
    },
    services: {
      title: 'Services: upholstery, rugs and stains',
      description:
        'Deep cleaning for sofas and upholstery, rugs, fitted carpet, and treatment of stains and odours. Carried out on site across the capital area.',
    },
    sofa: {
      title: 'Sofa and upholstery cleaning',
      description:
        'Hot-water extraction cleaning for sofas, armchairs and dining chairs. Fibre, care label and colourfastness assessed before anything is applied.',
    },
    rug: {
      title: 'Rug cleaning: wool, silk and sheepskin',
      description:
        'Rugs assessed by fibre and construction — wool, silk, plant fibres, synthetics and sheepskin. Grit and winter salt removed dry first.',
    },
    carpet: {
      title: 'Fitted carpet cleaning',
      description:
        'Fitted carpet cleaned with controlled moisture for homes, summer houses and commercial interiors. Traffic lanes treated separately.',
    },
    stains: {
      title: 'Stain and odour treatment',
      description:
        'Treatment for coffee, red wine, pet urine, food and persistent odours. We tell you what is realistic before we start.',
    },
    process: {
      title: 'How it works, step by step',
      description:
        'From the first photographs to dry upholstery: how we assess the work, what happens on site, and what to expect afterwards.',
    },
    results: {
      title: 'Our work: before and after',
      description:
        'Real jobs, photographed before and after in the same light and the same frame. No staged shots and no stock photography.',
    },
    areas: {
      title: 'Service areas in the capital region',
      description:
        'We work in Reykjavík, Kópavogur, Garðabær, Hafnarfjörður, Seltjarnarnes and Mosfellsbær. If your area is not listed, get in touch.',
    },
    about: {
      title: 'About Silfrun: textile care specialists',
      description:
        'Who we are, how we work, and why every material is assessed before it is treated.',
    },
    faq: {
      title: 'Frequently asked questions',
      description:
        'Drying times, delicate materials, stains that return and what is realistic to remove. Answers grounded in how fibres behave, not in promises.',
    },
    quote: {
      title: 'Request a cleaning quote',
      description:
        'Send two or three photographs and your location. We assess the work, tell you what is possible and confirm the price before the visit.',
    },
    prices: {
      title: 'Cleaning price list',
      description:
        'Starting prices for cleaning sofas, upholstery, rugs and fitted carpet. The final figure is confirmed from photographs before we come.',
    },
    contact: {
      title: 'Contact Silfrun',
      description: 'Phone, email and opening hours. We answer enquiries in Icelandic and English.',
    },
    privacy: {
      title: 'Privacy policy',
      description:
        'What information we collect, why, how long it is kept, and the rights you have under data protection law.',
    },
    terms: {
      title: 'Terms of service',
      description:
        'How work is booked and assessed, what a quote covers, cancellations, and how concerns and complaints are handled.',
    },
  },
};

/** Pattern for a service-area page description, filled with the area name. */
export const AREA_META: Record<Locale, { title: string; description: string }> = {
  is: {
    title: 'Hreinsun áklæða og teppa {area}',
    description:
      'Sérhæfð djúphreinsun á sófum, áklæðum og teppum {area}. Unnið á staðnum, með mati á efni áður en nokkuð er borið á.',
  },
  en: {
    title: 'Upholstery and rug cleaning in {area}',
    description:
      'Specialist deep cleaning for sofas, upholstery and rugs in {area}. Carried out on site, with the material assessed before anything is applied.',
  },
};
