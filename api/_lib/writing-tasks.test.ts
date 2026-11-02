// @vitest-environment node
import { describe, expect, it } from "vitest";
import { mockExam } from "../../src/data/mock.ts";
import { writingTaskOf } from "./writing-tasks.ts";

describe("writing tasks", () => {
  it("marks the mock exam's letter against its checklist", () => {
    expect(writingTaskOf("mock-w2")).toEqual({
      id: "mock-w2",
      kind: "write",
      exam: true,
      prompt: expect.stringContaining("Your friend Ana writes"),
      points: [
        "I greeted Ana.",
        "I answered her invitation.",
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
