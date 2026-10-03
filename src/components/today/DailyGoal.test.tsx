import { render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { allQuestions } from "../../data/curriculum";
import { emptyProgress } from "../../data/progress";
import { DailyGoal } from "./DailyGoal";

afterEach(() => {
  vi.useRealTimers();
});

it.each([
  [0, 5, 0, "A few minutes. A little more confidence."],
  [1, 5, 1, "You’re building a lovely habit."],
  [5, 5, 5, "Daily goal reached. ¡Muy bien!"],
  [6, 5, 5, "Daily goal reached. ¡Muy bien!"],
])("renders the bounded daily goal for %s of %s answers", (count, goal, value, message) => {
  const p = emptyProgress();

  p.goal = goal as number;

  p.attempts = allQuestions.slice(0, count as number).map((q, i) => ({
    id: String(i),
    questionId: q.id,
    skill: q.skill,
    answer: q.answer,
    correct: true,
    at: new Date().toISOString(),
  }));

  render(<DailyGoal progress={p} openSettings={vi.fn()} />);

  expect(screen.getByText(message as string)).toBeInTheDocument();
  const ring = screen.getByRole("progressbar", { name: "Daily goal" });

  expect(ring).toHaveAttribute("aria-valuenow", String(value));
  expect(ring).toHaveAttribute("aria-valuemax", String(goal));
});

it("renders the week from Monday through Sunday with per-day unique answers", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 9, 12));
  const p = emptyProgress();

  p.attempts = [
    {
      id: "one",
      questionId: "one",
      skill: "reading",
      answer: "hola",
      correct: true,
      at: new Date(2026, 8, 7, 12).toISOString(),
    },
    {
      id: "again",
      questionId: "one",
      skill: "reading",
      answer: "hola",
      correct: true,
      at: new Date(2026, 8, 7, 13).toISOString(),
    },
  ];

  render(<DailyGoal progress={p} openSettings={vi.fn()} />);
  const days = within(screen.getByRole("list", { name: "This week" })).getAllByRole("listitem");

  expect(days.map((day) => day.textContent)).toEqual(["M", "T", "W", "T", "F", "S", "S"]);

  expect(within(days[0]).getByRole("img")).toHaveAccessibleName(/: 1 exercises$/);

  days.slice(1).forEach((day) => {
    expect(within(day).getByRole("img")).toHaveAccessibleName(/: 0 exercises$/);
  });
});
