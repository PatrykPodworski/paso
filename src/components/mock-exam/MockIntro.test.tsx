import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { emptySnapshot } from "../../test/progress";
import { MockIntro } from "./MockIntro";

const mount = (progress = emptySnapshot()) =>
  render(<MockIntro progress={progress} onStart={vi.fn()} />);

it("introduces every section and lists previous rehearsals newest first", () => {
  mount({
    ...emptySnapshot(),
    mockResults: [
      { id: "first", at: "2026-01-05T10:00:00Z", reading: 10, listening: 12 },
      { id: "second", at: "2026-02-05T10:00:00Z", reading: 20, listening: 22 },
    ],
  });

  expect(screen.getAllByText("25 questions · 4 tasks")).toHaveLength(2);
  expect(screen.getByText("2 tasks")).toBeInTheDocument();
  expect(screen.getByText("3 tasks")).toBeInTheDocument();

  expect(screen.getAllByText(/^Reading \d+\/25$/).map((e) => e.textContent)).toEqual([
    "Reading 20/25",
    "Reading 10/25",
  ]);

  expect(screen.getAllByText(/^Listening \d+\/25$/).map((e) => e.textContent)).toEqual([
    "Listening 22/25",
    "Listening 12/25",
  ]);

  expect(screen.queryByRole("timer")).not.toBeInTheDocument();
});

it("hides the history panel before the first rehearsal", () => {
  mount();

  expect(
    screen.queryByRole("heading", { name: "Your previous rehearsals" }),
  ).not.toBeInTheDocument();
});
