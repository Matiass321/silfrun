import type { Locale } from '~/config/site';

/**
 * Homepage copy.
 *
 * Written against what somebody actually arrives with. They are on a phone, in
 * the evening, and they own a sofa or a rug they are slightly afraid of. In
 * order, the questions are: are you going to ruin it, will the mark come out,
 * are you a real business, and how little effort is it to start.
 *
 * Deliberately SHORT. The first version answered all of that and then kept
 * talking — an eyebrow, a heading and a lead paragraph on every section, plus
 * a ten-row stain table, which is a brochure rather than a page. Restraint is
 * most of what reads as expensive: a heading that needs a paragraph under it
 * to explain itself is the wrong heading, and the full registers belong on the
 * pages devoted to them, one click away.
 *
 * Also absent, permanently: superlatives, "premium", star ratings, invented
 * testimonials, and any number the business has not earned.
 */

type Bi = Record<Locale, string>;

export interface Step { n: string; title: Bi; body: Bi }
export interface Field { key: 'sofa' | 'rug' | 'carpet' | 'stains'; slot: string }

export const FIELDS: Field[] = [
  { key: 'sofa', slot: 'sofa' },
  { key: 'rug', slot: 'rug' },
  { key: 'carpet', slot: 'carpet' },
  { key: 'stains', slot: 'stains' },
];

/** One line each. A four-step process that needs a paragraph per step reads
    as a process the visitor will assume is a hassle. */
export const STEPS: Step[] = [
  {
    n: '01',
    title: { is: 'Þú sendir mynd', en: 'You send a photo' },
    body: { is: 'Ein mynd segir okkur oftast efnið.', en: 'One photo usually tells us the material.' },
  },
  {
    n: '02',
    title: { is: 'Við svörum með verði', en: 'We answer with a price' },
    body: { is: 'Fast verð og tími sem hentar.', en: 'A fixed price and a time that suits.' },
  },
  {
    n: '03',
    title: { is: 'Við komum til þín', en: 'We come to you' },
    body: { is: 'Efnið prófað áður en byrjað er.', en: 'The material is tested before we start.' },
  },
  {
    n: '04',
    title: { is: 'Þú sest aftur niður', en: 'You sit back down' },
    body: { is: 'Sófi þurr á fjórum til sex tímum.', en: 'A sofa is dry in four to six hours.' },
  },
];

/**
 * Three assurances, one line each.
 *
 * Each is checkable — a company number can be looked up in a minute, where
 * "fully insured for your peace of mind" is a sentence anybody can type.
 */
export const ASSURANCES: { title: Bi; body: Bi }[] = [
  {
    title: { is: 'Prófað fyrst', en: 'Tested first' },
    body: { is: 'Hvert efni prófað á földum stað.', en: 'Every material tested somewhere hidden.' },
  },
  {
    title: { is: 'Fast verð', en: 'A fixed price' },
    body: { is: 'Ekkert bætist við eftir á.', en: 'Nothing is added afterwards.' },
  },
  {
    title: { is: 'Skráð fyrirtæki', en: 'A registered company' },
    body: { is: 'Studio Esja ehf. · kt. 630226-0580', en: 'Studio Esja ehf. · reg. 630226-0580' },
  },
];

/**
 * Three refusals, and nothing else.
 *
 * There were four, each with the thing done instead — twelve blocks of text
 * arguing a point three lines can make. A business that names work it turns
 * down is believable; a business that explains each refusal at length sounds
 * like it is apologising.
 */
export const LIMITS: Bi[] = [
  { is: 'Við hreinsum ekki leður með úðaútdrætti.', en: 'We do not clean leather with extraction.' },
  { is: 'Við mettum ekki viskósu.', en: 'We do not saturate viscose.' },
  { is: 'Við lofum ekki að ná öllum blettum.', en: 'We do not promise every stain will go.' },
];

export const HOME: Record<Locale, {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroPrimary: string;
  heroSecondary: string;

  proofTitle: string;
  proofEmpty: string;
  proofCta: string;

  fieldsTitle: string;

  careTitle: string;
  careLead: string;
  careCta: string;

  limitsTitle: string;
  limitsCta: string;

  stepsTitle: string;

  areasTitle: string;
  areasCta: string;
}> = {
  is: {
    heroEyebrow: 'Höfuðborgarsvæðið',
    heroTitle: 'Við prófum efnið áður en nokkuð snertir það.',
    heroLead: 'Sófar, teppi og gólfteppi.',
    heroPrimary: 'Fá tilboð',
    heroSecondary: 'Senda mynd',

    proofTitle: 'Verkin.',
    proofEmpty: 'Myndir úr nýlegum verkum koma hér.',
    proofCta: 'Sjá fleiri verk',

    fieldsTitle: 'Hvað við hreinsum.',

    careTitle: 'Efnið ræður aðferðinni.',
    careLead: 'Ull, silki og viskósa fá hvert sína aðferð. Við lesum merkimiðann og prófum efnið.',
    careCta: 'Sjá ferlið',

    limitsTitle: 'Það sem við gerum ekki.',
    limitsCta: 'Fer bletturinn úr?',

    stepsTitle: 'Fjögur skref.',

    areasTitle: 'Höfuðborgarsvæðið.',
    areasCta: 'Sjá öll svæði',
  },

  en: {
    heroEyebrow: 'Greater Reykjavík',
    heroTitle: 'We test the fabric before anything touches it.',
    heroLead: 'Sofas, rugs and carpets.',
    heroPrimary: 'Request a quote',
    heroSecondary: 'Send a photo',

    proofTitle: 'The work.',
    proofEmpty: 'Photographs from recent work go here.',
    proofCta: 'See more work',

    fieldsTitle: 'What we clean.',

    careTitle: 'The material decides the method.',
    careLead: 'Wool, silk and viscose each get their own. We read the label and test the fabric.',
    careCta: 'See the process',

    limitsTitle: 'What we will not do.',
    limitsCta: 'Will the stain come out?',

    stepsTitle: 'Four steps.',

    areasTitle: 'The capital area.',
    areasCta: 'See all areas',
  },
};
