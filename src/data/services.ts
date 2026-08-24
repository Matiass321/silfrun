import type { Locale } from '~/config/site';
import type { ServiceKey } from '~/i18n/routes';

/**
 * Per-service page content.
 *
 * Written for Iceland specifically rather than translated from somewhere
 * warmer: the grit, the winter salt, the sheepskins and the fact that nothing
 * dries quickly indoors between October and April all change the advice.
 *
 * Everything here is verifiable textile-cleaning fact or a plain description
 * of how the work is done. Nothing asserts a price, a timescale or a guarantee
 * the business has not supplied.
 */
export interface ServiceContent {
  lead: string;
  body: string[];
  includedTitle: string;
  included: string[];
  materialTitle: string;
  material: { name: string; note: string }[];
  expectTitle: string;
  expect: string[];
  faqs: { q: string; a: string }[];
}

type Table = Record<Locale, Record<ServiceKey, ServiceContent>>;

export const SERVICE_CONTENT: Table = {
  is: {
    sofa: {
      lead: 'Djúphreinsun með úðaútdrætti fyrir sófa, hægindastóla og stóla — unnin á staðnum, með mati á efninu áður en nokkuð er borið á.',
      body: [
        'Sófi safnar óhreinindum jafnt og þétt frekar en allt í einu. Húðfita, ryk og það sem berst inn með skónum sest í trefjarnar og gerir þær smám saman mattari. Þess vegna er breytingin mest áberandi þar sem mest er setið — á sætisflötum, örmum og bakinu þar sem höfuðið hvílir.',
        'Úðaútdráttur virkar þannig að hreinsilausn er úðað ofan í trefjarnar og strax dregin upp aftur ásamt óhreinindunum. Lykilatriðið er að ofmetta ekki: betra er að fara tvisvar yfir með hóflegu magni en að bleyta áklæðið í gegn. Í íslensku húsnæði skiptir þetta enn meira máli yfir veturinn, þegar lítið er loftræst og hlutir eru lengi að þorna.',
        'Áður en við byrjum skoðum við merkimiðann, þreifum á trefjunum og prófum litheldni á stað sem ekki sést. Það segir okkur hvað má nota og hversu mikinn raka efnið þolir.',
      ],
      includedTitle: 'Hvað felst í heimsókninni',
      included: [
        'Mat á efni, merkingum og litheldni áður en nokkuð er borið á',
        'Ryksuga með tilliti til lausra óhreininda og hára',
        'Formeðhöndlun bletta þar sem það á við',
        'Djúphreinsun með úðaútdrætti',
        'Aukaútdráttur til að stytta þurrktímann',
        'Leiðbeiningar um þurrkun og umhirðu áður en við förum',
      ],
      materialTitle: 'Hvað breytist eftir efni',
      material: [
        { name: 'Bómull og sterkar blöndur', note: 'Þola vel raka og hefðbundna meðferð.' },
        { name: 'Flauel', note: 'Þarf rakastýringu og bursta í rétta átt svo ekki komi flet eða för.' },
        { name: 'Viskósa', note: 'Veikist þegar hún blotnar og getur fengið hringi. Unnin með mun minni raka.' },
        { name: 'Ull', note: 'Sterk en pH-viðkvæm. Sterk basísk efni skemma hana og geta breytt lit.' },
        { name: 'Leður og líkileður', note: 'Ekki hreinsað með úðaútdrætti — þarf aðra vöru og aðra aðferð.' },
      ],
      expectTitle: 'Hverju má búast við',
      expect: [
        'Ekki fara allir blettir alveg. Tannín úr rauðvíni og kaffi geta hafa litað trefjarnar varanlega, sérstaklega í ljósum náttúruefnum.',
        'Hafi heimilisvara verið borin á blettinn áður getur hún hafa fest hann. Segðu okkur frá því — það breytir meðferðinni.',
        'Þurrktími ræðst af efni, þykkt bólstrunar og loftræstingu. Við gefum áætlun fyrir þitt tilvik áður en við förum.',
      ],
      faqs: [
        { q: 'Hversu lengi er sófi að þorna?', a: 'Það ræðst af áklæðinu, þykkt bólstrunarinnar og því hvernig loftar um herbergið. Þunnt áklæði í vel loftræstu rými þornar mun hraðar en þykkt sæti í lokuðu herbergi. Yfir veturinn, þegar gluggar eru síður opnaðir, tekur það lengri tíma. Við gefum áætlaðan tíma fyrir þitt tilvik og útskýrum hvernig má flýta fyrir.' },
        { q: 'Getið þið hreinsað flauel?', a: 'Já, með varúð. Flauel þarf rakastýringu og bursta í réttri stefnu trefjanna svo ekki komi för eða flet. Við prófum alltaf fyrst á stað sem ekki sést. Viskósuflauel er töluvert viðkvæmara en bómullarflauel og er unnið með minni raka.' },
        { q: 'Getið þið hreinsað ull?', a: 'Já. Ull er sterk en viðkvæm fyrir sýrustigi — sterk basísk efni skemma hana og geta haft áhrif á litinn. Unnið er með efnum í réttu pH og með stýrðum raka, því ullin getur einnig hlaupið ef hún mettast.' },
        { q: 'Þarf ég að undirbúa eitthvað?', a: 'Taktu persónulega muni og skrautpúða sem ekki á að hreinsa af sófanum og skildu eftir pláss allt í kringum hann. Þú þarft ekki að ryksuga fyrir — það er hluti af verkinu. Hafir þú borið eitthvað á blett, láttu okkur vita hvað það var.' },
      ],
    },

    rug: {
      lead: 'Ull, silki, jurtatrefjar, gerviefni og gæruskinn — metin eftir gerð og meðhöndluð í samræmi við það.',
      body: [
        'Teppi er ekki eitt efni heldur mörg. Handhnýtt ullarteppi, vélofið gerviteppi og gæruskinn þola gjörólíka meðferð, og það sem hentar einu getur eyðilagt annað. Þess vegna byrjar hvert verk á því að greina úr hverju teppið er og hvernig það er byggt upp.',
        'Í íslenskum heimilum er sandur, möl og vetrarsalt algengasta álagið. Þessi efni safnast neðst í flosið og virka eins og sandpappír á trefjarnar í hvert sinn sem gengið er á teppinu. Þurrhreinsun á lausum ögnum er því raunverulegur hluti verksins, ekki bara undirbúningur fyrir það.',
        'Gæruskinn og önnur skinn eru sérstakt tilfelli: bakhliðin þolir illa vatn og getur harðnað eða skroppið saman ef hún blotnar. Við segjum þér fyrirfram ef við teljum stykki betur komið í annarri meðferð en okkar.',
      ],
      includedTitle: 'Hvað felst í heimsókninni',
      included: [
        'Greining á trefjum, byggingu og litheldni',
        'Þurrhreinsun á lausum ögnum, sandi og hárum',
        'Formeðhöndlun bletta þar sem það á við',
        'Djúphreinsun sem hæfir gerð teppisins',
        'Aukaútdráttur og leiðbeiningar um þurrkun',
      ],
      materialTitle: 'Hvað breytist eftir efni',
      material: [
        { name: 'Ull', note: 'Sterk og endingargóð en pH-viðkvæm. Getur hlaupið ef hún mettast.' },
        { name: 'Silki', note: 'Mjög viðkvæmt fyrir raka og núningi. Krefst lágmarksvætu.' },
        { name: 'Jurtatrefjar (júta, sísal)', note: 'Þola illa vatn — geta gulnað og aflagast. Unnið nánast þurrt.' },
        { name: 'Gerviefni', note: 'Þola mesta meðferð og hreinsast yfirleitt best.' },
        { name: 'Gæruskinn', note: 'Bakhliðin þolir illa vatn. Metið sérstaklega hverju sinni.' },
      ],
      expectTitle: 'Hverju má búast við',
      expect: [
        'Slit sést eftir hreinsun. Þar sem flosið er gengið niður kemur það ekki upp aftur — hreinsun fjarlægir óhreinindi, ekki ára af sliti.',
        'Litir geta virst breyttir þegar rykið er farið. Það er yfirleitt teppið að koma í ljós eins og það er í raun.',
        'Teppi þurfa að þorna alveg áður en þau eru lögð aftur á gólf, sérstaklega á parketi.',
      ],
      faqs: [
        { q: 'Getið þið hreinsað handhnýtt ullarteppi?', a: 'Yfirleitt já, en það fer eftir ástandi og litheldni. Handhnýtt teppi eru oft lituð með efnum sem geta blætt sé þeim beitt rangt, svo við prófum alltaf fyrst á földum stað. Sé teppið sérstaklega verðmætt eða viðkvæmt segjum við það hreinskilnislega.' },
        { q: 'Hvað með gæruskinn?', a: 'Gæruskinn eru metin sérstaklega. Bakhliðin þolir illa vatn og getur harðnað eða skroppið saman, svo aðferðin er allt önnur en fyrir ofið teppi. Sendu okkur mynd af bæði fram- og bakhlið áður en þú bókar.' },
        { q: 'Hreinsið þið teppi á staðnum eða takið þið þau með?', a: 'Við vinnum á staðnum. Það þýðir að teppið fer hvergi og þú ert ekki án þess í marga daga. Þurfi stykki aðra meðferð en unnt er að veita á heimili segjum við þér frá því við matið.' },
        { q: 'Fer sandurinn og mölin úr?', a: 'Að miklu leyti, já. Laus óhreinindi neðst í flosinu eru fjarlægð með þurrhreinsun áður en nokkur vökvi kemur nærri, því annars breytast þau í leðju. Það sem hefur skorið trefjarnar með tímanum er hins vegar varanlegt slit.' },
      ],
    },

    carpet: {
      lead: 'Fastlögð gólfteppi á heimilum, í sumarbústöðum og í atvinnuhúsnæði.',
      body: [
        'Fastlagt gólfteppi slitnar ójafnt. Gangvegir — inn um dyr, að stiga, kringum skrifborð — taka við margfalt meira álagi en gólfið undir húsgögnum, og þar sest óhreinindin dýpst. Munurinn á þessum svæðum er oft það sem sést best eftir hreinsun.',
        'Rakastýring skiptir öllu í fastlögðu teppi. Undir því er undirlag og lím, og of mikill vökvi kemst niður í hvort tveggja þar sem hann þornar hægt. Þess vegna er unnið með stýrðu magni og auknum útdrætti frekar en að metta teppið.',
        'Í atvinnuhúsnæði skipuleggjum við verkið eftir opnunartíma þannig að rýmið sé tilbúið þegar það er tekið í notkun aftur. Fyrir stærri fleti metum við aðstæður á staðnum áður en verð er gefið.',
      ],
      includedTitle: 'Hvað felst í heimsókninni',
      included: [
        'Mat á gerð teppis, undirlagi og ástandi',
        'Ryksuga á lausum óhreinindum',
        'Sérstök meðferð á gangvegum og álagssvæðum',
        'Djúphreinsun með stýrðum raka',
        'Aukaútdráttur til að stytta þurrktímann',
      ],
      materialTitle: 'Hvað hefur áhrif',
      material: [
        { name: 'Gangvegir', note: 'Þurfa oft aðra meðferð en gólfið í heild.' },
        { name: 'Undirlag og lím', note: 'Takmarka hversu mikinn raka má nota.' },
        { name: 'Trefjagerð', note: 'Gerviefni þola meira en náttúrutrefjar.' },
        { name: 'Loftræsting', note: 'Ræður þurrktíma meira en nokkuð annað.' },
      ],
      expectTitle: 'Hverju má búast við',
      expect: [
        'Þar sem flosið er slitið niður kemur það ekki upp aftur. Hreinsun fjarlægir óhreinindi, ekki slit.',
        'Blettir sem hafa náð niður í undirlagið geta komið aftur upp þegar teppið þornar. Það þýðir að uppspretta þeirra er neðar en yfirborðið.',
        'Teppið þarf að vera alveg þurrt áður en húsgögn eru sett aftur á sinn stað.',
      ],
      faqs: [
        { q: 'Hversu lengi er gólfteppi að þorna?', a: 'Það fer eftir teppinu, hversu mikill raki var notaður og hvernig loftar um rýmið. Aukaútdráttur styttir tímann verulega. Við gefum áætlun fyrir þitt rými og bendum á hvernig má flýta fyrir með loftræstingu.' },
        { q: 'Getið þið hreinsað utan opnunartíma?', a: 'Fyrir atvinnuhúsnæði skipuleggjum við verkið þannig að rýmið sé tilbúið þegar það er tekið í notkun. Nánari tímasetning er ákveðin þegar verkið er metið.' },
        { q: 'Koma blettirnir aftur?', a: 'Stundum, og þá er skýringin yfirleitt sú að bletturinn nái dýpra en yfirborðið. Þegar teppið þornar getur efnið borist upp á ný. Sé það raunin segjum við þér frá því og hvað er hægt að gera.' },
      ],
    },

    stains: {
      lead: 'Kaffi, rauðvín, gæludýr, matur og þrálát lykt — metið eftir því hvað olli blettinum og hversu djúpt hann nær.',
      body: [
        'Því fyrr sem blettur er meðhöndlaður, því betri er útkoman að jafnaði. Það sem gert er á fyrstu mínútunum ræður oft meiru en það sem gert er síðar: að þerra upp á við frekar en að nudda, og að forðast heitt vatn á prótínbletti.',
        'Lykt og blettur eru ekki sama vandamálið. Blettur er á yfirborðinu, en lykt kemur frá leifum sem sitja eftir þegar vökvi þornar. Hafi vökvinn farið niður í svampinn getur lyktin haldist þótt sýnilegi bletturinn hverfi, því uppsprettan er undir.',
        'Við segjum þér fyrirfram hvað við teljum raunhæft. Sé bletturinn búinn að lita trefjarnar varanlega er heiðarlegra að segja það áður en byrjað er en að lofa útkomu sem næst ekki.',
      ],
      includedTitle: 'Hvað felst í heimsókninni',
      included: [
        'Greining á því hvað olli blettinum og hversu djúpt hann nær',
        'Prófun á litheldni á földum stað',
        'Markviss formeðhöndlun eftir gerð blettsins',
        'Útdráttur og hlutleysing lyktarleifa þar sem það á við',
        'Hreinskilið mat á því hvað næst og hvað ekki',
      ],
      materialTitle: 'Algengar gerðir',
      material: [
        { name: 'Rauðvín og kaffi', note: 'Tannín. Geta litað ljósar náttúrutrefjar varanlega.' },
        { name: 'Þvag frá gæludýrum', note: 'Lyktin kemur frá söltum sem sitja eftir. Þarf að ná til þeirra.' },
        { name: 'Blóð og matur', note: 'Prótín. Heitt vatn festir þau — unnið er kalt.' },
        { name: 'Fita og olía', note: 'Þarf aðra vöru en vatnsleysanlegir blettir.' },
      ],
      expectTitle: 'Hverju má búast við',
      expect: [
        'Ekki fer allt. Sumir blettir hafa litað trefjarnar varanlega og þá skilar engin aðferð þeim til baka.',
        'Heimilisvörur sem bornar hafa verið á áður geta hafa fest blettinn. Láttu okkur vita hvað var notað.',
        'Nái þvag niður í svampinn getur lykt haldist þótt bletturinn hverfi. Þá er uppsprettan neðar en yfirborðið.',
      ],
      faqs: [
        { q: 'Næst lyktin af gæludýraþvagi?', a: 'Oft, en það ræðst af dýptinni. Lyktin kemur frá leifum sem sitja eftir þegar þvagið þornar og það þarf að ná til þeirra til að hlutleysa þær. Séu þær í yfirborði áklæðisins er útkoman yfirleitt góð. Hafi þær mettað svampinn undir þarf að ná þangað, og það er ekki alltaf hægt án þess að taka húsgagnið í sundur.' },
        { q: 'Hvað á ég að gera strax?', a: 'Þerraðu upp á við með hreinum, ljósum klút — ekki nudda, því það þrýstir efninu dýpra og skemmir trefjarnar. Notaðu ekki heitt vatn á blóð, mjólk eða mat, því hiti festir prótín. Hringdu frekar áður en þú prófar heimilisvöru.' },
        { q: 'Hvers vegna kom bletturinn aftur?', a: 'Yfirleitt vegna þess að hann nær dýpra en yfirborðið. Þegar efnið þornar getur það borist upp aftur með rakanum. Það segir okkur að uppsprettan sé neðar og að meðhöndla þurfi dýpra.' },
        { q: 'Getið þið meðhöndlað bletti sem einhver annar reyndi við?', a: 'Já, en segðu okkur hvað var notað. Sumar heimilisvörur festa bletti eða skilja eftir leifar sem draga í sig ný óhreinindi, og það breytir því hvernig við nálgumst verkið.' },
      ],
    },
  },

  en: {
    sofa: {
      lead: 'Deep extraction cleaning for sofas, armchairs and dining chairs — carried out in your home, with the material assessed before anything is applied.',
      body: [
        'A sofa soils gradually rather than all at once. Body oils, dust and whatever comes in on shoes settle into the fibres and dull them over time. That is why the change is most visible where people actually sit — the seat cushions, the arms, and the back where heads rest.',
        'Hot-water extraction works by spraying a cleaning solution into the fibres and immediately drawing it back out along with the soil. The critical part is not over-wetting: two passes with a measured amount beat one that soaks the fabric through. In Icelandic homes this matters more in winter, when little is aired and nothing dries quickly.',
        'Before we start we check the care label, feel the fibre and test colourfastness somewhere out of sight. That tells us what may be used and how much moisture the material will take.',
      ],
      includedTitle: 'What the visit covers',
      included: [
        'Assessment of fibre, care label and colourfastness before anything is applied',
        'Vacuuming for loose soil and hair',
        'Pre-treatment of stains where appropriate',
        'Deep cleaning by hot-water extraction',
        'Additional extraction passes to shorten drying time',
        'Guidance on drying and care before we leave',
      ],
      materialTitle: 'What changes with the material',
      material: [
        { name: 'Cotton and durable blends', note: 'Tolerate moisture and conventional treatment well.' },
        { name: 'Velvet', note: 'Needs moisture control and brushing with the pile so no marks or flattening remain.' },
        { name: 'Viscose', note: 'Weakens when wet and can ring-mark. Worked with far less moisture.' },
        { name: 'Wool', note: 'Strong but pH-sensitive. Strong alkalis damage it and can shift the colour.' },
        { name: 'Leather and faux leather', note: 'Not extraction-cleaned — it needs a different product and method.' },
      ],
      expectTitle: 'What to expect',
      expect: [
        'Not every stain comes out completely. Tannins from red wine and coffee can dye the fibre permanently, especially on pale natural materials.',
        'A household product applied earlier may have set the stain. Tell us — it changes the treatment.',
        'Drying time depends on the fabric, the depth of the padding and the ventilation. We give you an estimate for your case before we leave.',
      ],
      faqs: [
        { q: 'How long does a sofa take to dry?', a: 'It depends on the fabric, how deep the padding is and how the room ventilates. A thin cover in a well-aired room dries far faster than a deep seat in a closed one. In winter, when windows stay shut, it takes longer. We give you an estimate for your case and explain how to speed it up.' },
        { q: 'Can you clean velvet?', a: 'Yes, carefully. Velvet needs moisture control and brushing in the right direction of the pile so no marks or flattened patches remain. We always test in a hidden area first. Viscose velvet is considerably more delicate than cotton velvet and is worked with less moisture.' },
        { q: 'Can you clean wool?', a: 'Yes. Wool is hard-wearing but sensitive to pH — strong alkalis damage it and can affect the colour. We work with correctly pH-balanced products and controlled moisture, since wool can also shrink if it becomes saturated.' },
        { q: 'Do I need to prepare anything?', a: 'Take off personal items and any scatter cushions that are not being cleaned, and leave space around the piece. You do not need to vacuum first — that is part of the job. If you have applied anything to a stain, tell us what it was.' },
      ],
    },

    rug: {
      lead: 'Wool, silk, plant fibres, synthetics and sheepskin — assessed by construction and treated accordingly.',
      body: [
        'A rug is not one material but many. A hand-knotted wool rug, a machine-woven synthetic and a sheepskin tolerate completely different treatment, and what suits one can ruin another. So every job starts by identifying what the rug is made of and how it is built.',
        'In Icelandic homes, grit, gravel and winter road salt are the most common load. They collect at the base of the pile and act like sandpaper on the fibres every time somebody walks across. Dry-removing that grit is a real part of the work, not just preparation for it.',
        'Sheepskins are a case of their own: the hide backing does not tolerate water and can stiffen or shrink if it gets wet. If we think a piece is better served by a different treatment than ours, we say so before you book.',
      ],
      includedTitle: 'What the visit covers',
      included: [
        'Identification of fibre, construction and colourfastness',
        'Dry removal of loose grit, sand and hair',
        'Pre-treatment of stains where appropriate',
        'Deep cleaning suited to the rug type',
        'Additional extraction and guidance on drying',
      ],
      materialTitle: 'What changes with the material',
      material: [
        { name: 'Wool', note: 'Hard-wearing but pH-sensitive. Can shrink if saturated.' },
        { name: 'Silk', note: 'Very sensitive to moisture and abrasion. Needs minimal wetting.' },
        { name: 'Plant fibres (jute, sisal)', note: 'Poor tolerance of water — can yellow and distort. Worked almost dry.' },
        { name: 'Synthetics', note: 'Take the most robust treatment and generally clean up best.' },
        { name: 'Sheepskin', note: 'The hide backing does not tolerate water. Assessed case by case.' },
      ],
      expectTitle: 'What to expect',
      expect: [
        'Wear shows after cleaning. Where the pile has been walked flat it does not come back up — cleaning removes soil, not years of wear.',
        'Colours can look different once the dust is gone. That is usually the rug appearing as it actually is.',
        'Rugs must dry completely before going back down, particularly on a wooden floor.',
      ],
      faqs: [
        { q: 'Can you clean a hand-knotted wool rug?', a: 'Usually yes, though it depends on condition and colourfastness. Hand-knotted rugs are often coloured with dyes that can bleed if handled wrongly, so we always test in a hidden area first. If a rug is particularly valuable or fragile, we will say so plainly.' },
        { q: 'What about sheepskins?', a: 'Sheepskins are assessed separately. The hide backing does not tolerate water and can stiffen or shrink, so the method is entirely different from a woven rug. Send us a photograph of both the face and the back before booking.' },
        { q: 'Do you clean rugs on site or take them away?', a: 'We work on site. That means the rug goes nowhere and you are not without it for days. If a piece needs treatment that cannot be given in a home, we tell you at the assessment.' },
        { q: 'Does the grit and sand come out?', a: 'Largely, yes. Loose soil at the base of the pile is removed dry before any liquid comes near it, because otherwise it simply turns to mud. What has already cut the fibres over time, however, is permanent wear.' },
      ],
    },

    carpet: {
      lead: 'Fitted carpet in homes, summer houses and commercial interiors.',
      body: [
        'Fitted carpet wears unevenly. Traffic lanes — through doorways, to the stairs, around a desk — take many times the load of the floor under furniture, and that is where soil settles deepest. The difference between those areas is often what shows most after cleaning.',
        'Moisture control is everything with fitted carpet. Underneath sit the underlay and the adhesive, and too much liquid reaches both, where it dries slowly. So we work with measured volumes and extra extraction rather than saturating the carpet.',
        'In commercial premises we schedule around opening hours so the space is ready when it is needed. For larger areas we assess on site before quoting.',
      ],
      includedTitle: 'What the visit covers',
      included: [
        'Assessment of carpet type, underlay and condition',
        'Vacuuming for loose soil',
        'Specific treatment of traffic lanes and high-load areas',
        'Deep cleaning with controlled moisture',
        'Additional extraction to shorten drying time',
      ],
      materialTitle: 'What affects the result',
      material: [
        { name: 'Traffic lanes', note: 'Often need different treatment from the floor as a whole.' },
        { name: 'Underlay and adhesive', note: 'Limit how much moisture may be used.' },
        { name: 'Fibre type', note: 'Synthetics tolerate more than natural fibres.' },
        { name: 'Ventilation', note: 'Governs drying time more than anything else.' },
      ],
      expectTitle: 'What to expect',
      expect: [
        'Where the pile is worn flat it does not come back up. Cleaning removes soil, not wear.',
        'Stains that have reached the underlay can wick back up as the carpet dries. That means their source sits below the surface.',
        'The carpet must be completely dry before furniture goes back.',
      ],
      faqs: [
        { q: 'How long does fitted carpet take to dry?', a: 'It depends on the carpet, how much moisture was used and how the space ventilates. Additional extraction shortens it considerably. We give an estimate for your space and point out how to speed it up with ventilation.' },
        { q: 'Can you work outside opening hours?', a: 'For commercial premises we schedule the work so the space is ready when it is needed. Exact timing is agreed when the job is assessed.' },
        { q: 'Will the stains come back?', a: 'Sometimes, and the explanation is usually that the stain runs deeper than the surface. As the carpet dries, the material can wick back up. If that is the case we tell you, and what can be done about it.' },
      ],
    },

    stains: {
      lead: 'Coffee, red wine, pets, food and persistent odours — assessed by what caused the mark and how deep it goes.',
      body: [
        'The sooner a stain is treated, the better the outcome tends to be. What happens in the first few minutes often matters more than what is done later: blotting upwards rather than rubbing, and keeping hot water away from protein stains.',
        'An odour and a stain are not the same problem. A stain sits on the surface, while an odour comes from residue left behind as a liquid dries. If the liquid has reached the foam, the smell can persist even after the visible mark is gone, because the source is underneath.',
        'We tell you beforehand what we think is realistic. If a stain has already dyed the fibre permanently, it is more honest to say so before starting than to promise a result that will not come.',
      ],
      includedTitle: 'What the visit covers',
      included: [
        'Identification of what caused the stain and how deep it reaches',
        'Colourfastness testing in a hidden area',
        'Targeted pre-treatment by stain type',
        'Extraction and neutralising of odour residue where appropriate',
        'An honest assessment of what will and will not come out',
      ],
      materialTitle: 'Common types',
      material: [
        { name: 'Red wine and coffee', note: 'Tannins. Can permanently dye pale natural fibres.' },
        { name: 'Pet urine', note: 'The odour comes from salts left behind. Those have to be reached.' },
        { name: 'Blood and food', note: 'Proteins. Hot water sets them — worked cold.' },
        { name: 'Grease and oil', note: 'Needs a different product from water-soluble stains.' },
      ],
      expectTitle: 'What to expect',
      expect: [
        'Not everything comes out. Some stains have permanently dyed the fibre, and no method brings that back.',
        'Household products applied earlier may have set the stain. Tell us what was used.',
        'If urine has reached the foam, an odour can persist even once the mark is gone. The source is then below the surface.',
      ],
      faqs: [
        { q: 'Can pet urine odour be removed?', a: 'Often, though it depends on depth. The odour comes from residue left as the urine dries, and that residue has to be reached to neutralise it. If it sits in the surface of the fabric the result is usually good. If it has saturated the foam beneath, we have to reach that, and it is not always possible without taking the furniture apart.' },
        { q: 'What should I do straight away?', a: 'Blot upwards with a clean, pale cloth — do not rub, which drives the material deeper and damages the fibres. Do not use hot water on blood, milk or food, because heat sets proteins. Call before you try a household product.' },
        { q: 'Why has the stain come back?', a: 'Usually because it runs deeper than the surface. As the material dries it can wick back up with the moisture. That tells us the source sits lower and needs treating at depth.' },
        { q: 'Can you treat a stain someone else has already tried on?', a: 'Yes, but tell us what was used. Some household products set stains or leave residue that attracts fresh soil, and that changes how we approach the job.' },
      ],
    },
  },
};
