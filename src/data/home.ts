import type { Locale } from '~/config/site';

/**
 * The homepage registers.
 *
 * Both languages live in one structure rather than in the locale files, because
 * a register is a TABLE: if a row is added to one language and not the other,
 * the two pages stop being the same page. Here a missing translation is a type
 * error rather than a silent divergence.
 *
 * The page has no price and no reviews, so persuasion has to come from
 * specificity. These two tables are that specificity — the same knowledge
 * indexed twice, once on the stain the visitor is looking at and once on the
 * material it is sitting in.
 */

type Bi = Record<Locale, string>;

/* ------------------------------------------------------------------ *
 * Blettaskráin — indexed on the STAIN
 * ------------------------------------------------------------------ */

/**
 * Three outcomes, and only three.
 *
 * A controlled vocabulary is what makes the column read as compiled rather
 * than as prose in a box, and it is what lets the eye scan for FER without
 * reading. The marks are geometric, never colour: a colour-coded outcome would
 * carry meaning that a colourblind visitor loses entirely, and would also have
 * to survive both themes.
 */
export type Outcome = 'out' | 'lighter' | 'stays' | 'unknown';

export const OUTCOME_LABEL: Record<Outcome, Bi> = {
  out:     { is: 'FER',      en: 'COMES OUT' },
  lighter: { is: 'LJÓSNAR',  en: 'LIGHTENS' },
  stays:   { is: 'SITUR',    en: 'STAYS' },
  unknown: { is: '?',        en: '?' },
};

export const OUTCOME_MEANING: Record<Outcome, Bi> = {
  out:     { is: 'fer að jafnaði alveg', en: 'comes out completely as a rule' },
  lighter: { is: 'verður mun daufara, sjaldan alveg horfið', en: 'lightens markedly, rarely gone' },
  stays:   { is: 'skemmd á trefjinni sjálfri, ekki óhreinindi', en: 'damage to the fibre itself, not soil' },
  unknown: { is: 'sendu mynd', en: 'send a photo' },
};

export interface StainRow {
  stain: Bi;
  outcome: Outcome;
  note: Bi;
}

/**
 * Five out, two lighter, three stays.
 *
 * The proportion is deliberate and is the answer to the obvious objection that
 * a page built on limits reads as a list of things that cannot be done. The
 * affirmative majority comes first; the honest tail is at the bottom where it
 * carries weight rather than dominating.
 */
export const STAINS: StainRow[] = [
  {
    stain: { is: 'Kaffi og te', en: 'Coffee and tea' },
    outcome: 'out',
    note: { is: 'Fer að jafnaði alveg, líka gamalt.', en: 'Usually comes out completely, even when old.' },
  },
  {
    stain: { is: 'Matarfita og olía', en: 'Cooking grease and oil' },
    outcome: 'out',
    note: { is: 'Fituleysir á undan vatninu. Ólefín heldur fitu fastast.', en: 'A grease solvent before the water. Olefin holds oil hardest.' },
  },
  {
    stain: { is: 'Mold og drulla', en: 'Mud and soil' },
    outcome: 'out',
    note: { is: 'Best þornuð. Ekki nudda blautt — þá fer það dýpra.', en: 'Best let dry. Do not rub it wet; that drives it deeper.' },
  },
  {
    stain: { is: 'Blóð', en: 'Blood' },
    outcome: 'out',
    note: { is: 'Kalt vatn. Heitt festir það í trefjinni.', en: 'Cold water. Heat sets it in the fibre.' },
  },
  {
    stain: { is: 'Gæludýraþvag', en: 'Pet urine' },
    outcome: 'out',
    note: {
      is: 'Nái það í fyllinguna er lyktin sérstakt verk. Við segjum hvor staðan er áður en byrjað er.',
      en: 'If it has reached the padding, the odour is a separate job. We say which case it is before we start.',
    },
  },
  {
    stain: { is: 'Rauðvín', en: 'Red wine' },
    outcome: 'lighter',
    note: { is: 'Nýlegt fer oft alveg. Þornað tannín hefur litað trefjina.', en: 'Fresh often comes out entirely. Dried tannin has dyed the fibre.' },
  },
  {
    stain: { is: 'Blek og túss', en: 'Ink and marker' },
    outcome: 'lighter',
    note: { is: 'Fer eftir blekinu. Prófað á földum stað fyrst.', en: 'Depends on the ink. Tested in a hidden place first.' },
  },
  {
    stain: { is: 'Sólbleiking', en: 'Sun fading' },
    outcome: 'stays',
    note: { is: 'Liturinn er farinn úr trefjinni. Það eru ekki óhreinindi.', en: 'The colour has left the fibre. That is not soil.' },
  },
  {
    stain: { is: 'Bruni og bráðnar trefjar', en: 'Burns and melted fibre' },
    outcome: 'stays',
    note: { is: 'Trefjan sjálf er skemmd.', en: 'The fibre itself is damaged.' },
  },
  {
    stain: { is: 'Litur sem hefur runnið', en: 'Dye transfer' },
    outcome: 'stays',
    note: { is: 'Verður ekki dreginn til baka.', en: 'Cannot be pulled back out.' },
  },
];

/** The open row. Rendered apart from the table, because it is an invitation. */
export const STAIN_OPEN = {
  stain: { is: 'Þitt tilfelli', en: 'Your case' },
  note: {
    is: 'Sendu mynd — við segjum þér í hvorum flokki það lendir.',
    en: 'Send a photo — we will tell you which group it falls into.',
  },
} satisfies { stain: Bi; note: Bi };

/* ------------------------------------------------------------------ *
 * Efnisskráin — indexed on the MATERIAL
 * ------------------------------------------------------------------ */

/**
 * Six methods, and only six.
 *
 * The column is only columnar if it repeats. Eleven differently-worded methods
 * read as prose in a table; six strings reused across eleven rows read as a
 * classification, which is the impression the section exists to create.
 */
export type Method = 'hot' | 'neutral' | 'minimum' | 'neardry' | 'brush' | 'own';

export const METHOD_LABEL: Record<Method, Bi> = {
  hot:     { is: 'Úðaútdráttur, heitt',          en: 'Hot-water extraction' },
  neutral: { is: 'Úðaútdráttur, hlutlaust pH',   en: 'Extraction, neutral pH' },
  minimum: { is: 'Lágmarksvæta',                 en: 'Minimum moisture' },
  neardry: { is: 'Nánast þurrt',                 en: 'Near-dry' },
  brush:   { is: 'Stefnubursti og rakastýring',  en: 'Directional brush, moisture control' },
  own:     { is: 'Metið sérstaklega',            en: 'Assessed on its own' },
};

/** The six constructions, each drawn as a stroke diagram in Constructions.astro. */
export type Construction = 'plain' | 'twill' | 'cutpile' | 'looppile' | 'knotted' | 'hide';

export const CONSTRUCTION_LABEL: Record<Construction, Bi> = {
  plain:    { is: 'Einskefta',    en: 'Plain weave' },
  twill:    { is: 'Skávefnaður',  en: 'Twill' },
  cutpile:  { is: 'Skorin ló',    en: 'Cut pile' },
  looppile: { is: 'Lykkjuló',     en: 'Loop pile' },
  knotted:  { is: 'Handhnýtt',    en: 'Hand-knotted' },
  hide:     { is: 'Skinn',        en: 'Hide' },
};

export interface FibreRow {
  material: Bi;
  construction: Construction;
  method: Method;
  limit: Bi;
}

/**
 * Sorted so identical methods sit adjacent.
 *
 * Not cosmetic: a repeated value in consecutive rows is what the eye reads as a
 * column. Scattered, the same six strings look like eleven different answers.
 *
 * Authoring limits, so the table never rags: material ≤ 22 characters, limit
 * ≤ 52 characters and ≤ 9 words, at most two sentences.
 */
export const FIBRES: FibreRow[] = [
  { material: { is: 'Bómull', en: 'Cotton' }, construction: 'plain', method: 'hot',
    limit: { is: 'Getur hlaupið í fyrsta sinn.', en: 'Can shrink the first time.' } },
  { material: { is: 'Gerviefni', en: 'Synthetics' }, construction: 'plain', method: 'hot',
    limit: { is: 'Ólefín dregur í sig fitu.', en: 'Olefin absorbs oil.' } },
  { material: { is: 'Gólfteppi', en: 'Fitted carpet' }, construction: 'looppile', method: 'hot',
    limit: { is: 'Límt bak þolir minna vatn en ofið.', en: 'A glued backing takes less water than a woven one.' } },

  { material: { is: 'Ull', en: 'Wool' }, construction: 'twill', method: 'neutral',
    limit: { is: 'Hleypur og þæfist ef hún mettast.', en: 'Shrinks and felts if saturated.' } },

  { material: { is: 'Silki', en: 'Silk' }, construction: 'plain', method: 'minimum',
    limit: { is: 'Vatn skilur eftir hring. Þolir ekki alkalí.', en: 'Water leaves a ring. Alkali is not tolerated.' } },
  { material: { is: 'Viskósa', en: 'Viscose' }, construction: 'plain', method: 'minimum',
    limit: { is: 'Veikist blaut og harðnar við þurrk.', en: 'Weakens when wet, stiffens as it dries.' } },
  { material: { is: 'Hör', en: 'Linen' }, construction: 'plain', method: 'minimum',
    limit: { is: 'Krumpast og fær hringi.', en: 'Creases and rings.' } },

  { material: { is: 'Júta og sísal', en: 'Jute and sisal' }, construction: 'looppile', method: 'neardry',
    limit: { is: 'Gulna í vatni og aflagast.', en: 'Yellow in water and lose their shape.' } },

  { material: { is: 'Flauel', en: 'Velvet' }, construction: 'cutpile', method: 'brush',
    limit: { is: 'Lóin leggst. För geta orðið varanleg.', en: 'The pile crushes. Marks can be permanent.' } },

  { material: { is: 'Handhnýtt teppi', en: 'Hand-knotted rug' }, construction: 'knotted', method: 'own',
    limit: { is: 'Litir geta runnið. Prófað fyrst.', en: 'Dyes can bleed. Tested first.' } },
  { material: { is: 'Gæra og leður', en: 'Sheepskin and leather' }, construction: 'hide', method: 'own',
    limit: { is: 'Skinnið harðnar sé það ofvætt.', en: 'The hide hardens if over-wetted.' } },
];

export const FIBRE_OPEN = {
  material: { is: 'Þitt efni', en: 'Your material' },
  action: { is: 'Sendu mynd — við greinum það', en: 'Send a photo — we identify it' },
  limit: { is: 'Óþekkt.', en: 'Unknown.' },
} satisfies { material: Bi; action: Bi; limit: Bi };

/* ------------------------------------------------------------------ *
 * The care label
 * ------------------------------------------------------------------ */

export const CARE_CODES: { code: string; meaning: Bi }[] = [
  { code: 'W',  meaning: { is: 'Vatnsbundin hreinsun leyfð. Úðaútdráttur á við.', en: 'Water-based cleaning permitted. Extraction applies.' } },
  { code: 'S',  meaning: { is: 'Aðeins leysiefni. Vatn skilur eftir hringi.', en: 'Solvent only. Water leaves rings.' } },
  { code: 'WS', meaning: { is: 'Hvort tveggja leyft. Við veljum eftir blettinum.', en: 'Both permitted. We choose by the stain.' } },
  { code: 'X',  meaning: { is: 'Aðeins ryksuga. Enginn vökvi. Þá vinnum við þurrt.', en: 'Vacuum only. No liquid. Then we work dry.' } },
];

/* ------------------------------------------------------------------ *
 * What we do not do — each refusal answered on the same row
 * ------------------------------------------------------------------ */

/**
 * Every refusal carries its "instead".
 *
 * Four bare negatives read as four apologies. The same four with an answer
 * beside each read as a method — which is the difference between sounding
 * limited and sounding exacting, and it is the whole reason this section can
 * sit on the page at all.
 */
export const REFUSALS: { no: Bi; instead: Bi }[] = [
  {
    no: { is: 'Við hreinsum ekki leður með úðaútdrætti.', en: 'We do not clean leather with extraction.' },
    instead: {
      is: 'Leður fær sína eigin vöru og aðferð, og gæra er metin sérstaklega áður en nokkuð er borið á.',
      en: 'Leather gets its own product and method, and sheepskin is assessed on its own before anything is applied.',
    },
  },
  {
    no: { is: 'Við mettum ekki viskósu.', en: 'We do not saturate viscose.' },
    instead: {
      is: 'Viskósa fær lágmarksvætu og lengri þurrkun. Það tekur lengri tíma og skilar efninu heilu.',
      en: 'Viscose gets minimum moisture and a longer dry. It takes longer and the fabric survives it.',
    },
  },
  {
    no: { is: 'Við gefum ekkert verð í dyrunum.', en: 'We name no price at the door.' },
    instead: {
      is: 'Verðið er staðfest af myndum áður en við leggjum af stað. Þú tekur enga ákvörðun með einhvern standandi í forstofunni.',
      en: 'The price is confirmed from photographs before anyone sets off. You make no decision with someone standing in your hallway.',
    },
  },
  {
    no: { is: 'Við tökum ekkert með okkur.', en: 'We take nothing away.' },
    instead: {
      is: 'Verkið er unnið heima hjá þér, með okkar búnaði. Sófinn fer hvergi og þú færð hann aftur samdægurs.',
      en: 'The work is done in your home, with our equipment. The sofa goes nowhere and you have it back the same day.',
    },
  },
];

/* ------------------------------------------------------------------ *
 * Copy that belongs to this page alone
 * ------------------------------------------------------------------ */

export const HOME_COPY: Record<Locale, {
  eyebrow: string;
  title: string;
  lead: string;
  note: string;
  seeRegister: string;
  stainEyebrow: string; stainTitle: string; stainLead: string;
  headStain: string; headOutcome: string; headNote: string;
  dryHead: string; dryBody: string;
  labelTitle: string; labelLead: string; labelClosing: string;
  refuseTitle: string; refuseInstead: string; refuseClosing: string;
  fibreEyebrow: string; fibreTitle: string; fibreLead: string;
  headMaterial: string; headForm: string; headMethod: string; headLimit: string;
  constructionsLabel: string;
}> = {
  is: {
    eyebrow: 'Sófar · Teppi · Gólfteppi — höfuðborgarsvæðið',
    title: 'Flest fer úr. Efnið ræður hvernig.',
    lead: 'Kaffi, rauðvín, fita og gæludýr — flest af þessu fer. Hitt segjum við þér strax. Við greinum efnið, prófum litheldni á földum stað og veljum aðferðina eftir því hvað trefjan þolir.',
    note: 'Sendu eina mynd af blettinum og aðra af merkimiðanum undir sessunni. Við metum verkið og staðfestum verðið áður en við leggjum af stað.',
    seeRegister: 'Sjá hvað fer úr og hvað ekki',

    stainEyebrow: 'Blettaskrá',
    stainTitle: 'Fer þetta úr?',
    stainLead: 'Þetta er það sem við sjáum oftast og hvernig það fer að jafnaði. Aldur og ástand breyta smáatriðunum — sjaldnar niðurstöðunni.',
    headStain: 'Blettur', headOutcome: 'Niðurstaða', headNote: 'Athugasemd',

    dryHead: 'Þurrktími',
    dryBody: 'Sófi: hægt að setjast í hann sama kvöld, að jafnaði fjórum til sex klukkustundum eftir að við förum. Teppi og gólfteppi: sex til tólf klukkustundir. Við skiljum eftir aukaútdrátt, ekki aukavatn — frá október til apríl er lítið loftræst á Íslandi, og það sem þornar ekki, lyktar.',

    labelTitle: 'Merkimiðinn undir sessunni.',
    labelLead: 'Á flestum sófum er miði með einum staf. Hann ræður öllu sem á eftir kemur — og það tekur hálfa mínútu að finna hann.',
    labelClosing: 'Finnurðu hann ekki? Það er algengt. Sendu þá nærmynd af efninu í dagsbirtu, eins nálægt og síminn nær skýrt — við greinum það af myndinni.',

    refuseTitle: 'Þetta gerum við ekki.',
    refuseInstead: 'Í staðinn',
    refuseClosing: 'Fagmennskan er ekki að geta allt. Hún er að vita hvar mörkin liggja — og segja það áður en byrjað er.',

    fibreEyebrow: 'Efnisskrá',
    fibreTitle: 'Það sem ræður aðferðinni.',
    fibreLead: 'Það sem hentar sterkri bómull á ekki við um viskósu. Hér er efnið, byggingin, aðferðin sem við notum — og það sem hún má ekki fara yfir.',
    headMaterial: 'Efni', headForm: 'Gerð', headMethod: 'Aðferð', headLimit: 'Mörk',

    constructionsLabel: 'Vefnaður og bygging — sex gerðir',
  },
  en: {
    eyebrow: 'Sofas · Rugs · Carpets — capital region',
    title: 'Most of it comes out. The material decides how.',
    lead: 'Coffee, red wine, grease, pets — most of it comes out. The rest we tell you straight away. We identify the material, test colourfastness in a hidden place, and choose the method by what the fibre can take.',
    note: 'Send one photo of the stain and one of the care label under the cushion. We assess the work and confirm the price before anyone sets off.',
    seeRegister: 'See what comes out and what does not',

    stainEyebrow: 'Stain register',
    stainTitle: 'Will it come out?',
    stainLead: 'This is what we see most often and how it usually goes. Age and condition change the details — rarely the outcome.',
    headStain: 'Stain', headOutcome: 'Outcome', headNote: 'Note',

    dryHead: 'Drying time',
    dryBody: 'Sofa: you can sit on it the same evening, typically four to six hours after we leave. Rugs and fitted carpet: six to twelve hours. We leave extra extraction, not extra water — from October to April there is little ventilation in Iceland, and what does not dry, smells.',

    labelTitle: 'The label under the cushion.',
    labelLead: 'On most sofas there is a label with a single letter. It decides everything that follows — and finding it takes half a minute.',
    labelClosing: 'Cannot find it? That is common. Send a close-up of the fabric in daylight, as close as your phone stays sharp — we identify it from the photo.',

    refuseTitle: 'What we do not do.',
    refuseInstead: 'Instead',
    refuseClosing: 'Craft is not being able to do everything. It is knowing where the limits are — and saying so before starting.',

    fibreEyebrow: 'Fibre register',
    fibreTitle: 'What decides the method.',
    fibreLead: 'What suits strong cotton does not apply to viscose. Here is the material, the construction, the method we use — and what it must not exceed.',
    headMaterial: 'Material', headForm: 'Construction', headMethod: 'Method', headLimit: 'Limit',

    constructionsLabel: 'Weave and construction — six types',
  },
};
