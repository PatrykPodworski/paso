import sources from "../../data/audio-sources.json";
import { audioKey, spokenText } from "../../data/audio";
import { foundations, units, vocabulary, visualQuestions } from "../../data/curriculum";
import examples from "../../data/examples.json";
import { formPractice, mockQuestions } from "../../data/mock";
import { practiceSets } from "../../data/practice-sets/index";
import { lessonBuilder } from "../../data/practice-sets/lesson";
import type { Question } from "../../data/types";
import words from "../../data/words.json";

export type AudioAsset = { id: string; text: string; src: string; source: string };

// Every text a question can play: the listening clip, the spoken answer, a model answer
// and each sentence-builder tile.
const questionTexts = (questions: Question[]) =>
  questions.flatMap((q) => [
    q.audio,
    spokenText(q),
    ...(["write", "order"].includes(q.kind) ? [q.answer] : []),
    ...(q.tokens ?? []),
  ]);

const collections: [string, (string | undefined)[]][] = [
  ...units.map((u, i): [string, (string | undefined)[]] => [
    `Unit ${i + 1}`,
    [
      ...vocabulary.filter((w) => w.unit === i + 1).map((w) => w.es),
      u.example,
      ...questionTexts(u.lessons.flatMap((l) => l.questions)),
    ],
  ]),
  ...practiceSets.flatMap((s) => {
    const { lessonItems } = lessonBuilder(s.questions);

    return s.units
      .filter((u) => u.lessons.length)
      .map((u): [string, (string | undefined)[]] => [
        `${s.name} · ${u.title}`,
        questionTexts(u.lessons.flatMap(lessonItems)),
      ]);
  }),
  ["Mock exam", questionTexts(mockQuestions)],
  ["Foundations", questionTexts([...foundations, ...visualQuestions, formPractice])],
  [
    "Topic flashcards",
    [
      ...words.flatMap((t) => t.words.map((w) => w.es)),
      ...Object.values(examples).map((e) => e.es),
    ],
  ],
];

const sourceOrder = [...collections.map(([name]) => name), "Other"];

// A text spoken in several places belongs to the first collection that speaks it.
const spoken = new Map<string, { text: string; source: string }>();

for (const [source, texts] of collections) {
  for (const text of texts) {
    if (text && !spoken.has(audioKey(text))) {
      spoken.set(audioKey(text), { text, source });
    }
  }
}

// Some early ElevenLabs entries were saved without their text.
const recordings: Record<string, { src: string; text?: string }> = sources;

export const audioSourceNames = sourceOrder;

export const audioAssets: AudioAsset[] = Object.entries(recordings)
  .map(([key, clip]) => ({
    id: `audio:${key}`,
    text: clip.text ?? spoken.get(key)?.text ?? "No text recorded",
    src: clip.src,
    source: spoken.get(key)?.source ?? "Other",
  }))
  .sort((a, b) => sourceOrder.indexOf(a.source) - sourceOrder.indexOf(b.source));
