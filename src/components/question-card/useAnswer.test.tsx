import { act, render, screen } from "@testing-library/react";
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

it.each(["{broken", "null", "[]", "4", '{"Nacionalidad":8}'])(
  "rejects malformed form draft %s",
  (draft) => {
    render(<QuestionCard q={formPractice} draft={draft} onSubmit={vi.fn()} />);

    expect(
      screen.getAllByRole("textbox").every((input) => (input as HTMLInputElement).value === ""),
    ).toBe(true);

    expect(screen.getByRole("button", { name: "Review my practice" })).toBeDisabled();
  },
);

it("rejects a mixed valid/invalid form draft as a whole", () => {
  render(
    <QuestionCard
      q={formPractice}
      draft={JSON.stringify({ Nacionalidad: "polaca", "Nombre y apellidos": 8 })}
      onSubmit={vi.fn()}
    />,
  );

  expect(
    screen.getAllByRole("textbox").every((input) => (input as HTMLInputElement).value === ""),
  ).toBe(true);
});

it("restores a saved form draft without losing field labels", () => {
  const draft = JSON.stringify(
    Object.fromEntries(formPractice.fields!.map((f) => [f.label, "Una respuesta"])),
  );

  render(<QuestionCard q={formPractice} draft={draft} onSubmit={vi.fn()} />);
  expect(screen.getByRole("textbox", { name: "Nacionalidad" })).toHaveValue("Una respuesta");
  expect(screen.getByRole("button", { name: "Review my practice" })).toBeEnabled();
});
