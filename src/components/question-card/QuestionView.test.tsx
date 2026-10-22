import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { allQuestions } from "../../data/curriculum";
import { QuestionView } from "./QuestionView";

it("holds a live question as a talk with the examiner instead of a written answer", () => {
  const live = allQuestions.find((q) => q.kind === "live")!;

  render(<QuestionView q={live} onSubmit={vi.fn()} />);

  expect(screen.getByRole("heading", { name: live.prompt })).toBeVisible();
  expect(screen.getByText(/Your turn/)).toBeVisible();
  expect(screen.getByRole("button", { name: "Start the talk" })).toBeEnabled();
  expect(screen.queryByRole("button", { name: "Review my practice" })).not.toBeInTheDocument();
});

it("shows every other question as a question card", () => {
  const writing = allQuestions.find((q) => q.kind === "write")!;

  render(<QuestionView q={writing} onSubmit={vi.fn()} />);

  expect(screen.getByRole("button", { name: "Review my practice" })).toBeDisabled();
  expect(screen.queryByRole("button", { name: "Start the talk" })).not.toBeInTheDocument();
});
