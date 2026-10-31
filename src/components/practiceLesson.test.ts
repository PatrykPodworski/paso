import { describe, expect, it } from "vitest";
import { practiceLesson } from "./practiceLesson";
import { exerciseBank } from "./practice";
import { emptySnapshot, questionState } from "../test/progress";

const talks = exerciseBank.filter((q) => q.kind === "live");

const talked = (at: string) => questionState({ skill: "speaking", at });

describe("practice lesson", () => {
  it("builds no lesson from an empty mistake queue", () => {
    expect(practiceLesson("mistakes", emptySnapshot(), [])).toBeNull();
  });

  it("opens one live talk for speaking practice, the least recently practised first", () => {
    const p = emptySnapshot();

    p.questions = { [talks[0].id]: talked("2026-09-08T12:00:00Z") };
    expect(practiceLesson("speaking", p, [])!.questions).toEqual([talks[1]]);

    p.questions = Object.fromEntries(
      talks.map((t, i) => [
        t.id,
        talked(i === 2 ? "2026-09-01T12:00:00Z" : "2026-09-08T12:00:00Z"),
      ]),
    );

    expect(practiceLesson("speaking", p, [])!.questions).toEqual([talks[2]]);
  });

  it("keeps the live talks out of the daily mix but brings one back as a mistake", () => {
    expect(practiceLesson("all", emptySnapshot(), [])!.questions).not.toContain(talks[0]);
    expect(practiceLesson("mistakes", emptySnapshot(), [talks[0]])!.questions).toEqual([talks[0]]);
  });
});
