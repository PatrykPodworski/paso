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

const write = (text: string) =>
  fireEvent.change(screen.getByRole("textbox"), { target: { value: text } });

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

it("returns to the editable state when revising an answer", () => {
  render(<QuestionCard q={writing} onSubmit={vi.fn()} draft="Hola, Ana." />);
  click("Review my practice");
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

it("keeps writing practice ungraded", () => {
  const submit = vi.fn();

  render(<QuestionCard q={writing} onSubmit={submit} />);
  write("Hola, soy 20 años. Me gusta las manzanas.");
  click("Review my practice");
  click("Continue");
  expect(submit.mock.calls[0][1]).toBeNull();
});

it("leaves the reflection out of writing feedback and keeps it for speaking", () => {
  const speaking = mockQuestions.find((q) => q.kind === "speak")!;

  render(<QuestionCard q={writing} onSubmit={vi.fn()} draft="Hola, soy 20 años." />);
  click("Review my practice");
  expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
  expect(screen.queryByText(writing.explanation)).not.toBeInTheDocument();
  expect(screen.queryByText("One possible answer")).not.toBeInTheDocument();
  expect(screen.queryByText(/For age, use tener/)).not.toBeInTheDocument();
  expect(screen.queryByText(/self-review points checked/)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Check my writing" })).toBeInTheDocument();
  cleanup();

  render(<QuestionCard q={speaking} onSubmit={vi.fn()} />);
  fireEvent.click(screen.getByRole("checkbox", { name: /I practised aloud/ }));
  click("Review my practice");
  expect(screen.getByRole("heading", { name: "Let’s reflect on your answer" })).toBeInTheDocument();
  expect(screen.getByText(speaking.explanation)).toBeInTheDocument();
  expect(screen.getByText("One possible answer").parentElement).toHaveTextContent(speaking.answer);

  expect(
    screen.getByText(`0/${speaking.checklist!.length} self-review points checked.`, {
      exact: false,
    }),
  ).toBeInTheDocument();
});
