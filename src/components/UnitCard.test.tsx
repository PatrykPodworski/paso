import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { pathUnits, type PathLesson, type PathUnit } from "../data/path";
import type { Lesson } from "../data/types";
import { emptySnapshot } from "../test/progress";
import { UnitCard } from "./UnitCard";

const lesson = (n: number): PathLesson => {
  const run: Lesson = {
    id: `set-l${n}`,
    title: `Lesson ${n}`,
    subtitle: "Ask and answer",
    minutes: 3,
    icon: "spark",
    questions: [],
  };

  return { ...run, lesson: () => run };
};

const unit: PathUnit = {
  id: "set-u1",
  number: 7,
  icon: "spark",
  eyebrow: "Preguntas",
  title: "Asking questions",
  subtitle: "One question word per lesson.",
  goals: [],
  lessons: [1, 2, 3, 4, 5].map(lesson),
};

const card = (progress = emptySnapshot(), start: (l: Lesson) => void = () => {}) =>
  render(
    <UnitCard unit={unit} progress={progress} start={start} expanded={false} onExpand={() => {}} />,
  );

it("numbers the unit and counts its own lessons", () => {
  card();

  expect(screen.getByRole("button", { expanded: false })).toHaveTextContent(
    "UNIT 07 · PreguntasAsking questionsOne question word per lesson.5 lessons",
  );
});

it("counts the lessons done out of the unit's own lessons", () => {
  const progress = emptySnapshot();

  progress.completed["set-l1"] = { score: 1, total: 1, at: "2026-11-10T08:00:00Z" };
  progress.completed["set-l3"] = { score: 1, total: 1, at: "2026-11-10T08:00:00Z" };
  card(progress);

  expect(screen.getByText("2/5 lessons")).toBeInTheDocument();
});

it("shows no goals row and no pattern for a unit without them, and starts the lesson to run", () => {
  const started: Lesson[] = [];

  render(
    <UnitCard
      unit={unit}
      progress={emptySnapshot()}
      start={(l) => started.push(l)}
      expanded
      onExpand={() => {}}
    />,
  );

  // Without a goals row, the lesson list opens the expanded section.
  const section = screen.getByRole("button", { expanded: true }).nextElementSibling!;

  expect(section.firstElementChild).toHaveTextContent(/^Lesson 1Ask and answer3 min/);
  expect(screen.queryByText("A little pattern to remember")).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /Lesson 4/ }));

  expect(started.map((l) => l.id)).toEqual(["set-l4"]);
});

it("shows a course unit's goals and its pattern to remember", () => {
  render(
    <UnitCard
      unit={pathUnits[0]}
      progress={emptySnapshot()}
      start={() => {}}
      expanded
      onExpand={() => {}}
    />,
  );

  expect(screen.getByText("Greet and introduce yourself")).toBeInTheDocument();
  expect(screen.getByText("A little pattern to remember")).toBeInTheDocument();
  expect(screen.getByText(/^Use soy for identity and origin\./)).toBeInTheDocument();
});
