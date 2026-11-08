// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { mockExam } from "../../src/data/mock.ts";
import type { Question } from "../../src/data/types.ts";
import { writingTaskOf } from "./writing-tasks.ts";

const { dialogue } = vi.hoisted(() => ({
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
    singleQuestion: true,
  } satisfies Question,
}));

vi.mock("../../src/data/curriculum.ts", async (original) => {
  const curriculum = await original<typeof import("../../src/data/curriculum.ts")>();

  return { ...curriculum, allQuestions: [...curriculum.allQuestions, dialogue] };
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

  it("reviews the asking-questions dialogue items as single questions", () => {
    expect(writingTaskOf("AQ-T01-E05")).toEqual({
      id: "AQ-T01-E05",
      kind: "question",
      exam: false,
      prompt:
        "You are the server. The customer is ready to order a drink. Ask which drink they want. Use bebida and quieres.",
      points: [
        "Ask about the desired drink",
        "Include bebida and quieres",
        "Address one person informally",
      ],
      wordRange: [2, 15],
    });

    expect(writingTaskOf("AQ-T01-E04")).toBeUndefined();
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
