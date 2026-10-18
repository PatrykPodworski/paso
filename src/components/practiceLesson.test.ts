import { describe, expect, it } from "vitest";
import { practiceLesson } from "./practiceLesson";
import { emptyProgress } from "../data/progress";
import { allQuestions } from "../data/curriculum";

describe("practice lesson", () => {
  it("builds no lesson from an empty mistake queue", () => {
    expect(practiceLesson("mistakes", emptyProgress(), [])).toBeNull();
  });

  it("keeps the live talks out of skill practice but brings one back as a mistake", () => {
    const live = allQuestions.find((q) => q.kind === "live")!;

    expect(practiceLesson("speaking", emptyProgress(), [])!.questions.map((q) => q.id)).toEqual([
      "u3-o3",
      "u4-o3",
      "u5-o3",
      "u6-o3",
    ]);

    expect(practiceLesson("mistakes", emptyProgress(), [live])!.questions).toEqual([live]);
  });
});
