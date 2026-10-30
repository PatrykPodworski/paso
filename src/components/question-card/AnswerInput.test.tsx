import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { AnswerInput } from "./AnswerInput";
import type { Answer } from "./useAnswer";
import type { Question } from "../../data/types";
import { allQuestions } from "../../data/curriculum";
import { mockQuestions } from "../../data/mock";

const answer = {
  answer: "",
  correct: null,
  selected: [],
  words: 0,
  fieldValues: {},
  setSelected: vi.fn(),
  setText: vi.fn(),
  setField: vi.fn(),
} as unknown as Answer;

const show = (q: Question) =>
  render(
    <AnswerInput
      q={q}
      feedback={false}
      answer={answer}
      onChoose={vi.fn()}
      onPick={vi.fn()}
      onCheck={vi.fn()}
    />,
  );

it("shows the word bank only for an order question", () => {
  show(allQuestions.find((q) => q.kind === "order")!);
  expect(screen.getByRole("group", { name: "Word bank" })).toBeInTheDocument();
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
});

it("shows a text box for a typed answer", () => {
  show(allQuestions.find((q) => q.kind === "type")!);
  expect(screen.getByRole("textbox")).toBeInTheDocument();
  expect(screen.queryByRole("group", { name: "Word bank" })).not.toBeInTheDocument();
});

it("shows nothing for a speaking question", () => {
  const { container } = show(mockQuestions.find((q) => q.kind === "speak")!);

  expect(container).toBeEmptyDOMElement();
});
