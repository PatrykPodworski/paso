import { act, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { mount, now, seed, setupMockExam } from "../../test/mockExam";

setupMockExam();

it("marks finished sections and turns the timer urgent under two minutes", () => {
  seed({ section: 2, deadline: now + 120000 });
  const { container } = mount();

  expect(container.querySelector(".exam-steps")).toHaveTextContent(
    "✓Reading✓Listening3Writing4Speaking",
  );

  expect(container.querySelectorAll(".exam-steps .done")).toHaveLength(2);
  expect(container.querySelector(".exam-steps .active")).toHaveTextContent("3Writing");
  expect(screen.getByRole("timer")).toHaveTextContent("02:00");
  expect(screen.getByRole("timer")).not.toHaveClass("urgent");
  act(() => vi.advanceTimersByTime(1000));
  expect(screen.getByRole("timer")).toHaveTextContent("01:59");
  expect(screen.getByRole("timer")).toHaveClass("urgent");
});
