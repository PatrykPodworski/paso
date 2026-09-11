# Refactor regression contract

This suite protects the existing Paso learning experience before its implementation is reorganized. It tests observable results, durable state, provider boundaries, and screenshots. It does not replace review of Spanish teaching content or a teacher's assessment.

## Run the gate

From `projects/dele-a1`:

```sh
pnpm install --frozen-lockfile
pnpm test:browser:install
pnpm test:refactor
```

CI (`.github/workflows/ci.yml`) runs lint, build, unit tests and the mutation gate on pull requests and pushes to `main`; the coverage and browser gates run locally with this command.

The gate first verifies stable test IDs, then builds/type-checks the app, lints, checks unit coverage, exercises browser journeys and screenshots, and runs Stryker business mutations. It exits unsuccessfully if any required check fails. Snapshot updates are **never** part of this command.

No API key, login or ElevenLabs account is needed. Browser tests deny external HTTP requests. Unit tests reject unexpected `fetch` calls; provider tests use fake responses and temporary files. CLI tests replace environment-file loading and generation calls. No production audio or credit ledger is changed.

| Command                   | Purpose                                                        |
| ------------------------- | -------------------------------------------------------------- |
| `pnpm test:unit`          | Fast unit/component/provider tests                             |
| `pnpm test:coverage`      | Unit tests with enforced coverage floors and HTML report       |
| `pnpm test:e2e`           | 22 journeys, each on desktop and mobile Chromium               |
| `pnpm test:visual`        | Compare reviewed screenshots; never update them                |
| `pnpm test:visual:update` | Deliberately regenerate screenshots for review                 |
| `pnpm test:browser`       | Both browser suites in one server session                      |
| `pnpm test:mutation`      | Stryker business logic audit and score gate                    |
| `pnpm test:mutation:full` | Broader audit including presentation mutations                 |
| `pnpm test:ids`           | Verify unique, stable test names used for mutation selection   |
| `pnpm test:visual:guard`  | Prove an intentional colour change fails the existing baseline |

## Rule inventory

Each row names independently asserted behavior. Parameterized tests exercise both sides of a rule and exact thresholds. Browser fixtures mock external services, not the application's state transitions. `lesson.test.tsx` substitutes the question widget to isolate accounting and draft routing; `app.test.tsx` substitutes the lesson child only to isolate practice selection and completion callbacks; real lessons are exercised separately by component and browser tests.

| Rule | Contract                                                                                                                | Unit/component tests                                                  |
| ---- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| P01  | Fresh progress has independent collections and truthful zero totals                                                     | `rules.test.ts`, `interactions.test.tsx`                              |
| P02  | Restore valid saved preferences and older envelopes; reject malformed data, wrong versions and denied storage           | `rules.test.ts`, `progress.test.ts`                                   |
| P03  | Compare Spanish case, whitespace, punctuation and Unicode composition; preserve accents and ñ; accept declared variants | `rules.test.ts`, `progress.test.ts`                                   |
| P04  | Count Unicode words, apostrophes, hyphens and numbers; ignore punctuation                                               | `rules.test.ts`                                                       |
| P05  | Failed answers enter a deduplicated mistake queue immediately                                                           | `rules.test.ts`, `interactions.test.tsx`                              |
| P06  | Only unassisted correct answers clear mistakes and count as recovered; productive work is ungraded                      | `rules.test.ts`                                                       |
| P07  | Preserve input immutability and retain the newest 6,000 attempts                                                        | `rules.test.ts`                                                       |
| P08  | Daily totals count unique question IDs on local calendar days                                                           | `rules.test.ts`, `progress.test.ts`                                   |
| P09  | Streak may continue from yesterday; duplicates do not extend it and gaps break it                                       | `rules.test.ts`                                                       |
| P10  | Repeats cannot farm question XP; completed lessons award separate XP                                                    | `rules.test.ts`, `progress.test.ts`                                   |
| P11  | Skill statistics use the latest answer per question, exclude help/productive answers and round correctly                | `rules.test.ts`                                                       |
| P12  | Each DELE group independently requires at least 30/50, including decimal boundaries                                     | `rules.test.ts`, `exam.test.tsx`, `app.test.tsx`, `guide.test.tsx`    |
| P13  | Each supported writing pattern has a specific hint and correct language avoids false hints                              | `rules.test.ts`, `progress.test.ts`                                   |
| Q01  | Objective attempts start blank; writing/form drafts restore                                                             | `interactions.test.tsx`, `question-rules.test.tsx`, `lesson.test.tsx` |
| Q02  | Blank/whitespace answers cannot be checked; Enter checks once; other keys do not submit                                 | `question-rules.test.tsx`                                             |
| Q03  | Single choices check immediately, lock the choice, reveal feedback and play the Spanish phrase                          | `interactions.test.tsx`                                               |
| Q04  | All sentence tiles are required; tiles can be removed; checking reads the correct model even after a mistake            | `interactions.test.tsx`, `question-rules.test.tsx`                    |
| Q05  | Accent insertion replaces the selected text and restores cursor/focus                                                   | `question-rules.test.tsx`                                             |
| Q06  | Form fields must all be nonblank; drafts are JSON; submissions retain field labels                                      | `question-rules.test.tsx`, `interactions.test.tsx`                    |
| Q07  | Writing word targets distinguish below, inclusive boundaries and above                                                  | `question-rules.test.tsx`                                             |
| Q08  | Writing and speaking require an explicit review action; revisions retain the user's text                                | `question-rules.test.tsx`                                             |
| Q09  | Recording blocks submission; a new take clears old feedback                                                             | `question-rules.test.tsx`                                             |
| Q10  | Aloud/checklist practice can finish without a recording                                                                 | `question-rules.test.tsx`                                             |
| Q11  | Exam answers save without immediate corrections                                                                         | `question-rules.test.tsx`, `exam.test.tsx`                            |
| L01  | Record attempts on selection or checking; practice advances only on Continue                                            | `interactions.test.tsx`, `question-rules.test.tsx`, `lesson.test.tsx` |
| L02  | Lesson results distinguish objective success, mistakes, creative practice and assistance                                | `question-rules.test.tsx`, `lesson.test.tsx`                          |
| L03  | Leaving a progressed lesson requires confirmation; cancelling preserves the current answer                              | `interactions.test.tsx`                                               |
| L04  | Dialog Escape delegates to the current close handler; restore focus and body scrolling                                  | `question-rules.test.tsx`                                             |
| A01  | Prefer generated audio, fall back to bundled clips, preserve stable asset keys                                          | `rules.test.ts`, `audio.test.tsx`, `content.test.ts`                  |
| A02  | One active player; stopping/unmounting cancels pending playback and stale callbacks                                     | `audio.test.tsx`                                                      |
| A03  | Autoplay listening on entry without restarting on selection; count successful plays and enforce exam limits             | `audio.test.tsx`                                                      |
| A04  | Device fallback uses Spanish voices, correct speed and an honest notice; failures do not consume a play                 | `audio.test.tsx`                                                      |
| R01  | Request microphone permission once; unsupported/denied devices keep practice usable                                     | `recorder.test.tsx`                                                   |
| R02  | Recording timer runs only during recording and resets for another take                                                  | `recorder.test.tsx`                                                   |
| R03  | Submit nonempty audio only; preserve MIME/download extension; revoke replaced/unmounted URLs                            | `recorder.test.tsx`                                                   |
| R04  | Stop tracks on error, stop, unmount and late permission resolution                                                      | `recorder.test.tsx`                                                   |
| E01  | Resume valid exam state; reject invalid sections/stages/indices and malformed saved data                                | `exam.test.tsx`                                                       |
| E02  | Separate deadlines for reading, listening, writing, preparation and speaking; expire on return                          | `exam.test.tsx`                                                       |
| E03  | Save, previous, skip and last-question navigation remain within the section                                             | `exam.test.tsx`                                                       |
| E04  | Finishing locks the section; cancellation keeps working; review counts wrong/unanswered as zero                         | `exam.test.tsx`                                                       |
| E05  | Preserve form/writing/preparation drafts, including an intentionally cleared response                                   | `exam.test.tsx`                                                       |
| E06  | Preparation has a separate speaking deadline, whether it expires or is finished early                                   | `exam.test.tsx`                                                       |
| E07  | Persist objective exam results once; require both valid human scores for a hypothetical verdict                         | `exam.test.tsx`                                                       |
| E08  | Export all 55 responses and objective scores; label productive work for human review                                    | `exam.test.tsx`, browser `exam.spec.ts`                               |
| U01  | Pick first unfinished lesson; only actual path lessons advance course completion                                        | `app.test.tsx`                                                        |
| U02  | Skill practice uses correct banks and 4/8-question limits; fresh/oldest questions come first                            | `app.test.tsx`                                                        |
| U03  | Mistake IDs resolve safely; individual retry and empty-queue daily mix work                                             | `app.test.tsx`                                                        |
| U04  | Search Spanish/English case-insensitively; flip hints; expand/collapse cards; empty search recovers                     | `app.test.tsx`                                                        |
| U05  | Navigation, deep links, unknown hashes, mobile drawer, shortcuts and help lead to the correct place                     | `app.test.tsx`                                                        |
| U06  | Trim and persist name, goal and exam date; export actual progress; reset requires confirmation                          | `app.test.tsx`                                                        |
| U07  | Persist/toggle readiness checks; display storage failures without losing the active session                             | `app.test.tsx`, `exam.test.tsx`, `guide.test.tsx`                     |
| B01  | Free-tier ceiling and shared 500-credit reserve; reject missing/invalid/paid/overage account data                       | `audio-budget.test.mjs`                                               |
| B02  | Validate model/text and 10,000-character request limit; conservatively count UTF-16                                     | `audio-budget.test.mjs`                                               |
| B03  | Use the higher provider/local usage; reset only for a new provider billing period                                       | `audio-budget.test.mjs`                                               |
| B04  | Reserve privately and atomically before POST; failed/timed-out generation retains the reservation                       | `audio-budget.test.mjs`                                               |
| B05  | Recheck live allowance for each uncached clip; retry only quota GETs with bounded backoff                               | `audio-budget.test.mjs`                                               |
| B06  | Detect phrase-key collisions; fingerprint voice/text/settings; cache only complete audio                                | `elevenlabs.test.mjs`                                                 |
| B07  | Validate MIME, MP3 signature and size before publishing; never replace valid audio with an error                        | `elevenlabs.test.mjs`                                                 |
| B08  | Resume interrupted generation without rebilling completed clips; sanitize provider errors                               | `elevenlabs.test.mjs`                                                 |
| B09  | Validate voice pagination; recover matching text/voice/model/settings via GET only                                      | `elevenlabs.test.mjs`                                                 |
| B10  | CLI validates mode/key/voice; exclusive generation lock; redacted failures; own-lock cleanup                            | `generate-elevenlabs.test.mjs`                                        |
| B11  | Plan/quota/voices cannot generate; preview and recovery dispatch to the correct operation                               | `generate-elevenlabs.test.mjs`                                        |
| D01  | Course/lesson/skill counts, unique IDs/options, valid tile sets, model word counts and official task distributions      | `content.test.ts`                                                     |
| D02  | Every referenced voice clip and illustration exists; vocabulary has individual hints                                    | `content.test.ts`                                                     |

Test paths without a directory above are in `src/test/` for TS/TSX and `scripts/` for MJS.

## Browser journeys and visual contract

`tests/e2e/` covers: lesson completion and mistake recovery; immediate choice feedback and pronunciation; listening autoplay and manual replay; sentence editing/autoplay; writing draft/retry/revision; recording/review/download; microphone denial; vocabulary; forms; listening assistance; all 55 exam questions; timer expiry; two-play limit and cleared exam drafts; preferences/export/reset; guide checks/scores; navigation/focus; each of the four focused skills; picture practice; foundation practice; and daily-mix prioritization. Every journey runs at 1440×1080 and 390×844.

`tests/visual/views.spec.ts` names each view/state. Baselines include the five pages, personalized progress, four practice filters, empty/populated mistakes, vocabulary flip/empty search, preferences/reset, phone navigation, seven exercise types, correct/incorrect/transcript feedback, leave/completion dialogs, writing/speaking reflection, and all exam stages/reviews/results. Tall dialogs have separate top and bottom captures. Tests also assert no horizontal overflow.

Dates, timezone, locale, motion and AI responses are deterministic. Native recording and local audio playback are exercised in E2E tests. Screenshot comparisons use zero allowed differing pixels. They use the Playwright-managed Chromium revision installed from the lockfile in the ignored project-local `.cache/playwright` directory, **not** the locally auto-updating Chrome application.

These reviewed images were generated on macOS arm64. Font rendering and native controls differ between operating systems. Run visual CI on a matching macOS environment, or establish and review a separate Linux baseline before enforcing it there. This is not a Safari/WebKit or Firefox compatibility claim.

For an intentional design change, run the update command, inspect the actual PNG diffs and both screen sizes, and commit reviewed baselines with the change. A refactor that should preserve presentation must pass the existing images. Never use snapshot updates to clear an unexplained failure.

## Mutation scope and interpretation

`stryker.business.config.mjs` uses syntax-derived ranges from `scripts/mutation-scope.mjs`. It includes state, decisions, calculations and event handlers; authored UI copy, styling and artwork belong to the screenshot checks. The scope helper has its own regression test. Non-UI production modules—including budget, generation, CLI and progress—are mutated in full. No Stryker mutation operator is globally disabled. `test:mutation:full` additionally mutates the entire UI.

`test-surface.mjs` discovers new application modules automatically, so moving logic into a new file cannot silently remove it from coverage. Authored curriculum/reference data, type declarations, bootstrap and artwork are explicitly excluded from code mutation; course data has exhaustive integrity assertions, while screenshots check artwork and presentation.

A mutation score measures detection for the generated changes; it does not prove every possible bug is caught. Inspect surviving changes in the HTML report. Equivalent changes, user-facing copy changes and missing assertions must be distinguished. The gate must not be weakened just to accept a refactor. Incremental results speed up subsequent runs; delete `reports/stryker-business-incremental.json` for a clean audit.

The business gate requires at least 79% overall detection, with stronger individual floors for progress (98), audio budget (95), the ElevenLabs client (88), the generation CLI (80), audio direction (68), lesson accounting (90) and the guide (90). Issue #43 tracks raising the overall floor to 80 and giving the two thinnest per-file floors some headroom. Runtime/compile-invalid mutants are excluded from the score; timeouts count as detected under Stryker's standard calculation. The full UI audit is informational and intentionally has no score gate. It includes many authored-copy and styling changes already checked by screenshots.

The gate was 83% while the coach existed; its modules scored 90–100% and their removal left the remaining code at 81.07%, then 80.20% once the client went. The score is now deterministic: `timeoutMS` 30000 keeps every slow-but-finite mutant off the timeout boundary, and three runs on identical source each scored 79.79% with zero spread on every per-file score. Before that, `timeoutMS` 2000 with `concurrency` 8 cut those mutants off at random, and because Stryker counts a timeout as detected, the score rose with machine load: 79.75–80.54 across three runs, with 28 mutants changing status between them. Raising the limit to 10000 left two mutants still straddling it, so the value is 30000. Only 5 mutants genuinely fail to terminate, so the higher limit costs about 12 seconds a run. One `progress.ts` mutant still alternates between Timeout and Killed; both count as detected, so no score moves. 79 leaves roughly 22 mutants of margin below the deterministic measurement.

Vitest's dependency pruning is disabled inside Stryker (`related: false`); Stryker performs selection from measured per-test coverage. A deliberate `exerciseBank = []` mutation was confirmed killed by the focused-practice assertions. `test:ids` collects test names twice across a wall-clock second and rejects duplicates or changing names. This caught timestamp-containing parameter names that otherwise prevented selected boundary tests from running. The report checker also rejects surviving mutants that executed zero tests.

TypeScript 7 no longer exposes the JS compiler API used by Stryker's tsconfig-rewriting preprocessor. Stryker uses an intentionally absent `tsconfig.stryker-unused.json` to skip that rewriting; this project's compiler configs have no references outside the project. Mutations still run in an isolated sandbox. `pnpm build` performs the real TypeScript checks separately.

## Evidence and limits

The complete gate passes with 357 JavaScript/TypeScript unit and component tests, 46 E2E runs and 71 visual runs against 134 images. Line coverage is 97.90%; branch coverage is 95.84%. The business mutation score is 79.79% (2,864 mutations), with 528 survivors and 49 uncovered mutations retained for review. Progress and audio-budget detection improved from 69.46% to 98.11% on the same unchanged source.

Current measured results, individual module scores and limits are in [TEST_BASELINE.json](TEST_BASELINE.json). Generated detail reports are local and ignored by Git:

- `coverage/index.html` — line/branch coverage.
- `reports/mutation/business.html` — mutation locations and surviving replacements.
- `playwright-report/index.html` — browser results; failed tests retain screenshots and traces.

Two regression defects found while adding this suite were fixed: an intentionally cleared exam draft could restore an old submitted answer, and a corrupt saved exam question index could crash the view.

The pre-existing `scripts/browser-check.mjs` is a manual smoke check excluded from every routine gate. ElevenLabs generation is never invoked live by the suite.

During the refactor, preserve these tests' observable expectations. For a changed rule, update its inventory row and add a counterexample or boundary that fails if the rule is removed or reversed. Add a browser journey for a new flow and reviewed screenshots for a new view. Keep test inputs and expected outcomes independent of the helper being tested. A moved file should keep its tests and enter automatic source discovery; never reduce thresholds, narrow the mutation scope, or update screenshots merely to make a refactor pass.

Additional mutation-driven checks: `lesson.test.tsx` asserts mixed and pure session totals, draft routing and audio cleanup; `guide.test.tsx` asserts independent score sliders and exact readiness counts. These supplement rules Q01, L01–L02, P12 and U07.
