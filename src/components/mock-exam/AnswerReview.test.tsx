import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { mockSections } from "../../data/mock";
import { AnswerReview } from "./AnswerReview";

describe("reviewed answer", () => {
  const [reading] = mockSections[0].questions;
  const [form] = mockSections[2].questions;

  it.each([
    ["Correct", reading.answer],
    ["Incorrect", "wrong"],
    ["Incorrect", undefined],
  ])("marks an objective answer %s: %s", (expected, answer) => {
    render(<AnswerReview q={reading} number={1} answer={answer} section={0} />);

    expect(screen.getByRole("img", { name: expected })).toBeInTheDocument();
    expect(screen.getByText(/^Correct answer:/)).toBeInTheDocument();
  });

  it("shows an unanswered question as not answered", () => {
    render(<AnswerReview q={reading} number={3} answer={undefined} section={0} />);
    expect(screen.getByText("Not answered")).toBeInTheDocument();
    expect(screen.getByText(`3. ${reading.prompt}`)).toBeInTheDocument();
  });

  it("leaves open responses ungraded even when they match the model", () => {
    render(<AnswerReview q={form} number={1} answer={form.answer} section={2} />);

    expect(screen.getByRole("img", { name: "Not graded" })).toBeInTheDocument();
    expect(screen.getByText(/^One possible response:/)).toBeInTheDocument();
  });
});
