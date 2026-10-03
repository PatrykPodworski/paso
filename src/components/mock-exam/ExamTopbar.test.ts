import { act, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { mount, now, seed, setupMockExam } from "../../test/mockExam";

setupMockExam();

it("marks finished sections and turns the timer urgent under two minutes", () => {
  seed({ section: 2, deadline: now + 120000 });
  mount();
  const steps = within(screen.getByRole("list", { name: "Exam sections" }));

  expect(steps.getAllByRole("listitem").map((step) => step.textContent)).toEqual([
    "✓Reading",
    "✓Listening",
    "3Writing",
    "4Speaking",
  ]);

  expect(steps.getByRole("listitem", { current: "step" })).toHaveTextContent("3Writing");
  expect(screen.getByRole("timer")).toHaveTextContent("02:00");
  expect(screen.getByRole("timer")).not.toHaveClass("urgent");
  act(() => vi.advanceTimersByTime(1000));
  expect(screen.getByRole("timer")).toHaveTextContent("01:59");
  expect(screen.getByRole("timer")).toHaveClass("urgent");
});
