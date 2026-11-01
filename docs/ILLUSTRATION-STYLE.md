# Illustration style

How paso's illustrations look, how to generate a new one, and how to check it before it
ships. The style replaces vocabulary emojis with pictures (#475). It was chosen after nine
rounds of comparison as "papercut C2" (#480).

## The style

Standard layered papercut:

- 3–5 layers of cut paper with clean scissor-cut edges and no outlines.
- Each paper piece is one flat, solid fill of one palette colour. No texture, grain, noise,
  gradient, painted shading or lighting variation inside a piece.
- Depth comes only from soft, narrow drop shadows where one layer sits on another. A face
  is never shaded as a whole.
- A real transparent background. No background plane, no halo, no shadow under the object.
- Shapes are simple and slightly chunky, so the subject reads at 96 px.

Two variants look wrong and were rejected: flat vector art with no layer shadows looks
like clip art, and textured paper (grain, mottling) turns into stains at small sizes.

## Palette

Every fill must be one of these colours. Only anti-aliased edges and the soft shadows
between layers may differ. The list is also in `scripts/illustrations/palette.json`, which
the QA script reads.

Design-system tokens:

| Hex     | Name (token)                       | Use                                           |
| ------- | ---------------------------------- | --------------------------------------------- |
| #FFDF20 | light yellow (chart-1)             | light yellow pieces, stars                    |
| #FDC700 | primary yellow (primary)           | the one small accent per object               |
| #F0B100 | yellow shade (chart-2)             | the shaded side of a yellow piece             |
| #D08700 | amber (chart-3)                    | wood, the sun, bread                          |
| #A65F00 | dark amber (chart-4)               | the shaded side of wood                       |
| #894B00 | brown (chart-5)                    | coffee, dark wood                             |
| #733E0A | dark brown (primary-foreground)    | small details                                 |
| #FEFCE8 | cream (sidebar-primary-foreground) | walls, paper, light parts, every face of them |
| #F9FBFB | near-white (sidebar)               | small parts only                              |
| #F1F3F3 | light grey (muted)                 | small parts only                              |
| #E3E7E8 | grey (border)                      | small parts only                              |
| #9CA8AB | mid grey (ring)                    | stone, metal                                  |
| #67787C | slate (muted-foreground)           | dark stone, metal shade                       |
| #22292B | near-black (dark muted)            | tiny details only (eyes)                      |

Illustration-only colours:

| Hex     | Name        | Use                                                   |
| ------- | ----------- | ----------------------------------------------------- |
| #578861 | green       | tree shade, far hills, doors, furniture legs          |
| #8FB981 | light green | lit leaves, near hills, the lit face of a green piece |
| #C26B49 | terracotta  | roofs, pots, flags; it has no darker shade            |
| #B1D8ED | sky blue    | window glass, a day sky disc                          |
| #4476A4 | deep blue   | shaded glass, a night sky disc                        |

Colour rules:

- Cream pieces keep #FEFCE8 on every face, including the side faces. Never beige.
- A shaded face uses another palette colour: green on light green, dark amber on amber,
  deep blue on sky blue. Never an invented darker shade.
- Keep the light greys (#F9FBFB, #F1F3F3, #E3E7E8) out of large areas: the generator cuts
  them out as background, and they vanish on the light card.
- One small primary-yellow (#FDC700) accent per object.

## Composition

Vocabulary words: a square image, one subject centred, filling about 75% of the square
with about 12% margin on every side. No text, letters or numbers anywhere, and no comic
symbols such as "Zzz" or music notes.

Objects and buildings look like small paper models seen in three-quarter view from slightly
above: the front face, a clearly visible side face (about a third of the front's width) and
the top or roof, each face cut from one sheet. A flat front view looks like an icon, not
part of the set.

Pick the cue a learner recognises at a glance and make it large. Where the real thing
carries a well-known pictogram, use it as a cut-paper shape: a pharmacy is a shop with a
big green cross sign, not a shop with bottles in the window.

Abstract words (times, days, verbs) get a simple scene of 2–4 elements. A time of day or
a day sits on a round paper disc like the hero's sky disc, so all such words look like one
family. Verbs show one clear object or a person doing the action. Make sure the scene does
not also fit a neighbouring word: morning, afternoon and night differ in the sun's height
and the disc's colour; Monday and Friday differ in which day of a 7-day strip is raised.

The Today hero: a landscape image (about 3:2) of a Mediterranean village in front of a
large sky-blue disc. Its only text is a speech bubble reading exactly "¡Vamos!" in deep
blue.

## Prompt template

Generate with Codex's built-in image generation, transparent background on, one image per
call. Fill in the subject line and send the style block and constraints unchanged:

```text
Use case: stylized-concept. Produce one STANDARD layered papercut illustration, 3–5 paper
layers, clean scissor-cut edges, subtle soft drop shadows ONLY where one layer overlaps
another, no outlines. Each paper piece is ONE flat solid fill: no texture, grain, noise,
gradients, painted shading, lighting variation, mottling or blotches. Flat screen-printed
paper, NOT a 3D render: keep overlap shadows narrow and faint, no bevel lighting, no
ambient shading across a whole face. Final colours must already match this COMPLETE EXACT
HEX PALETTE: #FFDF20, #FDC700, #F0B100, #D08700, #A65F00, #894B00, #733E0A, #FEFCE8,
#F9FBFB, #F1F3F3, #E3E7E8, #9CA8AB, #67787C, #22292B, #578861, #8FB981, #C26B49, #B1D8ED,
#4476A4. Do not introduce any other fill colours. Only antialiased edges and soft
inter-layer drop shadows may depart from the palette. Cream pieces and their side faces
must use the SAME #FEFCE8, never beige. Green shaded faces use #578861, light green faces
#8FB981; no darker green. Terracotta #C26B49 has no darker shade; depth comes only from
narrow inter-layer shadows. All window glass is visibly #B1D8ED sky blue with any shaded
pane #4476A4 deep blue. Avoid light grey large fills. Real transparent alpha background,
no background plane, no surrounding halo or shadow fog; all solid paper parts opaque
without transparent holes.
<SUBJECT LINE>
Constraints: square image at native resolution, final size 512x512. One subject centred,
about 75% of the square, about 12% margin on every side. Readable at 96x96 px. An object
or building is a small paper model in three-quarter view from slightly above, its side
face clearly visible. One small #FDC700 yellow accent. No text, letters or numbers. Draw
only the elements the subject line lists: no extra trees, bushes, flowers or decorations.
Transparent only in real gaps between separate parts; no holes inside any solid piece.
```

The subject line names the subject, the view and the colour of each main piece, for
example: "Square vocabulary asset: a closed door leaf in a frame with a handle, no wall,
slight perspective. Door leaf #578861, two raised inset panels and every frame face
#FEFCE8, small #FDC700 handle." Give each main piece a palette colour; a piece without one
drifts to an invented shade.

For the hero, replace the constraints with: "Landscape at native resolution, about
1536x1024. Draw only the elements the subject line lists: no extra trees, cypresses,
bushes, flowers or decorations. The only text is a small cream speech bubble, about 15% of
the image width, reading exactly “¡Vamos!” in #4476A4."

### Subject lines in use

| File         | Subject line                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `today-hero` | Large circular sky disc #B1D8ED behind a central cream Mediterranean house and a tall bell tower with a small terracotta flag; a small house left and a smaller house right; terracotta pitched roofs; arched green doors; an orange tree left whose canopy is 3–4 large round leaf discs, separate #8FB981 and #578861 pieces, with a few #FDC700 oranges; a potted plant bottom left and a potted cactus right; rolling hills #8FB981 near and #578861 far; a yellow and cream checkerboard plaza; an #D08700 sun; a cream speech bubble at right. |
| `la-manana`  | Round sky-blue #B1D8ED paper disc. A #FDC700 sun with #FFDF20 rays rising half above two layered hills, #8FB981 near and #578861 far, at the bottom of the disc. One small cream #FEFCE8 cloud. Early, fresh morning.                                                                                                                                                                                                                                                                                                                                |
| `la-tarde`   | Round #FFDF20 light-yellow paper disc. A large #D08700 amber sun high on the right, starting to sink, over two layered hills #8FB981 and #578861. A small cream house with a terracotta roof on the hill. Warm afternoon.                                                                                                                                                                                                                                                                                                                            |
| `la-noche`   | Round #4476A4 deep-blue paper disc. A cream #FEFCE8 crescent moon and three small #FFDF20 stars. A small cream house with a terracotta roof and one lit #FDC700 window on a #578861 hill.                                                                                                                                                                                                                                                                                                                                                            |
| `el-lunes`   | A cream #FEFCE8 desk calendar seen from the front: two #C26B49 binding rings on top and a strip of 7 equal square day tiles in one row. The FIRST tile (leftmost) is raised and #FDC700; the other six are #FEFCE8 cream tiles with a thin #9CA8AB edge. No numbers or letters.                                                                                                                                                                                                                                                                      |
| `el-viernes` | The same cream desk calendar with two #C26B49 binding rings and a strip of 7 equal square day tiles in one row. The FIFTH tile from the left is raised and #FDC700; the other six are cream with a thin #9CA8AB edge. No numbers or letters.                                                                                                                                                                                                                                                                                                         |
| `desayunar`  | Breakfast on a round cream plate: a #D08700 croissant with #A65F00 shaded segments and a cream cup of #894B00 coffee with a #FDC700 band, three-quarter view.                                                                                                                                                                                                                                                                                                                                                                                        |
| `trabajar`   | A three-quarter desk with #578861 legs and a #D08700 wooden top, a #67787C laptop with a #B1D8ED screen, and a small #FDC700 mug.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `dormir`     | A three-quarter bed with a #D08700 wooden frame, a cream pillow, and a #4476A4 blanket over a sleeping person whose round #D08700 head with closed eyes (two short #733E0A arcs) rests on the pillow. A small #FDC700 crescent moon above.                                                                                                                                                                                                                                                                                                           |

## QA checklist

Change no pixel to fix an image. Regenerate instead. The only allowed changes are the
resize to 512x512 (or 1200 px wide for the hero) and the lossless WebP encoding, both done
by `store.py`.

1. Colours: `python3 scripts/illustrations/measure.py <file.png>`. Every dominant fill must
   be within 6 of a palette colour (the script prints PASS or FAIL). Regenerate if a main
   piece visibly splits between two palette colours, even when it passes.
2. Holes: `python3 scripts/illustrations/holes.py <file.png>`. Every see-through region it
   lists must be an intended gap (between chair legs, under a table). A hole inside a door,
   pane, wall or plate means regenerate.
3. Look at it: `python3 scripts/illustrations/preview.py <out.png> <file.png ...>`, then
   open the output. Words show at 96 px on the light and dark card, the hero on both
   muted cards. The subject must read at a glance on both themes, and it must look like
   one family with the images already in `public/illustrations/`.
4. Store it: `python3 scripts/illustrations/store.py <file.png> <out.webp>` (add `--hero`
   for the hero). It fails if the WebP round trip changed any pixel.

The scripts need Python 3 with Pillow.

## Files

- Words: `public/illustrations/words/<slug>.webp`, 512x512, lossless WebP with alpha.
- The Today hero: `public/illustrations/today-hero.webp`, 1200x800, lossless WebP.
- The slug is the Spanish word (or the word's `key`) in lower case with accents removed and
  spaces as hyphens, article included: `la mañana` is `la-manana`.
- Keep the generated PNGs out of the repo.

## How images are wired in

- A word in `src/data/words.json` gets `"picture": "<slug>"` next to its `visual` emoji.
- `src/data/curriculum.ts` copies it to the vocabulary question, and `QuestionMaterials`
  shows `/illustrations/words/<slug>.webp`. A word without `picture` still shows its emoji,
  so units can move over one at a time.
- The Today hero is `JourneyArt` in `src/components/Art.tsx`, an image placed in the grey
  card the same way the old SVG was.

## Pitfalls

- Snapping pixels to the palette after generation breaks every shaded area into blotches of
  two palette colours. Put the exact hex list in the prompt instead, and accept small
  drift.
- Flat papercut without layer shadows looked like clip art. Keep the soft shadows between
  layers.
- Grain or paper texture turns into stains at 96 px.
- The generator punches transparent holes into enclosed solid areas, especially door panels
  and window panes. Say "no holes inside any solid piece" and run `holes.py`.
- Large light-grey fills get cut out as background. Use cream for light pieces.
- Without a colour for each piece, shaded faces drift to beige or a darker green.
- A reference image passes its texture on. When regenerating from a reference, say it is
  for geometry only.
