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

  913 pixels (ratio 0.01 of all image pixels) are different.

  Snapshot: question-last-time.png

Call log:
  - Expect "toHaveScreenshot(question-last-time.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 913 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 913 pixels (ratio 0.01 of all image pixels) are different.

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
      - generic [ref=f1e63]:
        - text: Your Spanish journey
        - strong [ref=f1e66]: Learning path
      - generic [ref=f1e67]:
        - generic "Consecutive practice days" [ref=f1e68]:
          - generic [ref=f1e71]: "3"
          - generic [ref=f1e72]: day streak
        - generic [ref=f1e73]:
          - generic [ref=f1e76]: "35"
          - text: XP
        - button "Open your learning preferences" [ref=f1e77] [cursor=pointer]: P
    - main [ref=f1e78]:
      - generic [ref=f1e79]:
        - generic [ref=f1e80]:
          - generic [ref=f1e81]: FROM YOUR FIRST HOLA TO YOUR A1
          - heading "Every step has a story." [level=1] [ref=f1e82]
          - paragraph [ref=f1e83]: 29 units · 117 lessons · 1534 exercises. Explore freely, or follow the path.
        - generic [ref=f1e84]:
          - generic [ref=f1e85]: PASO A PASO
          - generic [ref=f1e89]: YOUR JOURNEY STARTS HERE
      - generic [ref=f1e90]:
        - generic [ref=f1e94]:
          - generic [ref=f1e95]: YOUR NEXT SMALL STEP
          - heading "¡Hola, mundo! · Make the words work" [level=3] [ref=f1e96]
          - paragraph [ref=f1e97]: 1/117 complete · 1% of your path
        - button "Continue learning" [ref=f1e98] [cursor=pointer]
      - generic [ref=f1e101]:
        - generic [ref=f1e102]:
          - generic [ref=f1e103]:
            - generic [ref=f1e104]: "01"
            - article [ref=f1e105]:
              - button "UNIT 01 · Primeros pasos ¡Hola, mundo! Say hello. Make your first connection. 1/4 lessons" [expanded] [ref=f1e106] [cursor=pointer]:
                - generic [ref=f1e110]:
                  - generic [ref=f1e111]: UNIT 01 · Primeros pasos
                  - heading "¡Hola, mundo!" [level=3] [ref=f1e112]
                  - paragraph [ref=f1e113]: Say hello. Make your first connection.
                - generic [ref=f1e114]: 1/4 lessons
              - generic [ref=f1e118]:
                - generic [ref=f1e119]:
                  - generic [ref=f1e120]: Greet and introduce yourself
                  - generic [ref=f1e123]: Use ser and llamarse
                  - generic [ref=f1e126]: Spell names and ask for repetition
                - generic [ref=f1e129]:
                  - button "Words to take with you Discover vocabulary · listen & choose 4 min" [ref=f1e130] [cursor=pointer]:
                    - generic [ref=f1e132]:
                      - strong [ref=f1e133]: Words to take with you
                      - generic [ref=f1e134]: Discover vocabulary · listen & choose
                    - generic [ref=f1e135]: 4 min
                  - button "Make the words work Understand patterns · guided grammar 4 min" [ref=f1e138] [cursor=pointer]:
                    - generic [ref=f1e142]:
                      - strong [ref=f1e143]: Make the words work
                      - generic [ref=f1e144]: Understand patterns · guided grammar
                    - generic [ref=f1e145]: 4 min
                  - button "A little real life Read & listen · everyday situations 5 min" [ref=f1e148] [cursor=pointer]:
                    - generic [ref=f1e152]:
                      - strong [ref=f1e153]: A little real life
                      - generic [ref=f1e154]: Read & listen · everyday situations
                    - generic [ref=f1e155]: 5 min
                  - button "Make it your own Build, write & speak · your turn 8 min" [ref=f1e158] [cursor=pointer]:
                    - generic [ref=f1e162]:
                      - strong [ref=f1e163]: Make it your own
                      - generic [ref=f1e164]: Build, write & speak · your turn
                    - generic [ref=f1e165]: 8 min
                - group [ref=f1e168]:
                  - generic "A little pattern to remember" [ref=f1e169] [cursor=pointer]
          - generic [ref=f1e172]:
            - generic [ref=f1e173]: "02"
            - article [ref=f1e174]:
              - button "UNIT 02 · Así soy yo This is me Names, numbers and your little corner of the world. 4 lessons" [ref=f1e175] [cursor=pointer]:
                - generic [ref=f1e179]:
                  - generic [ref=f1e180]: UNIT 02 · Así soy yo
                  - heading "This is me" [level=3] [ref=f1e181]
                  - paragraph [ref=f1e182]: Names, numbers and your little corner of the world.
                - generic [ref=f1e183]: 4 lessons
          - generic [ref=f1e187]:
            - generic [ref=f1e188]: "03"
            - article [ref=f1e189]:
              - button "UNIT 03 · Part 1 of 6 Numbers cero to siete 5 lessons" [ref=f1e190] [cursor=pointer]:
                - generic [ref=f1e194]:
                  - generic [ref=f1e195]: UNIT 03 · Part 1 of 6
                  - heading "Numbers" [level=3] [ref=f1e196]
                  - paragraph [ref=f1e197]: cero to siete
                - generic [ref=f1e198]: 5 lessons
          - generic [ref=f1e202]:
            - generic [ref=f1e203]: "04"
            - article [ref=f1e204]:
              - button "UNIT 04 · Part 2 of 6 Numbers ocho to quince 5 lessons" [ref=f1e205] [cursor=pointer]:
                - generic [ref=f1e209]:
                  - generic [ref=f1e210]: UNIT 04 · Part 2 of 6
                  - heading "Numbers" [level=3] [ref=f1e211]
                  - paragraph [ref=f1e212]: ocho to quince
                - generic [ref=f1e213]: 5 lessons
          - generic [ref=f1e217]:
            - generic [ref=f1e218]: "05"
            - article [ref=f1e219]:
              - button "UNIT 05 · Mi gente My favorite people Family, friends and the words that bring you together. 4 lessons" [ref=f1e220] [cursor=pointer]:
                - generic [ref=f1e224]:
                  - generic [ref=f1e225]: UNIT 05 · Mi gente
                  - heading "My favorite people" [level=3] [ref=f1e226]
                  - paragraph [ref=f1e227]: Family, friends and the words that bring you together.
                - generic [ref=f1e228]: 4 lessons
          - generic [ref=f1e232]:
            - generic [ref=f1e233]: "06"
            - article [ref=f1e234]:
              - button "UNIT 06 · Part 3 of 6 Numbers dieciséis to veintinueve 4 lessons" [ref=f1e235] [cursor=pointer]:
                - generic [ref=f1e239]:
                  - generic [ref=f1e240]: UNIT 06 · Part 3 of 6
                  - heading "Numbers" [level=3] [ref=f1e241]
                  - paragraph [ref=f1e242]: dieciséis to veintinueve
                - generic [ref=f1e243]: 4 lessons
          - generic [ref=f1e247]:
            - generic [ref=f1e248]: "07"
            - article [ref=f1e249]:
              - button "UNIT 07 · En casa A place called home Open the door. Find your words. 4 lessons" [ref=f1e250] [cursor=pointer]:
                - generic [ref=f1e254]:
                  - generic [ref=f1e255]: UNIT 07 · En casa
                  - heading "A place called home" [level=3] [ref=f1e256]
                  - paragraph [ref=f1e257]: Open the door. Find your words.
                - generic [ref=f1e258]: 4 lessons
          - generic [ref=f1e262]:
            - generic [ref=f1e263]: "08"
            - article [ref=f1e264]:
              - button "UNIT 08 · Part 1 of 3 Where things are en, dentro de, fuera de, encima de, debajo de 3 lessons" [ref=f1e265] [cursor=pointer]:
                - generic [ref=f1e269]:
                  - generic [ref=f1e270]: UNIT 08 · Part 1 of 3
                  - heading "Where things are" [level=3] [ref=f1e271]
                  - paragraph [ref=f1e272]: en, dentro de, fuera de, encima de, debajo de
                - generic [ref=f1e273]: 3 lessons
          - generic [ref=f1e277]:
            - generic [ref=f1e278]: "09"
            - article [ref=f1e279]:
              - button "UNIT 09 · Part 2 of 3 Where things are delante de, detrás de, enfrente de, al lado de, entre 3 lessons" [ref=f1e280] [cursor=pointer]:
                - generic [ref=f1e284]:
                  - generic [ref=f1e285]: UNIT 09 · Part 2 of 3
                  - heading "Where things are" [level=3] [ref=f1e286]
                  - paragraph [ref=f1e287]: delante de, detrás de, enfrente de, al lado de, entre
                - generic [ref=f1e288]: 3 lessons
          - generic [ref=f1e292]:
            - generic [ref=f1e293]: "10"
            - article [ref=f1e294]:
              - button "UNIT 10 · Part 3 of 3 Where things are cerca de, lejos de, a la izquierda de, a la derecha de 3 lessons" [ref=f1e295] [cursor=pointer]:
                - generic [ref=f1e299]:
                  - generic [ref=f1e300]: UNIT 10 · Part 3 of 3
                  - heading "Where things are" [level=3] [ref=f1e301]
                  - paragraph [ref=f1e302]: cerca de, lejos de, a la izquierda de, a la derecha de
                - generic [ref=f1e303]: 3 lessons
          - generic [ref=f1e307]:
            - generic [ref=f1e308]: "11"
            - article [ref=f1e309]:
              - button "UNIT 11 · Part 4 of 6 Numbers treinta to cien 5 lessons" [ref=f1e310] [cursor=pointer]:
                - generic [ref=f1e314]:
                  - generic [ref=f1e315]: UNIT 11 · Part 4 of 6
                  - heading "Numbers" [level=3] [ref=f1e316]
                  - paragraph [ref=f1e317]: treinta to cien
                - generic [ref=f1e318]: 5 lessons
          - generic [ref=f1e322]:
            - generic [ref=f1e323]: "12"
            - article [ref=f1e324]:
              - button "UNIT 12 · Mi día a día A day in my life From the first coffee to buenas noches. 4 lessons" [ref=f1e325] [cursor=pointer]:
                - generic [ref=f1e329]:
                  - generic [ref=f1e330]: UNIT 12 · Mi día a día
                  - heading "A day in my life" [level=3] [ref=f1e331]
                  - paragraph [ref=f1e332]: From the first coffee to buenas noches.
                - generic [ref=f1e333]: 4 lessons
          - generic [ref=f1e337]:
            - generic [ref=f1e338]: "13"
            - article [ref=f1e339]:
              - button "UNIT 13 · Part 1 of 2 Weekdays lunes to viernes 3 lessons" [ref=f1e340] [cursor=pointer]:
                - generic [ref=f1e344]:
                  - generic [ref=f1e345]: UNIT 13 · Part 1 of 2
                  - heading "Weekdays" [level=3] [ref=f1e346]
                  - paragraph [ref=f1e347]: lunes to viernes
                - generic [ref=f1e348]: 3 lessons
          - generic [ref=f1e352]:
            - generic [ref=f1e353]: "14"
            - article [ref=f1e354]:
              - button "UNIT 14 · Part 2 of 2 Weekdays the weekend and the whole week 2 lessons" [ref=f1e355] [cursor=pointer]:
                - generic [ref=f1e359]:
                  - generic [ref=f1e360]: UNIT 14 · Part 2 of 2
                  - heading "Weekdays" [level=3] [ref=f1e361]
                  - paragraph [ref=f1e362]: the weekend and the whole week
                - generic [ref=f1e363]: 2 lessons
          - generic [ref=f1e367]:
            - generic [ref=f1e368]: "15"
            - article [ref=f1e369]:
              - button "UNIT 15 · Part 1 of 2 Time words hoy, ahora, antes, temprano and more 4 lessons" [ref=f1e370] [cursor=pointer]:
                - generic [ref=f1e374]:
                  - generic [ref=f1e375]: UNIT 15 · Part 1 of 2
                  - heading "Time words" [level=3] [ref=f1e376]
                  - paragraph [ref=f1e377]: hoy, ahora, antes, temprano and more
                - generic [ref=f1e378]: 4 lessons
          - generic [ref=f1e382]:
            - generic [ref=f1e383]: "16"
            - article [ref=f1e384]:
              - button "UNIT 16 · Part 2 of 2 Time words por la mañana, siempre, desde and more 4 lessons" [ref=f1e385] [cursor=pointer]:
                - generic [ref=f1e389]:
                  - generic [ref=f1e390]: UNIT 16 · Part 2 of 2
                  - heading "Time words" [level=3] [ref=f1e391]
                  - paragraph [ref=f1e392]: por la mañana, siempre, desde and more
                - generic [ref=f1e393]: 4 lessons
          - generic [ref=f1e397]:
            - generic [ref=f1e398]: "17"
            - article [ref=f1e399]:
              - button "UNIT 17 · ¡Buen provecho! A table for two Order something delicious. Make yourself understood. 4 lessons" [ref=f1e400] [cursor=pointer]:
                - generic [ref=f1e404]:
                  - generic [ref=f1e405]: UNIT 17 · ¡Buen provecho!
                  - heading "A table for two" [level=3] [ref=f1e406]
                  - paragraph [ref=f1e407]: Order something delicious. Make yourself understood.
                - generic [ref=f1e408]: 4 lessons
          - generic [ref=f1e412]:
            - generic [ref=f1e413]: "18"
            - article [ref=f1e414]:
              - button "UNIT 18 · Por el barrio Around the neighborhood Find your way, one conversation at a time. 4 lessons" [ref=f1e415] [cursor=pointer]:
                - generic [ref=f1e419]:
                  - generic [ref=f1e420]: UNIT 18 · Por el barrio
                  - heading "Around the neighborhood" [level=3] [ref=f1e421]
                  - paragraph [ref=f1e422]: Find your way, one conversation at a time.
                - generic [ref=f1e423]: 4 lessons
          - generic [ref=f1e427]:
            - generic [ref=f1e428]: "19"
            - article [ref=f1e429]:
              - button "UNIT 19 · De compras A little shopping Colors, sizes and something just right. 4 lessons" [ref=f1e430] [cursor=pointer]:
                - generic [ref=f1e434]:
                  - generic [ref=f1e435]: UNIT 19 · De compras
                  - heading "A little shopping" [level=3] [ref=f1e436]
                  - paragraph [ref=f1e437]: Colors, sizes and something just right.
                - generic [ref=f1e438]: 4 lessons
          - generic [ref=f1e442]:
            - generic [ref=f1e443]: "20"
            - article [ref=f1e444]:
              - button "UNIT 20 · Part 5 of 6 Numbers cien to un millón 8 lessons" [ref=f1e445] [cursor=pointer]:
                - generic [ref=f1e449]:
                  - generic [ref=f1e450]: UNIT 20 · Part 5 of 6
                  - heading "Numbers" [level=3] [ref=f1e451]
                  - paragraph [ref=f1e452]: cien to un millón
                - generic [ref=f1e453]: 8 lessons
          - generic [ref=f1e457]:
            - generic [ref=f1e458]: "21"
            - article [ref=f1e459]:
              - button "UNIT 21 · Tiempo libre Life beyond work The things you love and the people you meet. 4 lessons" [ref=f1e460] [cursor=pointer]:
                - generic [ref=f1e464]:
                  - generic [ref=f1e465]: UNIT 21 · Tiempo libre
                  - heading "Life beyond work" [level=3] [ref=f1e466]
                  - paragraph [ref=f1e467]: The things you love and the people you meet.
                - generic [ref=f1e468]: 4 lessons
          - generic [ref=f1e472]:
            - generic [ref=f1e473]: "22"
            - article [ref=f1e474]:
              - button "UNIT 22 · Part 1 of 4 Asking questions qué, cómo, dónde, cuándo 3 lessons" [ref=f1e475] [cursor=pointer]:
                - generic [ref=f1e479]:
                  - generic [ref=f1e480]: UNIT 22 · Part 1 of 4
                  - heading "Asking questions" [level=3] [ref=f1e481]
                  - paragraph [ref=f1e482]: qué, cómo, dónde, cuándo
                - generic [ref=f1e483]: 3 lessons
          - generic [ref=f1e487]:
            - generic [ref=f1e488]: "23"
            - article [ref=f1e489]:
              - button "UNIT 23 · Part 2 of 4 Asking questions quién, cuál, cuánto, por qué 3 lessons" [ref=f1e490] [cursor=pointer]:
                - generic [ref=f1e494]:
                  - generic [ref=f1e495]: UNIT 23 · Part 2 of 4
                  - heading "Asking questions" [level=3] [ref=f1e496]
                  - paragraph [ref=f1e497]: quién, cuál, cuánto, por qué
                - generic [ref=f1e498]: 3 lessons
          - generic [ref=f1e502]:
            - generic [ref=f1e503]: "24"
            - article [ref=f1e504]:
              - button "UNIT 24 · ¡Buen viaje! A ticket to somewhere Trains, check-ins and your next small adventure. 4 lessons" [ref=f1e505] [cursor=pointer]:
                - generic [ref=f1e509]:
                  - generic [ref=f1e510]: UNIT 24 · ¡Buen viaje!
                  - heading "A ticket to somewhere" [level=3] [ref=f1e511]
                  - paragraph [ref=f1e512]: Trains, check-ins and your next small adventure.
                - generic [ref=f1e513]: 4 lessons
          - generic [ref=f1e517]:
            - generic [ref=f1e518]: "25"
            - article [ref=f1e519]:
              - button "UNIT 25 · Part 3 of 4 Asking questions de dónde, adónde, a qué hora, con quién 3 lessons" [ref=f1e520] [cursor=pointer]:
                - generic [ref=f1e524]:
                  - generic [ref=f1e525]: UNIT 25 · Part 3 of 4
                  - heading "Asking questions" [level=3] [ref=f1e526]
                  - paragraph [ref=f1e527]: de dónde, adónde, a qué hora, con quién
                - generic [ref=f1e528]: 3 lessons
          - generic [ref=f1e532]:
            - generic [ref=f1e533]: "26"
            - article [ref=f1e534]:
              - button "UNIT 26 · ¿Qué tal estás? Come rain or shine Talk about the weather and how you feel. 4 lessons" [ref=f1e535] [cursor=pointer]:
                - generic [ref=f1e539]:
                  - generic [ref=f1e540]: UNIT 26 · ¿Qué tal estás?
                  - heading "Come rain or shine" [level=3] [ref=f1e541]
                  - paragraph [ref=f1e542]: Talk about the weather and how you feel.
                - generic [ref=f1e543]: 4 lessons
          - generic [ref=f1e547]:
            - generic [ref=f1e548]: "27"
            - article [ref=f1e549]:
              - button "UNIT 27 · Part 4 of 4 Asking questions desde cuándo, hasta cuándo, cada cuánto, de quién, para qué, por dónde 3 lessons" [ref=f1e550] [cursor=pointer]:
                - generic [ref=f1e554]:
                  - generic [ref=f1e555]: UNIT 27 · Part 4 of 4
                  - heading "Asking questions" [level=3] [ref=f1e556]
                  - paragraph [ref=f1e557]: desde cuándo, hasta cuándo, cada cuánto, de quién, para qué, por dónde
                - generic [ref=f1e558]: 3 lessons
          - generic [ref=f1e562]:
            - generic [ref=f1e563]: "28"
            - article [ref=f1e564]:
              - button "UNIT 28 · Part 6 of 6 Numbers years, dates, times and prices 8 lessons" [ref=f1e565] [cursor=pointer]:
                - generic [ref=f1e569]:
                  - generic [ref=f1e570]: UNIT 28 · Part 6 of 6
                  - heading "Numbers" [level=3] [ref=f1e571]
                  - paragraph [ref=f1e572]: years, dates, times and prices
                - generic [ref=f1e573]: 8 lessons
          - generic [ref=f1e577]:
            - generic [ref=f1e578]: "29"
            - article [ref=f1e579]:
              - button "UNIT 29 · ¡Tú puedes! Ready for your next chapter Bring it all together. Walk in with confidence. 4 lessons" [ref=f1e580] [cursor=pointer]:
                - generic [ref=f1e584]:
                  - generic [ref=f1e585]: UNIT 29 · ¡Tú puedes!
                  - heading "Ready for your next chapter" [level=3] [ref=f1e586]
                  - paragraph [ref=f1e587]: Bring it all together. Walk in with confidence.
                - generic [ref=f1e588]: 4 lessons
          - generic [ref=f1e592]:
            - generic [ref=f1e595]:
              - heading "The next chapter is yours." [level=3] [ref=f1e596]
              - paragraph [ref=f1e597]: Put your skills together in the exam rehearsal.
            - button "Meet the exam" [ref=f1e598] [cursor=pointer]
        - complementary [ref=f1e601]:
          - generic [ref=f1e602]: HOW YOUR PATH WORKS
          - heading "Learn it. Try it. Make it yours." [level=3] [ref=f1e603]: Learn it. Try it.Make it yours.
          - generic [ref=f1e607]:
            - heading "Discover the words" [level=4] [ref=f1e608]
            - paragraph [ref=f1e609]: Connect Spanish words with meaning and sound.
          - generic [ref=f1e613]:
            - heading "Understand the pattern" [level=4] [ref=f1e614]
            - paragraph [ref=f1e615]: Learn the why behind each answer.
          - generic [ref=f1e619]:
            - heading "Meet real life" [level=4] [ref=f1e620]
            - paragraph [ref=f1e621]: Read a message. Listen to a conversation.
          - generic [ref=f1e625]:
            - heading "Use your own voice" [level=4] [ref=f1e626]
            - paragraph [ref=f1e627]: Write, talk to Lucía and reflect on your progress.
          - paragraph [ref=f1e628]: All lessons are open. Completion tracks practice, not exam readiness. Review mistakes and use the A1 checklist to find gaps.
      - generic [ref=f1e629]:
        - generic [ref=f1e630]: Made for the joy of getting there.
        - generic [ref=f1e631]: paso a paso ✦
        - button "Independent practice · Official sources inside" [ref=f1e632] [cursor=pointer]
  - dialog "Words to take with you" [ref=f1e635]:
    - banner [ref=f1e636]:
      - button "Close lesson" [ref=f1e637] [cursor=pointer]
      - generic [ref=f1e640]:
        - generic [ref=f1e641]: UNIT 1 · LESSON 1
        - heading "Words to take with you" [level=3] [ref=f1e642]
      - generic [ref=f1e643]: 1 / 8
    - progressbar "Lesson progress" [ref=f1e644]
    - generic [ref=f1e646]:
      - generic [ref=f1e647]:
        - text: reading
        - generic [ref=f1e649]: /
        - text: A small step forward
        - paragraph [ref=f1e650]:
          - text: "Last time: Wrong ·"
          - time [ref=f1e651]: 08/09/2026
      - heading "What does “hola” mean?" [level=2] [ref=f1e653]
      - img "Vocabulary illustration" [ref=f1e654]
      - generic [ref=f1e655]:
        - button "hello" [ref=f1e656] [cursor=pointer]:
          - generic [ref=f1e657]: "1"
        - button "thank you" [ref=f1e659] [cursor=pointer]:
          - generic [ref=f1e660]: "2"
        - button "good evening / good night" [ref=f1e662] [cursor=pointer]:
          - generic [ref=f1e663]: "3"
      - generic [ref=f1e665]: Take your time. Every mistake is a chance to learn.
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