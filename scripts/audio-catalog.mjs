import {
  allQuestions,
  foundations,
  visualQuestions,
  units,
  vocabulary,
} from "../src/data/curriculum.ts";
import { formPractice, mockQuestions } from "../src/data/mock.ts";

export const phrases = [
  ...new Set(
    // Upgrade the audio needed to answer exercises and learn words first.
    // Longer productive-task models can keep their bundled recording if the
    // current included allowance runs out before the whole collection is ready.
    [...allQuestions, ...mockQuestions]
      .map((q) => q.audio)
      .filter(Boolean)
      .concat(
        vocabulary.map((w) => w.es),
        units.map((u) => u.example),
        ["Poco a poco."],
        [...allQuestions, ...mockQuestions]
          .filter((q) => ["speak", "write"].includes(q.kind))
          .map((q) => q.answer),
        // Every practice task reads the Spanish word, completed sentence, passage or model.
        [...allQuestions, ...foundations, ...visualQuestions, formPractice].map(
          (q) => q.pronunciation || q.audio || q.passage || q.answer,
        ),
      ),
  ),
];

export const previewPhrases = [
  "Poco a poco.",
  vocabulary.find((w) => w.es.includes("é")).es,
  allQuestions.find((q) => q.audio && q.audio.length > 100).audio,
];
