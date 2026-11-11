// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { mockExam } from "../../src/data/mock.ts";
import type { Question } from "../../src/data/types.ts";
import { writingTaskOf } from "./writing-tasks.ts";

const { dialogue, sentence } = vi.hoisted(() => ({
  dialogue: {
    id: "fixture-ask-drink",
    kind: "write",
    skill: "writing",
    prompt: "You are the server. Ask which drink they want. Use bebida and quieres.",
    answer: "¿Qué bebida quieres?",
    explanation: "Use qué before bebida.",
    checklist: ["Ask about the desired drink", "Include bebida and quieres"],
    minWords: 2,
    maxWords: 15,
    single: "question",
  } satisfies Question,
  sentence: {
    id: "fixture-state-course",
    kind: "write",
    skill: "writing",
    prompt: "The course starts on Mondays. Express this stated fact naturally in Spanish.",
    answer: "El curso empieza los lunes.",
    explanation: "Use los lunes for every Monday.",
    checklist: [
      "Uses los lunes for every Monday",
      "Keeps the fact and the people of the situation",
    ],
    minWords: 2,
    maxWords: 15,
    single: "sentence",
  } satisfies Question,
}));

vi.mock("../../src/data/curriculum.ts", async (original) => {
  const curriculum = await original<typeof import("../../src/data/curriculum.ts")>();

  return { ...curriculum, allQuestions: [...curriculum.allQuestions, dialogue, sentence] };
});

describe("writing tasks", () => {
  it("marks the mock exam's letter against its checklist", () => {
    expect(writingTaskOf("mock-w2")).toEqual({
      id: "mock-w2",
      kind: "write",
      exam: true,
      prompt: expect.stringContaining("Your friend Jorge writes"),
      points: [
        "I greeted Jorge.",
        "I answered his invitation.",
        "I gave a meeting place and time.",
        "I suggested an activity.",
        "I said goodbye.",
      ],
      wordRange: [30, 40],
    });
  });

  it("checks a form against its field labels", () => {
    const task = writingTaskOf("mock-w1");

    expect([task?.kind, task?.exam, task?.wordRange]).toEqual(["form", true, [15, 25]]);

    expect(task?.points).toEqual([
      "Nombre y apellidos",
      "Nacionalidad",
      "Ciudad",
      "Profesión",
      "Lenguas",
      "Aficiones",
    ]);
  });

  it("marks every writing variant as an exam task with its own points", () => {
    for (const q of mockExam[2].tasks.flatMap((t) => t.variants.flatMap((v) => v.questions))) {
      expect(writingTaskOf(q.id), q.id).toMatchObject({
        exam: true,
        prompt: q.prompt,
        points: q.fields?.map((f) => f.label) ?? q.checklist,
      });
    }
  });

  it("reviews lesson and practice writing without an exam mark", () => {
    expect(writingTaskOf("u1-o2")).toMatchObject({ kind: "write", exam: false });
    expect(writingTaskOf("form-practice")).toMatchObject({ kind: "form", exam: false });
  });

  it("reviews a single written question against its points", () => {
    expect(writingTaskOf("fixture-ask-drink")).toEqual({
      id: "fixture-ask-drink",
      kind: "question",
      exam: false,
      prompt: "You are the server. Ask which drink they want. Use bebida and quieres.",
      points: ["Ask about the desired drink", "Include bebida and quieres"],
      wordRange: [2, 15],
    });
  });

  it("reviews a single written sentence against its points", () => {
    expect(writingTaskOf("fixture-state-course")).toEqual({
      id: "fixture-state-course",
      kind: "sentence",
      exam: false,
      prompt: "The course starts on Mondays. Express this stated fact naturally in Spanish.",
      points: ["Uses los lunes for every Monday", "Keeps the fact and the people of the situation"],
      wordRange: [2, 15],
    });
  });

  it("reviews the asking-questions dialogue items as single questions", () => {
    expect(writingTaskOf("AQ-T05-E05")).toEqual({
      id: "AQ-T05-E05",
      kind: "question",
      exam: false,
      prompt:
        "You answer a call from an unknown number. Ask the caller’s identity directly. Use eres, not a name guess.",
      points: ["Ask for the caller’s identity", "Use eres", "Do not guess a name"],
      wordRange: [2, 15],
    });

    expect(writingTaskOf("AQ-T01-E05")).toBeUndefined();
    expect(writingTaskOf("AQ-T01-N04")).toBeUndefined();
  });

  it("reviews the weekdays express-naturally items as single sentences", () => {
    expect(writingTaskOf("WD-T01-E06")).toEqual({
      id: "WD-T01-E06",
      kind: "sentence",
      exam: false,
      prompt:
        "A displayed calendar says Monday, not the actual date. Express this fact naturally in Spanish. Use the words you know.",
      points: ["Uses lunes for Monday", "Keeps the fact and the people of the situation"],
      wordRange: [2, 15],
    });

    expect(writingTaskOf("WD-T01-E05")).toBeUndefined();

    expect(writingTaskOf("WD-T02-V10")).toEqual({
      id: "WD-T02-V10",
      kind: "sentence",
      exam: false,
      prompt:
        "I work on Tuesdays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
      points: [
        "Uses los martes for every Tuesday",
        "Keeps the fact and the people of the situation",
      ],
      wordRange: [2, 15],
    });

    expect(writingTaskOf("WD-T03-V10")).toEqual({
      id: "WD-T03-V10",
      kind: "sentence",
      exam: false,
      prompt:
        "I study on Wednesdays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
      points: [
        "Uses los miércoles for every Wednesday",
        "Keeps the fact and the people of the situation",
      ],
      wordRange: [2, 15],
    });

    expect(writingTaskOf("WD-T04-V10")).toEqual({
      id: "WD-T04-V10",
      kind: "sentence",
      exam: false,
      prompt:
        "Pablo works on Thursdays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
      points: [
        "Uses los jueves for every Thursday",
        "Keeps the fact and the people of the situation",
      ],
      wordRange: [2, 15],
    });

    expect(writingTaskOf("WD-T05-V10")).toEqual({
      id: "WD-T05-V10",
      kind: "sentence",
      exam: false,
      prompt:
        "Pablo has class on Fridays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
      points: [
        "Uses los viernes for every Friday",
        "Keeps the fact and the people of the situation",
      ],
      wordRange: [2, 15],
    });

    expect(writingTaskOf("WD-T06-V10")).toEqual({
      id: "WD-T06-V10",
      kind: "sentence",
      exam: false,
      prompt:
        "I work on Saturdays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
      points: [
        "Uses los sábados for every Saturday",
        "Keeps the fact and the people of the situation",
      ],
      wordRange: [2, 15],
    });

    expect(writingTaskOf("WD-T07-V10")).toEqual({
      id: "WD-T07-V10",
      kind: "sentence",
      exam: false,
      prompt:
        "Luis works on Sundays. Express this stated fact naturally in Spanish. Keep the speaker and reference person as stated.",
      points: [
        "Uses los domingos for every Sunday",
        "Keeps the fact and the people of the situation",
      ],
      wordRange: [2, 15],
    });
  });

  it("reviews the placement open sentences as single sentences", () => {
    expect(writingTaskOf("SP-T01-E06")).toEqual({
      id: "SP-T01-E06",
      kind: "sentence",
      exam: false,
      prompt:
        "The cup is in the box. Say in one Spanish sentence where the cup is. Words: cup = la taza; box = la caja.",
      points: ["Uses en for in or on", "Keeps the things and their places as stated"],
      wordRange: [2, 15],
    });

    expect(writingTaskOf("SP-T02-V11")).toEqual({
      id: "SP-T02-V11",
      kind: "sentence",
      exam: false,
      prompt:
        "The bag is inside the suitcase. Say in one Spanish sentence where the bag is. Words: bag = la bolsa; suitcase = la maleta.",
      points: ["Uses dentro de for inside", "Keeps the things and their places as stated"],
      wordRange: [2, 15],
    });

    expect(writingTaskOf("SP-T03-V11")).toEqual({
      id: "SP-T03-V11",
      kind: "sentence",
      exam: false,
      prompt:
        "The bag is outside the suitcase. Say in one Spanish sentence where the bag is. Words: bag = la bolsa; suitcase = la maleta.",
      points: ["Uses fuera de for outside", "Keeps the things and their places as stated"],
      wordRange: [2, 15],
    });

    expect(writingTaskOf("SP-T04-V11")).toEqual({
      id: "SP-T04-V11",
      kind: "sentence",
      exam: false,
      prompt:
        "The bag is above the door, not touching it. Say in one Spanish sentence where the bag is. Words: bag = la bolsa; door = la puerta.",
      points: [
        "Uses encima de for on top of or above",
        "Keeps the things and their places as stated",
      ],
      wordRange: [2, 15],
    });

    expect(writingTaskOf("SP-T01-E05")).toBeUndefined();
  });

  it("knows only writing tasks", () => {
    expect(["mock-s1", "u1-v0", "u99-o2", 7, undefined].map(writingTaskOf)).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
  });
});
