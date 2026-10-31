import { render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { allQuestions } from "../../data/curriculum";
import { emptySnapshot, questionState } from "../../test/progress";
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
  const p = {
    ...emptySnapshot(),
    goal: goal as number,
    questions: Object.fromEntries(
      allQuestions
        .slice(0, count as number)
        .map((q) => [q.id, questionState({ skill: q.skill, at: new Date().toISOString() })]),
    ),
  };

  render(<DailyGoal progress={p} openSettings={vi.fn()} />);

  expect(screen.getByText(message as string)).toBeInTheDocument();
  const ring = screen.getByRole("progressbar", { name: "Daily goal" });

  expect(ring).toHaveAttribute("aria-valuenow", String(value));
  expect(ring).toHaveAttribute("aria-valuemax", String(goal));
});

it("renders the week from Monday through Sunday with the practised days", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 9, 12));

  const answer = (day: number) => questionState({ at: new Date(2026, 8, day, 12).toISOString() });

  const p = {
    ...emptySnapshot(),
    questions: { one: answer(9), two: answer(9), three: answer(7) },
    days: ["2026-09-09", "2026-09-08", "2026-09-07"],
  };

  render(<DailyGoal progress={p} openSettings={vi.fn()} />);
  const days = within(screen.getByRole("list", { name: "This week" })).getAllByRole("listitem");
  const labels = days.map((day) => within(day).getByRole("img").getAttribute("aria-label"));

  expect(days.map((day) => day.textContent)).toEqual(["M", "T", "W", "T", "F", "S", "S"]);

  expect(labels.map((label) => label?.replace(/^.*: /, ""))).toEqual([
    "practised",
    "practised",
    "2 exercises",
    "no practice",
    "no practice",
    "no practice",
    "no practice",
  ]);
});
