// @vitest-environment node
import { describe, expect, it } from "vitest";
import { parseReview, presetReview, schemaOf } from "./writing-review.ts";
import { writingTaskOf, type WritingTask } from "./writing-tasks.ts";

const letter = writingTaskOf("mock-w2")!;
const form = writingTaskOf("mock-w1")!;
const lesson = writingTaskOf("u1-o2")!;
const practiceForm = writingTaskOf("form-practice")!;

const question: WritingTask = {
  id: "fixture-ask-drink",
  kind: "question",
  exam: false,
  prompt: "You are the server. Ask which drink they want. Use bebida and quieres.",
  points: ["Ask about the desired drink", "Include bebida and quieres", "Address one person"],
  wordRange: [2, 15],
};

const noFix = { original: "", corrected: "", explanation: "" };

const fixOf = (i: number) => ({
  original: `trabajo de seis ${i}`,
  corrected: `trabajo de las seis ${i}`,
  explanation: `Fix point ${i}.`,
});

const coverage = (task = letter, missed = 1) =>
  task.points.map((_, i) => ({
    point: `echo ${i}`,
    met: i >= missed,
    feedback: `Point ${i}.`,
    fix: i >= missed ? noFix : fixOf(i),
  }));

const gradeOf = (task: typeof lesson, wordCount: number, missed: number, result: string) =>
  parseReview(task, wordCount, output({ coverage: coverage(task, missed), result }))?.grade;

const output = (patch: object = {}) =>
  JSON.stringify({
    coverage: coverage(),
    corrections: [
      { original: "Soy veinte años", corrected: "Tengo veinte años", explanation: "Use tener." },
    ],
    revised: "Hola, Bruno. Tengo veinte años.",
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

  it("asks for a fix with every coverage entry", () => {
    expect(schemaOf(letter)).toHaveProperty("properties.coverage.items.required", [
      "point",
      "met",
      "feedback",
      "fix",
    ]);

    expect(schemaOf(letter)).toHaveProperty("properties.coverage.items.properties.fix.required", [
      "original",
      "corrected",
      "explanation",
    ]);
  });
});

describe("parsing the model's review", () => {
  it("keeps the server's point text in the task's order", () => {
    expect(parseReview(letter, 35, output())).toEqual({
      wordCount: 35,
      coverage: letter.points.map((point, i) => ({ point, met: i > 0, feedback: `Point ${i}.` })),
      corrections: [
        fixOf(0),
        { original: "Soy veinte años", corrected: "Tengo veinte años", explanation: "Use tener." },
      ],
      revised: "Hola, Bruno. Tengo veinte años.",
      mark: { band: 2, reason: "A1 level with one missed point." },
    });
  });

  it("tags the corrections that change only accents or ¿ ?", () => {
    const corrections = [
      { original: "Que bebida", corrected: "Qué bebida", explanation: "Qué takes an accent." },
      { original: "quieres", corrected: "quieres?", explanation: "Close the question." },
      { original: "Donde esta", corrected: "¿Dónde está", explanation: "Open it and add accents." },
      { original: "Hola.", corrected: "¡Hola!", explanation: "Use exclamation marks." },
      { original: "Soy veinte años", corrected: "Tengo veinte años", explanation: "Use tener." },
      { original: "nino", corrected: "niño", explanation: "Write ñ." },
      { original: "polonia", corrected: "Polonia", explanation: "Capitalise the country." },
    ];

    expect(
      parseReview(
        question,
        4,
        output({ coverage: coverage(question, 0), corrections, result: "passed" }),
      )?.corrections,
    ).toEqual([
      { ...corrections[0], accentOnly: true },
      { ...corrections[1], accentOnly: true },
      { ...corrections[2], accentOnly: true },
      corrections[3],
      corrections[4],
      corrections[5],
      corrections[6],
    ]);
  });

  it("collapses a repeated or shorter quote of a missed point and keeps a different mistake", () => {
    const fix = fixOf(0);

    const review = parseReview(
      letter,
      35,
      output({
        corrections: [
          fix,
          {
            original: "de seis 0",
            corrected: "de las seis 0",
            explanation: "Too short.",
          },
          { original: "el casa", corrected: "la casa", explanation: fix.explanation },
        ],
      }),
    );

    expect(review?.mark).toEqual({ band: 2, reason: "A1 level with one missed point." });

    expect(review?.corrections).toEqual([
      fix,
      { original: "el casa", corrected: "la casa", explanation: fix.explanation },
    ]);
  });

  it("lists a correction for each missed point and none for a passed one", () => {
    const correctionsOf = (missed: number) =>
      parseReview(
        lesson,
        35,
        output({ coverage: coverage(lesson, missed), corrections: [], result: "partly" }),
      )?.corrections;

    expect(correctionsOf(2)).toEqual([fixOf(0), fixOf(1)]);
    expect(correctionsOf(0)).toEqual([]);
  });

  it("keeps the corrections of missed points when the text has eight of its own", () => {
    const corrections = Array.from({ length: 8 }, (_, i) => ({
      original: `o${i}`,
      corrected: `c${i}`,
      explanation: `e${i}`,
    }));

    expect(parseReview(letter, 35, output({ corrections }))?.corrections).toHaveLength(9);
    expect(parseReview(letter, 35, output({ corrections }))?.corrections[0]).toEqual(fixOf(0));
  });

  it("accepts a missed point whose fix quotes nothing, because the answer lacks it", () => {
    const missing = {
      original: "",
      corrected: "Trabajo de lunes a viernes.",
      explanation: "Say when you work.",
    };

    const review = parseReview(
      letter,
      35,
      output({ coverage: coverage().map((c, i) => (i ? c : { ...c, fix: missing })) }),
    );

    expect(review?.corrections[0]).toEqual(missing);
  });

  it("drops a mark the lesson schema did not ask for", () => {
    const practice = output({ coverage: coverage(lesson), result: "passed" });

    expect(parseReview(lesson, 35, practice)?.mark).toBeUndefined();
    expect(parseReview(lesson, 35, practice)?.revised).toBe("Hola, Bruno. Tengo veinte años.");
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

  it("caps a single question that misses any point at partly", () => {
    expect(gradeOf(question, 3, 0, "passed")).toBe("perfect");
    expect(gradeOf(question, 3, 1, "passed")).toBe("good");
  });

  it("holds a single question to no letter word count", () => {
    expect(gradeOf(question, 2, 0, "passed")).toBe("perfect");
    expect(gradeOf(question, 20, 0, "passed")).toBe("perfect");
    expect(presetReview(question, 2)).toBeNull();
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
      parseReview(
        letter,
        35,
        output({ coverage: coverage(letter, 0), corrections }),
      )?.corrections.map((c) => c.original),
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
    [
      "a coverage entry without a fix",
      output({ coverage: coverage().map(({ fix: _, ...c }) => c) }),
    ],
    [
      "a missed point with no corrected phrase",
      output({
        coverage: coverage().map((c, i) =>
          i ? c : { ...c, fix: { ...fixOf(0), corrected: " " } },
        ),
      }),
    ],
    [
      "a missed point with no explanation",
      output({
        coverage: coverage().map((c, i) =>
          i ? c : { ...c, fix: { ...fixOf(0), explanation: "" } },
        ),
      }),
    ],
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
