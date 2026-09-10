# Spanish audio

How the app plays audio, how the recordings are made, and the guards that sit
between the generator and the ElevenLabs account.

## Playback

The app plays pre-generated local files from `public/audio/elevenlabs/`.
`src/data/audio-sources.json` selects which recording answers which phrase. Both
are written atomically and belong with the app. Audio is MP3 at 44.1 kHz /
128 kbps, served locally during practice. Replaying a clip makes no API request
and consumes no credits.

If a generated file is missing, the player falls back to the original bundled
recording, and then to browser speech, which it labels clearly as a fallback.
Slowed playback preserves voice pitch.

Tapping a tile in a sentence-builder exercise reads that single word, and the
finished sentence is read once the answer is checked. A word tap has nowhere to
show a status line, so it has no speed control and stays silent if its recording
is missing rather than falling back to the device voice.

Only the generator ever contacts ElevenLabs, and it sends original course text.
Learner answers and microphone recordings are not sent.

## Coverage and voices

All 359 unique Spanish phrases have ElevenLabs recordings, including the
pronunciation of every practice question and each sentence-builder tile. The
original 155 recordings use Sarah with Multilingual v2. The completion batch adds
146 tagged v3 recordings and four Multilingual v2 pronunciation corrections, and
the sentence-builder batch a further 54 tagged v3 recordings, across three native
Spanish voices:

| Voice       | Used for                                   |
| ----------- | ------------------------------------------ |
| Antonio     | Vocabulary and short questions             |
| Sara Martin | Sentence examples and female introductions |
| Brian       | Longer narration                           |

[audio-verification.json](audio-verification.json) records the coverage verified
after the completion batch, before the 54 sentence-builder tiles were added.
[audio-voice-review.md](audio-voice-review.md) covers the auditions, the voice
assignment rule and the delivery choices.

## Generating missing recordings

1. Set `ELEVENLABS_API_KEY` in `.env.local`, with Text to Speech and **User:
   Read** access. Never put the key in a `VITE_*` variable or a public file.
   Voice discovery (`pnpm audio:voices`) additionally needs Voices: Read.
2. Run `pnpm audio:plan` for an offline, missing-only plan. It preserves valid
   installed recordings whatever voice or model produced them.
   `pnpm audio:quota` reports the account's live allowance without generating
   speech.
3. Run `pnpm audio:generate` (alias `pnpm audio:complete`). An interrupted run
   keeps its finished files and resumes without regenerating them.

Refresh the dev server, or run `pnpm build`, to pick up new files.

## Request settings

The v3 requests pin Spanish with `language_code: "es"`, use Natural stability
(0.5), and add one restrained delivery tag: `[calm] [slowly]`,
`[curious] [slowly]` or `[warmly] [slowly]`. Tags never reach the learner's
question or transcript, and the displayed course wording and lookup keys are
unchanged. Reviewed renderings spell out ambiguous clock times, numbers and
email addresses.

Tags and request settings are stored with each finished recording so a clip can
be traced back to the request that made it. The voice, text, model, settings and
seed together determine the MP3's cache filename.

The plan and request shape follow the official
[speech endpoint](https://elevenlabs.io/docs/api-reference/text-to-speech/convert)
and the
[v3 prompting guidance](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices),
checked 9 September 2026.

## Quota guard

The generator will not spend money you did not plan to spend, and it will stop
rather than guess.

Before every uncached request it checks the
[account subscription endpoint](https://elevenlabs.io/docs/api-reference/user/subscription/get)
and keeps a 500-credit buffer below the included plan allowance. Paid plans use
their reported included allowance; free accounts keep the 10,000-credit ceiling.
Overage billing must stay disabled. Both supported models reserve one credit per
submitted character, which is deliberately conservative; v3 reservations include
the delivery tags and enforce its 5,000-character request limit. Temporary model
discounts are not assumed when reserving. The generator never buys credits or
changes the subscription.

Generation shares a private `.elevenlabs-usage.local.json` reservation record and
an exclusive `.audio-generation.lock`. Every attempted request is reserved before
it is sent, so a crash, a timeout or a delayed provider usage report cannot hand
back credits that may in fact have been spent. Speech requests run one at a time
with no automatic retries; read-only quota checks retry a rate limit twice.
Unknown usage, an unreadable ledger or enabled overages stop the run and leave
finished files in place.

## Legacy generators

The original single-voice tools still work and are invoked explicitly:

```sh
node scripts/generate-elevenlabs.mjs --plan
node scripts/generate-elevenlabs.mjs --generate
```

They use `ELEVENLABS_VOICE_ID` with Multilingual v2 and can replace installed
selections, so prefer the missing-only `pnpm` commands for routine completion.
`pnpm audio:preview` generates three samples with that configured voice. If a
legacy request times out after billing, `pnpm audio:recover` uses History: Read
access to download matching recordings from that voice's 100 most recent history
items, without generating speech. Legacy recovery cannot recover directed v3
batches.

There is also an offline macOS generator:

```sh
node scripts/generate-audio.mjs
```

It needs the Mónica voice, `say`, and FFmpeg (currently
`/opt/homebrew/bin/ffmpeg`). It writes deterministic filenames and skips clips
that already exist. The ElevenLabs generator needs only Node 22.18+ and an API
key, and does not need FFmpeg. Normal use of the finished app needs neither
generator.
