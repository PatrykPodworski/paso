import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import { stopAudio } from "../audio/playback";
import { formPractice } from "../../data/mock";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  // A passage player deliberately survives its own unmount; end it with the session.
  act(stopAudio);
});

const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));

it("preserves form labels and refuses whitespace-only fields", () => {
  const onDraft = vi.fn(),
    evaluated = vi.fn();

  render(
    <QuestionCard q={formPractice} onDraft={onDraft} onSubmit={vi.fn()} onEvaluated={evaluated} />,
  );

  for (const f of formPractice.fields!) {
    fireEvent.change(screen.getByRole("textbox", { name: f.label }), {
      target: { value: f.example },
    });
  }

  const f = formPractice.fields![0];

  fireEvent.change(screen.getByRole("textbox", { name: f.label }), { target: { value: " " } });
  expect(screen.getByRole("button", { name: "Review my practice" })).toBeDisabled();
  fireEvent.change(screen.getByRole("textbox", { name: f.label }), { target: { value: "Ana" } });
  click("Review my practice");

  expect(evaluated.mock.calls[0]).toEqual([
    expect.stringContaining(`${f.label}: Ana\nNacionalidad:`),
    null,
    false,
  ]);

  expect(JSON.parse(onDraft.mock.calls.at(-1)![0])[f.label]).toBe("Ana");
});

it("counts only form values toward the writing target", () => {
  render(<QuestionCard q={formPractice} onSubmit={vi.fn()} />);

  const values = [
    "Ana María López",
    "polaca",
    "Varsovia",
    "profesora de música",
    "polaco inglés español",
    "leer y escuchar música",
  ];

  for (const [i, field] of formPractice.fields!.entries()) {
    fireEvent.change(screen.getByRole("textbox", { name: field.label }), {
      target: { value: values[i] },
    });
  }

  expect(
    screen.getByText("15 words · target 15–25. Use fictional personal details."),
  ).toBeInTheDocument();
});

it("requires all form fields before reviewing", () => {
  render(<QuestionCard q={formPractice} onSubmit={vi.fn()} />);
  expect(screen.getByRole("button", { name: "Review my practice" })).toBeDisabled();

  for (const field of formPractice.fields!) {
    fireEvent.change(screen.getByRole("textbox", { name: field.label }), {
      target: { value: "Una respuesta" },
    });
  }

  expect(screen.getByRole("button", { name: "Review my practice" })).toBeEnabled();
});
