import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { askingQuestionsSet } from "../../data/asking-questions/askingQuestions";
import { numbersSet } from "../../data/numbers/numbers";
import { pathUnitNumber } from "../../data/path";
import type { Lesson } from "../../data/types";
import { placementSet } from "../../data/placement/placement";
import { timeWordsSet } from "../../data/time-words/timeWords";
import { weekdaysSet } from "../../data/weekdays/weekdays";
import { emptySnapshot } from "../../test/progress";
import { SetPage } from "./SetPage";

// A unit's heading on the set page: its number on the path, which moves when a set unit joins
// the path before it.
const unit = (id: string) => `Unit ${pathUnitNumber(id)}`;

it("heads the page with the set's title and description", () => {
  render(<SetPage set={askingQuestionsSet} progress={emptySnapshot()} setSession={() => {}} />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Asking questions.");

  expect(
    screen.getByText(
      "Form and ask questions in Spanish, two or three new question words per lesson.",
    ),
  ).toBeInTheDocument();
});

it("heads each unit with its path number and what it teaches, each lesson with its exercise count", () => {
  render(<SetPage set={askingQuestionsSet} progress={emptySnapshot()} setSession={() => {}} />);

  expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
    ...["aq-u1", "aq-u2", "aq-u3", "aq-u4"].map(unit),
  ]);

  expect(screen.getByRole("region", { name: unit("aq-u3") })).toHaveTextContent(
    new RegExp(`^${unit("aq-u3")}de dónde, adónde, a qué hora, con quién`),
  );

  expect(screen.getByRole("button", { name: /What and how/ })).toHaveTextContent(
    "What and howLearn two question words: qué, cómo16 exercises",
  );

  expect(screen.getByRole("button", { name: /Who and which/ })).toHaveTextContent(
    "Who and whichLearn quién and cuál, mixed with earlier words20 exercises",
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
    unit("wd-u1"),
    unit("wd-u2"),
  ]);

  expect(screen.getByRole("button", { name: /^Monday to Wednesday/ })).toHaveTextContent(
    "Monday to WednesdayLearn three new days21 exercises",
  );
});

it("lists only the placement units that have lessons", () => {
  render(<SetPage set={placementSet} progress={emptySnapshot()} setSession={() => {}} />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Where things are.");

  expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
    unit("pl-u1"),
    unit("pl-u2"),
    unit("pl-u3"),
  ]);

  expect(screen.getByRole("region", { name: unit("pl-u1") })).toHaveTextContent(
    `${unit("pl-u1")}en, dentro de, fuera de, encima de, debajo de`,
  );

  expect(screen.getByRole("region", { name: unit("pl-u2") })).toHaveTextContent(
    `${unit("pl-u2")}delante de, detrás de, enfrente de, al lado de, entre`,
  );

  expect(screen.getByRole("region", { name: unit("pl-u3") })).toHaveTextContent(
    `${unit("pl-u3")}cerca de, lejos de, a la izquierda de, a la derecha de`,
  );

  expect(screen.getByRole("button", { name: /^In, inside and outside/ })).toHaveTextContent(
    "In, inside and outsideen, dentro de and fuera de21 exercises",
  );
});

it("lists the time-words units with their lessons under their path numbers", () => {
  render(<SetPage set={timeWordsSet} progress={emptySnapshot()} setSession={() => {}} />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Time words.");

  expect(
    screen.getByText(
      "Learn sixteen everyday Spanish time words, from hoy to hasta, two or three per lesson.",
    ),
  ).toBeInTheDocument();

  expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
    unit("tm-u1"),
    unit("tm-u2"),
  ]);

  expect(screen.getByRole("button", { name: /Today/ })).toHaveTextContent(
    "Today, tomorrow, yesterdayhoy, mañana, ayer18 exercises",
  );

  expect(screen.getByRole("button", { name: /Morning/ })).toHaveTextContent(
    "Morning, afternoon, nightpor la mañana, por la tarde, por la noche21 exercises",
  );
});

it("lists the numbers units that have lessons under their path numbers", () => {
  render(<SetPage set={numbersSet} progress={emptySnapshot()} setSession={() => {}} />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Numbers.");

  expect(
    screen.getByText(
      "Learn the Spanish numbers from cero to un millón, two or three new ones per lesson.",
    ),
  ).toBeInTheDocument();

  expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual([
    unit("nu-u1"),
    unit("nu-u2"),
    unit("nu-u3"),
    unit("nu-u4"),
    unit("nu-u5"),
  ]);

  expect(screen.getByRole("region", { name: unit("nu-u1") })).toHaveTextContent(
    `${unit("nu-u1")}cero to siete`,
  );

  expect(screen.getByRole("region", { name: unit("nu-u2") })).toHaveTextContent(
    `${unit("nu-u2")}ocho to quince`,
  );

  expect(screen.getByRole("region", { name: unit("nu-u3") })).toHaveTextContent(
    `${unit("nu-u3")}dieciséis to veintinueve`,
  );

  expect(screen.getByRole("region", { name: unit("nu-u4") })).toHaveTextContent(
    `${unit("nu-u4")}treinta to cien`,
  );

  expect(screen.getByRole("region", { name: unit("nu-u5") })).toHaveTextContent(
    `${unit("nu-u5")}cien to un millón`,
  );

  expect(screen.getByRole("button", { name: /^Zero and one/ })).toHaveTextContent(
    "Zero and onecero, uno14 exercises",
  );
});
