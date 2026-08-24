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
    menu: 'Menu',
    close: 'Close',
    skip: 'Skip to content',
    language: 'Language',
  },

  meta: {
    home: {
      title: 'Specialist sofa and rug cleaning',
      description:
        'Silfrún specialises in deep cleaning sofas, upholstery, rugs and fitted carpets across the Reykjavík capital area. Every material assessed before anything is applied.',
    },
  },

  hero: {
    eyebrow: 'Specialist upholstery and rug care · Iceland',
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
    eyebrow: 'Why Silfrún',
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

  pending: {
    legalName: 'Registered company name pending',
    kennitala: 'Company registration number pending',
    phone: 'Phone number pending',
    email: 'Email address pending',
    address: 'Street address pending',
  },

  common: {
    pendingData: 'details pending',
    phone: 'Phone',
    email: 'Email',
    hours: 'Opening hours',
    weekdays: 'Monday to Friday',
  },
};
