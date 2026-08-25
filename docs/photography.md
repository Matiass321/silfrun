# Photography brief

The site has no photography. This is the single largest gap between what it is
now and what converts, and it is the one thing that cannot be written, coded or
bought — only shot.

Read this before the first job you photograph. A phone is fine. A photographer
is better for the three hero frames and not needed for the rest.

## Why this matters more than anything else on the site

A cleaning service is bought on one question: *will it actually come out?* Every
sentence on this site argues yes. A matched before-and-after pair proves it in
under a second, in a way no copy can.

Stock photography does the opposite. A visitor who recognises a stock sofa
concludes — correctly — that you had no work of your own to show. It is worse
than an empty space, and it is why the site currently renders hatched plates
carrying these briefs instead.

## The one rule: matched pairs

**Before and after must be the same camera position, same lens, same light, same
framing.** If the two frames do not line up, the pair proves nothing — the eye
reads the difference as a different photograph, not a different condition.

Practically:

1. Mark where you stand. A strip of tape on the floor is enough.
2. Shoot the "before" the moment you arrive, before moving anything.
3. Do not move the piece, open a curtain, or turn a lamp on between frames.
4. Shoot the "after" from the tape, same height, same distance.
5. Shoot both within the same hour if daylight is the source. Icelandic light
   moves fast, and a two-hour gap will change the colour temperature more than
   the cleaning changed the fabric.

Lock exposure and white balance if the phone allows it. On iPhone, tap and hold
to lock AE/AF before the "before" and use the same lock for the "after".

## Light

- **Daylight, indirect.** Near a window, not in a sunbeam. Direct sun blows out
  the highlights on a light fabric and hides exactly the detail that matters.
- **Never the flash.** It flattens texture, and texture is the whole subject.
- **Never overhead room light alone.** The warm cast makes a clean cream sofa
  look yellow, which reads as dirty.
- Overcast Reykjavík daylight is close to ideal. Do not wait for sun.

## The shots

### 1. Homepage plates — three frames

These fill the three positions on the homepage and are the most-seen images on
the site.

| # | Subject | Frame | Ratio |
| --- | --- | --- | --- |
| 1 | Wool sofa, before and after | Whole piece, straight on, slightly above seat height | 4:5 |
| 2 | Hand-knotted rug | Close on the pile, raking light to show fibre depth | 4:5 |
| 3 | Stain treatment | Tight on the mark, before and after | 4:5 |

Portrait 4:5, because the plates are taller than they are wide. Shoot wider than
you need — cropping in is free, cropping out is not.

### 2. Service pages — one pair each

One matched pair per service, showing that service and nothing else:

- **Sofas and upholstery** — a three-seat sofa, whole piece.
- **Rugs** — a rug in the room it lives in, not hung or staged flat.
- **Fitted carpet** — a traffic lane or doorway, where wear actually shows.
- **Stains and odours** — one mark, tight, with something in frame for scale.

### 3. Our work — the gallery

Six to ten pairs, varied. Mix materials, mix rooms, mix how bad the "before"
was. A page where every before is catastrophic reads as staged; a page where
every before is mild reads as pointless.

### 4. What is not needed

- Team portraits, until there is a team worth naming.
- The van.
- Equipment on its own. A machine photograph sells the machine, not the result.
- Anyone smiling at the camera holding a cloth.

## Framing

- Fill the frame with the piece. Air around the subject is for the layout to
  add, not the camera.
- Straight on, or a slight angle. Never a dramatic low angle.
- Level horizon. A tilted skirting board is the fastest way to look amateur.
- Include enough of the room to be believable, not enough to be distracting.

## Permission

Every one of these is inside somebody's home. Ask in writing before shooting and
again before publishing, and say plainly where the image will appear. A verbal
"sure, go ahead" while you are standing in their living room is not consent to
put their sitting room on a public website.

Keep the written permissions. If a client later withdraws consent, pull the
image the same day.

## Files

- Export at **1600px on the long edge**, JPEG quality 80. The build converts and
  resizes from there.
- Name them `service-condition-nn.jpg` — `sofa-before-01.jpg`,
  `sofa-after-01.jpg`. The pairing has to survive being sorted alphabetically.
- Keep the untouched originals somewhere separate.

## Retouching

Straighten, crop, and correct exposure so the "before" and "after" match the
room as it actually looked.

**Nothing else.** Do not clone out a mark, do not lift the "after" to make the
difference look bigger, do not warm one frame and cool the other. The entire
value of a before-and-after is that it is evidence, and evidence that has been
improved is not evidence. It is also the kind of thing a customer notices when
the real sofa does not match the photograph.

## Wiring them in

Photographs are not dropped into a page. Add them to the plate positions, which
already carry these briefs as placeholder notes:

- `src/pages/[lang]/index.astro` — the `PLATES` array
- `src/components/pages/ServicePage.astro` — the service pair
- `.sf-plate` in `src/styles/base.css` — the component, which already handles
  `object-fit`, the scrim and the caption

Each needs a genuine `alt` describing what is shown, in both languages. "Sofa
before cleaning" is not a description; "three-seat wool sofa, seat cushions
darkened along the front edge" is.
