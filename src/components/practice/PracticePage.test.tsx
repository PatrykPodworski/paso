import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { expect, it, vi } from "vitest";
import { allQuestions } from "../../data/curriculum";
import { emptySnapshot, questionState } from "../../test/progress";
import type { Lesson, ProgressSnapshot, Skill } from "../../data/types";
import { mistakeQueue } from "../mistakeQueue";
import { PracticePage } from "./PracticePage";

type Props = { progress: ProgressSnapshot; setSession: (lesson: Lesson) => void };

const Practice = ({ progress, setSession }: Props) => {
  const [filter, setFilter] = useState<Skill | "all" | "mistakes">("all");

  return (
    <PracticePage
      progress={progress}
      onVocabulary={vi.fn()}
      mistakeQuestions={mistakeQueue(progress, new Date())}
      filter={filter}
      setFilter={setFilter}
      setSession={setSession}
      navigate={vi.fn()}
      practice={vi.fn()}
    />
  );
};

it("resolves mistake IDs safely, explains each one and opens an individual retry", () => {
  let lesson: Lesson | undefined;
  const p = emptySnapshot();

  p.questions = {
    "not-in-course": questionState({ correct: false, inMistakes: true }),
    [allQuestions[0].id]: questionState({ correct: false, inMistakes: true }),
  };

  render(<Practice progress={p} setSession={(l) => (lesson = l)} />);
  fireEvent.click(screen.getByRole("button", { name: "My mistakes (1)" }));
  expect(screen.getByText(/1 question is ready/)).toBeInTheDocument();
  fireEvent.click(screen.getByText(allQuestions[0].prompt));
  expect(screen.getByText(allQuestions[0].explanation)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(lesson?.questions).toEqual([allQuestions[0]]);
});

it("counts several mistakes in the plural", () => {
  const p = emptySnapshot();

  p.questions = {
    [allQuestions[0].id]: questionState({ correct: false, inMistakes: true }),
    [allQuestions[1].id]: questionState({ correct: false, inMistakes: true }),
  };

  render(<Practice progress={p} setSession={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "My mistakes (2)" }));
  expect(screen.getByText(/2 questions are ready/)).toBeInTheDocument();
});
