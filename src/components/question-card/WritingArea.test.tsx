import { act, fireEvent, render, screen } from "@testing-library/react";
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

const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
const type = allQuestions.find((q) => q.kind === "type")!;
const writing = allQuestions.find((q) => q.id === "u1-o2")!;

const write = (text: string) =>
  fireEvent.change(screen.getByRole("textbox"), { target: { value: text } });

const words = (n: number) => Array(n).fill("hola").join(" ");

it.each([
  [3, true],
  [35, false],
  [45, true],
])("counts %i written words against the target", (n, outside) => {
  render(<QuestionCard q={writing} onSubmit={vi.fn()} />);
  write(words(n));
  const count = screen.getByText(`${n} / 30–40 words`);

  expect(count).toHaveClass("word-count");
  expect(count.classList.contains("outside")).toBe(outside);
});

it("requires non-whitespace typed text and Enter checks exactly once", () => {
  const evaluated = vi.fn();

  render(<QuestionCard q={type} onSubmit={vi.fn()} onEvaluated={evaluated} />);
  const input = screen.getByRole("textbox");

  fireEvent.change(input, { target: { value: "  " } });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(evaluated).not.toHaveBeenCalled();
  fireEvent.change(input, { target: { value: type.answer } });
  fireEvent.keyDown(input, { key: "a" });
  expect(evaluated).not.toHaveBeenCalled();
  fireEvent.keyDown(input, { key: "Enter" });
  fireEvent.keyDown(input, { key: "Enter" });
  expect(evaluated).toHaveBeenCalledExactlyOnceWith(type.answer, true, false);
  expect(input).toBeDisabled();
});

it("inserts accents at the selected text and restores cursor focus", async () => {
  render(<QuestionCard q={type} onSubmit={vi.fn()} />);
  const input = screen.getByRole("textbox") as HTMLInputElement;

  fireEvent.change(input, { target: { value: "anos" } });
  input.setSelectionRange(1, 2);
  click("Insert ñ");
  expect(input).toHaveValue("años");
  await act(() => new Promise((r) => requestAnimationFrame(r)));
  expect(input.selectionStart).toBe(2);
  expect(input.selectionEnd).toBe(2);
  expect(input).toHaveFocus();
});
