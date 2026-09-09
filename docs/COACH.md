# Writing and speaking coach

The coach reviews free-text answers and speaking transcripts. It shells out to
the Codex CLI on whichever Mac is running the dev server, so it is a
local-development feature: a copied `dist/` folder on a static host does not
include it.

## Using it

Select **Review my practice** after writing, filling in a form, or checking a
speaking transcript. The review names specific corrections and explains them,
notes strengths, checks whether the task was covered, and suggests a revision
plus one next step. **Revise my answer** applies the feedback and asks for
another review.

Speaking recordings go to the local app server only, where Whisper's
multilingual **small** model transcribes them. Check the editable transcript for
misheard words before asking for feedback, or type what you said instead. Codex
assesses the transcript's Spanish and task coverage. It does not judge
pronunciation or fluency, because it only ever sees text.

The exam rehearsal keeps its own timing and self-review flow and does not use the
coach.

## Setup

On the machine that will run `pnpm dev`, with Codex CLI, `uv` and `ffmpeg`
already installed:

```sh
codex login
uv venv .venv-coach --python 3.12
uv pip install --python .venv-coach/bin/python openai-whisper==20250625
.venv-coach/bin/python -c 'import whisper; whisper.load_model("small", device="cpu")'
pnpm dev
```

The model download is about 461 MiB and is cached locally. Transcription uses no
audio API credits. Codex requests draw on the signed-in account's allowance;
limits and errors surface in the app with an explicit retry. The coach does not
enable billing or buy credits.

## How it is wired

The service is localhost-only and runs inside the Vite dev and preview servers.
It validates task IDs, request sizes and origins, handles one request at a time,
disables Codex shell, web and app tools, and uses read-only ephemeral CLI runs in
temporary directories. It reuses the CLI's own authentication, so no credentials
reach browser code. Temporary recordings and response files are deleted after
each request.

Finished reviews are cached in server memory for 30 minutes, up to 50 answers, so
repeating a request does not immediately spend more allowance. Leaving a task
cancels its pending request. Reviews are not written to browser progress storage,
though longer writing drafts still are.

Implementation: [server/coach.ts](../server/coach.ts),
[CoachFeedback.tsx](../src/components/CoachFeedback.tsx),
[transcribe.py](../scripts/transcribe.py). The CLI connection follows the
official [non-interactive mode documentation](https://learn.chatgpt.com/docs/non-interactive-mode)
for saved authentication and JSON-schema output, and the
[configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference)
for disabled tools and read-only execution.

## Checking it live

```sh
node scripts/browser-coach-check.mjs
```

This runs writing and recorded-speaking checks against fictional course material
using the signed-in Codex allowance. It is deliberately outside the routine gate:
the ordinary browser checks simulate an unavailable coach instead, so UI
regression runs do not repeat AI requests.

Offline, the word tiles, accent keys, model answers, recording, playback,
download and self-review all still work.
