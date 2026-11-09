---
status: accepted
---

# 0010. A typed answer that misses only its accents passes with a note

A missing or extra written accent is a real mistake, but it should not cost the learner a point, a lesson or a review, so a typed answer that differs from an accepted answer only by its acute accents or diaeresis is correct: for the score, lesson completion, the mistakes queue and flashcard scheduling. The feedback still shows the mistake: it names the missing accents and shows the accepted answer as written, as the note for a missing ¿ ? does. The checker ignores case, spacing and punctuation as before. ñ is still not an accented n, so n for ñ is wrong, and an answer that differs by spacing, such as porque for por qué, is wrong. Chosen options and word tiles stay strict, because their choices can differ by accents alone. The LLM review follows the same rule: it lists an accent as a correction and does not fail the answer for it. This supersedes [0004](0004-missing-accent-is-wrong.md); the decision is recorded in [#654](https://github.com/PatrykPodworski/paso/issues/654).
