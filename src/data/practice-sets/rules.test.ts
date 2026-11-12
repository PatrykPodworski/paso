import { describe, expect, it } from "vitest";
import { normalize } from "../progress";
import type { Exercise, Question, TeachingQuestion } from "../types";
import { teachingCard } from "./item";
import { practiceSets } from "./index";

// Every lesson as the learner meets it, the items it recalls from earlier lessons included.
const lessonsWithCards = practiceSets.flatMap((set) =>
  set.lessons.map((l) => ({ name: `${set.id} ${l.id}`, questions: set.lesson(l.id).questions })),
);

const lessons = lessonsWithCards.map((l) => ({
  ...l,
  questions: l.questions.filter((q) => q.kind !== "teach"),
}));

// A sentence ends in . ? or !, while a target word such as "por la mañana" is written bare.
// An order item's answer is a sentence even without the full stop.
const isSentence = (q: Question, text: string) => q.kind === "order" || /[.?!]$/.test(text.trim());

// The Spanish the item says after answering and, for a writing item, the answer it expects.
const sentencesOf = (q: Question) => {
  const texts = [q.pronunciation, q.skill === "writing" ? q.answer : undefined];
  const sentences = texts.filter((t): t is string => !!t && isSentence(q, t));

  return [...new Set(sentences.map(normalize))];
};

const repeatedSentences = (questions: Question[]) => {
  const first = new Map<string, string>();
  const repeats: string[] = [];

  for (const q of questions) {
    for (const sentence of sentencesOf(q)) {
      const earlier = first.get(sentence);

      if (earlier) {
        repeats.push(`${q.id} repeats ${earlier}: ${sentence}`);
      } else {
        first.set(sentence, q.id);
      }
    }
  }

  return repeats;
};

// The answer as written, then with each word in turn replaced by the gap.
const framesOf = (answer: string) => {
  const words = normalize(answer).split(" ");
  const gapped = words.map((_, i) => words.map((w, j) => (i === j ? "___" : w)).join(" "));

  return [words.join(" "), ...gapped];
};

const givenAway = (q: Question) => {
  if (q.skill !== "writing" || !isSentence(q, q.answer)) {
    return [];
  }

  const task = ` ${normalize(`${q.instruction ?? ""} ${q.prompt}`)} `;

  return [q.answer, ...(q.accepted ?? [])]
    .filter((a) => framesOf(a).some((frame) => task.includes(` ${frame} `)))
    .map((a) => `${q.id}: ${a}`);
};

const withoutInstruction = (q: Question) => q.skill === "writing" && !q.instruction?.trim();

// The writing review grades these kinds through the AI tutor; every other kind is checked in the app.
const aiReviewed = (q: Question) => ["write", "form", "live"].includes(q.kind);

// Each lesson's items that break a rule, named by set, lesson and item.
const breaking = (rule: (q: Question) => boolean) =>
  lessons.flatMap((l) => l.questions.filter(rule).map((q) => `${l.name} ${q.id}`));

// A teaching card has a rule, words or examples, and every example has its English.
const teachingProblems = (q: TeachingQuestion) => {
  const { rule = "", terms = [], examples = [] } = q.teach;
  const parts = (rule.trim() ? 1 : 0) + terms.length + examples.length;
  const allExamples = [...terms.flatMap((t) => (t.example ? [t.example] : [])), ...examples];

  return [
    ...(parts ? [] : [`${q.id}: no rule, words or examples`]),
    ...allExamples.filter((e) => !e.en.trim()).map((e) => `${q.id}: ${e.es} has no English`),
  ];
};

const question = (fields: Partial<Exercise> & Pick<Exercise, "id" | "kind">): Exercise => ({
  skill: "writing",
  instruction: "Translate into Spanish",
  prompt: "",
  answer: "",
  explanation: "",
  ...fields,
});

describe("practice-set item rules (#755)", () => {
  it("R1: uses each Spanish sentence in one item of a lesson, while the target word repeats", () => {
    const fixture = [
      question({ id: "A", kind: "choice", skill: "reading", pronunciation: "hoy" }),
      question({ id: "B", kind: "type", answer: "hoy", pronunciation: "Reunión de Luis: hoy." }),
      question({ id: "C", kind: "type", answer: "Hoy", pronunciation: "Hoy" }),
      question({ id: "D", kind: "type", answer: "Reunión de Luis: hoy." }),
      question({ id: "E", kind: "order", answer: "Desayuno y luego trabajo" }),
      question({ id: "F", kind: "choice", pronunciation: "Desayuno y luego trabajo." }),
    ];

    expect(repeatedSentences(fixture)).toEqual([
      "D repeats B: reunión de luis hoy",
      "F repeats E: desayuno y luego trabajo",
    ]);

    const repeats = lessons.flatMap((l) =>
      repeatedSentences(l.questions).map((r) => `${l.name} ${r}`),
    );

    expect(repeats).toEqual([]);
  });

  it("R2: keeps a full-sentence answer out of its own task, also with one word gapped", () => {
    const fixture = [
      question({
        id: "A",
        kind: "type",
        prompt: "Diego’s visit: today.",
        answer: "Visita de Diego: hoy.",
      }),
      question({
        id: "B",
        kind: "type",
        instruction: "Write the full sentence: La taza está ___ la caja.",
        prompt: "The cup is in the box.",
        answer: "La taza está en la caja.",
      }),
      question({
        id: "C",
        kind: "type",
        prompt: "Today is Tuesday. Café con Luis: hoy.",
        answer: "Visita de Diego: hoy.",
        accepted: ["Café con Luis: hoy."],
      }),
      question({ id: "D", kind: "type", prompt: "Reunión de Luis: ___.", answer: "hoy" }),
    ];

    expect(fixture.flatMap(givenAway)).toEqual([
      "B: La taza está en la caja.",
      "C: Café con Luis: hoy.",
    ]);

    const leaks = lessons.flatMap((l) =>
      l.questions.flatMap(givenAway).map((g) => `${l.name} ${g}`),
    );

    expect(leaks).toEqual([]);
  });

  it("R3: checks every item in the app, none by the AI writing review", () => {
    const fixture = [
      question({ id: "A", kind: "type" }),
      question({ id: "B", kind: "write" }),
      question({ id: "C", kind: "order" }),
    ];

    expect(fixture.filter(aiReviewed).map((q) => q.id)).toEqual(["B"]);
    expect(breaking(aiReviewed)).toEqual([]);
  });

  it("R6: gives every writing item an instruction apart from its prompt", () => {
    const fixture = [
      question({ id: "A", kind: "type" }),
      question({ id: "B", kind: "order", instruction: undefined }),
      question({ id: "C", kind: "type", instruction: " " }),
      question({ id: "D", kind: "choice", skill: "reading", instruction: undefined }),
    ];

    expect(fixture.filter(withoutInstruction).map((q) => q.id)).toEqual(["B", "C"]);

    expect(breaking(withoutInstruction)).toEqual([]);
  });
});

describe("practice-set teaching cards (#801)", () => {
  it("gives every teaching card a rule, words or examples, each example with its English", () => {
    const fixture = [
      teachingCard("B", { heading: "New words", rule: " ", terms: [] }),
      teachingCard("C", {
        heading: "New words",
        terms: [
          { es: "hoy", meaning: "today", example: { es: "Clase: hoy.", en: " " } },
          { es: "ayer", meaning: "yesterday" },
        ],
        examples: [{ es: "el lunes", en: "one Monday" }],
      }),
      teachingCard("D", {
        heading: "el lunes",
        rule: "el is one day.",
        examples: [{ es: "el lunes", en: "" }],
      }),
    ];

    expect(fixture.flatMap(teachingProblems)).toEqual([
      "B: no rule, words or examples",
      "C: Clase: hoy. has no English",
      "D: el lunes has no English",
    ]);

    const problems = lessonsWithCards.flatMap((l) =>
      l.questions
        .filter((q) => q.kind === "teach")
        .flatMap(teachingProblems)
        .map((p) => `${l.name} ${p}`),
    );

    expect(problems).toEqual([]);
  });
});
