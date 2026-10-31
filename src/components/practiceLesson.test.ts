import { describe, expect, it } from "vitest";
import { practiceLesson } from "./practiceLesson";
import { emptySnapshot } from "../test/progress";
import { allQuestions } from "../data/curriculum";

describe("practice lesson", () => {
  it("builds no lesson from an empty mistake queue", () => {
    expect(practiceLesson("mistakes", emptySnapshot(), [])).toBeNull();
  });

  it("keeps the live talks out of skill practice but brings one back as a mistake", () => {
    const live = allQuestions.find((q) => q.kind === "live")!;

    expect(practiceLesson("speaking", emptySnapshot(), [])).toBeNull();
    expect(practiceLesson("all", emptySnapshot(), [])!.questions).not.toContain(live);
    expect(practiceLesson("mistakes", emptySnapshot(), [live])!.questions).toEqual([live]);
  });
});
