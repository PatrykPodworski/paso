import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { askingLessons, askingUnits } from "../../data/asking-questions/askingQuestions";
import { allLessons, units } from "../../data/curriculum";
import { mockQuestions } from "../../data/mock";
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

it("lists every question of every unit, every practice set and the mock exam, grouped by unit", () => {
  const { container } = render(<BackofficePage setSession={() => {}} />);

  // Role queries scan every element of this page of 1,000+ rows and time out on CI, so the
  // whole-page counts use tag queries.
  const groups = [...container.querySelectorAll("section h2")].map((h) => h.textContent);

  expect(groups.slice(0, 2)).toEqual(["Unit 1 · ¡Hola, mundo!", "Unit 2 · This is me"]);
  expect(groups).toHaveLength(units.length + setUnits + 1);

  expect(groups.slice(-7)).toEqual([
    "Unit 12 · Ready for your next chapter",
    "Asking questions · Unit 1",
    "Asking questions · Unit 2",
    "Asking questions · Unit 3",
    "Asking questions · Unit 4",
    "Weekdays · Unit 1",
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
  const set = within(screen.getByRole("region", { name: "Asking questions · Unit 1" }));
  const rows = set.getAllByRole("button");

  expect(rows).toHaveLength(rowsOf(askingUnits[0].lessons));
  expect(rows[0]).toHaveTextContent(/^Teaching cardNew question word: quéAsking for things$/);

  expect(rows[1]).toHaveTextContent(
    "Multiple choice¿Qué quieres? Choose the information the speaker wants.Asking for things · A thing the listener wants",
  );

  // Row 17 closes L01, the first lesson.
  expect(rows[17]).toHaveTextContent(/Ask Luis what Pablo eats/);

  fireEvent.click(rows[0]);
  expect(lesson?.questions.map((q) => q.id)).toEqual(["AQ-T01-INTRO"]);
  expect(lesson?.title).toBe("Asking for things");
  expect(lesson?.subtitle).toBe("Asking questions · Unit 1");
});
