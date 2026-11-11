import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { askingQuestionsSet } from "../../data/asking-questions/askingQuestions";
import type { Lesson } from "../../data/types";
import { placementSet } from "../../data/placement/placement";
import { timeWordsSet } from "../../data/time-words/timeWords";
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

it("heads each unit with its path number and what it teaches, each lesson with its exercise count", () => {
  render(<SetPage set={askingQuestionsSet} progress={emptySnapshot()} setSession={() => {}} />);

  expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
    "Unit 14",
    "Unit 15",
    "Unit 17",
    "Unit 19",
  ]);

  expect(screen.getByRole("region", { name: "Unit 17" })).toHaveTextContent(
    /^Unit 17a qué hora, de dónde, adónde, con quién/,
  );

  expect(screen.getByRole("button", { name: /What and how/ })).toHaveTextContent(
    "What and howLearn two question words: qué, cómo16 exercises",
  );

  expect(screen.getByRole("button", { name: /^Asking who(?! with|se)/ })).toHaveTextContent(
    "Asking whoLearn one new question word18 exercises",
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
    fireEvent.click(screen.getByRole("button", { name: /What and how/ }));
  }

  expect(opened.map((l) => l.id)).toEqual(["aq-m01", "aq-m01", "aq-m01", "aq-m01"]);
  expect(new Set(opened.map((l) => l.questions.map((q) => q.id).join())).size).toBeGreaterThan(1);
});

it("lists the two weekdays units", () => {
  render(<SetPage set={weekdaysSet} progress={emptySnapshot()} setSession={() => {}} />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Weekdays.");

  expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
    "Unit 7",
    "Unit 8",
  ]);

  expect(screen.getByRole("button", { name: /^Monday to Wednesday/ })).toHaveTextContent(
    "Monday to WednesdayLearn three new days21 exercises",
  );
});

it("lists only the placement units that have lessons", () => {
  render(<SetPage set={placementSet} progress={emptySnapshot()} setSession={() => {}} />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Where things are.");

  expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
    "Unit 5",
  ]);

  expect(screen.getByRole("region", { name: "Unit 5" })).toHaveTextContent(
    /^Unit 5en, dentro de, fuera de, encima de/,
  );

  expect(screen.getByRole("button", { name: /In or on/ })).toHaveTextContent(
    "In or onLearn one new phrase18 exercises",
  );
});

it("lists the time-words unit with L01 under its path number", () => {
  render(<SetPage set={timeWordsSet} progress={emptySnapshot()} setSession={() => {}} />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Time words.");

  expect(
    screen.getByText(
      "Learn sixteen everyday Spanish time words, from hoy to hasta, one per lesson.",
    ),
  ).toBeInTheDocument();

  expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
    "Unit 9",
  ]);

  expect(screen.getByRole("button", { name: /Today/ })).toHaveTextContent(
    "TodayLearn one new time word18 exercises",
  );
});
