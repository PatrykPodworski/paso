import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import { stopAudio } from "../audio/playback";
import { allQuestions, visualQuestions } from "../../data/curriculum";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  // A shared listening recording deliberately survives its own unmount; end it with the session.
  act(stopAudio);
});

const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
const listen = allQuestions.find((q) => q.kind === "listen")!;

it.each([
  ["cafe", "Illustrated café counter with coffee and bread"],
  ["town", "A neighborhood with a park, pharmacy and train station"],
  ["train", "A train waiting at a station"],
])("shows the %s scene illustration", (scene, alt) => {
  render(<QuestionCard q={visualQuestions.find((q) => q.image === scene)!} onSubmit={vi.fn()} />);

  expect(screen.getByRole("img", { name: alt })).toHaveAttribute(
    "src",
    `/illustrations/${scene}.svg`,
  );
});

it("shows the emoji for a word without a picture", () => {
  const q = allQuestions.find((question) => question.visual && !question.picture)!;

  render(<QuestionCard q={q} onSubmit={vi.fn()} />);

  expect(screen.getByRole("img", { name: "Vocabulary illustration" })).toHaveTextContent(q.visual!);
});

it("shows the word picture instead of the emoji", () => {
  const q = allQuestions.find((question) => question.id === "u5-v0")!;

  render(<QuestionCard q={q} onSubmit={vi.fn()} />);

  const figure = screen.getByRole("img", { name: "Vocabulary illustration" });

  expect(figure).not.toHaveTextContent(q.visual!);
  expect(figure.querySelector("img")).toHaveAttribute("src", "/illustrations/words/la-manana.webp");
});

it("shows the transcript and its assistance note only on request", () => {
  render(<QuestionCard q={listen} onSubmit={vi.fn()} />);
  expect(screen.queryByText(/Transcript assistance is recorded/)).not.toBeInTheDocument();
  click("Need a hand? Show transcript");

  expect(screen.getByText(/Transcript assistance is recorded/).parentElement).toHaveTextContent(
    listen.audio!,
  );

  click("Hide transcript");
  expect(screen.queryByText(/Transcript assistance is recorded/)).not.toBeInTheDocument();
});

it("shows a reading passage without a player", () => {
  const q = allQuestions.find((question) => question.passage)!;

  render(<QuestionCard q={q} onSubmit={vi.fn()} />);

  expect(screen.getByText(q.passage!, { normalizer: (t) => t })).toBeVisible();
  expect(screen.queryByRole("button", { name: /Play/ })).not.toBeInTheDocument();
});

it("remembers transcript assistance even after hiding the transcript", () => {
  const evaluated = vi.fn();
  const q = allQuestions.find((q) => q.kind === "listen")!;

  render(<QuestionCard q={q} onSubmit={vi.fn()} onEvaluated={evaluated} />);
  fireEvent.click(screen.getByRole("button", { name: "Need a hand? Show transcript" }));
  fireEvent.click(screen.getByRole("button", { name: "Hide transcript" }));
  fireEvent.click(screen.getByRole("button", { name: q.answer }));
  expect(evaluated).toHaveBeenCalledWith(q.answer, true, true);
});
