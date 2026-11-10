import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { askingQuestionsSet } from "../../data/asking-questions/askingQuestions";
import type { Lesson } from "../../data/types";
import { weekdaysSet } from "../../data/weekdays/weekdays";
import { emptySnapshot } from "../../test/progress";
import { SetPage } from "./SetPage";

it("heads the page with the set's title and description", () => {
  render(<SetPage set={askingQuestionsSet} progress={emptySnapshot()} setSession={() => {}} />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Asking questions.");

  expect(
    screen.getByText("Form and ask questions in Spanish, one new question word per lesson."),
  ).toBeInTheDocument();
});

it("lists the units that have lessons, each lesson with its exercise count", () => {
  render(<SetPage set={askingQuestionsSet} progress={emptySnapshot()} setSession={() => {}} />);

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

  render(
    <SetPage
      set={askingQuestionsSet}
      progress={emptySnapshot()}
      setSession={(l) => opened.push(l)}
    />,
  );

  for (let i = 0; i < 4; i++) {
    fireEvent.click(screen.getByRole("button", { name: /Asking for things/ }));
  }

  expect(opened.map((l) => l.id)).toEqual(["aq-l01", "aq-l01", "aq-l01", "aq-l01"]);
  expect(new Set(opened.map((l) => l.questions.map((q) => q.id).join())).size).toBeGreaterThan(1);
});

it("lists only the weekdays units that have lessons", () => {
  render(<SetPage set={weekdaysSet} progress={emptySnapshot()} setSession={() => {}} />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Weekdays.");

  expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
    "Unit 1",
  ]);

  expect(screen.getByRole("button", { name: /Monday/ })).toHaveTextContent(
    "MondayLearn one new day18 exercises",
  );
});
