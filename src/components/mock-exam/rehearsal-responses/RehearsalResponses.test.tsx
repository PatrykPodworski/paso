import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import type { MockResponses } from "../../../data/types";
import { RehearsalResponses } from "./RehearsalResponses";

const responses: MockResponses = {
  started: "2026-09-09T08:00:00.000Z",
  items: [
    {
      section: 0,
      questionId: "mock-r1-0",
      variantId: "r1-v1",
      answer: "De Italia.",
      correct: true,
    },
    { section: 0, questionId: "mock-r1-1", variantId: "r1-v1", answer: "", correct: false },
    {
      section: 1,
      questionId: "mock-l1-0",
      variantId: "l1-v1",
      answer: "🥛 Leche.",
      correct: false,
    },
    {
      section: 2,
      questionId: "mock-w1",
      variantId: "w1-v1",
      status: "submitted",
      text: "Nombre: Bruno\nCiudad: Gdańsk",
      band: 2,
    },
    { section: 2, questionId: "mock-w2", variantId: "w2-v1", status: "empty", text: "" },
    {
      section: 3,
      questionId: "mock-s1",
      variantId: "s1-v1",
      status: "scored",
      transcript: "Lucía: ¿Cómo te llamas?\nYou: Me llamo Bruno.",
      score: {
        grade: "good",
        items: [{ id: "name", label: "Name", level: "understandable" }],
        corrections: [{ original: "Soy polaca", corrected: "Soy polaco", explanation: "Gender." }],
      },
    },
    { section: 3, questionId: "mock-s2", variantId: "s2-v1", status: "none" },
    {
      section: 2,
      questionId: "mock-w9",
      variantId: "w1-v9",
      status: "submitted",
      text: "Texto antiguo",
    },
  ],
};

const open = (load: (id: string) => Promise<MockResponses | null>) => {
  render(<RehearsalResponses resultId="m1" description="9 September 2026" load={load} />);
  fireEvent.click(screen.getByRole("button", { name: "View responses" }));

  return screen.getByRole("dialog");
};

const group = (title: string) =>
  screen.getByRole("heading", { name: title }).closest("section")!.textContent;

it("loads the result's responses when it opens and shows each section kind", async () => {
  const load = vi.fn(async () => responses);
  const dialog = open(load);

  expect(dialog).toHaveTextContent("Loading responses…");
  expect(load.mock.calls).toEqual([["m1"]]);
  expect(await within(dialog).findByRole("heading", { name: "Reading" })).toBeInTheDocument();

  expect(
    within(dialog)
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent),
  ).toEqual(["Reading", "Listening", "Writing", "Speaking", "This task is no longer in the exam"]);

  expect(group("Reading")).toBe(
    "Reading" +
      "¿De dónde es Mario?Your answer: De Italia.Right answer: De Italia." +
      "¿Con quién vive Mario?Your answer: No answerRight answer: Con su hermana.",
  );

  expect(
    within(dialog)
      .getAllByRole("img")
      .map((img) => img.getAttribute("alt")),
  ).toEqual(["Correct", "Incorrect", "Incorrect"]);

  expect(group("Listening")).toContain("Your answer: 🥛 Leche.Right answer: ☕ Café.");
  expect(group("Writing")).toContain("Nombre: Bruno\nCiudad: GdańskMark 2/3");
  expect(group("Writing")).toContain("Your friend Jorge writes:");
  expect(group("Writing")).toContain("Nothing submitted");

  expect(group("Speaking")).toContain(
    "Lucía: ¿Cómo te llamas?You: Me llamo Bruno." +
      "Lucía's grade: Good" +
      "NameUnderstandable, with mistakes" +
      "Soy polaca → Soy polaco Gender.",
  );

  expect(group("Speaking")).toContain("No scored talk");
  expect(group("This task is no longer in the exam")).toContain("Texto antiguo");
});

it("says the responses were not recorded when the server has none", async () => {
  const dialog = open(async () => null);

  expect(await within(dialog).findByText("Responses not recorded")).toBeInTheDocument();
});

it("shows Retry when the read fails, and loads again on Retry", async () => {
  const load = vi
    .fn<(id: string) => Promise<MockResponses | null>>()
    .mockRejectedValueOnce(new Error("Responses not loaded: 500"))
    .mockResolvedValueOnce(responses);

  const dialog = open(load);

  expect(await within(dialog).findByText("Your responses did not load.")).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole("button", { name: "Retry" }));

  expect(await within(dialog).findByText("Nothing submitted")).toBeInTheDocument();
  expect(load.mock.calls).toEqual([["m1"], ["m1"]]);
});
