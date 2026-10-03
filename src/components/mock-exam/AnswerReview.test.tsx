import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockSections } from "../../data/mock";
import { AnswerReview } from "./AnswerReview";

describe("reviewed answer", () => {
  const [reading] = mockSections[0].questions;
  const [form] = mockSections[2].questions;
  const status = (container: HTMLElement) => container.querySelector(".review-status");

  it.each([
    ["good", reading.answer],
    ["bad", "wrong"],
    ["bad", undefined],
  ])("marks an objective answer %s: %s", (expected, answer) => {
    const { container } = render(
      <AnswerReview q={reading} number={1} answer={answer} section={0} />,
    );

    expect(status(container)).toHaveClass(expected);
    expect(screen.getByText(/^Correct answer:/)).toBeInTheDocument();
  });

  it("shows an unanswered question as not answered", () => {
    render(<AnswerReview q={reading} number={3} answer={undefined} section={0} />);
    expect(screen.getByText("Not answered")).toBeInTheDocument();
    expect(screen.getByText(`3. ${reading.prompt}`)).toBeInTheDocument();
  });

  it("leaves open responses ungraded even when they match the model", () => {
    const { container } = render(
      <AnswerReview q={form} number={1} answer={form.answer} section={2} />,
    );

    expect(status(container)).toHaveClass("neutral");
    expect(screen.getByText(/^One possible response:/)).toBeInTheDocument();
  });
});
