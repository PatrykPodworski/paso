import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import type { Lesson } from "../../data/types";
import { emptySnapshot } from "../../test/progress";
import { QuestionsPage } from "./QuestionsPage";

it("lists the units that have lessons, each lesson with its exercise count", () => {
  render(<QuestionsPage progress={emptySnapshot()} setSession={() => {}} />);

  expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
    "Unit 1",
    "Unit 2",
    "Unit 3",
    "Unit 4",
  ]);

  expect(screen.getByRole("button", { name: /Asking for things/ })).toHaveTextContent(
    "Asking for thingsLearn one new question word17 exercises",
  );

  expect(screen.getByRole("button", { name: /^Asking who(?! with|se)/ })).toHaveTextContent(
    "Asking whoLearn one new question word19 exercises",
  );
});

it("opens a lesson with its variations in a new order each time", () => {
  const opened: Lesson[] = [];

  render(<QuestionsPage progress={emptySnapshot()} setSession={(l) => opened.push(l)} />);

  for (let i = 0; i < 4; i++) {
    fireEvent.click(screen.getByRole("button", { name: /Asking for things/ }));
  }

  expect(opened.map((l) => l.id)).toEqual(["aq-l01", "aq-l01", "aq-l01", "aq-l01"]);
  expect(new Set(opened.map((l) => l.questions.map((q) => q.id).join())).size).toBeGreaterThan(1);
});
