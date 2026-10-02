import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import { stopAudio } from "../audio/playback";
import { allQuestions } from "../../data/curriculum";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  // A passage player deliberately survives its own unmount; end it with the session.
  act(stopAudio);
});

const choice = allQuestions[0];
const type = allQuestions.find((q) => q.kind === "type")!;
const writing = allQuestions.find((q) => q.id === "u1-o2")!;

it.each([
  ["an exam", choice, true, "Answers are reviewed after the section."],
  ["practice", writing, false, "A little imperfect Spanish is progress."],
  ["an objective question", type, false, "Take your time. Every mistake is a chance to learn."],
])("shows the footer note for %s", (_, q, exam, note) => {
  render(<QuestionCard q={q} exam={exam} onSubmit={vi.fn()} />);
  expect(screen.getByText(note)).toBeInTheDocument();
});
