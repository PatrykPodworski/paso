import { describe, expect, it } from "vitest";
import { allQuestions, foundations, visualQuestions } from "./curriculum";
import { mockQuestions } from "./mock";
import { isCorrect, normalize } from "./progress";
import { setQuestions } from "./practice-sets/index";
import type { Question } from "./types";

// Spanish words with a male and a female form, and the English that translates both, so an
// English task that uses it does not say which form to write (ADR 0014).
const NOUNS: [string, string, RegExp][] = [
  ["amigo", "amiga", /\bfriend\b/i],
  ["amigos", "amigas", /\bfriends\b/i],
  ["profesor", "profesora", /\bteacher\b/i],
  ["profesores", "profesoras", /\bteachers\b/i],
  ["vecino", "vecina", /\bneighbou?r\b/i],
  ["vecinos", "vecinas", /\bneighbou?rs\b/i],
  ["niño", "niña", /\b(child|kid)\b/i],
  ["compañero", "compañera", /\b(classmate|colleague|flatmate|partner)\b/i],
  ["compañeros", "compañeras", /\b(classmates|colleagues|flatmates|partners)\b/i],
  ["primo", "prima", /\bcousin\b/i],
  ["primos", "primas", /\bcousins\b/i],
  ["alumno", "alumna", /\b(student|pupil)\b/i],
  ["médico", "médica", /\bdoctor\b/i],
  ["jefe", "jefa", /\bboss\b/i],
  ["cocinero", "cocinera", /\b(cook|chef)\b/i],
];

// Adjectives about I, you, we or they, whose gender English never shows. A named or he/she
// subject decides it, so only those subjects ask for both forms.
const ADJECTIVES: [string, string, RegExp][] = (
  [
    ["cansado", /\btired\b/i],
    ["contento", /\b(happy|glad)\b/i],
    ["ocupado", /\bbusy\b/i],
    ["enfermo", /\b(ill|sick)\b/i],
    ["nervioso", /\bnervous\b/i],
    ["aburrido", /\bbored\b/i],
    ["preocupado", /\bworried\b/i],
    ["casado", /\bmarried\b/i],
    ["listo", /\bready\b/i],
  ] as const
).flatMap(([male, english]) => {
  const stem = male.slice(0, -1);

  return [
    [male, `${stem}a`, english],
    [`${male}s`, `${stem}as`, english],
  ];
});

const UNNAMED_SUBJECT = /\b(i|i'm|you|you're|we|we're|they|they're)\b/i;

// A task that states the gender it wants, e.g. "(male speaker)" or "My female friend".
const GENDER_CUE = /\b(male|female|masculine|feminine|man|woman|boy|girl)\b/i;

const PAIRS = [...NOUNS, ...ADJECTIVES].flatMap(([male, female, english]) => {
  const subject = ADJECTIVES.some(([m]) => m === male) ? UNNAMED_SUBJECT : /./;

  return [
    { form: male, other: female, english, subject },
    { form: female, other: male, english, subject },
  ];
});

const wordsOf = (text: string) => normalize(text).split(" ");

// The gendered words of an exercise's answer whose other form a learner would be marked wrong
// for, although the English task allows it: a typed answer must accept the other form, and a
// choice must not offer it as a wrong option.
const undecidedGender = (q: Question) => {
  if (q.kind !== "type" && q.kind !== "choice") {
    return [];
  }

  const task = `${q.instruction ?? ""} ${q.prompt}`;

  if (GENDER_CUE.test(task)) {
    return [];
  }

  const rejects = (word: string) =>
    q.kind === "type"
      ? ![q.answer, ...(q.accepted ?? [])].some((a) => wordsOf(a).includes(word))
      : (q.options ?? []).some((o) => o !== q.answer && wordsOf(o).includes(word));

  return PAIRS.filter(
    (p) =>
      wordsOf(q.answer).includes(p.form) &&
      p.english.test(task) &&
      p.subject.test(task) &&
      rejects(p.other),
  ).map((p) => `${q.id}: ${p.form} is accepted, ${p.other} is not`);
};

const question = (fields: Partial<Question> & Pick<Question, "prompt" | "answer">): Question => ({
  id: "A",
  kind: "type",
  skill: "writing",
  instruction: "Translate into Spanish",
  explanation: "",
  ...fields,
});

describe("gender the English task leaves open (#817)", () => {
  it("flags a typed answer that accepts one gender of an English noun with none", () => {
    expect(
      undecidedGender(
        question({ prompt: "My friend is at home.", answer: "Mi amiga está en casa." }),
      ),
    ).toEqual(["A: amiga is accepted, amigo is not"]);
  });

  it("passes a typed answer that accepts both genders", () => {
    const both = question({
      prompt: "Where is your teacher from?",
      answer: "¿De dónde es tu profesor?",
      accepted: ["¿De dónde es tu profesora?"],
    });

    const one = { ...both, accepted: undefined };

    expect([undecidedGender(both), undecidedGender(one)]).toEqual([
      [],
      ["A: profesor is accepted, profesora is not"],
    ]);
  });

  it("passes a task that states the gender", () => {
    const cued = question({
      prompt: "My female friend is at home.",
      answer: "Mi amiga está en casa.",
    });

    const speaker = question({
      instruction: "Translate into Spanish. You are a male speaker.",
      prompt: "I am tired.",
      answer: "Estoy cansado.",
    });

    const open = { ...speaker, instruction: "Translate into Spanish" };

    expect([undecidedGender(cued), undecidedGender(speaker), undecidedGender(open)]).toEqual([
      [],
      [],
      ["A: cansado is accepted, cansada is not"],
    ]);
  });

  it("leaves an adjective whose named or gendered subject decides its form", () => {
    const named = question({ prompt: "Pablo is tired.", answer: "Pablo está cansado." });
    const sister = question({ prompt: "My sister is busy.", answer: "Mi hermana está ocupada." });
    const me = question({ prompt: "I am busy.", answer: "Estoy ocupado." });
    const us = question({ prompt: "We are busy.", answer: "Estamos ocupados." });

    expect([named, sister, me, us].map(undecidedGender)).toEqual([
      [],
      [],
      ["A: ocupado is accepted, ocupada is not"],
      ["A: ocupados is accepted, ocupadas is not"],
    ]);
  });

  it("flags a choice that offers the other gender as a wrong option", () => {
    const friend = question({
      kind: "choice",
      skill: "reading",
      prompt: "Choose “my friend”.",
      answer: "mi amigo",
      options: ["mi amigo", "mi amiga", "mis amigos"],
    });

    const spanish = question({
      kind: "choice",
      skill: "reading",
      prompt: "Mi amiga es ___.",
      answer: "alta",
      options: ["alta", "alto"],
    });

    expect([undecidedGender(friend), undecidedGender(spanish)]).toEqual([
      ["A: amigo is accepted, amiga is not"],
      [],
    ]);
  });

  it("accepts either gender wherever the English task leaves it open", () => {
    const exercises = [
      ...allQuestions,
      ...foundations,
      ...visualQuestions,
      ...mockQuestions,
      ...setQuestions,
    ];

    expect(exercises.flatMap(undecidedGender)).toEqual([]);
  });

  it("passes mi amigo for “My friend is at home on Wednesday.”", () => {
    const friend = setQuestions.find((q) => q.id === "WD-T03-N01")!;
    const teacher = setQuestions.find((q) => q.id === "AQ-M08-X02")!;

    expect([
      isCorrect(friend, "Mi amigo está en casa el miércoles."),
      isCorrect(friend, "Mi amiga está en casa el miércoles."),
      isCorrect(teacher, "¿De dónde es tu profesora?"),
      isCorrect(teacher, "¿De dónde es tu profesor?"),
    ]).toEqual([true, true, true, true]);
  });
});
