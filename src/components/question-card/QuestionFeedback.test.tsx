import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import { stopAudio } from "../audio/playback";
import { allQuestions } from "../../data/curriculum";
import type { Question } from "../../data/types";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  // A passage player deliberately survives its own unmount; end it with the session.
  act(stopAudio);
});

const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
const choice = allQuestions[0];
const wrong = choice.options!.find((o) => o !== choice.answer)!;
const listen = allQuestions.find((q) => q.kind === "listen")!;
const writing = allQuestions.find((q) => q.id === "u1-o2")!;

const write = (text: string) =>
  fireEvent.change(screen.getByRole("textbox"), { target: { value: text } });

const words = (n: number) => Array(n).fill("hola").join(" ");

it("shows the learner's wrong answer next to the correct one", () => {
  render(<QuestionCard q={choice} onSubmit={vi.fn()} />);
  click(wrong);

  expect(screen.getByRole("status")).toHaveTextContent(
    `Your answer: ${wrong}Correct answer: ${choice.answer}`,
  );

  expect(screen.getByText("Added to your mistake review.")).toBeInTheDocument();
});

it("closes a correct objective answer with encouragement", () => {
  render(<QuestionCard q={choice} onSubmit={vi.fn()} />);
  click(choice.answer);
  expect(screen.getByRole("status")).not.toHaveTextContent("Your answer:");
  expect(screen.getByText("Keep taking those little steps.")).toBeInTheDocument();
});

it("offers the transcript after a listening answer and notes transcript assistance", () => {
  render(<QuestionCard q={listen} onSubmit={vi.fn()} />);
  click("Need a hand? Show transcript");
  click(listen.answer);

  expect(screen.getByText("Read the transcript").closest("details")).toHaveTextContent(
    listen.audio!,
  );

  expect(screen.getByText("Completed with transcript assistance.")).toBeInTheDocument();
});

it("flags a response above the word target", () => {
  render(<QuestionCard q={writing} onSubmit={vi.fn()} />);
  write(words(45));
  click("Review my practice");

  expect(
    screen.getByText("You wrote 45 words. Practise keeping the response within 30–40 words."),
  ).toBeInTheDocument();
});

it("says when the pattern checks found nothing", () => {
  render(<QuestionCard q={writing} onSubmit={vi.fn()} />);
  write(writing.answer);
  click("Review my practice");

  expect(screen.getByText(/No issue found by the small set of pattern checks/)).toBeInTheDocument();
});

it("reviews writing without word limits or a checklist", () => {
  const open: Question = {
    ...writing,
    minWords: undefined,
    maxWords: undefined,
    checklist: undefined,
  };

  render(<QuestionCard q={open} onSubmit={vi.fn()} />);
  write(words(80));
  expect(screen.queryByText(/ words$/)).not.toBeInTheDocument();
  click("Review my practice");

  expect(
    screen.getByText("Your word count (80) is within the practice target."),
  ).toBeInTheDocument();

  expect(screen.getByText(/^0\/0 self-review points checked/)).toBeInTheDocument();
});

it.each([
  [29, "Your response is short"],
  [30, "Your word count (30) is within the practice target."],
  [40, "Your word count (40) is within the practice target."],
  [41, "keeping"],
])("explains the writing target boundary at %s words", (n, message) => {
  render(<QuestionCard q={writing} onSubmit={vi.fn()} draft={Array(n).fill("hola").join(" ")} />);
  click("Review my practice");
  expect(screen.getByText((text) => text.includes(message))).toBeInTheDocument();
});

it("returns to the editable state when revising an answer", () => {
  render(<QuestionCard q={writing} onSubmit={vi.fn()} draft="Hola, Ana." />);
  click("Review my practice");
  expect(screen.getByRole("heading", { name: "Let’s reflect on your answer" })).toBeInTheDocument();
  click("Revise my answer");
  expect(screen.getByRole("textbox")).toBeEnabled();
  expect(screen.getByRole("button", { name: "Review my practice" })).toBeInTheDocument();
});

it.each([
  ["u2-v0", () => fireEvent.click(screen.getByRole("button", { name: "first name" }))],
  [
    "u1-o1",
    () => {
      fireEvent.change(screen.getByLabelText("Your answer in Spanish"), {
        target: { value: "Soy de Polonia." },
      });

      fireEvent.keyDown(screen.getByLabelText("Your answer in Spanish"), { key: "Enter" });
    },
  ],
])("focuses Continue after checking %s so Enter moves on", (id, answer) => {
  const q = allQuestions.find((question) => question.id === id)!;

  render(<QuestionCard q={q} onSubmit={vi.fn()} />);
  answer();
  expect(screen.getByRole("button", { name: "Continue" })).toHaveFocus();
});

it("keeps writing practice ungraded and supplies targeted corrections", () => {
  const submit = vi.fn();

  render(<QuestionCard q={allQuestions.find((q) => q.id === "u1-o2")!} onSubmit={submit} />);

  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "Hola, soy 20 años. Me gusta las manzanas." },
  });

  fireEvent.click(screen.getByRole("button", { name: "Review my practice" }));
  expect(screen.getByText(/For age, use tener/)).toBeInTheDocument();
  expect(screen.getByText(/Check gustar/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(submit.mock.calls[0][1]).toBeNull();
});
