import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import { stopAudio } from "../audio/playback";
import { allQuestions } from "../../data/curriculum";
import { mockQuestions } from "../../data/mock";

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

const speaking = mockQuestions.find((q) => q.kind === "speak")!;

const practiseAloud = () => {
  render(<QuestionCard q={speaking} onSubmit={vi.fn()} />);
  fireEvent.click(screen.getByRole("checkbox", { name: /I practised aloud/ }));
  click("Review my practice");
};

it("returns a speaking task to the editable state when revising it", () => {
  practiseAloud();
  click("Revise my answer");
  expect(screen.getByRole("checkbox", { name: /I practised aloud/ })).toBeInTheDocument();
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

it("keeps speaking practice ungraded", () => {
  const submit = vi.fn();

  render(<QuestionCard q={speaking} onSubmit={submit} />);
  fireEvent.click(screen.getByRole("checkbox", { name: /I practised aloud/ }));
  click("Review my practice");
  click("Continue");
  expect(submit.mock.calls[0][1]).toBeNull();
});

it("gives speaking the reflection and leaves writing to the AI review", () => {
  render(<QuestionCard q={writing} onSubmit={vi.fn()} draft="Hola, soy 20 años." />);
  expect(screen.getByText(/Your answer goes to OpenRouter/)).toBeInTheDocument();
  cleanup();

  practiseAloud();
  expect(screen.getByRole("heading", { name: "Let’s reflect on your answer" })).toBeInTheDocument();
  expect(screen.getByText(speaking.explanation)).toBeInTheDocument();
  expect(screen.getByText("One possible answer").parentElement).toHaveTextContent(speaking.answer);

  expect(
    screen.getByText(`0/${speaking.checklist!.length} self-review points checked.`, {
      exact: false,
    }),
  ).toBeInTheDocument();
});
