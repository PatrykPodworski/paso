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

const choice = allQuestions[0];

it("focuses the new heading and scrolls its dialog to the top when the question changes", () => {
  const dialog = document.body.appendChild(document.createElement("dialog"));

  dialog.setAttribute("open", "");
  const next = allQuestions[1];

  const { rerender } = render(<QuestionCard key={choice.id} q={choice} onSubmit={vi.fn()} />, {
    container: dialog,
  });

  expect(screen.getByRole("heading", { name: choice.prompt })).toHaveFocus();
  Object.defineProperty(dialog, "scrollTop", { value: 240, writable: true });
  rerender(<QuestionCard key={next.id} q={next} onSubmit={vi.fn()} />);
  expect(screen.getByRole("heading", { name: next.prompt })).toHaveFocus();
  expect(dialog.scrollTop).toBe(0);
});

it.each([
  ["u1-g0", "soy", "Yo soy Marta."],
  ["u2-g1", "Dónde", "¿Dónde vives? — En Málaga."],
  ["u2-g2", "dieciséis", "dieciséis"],
  ["u2-r0", "Ruiz López", "apellidos"],
  ["u7-g1", "To the left.", "A la izquierda."],
  ["u1-o1", "wrong answer", "Soy de Polonia."],
])("reads the Spanish teaching phrase for %s", (id, choice, expected) => {
  const q = allQuestions.find((question) => question.id === id)!;

  render(<QuestionCard q={q} onSubmit={vi.fn()} />);

  if (q.options) {
    fireEvent.click(screen.getByRole("button", { name: choice }));
  } else {
    fireEvent.change(screen.getByRole("textbox"), { target: { value: choice } });
    fireEvent.click(screen.getByRole("button", { name: "Check answer" }));
  }

  const plays = vi.mocked(HTMLMediaElement.prototype.play);

  expect(plays).toHaveBeenCalledOnce();
  expect((plays.mock.contexts[0] as HTMLAudioElement).src).toContain(audioSources(expected)[0]);

  expect(screen.getByRole("button", { name: "Stop audio" })).toBeInTheDocument();
});

it("starts each listening question on entry and cancels the previous clip", async () => {
  const first = allQuestions.find((q) => q.id === "u1-v1")!;
  const second = allQuestions.find((q) => q.id === "u1-v3")!;

  const { rerender, unmount } = render(
    <QuestionCard key={first.id} q={first} onSubmit={vi.fn()} />,
  );

  const plays = vi.mocked(HTMLMediaElement.prototype.play);

  expect(plays).toHaveBeenCalledOnce();
  expect((plays.mock.contexts[0] as HTMLAudioElement).src).toContain(audioSources("adiós")[0]);
  rerender(<QuestionCard key={second.id} q={second} onSubmit={vi.fn()} />);
  expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledOnce();
  expect(plays).toHaveBeenCalledTimes(2);

  expect((plays.mock.contexts[1] as HTMLAudioElement).src).toContain(audioSources("por favor")[0]);

  unmount();
  expect(HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(2);
});
