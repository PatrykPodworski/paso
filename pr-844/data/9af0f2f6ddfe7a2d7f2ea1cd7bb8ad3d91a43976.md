# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual/views.spec.ts >> illustrated scenarios in the picture studio
- Location: tests/visual/views.spec.ts:585:1

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  912 pixels (ratio 0.01 of all image pixels) are different.

  Snapshot: scene-cafe.png

Call log:
  - Expect "toHaveScreenshot(scene-cafe.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 912 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 912 pixels (ratio 0.01 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to content" [ref=e4] [cursor=pointer]:
    - /url: "#main-content"
  - complementary [ref=e5]:
    - link "Paso home" [ref=e6] [cursor=pointer]:
      - /url: /today
      - generic [ref=e7]:
        - text: p
        - generic [ref=e8]: •
      - generic [ref=e9]: paso.
    - generic [ref=e10]:
      - generic "Spanish flag" [ref=e11]
      - generic [ref=e15]:
        - strong [ref=e16]: Spanish for your world
        - generic [ref=e17]: DELE A1 · Beginner
    - generic [ref=e18]: YOUR LEARNING SPACE
    - navigation "Main navigation" [ref=e19]:
      - button "My learning space" [ref=e20] [cursor=pointer]
      - button "Learning path" [ref=e24] [cursor=pointer]
      - button "Practice studio" [ref=e28] [cursor=pointer]
      - button "Exam rehearsal" [ref=e33] [cursor=pointer]
      - button "The A1 guide" [ref=e37] [cursor=pointer]
    - generic [ref=e41]:
      - generic [ref=e42]: ✺
      - paragraph [ref=e43]: Un poquito cada día.
      - generic [ref=e44]: A little every daytakes you a long way.
    - generic [ref=e46]:
      - button "Your exam, explained" [ref=e47] [cursor=pointer]
      - button "P Your Spanish journey Learning at your pace" [ref=e52] [cursor=pointer]:
        - generic [ref=e53]: P
        - generic [ref=e54]:
          - strong [ref=e55]: Your Spanish journey
          - generic [ref=e56]: Learning at your pace
  - generic [ref=e59]:
    - banner [ref=e60]:
      - generic [ref=e61]:
        - button "Open navigation" [ref=e62] [cursor=pointer]
        - generic [ref=e65]: Your Spanish journey
      - generic [ref=e66]:
        - generic "Consecutive practice days" [ref=e67]: "0"
        - button "Open your learning preferences" [ref=e71] [cursor=pointer]: P
    - main [ref=e72]:
      - generic [ref=e74]:
        - generic [ref=e75]: MORE PLAY. MORE PRACTICE. MORE YOU.
        - heading "Your practice studio." [level=1] [ref=e76]
        - paragraph [ref=e77]: Follow your curiosity, or give a tricky word another chance.
      - group "Filter practice by skill" [ref=e78]:
        - button "All skills" [ref=e79] [cursor=pointer]
        - button "Reading" [ref=e80] [cursor=pointer]
        - button "Listening" [ref=e81] [cursor=pointer]
        - button "Writing" [ref=e82] [cursor=pointer]
        - button "Speaking" [ref=e83] [cursor=pointer]
        - button "My mistakes (0)" [ref=e84] [cursor=pointer]
      - generic [ref=e86]:
        - generic [ref=e87]: A SMALL SESSION, CHOSEN FOR YOU
        - heading "A little bit of everything." [level=2] [ref=e88]
        - paragraph [ref=e89]: Fresh questions come first. Revisit the ones you’ve seen as your confidence grows.
        - button "Start my daily mix" [ref=e90] [cursor=pointer]
      - generic [ref=e93]:
        - button "Leer Reading 0 questions practised A lovely place to start" [ref=e94] [cursor=pointer]:
          - generic [ref=e98]: Leer
          - heading "Reading" [level=3] [ref=e99]
          - paragraph [ref=e100]: 0 questions practised
          - text: A lovely place to start
        - button "Escuchar Listening 0 questions practised A lovely place to start" [ref=e103] [cursor=pointer]:
          - generic [ref=e107]: Escuchar
          - heading "Listening" [level=3] [ref=e108]
          - paragraph [ref=e109]: 0 questions practised
          - text: A lovely place to start
        - button "Escribir Writing 0 questions practised A lovely place to start" [ref=e112] [cursor=pointer]:
          - generic [ref=e116]: Escribir
          - heading "Writing" [level=3] [ref=e117]
          - paragraph [ref=e118]: 0 questions practised
          - text: A lovely place to start
        - button "Hablar Speaking 0 questions practised A lovely place to start" [ref=e121] [cursor=pointer]:
          - generic [ref=e125]: Hablar
          - heading "Speaking" [level=3] [ref=e126]
          - paragraph [ref=e127]: 0 questions practised
          - text: A lovely place to start
      - generic [ref=e130]:
        - button [ref=e131] [cursor=pointer]:
          - generic [ref=e135]:
            - heading "Picture this" [level=3] [ref=e136]
            - paragraph [ref=e137]: 6 visual puzzles · cafés, trains & your neighborhood
        - button [ref=e140] [cursor=pointer]:
          - generic [ref=e144]:
            - heading "The foundation lab" [level=3] [ref=e145]
            - paragraph [ref=e146]: 24 checks · sounds, spelling, numbers & patterns
        - button [ref=e149] [cursor=pointer]:
          - generic [ref=e153]:
            - heading "Fill in your story" [level=3] [ref=e154]
            - paragraph [ref=e155]: A personal form · 15–25 words · exam task 1
        - button [ref=e158] [cursor=pointer]:
          - generic [ref=e162]:
            - heading "Asking questions" [level=3] [ref=e163]
            - paragraph [ref=e164]: 12 lessons · two or three new question words per lesson
        - button [ref=e167] [cursor=pointer]:
          - generic [ref=e171]:
            - heading "Weekdays" [level=3] [ref=e172]
            - paragraph [ref=e173]: 5 lessons · the seven days, two or three at a time
        - button [ref=e176] [cursor=pointer]:
          - generic [ref=e180]:
            - heading "Where things are" [level=3] [ref=e181]
            - paragraph [ref=e182]: 9 lessons · 14 place phrases, two or three new phrases per lesson
        - button [ref=e185] [cursor=pointer]:
          - generic [ref=e189]:
            - heading "Time words" [level=3] [ref=e190]
            - paragraph [ref=e191]: "8 lessons · hoy, luego, siempre: two or three at a time"
        - button [ref=e194] [cursor=pointer]:
          - generic [ref=e198]:
            - heading "Numbers" [level=3] [ref=e199]
            - paragraph [ref=e200]: 35 lessons · cero to un millón, two or three at a time
      - region [ref=e203]:
        - generic [ref=e205]:
          - generic [ref=e206]: A LITTLE PRACTICE, A LASTING MEMORY
          - heading "Your pocket vocabulary" [level=2] [ref=e207]
          - paragraph [ref=e208]: Words from your completed vocabulary lessons, ready to remember.
        - generic [ref=e209]:
          - generic [ref=e210]:
            - generic [ref=e211]:
              - term [ref=e212]: To review
              - definition [ref=e213]: "0"
            - generic [ref=e214]:
              - term [ref=e215]: Reviewed today
              - definition [ref=e216]: "0"
            - generic [ref=e217]:
              - term [ref=e218]: Scheduled
              - definition [ref=e219]: "0"
            - generic [ref=e220]:
              - term [ref=e221]: Total flashcards
              - definition [ref=e222]: "0"
          - generic [ref=e223]:
            - generic [ref=e224]:
              - heading "Your collection starts with a lesson." [level=3] [ref=e225]
              - paragraph [ref=e226]: Add words from a topic below or complete a vocabulary lesson.
            - button "Explore lessons" [ref=e227] [cursor=pointer]
        - region [ref=e230]:
          - heading "Topics" [level=3] [ref=e231]
          - list [ref=e232]:
            - listitem [ref=e233]:
              - generic [ref=e234]: Everyday basics
              - generic [ref=e236]:
                - generic [ref=e237]: 36 total
                - generic [ref=e238]: 0 learning
                - generic [ref=e239]: 36 new
                - generic [ref=e240]: 0 known
              - button "Add 5 words" [ref=e241] [cursor=pointer]
            - listitem [ref=e242]:
              - generic [ref=e243]: Basic verbs
              - generic [ref=e245]:
                - generic [ref=e246]: 27 total
                - generic [ref=e247]: 0 learning
                - generic [ref=e248]: 27 new
                - generic [ref=e249]: 0 known
              - button "Add 5 words" [ref=e250] [cursor=pointer]
            - listitem [ref=e251]:
              - generic [ref=e252]: Basic adjectives
              - generic [ref=e254]:
                - generic [ref=e255]: 29 total
                - generic [ref=e256]: 0 learning
                - generic [ref=e257]: 29 new
                - generic [ref=e258]: 0 known
              - button "Add 5 words" [ref=e259] [cursor=pointer]
            - listitem [ref=e260]:
              - generic [ref=e261]: Adverbs of time and frequency
              - generic [ref=e263]:
                - generic [ref=e264]: 26 total
                - generic [ref=e265]: 0 learning
                - generic [ref=e266]: 26 new
                - generic [ref=e267]: 0 known
              - button "Add 5 words" [ref=e268] [cursor=pointer]
            - listitem [ref=e269]:
              - generic [ref=e270]: Colours
              - generic [ref=e272]:
                - generic [ref=e273]: 16 total
                - generic [ref=e274]: 0 learning
                - generic [ref=e275]: 16 new
                - generic [ref=e276]: 0 known
              - button "Add 5 words" [ref=e277] [cursor=pointer]
            - listitem [ref=e278]:
              - generic [ref=e279]: Groceries
              - generic [ref=e281]:
                - generic [ref=e282]: 16 total
                - generic [ref=e283]: 0 learning
                - generic [ref=e284]: 16 new
                - generic [ref=e285]: 0 known
              - button "Add 5 words" [ref=e286] [cursor=pointer]
            - listitem [ref=e287]:
              - generic [ref=e288]: Fruit
              - generic [ref=e290]:
                - generic [ref=e291]: 23 total
                - generic [ref=e292]: 0 learning
                - generic [ref=e293]: 23 new
                - generic [ref=e294]: 0 known
              - button "Add 5 words" [ref=e295] [cursor=pointer]
            - listitem [ref=e296]:
              - generic [ref=e297]: Vegetables
              - generic [ref=e299]:
                - generic [ref=e300]: 21 total
                - generic [ref=e301]: 0 learning
                - generic [ref=e302]: 21 new
                - generic [ref=e303]: 0 known
              - button "Add 5 words" [ref=e304] [cursor=pointer]
            - listitem [ref=e305]:
              - generic [ref=e306]: Meat
              - generic [ref=e308]:
                - generic [ref=e309]: 10 total
                - generic [ref=e310]: 0 learning
                - generic [ref=e311]: 10 new
                - generic [ref=e312]: 0 known
              - button "Add 5 words" [ref=e313] [cursor=pointer]
            - listitem [ref=e314]:
              - generic [ref=e315]: Fish and seafood
              - generic [ref=e317]:
                - generic [ref=e318]: 10 total
                - generic [ref=e319]: 0 learning
                - generic [ref=e320]: 10 new
                - generic [ref=e321]: 0 known
              - button "Add 5 words" [ref=e322] [cursor=pointer]
            - listitem [ref=e323]:
              - generic [ref=e324]: Sweets
              - generic [ref=e326]:
                - generic [ref=e327]: 12 total
                - generic [ref=e328]: 0 learning
                - generic [ref=e329]: 12 new
                - generic [ref=e330]: 0 known
              - button "Add 5 words" [ref=e331] [cursor=pointer]
            - listitem [ref=e332]:
              - generic [ref=e333]: Drinks
              - generic [ref=e335]:
                - generic [ref=e336]: 12 total
                - generic [ref=e337]: 0 learning
                - generic [ref=e338]: 12 new
                - generic [ref=e339]: 0 known
              - button "Add 5 words" [ref=e340] [cursor=pointer]
            - listitem [ref=e341]:
              - generic [ref=e342]: Kitchen
              - generic [ref=e344]:
                - generic [ref=e345]: 24 total
                - generic [ref=e346]: 0 learning
                - generic [ref=e347]: 24 new
                - generic [ref=e348]: 0 known
              - button "Add 5 words" [ref=e349] [cursor=pointer]
            - listitem [ref=e350]:
              - generic [ref=e351]: Home
              - generic [ref=e353]:
                - generic [ref=e354]: 33 total
                - generic [ref=e355]: 0 learning
                - generic [ref=e356]: 33 new
                - generic [ref=e357]: 0 known
              - button "Add 5 words" [ref=e358] [cursor=pointer]
            - listitem [ref=e359]:
              - generic [ref=e360]: Location
              - generic [ref=e362]:
                - generic [ref=e363]: 15 total
                - generic [ref=e364]: 0 learning
                - generic [ref=e365]: 15 new
                - generic [ref=e366]: 0 known
              - button "Add 5 words" [ref=e367] [cursor=pointer]
            - listitem [ref=e368]:
              - generic [ref=e369]: Emotions
              - generic [ref=e371]:
                - generic [ref=e372]: 18 total
                - generic [ref=e373]: 0 learning
                - generic [ref=e374]: 18 new
                - generic [ref=e375]: 0 known
              - button "Add 5 words" [ref=e376] [cursor=pointer]
            - listitem [ref=e377]:
              - generic [ref=e378]: Body parts
              - generic [ref=e380]:
                - generic [ref=e381]: 21 total
                - generic [ref=e382]: 0 learning
                - generic [ref=e383]: 21 new
                - generic [ref=e384]: 0 known
              - button "Add 5 words" [ref=e385] [cursor=pointer]
            - listitem [ref=e386]:
              - generic [ref=e387]: Appearance (nouns)
              - generic [ref=e389]:
                - generic [ref=e390]: 18 total
                - generic [ref=e391]: 0 learning
                - generic [ref=e392]: 18 new
                - generic [ref=e393]: 0 known
              - button "Add 5 words" [ref=e394] [cursor=pointer]
            - listitem [ref=e395]:
              - generic [ref=e396]:
                - generic [ref=e397]: Appearance (verbs)
                - generic [ref=e398]: Optional
              - generic [ref=e399]:
                - generic [ref=e400]: 8 total
                - generic [ref=e401]: 0 learning
                - generic [ref=e402]: 8 new
                - generic [ref=e403]: 0 known
              - button "Add 5 words" [ref=e404] [cursor=pointer]
            - listitem [ref=e405]:
              - generic [ref=e406]: Appearance (adjectives)
              - generic [ref=e408]:
                - generic [ref=e409]: 2 total
                - generic [ref=e410]: 0 learning
                - generic [ref=e411]: 2 new
                - generic [ref=e412]: 0 known
              - button "Add 2 words" [ref=e413] [cursor=pointer]
            - listitem [ref=e414]:
              - generic [ref=e415]: Clothes
              - generic [ref=e417]:
                - generic [ref=e418]: 27 total
                - generic [ref=e419]: 0 learning
                - generic [ref=e420]: 27 new
                - generic [ref=e421]: 0 known
              - button "Add 5 words" [ref=e422] [cursor=pointer]
            - listitem [ref=e423]:
              - generic [ref=e424]:
                - generic [ref=e425]: Jewellery
                - generic [ref=e426]: Optional
              - generic [ref=e427]:
                - generic [ref=e428]: 7 total
                - generic [ref=e429]: 0 learning
                - generic [ref=e430]: 7 new
                - generic [ref=e431]: 0 known
              - button "Add 5 words" [ref=e432] [cursor=pointer]
            - listitem [ref=e433]:
              - generic [ref=e434]: Work
              - generic [ref=e436]:
                - generic [ref=e437]: 20 total
                - generic [ref=e438]: 0 learning
                - generic [ref=e439]: 20 new
                - generic [ref=e440]: 0 known
              - button "Add 5 words" [ref=e441] [cursor=pointer]
            - listitem [ref=e442]:
              - generic [ref=e443]: Health (nouns)
              - generic [ref=e445]:
                - generic [ref=e446]: 18 total
                - generic [ref=e447]: 0 learning
                - generic [ref=e448]: 18 new
                - generic [ref=e449]: 0 known
              - button "Add 5 words" [ref=e450] [cursor=pointer]
            - listitem [ref=e451]:
              - generic [ref=e452]: Health (verbs)
              - generic [ref=e454]:
                - generic [ref=e455]: 18 total
                - generic [ref=e456]: 0 learning
                - generic [ref=e457]: 18 new
                - generic [ref=e458]: 0 known
              - button "Add 5 words" [ref=e459] [cursor=pointer]
            - listitem [ref=e460]:
              - generic [ref=e461]: Weather
              - generic [ref=e463]:
                - generic [ref=e464]: 18 total
                - generic [ref=e465]: 0 learning
                - generic [ref=e466]: 18 new
                - generic [ref=e467]: 0 known
              - button "Add 5 words" [ref=e468] [cursor=pointer]
            - listitem [ref=e469]:
              - generic [ref=e470]: Days of the week
              - generic [ref=e472]:
                - generic [ref=e473]: 7 total
                - generic [ref=e474]: 0 learning
                - generic [ref=e475]: 7 new
                - generic [ref=e476]: 0 known
              - button "Add 5 words" [ref=e477] [cursor=pointer]
            - listitem [ref=e478]:
              - generic [ref=e479]: Months and seasons
              - generic [ref=e481]:
                - generic [ref=e482]: 16 total
                - generic [ref=e483]: 0 learning
                - generic [ref=e484]: 16 new
                - generic [ref=e485]: 0 known
              - button "Add 5 words" [ref=e486] [cursor=pointer]
            - listitem [ref=e487]:
              - generic [ref=e488]: Family
              - generic [ref=e490]:
                - generic [ref=e491]: 27 total
                - generic [ref=e492]: 0 learning
                - generic [ref=e493]: 27 new
                - generic [ref=e494]: 0 known
              - button "Add 5 words" [ref=e495] [cursor=pointer]
            - listitem [ref=e496]:
              - generic [ref=e497]: Animals
              - generic [ref=e499]:
                - generic [ref=e500]: 26 total
                - generic [ref=e501]: 0 learning
                - generic [ref=e502]: 26 new
                - generic [ref=e503]: 0 known
              - button "Add 5 words" [ref=e504] [cursor=pointer]
            - listitem [ref=e505]:
              - generic [ref=e506]: Travel (nouns)
              - generic [ref=e508]:
                - generic [ref=e509]: 28 total
                - generic [ref=e510]: 0 learning
                - generic [ref=e511]: 28 new
                - generic [ref=e512]: 0 known
              - button "Add 5 words" [ref=e513] [cursor=pointer]
            - listitem [ref=e514]:
              - generic [ref=e515]: Travel (verbs)
              - generic [ref=e517]:
                - generic [ref=e518]: 14 total
                - generic [ref=e519]: 0 learning
                - generic [ref=e520]: 14 new
                - generic [ref=e521]: 0 known
              - button "Add 5 words" [ref=e522] [cursor=pointer]
            - listitem [ref=e523]:
              - generic [ref=e524]: Public transport
              - generic [ref=e526]:
                - generic [ref=e527]: 17 total
                - generic [ref=e528]: 0 learning
                - generic [ref=e529]: 17 new
                - generic [ref=e530]: 0 known
              - button "Add 5 words" [ref=e531] [cursor=pointer]
            - listitem [ref=e532]:
              - generic [ref=e533]: Shopping (nouns)
              - generic [ref=e535]:
                - generic [ref=e536]: 19 total
                - generic [ref=e537]: 0 learning
                - generic [ref=e538]: 19 new
                - generic [ref=e539]: 0 known
              - button "Add 5 words" [ref=e540] [cursor=pointer]
            - listitem [ref=e541]:
              - generic [ref=e542]: Shopping (verbs)
              - generic [ref=e544]:
                - generic [ref=e545]: 2 total
                - generic [ref=e546]: 0 learning
                - generic [ref=e547]: 2 new
                - generic [ref=e548]: 0 known
              - button "Add 2 words" [ref=e549] [cursor=pointer]
            - listitem [ref=e550]:
              - generic [ref=e551]:
                - generic [ref=e552]: Business
                - generic [ref=e553]: Optional
              - generic [ref=e554]:
                - generic [ref=e555]: 20 total
                - generic [ref=e556]: 0 learning
                - generic [ref=e557]: 20 new
                - generic [ref=e558]: 0 known
              - button "Add 5 words" [ref=e559] [cursor=pointer]
            - listitem [ref=e560]:
              - generic [ref=e561]: Sport (nouns)
              - generic [ref=e563]:
                - generic [ref=e564]: 23 total
                - generic [ref=e565]: 0 learning
                - generic [ref=e566]: 23 new
                - generic [ref=e567]: 0 known
              - button "Add 5 words" [ref=e568] [cursor=pointer]
            - listitem [ref=e569]:
              - generic [ref=e570]: Sport (verbs)
              - generic [ref=e572]:
                - generic [ref=e573]: 15 total
                - generic [ref=e574]: 0 learning
                - generic [ref=e575]: 15 new
                - generic [ref=e576]: 0 known
              - button "Add 5 words" [ref=e577] [cursor=pointer]
            - listitem [ref=e578]:
              - generic [ref=e579]: School (nouns)
              - generic [ref=e581]:
                - generic [ref=e582]: 23 total
                - generic [ref=e583]: 0 learning
                - generic [ref=e584]: 23 new
                - generic [ref=e585]: 0 known
              - button "Add 5 words" [ref=e586] [cursor=pointer]
            - listitem [ref=e587]:
              - generic [ref=e588]: School (verbs)
              - generic [ref=e590]:
                - generic [ref=e591]: 10 total
                - generic [ref=e592]: 0 learning
                - generic [ref=e593]: 10 new
                - generic [ref=e594]: 0 known
              - button "Add 5 words" [ref=e595] [cursor=pointer]
            - listitem [ref=e596]:
              - generic [ref=e597]: Beach
              - generic [ref=e599]:
                - generic [ref=e600]: 19 total
                - generic [ref=e601]: 0 learning
                - generic [ref=e602]: 19 new
                - generic [ref=e603]: 0 known
              - button "Add 5 words" [ref=e604] [cursor=pointer]
            - listitem [ref=e605]:
              - generic [ref=e606]:
                - generic [ref=e607]: Art
                - generic [ref=e608]: Optional
              - generic [ref=e609]:
                - generic [ref=e610]: 21 total
                - generic [ref=e611]: 0 learning
                - generic [ref=e612]: 21 new
                - generic [ref=e613]: 0 known
              - button "Add 5 words" [ref=e614] [cursor=pointer]
            - listitem [ref=e615]:
              - generic [ref=e616]:
                - generic [ref=e617]: Cinema
                - generic [ref=e618]: Optional
              - generic [ref=e619]:
                - generic [ref=e620]: 26 total
                - generic [ref=e621]: 0 learning
                - generic [ref=e622]: 26 new
                - generic [ref=e623]: 0 known
              - button "Add 5 words" [ref=e624] [cursor=pointer]
            - listitem [ref=e625]:
              - generic [ref=e626]:
                - generic [ref=e627]: Music
                - generic [ref=e628]: Optional
              - generic [ref=e629]:
                - generic [ref=e630]: 12 total
                - generic [ref=e631]: 0 learning
                - generic [ref=e632]: 12 new
                - generic [ref=e633]: 0 known
              - button "Add 5 words" [ref=e634] [cursor=pointer]
            - listitem [ref=e635]:
              - generic [ref=e636]:
                - generic [ref=e637]: Finance
                - generic [ref=e638]: Optional
              - generic [ref=e639]:
                - generic [ref=e640]: 17 total
                - generic [ref=e641]: 0 learning
                - generic [ref=e642]: 17 new
                - generic [ref=e643]: 0 known
              - button "Add 5 words" [ref=e644] [cursor=pointer]
            - listitem [ref=e645]:
              - generic [ref=e646]:
                - generic [ref=e647]: Environment
                - generic [ref=e648]: Optional
              - generic [ref=e649]:
                - generic [ref=e650]: 12 total
                - generic [ref=e651]: 0 learning
                - generic [ref=e652]: 12 new
                - generic [ref=e653]: 0 known
              - button "Add 5 words" [ref=e654] [cursor=pointer]
            - listitem [ref=e655]:
              - generic [ref=e656]:
                - generic [ref=e657]: Media
                - generic [ref=e658]: Optional
              - generic [ref=e659]:
                - generic [ref=e660]: 10 total
                - generic [ref=e661]: 0 learning
                - generic [ref=e662]: 10 new
                - generic [ref=e663]: 0 known
              - button "Add 5 words" [ref=e664] [cursor=pointer]
            - listitem [ref=e665]:
              - generic [ref=e666]:
                - generic [ref=e667]: Internet (nouns)
                - generic [ref=e668]: Optional
              - generic [ref=e669]:
                - generic [ref=e670]: 18 total
                - generic [ref=e671]: 0 learning
                - generic [ref=e672]: 18 new
                - generic [ref=e673]: 0 known
              - button "Add 5 words" [ref=e674] [cursor=pointer]
            - listitem [ref=e675]:
              - generic [ref=e676]:
                - generic [ref=e677]: Internet (verbs)
                - generic [ref=e678]: Optional
              - generic [ref=e679]:
                - generic [ref=e680]: 17 total
                - generic [ref=e681]: 0 learning
                - generic [ref=e682]: 17 new
                - generic [ref=e683]: 0 known
              - button "Add 5 words" [ref=e684] [cursor=pointer]
            - listitem [ref=e685]:
              - generic [ref=e686]: Countries (Europe)
              - generic [ref=e688]:
                - generic [ref=e689]: 23 total
                - generic [ref=e690]: 0 learning
                - generic [ref=e691]: 23 new
                - generic [ref=e692]: 0 known
              - button "Add 5 words" [ref=e693] [cursor=pointer]
            - listitem [ref=e694]:
              - generic [ref=e695]: Holidays
              - generic [ref=e697]:
                - generic [ref=e698]: 14 total
                - generic [ref=e699]: 0 learning
                - generic [ref=e700]: 14 new
                - generic [ref=e701]: 0 known
              - button "Add 5 words" [ref=e702] [cursor=pointer]
      - generic [ref=e703]:
        - generic [ref=e704]: paso a paso ✦
        - button "Independent practice · Official sources inside" [ref=e705] [cursor=pointer]
  - dialog "Picture a little Spanish" [ref=e708]:
    - banner [ref=e709]:
      - button "Close lesson" [ref=e710] [cursor=pointer]
      - generic [ref=e713]:
        - generic [ref=e714]: PRACTICE
        - heading "Picture a little Spanish" [level=3] [ref=e715]
      - generic [ref=e716]: 1 / 6
    - progressbar "Lesson progress" [ref=e717]
    - generic [ref=e719]:
      - generic [ref=e720]:
        - text: reading
        - generic [ref=e722]: /
        - text: A small step forward
      - paragraph [ref=e724]: Look at the café illustration
      - heading "¿Qué hay sobre la mesa?" [level=2] [ref=e726]
      - img "Illustrated café counter with coffee and bread" [ref=e727]
      - generic [ref=e728]:
        - button "Un billete y una maleta." [ref=e729] [cursor=pointer]:
          - generic [ref=e730]: "1"
        - button "Un café y pan." [ref=e732] [cursor=pointer]:
          - generic [ref=e733]: "2"
        - button "Un teléfono y libros." [ref=e735] [cursor=pointer]:
          - generic [ref=e736]: "3"
      - generic [ref=e738]: Take your time. Every mistake is a chance to learn.
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