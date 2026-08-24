import type { Locale } from '~/config/site';

/**
 * Content for the pages that are prose rather than service listings.
 *
 * The legal pages are drafted against Icelandic law — lög nr. 90/2018 um
 * persónuvernd og vinnslu persónuupplýsinga, which implements the GDPR, and
 * lög nr. 16/2016 um neytendasamninga — and are marked as awaiting review by
 * a lawyer. That marker is deliberate: a plausible-looking legal page that
 * nobody has checked is more dangerous than one that admits it is a draft.
 */

export interface FaqItem {
  q: string;
  /** null where the honest answer depends on company policy nobody has set. */
  a: string | null;
}

export interface Section {
  heading: string;
  paragraphs: string[];
  /** Optional bullet list rendered after the paragraphs. */
  points?: string[];
}

export interface ProsePage {
  lead: string;
  sections: Section[];
}

export interface LocaleContent {
  faq: { heading: string; items: FaqItem[] }[];
  process: ProsePage;
  results: ProsePage;
  about: ProsePage;
  privacy: ProsePage;
  terms: ProsePage;
  legalDraftNotice: string;
  legalUpdatedLabel: string;
}

/** Single source for the date shown on the legal pages. */
export const LEGAL_UPDATED = '2026-08-24';

export const CONTENT: Record<Locale, LocaleContent> = {
  is: {
    faq: [
      {
        heading: 'Um hreinsunina',
        items: [
          { q: 'Hversu lengi er sófi eða teppi að þorna?', a: 'Það ræðst af efninu, þykkt bólstrunar eða flos og hvernig loftar um rýmið. Aukaútdráttur styttir tímann verulega. Yfir veturinn, þegar lítið er loftræst, tekur þetta lengri tíma en að sumri. Við gefum áætlun fyrir þitt tilvik áður en við förum og bendum á hvernig má flýta fyrir.' },
          { q: 'Fara allir blettir?', a: 'Nei, og það er rétt að segja það skýrt. Sumir blettir hafa litað trefjarnar varanlega — sérstaklega tannín úr rauðvíni og kaffi á ljósum náttúruefnum. Heimilisvörur sem bornar hafa verið á áður geta einnig hafa fest blettinn. Við metum eftir myndum og segjum hvað við teljum raunhæft áður en byrjað er.' },
          { q: 'Komið þið heim til mín?', a: 'Já. Við vinnum á staðnum með búnaðinn og engin húsgögn þarf að flytja. Við þurfum aðgang að rafmagni og nægilegt pláss til að vinna í kringum stykkið.' },
          { q: 'Getið þið hreinsað viðkvæm efni?', a: 'Oft já, en það ræðst af efninu. Viskósa, silki og jurtatrefjar þola takmarkaðan raka og eru unnin nánast þurr. Við prófum alltaf litheldni á stað sem ekki sést áður en nokkuð er borið á, og segjum frá því ef við teljum stykki betur komið í annarri meðferð.' },
          { q: 'Þarf ég að undirbúa eitthvað?', a: 'Taktu persónulega muni og skrautpúða sem ekki á að hreinsa af stykkinu og skildu eftir pláss í kringum það. Þú þarft ekki að ryksuga fyrir — það er hluti af verkinu. Hafir þú borið eitthvað á blett, láttu okkur vita hvað það var.' },
          { q: 'Notið þið efni sem eru örugg fyrir börn og gæludýr?', a: null },
        ],
      },
      {
        heading: 'Bókun og verð',
        items: [
          { q: 'Hvað kostar hreinsunin?', a: null },
          { q: 'Hvernig fæ ég verð?', a: 'Sendu okkur tvær til þrjár myndir af stykkinu og staðsetninguna þína. Út frá því metum við umfangið og staðfestum verð áður en við komum. Endanlegt verð getur breyst ef ástandið reynist annað en myndirnar sýndu, en þá segjum við frá því áður en byrjað er.' },
          { q: 'Hvaða svæði þjónustið þið?', a: 'Reykjavík, Kópavog, Garðabæ, Hafnarfjörð, Seltjarnarnes og Mosfellsbæ. Sé staðurinn þinn ekki á listanum, hafðu samband — við segjum þér hreinskilnislega hvort við komumst.' },
          { q: 'Hversu langan fyrirvara þarf?', a: null },
          { q: 'Hvernig er greitt?', a: null },
          { q: 'Hvað ef ég þarf að afbóka?', a: null },
        ],
      },
    ],

    process: {
      lead: 'Frá fyrstu myndum að þurru áklæði — hvernig verkið gengur fyrir sig og hvers vegna hvert skref er eins og það er.',
      sections: [
        {
          heading: 'Af hverju við byrjum á myndum',
          paragraphs: [
            'Tvær eða þrjár myndir segja okkur meira en löng lýsing. Af þeim sjáum við gerð stykkisins, hvernig efnið liggur, hvar álagið er mest og hversu umfangsmikið verkið er. Það gerir okkur kleift að meta verðið áður en við komum í stað þess að standa í stofunni hjá þér og nefna tölu.',
            'Sé eitthvað óljóst biðjum við um mynd af merkimiðanum. Hann segir til um hvaða meðferð efnið þolir og er oftast falinn undir sessunni eða á neðri brún áklæðisins.',
          ],
        },
        {
          heading: 'Matið á staðnum',
          paragraphs: [
            'Áður en nokkuð er borið á skoðum við merkinguna, þreifum á trefjunum og prófum litheldni á stað sem ekki sést. Þetta tekur nokkrar mínútur og ræður öllu sem á eftir kemur: hvaða efni má nota, í hvaða styrk og hversu mikinn raka stykkið þolir.',
            'Komi í ljós að ástandið sé annað en myndirnar sýndu segjum við frá því strax og áður en vinna hefst — ekki eftir á.',
          ],
        },
        {
          heading: 'Hreinsunin sjálf',
          paragraphs: [
            'Fyrst eru laus óhreinindi fjarlægð þurr. Þetta er ekki formsatriði: sandur og möl sem eftir sitja breytast í leðju um leið og vökvi kemur nærri, og skera trefjarnar í leiðinni.',
            'Því næst er hreinsilausn úðað ofan í trefjarnar og strax dregin upp aftur ásamt óhreinindunum. Farið er hóflega í raka og frekar tvisvar yfir en einu sinni of blautt. Að lokum eru gerðar aukaferðir án lausnar til að draga út eins mikinn raka og hægt er.',
          ],
        },
        {
          heading: 'Áður en við förum',
          paragraphs: [
            'Við segjum þér hversu lengi við teljum að stykkið sé að þorna og hvernig má flýta fyrir með loftræstingu. Við bendum líka á hvað varð eftir, sé eitthvað sem ekki náðist, svo þú vitir af því frá okkur en ekki þegar þú uppgötvar það sjálf eða sjálfur.',
          ],
        },
      ],
    },

    results: {
      lead: 'Raunveruleg verk, mynduð fyrir og eftir í sömu birtu og sama ramma.',
      sections: [
        {
          heading: 'Hvernig myndirnar verða teknar',
          paragraphs: [
            'Fyrir- og eftirmynd sem eru teknar í ólíkri birtu, úr ólíku horni eða með ólíkri stillingu segja ekkert. Munurinn sem sést er þá myndavélin, ekki verkið.',
            'Þess vegna verða myndirnar hér teknar úr sömu stöðu, í sömu birtu og með sömu stillingum, með myndavélina fasta. Það er hægari aðferð og sýnir minni mun en hægt væri að sviðsetja — en það sem hún sýnir er satt.',
            'Engar myndir héðan af netinu og engar sviðsettar myndir. Þangað til raunveruleg verk hafa verið mynduð stendur þessi síða tóm frekar en að fylla hana af myndum af einhverju öðru.',
          ],
        },
      ],
    },

    about: {
      lead: 'Sérhæfing í umhirðu áklæða og textíls á höfuðborgarsvæðinu.',
      sections: [
        {
          heading: 'Hvernig við vinnum',
          paragraphs: [
            'Silfrún sérhæfir sig í einu: að hreinsa textíl án þess að skemma hann. Það hljómar einfalt en er það ekki, því flest tjón á áklæði og teppum verður ekki af óhreinindum heldur af rangri meðferð — of miklu vatni, röngu sýrustigi eða efni sem prófað var í fyrsta sinn á sýnilegum stað.',
            'Þess vegna byrjar hvert verk á mati og hverju mati lýkur á hreinskilinni umsögn. Ef við teljum að stykki sé betur komið í annarri meðferð en okkar segjum við það, líka þegar það þýðir að við fáum ekki verkið.',
          ],
        },
        {
          heading: 'Hvað við lofum ekki',
          paragraphs: [
            'Við lofum ekki að allir blettir fari, því það er ekki satt. Við gefum engar fullyrðingar um ofnæmisvalda, rykmaura eða sótthreinsun, því slíkar staðhæfingar þyrftu mælingar sem við gerum ekki.',
            'Það sem við lofum er að segja fyrirfram hverju má búast við, halda okkur við umsamið verð og skilja við rýmið eins og við komum að því.',
          ],
        },
      ],
    },

    privacy: {
      lead: 'Hvaða upplýsingum við söfnum, hvers vegna og hvaða réttindi þú átt.',
      sections: [
        {
          heading: 'Ábyrgðaraðili',
          paragraphs: [
            'Ábyrgðaraðili vinnslu persónuupplýsinga er fyrirtækið sem rekur þessa vefsíðu. Auðkennisupplýsingar — skráð heiti og kennitala — eru enn ófylltar og birtast neðst á hverri síðu um leið og þær liggja fyrir.',
          ],
        },
        {
          heading: 'Hvaða upplýsingum er safnað',
          paragraphs: [
            'Þegar þú hefur samband eða óskar eftir tilboði söfnum við þeim upplýsingum sem þú lætur okkur í té: nafni, símanúmeri, netfangi, heimilisfangi þar sem verkið á að fara fram og myndum af því sem á að hreinsa.',
          ],
          points: [
            'Nafn og samskiptaupplýsingar — til að svara fyrirspurn og skipuleggja heimsókn',
            'Heimilisfang — til að komast á staðinn og meta akstur',
            'Myndir af stykkinu — til að meta verkið og gefa verð',
            'Samskiptasaga — til að halda utan um fyrri verk og fyrirspurnir',
          ],
        },
        {
          heading: 'Heimild til vinnslu',
          paragraphs: [
            'Vinnslan byggist á því að hún sé nauðsynleg til að efna samning við þig eða gera ráðstafanir að þinni beiðni áður en samningur er gerður, sbr. 2. tölul. 9. gr. laga nr. 90/2018. Bókhaldsgögnum er haldið eftir á grundvelli lagaskyldu.',
          ],
        },
        {
          heading: 'Varðveislutími',
          paragraphs: [
            'Fyrirspurnir sem ekki leiða til verks eru varðveittar í takmarkaðan tíma og síðan eytt. Gögn um unnin verk eru varðveitt eins lengi og bókhaldslög krefjast. Nánari tímamörk verða tilgreind hér þegar þau hafa verið ákveðin.',
          ],
        },
        {
          heading: 'Réttindi þín',
          paragraphs: [
            'Þú átt rétt á að fá aðgang að þeim persónuupplýsingum sem við geymum um þig, láta leiðrétta þær sem eru rangar, láta eyða þeim, takmarka vinnslu þeirra og andmæla vinnslu. Þú getur einnig lagt fram kvörtun hjá Persónuvernd, sem hefur eftirlit með framkvæmd persónuverndarlaga á Íslandi.',
          ],
        },
        {
          heading: 'Vefkökur og mælingar',
          paragraphs: [
            'Þessi vefsíða notar engar vefkökur og geymir ekkert í vafranum þínum. Engar mælingar frá þriðja aðila eru keyrðar á síðunni.',
          ],
        },
      ],
    },

    terms: {
      lead: 'Hvernig verk eru bókuð og metin, og hvað felst í verðmati.',
      sections: [
        {
          heading: 'Verðmat',
          paragraphs: [
            'Verð er metið út frá myndum og lýsingu sem þú sendir og staðfest áður en við komum. Reynist ástandið verulega frábrugðið því sem myndirnar sýndu látum við þig vita áður en vinna hefst og þú ræður hvort haldið er áfram.',
          ],
        },
        {
          heading: 'Hvað við ábyrgjumst og hvað ekki',
          paragraphs: [
            'Við ábyrgjumst að meta efnið áður en það er meðhöndlað, að nota aðferð sem hæfir því og að segja fyrirfram hverju má búast við.',
            'Við ábyrgjumst ekki að allir blettir fari. Blettir sem hafa litað trefjarnar varanlega, slit sem komið er á flos og skemmdir sem urðu fyrir okkar tíma verða ekki lagfærðar með hreinsun, og við segjum frá því við matið frekar en eftir á.',
          ],
        },
        {
          heading: 'Afbókanir',
          paragraphs: [
            'Skilmálar um afbókun og breytingar á tímasetningu eru enn í vinnslu og verða birtir hér þegar þeir liggja fyrir. Þangað til gildir það sem um er samið hverju sinni.',
          ],
        },
        {
          heading: 'Réttur neytenda til að falla frá samningi',
          paragraphs: [
            'Sé samningur gerður utan fastrar starfsstöðvar eða í fjarsölu getur þú átt rétt á að falla frá honum innan fjórtán daga samkvæmt lögum nr. 16/2016 um neytendasamninga. Óskir þú eftir að þjónustan hefjist áður en fresturinn er liðinn getur það haft áhrif á réttinn. Nákvæm útfærsla bíður yfirferðar lögmanns.',
          ],
        },
        {
          heading: 'Ábendingar og kvartanir',
          paragraphs: [
            'Sértu ósátt eða ósáttur við verkið viljum við heyra af því sem fyrst, því flest verður leyst meðan aðstæður eru óbreyttar. Hafðu samband við okkur beint. Náist ekki samkomulag getur þú leitað til kærunefndar vöru- og þjónustukaupa.',
          ],
        },
      ],
    },

    legalDraftNotice:
      'Drög — bíður yfirferðar lögmanns. Textinn er saminn með hliðsjón af íslenskum lögum, meðal annars lögum nr. 90/2018 um persónuvernd og lögum nr. 16/2016 um neytendasamninga, en hefur ekki verið yfirfarinn af lögmanni.',
    legalUpdatedLabel: 'Síðast yfirfarið',
  },

  en: {
    faq: [
      {
        heading: 'About the cleaning',
        items: [
          { q: 'How long does a sofa or rug take to dry?', a: 'It depends on the material, the depth of the padding or pile, and how the room ventilates. Additional extraction shortens it considerably. In winter, when little is aired, it takes longer than in summer. We give you an estimate for your case before we leave and point out how to speed it up.' },
          { q: 'Does every stain come out?', a: 'No, and it is worth saying that plainly. Some stains have permanently dyed the fibre — particularly tannins from red wine and coffee on pale natural materials. Household products applied earlier may also have set the stain. We assess from photographs and tell you what we think is realistic before we start.' },
          { q: 'Do you come to my home?', a: 'Yes. We work on site with the equipment and nothing has to be moved out. We need access to a power socket and enough room to work around the piece.' },
          { q: 'Can you clean delicate materials?', a: 'Often yes, but it depends on the material. Viscose, silk and plant fibres tolerate limited moisture and are worked almost dry. We always test colourfastness somewhere out of sight before anything is applied, and we say so if we think a piece is better served by a different treatment.' },
          { q: 'Do I need to prepare anything?', a: 'Take off personal items and any scatter cushions that are not being cleaned, and leave space around the piece. You do not need to vacuum first — that is part of the job. If you have applied anything to a stain, tell us what it was.' },
          { q: 'Are your products safe around children and pets?', a: null },
        ],
      },
      {
        heading: 'Booking and price',
        items: [
          { q: 'What does it cost?', a: null },
          { q: 'How do I get a price?', a: 'Send us two or three photographs of the piece and your location. From those we assess the scope and confirm a price before we come. The final figure can change if the condition turns out to differ from what the photographs showed, but we tell you before starting rather than afterwards.' },
          { q: 'Which areas do you serve?', a: 'Reykjavík, Kópavogur, Garðabær, Hafnarfjörður, Seltjarnarnes and Mosfellsbær. If your area is not on the list, get in touch and we will tell you honestly whether we can reach you.' },
          { q: 'How much notice do you need?', a: null },
          { q: 'How do I pay?', a: null },
          { q: 'What if I need to cancel?', a: null },
        ],
      },
    ],

    process: {
      lead: 'From the first photographs to dry upholstery — how the work runs, and why each step is the way it is.',
      sections: [
        {
          heading: 'Why we start with photographs',
          paragraphs: [
            'Two or three photographs tell us more than a long description. From them we can see the construction, how the fabric sits, where the load has fallen and how large the job is. That lets us price the work before arriving, rather than standing in your living room naming a figure.',
            'If anything is unclear we ask for a photograph of the care label. It tells us what treatment the material will take, and it is usually tucked under a cushion or along the lower edge of the cover.',
          ],
        },
        {
          heading: 'The assessment on site',
          paragraphs: [
            'Before anything is applied we check the label, feel the fibre and test colourfastness somewhere out of sight. It takes a few minutes and governs everything that follows: which products may be used, at what strength, and how much moisture the piece will take.',
            'If the condition turns out to differ from what the photographs showed, we say so straight away and before work begins — not afterwards.',
          ],
        },
        {
          heading: 'The cleaning itself',
          paragraphs: [
            'Loose soil is removed dry first. This is not a formality: grit and sand left in place turn to mud the moment liquid reaches them, and cut the fibres on the way.',
            'Then cleaning solution is sprayed into the fibres and immediately drawn back out with the soil. Moisture is kept measured — two passes rather than one that is too wet. Finally we make additional passes without solution to pull out as much moisture as possible.',
          ],
        },
        {
          heading: 'Before we leave',
          paragraphs: [
            'We tell you how long we think the piece will take to dry and how to speed it up with ventilation. We also point out anything that did not come out, so you hear it from us rather than discovering it yourself later.',
          ],
        },
      ],
    },

    results: {
      lead: 'Real jobs, photographed before and after in the same light and the same frame.',
      sections: [
        {
          heading: 'How these photographs will be taken',
          paragraphs: [
            'Before-and-after photographs shot in different light, from a different angle or on different settings prove nothing. The difference you see is the camera, not the work.',
            'So the photographs here will be taken from the same position, in the same light, on the same settings, with the camera locked off. It is a slower method and it shows less difference than one could stage — but what it shows is true.',
            'No stock photography and no staged shots. Until real jobs have been photographed, this page stays empty rather than being filled with pictures of something else.',
          ],
        },
      ],
    },

    about: {
      lead: 'Specialists in upholstery and textile care across the Reykjavík capital area.',
      sections: [
        {
          heading: 'How we work',
          paragraphs: [
            'Silfrún specialises in one thing: cleaning textiles without damaging them. That sounds simple and is not, because most damage to upholstery and rugs comes not from soil but from wrong treatment — too much water, the wrong pH, or a product tried for the first time somewhere visible.',
            'So every job begins with an assessment and every assessment ends with an honest opinion. If we think a piece is better served by a different treatment than ours, we say so, including when that means we do not get the work.',
          ],
        },
        {
          heading: 'What we do not promise',
          paragraphs: [
            'We do not promise that every stain will come out, because it is not true. We make no claims about allergens, dust mites or disinfection, because such statements would need measurements we do not take.',
            'What we do promise is to tell you beforehand what to expect, to hold to the agreed price, and to leave the room as we found it.',
          ],
        },
      ],
    },

    privacy: {
      lead: 'What information we collect, why, and the rights you have.',
      sections: [
        {
          heading: 'Data controller',
          paragraphs: [
            'The controller for the processing of personal data is the company operating this website. The identifying details — registered name and company registration number — are not yet filled in, and appear at the foot of every page as soon as they are.',
          ],
        },
        {
          heading: 'What is collected',
          paragraphs: [
            'When you get in touch or request a quote, we collect what you give us: your name, phone number, email address, the address where the work is to be carried out, and photographs of the item to be cleaned.',
          ],
          points: [
            'Name and contact details — to answer your enquiry and arrange a visit',
            'Address — to reach the site and assess travel',
            'Photographs of the item — to assess the work and give a price',
            'Correspondence history — to keep track of previous jobs and enquiries',
          ],
        },
        {
          heading: 'Lawful basis',
          paragraphs: [
            'Processing is based on it being necessary to perform a contract with you, or to take steps at your request before entering into one, under Article 9(2) of Act No 90/2018. Accounting records are retained on the basis of a legal obligation.',
          ],
        },
        {
          heading: 'Retention',
          paragraphs: [
            'Enquiries that do not lead to work are kept for a limited period and then deleted. Records of completed work are kept for as long as accounting law requires. Specific periods will be stated here once they have been set.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            'You have the right to access the personal data we hold about you, to have inaccurate data corrected, to have it erased, to restrict processing and to object to processing. You may also lodge a complaint with Persónuvernd, the Icelandic Data Protection Authority.',
          ],
        },
        {
          heading: 'Cookies and analytics',
          paragraphs: [
            'This website sets no cookies and stores nothing in your browser. No third-party analytics run on the site.',
          ],
        },
      ],
    },

    terms: {
      lead: 'How work is booked and assessed, and what a quote covers.',
      sections: [
        {
          heading: 'Quotes',
          paragraphs: [
            'A price is assessed from the photographs and description you send, and confirmed before we come. If the condition turns out to differ materially from what the photographs showed, we tell you before work begins and you decide whether to continue.',
          ],
        },
        {
          heading: 'What we guarantee and what we do not',
          paragraphs: [
            'We guarantee to assess the material before treating it, to use a method suited to it, and to tell you beforehand what to expect.',
            'We do not guarantee that every stain will come out. Stains that have permanently dyed the fibre, pile that has already worn flat, and damage that predates our visit will not be corrected by cleaning, and we say so at the assessment rather than afterwards.',
          ],
        },
        {
          heading: 'Cancellations',
          paragraphs: [
            'Terms for cancellation and rescheduling are still being settled and will be published here once they are. Until then, what is agreed in each case applies.',
          ],
        },
        {
          heading: 'Consumer right of withdrawal',
          paragraphs: [
            'Where a contract is concluded off-premises or at a distance, you may have the right to withdraw from it within fourteen days under Act No 16/2016 on consumer contracts. Asking for the service to begin before that period ends may affect the right. The exact wording awaits review by a lawyer.',
          ],
        },
        {
          heading: 'Concerns and complaints',
          paragraphs: [
            'If you are unhappy with the work we want to hear about it as soon as possible, because most things can be resolved while the conditions are unchanged. Contact us directly. If no agreement is reached, you may refer the matter to the Icelandic complaints committee for goods and services.',
          ],
        },
      ],
    },

    legalDraftNotice:
      'Draft — awaiting review by a lawyer. The text is written with reference to Icelandic law, including Act No 90/2018 on data protection and Act No 16/2016 on consumer contracts, but has not been reviewed by a lawyer.',
    legalUpdatedLabel: 'Last reviewed',
  },
};
