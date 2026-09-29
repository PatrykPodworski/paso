import { describe, expect, it } from "vitest";
import { practiceLesson } from "../components/practiceLesson";
import { emptyProgress } from "../data/progress";

describe("practice lesson", () => {
  it("builds no lesson from an empty mistake queue", () => {
    expect(practiceLesson("mistakes", emptyProgress(), [])).toBeNull();
  });
});
