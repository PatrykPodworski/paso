# Paso

A little Spanish, every day.

Paso is a DELE A1 study app: original course material, native Spanish audio, and
a rehearsal of the exam under its official time limits. The course content was
written for this app and informed by Instituto Cervantes sources, not scraped
from a textbook.

It runs in the browser and saves your progress online, under a learner id this
browser keeps. There is no account yet. The live talk with Lucía in unit 1 sends
your voice to OpenAI for that talk, and its transcript is sent back for scoring.

Try it: **https://paso.podwor.ski**

## Run it locally

```sh
git clone https://github.com/PatrykPodworski/paso.git
cd paso
pnpm install
pnpm dev
```

Open <http://127.0.0.1:5173>. For a production build:

```sh
pnpm build
pnpm preview
```

`dist/` is a static site. Serve it over HTTP, because microphone access needs
localhost or HTTPS. All teaching audio and illustrations are local assets.

## What is in it

- **12 units, 48 lessons.** Each unit covers reading, listening, writing and
  speaking. Alongside the learning path there are foundation checks, picture
  questions, a personal information form and a full 55-item exam rehearsal.
- **96 vocabulary cards** you can search, flip and hear, each with its own
  memory hint: a familiar English word, a useful translated phrase, a breakdown
  of the word, or a distinction from a Spanish word it gets confused with. The
  house style for writing them is in
  [docs/VOCABULARY_HINTS.md](docs/VOCABULARY_HINTS.md).
- **Audio on every Spanish phrase**, generated once and played from local files.
  Listening questions start on their own; a small icon next to each question
  replays or stops them. Picking a single answer checks it immediately and reads
  the Spanish back to you.
- **Mistakes come back.** A wrong answer is saved the moment you check it, and
  clears only when you get it right later without help. Feedback gives the
  meaning and the memory hint, which is the same hint you see on the card.
- **Exam rehearsal** with the official section times and task counts, a separate
  ten-minute oral preparation stage, deadlines that survive a reload, saved
  answers, section reviews, and an export you can hand to a teacher.
- **An A1 guide** with a readiness checklist, the official resources, exam
  logistics and a calculator for the two-group pass rule.
- **Progress is saved online.** Lessons, history, goals, streaks, XP,
  preferences, drafts and self-assessments are saved as you go and can be
  exported from preferences.

The interface is built for long sessions: large default type and controls,
keyboard navigation, modal focus containment, reduced-motion support and
original SVG illustrations.

## How it is built

Vite, React and TypeScript, with pnpm. The backend is Vercel functions in `api/`:
the live examiner, and progress in Postgres. The course is data
rather than components, so the units, lessons and exercises live under
`src/data/` and are edited without touching the UI.

| Path                     | What lives there                          |
| ------------------------ | ----------------------------------------- |
| `src/App.tsx`            | Dashboard, learning path, studio, prefs   |
| `src/data/curriculum.ts` | The course itself: units, lessons, drills |
| `src/data/mock.ts`       | Exam rehearsal and personal form          |
| `src/data/progress.ts`   | Scoring, review windows, writing checks   |
| `src/data/research.ts`   | The source-linked readiness map           |
| `src/components/`        | Question types, exam, audio, live talk    |
| `public/audio/`          | Generated speech and its manifest         |
| `api/`                   | Live examiner, progress API               |
| `db/`                    | Progress migrations and their runner      |

Styling is the hand-written `src/styles.css`. Tailwind utilities are available
alongside it and new styling should use them; Tailwind's preflight is
deliberately switched off, because resetting the base element styles would
break that stylesheet and every visual baseline.

Utilities are imported unlayered, so a utility class outranks the plain element
rules at the top of `src/styles.css`. It does **not** outrank an existing class
rule of equal or higher specificity: migrating an element to utilities means
deleting the class rules that styled it in the same change, including any
descendant and state selectors that target it. `tests/e2e/tailwind.spec.ts`
guards the layering.

Installs use a seven-day `minimumReleaseAge` (see `pnpm-workspace.yaml`), so a
freshly published package version cannot land here for a week.

## Audio

Every Spanish phrase has a pre-generated ElevenLabs recording checked into the
repo, so practice plays local MP3s and never calls an API. If a file is missing
the player falls back to a bundled recording, then to labelled browser speech.
Generating new clips, the voice assignments and the credit guards are in
[docs/AUDIO.md](docs/AUDIO.md).

## Writing and speaking

Every speaking task is a live talk with Lucía; nothing is recorded in the browser.

In a lesson or practice writing task, "Review my practice" asks an AI tutor for
feedback: a result (passed, partly passed or not passed yet), each requested
point covered or missing, corrections, the word count and a revised version. The
result is recorded like a live talk's grade, so a task not passed goes to the
mistake review. At the mock exam's writing review, one button marks both tasks
with a DELE band from 0 to 3 and scales them to the 25-point writing score.
Nothing is sent until the learner asks, and the server stores nothing.

`api/review-writing.ts` looks the task up on the server, so the client sends
only the task id, the answer and the passcode. It calls OpenRouter with
`OPENROUTER_API_KEY` on the model that `OPENROUTER_MODEL` names, and checks the
same `PASSCODE` as the live talks. Both OpenRouter variables are required: without
either one the function logs which is missing and answers 503. Use `vercel dev`
to try it locally.

`pnpm eval:writing` reviews the sample answers in `scripts/writing-evals/samples.json`
and fails when any band (exam tasks) or result (practice tasks) differs from the
expected one. It reads the key and the model
from the environment or `.env.local`; rerun it after changing the prompt or the model.

## Live examiner

Unit 1's speaking task is a two-minute voice talk with Lucía, an OpenAI
realtime model. `api/live-session.ts` opens the session, so the API key stays
on the server; `api/score-talk.ts` grades the transcript afterwards.

The first talk is free for each network; later talks need the passcode. The
functions read `OPENAI_API_KEY` and `PASSCODE`. `pnpm dev` does not run them, so
use `vercel dev` to try a real talk locally.

## Progress

`api/progress.ts` reads and writes a learner's progress in Neon Postgres
(`DATABASE_URL`). It needs only the learner id this browser keeps, with no
passcode, and limits each address to 120 requests a minute and 5000 a day, with
bodies up to 256 KB. `pnpm dev` serves the same API from an in-memory Postgres
that starts empty, without the rate limits. Progress saved in this browser
before the move is not read.

Each Vercel preview gets a Neon branch named `preview/<git branch>`. When a pull
request closes, the Neon cleanup workflow (`.github/workflows/neon-cleanup.yml`)
deletes that branch, because the free plan allows only 10 branches. It needs the
repository secret `NEON_API_KEY` and skips with a notice when the secret is
missing.

## Tests

```sh
pnpm test:refactor
```

The gate builds, lints, enforces unit coverage and mutation scores, and runs
desktop and mobile browser journeys. It does not check presentation, so a
passing gate says nothing about whether the UI still looks the same. It uses
fake provider
responses, so it spends no ElevenLabs allowance. Setup, individual commands and
measured results are in [docs/REFACTOR_TESTING.md](docs/REFACTOR_TESTING.md).
GitHub Actions runs lint, build, unit tests and the visual suite on every pull
request and push to `main` (`.github/workflows/ci.yml`). The mutation gate runs
nightly on `main` when it has new commits (`.github/workflows/mutation.yml`);
coverage and the browser journeys run only in the local gate.

On pull requests, the Visual workflow (`.github/workflows/visual.yml`) compares
screenshots of the five top-level views, desktop and mobile, with the base
branch's. A diff does not fail the job: it publishes the Playwright report to GitHub
Pages under `pr-<number>/` and links it, with the list of changed screenshots, in a
pull request comment that every push updates; closing the pull request removes the
report. Other views are not compared. To compare locally, run
`VISUAL_COMPARE=1 pnpm test:visual --update-snapshots=all` on the base, then
`VISUAL_COMPARE=1 pnpm test:visual` on the change. macOS baselines are only
comparable with macOS runs.

## Research

[docs/DELE_A1_REQUIREMENTS.md](docs/DELE_A1_REQUIREMENTS.md) is the report behind
the course: what the exam asks for, checked against official sources on
7 September 2026, using the 2020-format general A1 guide.

The part worth knowing up front is the pass rule. Reading plus writing must reach
30 out of 50, and listening plus speaking must reach 30 out of 50, separately.
A high total does not rescue a weak group.

Official writing and speaking marks require a human examiner. The rehearsal
uses browser-friendly navigation and controllable audio, so it is not a
reproduction of exam-day administration.

## License

MIT. See [LICENSE](LICENSE).
