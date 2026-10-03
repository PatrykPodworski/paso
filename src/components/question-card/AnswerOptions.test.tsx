import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import { stopAudio } from "../audio/playback";
import { audioSources } from "../../data/audio-sources";
import { allQuestions } from "../../data/curriculum";

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

it("marks the picked wrong option and reveals the right one", () => {
  render(<QuestionCard q={choice} onSubmit={vi.fn()} />);
  click(wrong);
  expect(screen.getByRole("button", { name: wrong })).toHaveClass("incorrect");
  expect(screen.getByRole("button", { name: wrong })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("button", { name: choice.answer })).toHaveClass("correct");
  expect(screen.getByRole("button", { name: choice.answer })).not.toHaveClass("incorrect");
});

it.each(["first name", "address"])(
  "selecting %s immediately checks once and pronounces el nombre",
  (choice) => {
    const q = allQuestions.find((question) => question.id === "u2-v0")!;

    const evaluated = vi.fn(),
      submit = vi.fn();

    render(<QuestionCard q={q} onSubmit={submit} onEvaluated={evaluated} />);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: "Check answer" })).not.toBeInTheDocument();
    const option = screen.getByRole("button", { name: choice });

    fireEvent.click(option);
    fireEvent.click(option);
    expect(evaluated).toHaveBeenCalledExactlyOnceWith(choice, choice === "first name", false);
    expect(submit).not.toHaveBeenCalled();
    expect(option).toBeDisabled();
    const plays = vi.mocked(HTMLMediaElement.prototype.play);

    expect(plays).toHaveBeenCalledOnce();

    expect((plays.mock.contexts[0] as HTMLAudioElement).src).toContain(
      audioSources("el nombre")[0],
    );

    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();
  },
);

it("checks a wrong choice immediately and advances only after Continue", () => {
  const submit = vi.fn();
  const q = allQuestions[0];

  render(<QuestionCard q={q} onSubmit={submit} />);
  expect(screen.queryByRole("button", { name: "Check answer" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: q.options![1] }));
  expect(screen.getByText("A good moment to learn.")).toBeInTheDocument();
  expect(submit).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  expect(submit).toHaveBeenCalledWith(q.options![1], false, false);
});
