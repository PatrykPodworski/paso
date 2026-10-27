// @vitest-environment node
import { describe, expect, it } from "vitest";
import { parseReview, presetReview, schemaOf } from "./writing-review.ts";
import { writingTaskOf } from "./writing-tasks.ts";

const letter = writingTaskOf("mock-w2")!;
const form = writingTaskOf("mock-w1")!;
const lesson = writingTaskOf("u1-o2")!;

const coverage = (task = letter) =>
  task.points.map((_, i) => ({ point: `echo ${i}`, met: i > 0, feedback: `Point ${i}.` }));

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
  it("asks for a mark only in the exam", () => {
    expect(schemaOf(letter).required).toEqual(["coverage", "corrections", "revised", "mark"]);
    expect(schemaOf(lesson).required).toEqual(["coverage", "corrections", "revised"]);
    expect(schemaOf(letter).properties.mark?.properties.band.enum).toEqual([0, 1, 2, 3]);
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
    expect(parseReview(lesson, 35, output({ coverage: coverage(lesson) }))?.mark).toBeUndefined();

    expect(parseReview(lesson, 35, output({ coverage: coverage(lesson) }))?.revised).toBe(
      "Hola, Ana. Tengo veinte años.",
    );
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

    expect(presetReview(lesson, 0)?.mark).toBeUndefined();
    expect(presetReview(lesson, 0)?.coverage).toHaveLength(3);
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
