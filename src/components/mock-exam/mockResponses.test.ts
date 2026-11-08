import { expect, it } from "vitest";
import { firstVariants, freshMockRun } from "../../data/mock";
import type { LiveScore, MockRun } from "../../data/types";
import { mockResponses } from "./mockResponses";

const started = "2026-09-09T08:00:00.000Z";

const score: LiveScore = {
  grade: "good",
  items: [{ id: "name", label: "Name", level: "understandable" }],
  corrections: [],
};

const responses = (patch: Partial<MockRun>) =>
  mockResponses({ ...freshMockRun(), started, ...patch });

const sectionOf = (section: number, run: Partial<MockRun>) =>
  responses(run).items.filter((r) => r.section === section);

it("records every section of a full run in exam order", () => {
  const result = responses({
    variants: { ...firstVariants, l1: "l1-v2" },
    answers: {
      "mock-r1-0": "B",
      "mock-l1-v2-0": "Ana",
      "mock-w1": "Nombre: Bruno",
      "mock-s1": "Lucía: ¿Cómo te llamas?\nYou: Me llamo Bruno.",
    },
    marks: { "mock-w1": 2 },
    talks: { "mock-s1": score },
  });

  expect(result.started).toBe(started);
  expect(result.items).toHaveLength(55);

  expect(result.items.map((r) => r.section)).toEqual([
    ...Array(25).fill(0),
    ...Array(25).fill(1),
    2,
    2,
    3,
    3,
    3,
  ]);

  expect(result.items[0]).toEqual({
    section: 0,
    questionId: "mock-r1-0",
    variantId: "r1-v1",
    answer: "B",
    correct: false,
  });

  expect(result.items[25]).toMatchObject({
    section: 1,
    questionId: "mock-l1-v2-0",
    variantId: "l1-v2",
    answer: "Ana",
  });

  expect(result.items.slice(50)).toEqual([
    {
      section: 2,
      questionId: "mock-w1",
      variantId: "w1-v1",
      status: "submitted",
      text: "Nombre: Bruno",
      band: 2,
    },
    { section: 2, questionId: "mock-w2", variantId: "w2-v1", status: "empty", text: "" },
    {
      section: 3,
      questionId: "mock-s1",
      variantId: "s1-v1",
      status: "scored",
      transcript: "Lucía: ¿Cómo te llamas?\nYou: Me llamo Bruno.",
      score,
    },
    { section: 3, questionId: "mock-s2", variantId: "s2-v1", status: "none" },
    { section: 3, questionId: "mock-s3", variantId: "s2-v1", status: "none" },
  ]);
});

it("marks a right reading answer correct and an unanswered one as an empty wrong answer", () => {
  const [answered, unanswered] = sectionOf(0, {
    answers: { "mock-r1-0": "De Italia." },
  });

  expect([answered, unanswered]).toEqual([
    {
      section: 0,
      questionId: "mock-r1-0",
      variantId: "r1-v1",
      answer: "De Italia.",
      correct: true,
    },
    { section: 0, questionId: "mock-r1-1", variantId: "r1-v1", answer: "", correct: false },
  ]);
});

it("records a writing section practised alone, with a blank text as empty", () => {
  expect(
    responses({ sections: [2], answers: { "mock-w1": "Hola", "mock-w2": "  \n" } }).items,
  ).toEqual([
    { section: 2, questionId: "mock-w1", variantId: "w1-v1", status: "submitted", text: "Hola" },
    { section: 2, questionId: "mock-w2", variantId: "w2-v1", status: "empty", text: "  \n" },
  ]);
});

it("records a speaking section practised alone, with a skipped talk and no transcript of it", () => {
  expect(
    responses({
      sections: [3],
      answers: { "mock-s1": "You: Hola", "mock-s2": "You: unscored" },
      talks: { "mock-s1": score },
    }).items,
  ).toEqual([
    {
      section: 3,
      questionId: "mock-s1",
      variantId: "s1-v1",
      status: "scored",
      transcript: "You: Hola",
      score,
    },
    { section: 3, questionId: "mock-s2", variantId: "s2-v1", status: "none" },
    { section: 3, questionId: "mock-s3", variantId: "s2-v1", status: "none" },
  ]);
});

it("adds a band that arrives after the result was first built", () => {
  const run = { sections: [2], answers: { "mock-w1": "Hola", "mock-w2": "Adiós" } };

  expect(sectionOf(2, run).map((r) => r.section === 2 && r.band)).toEqual([undefined, undefined]);

  expect(
    sectionOf(2, { ...run, marks: { "mock-w1": 3, "mock-w2": 0 } }).map(
      (r) => r.section === 2 && r.band,
    ),
  ).toEqual([3, 0]);
});
