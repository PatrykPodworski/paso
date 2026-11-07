import { expect, it } from "vitest";
import type { ProgressSnapshot } from "../../data/types";
import { historyMarks, historyMarkText } from "./rehearsalHistory";

type Result = ProgressSnapshot["mockResults"][number];

const text = (result: Result) => historyMarks(result).map(historyMarkText);

it("shows a stored score, including zero, for every section a full exam took", () => {
  expect(
    text({
      id: "zeros",
      at: "2026-01-04T10:00:00.000Z",
      sections: [0, 1, 2, 3],
      reading: 0,
      listening: 0,
      writing: 0,
      speaking: 0,
      recorded: true,
    }),
  ).toEqual(["Reading 0/25", "Listening 0/25", "Writing 0/25", "Speaking 0/25"]);
});

it("shows a partial score and leaves the unscored productive section ungraded", () => {
  expect(
    text({
      id: "partial",
      at: "2026-01-03T10:00:00.000Z",
      sections: [0, 1, 2, 3],
      reading: 25,
      listening: 24,
      speaking: 12.5,
      recorded: true,
    }),
  ).toEqual(["Reading 25/25", "Listening 24/25", "Writing ungraded", "Speaking 12.5/25"]);
});

it("names only the sections a rehearsal took", () => {
  expect(
    text({
      id: "alone",
      at: "2026-01-02T10:00:00.000Z",
      sections: [2],
      recorded: true,
    }),
  ).toEqual(["Writing ungraded"]);

  expect(
    text({
      id: "reading",
      at: "2026-01-02T10:00:00.000Z",
      sections: [0, 2],
      reading: 4,
      recorded: true,
    }),
  ).toEqual(["Reading 4/25", "Writing ungraded"]);
});

it("does not turn a legacy missing score into zero or ungraded, and keeps a score that was stored", () => {
  expect(
    text({
      id: "legacy",
      at: "2026-01-01T10:00:00.000Z",
      sections: [0, 1, 2, 3],
      reading: 10,
      listening: 0,
    }),
  ).toEqual(["Reading 10/25", "Listening 0/25", "Writing not recorded", "Speaking not recorded"]);

  expect(
    text({
      id: "legacy-writing",
      at: "2026-01-01T10:00:00.000Z",
      sections: [0, 1, 2, 3],
      reading: 10,
      listening: 12,
      writing: 15,
    }),
  ).toEqual(["Reading 10/25", "Listening 12/25", "Writing 15/25", "Speaking not recorded"]);

  expect(text({ id: "legacy-speaking", at: "2026-01-01T10:00:00.000Z", sections: [3] })).toEqual([
    "Speaking not recorded",
  ]);
});
