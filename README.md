# Paso — a little Spanish, every day

An interactive DELE A1 learning app built with Vite, React and TypeScript. It uses original course content informed by Instituto Cervantes sources.

## Start

```sh
git clone https://github.com/PatrykPodworski/paso.git
cd paso
pnpm install
pnpm dev
```

Open **http://127.0.0.1:5173**. Core lessons work without an account. The optional writing and speaking coach uses a local Codex CLI login; setup is below. Browser and Python test setup lives in [the test guide](docs/REFACTOR_TESTING.md).

For a production build:

```sh
pnpm build
pnpm preview
```

The generated `dist/` folder is a static site. Serve it over HTTP; microphone access requires localhost or HTTPS. All teaching audio and illustrations are local assets. The coach requires the local server supplied by `pnpm dev` or `pnpm preview`; copying `dist/` to a static host does not include that service.

## Inside

- **12 units, 48 lessons, 264 learning-path exercises.** Every unit touches reading, listening, writing and speaking.
- **350 original questions and tasks overall:** the learning path, 24 foundation checks, six visual questions, a personal form, and a 55-item exam rehearsal.
- **96 vocabulary cards** with search, flip, Spanish playback and individual memory hints.
- **305 Spanish audio phrases**, with an ElevenLabs generation pipeline, local MP3 playback, a compact playback icon beside each question, and Mónica recordings as a fallback. Listening questions play automatically on entry. Selecting a single answer checks it immediately; practice feedback reads the Spanish word, completed sentence, passage or model. Listening audio keeps playing when an answer is selected; the icon can stop or replay it. Typed answers, sentence builders and productive tasks retain their explicit check/review action.
- **Explanations and mistake review.** Vocabulary feedback gives the meaning and a separate, word-specific memory hint: a pronunciation cue, useful phrase, word breakdown or visual association. The same hint appears on flipped cards and in mistake review. Checked errors save immediately. Correct unassisted retries clear the queue. Transcript help is remembered.
- **Writing and speaking.** Codex checks writing and editable speaking transcripts, explains corrections, checks task coverage and suggests a revision and next step. Recordings are transcribed locally with Whisper. Word tiles, accent keys, models, recording/playback/download and self-review remain available offline.
- **Exam rehearsal.** Official section time limits and task counts, a separate ten-minute oral preparation stage, deadlines that survive reloads, saved responses, section reviews and export for a teacher.
- **Source-linked A1 guide.** Readiness checklist, official resources, exam logistics and an interactive two-group passing calculator.
- **Local progress.** Lessons, practice history, goals, streaks, XP, preferences, longer writing/form drafts and self-assessments persist in this browser. New objective practice attempts start blank. Export progress from preferences. Recordings exist only in the active tab unless downloaded.
- **Responsive, comfortable UI.** Larger default type and controls, keyboard navigation, native modal focus containment, reduced-motion support and original SVG illustrations.

## Research

Read [the research and requirements report](docs/DELE_A1_REQUIREMENTS.md). Sources were checked on 7 September 2026, with the official 2020-format general A1 guide as the exam reference. The app links the full Cervantes inventories for exhaustive linguistic detail and the official sample papers for exact-format practice.

Reading + writing and listening + speaking must **each** reach 30/50. Official writing and speaking assessment requires human judgment. Codex supplies practice feedback, without an official score or a pronunciation/fluency judgment from a transcript. The rehearsal uses browser-friendly navigation and controllable audio, and does not reproduce live exam administration.

## Validation

Run `pnpm test:refactor` before and after structural changes. The gate builds and lints, enforces unit coverage and mutation scores, tests the local transcription boundary, and runs desktop/mobile browser journeys and screenshot comparisons. Tests use fake provider responses and consume no ElevenLabs or Codex allowance.

See [the rule inventory and test guide](docs/REFACTOR_TESTING.md) for first-time setup, individual commands, screenshot review, mutation scope and measured results.

The earlier `scripts/browser-check.mjs` is a manual smoke-check script. Use the pinned Playwright regression suite (`pnpm test:browser`) for refactor verification. The live coach smoke check remains manual and is excluded from the routine gate.

## Project map

| File                                        | Purpose                                                      |
| ------------------------------------------- | ------------------------------------------------------------ |
| `src/App.tsx`                               | Dashboard, path, studio, vocabulary and preferences          |
| `src/data/curriculum.ts`                    | Original course, vocabulary, foundation and visual exercises |
| `src/data/vocabulary-hints.ts`              | Curated memory hints for all 96 vocabulary items             |
| `src/data/mock.ts`                          | Original exam rehearsal and personal form                    |
| `src/data/research.ts`                      | Source-linked readiness map                                  |
| `src/data/progress.ts`                      | Progress, scoring and targeted writing checks                |
| `src/components/QuestionCard.tsx`           | Exercise types and feedback                                  |
| `src/components/MockExam.tsx`               | Timed rehearsal, review and score calculator                 |
| `src/components/Audio.tsx` / `Recorder.tsx` | Audio playback and microphone practice                       |
| `src/components/Guide.tsx`                  | Exam requirements and resources                              |
| `src/styles.css`                            | Responsive visual design and comfortable UI scale            |
| `public/audio/`                             | Original generated speech and manifest                       |
| `public/illustrations/`                     | Original scene SVGs                                          |

## Natural Spanish audio with ElevenLabs

The app plays pre-generated local files. Only the generator contacts ElevenLabs, sending original course text; learner answers and microphone recordings are never sent to ElevenLabs. Replaying a clip makes no ElevenLabs API request. The separate Codex coach sends answers or reviewed transcripts to Codex only when the learner requests feedback.

All **305 unique Spanish phrases** have ElevenLabs recordings, including every practice question’s pronunciation. The original 155 ElevenLabs recordings use Sarah with Multilingual v2. The completion batch uses **three native Spanish voices** (146 tagged v3 recordings and four Multilingual v2 pronunciation corrections): Antonio for vocabulary and short questions, Sara Martin for sentence examples and female introductions, and Brian for longer narration. [Generation and playback verification](docs/audio-verification.json) records installed coverage; [voice review](docs/audio-voice-review.md) explains the auditions and delivery choices.

1. Set `ELEVENLABS_API_KEY` in `.env.local`, with Text to Speech and **User: Read** access. Never put the key in a `VITE_*` variable or public file. Optional voice discovery requires Voices: Read and is available through `pnpm audio:voices`.
2. Run `pnpm audio:plan` for an **offline, missing-only plan**. It preserves valid installed recordings regardless of their voice or model. `pnpm audio:quota` checks the account’s live allowance without generating speech.
3. Run `pnpm audio:generate` (alias: `pnpm audio:complete`) to generate missing recordings. An interrupted run preserves finished files and resumes without regenerating them. Refresh the dev app, or run `pnpm build` for the static site.

The v3 requests enforce Spanish with `language_code: "es"`, use Natural stability (0.5), and add restrained audio tags: `[calm] [slowly]`, `[curious] [slowly]`, or `[warmly] [slowly]`. The displayed course wording and lookup keys remain unchanged. Reviewed spoken renderings spell out ambiguous clock times, numbers or email addresses when needed. Tags and request settings are stored with each completed recording for traceability; tags never appear in the learner’s question or transcript. The source voice, text, model, settings and seed determine each MP3’s cache filename. The current plan and request follow the official [speech endpoint](https://elevenlabs.io/docs/api-reference/text-to-speech/convert) and [v3 prompting guidance](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices), checked 9 September 2026.

The quota guard checks the [account subscription endpoint](https://elevenlabs.io/docs/api-reference/user/subscription/get) before each uncached request and retains a **500-credit buffer** below the included plan allowance. Paid plans use their reported included allowance; free accounts retain the 10,000-credit ceiling. Overage billing must remain disabled. Both supported models reserve one credit per submitted character conservatively; v3 reservations include delivery tags and enforce its 5,000-character request limit. Temporary model discounts are not assumed when reserving credits. The generator never purchases credits or changes the subscription.

All generation shares a private `.elevenlabs-usage.local.json` reservation record and an exclusive `.audio-generation.lock`. Every attempted request is reserved before sending, so crashes, timeouts and delayed provider usage reports cannot restore potentially spent credits. Speech requests run sequentially without automatic retries. Read-only quota checks can retry rate limits twice. Unknown usage, an unreadable ledger or enabled overages stop the run while preserving finished files.

Generated MP3s live in `public/audio/elevenlabs/`; `src/data/audio-sources.json` selects completed recordings. Both are written atomically and should stay with the app. Audio is MP3 at 44.1 kHz / 128 kbps, served locally during practice; replaying it consumes no provider credits.

The original single-voice tools remain available explicitly: `node scripts/generate-elevenlabs.mjs --plan` and `--generate` use `ELEVENLABS_VOICE_ID` with Multilingual v2. They can replace installed selections, so use the missing-only `pnpm` commands for routine completion. `pnpm audio:preview` generates three samples with that configured legacy voice. If a legacy request times out after billing, `pnpm audio:recover` uses History: Read access to download matching recordings from that voice’s 100 most recent history items without a speech-generation request. This legacy recovery command does not recover directed v3 batches.

## Codex writing and speaking coach

The coach is connected through the Codex CLI already signed in on this Mac. Select **Review my practice** after writing, completing a form, or checking a speaking transcript. It returns specific corrections with explanations, strengths, task coverage, a suggested revision and one next step. **Revise my answer** lets you apply the feedback and request another review.

Speaking recordings are sent only to the local app server for transcription with Whisper's multilingual **small** model. Review the editable transcript for misheard words before asking Codex for feedback. You can also type what you said. Codex assesses the transcript's Spanish and task coverage; it does not assess pronunciation or fluency from text. Exam rehearsal keeps its independent timing and self-review flow.

Setup on another Mac (Codex CLI, `uv` and `ffmpeg` must be installed):

```sh
codex login
uv venv .venv-coach --python 3.12
uv pip install --python .venv-coach/bin/python openai-whisper==20250625
.venv-coach/bin/python -c 'import whisper; whisper.load_model("small", device="cpu")'
pnpm dev
```

The model download is about 461 MiB and is cached locally. Transcription uses no audio API credits. Codex requests use the signed-in account's allowance; limits and errors are shown in the app, with an explicit retry. The coach does not enable billing or purchase credits.

The localhost-only service runs through the Vite development and preview servers. It validates task IDs, request sizes and origins; runs one request at a time; disables Codex shell, web and app tools; and uses read-only, ephemeral CLI runs in temporary directories. It reuses CLI authentication without putting credentials in browser code. Temporary recordings and response files are removed after each request. Completed reviews are cached in server memory for 30 minutes (up to 50 answers), so repeating the same request does not immediately use more allowance. Leaving a task cancels its pending request. Reviews are not added to browser progress storage; longer writing drafts remain saved.

Implementation: [server/coach.ts](server/coach.ts), [CoachFeedback.tsx](src/components/CoachFeedback.tsx), [transcribe.py](scripts/transcribe.py). The CLI connection follows the official [non-interactive mode documentation](https://learn.chatgpt.com/docs/non-interactive-mode) for saved authentication and JSON-schema output, and the [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference) for disabled tools and read-only execution.

`node scripts/browser-coach-check.mjs` runs live writing and recorded-speaking checks using fictional course material and the signed-in Codex allowance. The ordinary browser checks use a simulated unavailable coach instead, avoiding repeated AI requests during UI regression checks.

If a generated file is unavailable, the player tries its original bundled recording, then clearly labels browser speech as a last fallback. Slower local playback preserves voice pitch. The original offline generator remains available on macOS:

```sh
node scripts/generate-audio.mjs
```

That offline generator needs the Mónica voice, `say`, and FFmpeg (currently `/opt/homebrew/bin/ffmpeg`). It writes deterministic filenames and skips clips that already exist. The ElevenLabs generator only needs Node 22.18+ and an API key; it does not need FFmpeg. Normal use of the finished app does not need either generator.

## Dependency policy

The copied starter uses pnpm and a seven-day `minimumReleaseAge` in `pnpm-workspace.yaml`. The project has its own lockfile and local dependency installation, including pinned browser and mutation-test tooling. The shared starter installation is untouched. No `.env` secrets were copied.
