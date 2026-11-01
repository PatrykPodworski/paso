import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import { stopAudio } from "../audio/playback";
import { allQuestions } from "../../data/curriculum";
import { formPractice } from "../../data/mock";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  // A shared listening recording deliberately survives its own unmount; end it with the session.
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

  localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "olé" }));
  render(<QuestionCard q={formPractice} draft={draft} onSubmit={vi.fn()} />);
  expect(screen.getByRole("textbox", { name: "Nacionalidad" })).toHaveValue("Una respuesta");
  expect(screen.getByRole("button", { name: "Review my practice" })).toBeEnabled();
});

it("keeps a written answer within the 4000 characters the server stores", () => {
  const write = allQuestions.find((q) => q.kind === "write")!;
  const onDraft = vi.fn();

  render(<QuestionCard q={write} draft={"a".repeat(4000)} onDraft={onDraft} onSubmit={vi.fn()} />);
  const area = screen.getByRole("textbox", { name: "Your answer in Spanish" });

  expect(area).toHaveAttribute("maxlength", "4000");
  fireEvent.click(screen.getByRole("button", { name: "Insert ñ" }));
  expect((area as HTMLTextAreaElement).value).toHaveLength(4000);
  expect(onDraft).not.toHaveBeenCalled();
});

it("refuses a form change that would make the saved form longer than 4000 characters", () => {
  const onDraft = vi.fn();

  render(<QuestionCard q={formPractice} draft="" onDraft={onDraft} onSubmit={vi.fn()} />);
  const [name, city] = screen.getAllByRole("textbox") as HTMLInputElement[];

  fireEvent.change(name, { target: { value: "a".repeat(3900) } });
  fireEvent.change(city, { target: { value: "Varsovia".repeat(20) } });

  expect(name.value).toHaveLength(3900);
  expect(city.value).toBe("");
  expect(onDraft.mock.calls.map(([text]) => text.length)).toEqual([3925]);
});
