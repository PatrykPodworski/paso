import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { foundations, visualQuestions } from "../../data/curriculum";
import { formPractice } from "../../data/mock";
import { emptySnapshot } from "../../test/progress";
import type { Lesson } from "../../data/types";
import { SkillPractice } from "./SkillPractice";

it("launches each focused practice bank", () => {
  let lesson: Lesson | undefined;

  render(
    <SkillPractice
      progress={emptySnapshot()}
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

it.each([
  ["Picture this", "6 visual puzzles · cafés, trains & your neighborhood", 6],
  ["The foundation lab", "24 checks · sounds, spelling, numbers & patterns", 24],
])("%s counts the questions it launches", (title, note, count) => {
  let lesson: Lesson | undefined;

  render(
    <SkillPractice
      progress={emptySnapshot()}
      filter="all"
      setSession={(l) => (lesson = l)}
      practice={vi.fn()}
    />,
  );

  const bank = screen.getByRole("button", { name: new RegExp(title) });

  expect(bank).toHaveTextContent(note);
  fireEvent.click(bank);
  expect(lesson?.questions).toHaveLength(count);
});
