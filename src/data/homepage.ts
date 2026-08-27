import type { Locale } from '~/config/site';

/**
 * Homepage copy.
 *
 * Written against what somebody actually arrives with. They are on a phone, in
 * the evening, and they own a sofa or a rug they are slightly afraid of. In
 * order, the questions are:
 *
 *   1. Are you going to ruin it?
 *   2. Will the mark actually come out?
 *   3. Are you a real business or a man with a van?
 *   4. How do I start, and how little effort is that?
 *
 * So the hero answers (1) rather than announcing the company, the proof section
 * answers (2) with photographs rather than adjectives, the refusals answer (3)
 * — a business that names the work it turns down is the one you believe — and
 * every section ends within reach of the same two actions.
 *
 * What is deliberately NOT here: superlatives, "premium", "quality guaranteed",
 * star ratings, invented testimonials, and any number the business has not
 * earned. On this kind of page a specific admission outsells a general claim.
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

/** The four steps, kept to one line each — a process that needs a paragraph
    per step is a process the visitor will assume is a hassle. */
export const STEPS: Step[] = [
  {
    n: '01',
    title: { is: 'Þú sendir mynd', en: 'You send a photo' },
    body: {
      is: 'Ein mynd á WhatsApp segir okkur oftast bæði efnið og hvað þarf. Ekkert eyðublað nauðsynlegt.',
      en: 'One photo on WhatsApp usually tells us both the material and what it needs. No form required.',
    },
  },
  {
    n: '02',
    title: { is: 'Við svörum með verði', en: 'We answer with a price' },
    body: {
      is: 'Fast verð og tími sem hentar. Ef við teljum verkið óráðlegt segjum við það strax.',
      en: 'A fixed price and a time that suits. If we think the job is unwise we say so straight away.',
    },
  },
  {
    n: '03',
    title: { is: 'Við komum til þín', en: 'We come to you' },
    body: {
      is: 'Efnið er prófað á földum stað áður en nokkuð er borið á. Þá fyrst er byrjað.',
      en: 'The material is tested somewhere hidden before anything is applied. Only then do we start.',
    },
  },
  {
    n: '04',
    title: { is: 'Þú sest aftur niður', en: 'You sit back down' },
    body: {
      is: 'Sófi er þurr á fjórum til sex tímum, ull lengur. Við segjum þér nákvæmlega hvenær.',
      en: 'A sofa is dry in four to six hours, wool longer. We tell you exactly when.',
    },
  },
];

/**
 * The three assurances under the hero.
 *
 * Each is checkable. "Insured and registered" with the company number beside it
 * is a fact somebody can verify in a minute; "fully insured for your peace of
 * mind" is a sentence anybody can type.
 */
export const ASSURANCES: { title: Bi; body: Bi }[] = [
  {
    title: { is: 'Prófað fyrst', en: 'Tested first' },
    body: {
      is: 'Hvert efni er prófað á földum stað. Við höfum aldrei byrjað verk án þess.',
      en: 'Every material is tested somewhere hidden. We have never started a job without it.',
    },
  },
  {
    title: { is: 'Fast verð', en: 'A fixed price' },
    body: {
      is: 'Verðið sem við sendum er verðið sem þú borgar. Engin viðbót eftir á.',
      en: 'The price we send is the price you pay. Nothing added afterwards.',
    },
  },
  {
    title: { is: 'Skráð fyrirtæki', en: 'A registered company' },
    body: {
      is: 'Studio Esja ehf., kt. 630226-0580. Reikningur fylgir hverju verki.',
      en: 'Studio Esja ehf., reg. 630226-0580. An invoice comes with every job.',
    },
  },
];

export const HOME: Record<Locale, {
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroPrimary: string;
  heroSecondary: string;
  heroPrompt: string;

  proofEyebrow: string;
  proofTitle: string;
  proofLead: string;
  proofEmpty: string;
  proofCta: string;

  fieldsEyebrow: string;
  fieldsTitle: string;
  fieldsLead: string;

  stainEyebrow: string;
  stainTitle: string;
  stainLead: string;

  careEyebrow: string;
  careTitle: string;
  careLead: string;
  careCta: string;

  refuseEyebrow: string;
  refuseTitle: string;
  refuseLead: string;
  refuseInstead: string;

  stepsEyebrow: string;
  stepsTitle: string;

  areasEyebrow: string;
  areasTitle: string;
  areasLead: string;
  areasCta: string;
}> = {
  is: {
    /* The hero answers the fear, not the brand. The company name is in the
       header already; saying it again here spends the largest type on the
       page on something the visitor did not ask. */
    heroEyebrow: 'Sérhæfð djúphreinsun · Höfuðborgarsvæðið',
    heroTitle: 'Við prófum efnið áður en nokkuð snertir það.',
    heroLead:
      'Sófar, teppi og gólfteppi. Ull, silki og viskósa fá hvert sína aðferð — því sama aðferð á allt er þannig sem efni eyðileggjast.',
    heroPrimary: 'Fá tilboð',
    heroSecondary: 'Senda mynd á WhatsApp',
    heroPrompt: 'Svar samdægurs alla virka daga',

    proofEyebrow: 'Áður og eftir',
    proofTitle: 'Verkin tala fyrir sig.',
    proofLead:
      'Sömu mynd, sama ljós, sama sjónarhorn. Ekkert lagað eftir á — það sæist hvort eð er.',
    proofEmpty:
      'Myndir úr nýlegum verkum koma hér. Þangað til: sendu okkur mynd af þínu og við segjum þér hverju má búast við.',
    proofCta: 'Sjá fleiri verk',

    fieldsEyebrow: 'Þjónusta',
    fieldsTitle: 'Hvað við hreinsum.',
    fieldsLead: 'Fjögur svið, hvert með sinni aðferð og sínum mörkum.',

    stainEyebrow: 'Blettir',
    stainTitle: 'Fer bletturinn úr?',
    stainLead:
      'Stundum já, stundum að hluta, stundum ekki. Hér er hvað við vitum áður en við komum — svo þú vitir það líka.',

    careEyebrow: 'Efnin',
    careTitle: 'Efnið ræður aðferðinni.',
    careLead:
      'Það sem hentar sterkri bómull á ekki við um viskósu. Við lesum merkimiðann, prófum efnið og veljum aðferð eftir því — ekki eftir því hvað er fljótlegast.',
    careCta: 'Sjá ferlið',

    refuseEyebrow: 'Mörkin',
    refuseTitle: 'Það sem við gerum ekki.',
    refuseLead:
      'Verk sem við teljum líklegt til að skemma efnið tökum við ekki að okkur. Það er styttri listi en hann lítur út fyrir að vera — en hann er raunverulegur.',
    refuseInstead: 'Í staðinn',

    stepsEyebrow: 'Ferlið',
    stepsTitle: 'Fjögur skref, ekkert vesen.',

    areasEyebrow: 'Svæði',
    areasTitle: 'Við keyrum um höfuðborgarsvæðið.',
    areasLead: 'Ekkert aukagjald innan svæðisins.',
    areasCta: 'Sjá öll svæði',
  },

  en: {
    heroEyebrow: 'Specialist deep cleaning · Greater Reykjavík',
    heroTitle: 'We test the fabric before anything touches it.',
    heroLead:
      'Sofas, rugs and carpets. Wool, silk and viscose each get their own method — because one method for everything is how fabrics get ruined.',
    heroPrimary: 'Request a quote',
    heroSecondary: 'Send a photo on WhatsApp',
    heroPrompt: 'Same-day reply every working day',

    proofEyebrow: 'Before and after',
    proofTitle: 'The work speaks for itself.',
    proofLead:
      'Same frame, same light, same angle. Nothing corrected afterwards — it would show anyway.',
    proofEmpty:
      'Photographs from recent work go here. Until then: send us a photo of yours and we will tell you what to expect.',
    proofCta: 'See more work',

    fieldsEyebrow: 'Services',
    fieldsTitle: 'What we clean.',
    fieldsLead: 'Four fields, each with its own method and its own limits.',

    stainEyebrow: 'Stains',
    stainTitle: 'Will the stain come out?',
    stainLead:
      'Sometimes yes, sometimes partly, sometimes no. Here is what we know before we arrive — so that you know it too.',

    careEyebrow: 'Materials',
    careTitle: 'The material decides the method.',
    careLead:
      'What suits robust cotton does not apply to viscose. We read the label, test the fabric and choose accordingly — not according to what is quickest.',
    careCta: 'See the process',

    refuseEyebrow: 'Limits',
    refuseTitle: 'What we will not do.',
    refuseLead:
      'Work we believe is likely to damage the material, we turn down. It is a shorter list than it looks — but it is a real one.',
    refuseInstead: 'Instead',

    stepsEyebrow: 'How it works',
    stepsTitle: 'Four steps, no fuss.',

    areasEyebrow: 'Areas',
    areasTitle: 'We drive the capital area.',
    areasLead: 'No travel charge inside it.',
    areasCta: 'See all areas',
  },
};
