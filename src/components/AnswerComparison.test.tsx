import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { AnswerComparison } from "./AnswerComparison";
import { readAnswers } from "../test/answerComparison";

const marks = (container: HTMLElement) => ({
  wrong: [...container.querySelectorAll("del")].map((mark) => mark.textContent),
  missing: container.querySelectorAll("svg").length,
  changed: [...container.querySelectorAll("ins")].map((mark) => mark.textContent),
});

it("marks where a letter is missing and which letter it is", () => {
  const { container } = render(
    <AnswerComparison answer="Mi madre tabaja el lunes." correct="Mi madre trabaja el lunes." />,
  );

  expect(marks(container)).toEqual({ wrong: [], missing: 1, changed: ["r"] });

  expect(screen.getByText(/^Differences:/)).toHaveTextContent(
    "Differences: “tabaja” should be “trabaja”.",
  );
});

it("marks a letter written without its accent", () => {
  const { container } = render(<AnswerComparison answer="esta" correct="está" />);

  expect(marks(container)).toEqual({ wrong: ["a"], missing: 0, changed: ["á"] });
});

it.each([
  ["Mi madre el lunes", "Mi madre trabaja el lunes", "Differences: “trabaja” is missing."],
  ["Mi madre muy trabaja", "Mi madre trabaja", "Differences: “muy” is extra."],
  [
    "El esta en Mexico",
    "Él está en México",
    "Differences: “El esta” should be “Él está”; “Mexico” should be “México”.",
  ],
])("tells a screen reader how %j differs from %j", (answer, correct, differences) => {
  render(<AnswerComparison answer={answer} correct={correct} />);

  expect(screen.getByText(/^Differences:/)).toHaveTextContent(differences);
});

it("marks nothing in an answer that differs only by case and punctuation", () => {
  const { container } = render(<AnswerComparison answer="hola" correct="¡Hola!" />);

  expect(marks(container)).toEqual({ wrong: [], missing: 0, changed: [] });
  expect(screen.queryByText(/^Differences:/)).not.toBeInTheDocument();
});

it("shows an empty answer as not answered, with nothing marked", () => {
  const { container } = render(<AnswerComparison answer="" correct="Con su hermana." />);

  expect(readAnswers(container)).toEqual(["Not answered", "Con su hermana."]);
  expect(marks(container)).toEqual({ wrong: [], missing: 0, changed: [] });
});
