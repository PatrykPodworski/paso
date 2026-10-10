# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual/views.spec.ts >> guide failing score groups and checklist
- Location: tests/visual/views.spec.ts:135:1

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  Expected an image 1440px by 4624px, received 1440px by 4620px. 163460 pixels (ratio 0.03 of all image pixels) are different.

  Snapshot: guide-below-threshold.png

Call log:
  - Expect "toHaveScreenshot(guide-below-threshold.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 1440px by 4624px, received 1440px by 4620px. 163460 pixels (ratio 0.03 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - Expected an image 1440px by 4624px, received 1440px by 4620px. 163460 pixels (ratio 0.03 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Skip to content" [ref=e4] [cursor=pointer]:
    - /url: "#main-content"
  - complementary [ref=e5]:
    - link "Paso home" [ref=e6] [cursor=pointer]:
      - /url: "#today"
      - generic [ref=e7]:
        - text: p
        - generic [ref=e8]: •
      - generic [ref=e9]: paso.
    - generic [ref=e10]:
      - generic "Spanish flag" [ref=e11]
      - generic [ref=e12]:
        - strong [ref=e13]: Spanish for your world
        - generic [ref=e14]: DELE A1 · Beginner
    - generic [ref=e15]: YOUR LEARNING SPACE
    - navigation "Main navigation" [ref=e16]:
      - button "My learning space" [ref=e17] [cursor=pointer]
      - button "Learning path" [ref=e21] [cursor=pointer]
      - button "Practice studio" [ref=e25] [cursor=pointer]
      - button "Exam rehearsal" [ref=e29] [cursor=pointer]
      - button "The A1 guide" [ref=e33] [cursor=pointer]
    - generic [ref=e38]:
      - generic [ref=e39]: ✺
      - paragraph [ref=e40]: Un poquito cada día.
      - generic [ref=e41]: A little every daytakes you a long way.
    - generic [ref=e43]:
      - button "Your exam, explained" [ref=e44] [cursor=pointer]
      - button "P Your Spanish journey Learning at your pace" [ref=e49] [cursor=pointer]:
        - generic [ref=e50]: P
        - generic [ref=e51]:
          - strong [ref=e52]: Your Spanish journey
          - generic [ref=e53]: Learning at your pace
  - generic [ref=e56]:
    - banner [ref=e57]:
      - generic [ref=e59]:
        - text: Your Spanish journey
        - strong [ref=e62]: The A1 guide
      - generic [ref=e63]:
        - generic "Consecutive practice days" [ref=e64]:
          - generic [ref=e67]: "0"
          - generic [ref=e68]: day streak
        - generic [ref=e69]:
          - generic [ref=e72]: "0"
          - text: XP
        - button "Open your learning preferences" [ref=e73] [cursor=pointer]: P
    - main [ref=e74]:
      - generic [ref=e75]:
        - generic [ref=e76]:
          - generic [ref=e77]:
            - generic [ref=e78]: THE BIG PICTURE, MADE SIMPLE
            - heading "Your guide to DELE A1." [level=1] [ref=e79]
            - paragraph [ref=e80]: Know what’s expected. Practise with a purpose.
          - generic [ref=e81]: Researched 7 Sep 2026
        - generic [ref=e84]:
          - generic [ref=e85]:
            - generic [ref=e86]: A1 · THE EVERYDAY ESSENTIALS
            - heading "You don’t need perfect Spanish. You need to connect." [level=2] [ref=e87]: You don’t need perfect Spanish.You need to connect.
            - paragraph [ref=e88]: A1 is about understanding familiar expressions, giving basic personal information and taking part in simple exchanges when the other person speaks clearly and helps. This course prepares for the general DELE A1, using the format introduced in 2020.
            - link "Read the official guide" [ref=e89] [cursor=pointer]:
              - /url: https://examenes.cervantes.es/sites/default/files/DELE_A1_v2020_Gu%C3%ADa%20de%20examen.pdf
          - generic [ref=e92]:
            - text: A1
            - generic [ref=e93]: UN PEQUEÑO GRAN PASO
        - heading "Four skills. Two passing groups." [level=2] [ref=e96]
        - generic [ref=e97]:
          - table [ref=e98]:
            - rowgroup [ref=e99]:
              - row [ref=e100]:
                - columnheader "Skill" [ref=e101]
                - columnheader "Time" [ref=e102]
                - columnheader "What you do" [ref=e103]
                - columnheader "Points" [ref=e104]
            - rowgroup [ref=e105]:
              - row [ref=e106]:
                - cell "Reading" [ref=e107]
                - cell "45 min" [ref=e110]
                - cell "4 tasks · 25 questions (5 + 6 + 6 + 8)" [ref=e111]
                - cell "25" [ref=e112]
              - row [ref=e113]:
                - cell "Listening" [ref=e114]
                - cell "25 min" [ref=e117]
                - cell "4 tasks · 25 questions (5 + 5 + 8 + 7)" [ref=e118]
                - cell "25" [ref=e119]
              - row [ref=e120]:
                - cell "Writing" [ref=e121]
                - cell "25 min" [ref=e124]
                - 'cell "Form: 15–25 words · Message: 30–40 words" [ref=e125]'
                - cell "25" [ref=e126]
              - row [ref=e127]:
                - cell "Speaking" [ref=e128]
                - cell "10 min + 10 prep" [ref=e131]
                - cell "Introduction · Topic · Conversation" [ref=e132]
                - cell "25" [ref=e133]
          - paragraph [ref=e134]:
            - text: Administration order is reading, listening, writing, then the oral appointment as arranged by your centre. Older A1 guides have different timings.
            - link "Official structure ↗" [ref=e135] [cursor=pointer]:
              - /url: https://examenes.cervantes.es/sites/default/files/DELE_A1_v2020_Gu%C3%ADa%20de%20examen.pdf
        - generic [ref=e136]:
          - generic [ref=e137]:
            - generic [ref=e138]: TRY THE PASSING RULE
            - heading "Does this score pass?" [level=3] [ref=e139]
            - paragraph [ref=e140]: Move the sliders. Both groups must reach 30/50, even if your total is 60 or more.
            - generic [ref=e141]:
              - generic [ref=e142]:
                - text: Reading
                - generic [ref=e143]: 15/25
              - slider "Reading 15/25" [ref=e144] [cursor=pointer]: "15"
            - generic [ref=e145]:
              - generic [ref=e146]:
                - text: Writing
                - generic [ref=e147]: 15/25
              - slider "Writing 15/25" [ref=e148] [cursor=pointer]: "15"
            - generic [ref=e149]:
              - generic [ref=e150]:
                - text: Listening
                - generic [ref=e151]: 0/25
              - slider "Listening 0/25" [ref=e152] [cursor=pointer]: "0"
            - generic [ref=e153]:
              - generic [ref=e154]:
                - text: Speaking
                - generic [ref=e155]: 15/25
              - slider "Speaking 15/25" [ref=e156] [cursor=pointer]: "15"
            - generic [ref=e157]:
              - generic [ref=e158]:
                - generic [ref=e159]: Reading + writing
                - generic [ref=e160]: 30/50
              - generic [ref=e161]:
                - generic [ref=e162]: Listening + speaking
                - generic [ref=e163]: 15/50
            - status [ref=e164]: These example scores do not meet the passing rule.
            - link "Official scoring rules" [ref=e167] [cursor=pointer]:
              - /url: https://examenes.cervantes.es/es/dele/como
          - generic [ref=e170]:
            - generic [ref=e171]: WHAT THE EXAMINER LOOKS FOR
            - heading "Be clear. Cover the task." [level=3] [ref=e172]
            - generic [ref=e176]:
              - heading "Writing" [level=4] [ref=e177]
              - paragraph [ref=e178]: Each task has equal weight. Answer the fields or message prompts with enough understandable information. Check word count, greeting and farewell where requested.
            - generic [ref=e182]:
              - heading "Speaking" [level=4] [ref=e183]
              - paragraph [ref=e184]: Introduce yourself for 1–2 minutes, discuss your chosen topic for 2–3, then converse for 3–4. Ask the interviewer two questions. Task completion and language use are assessed.
            - generic [ref=e188]:
              - heading "Understanding" [level=4] [ref=e189]
              - paragraph [ref=e190]: Each correct reading or listening answer earns one point. There is no penalty for wrong answers. Official listening texts are played twice.
            - paragraph [ref=e191]:
              - text: Productive tasks use trained human raters and 0–3 rating bands, then scale to 25. This app’s completion, XP and practice accuracy are not official grades.
              - link "Assessment scales ↗" [ref=e192] [cursor=pointer]:
                - /url: https://examenes.cervantes.es/sites/default/files/DELE_A1_v2020_Gu%C3%ADa%20de%20examen.pdf
        - generic [ref=e193]:
          - generic [ref=e194]:
            - heading "Your A1 readiness checklist" [level=2] [ref=e195]
            - paragraph [ref=e196]: Self-assess these abilities as you work through the path.
          - generic [ref=e197]: 1/27 checked
        - paragraph [ref=e201]:
          - text: There is no official fixed word list or separate grammar test to memorize for a guaranteed pass. This is a practical coverage map of the official A1 inventories. The
          - link "full curriculum" [ref=e202] [cursor=pointer]:
            - /url: https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/indice.htm
          - text: is the reference for exhaustive detail; A1 and A2 are separate columns. A checked box records your self-assessment.
        - generic [ref=e203]:
          - generic [ref=e204]:
            - heading "Understand and communicate" [level=3] [ref=e205]
            - generic [ref=e208]:
              - checkbox "Introduce yourself; exchange names, nationality, age, home, work, studies and languages. Units 1–3, 12" [checked] [ref=e209] [cursor=pointer]
              - generic [ref=e210]:
                - text: Introduce yourself; exchange names, nationality, age, home, work, studies and languages.
                - generic [ref=e211]: Units 1–3, 12
            - generic [ref=e212]:
              - checkbox "Ask and answer simple questions; greet, thank, apologize and say goodbye. Units 1–2, 6–8" [ref=e213] [cursor=pointer]
              - generic [ref=e214]:
                - text: Ask and answer simple questions; greet, thank, apologize and say goodbye.
                - generic [ref=e215]: Units 1–2, 6–8
            - generic [ref=e216]:
              - checkbox "Describe people, possessions, rooms, daily activities, likes and immediate needs. Units 3–6, 9, 11" [ref=e217] [cursor=pointer]
              - generic [ref=e218]:
                - text: Describe people, possessions, rooms, daily activities, likes and immediate needs.
                - generic [ref=e219]: Units 3–6, 9, 11
            - generic [ref=e220]:
              - checkbox "Request food, goods, prices, travel information and basic services. Units 6–8, 10" [ref=e221] [cursor=pointer]
              - generic [ref=e222]:
                - text: Request food, goods, prices, travel information and basic services.
                - generic [ref=e223]: Units 6–8, 10
            - generic [ref=e224]:
              - checkbox "Make and respond to simple invitations; agree, decline and give a short reason. Units 9, 12" [ref=e225] [cursor=pointer]
              - generic [ref=e226]:
                - text: Make and respond to simple invitations; agree, decline and give a short reason.
                - generic [ref=e227]: Units 9, 12
            - generic [ref=e228]:
              - checkbox "Ask for repetition, slower speech, spelling and the meaning of a word. Units 1, 12 · Foundation lab" [ref=e229] [cursor=pointer]
              - generic [ref=e230]:
                - text: Ask for repetition, slower speech, spelling and the meaning of a word.
                - generic [ref=e231]: Units 1, 12 · Foundation lab
            - link "Official reference" [ref=e232] [cursor=pointer]:
              - /url: https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/05_funciones_inventario_a1-a2.htm
          - generic [ref=e235]:
            - heading "Build clear basic sentences" [level=3] [ref=e236]
            - generic [ref=e239]:
              - checkbox "Noun gender and plurals; agreement of articles and adjectives; basic word order. Units 2–4, 8" [ref=e240] [cursor=pointer]
              - generic [ref=e241]:
                - text: Noun gender and plurals; agreement of articles and adjectives; basic word order.
                - generic [ref=e242]: Units 2–4, 8
            - generic [ref=e243]:
              - checkbox "Definite / indefinite articles, common article omissions, al and del. Units 4, 6–8, 10" [ref=e244] [cursor=pointer]
              - generic [ref=e245]:
                - text: Definite / indefinite articles, common article omissions, al and del.
                - generic [ref=e246]: Units 4, 6–8, 10
            - generic [ref=e247]:
              - checkbox "Subject pronouns, tú / usted / vosotros / ustedes; possessives and demonstratives. Units 1–3, 8 · Foundation lab" [ref=e248] [cursor=pointer]
              - generic [ref=e249]:
                - text: Subject pronouns, tú / usted / vosotros / ustedes; possessives and demonstratives.
                - generic [ref=e250]: Units 1–3, 8 · Foundation lab
            - generic [ref=e251]:
              - checkbox "Present tense of regular verbs and basic common irregular forms; ser, estar, hay and tener. Units 1–6, 9–11" [ref=e252] [cursor=pointer]
              - generic [ref=e253]:
                - text: Present tense of regular verbs and basic common irregular forms; ser, estar, hay and tener.
                - generic [ref=e254]: Units 1–6, 9–11
            - generic [ref=e255]:
              - checkbox "Common reflexives, basic gustar patterns and infinitives for activities. Units 5–6, 9" [ref=e256] [cursor=pointer]
              - generic [ref=e257]:
                - text: Common reflexives, basic gustar patterns and infinitives for activities.
                - generic [ref=e258]: Units 5–6, 9
            - generic [ref=e259]:
              - checkbox "Question words, negation, quantity, time, place, basic prepositions and y / pero / porque. Units 2, 4–12" [ref=e260] [cursor=pointer]
              - generic [ref=e261]:
                - text: Question words, negation, quantity, time, place, basic prepositions and y / pero / porque.
                - generic [ref=e262]: Units 2, 4–12
            - generic [ref=e263]:
              - checkbox "Numbers, prices, dates, times, ordinals, mucho / poco / bastante, también / tampoco. Units 2, 5–12 · Foundation lab" [ref=e264] [cursor=pointer]
              - generic [ref=e265]:
                - text: Numbers, prices, dates, times, ordinals, mucho / poco / bastante, también / tampoco.
                - generic [ref=e266]: Units 2, 5–12 · Foundation lab
            - link "Official reference" [ref=e267] [cursor=pointer]:
              - /url: https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/02_gramatica_inventario_a1-a2.htm
          - generic [ref=e270]:
            - heading "Use everyday vocabulary" [level=3] [ref=e271]
            - generic [ref=e274]:
              - checkbox "Identity, body and appearance, personality, feelings, family and social relationships. Units 1–3, 11" [ref=e275] [cursor=pointer]
              - generic [ref=e276]:
                - text: Identity, body and appearance, personality, feelings, family and social relationships.
                - generic [ref=e277]: Units 1–3, 11
            - generic [ref=e278]:
              - checkbox "Home and furniture, education, work and ordinary daily activities. Units 4–5, 9" [ref=e279] [cursor=pointer]
              - generic [ref=e280]:
                - text: Home and furniture, education, work and ordinary daily activities.
                - generic [ref=e281]: Units 4–5, 9
            - generic [ref=e282]:
              - checkbox "Food, restaurants, shopping, clothes, colors, money and quantities. Units 6, 8" [ref=e283] [cursor=pointer]
              - generic [ref=e284]:
                - text: Food, restaurants, shopping, clothes, colors, money and quantities.
                - generic [ref=e285]: Units 6, 8
            - generic [ref=e286]:
              - checkbox "Leisure, transport, accommodation, public services, places and directions. Units 7, 9–10" [ref=e287] [cursor=pointer]
              - generic [ref=e288]:
                - text: Leisure, transport, accommodation, public services, places and directions.
                - generic [ref=e289]: Units 7, 9–10
            - generic [ref=e290]:
              - checkbox "Dates, schedules, weather, seasons, simple physical needs and appointments. Units 5, 10–11" [ref=e291] [cursor=pointer]
              - generic [ref=e292]:
                - text: Dates, schedules, weather, seasons, simple physical needs and appointments.
                - generic [ref=e293]: Units 5, 10–11
            - link "Official reference" [ref=e294] [cursor=pointer]:
              - /url: https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm
          - generic [ref=e297]:
            - heading "Make your Spanish understandable" [level=3] [ref=e298]
            - generic [ref=e301]:
              - checkbox "Hear and produce the five vowels; distinguish common consonants, ñ, silent h and r / rr. Audio throughout · Foundation lab" [ref=e302] [cursor=pointer]
              - generic [ref=e303]:
                - text: Hear and produce the five vowels; distinguish common consonants, ñ, silent h and r / rr.
                - generic [ref=e304]: Audio throughout · Foundation lab
            - generic [ref=e305]:
              - checkbox "Use intelligible syllables, word stress, sentence rhythm and question intonation. Speaking throughout · Foundation lab" [ref=e306] [cursor=pointer]
              - generic [ref=e307]:
                - text: Use intelligible syllables, word stress, sentence rhythm and question intonation.
                - generic [ref=e308]: Speaking throughout · Foundation lab
            - generic [ref=e309]:
              - checkbox "Spell names; use accents, ñ, capitals and opening ¿ / ¡ appropriately. Units 1–2, 12 · Foundation lab" [ref=e310] [cursor=pointer]
              - generic [ref=e311]:
                - text: Spell names; use accents, ñ, capitals and opening ¿ / ¡ appropriately.
                - generic [ref=e312]: Units 1–2, 12 · Foundation lab
            - generic [ref=e313]:
              - checkbox "Use one accepted Spanish variety consistently. A native-like accent is not required. All speaking and writing practice" [ref=e314] [cursor=pointer]
              - generic [ref=e315]:
                - text: Use one accepted Spanish variety consistently. A native-like accent is not required.
                - generic [ref=e316]: All speaking and writing practice
            - link "Official reference" [ref=e317] [cursor=pointer]:
              - /url: https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/03_pronunciacion_inventario_a1-a2.htm
          - generic [ref=e320]:
            - heading "Handle the exam tasks" [level=3] [ref=e321]
            - generic [ref=e324]:
              - checkbox "Read personal messages and practical information; match notices and adverts to needs. Real-life lessons · Reading rehearsal" [ref=e325] [cursor=pointer]
              - generic [ref=e326]:
                - text: Read personal messages and practical information; match notices and adverts to needs.
                - generic [ref=e327]: Real-life lessons · Reading rehearsal
            - generic [ref=e328]:
              - checkbox "Listen for who, where, when, quantities and negation; match messages and sentence endings. Audio lessons · Listening rehearsal" [ref=e329] [cursor=pointer]
              - generic [ref=e330]:
                - text: Listen for who, where, when, quantities and negation; match messages and sentence endings.
                - generic [ref=e331]: Audio lessons · Listening rehearsal
            - generic [ref=e332]:
              - checkbox "Complete a personal form (15–25 words) and a short message (30–40 words). Practice studio · Writing rehearsal" [ref=e333] [cursor=pointer]
              - generic [ref=e334]:
                - text: Complete a personal form (15–25 words) and a short message (30–40 words).
                - generic [ref=e335]: Practice studio · Writing rehearsal
            - generic [ref=e336]:
              - checkbox "Prepare a personal presentation and familiar topic; answer follow-ups and ask two questions. Speaking lessons · Speaking rehearsal" [ref=e337] [cursor=pointer]
              - generic [ref=e338]:
                - text: Prepare a personal presentation and familiar topic; answer follow-ups and ask two questions.
                - generic [ref=e339]: Speaking lessons · Speaking rehearsal
            - generic [ref=e340]:
              - checkbox "Cover every prompt, stay comprehensible, manage time and use the official answer sheet. Exam rehearsal · Official sample papers" [ref=e341] [cursor=pointer]
              - generic [ref=e342]:
                - text: Cover every prompt, stay comprehensible, manage time and use the official answer sheet.
                - generic [ref=e343]: Exam rehearsal · Official sample papers
            - link "Official reference" [ref=e344] [cursor=pointer]:
              - /url: https://examenes.cervantes.es/sites/default/files/DELE_A1_v2020_Gu%C3%ADa%20de%20examen.pdf
        - heading "Before you walk through the door" [level=2] [ref=e349]
        - generic [ref=e350]:
          - generic [ref=e351]:
            - text: "01"
            - heading "Book the right exam" [level=3] [ref=e352]
            - paragraph [ref=e353]:
              - text: Select general DELE A1 at an authorized centre. No lower-level certificate is required. Fees, dates and deadlines depend on the centre and session; check the
              - link "official registration page" [ref=e354] [cursor=pointer]:
                - /url: https://examenes.cervantes.es/es/dele/inscribirse
              - text: .
          - generic [ref=e355]:
            - text: "02"
            - heading "Check your appointment" [level=3] [ref=e356]
            - paragraph [ref=e357]: Confirm the location and the separate written and oral times. Ask the centre about any access arrangements when registering. Follow its instructions about materials and arrival time.
          - generic [ref=e358]:
            - text: "03"
            - heading "Bring your documents" [level=3] [ref=e359]
            - paragraph [ref=e360]:
              - text: Have the original official photo ID or passport used to register, registration receipt and official exam summons. Check the
              - link "candidate guidance" [ref=e361] [cursor=pointer]:
                - /url: https://examenes.cervantes.es/es/dele/preguntas-frecuentes
              - text: and your centre’s current instructions.
        - generic [ref=e362]:
          - heading "Go straight to the source" [level=2] [ref=e364]
          - generic [ref=e365]: Instituto Cervantes · Primary sources
        - generic [ref=e366]:
          - link "01 Official A1 exam guide · 2020 format Task structure, timing, word counts and assessment scales." [ref=e367] [cursor=pointer]:
            - /url: https://examenes.cervantes.es/sites/default/files/DELE_A1_v2020_Gu%C3%ADa%20de%20examen.pdf
            - generic [ref=e368]: "01"
            - generic [ref=e369]:
              - strong [ref=e370]: Official A1 exam guide · 2020 format
              - generic [ref=e371]: Task structure, timing, word counts and assessment scales.
          - link "02 Official exam structure and passing rules Four 25-point skills and the two 30/50 passing groups." [ref=e374] [cursor=pointer]:
            - /url: https://examenes.cervantes.es/es/dele/como
            - generic [ref=e375]: "02"
            - generic [ref=e376]:
              - strong [ref=e377]: Official exam structure and passing rules
              - generic [ref=e378]: Four 25-point skills and the two 30/50 passing groups.
          - link "03 Official sample exams and audio Free question papers, answer keys, audio and answer sheets." [ref=e381] [cursor=pointer]:
            - /url: https://examenes.cervantes.es/es/dele/preparar-prueba
            - generic [ref=e382]: "03"
            - generic [ref=e383]:
              - strong [ref=e384]: Official sample exams and audio
              - generic [ref=e385]: Free question papers, answer keys, audio and answer sheets.
          - link "04 Cervantes reference curriculum · A1 grammar Use the A1 column; adjacent A2 content is not an A1 checklist." [ref=e388] [cursor=pointer]:
            - /url: https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/02_gramatica_inventario_a1-a2.htm
            - generic [ref=e389]: "04"
            - generic [ref=e390]:
              - strong [ref=e391]: Cervantes reference curriculum · A1 grammar
              - generic [ref=e392]: Use the A1 column; adjacent A2 content is not an A1 checklist.
          - link "05 Cervantes reference curriculum · functions What you need to communicate in everyday exchanges." [ref=e395] [cursor=pointer]:
            - /url: https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/05_funciones_inventario_a1-a2.htm
            - generic [ref=e396]: "05"
            - generic [ref=e397]:
              - strong [ref=e398]: Cervantes reference curriculum · functions
              - generic [ref=e399]: What you need to communicate in everyday exchanges.
          - link "06 Cervantes reference curriculum · everyday topics Personal information, relationships, housing, food, travel and more." [ref=e402] [cursor=pointer]:
            - /url: https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm
            - generic [ref=e403]: "06"
            - generic [ref=e404]:
              - strong [ref=e405]: Cervantes reference curriculum · everyday topics
              - generic [ref=e406]: Personal information, relationships, housing, food, travel and more.
          - link "07 Pronunciation and prosody Sound contrasts, syllables, stress, rhythm and intonation." [ref=e409] [cursor=pointer]:
            - /url: https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/03_pronunciacion_inventario_a1-a2.htm
            - generic [ref=e410]: "07"
            - generic [ref=e411]:
              - strong [ref=e412]: Pronunciation and prosody
              - generic [ref=e413]: Sound contrasts, syllables, stress, rhythm and intonation.
          - link "08 Spelling and punctuation Spanish letters, accents, capitalization and punctuation." [ref=e416] [cursor=pointer]:
            - /url: https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/04_ortografia_inventario_a1-a2.htm
            - generic [ref=e417]: "08"
            - generic [ref=e418]:
              - strong [ref=e419]: Spelling and punctuation
              - generic [ref=e420]: Spanish letters, accents, capitalization and punctuation.
          - link "09 Candidate FAQs and exam day Identity documents, centre instructions and practical arrangements." [ref=e423] [cursor=pointer]:
            - /url: https://examenes.cervantes.es/es/dele/preguntas-frecuentes
            - generic [ref=e424]: "09"
            - generic [ref=e425]:
              - strong [ref=e426]: Candidate FAQs and exam day
              - generic [ref=e427]: Identity documents, centre instructions and practical arrangements.
          - link "10 Registration and exam centres Book the correct level; confirm local fees and deadlines." [ref=e430] [cursor=pointer]:
            - /url: https://examenes.cervantes.es/es/dele/inscribirse
            - generic [ref=e431]: "10"
            - generic [ref=e432]:
              - strong [ref=e433]: Registration and exam centres
              - generic [ref=e434]: Book the correct level; confirm local fees and deadlines.
          - link "11 Full curriculum index The complete official inventories, including discourse, pragmatic strategies and general notions." [ref=e437] [cursor=pointer]:
            - /url: https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/indice.htm
            - generic [ref=e438]: "11"
            - generic [ref=e439]:
              - strong [ref=e440]: Full curriculum index
              - generic [ref=e441]: The complete official inventories, including discourse, pragmatic strategies and general notions.
        - paragraph [ref=e444]: Paso is an independent learning app, not affiliated with Instituto Cervantes. Exercises and illustrations are original. Official resources remain on their publishers’ websites.
      - generic [ref=e445]:
        - generic [ref=e446]: Made for the joy of getting there.
        - generic [ref=e447]: paso a paso ✦
        - button "Independent practice · Official sources inside" [ref=e448] [cursor=pointer]
```

# Test source

```ts
  1   | import { test as base, expect, type Locator, type Page } from "@playwright/test";
  2   | import { allLessons } from "../../src/data/curriculum";
  3   | import type { Question } from "../../src/data/types";
  4   | 
  5   | export const test = base.extend<{ blockExternal: void }>({
  6   |   blockExternal: [
  7   |     async ({ context }, provide) => {
  8   |       await context.route("**/*", async (route) => {
  9   |         const url = new URL(route.request().url());
  10  | 
  11  |         if (url.hostname !== "127.0.0.1" && url.protocol.startsWith("http")) {
  12  |           return route.abort("blockedbyclient");
  13  |         }
  14  | 
  15  |         return route.continue();
  16  |       });
  17  | 
  18  |       await provide();
  19  |     },
  20  |     { auto: true },
  21  |   ],
  22  |   page: async ({ page }, provide) => {
  23  |     const errors: string[] = [];
  24  | 
  25  |     page.on("pageerror", (error) => errors.push(error.message));
  26  |     await page.clock.setFixedTime(new Date("2026-09-09T10:00:00+02:00"));
  27  |     await provide(page);
  28  |     expect(errors, "Uncaught browser errors").toEqual([]);
  29  |   },
  30  | });
  31  | 
  32  | export { expect };
  33  | 
  34  | // Captures land in screenshots/ for inspection. With VISUAL_COMPARE set they are compared
  35  | // with screenshots/baseline/ instead, which a run with --update-snapshots=all writes.
  36  | export const capture = async (
  37  |   page: Page,
  38  |   name: string,
  39  |   { fullPage = false, element }: { fullPage?: boolean; element?: Locator } = {},
  40  | ) => {
  41  |   if (process.env.VISUAL_COMPARE) {
  42  |     await (element
  43  |       ? expect(element).toHaveScreenshot(`${name}.png`)
> 44  |       : expect(page).toHaveScreenshot(`${name}.png`, { fullPage }));
      |                      ^ Error: expect(page).toHaveScreenshot(expected) failed
  45  | 
  46  |     return;
  47  |   }
  48  | 
  49  |   const path = `screenshots/${test.info().project.name}/${name}.png`;
  50  | 
  51  |   await (element ? element.screenshot({ path }) : page.screenshot({ path, fullPage }));
  52  | };
  53  | 
  54  | // Everything that makes a screenshot reproducible and nothing that is specific to one
  55  | // page: kill motion, wait for webfonts, drop focus rings and hover state, scroll to the
  56  | // top. Shared by tests/visual/views.spec.ts and tests/visual/design-system.spec.ts.
  57  | export const stabilise = async (page: Page) => {
  58  |   await page.addStyleTag({
  59  |     content:
  60  |       "*, *::before, *::after { scroll-behavior: auto !important; transition: none !important; animation: none !important; }",
  61  |   });
  62  | 
  63  |   await page.evaluate(async () => {
  64  |     await document.fonts.ready;
  65  |     (document.activeElement as HTMLElement)?.blur();
  66  |     window.scrollTo(0, 0);
  67  |   });
  68  | 
  69  |   await page.mouse.move(0, 0);
  70  | };
  71  | 
  72  | export const openLesson = async (page: Page, index: number) => {
  73  |   await page.goto("/#path");
  74  |   const lesson = allLessons[index];
  75  |   const unit = page.locator(".unit-card").nth(Math.floor(index / 4));
  76  | 
  77  |   if ((await unit.locator(".unit-summary").getAttribute("aria-expanded")) !== "true") {
  78  |     await unit.locator(".unit-summary").click();
  79  |   }
  80  | 
  81  |   await unit.getByRole("button", { name: lesson.title, exact: false }).click();
  82  | 
  83  |   await expect(
  84  |     page.getByRole("heading", { name: lesson.questions[0].prompt, exact: true }),
  85  |   ).toBeVisible();
  86  | 
  87  |   return lesson;
  88  | };
  89  | 
  90  | export const answer = async (page: Page, q: Question, exam = false, wrong = false) => {
  91  |   if (q.options) {
  92  |     await page
  93  |       .getByRole("button", {
  94  |         name: wrong ? q.options.find((o) => o !== q.answer)! : q.answer,
  95  |         exact: true,
  96  |       })
  97  |       .click();
  98  | 
  99  |     return;
  100 |   } else if (q.kind === "order") {
  101 |     for (const word of q.answer.split(" ")) {
  102 |       await page
  103 |         .locator(".word-bank")
  104 |         .getByRole("button", { name: word, exact: true, disabled: false })
  105 |         .filter({ visible: true })
  106 |         .first()
  107 |         .click();
  108 |     }
  109 | 
  110 |     return;
  111 |   } else if (q.kind === "form") {
  112 |     for (const f of q.fields!) {
  113 |       await page.getByRole("textbox", { name: f.label, exact: true }).fill(f.example);
  114 |     }
  115 |   } else if (q.kind === "speak") {
  116 |     await page.getByRole("checkbox", { name: "I practised aloud", exact: false }).check();
  117 |   } else {
  118 |     await page.getByRole("textbox", { name: "Your answer in Spanish" }).fill(q.answer);
  119 |   }
  120 | 
  121 |   await page
  122 |     .getByRole("button", {
  123 |       name: exam
  124 |         ? "Save answer"
  125 |         : ["write", "speak", "form"].includes(q.kind)
  126 |           ? "Review my practice"
  127 |           : "Check answer",
  128 |       exact: true,
  129 |     })
  130 |     .click();
  131 | };
  132 | 
  133 | export const closeLesson = async (page: Page) => {
  134 |   await page.getByRole("button", { name: "Close lesson" }).click();
  135 | 
  136 |   if (await page.getByRole("button", { name: "Save & leave" }).isVisible()) {
  137 |     await page.getByRole("button", { name: "Save & leave" }).click();
  138 |   }
  139 | };
  140 | 
  141 | export const stored = async (page: Page, key = "paso-progress-v1") =>
  142 |   page.evaluate((k) => JSON.parse(localStorage.getItem(k) || "null"), key);
  143 | 
```