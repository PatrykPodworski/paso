import { examSections, firstVariants, mockTasks } from "../../src/data/mock";
import type { MockResponse, MockResponses, Question } from "../../src/data/types";

const variantOf = (q: Question) =>
  mockTasks.flatMap((t) => t.variants).find((v) => v.questions.includes(q))!.id;

// Every third question right, every third wrong, the rest unanswered.
const objective = (section: 0 | 1, q: Question, i: number): MockResponse => {
  const answer = [q.answer, q.options?.find((o) => o !== q.answer) ?? "", ""][i % 3];

  return { section, questionId: q.id, variantId: variantOf(q), answer, correct: i % 3 === 0 };
};

// The responses of a whole rehearsal of variant 1: a filled form, an empty letter, two scored
// talks and one that never scored. Built by hand, so the visual compare's base app can seed it.
export const rehearsalResponses = (): MockResponses => {
  const [reading, listening, writing, speaking] = examSections(firstVariants);
  const [form, letter] = writing.questions;
  const [presentation, topic, conversation] = speaking.questions;

  return {
    started: "2026-09-09T08:00:00.000Z",
    items: [
      ...reading.questions.map((q, i) => objective(0, q, i)),
      ...listening.questions.map((q, i) => objective(1, q, i)),
      {
        section: 2,
        questionId: form.id,
        variantId: variantOf(form),
        status: "submitted",
        text: form.fields!.map((f) => `${f.label}: ${f.example}`).join("\n"),
        band: 2,
      },
      {
        section: 2,
        questionId: letter.id,
        variantId: variantOf(letter),
        status: "empty",
        text: "",
      },
      {
        section: 3,
        questionId: presentation.id,
        variantId: variantOf(presentation),
        status: "scored",
        transcript: [
          "Lucía: Hola. ¿Cómo te llamas?",
          "You: Me llamo Bruno. Soy polaca y vivo en Gdańsk.",
          "Lucía: ¿Y a qué te dedicas?",
          "You: Soy profesor de música.",
        ].join("\n"),
        score: {
          grade: "good",
          items: [
            { id: "name", label: "Name", level: "correct" },
            { id: "nationality", label: "Nationality", level: "understandable" },
            { id: "age", label: "Age", level: "missing" },
          ],
          corrections: [
            {
              original: "Soy polaca",
              corrected: "Soy polaco",
              explanation: "Polaco agrees with a man speaking.",
            },
          ],
        },
      },
      {
        section: 3,
        questionId: topic.id,
        variantId: variantOf(topic),
        status: "scored",
        transcript: "Lucía: Háblame de tu casa.\nYou: Mi casa está cerca del centro.",
        score: { grade: "perfect", items: [{ id: "home", label: "Home", level: "correct" }] },
      },
      {
        section: 3,
        questionId: conversation.id,
        variantId: variantOf(conversation),
        status: "none",
      },
    ],
  };
};
