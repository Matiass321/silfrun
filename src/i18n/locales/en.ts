import type { is } from './is';

/**
 * English — a translation of the Icelandic dictionary.
 *
 * Typed against `typeof is`, so a key added to Icelandic and forgotten here is
 * a build error rather than a missing string discovered in production.
 *
 * British spelling throughout (odour, fibre, colour), which is what the
 * expat and short-let market in Reykjavík reads.
 */
export const en: typeof is = {
  nav: {
    services: 'Services',
    process: 'How it works',
    work: 'Our work',
    areas: 'Service areas',
    about: 'About',
    contact: 'Contact',
    quote: 'Request a quote',
    prices: 'Prices',
    menu: 'Menu',
    close: 'Close',
    skip: 'Skip to content',
    home: 'Silfrun — home',
    language: 'Language',
  },

  meta: {
    home: {
      title: 'Specialist sofa and rug cleaning',
      description:
        'Silfrun specialises in deep cleaning sofas, upholstery, rugs and fitted carpets across the Reykjavík capital area. Every material assessed before anything is applied.',
    },
  },

  hero: {
    eyebrow: 'Specialist upholstery and rug care',
    title: 'Care for furniture meant to last.',
    lead: 'Deep cleaning for sofas, upholstery, rugs and fitted carpets. We assess the material before anything is applied — and tell you what to expect before we start.',
    ctaPrimary: 'Request a quote',
    ctaSecondary: 'See the services',
    note: 'Send two or three photographs and your location. We assess the work and confirm the price before the visit.',
  },

  trust: {
    equipmentTitle: 'Professional equipment',
    equipmentBody: 'Hot-water extraction machines with controlled heat and suction — not a household vacuum.',
    onSiteTitle: 'We work in your home',
    onSiteBody: 'We bring the equipment to you. Nothing has to be moved out.',
    materialTitle: 'Treated to suit the material',
    materialBody: 'We check the care label, the fibre and the colourfastness before anything is applied.',
  },

  services: {
    eyebrow: 'Services',
    title: 'What we clean.',
    lead: 'Every material is assessed before it is treated. What works on a durable cotton is not what goes on velvet or viscose.',
    cta: 'See all services',
    sofa: { name: 'Sofas and upholstery', body: 'Deep extraction cleaning for sofas, armchairs and dining chairs.' },
    rug: { name: 'Rugs', body: 'Wool, silk, plant fibres and synthetics — treated according to construction.' },
    carpet: { name: 'Fitted carpet', body: 'Fitted carpet in homes and commercial interiors.' },
    stains: { name: 'Stains and odours', body: 'Coffee, red wine, pets and persistent odours.' },
  },

  process: {
    eyebrow: 'How it works',
    title: 'Four steps.',
    steps: [
      { title: 'Send photographs', body: 'Two or three photographs of the piece, and your location.' },
      { title: 'Get an assessment', body: 'We tell you what can be done and what it will cost.' },
      { title: 'We clean', body: 'We arrive with the equipment and work on site.' },
      { title: 'Enjoy it again', body: 'We explain the drying time and how best to keep the result.' },
    ],
  },

  why: {
    eyebrow: 'Why Silfrun',
    title: 'Care for the things worth keeping.',
    lead: 'Competence shows in the work, not in the adjectives.',
    points: [
      { title: 'We assess before we clean', body: 'Care label, fibre and colourfastness are tested in a hidden area before anything is applied.' },
      { title: 'Professional equipment', body: 'Extraction machines with controlled heat and suction, maintained and kept clean.' },
      { title: 'We tell you what is possible', body: 'If a stain will not come out completely, we say so beforehand — not afterwards.' },
      { title: 'Price agreed in advance', body: 'We assess from photographs and confirm the price before we arrive.' },
    ],
  },

  work: {
    eyebrow: 'Our work',
    title: 'See the difference.',
    lead: 'Real jobs, photographed before and after in the same light and the same frame.',
    cta: 'See more work',
    pending: 'Photographs of real jobs will appear here once they have been taken.',
  },

  reviews: {
    eyebrow: 'Reviews',
    title: 'What clients say.',
    pending: 'Genuine reviews will be published here once they have been verified.',
  },

  areas: {
    eyebrow: 'Service areas',
    title: 'Where we work.',
    lead: 'We serve the Reykjavík capital area. If your area is not listed, get in touch.',
    cta: 'See all areas',
    inArea: 'Upholstery and rug cleaning in',
  },

  finalCta: {
    title: 'Something that needs cleaning?',
    body: 'Send us a few photographs and we will tell you the best next step.',
    cta: 'Request a quote',
  },

  footer: {
    tagline: 'Specialist upholstery and rug care across the Reykjavík capital area.',
    servicesHeading: 'Services',
    companyHeading: 'Company',
    legalHeading: 'Legal',
    rights: 'All rights reserved.',
    kennitalaLabel: 'Reg. no.',
  },

  prices: {
    eyebrow: "Prices",
    title: "Price list.",
    lead: "Starting prices, VAT included. The final figure is confirmed from photographs before we come, because condition genuinely changes the work.",
    fromLabel: "from",
    perM2: "per m²",
    minQty: "minimum {n}",
    minimumTitle: "Minimum charge",
    minimumBody: "Every visit carries a minimum charge. If you have more than one piece, it is worth taking them in the same visit.",
    vatNote: "All prices include VAT.",
    cta: "Get a confirmed price",
    items: {
      sofa2: "Two-seat sofa",
      sofa3: "Three-seat sofa",
      sofaCorner: "Corner or chaise sofa",
      armchair: "Armchair",
      diningChair: "Dining chair",
      rug: "Rug",
      carpet: "Fitted carpet",
      odour: "Stain and odour treatment",
    },
  },

  pending: {
    legalName: 'Registered company name pending',
    kennitala: 'Company registration number pending',
    phone: 'Phone number pending',
    email: 'Email address pending',
    address: 'Street address pending',
    whatsapp: 'WhatsApp number pending',
    messenger: 'Messenger pending',
  },

  /**
   * Messaging channels.
   *
   * The prefilled text starts the conversation for the visitor — an empty
   * message box is friction, and people abandon rather than work out what to
   * write. It mentions photographs immediately, because the assessment
   * depends on them.
   */
  contact: {
    whatsappLabel: 'Message us on WhatsApp',
    whatsappShort: 'WhatsApp',
    messengerLabel: 'Message us on Messenger',
    messengerShort: 'Messenger',
    callLabel: 'Call',
    emailLabel: 'Send an email',
    channelsTitle: 'Reach us whichever way suits you',
    channelsLead: 'Same-day reply on working days. Send photographs and we will assess the work.',
    replyNote: 'We normally reply within one working day.',
    prefillGeneral: 'Hello Silfrun. I would like an assessment for cleaning.',
    prefillQuote: 'Hello Silfrun. I have photographs of a piece that needs cleaning and would like a price.',
    prefillService: 'Hello Silfrun. I would like to ask about {service}.',
    prefillArea: 'Hello Silfrun. I am in {area} and would like an assessment.',
    stickyPrompt: 'Get your piece assessed',
  },

  common: {
    pendingData: 'details pending',
    phone: 'Phone',
    email: 'Email',
    hours: 'Opening hours',
    weekdays: 'Monday to Friday',
  },
};
