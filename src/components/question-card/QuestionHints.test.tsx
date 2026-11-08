import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import { stopAudio } from "../audio/playback";
import { allQuestions } from "../../data/curriculum";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  act(stopAudio);
});

const typed = allQuestions.find((q) => q.kind === "type")!;

const hinted = {
  ...typed,
  answer: "¿Dónde vives?",
  accepted: undefined,
  hints: ["Ask about a place.", "Start with dónde."],
};

it("walks the ladder by keyboard and marks the attempt as assisted", async () => {
  const user = userEvent.setup();
  const evaluated = vi.fn();

  render(<QuestionCard q={hinted} onSubmit={vi.fn()} onEvaluated={evaluated} />);
  expect(screen.getByRole("textbox")).toHaveFocus();
  await user.tab({ shift: true });
  expect(screen.getByRole("button", { name: "Show a hint" })).toHaveFocus();
  expect(screen.queryByText("Ask about a place.")).not.toBeInTheDocument();

  await user.keyboard("{Enter}");
  expect(screen.getByText("Ask about a place.")).toBeVisible();
  expect(screen.queryByText("Start with dónde.")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Show another hint" })).toHaveFocus();

  await user.keyboard("{Enter}");
  expect(screen.getByText("Start with dónde.")).toBeVisible();
  expect(screen.queryByText("¿Dónde vives?")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Show the answer" })).toHaveFocus();

  await user.keyboard("{Enter}");
  const reveal = screen.getByText("¿Dónde vives?");

  expect(reveal).toHaveAttribute("lang", "es");
  expect(reveal.parentElement).toHaveFocus();
  expect(screen.queryByRole("button", { name: /Show/ })).not.toBeInTheDocument();

  await user.tab();
  expect(screen.getByRole("textbox")).toHaveFocus();
  await user.keyboard("¿Dónde vives?{Enter}");

  expect(evaluated).toHaveBeenCalledWith("¿Dónde vives?", true, true);
  expect(screen.getByText("Ask about a place.")).toBeVisible();
  expect(screen.getByText("Start with dónde.")).toBeVisible();
  expect(screen.queryByRole("button", { name: /Show/ })).not.toBeInTheDocument();
});

it("leaves the attempt unassisted when no hint is used", async () => {
  const user = userEvent.setup();
  const evaluated = vi.fn();

  render(<QuestionCard q={hinted} onSubmit={vi.fn()} onEvaluated={evaluated} />);
  await user.type(screen.getByRole("textbox"), "¿Dónde vives?{Enter}");

  expect(evaluated).toHaveBeenCalledWith("¿Dónde vives?", true, false);
});

it("offers hints only for a practice question that has them", () => {
  const { rerender } = render(<QuestionCard q={hinted} onSubmit={vi.fn()} />);

  expect(screen.getByRole("button", { name: "Show a hint" })).toBeVisible();

  rerender(<QuestionCard q={{ ...hinted, hints: undefined }} onSubmit={vi.fn()} />);
  expect(screen.queryByRole("button", { name: "Show a hint" })).not.toBeInTheDocument();

  rerender(<QuestionCard q={hinted} exam onSubmit={vi.fn()} />);
  expect(screen.queryByRole("button", { name: "Show a hint" })).not.toBeInTheDocument();
});
