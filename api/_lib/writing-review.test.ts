// @vitest-environment node
import { describe, expect, it } from "vitest";
import { parseReview, presetReview, schemaOf } from "./writing-review.ts";
import { writingTaskOf } from "./writing-tasks.ts";

const letter = writingTaskOf("mock-w2")!;
const form = writingTaskOf("mock-w1")!;
const lesson = writingTaskOf("u1-o2")!;
const practiceForm = writingTaskOf("form-practice")!;

const coverage = (task = letter, missed = 1) =>
  task.points.map((_, i) => ({ point: `echo ${i}`, met: i >= missed, feedback: `Point ${i}.` }));

const gradeOf = (task: typeof lesson, wordCount: number, missed: number, result: string) =>
  parseReview(task, wordCount, output({ coverage: coverage(task, missed), result }))?.grade;

const output = (patch: object = {}) =>
  JSON.stringify({
    coverage: coverage(),
    corrections: [
      { original: "Soy veinte años", corrected: "Tengo veinte años", explanation: "Use tener." },
    ],
    revised: "Hola, Ana. Tengo veinte años.",
    mark: { band: 2, reason: "A1 level with one missed point." },
    ...patch,
  });

describe("writing review schema", () => {
  it("asks for a mark in the exam and a result in practice", () => {
    expect(schemaOf(letter).required).toEqual(["coverage", "corrections", "revised", "mark"]);
    expect(schemaOf(lesson).required).toEqual(["coverage", "corrections", "revised", "result"]);
    expect(schemaOf(practiceForm).required).toContain("result");
    expect(schemaOf(letter).properties).toHaveProperty("mark.properties.band.enum", [0, 1, 2, 3]);
    expect(schemaOf(letter).properties).not.toHaveProperty("result");

    expect(schemaOf(lesson).properties).toHaveProperty("result.enum", [
      "passed",
      "partly",
      "failed",
    ]);
  });
});

describe("parsing the model's review", () => {
  it("keeps the server's point text in the task's order", () => {
    expect(parseReview(letter, 35, output())).toEqual({
      wordCount: 35,
      coverage: [
        { point: letter.points[0], met: false, feedback: "Point 0." },
        { point: letter.points[1], met: true, feedback: "Point 1." },
        { point: letter.points[2], met: true, feedback: "Point 2." },
      ],
      corrections: [
        { original: "Soy veinte años", corrected: "Tengo veinte años", explanation: "Use tener." },
      ],
      revised: "Hola, Ana. Tengo veinte años.",
      mark: { band: 2, reason: "A1 level with one missed point." },
    });
  });

  it("drops a mark the lesson schema did not ask for", () => {
    const practice = output({ coverage: coverage(lesson), result: "passed" });

    expect(parseReview(lesson, 35, practice)?.mark).toBeUndefined();
    expect(parseReview(lesson, 35, practice)?.revised).toBe("Hola, Ana. Tengo veinte años.");
  });

  it.each([
    ["passed", "perfect"],
    ["partly", "good"],
    ["failed", "bad"],
  ])("grades a practice result of %s as %s", (result, grade) => {
    expect(parseReview(lesson, 35, output({ coverage: coverage(lesson), result }))?.grade).toBe(
      grade,
    );

    expect(gradeOf(practiceForm, 12, 0, result)).toBe(grade);
  });

  it("caps a practice letter that misses more than one point at partly", () => {
    expect(gradeOf(lesson, 35, 1, "passed")).toBe("perfect");
    expect(gradeOf(lesson, 35, 2, "passed")).toBe("good");
  });

  it("caps a practice form that misses any field at partly", () => {
    expect(gradeOf(practiceForm, 12, 0, "passed")).toBe("perfect");
    expect(gradeOf(practiceForm, 12, 1, "passed")).toBe("good");
  });

  it("caps a practice letter under the minimum word count at partly, but not a long one", () => {
    expect(gradeOf(lesson, 29, 0, "passed")).toBe("good");
    expect(gradeOf(lesson, 30, 0, "passed")).toBe("perfect");
    expect(gradeOf(lesson, 65, 0, "passed")).toBe("perfect");
    expect(gradeOf(practiceForm, 3, 0, "passed")).toBe("perfect");
  });

  it("never raises a practice result", () => {
    expect(gradeOf(lesson, 8, 3, "partly")).toBe("good");
    expect(gradeOf(lesson, 35, 0, "failed")).toBe("bad");
    expect(gradeOf(practiceForm, 20, 0, "partly")).toBe("good");
  });

  it.each([
    ["a missing result", undefined],
    ["an unknown result", "excellent"],
    ["a result in capitals", "Passed"],
    ["a grade instead of a result", "perfect"],
    ["a result inherited from Object", "toString"],
    ["a result as a boolean", true],
  ])("rejects a practice review with %s", (_, result) =>
    expect(parseReview(lesson, 35, output({ coverage: coverage(lesson), result }))).toBeNull(),
  );

  it("gives an exam review no grade, even with a result", () => {
    expect(parseReview(letter, 35, output({ result: "failed" }))?.grade).toBeUndefined();
  });

  it("accepts a revised version of 2000 characters", () => {
    expect(parseReview(letter, 35, output({ revised: "a".repeat(2000) }))?.revised).toHaveLength(
      2000,
    );
  });

  it("keeps at most eight corrections", () => {
    const corrections = Array.from({ length: 10 }, (_, i) => ({
      original: `o${i}`,
      corrected: `c${i}`,
      explanation: `e${i}`,
    }));

    expect(
      parseReview(letter, 35, output({ corrections }))?.corrections.map((c) => c.original),
    ).toEqual(["o0", "o1", "o2", "o3", "o4", "o5", "o6", "o7"]);
  });

  it("caps a task-2 letter of 20–29 words at band 1", () => {
    expect(parseReview(letter, 25, output({ mark: { band: 3, reason: "Great." } }))?.mark).toEqual({
      band: 1,
      reason: "Great.",
    });

    expect(
      parseReview(letter, 30, output({ mark: { band: 3, reason: "Great." } }))?.mark?.band,
    ).toBe(3);

    expect(parseReview(form, 12, output({ coverage: coverage(form) }))?.mark?.band).toBe(2);
  });

  it.each([
    ["text that is not JSON", "Sorry, I can't."],
    ["a missing field", output({ revised: undefined })],
    ["a missing mark in the exam", output({ mark: undefined })],
    ["a band above 3", output({ mark: { band: 4, reason: "x" } })],
    ["a negative band", output({ mark: { band: -1, reason: "x" } })],
    ["a half band", output({ mark: { band: 1.5, reason: "x" } })],
    ["a band as text", output({ mark: { band: "2", reason: "x" } })],
    ["a coverage entry too few", output({ coverage: coverage().slice(1) })],
    ["a coverage entry too many", output({ coverage: [...coverage(), coverage()[0]] })],
    ["met as text", output({ coverage: coverage().map((c) => ({ ...c, met: "yes" })) })],
    ["a correction without a reason", output({ corrections: [{ original: "a", corrected: "b" }] })],
    ["corrections that are not a list", output({ corrections: "none" })],
    ["a list instead of an object", "[]"],
    ["a revised version over 2000 characters", output({ revised: "a".repeat(2001) })],
  ])("rejects %s", (_, text) => expect(parseReview(letter, 35, text)).toBeNull());
});

describe("reviews without the model", () => {
  it("leaves every point unmet for a blank answer, with band 0 in the exam", () => {
    expect(presetReview(letter, 0)).toEqual({
      wordCount: 0,
      coverage: letter.points.map((point) => ({ point, met: false, feedback: "Blank answer." })),
      corrections: [],
      revised: "",
      mark: { band: 0, reason: "Blank answer." },
    });

    expect(presetReview(letter, 0)?.grade).toBeUndefined();
    expect(presetReview(lesson, 0)?.mark).toBeUndefined();
    expect(presetReview(lesson, 0)?.coverage).toHaveLength(3);
  });

  it("grades a blank practice answer bad", () => {
    expect(presetReview(lesson, 0)?.grade).toBe("bad");
    expect(presetReview(practiceForm, 0)?.grade).toBe("bad");
  });

  it("does not mark a task-2 letter under 20 words", () => {
    expect(presetReview(letter, 19)).toMatchObject({
      wordCount: 19,
      revised: "",
      mark: { band: 0, reason: "Under 20 words: not marked." },
    });

    expect(presetReview(letter, 20)).toBeNull();
    expect(presetReview(form, 10)).toBeNull();
    expect(presetReview(lesson, 10)).toBeNull();
  });
});
