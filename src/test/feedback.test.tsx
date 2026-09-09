import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { CoachFeedback } from "../components/CoachFeedback";
import { review } from "./coach-fixture";
it("announces pending work and exposes an explicit retry on failure", () => {
  const retry = vi.fn();
  const { rerender } = render(
    <CoachFeedback review={null} loading error="" speaking={false} onRetry={retry} />,
  );
  expect(screen.getByRole("region", { name: "Codex feedback" })).toHaveAttribute(
    "aria-busy",
    "true",
  );
  expect(screen.getByRole("status")).toHaveTextContent("Reading your Spanish");
  expect(screen.queryByText(review.summary)).not.toBeInTheDocument();
  rerender(
    <CoachFeedback
      review={null}
      loading={false}
      error="Try again later"
      speaking={false}
      onRetry={retry}
    />,
  );
  expect(screen.getByRole("region", { name: "Codex feedback" })).toHaveAttribute(
    "aria-busy",
    "false",
  );
  expect(screen.getByRole("status")).toHaveTextContent("Try again later");
  fireEvent.click(screen.getByRole("button", { name: "Try Codex again" }));
  expect(retry).toHaveBeenCalledOnce();
});
it("shows no invented strengths/corrections when the coach has none", () => {
  render(
    <CoachFeedback
      review={{ ...review, strengths: [], corrections: [] }}
      loading={false}
      error=""
      speaking={false}
      onRetry={vi.fn()}
    />,
  );
  expect(screen.queryByText("What’s working")).not.toBeInTheDocument();
  expect(
    screen.getByText("No specific language corrections suggested for this answer."),
  ).toBeInTheDocument();
  expect(screen.getByText(/not an official DELE grade/)).toBeInTheDocument();
});
it("preserves covered, missing and unassessable points and escapes model text", () => {
  const summary = "<img src=x onerror=alert(1)>";
  const { container } = render(
    <CoachFeedback
      review={{ ...review, summary }}
      loading={false}
      error=""
      speaking
      onRetry={vi.fn()}
    />,
  );
  for (const label of ["Covered:", "Still to add:", "Self-review needed:"]) {
    expect(screen.getByText(label)).toBeInTheDocument();
  }
  expect(screen.getByText(summary)).toBeInTheDocument();
  expect(container.querySelector("img")).toBeNull();
  expect(screen.getByText(review.improvedAnswer)).toHaveAttribute("lang", "es");
  expect(screen.getByText(review.corrections[0].original).tagName).toBe("DEL");
  expect(screen.getByText(/Pronunciation and spoken fluency need listening/)).toBeInTheDocument();
});
