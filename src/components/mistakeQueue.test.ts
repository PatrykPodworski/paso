import { expect, it } from "vitest";
import type { ReviewState } from "../data/types";
import { emptySnapshot, questionState } from "../test/progress";
import { mistakeQueue } from "./mistakeQueue";

const now = new Date("2026-10-16T12:00:00Z");
const earlier = "2026-10-16T08:00:00Z";
const earliest = "2026-10-15T08:00:00Z";
const later = "2026-10-17T08:00:00Z";

// Open mistakes are answered one minute apart, in the order given.
const queue = (mistakes: string[], reviews: Record<string, ReviewState> = {}) => {
  const answer = (id: string, minute: number) =>
    questionState({
      at: new Date(Date.parse("2026-10-14T08:00:00Z") + minute * 60_000).toISOString(),
      correct: false,
      inMistakes: mistakes.includes(id),
      ...(reviews[id] && { review: reviews[id] }),
    });

  const ids = [...new Set([...mistakes, ...Object.keys(reviews)])];

  const questions = Object.fromEntries(
    ids.map((id) => [id, answer(id, mistakes.includes(id) ? mistakes.indexOf(id) : 0)]),
  );

  return mistakeQueue({ ...emptySnapshot(), questions }, now).map((q) => q.id);
};

it("keeps open mistakes in the order they were made", () => {
  expect(queue(["u1-v2", "u1-v0", "u1-v1"])).toEqual(["u1-v2", "u1-v0", "u1-v1"]);
});

it("puts due reviews first, earliest due first, before open mistakes", () => {
  expect(
    queue(["u1-v0", "u1-v1"], {
      "u1-v2": { level: 1, nextAt: earlier },
      "u1-v3": { level: 1, nextAt: earliest },
    }),
  ).toEqual(["u1-v3", "u1-v2", "u1-v0", "u1-v1"]);
});

it("leaves out reviews that are not due yet", () => {
  expect(queue(["u1-v0"], { "u1-v1": { level: 2, nextAt: later } })).toEqual(["u1-v0"]);
});

it("keeps an open mistake whose review is not due, after the due ones", () => {
  expect(queue(["u1-v0", "u1-v1"], { "u1-v0": { level: 2, nextAt: later } })).toEqual([
    "u1-v1",
    "u1-v0",
  ]);
});

it("lists a question once when it is both an open mistake and a due review", () => {
  expect(queue(["u1-v0", "u1-v1"], { "u1-v1": { level: 1, nextAt: earlier } })).toEqual([
    "u1-v1",
    "u1-v0",
  ]);
});

it("puts open mistakes before reviews that fall due at the same moment", () => {
  expect(queue(["u1-v0"], { "u1-v1": { level: 1, nextAt: now.toISOString() } })).toEqual([
    "u1-v0",
    "u1-v1",
  ]);
});

it("drops ids that no longer match a question", () => {
  expect(
    queue(["deleted-question", "u1-v0"], { "deleted-review": { level: 1, nextAt: earlier } }),
  ).toEqual(["u1-v0"]);
});
