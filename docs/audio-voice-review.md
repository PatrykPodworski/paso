# Spanish voice direction

The September 2026 completion batch fills 150 missing ElevenLabs recordings while preserving the original 155 Sarah/Multilingual v2 recordings. Playback uses local files and consumes no generation credits.

## Voices

| Voice                                | Native accent          | Assignment                                                                           |
| ------------------------------------ | ---------------------- | ------------------------------------------------------------------------------------ |
| Antonio (`htFfPSZGJwjBv1CL0aMD`)     | Latin American Spanish | Isolated vocabulary, short questions, male introductions and conversational examples |
| Sara Martin (`KHCvMklQZZo0O30ERnVn`) | Peninsular Spanish     | Sentence examples, female introductions, letters and messages                        |
| Brian (`jBlmi27XRORxjPquUeCh`)       | Latin American Spanish | Longer passages and narration                                                        |

Assignments use the phrase content and a stable text hash. Female and male first-person introductions take precedence over the hash. A phrase keeps the same voice when the course grows. The initial completion plan assigned 98 clips to Antonio, 42 to Sara and 10 to Brian; reviewed replacements can change an individual assignment when clarity requires it.

## Delivery

The generator uses Eleven v3, Spanish language enforcement, MP3 at 44.1 kHz / 128 kbps, and a fixed seed for reproducibility. Initial takes use Natural stability (0.5). Corrected v3 takes use Robust stability (1), speed 0.85 and a changed seed. Four phrases that remained unclear with v3 use Multilingual v2 with Antonio, stability 0.65 and speed 0.85: the reading-and-swimming model, “dieciséis”, “Yo quiero una ensalada.” and “Quiero una chaqueta negra.” These four clips have no audio tags. The final new set contains 146 tagged v3 clips and four v2 clips: 101 Antonio, 39 Sara and 10 Brian.

- `[calm] [slowly]` for vocabulary and declarative passages.
- `[curious] [slowly]` for questions.
- `[warmly] [slowly]` for greetings and friendly messages.

These are delivery prompts, not a guaranteed playback speed. No laughter, whispering, music or sound effects are requested. Displayed course text stays intact. The initial requests add only tags; reviewed spoken renderings can spell out ambiguous times, numbers or email addresses without changing their meaning. These renderings are retained in the manifest alongside the displayed text. Original text determines the app's audio lookup key. The manifest records the selected voice, full request and model, so reviewed takes remain reproducible if an asset is lost.

The approach follows ElevenLabs’ [v3 prompting guidance](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices). The generator conservatively reserves one credit per submitted character, including tags, and retains a 500-credit buffer within the account’s included allowance.

## Auditions and checks

Nine auditions compared all three voices on “apellidos”, “¿Dónde vives? — En Málaga.” and a longer Pablo introduction. Local Whisper transcription recovered the full question with Antonio and Sara. Brian’s short question omitted words, so Brian was excluded from short-question assignments. Antonio’s isolated “apellidos” was recognized correctly; Sara’s version was ambiguous in the automated check. All three longer introductions matched the script apart from punctuation.

Every completion recording receives a local Whisper transcription and an FFmpeg decoding check. Differences in spelling, punctuation and number formatting are distinguished from missing or incorrect words. Unclear readings receive another decoder check and, where needed, a replacement take. Automated transcription is a screening tool; it does not certify native pronunciation quality.

“Llueve” required an additional transcription check with a preceding weather phrase because isolated-word decoders produced acronym-like spellings. The original tagged v3 take was correctly recognized in that context and retained. Clock times, the student form and the shop closing phrase were checked again after their spoken renderings were corrected.

The final counts, account usage and browser playback results are recorded in [audio-verification.json](audio-verification.json). The full selected requests are in [audio-sources.json](../src/data/audio-sources.json).
