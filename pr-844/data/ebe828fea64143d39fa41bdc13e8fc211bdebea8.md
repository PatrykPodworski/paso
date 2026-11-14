# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual/views.spec.ts >> recent answers and the previous attempt
- Location: tests/visual/views.spec.ts:244:1

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  330 pixels (ratio 0.01 of all image pixels) are different.

  Snapshot: question-last-time.png

Call log:
  - Expect "toHaveScreenshot(question-last-time.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 2219 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 1889 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 330 pixels (ratio 0.01 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=f1e3]:
  - link "Skip to content" [ref=f1e4] [cursor=pointer]:
    - /url: "#main-content"
  - complementary [ref=f1e5]:
    - link "Paso home" [ref=f1e6] [cursor=pointer]:
      - /url: /today
      - generic [ref=f1e7]:
        - text: p
        - generic [ref=f1e8]: •
      - generic [ref=f1e9]: paso.
    - generic [ref=f1e10]:
      - generic "Spanish flag" [ref=f1e11]
      - generic [ref=f1e15]:
        - strong [ref=f1e16]: Spanish for your world
        - generic [ref=f1e17]: DELE A1 · Beginner
    - generic [ref=f1e18]: YOUR LEARNING SPACE
    - navigation "Main navigation" [ref=f1e19]:
      - button "My learning space" [ref=f1e20] [cursor=pointer]
      - button "Learning path" [ref=f1e24] [cursor=pointer]
      - button "Practice studio 1" [ref=f1e29] [cursor=pointer]:
        - generic [ref=f1e32]: Practice studio
        - generic [ref=f1e33]: "1"
      - button "Exam rehearsal" [ref=f1e34] [cursor=pointer]
      - button "The A1 guide" [ref=f1e38] [cursor=pointer]
    - generic [ref=f1e42]:
      - generic [ref=f1e43]: ✺
      - paragraph [ref=f1e44]: Un poquito cada día.
      - generic [ref=f1e45]: A little every daytakes you a long way.
    - generic [ref=f1e47]:
      - button "Your exam, explained" [ref=f1e48] [cursor=pointer]
      - button "P Your Spanish journey Learning at your pace" [ref=f1e53] [cursor=pointer]:
        - generic [ref=f1e54]: P
        - generic [ref=f1e55]:
          - strong [ref=f1e56]: Your Spanish journey
          - generic [ref=f1e57]: Learning at your pace
  - generic [ref=f1e60]:
    - banner [ref=f1e61]:
      - generic [ref=f1e62]:
        - button "Open navigation" [ref=f1e63] [cursor=pointer]
        - generic [ref=f1e66]: Your Spanish journey
      - generic [ref=f1e67]:
        - generic "Consecutive practice days" [ref=f1e68]: "3"
        - button "Open your learning preferences" [ref=f1e72] [cursor=pointer]: P
    - main [ref=f1e73]:
      - generic [ref=f1e74]:
        - generic [ref=f1e75]:
          - generic [ref=f1e76]: FROM YOUR FIRST HOLA TO YOUR A1
          - heading "Every step has a story." [level=1] [ref=f1e77]
          - paragraph [ref=f1e78]: 29 units · 117 lessons · 1534 exercises. Explore freely, or follow the path.
        - generic [ref=f1e79]:
          - generic [ref=f1e80]: PASO A PASO
          - generic [ref=f1e84]: YOUR JOURNEY STARTS HERE
      - generic [ref=f1e85]:
        - generic [ref=f1e89]:
          - generic [ref=f1e90]: YOUR NEXT SMALL STEP
          - heading "¡Hola, mundo! · Make the words work" [level=3] [ref=f1e91]
          - paragraph [ref=f1e92]: 1/117 complete · 1% of your path
        - button "Continue learning" [ref=f1e93] [cursor=pointer]
      - generic [ref=f1e96]:
        - generic [ref=f1e97]:
          - generic [ref=f1e98]:
            - generic [ref=f1e99]: "01"
            - article [ref=f1e100]:
              - button "UNIT 01 · Primeros pasos ¡Hola, mundo!" [expanded] [ref=f1e101] [cursor=pointer]:
                - generic [ref=f1e105]:
                  - generic [ref=f1e106]: UNIT 01 · Primeros pasos
                  - heading "¡Hola, mundo!" [level=3] [ref=f1e107]
              - generic [ref=f1e108]:
                - generic [ref=f1e109]:
                  - button "Words to take with you Discover vocabulary · listen & choose 4 min" [ref=f1e110] [cursor=pointer]:
                    - generic [ref=f1e112]:
                      - strong [ref=f1e113]: Words to take with you
                      - generic [ref=f1e114]: Discover vocabulary · listen & choose
                    - generic [ref=f1e115]: 4 min
                  - button "Make the words work Understand patterns · guided grammar 4 min" [ref=f1e116] [cursor=pointer]:
                    - generic [ref=f1e120]:
                      - strong [ref=f1e121]: Make the words work
                      - generic [ref=f1e122]: Understand patterns · guided grammar
                    - generic [ref=f1e123]: 4 min
                  - button "A little real life Read & listen · everyday situations 5 min" [ref=f1e124] [cursor=pointer]:
                    - generic [ref=f1e128]:
                      - strong [ref=f1e129]: A little real life
                      - generic [ref=f1e130]: Read & listen · everyday situations
                    - generic [ref=f1e131]: 5 min
                  - button "Make it your own Build, write & speak · your turn 8 min" [ref=f1e132] [cursor=pointer]:
                    - generic [ref=f1e136]:
                      - strong [ref=f1e137]: Make it your own
                      - generic [ref=f1e138]: Build, write & speak · your turn
                    - generic [ref=f1e139]: 8 min
                - group [ref=f1e140]:
                  - generic "A little pattern to remember" [ref=f1e141] [cursor=pointer]
          - generic [ref=f1e144]:
            - generic [ref=f1e145]: "02"
            - article [ref=f1e146]:
              - button "UNIT 02 · Así soy yo This is me" [ref=f1e147] [cursor=pointer]:
                - generic [ref=f1e151]:
                  - generic [ref=f1e152]: UNIT 02 · Así soy yo
                  - heading "This is me" [level=3] [ref=f1e153]
          - generic [ref=f1e154]:
            - generic [ref=f1e155]: "03"
            - article [ref=f1e156]:
              - button "UNIT 03 · Part 1 of 6 Numbers" [ref=f1e157] [cursor=pointer]:
                - generic [ref=f1e161]:
                  - generic [ref=f1e162]: UNIT 03 · Part 1 of 6
                  - heading "Numbers" [level=3] [ref=f1e163]
          - generic [ref=f1e164]:
            - generic [ref=f1e165]: "04"
            - article [ref=f1e166]:
              - button "UNIT 04 · Part 2 of 6 Numbers" [ref=f1e167] [cursor=pointer]:
                - generic [ref=f1e171]:
                  - generic [ref=f1e172]: UNIT 04 · Part 2 of 6
                  - heading "Numbers" [level=3] [ref=f1e173]
          - generic [ref=f1e174]:
            - generic [ref=f1e175]: "05"
            - article [ref=f1e176]:
              - button "UNIT 05 · Mi gente My favorite people" [ref=f1e177] [cursor=pointer]:
                - generic [ref=f1e181]:
                  - generic [ref=f1e182]: UNIT 05 · Mi gente
                  - heading "My favorite people" [level=3] [ref=f1e183]
          - generic [ref=f1e184]:
            - generic [ref=f1e185]: "06"
            - article [ref=f1e186]:
              - button "UNIT 06 · Part 3 of 6 Numbers" [ref=f1e187] [cursor=pointer]:
                - generic [ref=f1e191]:
                  - generic [ref=f1e192]: UNIT 06 · Part 3 of 6
                  - heading "Numbers" [level=3] [ref=f1e193]
          - generic [ref=f1e194]:
            - generic [ref=f1e195]: "07"
            - article [ref=f1e196]:
              - button "UNIT 07 · En casa A place called home" [ref=f1e197] [cursor=pointer]:
                - generic [ref=f1e201]:
                  - generic [ref=f1e202]: UNIT 07 · En casa
                  - heading "A place called home" [level=3] [ref=f1e203]
          - generic [ref=f1e204]:
            - generic [ref=f1e205]: "08"
            - article [ref=f1e206]:
              - button "UNIT 08 · Part 1 of 3 Where things are" [ref=f1e207] [cursor=pointer]:
                - generic [ref=f1e211]:
                  - generic [ref=f1e212]: UNIT 08 · Part 1 of 3
                  - heading "Where things are" [level=3] [ref=f1e213]
          - generic [ref=f1e214]:
            - generic [ref=f1e215]: "09"
            - article [ref=f1e216]:
              - button "UNIT 09 · Part 2 of 3 Where things are" [ref=f1e217] [cursor=pointer]:
                - generic [ref=f1e221]:
                  - generic [ref=f1e222]: UNIT 09 · Part 2 of 3
                  - heading "Where things are" [level=3] [ref=f1e223]
          - generic [ref=f1e224]:
            - generic [ref=f1e225]: "10"
            - article [ref=f1e226]:
              - button "UNIT 10 · Part 3 of 3 Where things are" [ref=f1e227] [cursor=pointer]:
                - generic [ref=f1e231]:
                  - generic [ref=f1e232]: UNIT 10 · Part 3 of 3
                  - heading "Where things are" [level=3] [ref=f1e233]
          - generic [ref=f1e234]:
            - generic [ref=f1e235]: "11"
            - article [ref=f1e236]:
              - button "UNIT 11 · Part 4 of 6 Numbers" [ref=f1e237] [cursor=pointer]:
                - generic [ref=f1e241]:
                  - generic [ref=f1e242]: UNIT 11 · Part 4 of 6
                  - heading "Numbers" [level=3] [ref=f1e243]
          - generic [ref=f1e244]:
            - generic [ref=f1e245]: "12"
            - article [ref=f1e246]:
              - button "UNIT 12 · Mi día a día A day in my life" [ref=f1e247] [cursor=pointer]:
                - generic [ref=f1e251]:
                  - generic [ref=f1e252]: UNIT 12 · Mi día a día
                  - heading "A day in my life" [level=3] [ref=f1e253]
          - generic [ref=f1e254]:
            - generic [ref=f1e255]: "13"
            - article [ref=f1e256]:
              - button "UNIT 13 · Part 1 of 2 Weekdays" [ref=f1e257] [cursor=pointer]:
                - generic [ref=f1e261]:
                  - generic [ref=f1e262]: UNIT 13 · Part 1 of 2
                  - heading "Weekdays" [level=3] [ref=f1e263]
          - generic [ref=f1e264]:
            - generic [ref=f1e265]: "14"
            - article [ref=f1e266]:
              - button "UNIT 14 · Part 2 of 2 Weekdays" [ref=f1e267] [cursor=pointer]:
                - generic [ref=f1e271]:
                  - generic [ref=f1e272]: UNIT 14 · Part 2 of 2
                  - heading "Weekdays" [level=3] [ref=f1e273]
          - generic [ref=f1e274]:
            - generic [ref=f1e275]: "15"
            - article [ref=f1e276]:
              - button "UNIT 15 · Part 1 of 2 Time words" [ref=f1e277] [cursor=pointer]:
                - generic [ref=f1e281]:
                  - generic [ref=f1e282]: UNIT 15 · Part 1 of 2
                  - heading "Time words" [level=3] [ref=f1e283]
          - generic [ref=f1e284]:
            - generic [ref=f1e285]: "16"
            - article [ref=f1e286]:
              - button "UNIT 16 · Part 2 of 2 Time words" [ref=f1e287] [cursor=pointer]:
                - generic [ref=f1e291]:
                  - generic [ref=f1e292]: UNIT 16 · Part 2 of 2
                  - heading "Time words" [level=3] [ref=f1e293]
          - generic [ref=f1e294]:
            - generic [ref=f1e295]: "17"
            - article [ref=f1e296]:
              - button "UNIT 17 · ¡Buen provecho! A table for two" [ref=f1e297] [cursor=pointer]:
                - generic [ref=f1e301]:
                  - generic [ref=f1e302]: UNIT 17 · ¡Buen provecho!
                  - heading "A table for two" [level=3] [ref=f1e303]
          - generic [ref=f1e304]:
            - generic [ref=f1e305]: "18"
            - article [ref=f1e306]:
              - button "UNIT 18 · Por el barrio Around the neighborhood" [ref=f1e307] [cursor=pointer]:
                - generic [ref=f1e311]:
                  - generic [ref=f1e312]: UNIT 18 · Por el barrio
                  - heading "Around the neighborhood" [level=3] [ref=f1e313]
          - generic [ref=f1e314]:
            - generic [ref=f1e315]: "19"
            - article [ref=f1e316]:
              - button "UNIT 19 · De compras A little shopping" [ref=f1e317] [cursor=pointer]:
                - generic [ref=f1e321]:
                  - generic [ref=f1e322]: UNIT 19 · De compras
                  - heading "A little shopping" [level=3] [ref=f1e323]
          - generic [ref=f1e324]:
            - generic [ref=f1e325]: "20"
            - article [ref=f1e326]:
              - button "UNIT 20 · Part 5 of 6 Numbers" [ref=f1e327] [cursor=pointer]:
                - generic [ref=f1e331]:
                  - generic [ref=f1e332]: UNIT 20 · Part 5 of 6
                  - heading "Numbers" [level=3] [ref=f1e333]
          - generic [ref=f1e334]:
            - generic [ref=f1e335]: "21"
            - article [ref=f1e336]:
              - button "UNIT 21 · Tiempo libre Life beyond work" [ref=f1e337] [cursor=pointer]:
                - generic [ref=f1e341]:
                  - generic [ref=f1e342]: UNIT 21 · Tiempo libre
                  - heading "Life beyond work" [level=3] [ref=f1e343]
          - generic [ref=f1e344]:
            - generic [ref=f1e345]: "22"
            - article [ref=f1e346]:
              - button "UNIT 22 · Part 1 of 4 Asking questions" [ref=f1e347] [cursor=pointer]:
                - generic [ref=f1e351]:
                  - generic [ref=f1e352]: UNIT 22 · Part 1 of 4
                  - heading "Asking questions" [level=3] [ref=f1e353]
          - generic [ref=f1e354]:
            - generic [ref=f1e355]: "23"
            - article [ref=f1e356]:
              - button "UNIT 23 · Part 2 of 4 Asking questions" [ref=f1e357] [cursor=pointer]:
                - generic [ref=f1e361]:
                  - generic [ref=f1e362]: UNIT 23 · Part 2 of 4
                  - heading "Asking questions" [level=3] [ref=f1e363]
          - generic [ref=f1e364]:
            - generic [ref=f1e365]: "24"
            - article [ref=f1e366]:
              - button "UNIT 24 · ¡Buen viaje! A ticket to somewhere" [ref=f1e367] [cursor=pointer]:
                - generic [ref=f1e371]:
                  - generic [ref=f1e372]: UNIT 24 · ¡Buen viaje!
                  - heading "A ticket to somewhere" [level=3] [ref=f1e373]
          - generic [ref=f1e374]:
            - generic [ref=f1e375]: "25"
            - article [ref=f1e376]:
              - button "UNIT 25 · Part 3 of 4 Asking questions" [ref=f1e377] [cursor=pointer]:
                - generic [ref=f1e381]:
                  - generic [ref=f1e382]: UNIT 25 · Part 3 of 4
                  - heading "Asking questions" [level=3] [ref=f1e383]
          - generic [ref=f1e384]:
            - generic [ref=f1e385]: "26"
            - article [ref=f1e386]:
              - button "UNIT 26 · ¿Qué tal estás? Come rain or shine" [ref=f1e387] [cursor=pointer]:
                - generic [ref=f1e391]:
                  - generic [ref=f1e392]: UNIT 26 · ¿Qué tal estás?
                  - heading "Come rain or shine" [level=3] [ref=f1e393]
          - generic [ref=f1e394]:
            - generic [ref=f1e395]: "27"
            - article [ref=f1e396]:
              - button "UNIT 27 · Part 4 of 4 Asking questions" [ref=f1e397] [cursor=pointer]:
                - generic [ref=f1e401]:
                  - generic [ref=f1e402]: UNIT 27 · Part 4 of 4
                  - heading "Asking questions" [level=3] [ref=f1e403]
          - generic [ref=f1e404]:
            - generic [ref=f1e405]: "28"
            - article [ref=f1e406]:
              - button "UNIT 28 · Part 6 of 6 Numbers" [ref=f1e407] [cursor=pointer]:
                - generic [ref=f1e411]:
                  - generic [ref=f1e412]: UNIT 28 · Part 6 of 6
                  - heading "Numbers" [level=3] [ref=f1e413]
          - generic [ref=f1e414]:
            - generic [ref=f1e415]: "29"
            - article [ref=f1e416]:
              - button "UNIT 29 · ¡Tú puedes! Ready for your next chapter" [ref=f1e417] [cursor=pointer]:
                - generic [ref=f1e421]:
                  - generic [ref=f1e422]: UNIT 29 · ¡Tú puedes!
                  - heading "Ready for your next chapter" [level=3] [ref=f1e423]
          - generic [ref=f1e424]:
            - generic [ref=f1e427]:
              - heading "The next chapter is yours." [level=3] [ref=f1e428]
              - paragraph [ref=f1e429]: Put your skills together in the exam rehearsal.
            - button "Meet the exam" [ref=f1e430] [cursor=pointer]
        - complementary [ref=f1e433]:
          - generic [ref=f1e434]: HOW YOUR PATH WORKS
          - heading "Learn it. Try it. Make it yours." [level=3] [ref=f1e435]: Learn it. Try it.Make it yours.
          - generic [ref=f1e439]:
            - heading "Discover the words" [level=4] [ref=f1e440]
            - paragraph [ref=f1e441]: Connect Spanish words with meaning and sound.
          - generic [ref=f1e445]:
            - heading "Understand the pattern" [level=4] [ref=f1e446]
            - paragraph [ref=f1e447]: Learn the why behind each answer.
          - generic [ref=f1e451]:
            - heading "Meet real life" [level=4] [ref=f1e452]
            - paragraph [ref=f1e453]: Read a message. Listen to a conversation.
          - generic [ref=f1e457]:
            - heading "Use your own voice" [level=4] [ref=f1e458]
            - paragraph [ref=f1e459]: Write, talk to Lucía and reflect on your progress.
          - paragraph [ref=f1e460]: All lessons are open. Completion tracks practice, not exam readiness. Review mistakes and use the A1 checklist to find gaps.
      - generic [ref=f1e461]:
        - generic [ref=f1e462]: paso a paso ✦
        - button "Independent practice · Official sources inside" [ref=f1e463] [cursor=pointer]
  - dialog "Words to take with you" [ref=f1e466]:
    - banner [ref=f1e467]:
      - button "Close lesson" [ref=f1e468] [cursor=pointer]
      - generic [ref=f1e471]:
        - generic [ref=f1e472]: UNIT 1 · LESSON 1
        - heading "Words to take with you" [level=3] [ref=f1e473]
      - generic [ref=f1e474]: 1 / 8
    - progressbar "Lesson progress" [ref=f1e475]
    - generic [ref=f1e477]:
      - generic [ref=f1e478]:
        - text: reading
        - generic [ref=f1e480]: /
        - text: A small step forward
        - paragraph [ref=f1e481]:
          - text: "Last time: Wrong ·"
          - time [ref=f1e482]: 08/09/2026
      - heading "What does “hola” mean?" [level=2] [ref=f1e484]
      - img "Vocabulary illustration" [ref=f1e485]
      - generic [ref=f1e486]:
        - button "thank you" [ref=f1e487] [cursor=pointer]:
          - generic [ref=f1e488]: "1"
        - button "hello" [ref=f1e490] [cursor=pointer]:
          - generic [ref=f1e491]: "2"
        - button "good evening / good night" [ref=f1e493] [cursor=pointer]:
          - generic [ref=f1e494]: "3"
      - generic [ref=f1e496]: Take your time. Every mistake is a chance to learn.
```

# Test source

```ts
  1   | import { test as base, expect, type Locator, type Page } from "@playwright/test";
  2   | import { allLessons } from "../../src/data/curriculum";
  3   | import { courseUnitNumber } from "../../src/data/path";
  4   | import { mockQuestions } from "../../src/data/mock";
  5   | import type { ProgressSnapshot, Question } from "../../src/data/types";
  6   | import { answerTalk } from "./live";
  7   | import { type ProgressSeed, seedWrites } from "./progressSeed";
  8   | 
  9   | export const test = base.extend<{ blockExternal: void }>({
  10  |   blockExternal: [
  11  |     async ({ context }, provide) => {
  12  |       await context.route("**/*", async (route) => {
  13  |         const url = new URL(route.request().url());
  14  | 
  15  |         if (url.hostname !== "127.0.0.1" && url.protocol.startsWith("http")) {
  16  |           return route.abort("blockedbyclient");
  17  |         }
  18  | 
  19  |         return route.continue();
  20  |       });
  21  | 
  22  |       await provide();
  23  |     },
  24  |     { auto: true },
  25  |   ],
  26  |   page: async ({ page }, provide) => {
  27  |     const errors: string[] = [];
  28  | 
  29  |     page.on("pageerror", (error) => errors.push(error.message));
  30  | 
  31  |     // A lesson writing task needs a review to move on; a test that cares registers its own.
  32  |     await page.route("**/api/review-writing", (route) =>
  33  |       route.fulfill({
  34  |         json: { wordCount: 0, coverage: [], corrections: [], revised: "", grade: "perfect" },
  35  |       }),
  36  |     );
  37  | 
  38  |     await page.clock.setFixedTime(new Date("2026-09-09T10:00:00+02:00"));
  39  |     await provide(page);
  40  |     expect(errors, "Uncaught browser errors").toEqual([]);
  41  |   },
  42  | });
  43  | 
  44  | export { expect };
  45  | 
  46  | // Captures land in screenshots/ for inspection. With VISUAL_COMPARE set they are compared
  47  | // with screenshots/baseline/ instead, which a run with --update-snapshots=all writes.
  48  | export const capture = async (
  49  |   page: Page,
  50  |   name: string,
  51  |   { fullPage = false, element }: { fullPage?: boolean; element?: Locator } = {},
  52  | ) => {
  53  |   if (process.env.VISUAL_COMPARE) {
  54  |     await (element
  55  |       ? expect(element).toHaveScreenshot(`${name}.png`)
> 56  |       : expect(page).toHaveScreenshot(`${name}.png`, { fullPage }));
      |                      ^ Error: expect(page).toHaveScreenshot(expected) failed
  57  | 
  58  |     return;
  59  |   }
  60  | 
  61  |   const path = `screenshots/${test.info().project.name}/${name}.png`;
  62  | 
  63  |   await (element ? element.screenshot({ path }) : page.screenshot({ path, fullPage }));
  64  | };
  65  | 
  66  | // Everything that makes a screenshot reproducible and nothing that is specific to one
  67  | // page: kill motion, wait for webfonts, drop focus rings and hover state, scroll to the
  68  | // top. Shared by tests/visual/views.spec.ts and tests/visual/design-system.spec.ts.
  69  | export const stabilise = async (page: Page) => {
  70  |   await page.addStyleTag({
  71  |     content:
  72  |       "*, *::before, *::after { scroll-behavior: auto !important; transition: none !important; animation: none !important; }",
  73  |   });
  74  | 
  75  |   await page.evaluate(async () => {
  76  |     await document.fonts.ready;
  77  |     (document.activeElement as HTMLElement)?.blur();
  78  |     window.scrollTo(0, 0);
  79  |   });
  80  | 
  81  |   await page.mouse.move(0, 0);
  82  | };
  83  | 
  84  | // Opens a path lesson; one with stored answers resumes at its first unanswered exercise.
  85  | export const openLesson = async (page: Page, index: number, resumeAt = 0) => {
  86  |   await page.goto("/path");
  87  |   const lesson = allLessons[index];
  88  |   // Set units sit between the course units, so the card is found by the unit's path number.
  89  |   const unit = page.locator(".unit-card").nth(courseUnitNumber(Math.floor(index / 4) + 1) - 1);
  90  | 
  91  |   if ((await unit.locator(".unit-summary").getAttribute("aria-expanded")) !== "true") {
  92  |     await unit.locator(".unit-summary").click();
  93  |   }
  94  | 
  95  |   await unit.getByRole("button", { name: lesson.title, exact: false }).click();
  96  | 
  97  |   await expect(
  98  |     page.getByRole("heading", { name: lesson.questions[resumeAt].prompt, exact: true }),
  99  |   ).toBeVisible();
  100 | 
  101 |   return lesson;
  102 | };
  103 | 
  104 | const submitLabel = (q: Question, exam: boolean) =>
  105 |   exam ? "Save answer" : ["write", "form"].includes(q.kind) ? "Review my practice" : "Check answer";
  106 | 
  107 | // A lesson writing task asks for the passcode until one gets a review.
  108 | const fillPasscode = async (page: Page, q: Question, exam: boolean) => {
  109 |   const passcode = page.getByLabel("Passcode");
  110 | 
  111 |   if (!exam && ["write", "form"].includes(q.kind) && (await passcode.isVisible())) {
  112 |     await passcode.fill("olé");
  113 |   }
  114 | };
  115 | 
  116 | // A tile can hold several words ("tu amigo?"), so the answer is split into the tiles that build it.
  117 | const tilesInAnswerOrder = (q: Question) => {
  118 |   const tiles: string[] = [];
  119 |   const left = [...(q.tokens ?? [])];
  120 |   let rest = q.answer;
  121 | 
  122 |   while (rest) {
  123 |     const tile = left.filter((t) => rest.startsWith(t)).sort((a, b) => b.length - a.length)[0];
  124 | 
  125 |     if (!tile) {
  126 |       return q.answer.split(" ");
  127 |     }
  128 | 
  129 |     tiles.push(tile);
  130 |     left.splice(left.indexOf(tile), 1);
  131 |     rest = rest.slice(tile.length).trimStart();
  132 |   }
  133 | 
  134 |   return tiles;
  135 | };
  136 | 
  137 | export const answer = async (page: Page, q: Question, exam = false, wrong = false) => {
  138 |   if (q.options) {
  139 |     await page
  140 |       .getByRole("button", {
  141 |         name: wrong ? q.options.find((o) => o !== q.answer)! : q.answer,
  142 |         exact: true,
  143 |       })
  144 |       .click();
  145 | 
  146 |     return;
  147 |   } else if (q.kind === "order") {
  148 |     for (const tile of tilesInAnswerOrder(q)) {
  149 |       await page
  150 |         .locator(".word-bank")
  151 |         .getByRole("button", { name: tile, exact: true, disabled: false })
  152 |         .filter({ visible: true })
  153 |         .first()
  154 |         .click();
  155 |     }
  156 | 
```