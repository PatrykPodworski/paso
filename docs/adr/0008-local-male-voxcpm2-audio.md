---
status: accepted
---

# 0008. New Spanish audio uses the local male VoxCPM2 voice

New Spanish recordings are generated locally with VoxCPM2 in the male teacher voice (`es-male-teacher`), with the pipeline, encode and Whisper check of [#482](https://github.com/PatrykPodworski/paso/issues/482). New texts are not sent to ElevenLabs. Generation runs one batch at a time in the background, because the local model cannot run two batches at once. Revisit when a text cannot pass the Whisper check in that voice.
