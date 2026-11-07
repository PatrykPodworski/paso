import { expect, it } from "vitest";
import { examSections, firstVariants, freshMockRun } from "../../data/mock";
import type { LiveScore, MockRun } from "../../data/types";
import { rehearsalResult } from "./rehearsalResult";

const sections = examSections(firstVariants);
const at = "2026-09-09T10:00:00.000Z";
const full = { reading: 25, listening: 0 };

const talk = (level: LiveScore["items"][number]["level"]): LiveScore => ({
  grade: level === "correct" ? "perfect" : level === "missing" ? "bad" : "good",
  items: [{ id: "p", label: "Point", level }],
});

const result = (patch: Partial<MockRun>, objective = full) =>
  rehearsalResult({ ...freshMockRun(), ...patch }, objective, at);

const [first, second] = sections[2].questions;
const talks = sections[3].questions;

it("records a full exam whose productive sections have no AI score", () => {
  expect(result({})).toEqual({
    at,
    sections: [0, 1, 2, 3],
    reading: 25,
    listening: 0,
    recorded: true,
  });
});

it("keeps a genuine zero for writing and speaking", () => {
  expect(
    result({
      marks: { [first.id]: 0, [second.id]: 0 },
      talks: Object.fromEntries(talks.map((q) => [q.id, talk("missing")])),
    }),
  ).toEqual({
    at,
    sections: [0, 1, 2, 3],
    reading: 25,
    listening: 0,
    writing: 0,
    speaking: 0,
    recorded: true,
  });
});

it("records only the productive section that has a score", () => {
  expect(result({ talks: { [talks[0].id]: talk("correct") } })).toEqual({
    at,
    sections: [0, 1, 2, 3],
    reading: 25,
    listening: 0,
    speaking: 8.33,
    recorded: true,
  });
});

it("leaves writing out until both tasks have a band", () => {
  expect(result({ marks: { [first.id]: 3 } }).writing).toBeUndefined();
});

it("stores a section practised alone and does not turn the other scores into zeros", () => {
  expect(
    result(
      {
        sections: [3],
        talks: Object.fromEntries(talks.map((q) => [q.id, talk("missing")])),
      },
      { reading: 0, listening: 0 },
    ),
  ).toEqual({ at, sections: [3], speaking: 0, recorded: true });

  expect(result({ sections: [1] }, { reading: 0, listening: 0 })).toEqual({
    at,
    sections: [1],
    listening: 0,
    recorded: true,
  });
});
