import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { askingLessons, askingUnits } from "../../data/asking-questions/askingQuestions";
import { allLessons, units } from "../../data/curriculum";
import { mockQuestions } from "../../data/mock";
import { pathUnitNumber } from "../../data/path";
import { practiceSets, setLessons } from "../../data/practice-sets/index";
import type { Lesson } from "../../data/types";
import { BackofficePage } from "./BackofficePage";

// A set lesson lists its introduction (a review has none), form cards, base items and variations.
const rowsOf = (lessons: typeof askingLessons) =>
  lessons.flatMap((l) => [
    ...(l.introduction ? [l.introduction] : []),
    ...l.formCards,
    ...l.base,
    ...l.variations,
  ]).length;

const setRows = rowsOf(setLessons);

const setUnits = practiceSets.flatMap((s) => s.units).filter((u) => u.lessons.length).length;

// A set group's heading, numbered by where the unit sits on the path.
const setGroup = (name: string, id: string) => `${name} · Unit ${pathUnitNumber(id)}`;

it("lists every question of every unit, every practice set and the mock exam, grouped by unit", () => {
  const { container } = render(<BackofficePage setSession={() => {}} />);

  // Role queries scan every element of this page of 1,000+ rows and time out on CI, so the
  // whole-page counts use tag queries.
  const groups = [...container.querySelectorAll("section h2")].map((h) => h.textContent);

  expect(groups.slice(0, 2)).toEqual(["Unit 1 · ¡Hola, mundo!", "Unit 2 · This is me"]);
  expect(groups).toHaveLength(units.length + setUnits + 1);

  expect(groups.slice(-14)).toEqual([
    `Unit ${pathUnitNumber("u12")} · Ready for your next chapter`,
    setGroup("Asking questions", "aq-u1"),
    setGroup("Asking questions", "aq-u2"),
    setGroup("Asking questions", "aq-u3"),
    setGroup("Asking questions", "aq-u4"),
    setGroup("Weekdays", "wd-u1"),
    setGroup("Weekdays", "wd-u2"),
    setGroup("Where things are", "pl-u1"),
    setGroup("Where things are", "pl-u2"),
    setGroup("Where things are", "pl-u3"),
    setGroup("Time words", "tm-u1"),
    setGroup("Time words", "tm-u2"),
    setGroup("Numbers", "nu-u1"),
    "Mock exam",
  ]);

  expect(container.querySelectorAll("section li > button")).toHaveLength(
    units.flatMap((u) => u.lessons.flatMap((l) => l.questions)).length +
      setRows +
      mockQuestions.length,
  );

  const mock = within(screen.getByRole("region", { name: "Mock exam" }));
  const task = mock.getByText("Task 1 · Personal presentation · 1–2 min");
  const row = within(task.closest("button")!);

  expect(row.getByText("Live talk")).toBeInTheDocument();
  expect(row.getByText("Speaking")).toBeInTheDocument();
});

it("tells apart rows that share a title by their answer", () => {
  render(<BackofficePage setSession={() => {}} />);
  const unit = within(screen.getByRole("region", { name: "Unit 1 · ¡Hola, mundo!" }));
  const rows = unit.getAllByRole("button", { name: /Listen\. What does the Spanish/ });

  expect(rows).toHaveLength(4);
  expect(new Set(rows.map((r) => r.textContent)).size).toBe(4);
});

it("labels unit 1's live talk and opens it alone, off the learning path", () => {
  let lesson: Lesson | undefined;

  render(<BackofficePage setSession={(l) => (lesson = l)} />);
  const unit = within(screen.getByRole("region", { name: "Unit 1 · ¡Hola, mundo!" }));
  const row = unit.getByRole("button", { name: /Talk to Lucía/ });

  expect(within(row).getByText("Live talk")).toBeInTheDocument();
  expect(within(row).getByText("Make it your own")).toBeInTheDocument();

  expect(
    within(row).getByText("Me llamo Ana. Tengo treinta años. Soy de Polonia."),
  ).toBeInTheDocument();

  fireEvent.click(row);
  expect(lesson?.questions.map((q) => q.id)).toEqual(["u1-o3"]);
  expect(lesson?.title).toBe("Make it your own");
  expect(allLessons.some((l) => l.id === lesson?.id)).toBe(false);
});

it("lists the set's lessons in written order, teaching cards included, and opens a card alone", () => {
  let lesson: Lesson | undefined;

  render(<BackofficePage setSession={(l) => (lesson = l)} />);
  const set = within(screen.getByRole("region", { name: setGroup("Asking questions", "aq-u1") }));
  const rows = set.getAllByRole("button");

  expect(rows).toHaveLength(rowsOf(askingUnits[0].lessons));
  expect(rows[0]).toHaveTextContent(/^Teaching cardNew question words: qué, cómoWhat and how$/);

  expect(rows[1]).toHaveTextContent(
    "Multiple choiceChoose what this question asks for¿Qué quieres?What and how · A thing",
  );

  // Row 16 closes M01, the first lesson.
  expect(rows[16]).toHaveTextContent(/How do you want the coffee\?What and how/);

  fireEvent.click(rows[0]);
  expect(lesson?.questions.map((q) => q.id)).toEqual(["AQ-M01-INTRO"]);
  expect(lesson?.title).toBe("What and how");
  expect(lesson?.subtitle).toBe(setGroup("Asking questions", "aq-u1"));
});
