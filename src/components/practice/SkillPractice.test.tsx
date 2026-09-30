import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { foundations, visualQuestions } from "../../data/curriculum";
import { formPractice } from "../../data/mock";
import { emptyProgress } from "../../data/progress";
import type { Lesson } from "../../data/types";
import { SkillPractice } from "./SkillPractice";

it("launches each focused practice bank", () => {
  let lesson: Lesson | undefined;

  render(
    <SkillPractice
      progress={emptyProgress()}
      filter="all"
      setSession={(l) => (lesson = l)}
      practice={vi.fn()}
    />,
  );

  for (const [title, questions] of [
    ["Picture this", visualQuestions],
    ["The foundation lab", foundations],
    ["Fill in your story", [formPractice]],
  ] as const) {
    fireEvent.click(screen.getByRole("button", { name: new RegExp(title) }));
    expect(lesson?.questions).toEqual(questions);
  }
});
