import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import { stopAudio } from "../audio/playback";
import { audioSources } from "../../data/audio-sources";
import { allQuestions, visualQuestions } from "../../data/curriculum";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  // A passage player deliberately survives its own unmount; end it with the session.
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

it("shows the vocabulary illustration", () => {
  const q = allQuestions.find((question) => question.visual)!;

  render(<QuestionCard q={q} onSubmit={vi.fn()} />);

  expect(screen.getByRole("img", { name: "Vocabulary illustration" })).toHaveTextContent(q.visual!);
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

it("plays the reading passage before an answer and is not cut off by the model", () => {
  const q = allQuestions.find((question) => question.id === "u2-r0")!;
  const { unmount } = render(<QuestionCard q={q} onSubmit={vi.fn()} />);
  const plays = vi.mocked(HTMLMediaElement.prototype.play);

  fireEvent.click(screen.getByRole("button", { name: "Play the reading passage" }));
  expect(plays).toHaveBeenCalledOnce();
  expect((plays.mock.contexts[0] as HTMLAudioElement).src).toContain(audioSources(q.passage!)[0]);
  fireEvent.click(screen.getByRole("button", { name: "Ruiz López" }));
  expect(plays).toHaveBeenCalledOnce();
  unmount();
  render(<QuestionCard q={q} exam onSubmit={vi.fn()} />);

  expect(
    screen.queryByRole("button", { name: "Play the reading passage" }),
  ).not.toBeInTheDocument();
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
