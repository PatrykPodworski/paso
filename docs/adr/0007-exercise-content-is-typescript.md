---
status: accepted
---

# 0007. Exercise content is hand-written TypeScript

Exercises are authored as typed TypeScript data under `src/data/`, one reviewable file per topic or target, like `src/data/curriculum.ts`. When a specification ships a generated manifest (for example the JSON inside the [#613](https://github.com/PatrykPodworski/paso/issues/613) specification), its records are transcribed into that data and reviewed record by record. The manifest is not imported. This keeps every learner-facing string in reviewed, type-checked code.
