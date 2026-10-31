import { render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import { allQuestions } from "../../data/curriculum";
import type { Attempt } from "../../data/types";
import { RecentAnswers } from "./RecentAnswers";

const [first, second, third] = allQuestions;

const attempt = (patch: Partial<Attempt>): Attempt => ({
  id: crypto.randomUUID(),
  questionId: first.id,
  skill: first.skill,
  answer: "",
  correct: true,
  at: "2026-09-09T08:00:00.000Z",
  ...patch,
});

const rows = () =>
  within(screen.getByRole("region", { name: "Recent answers" })).getAllByRole("listitem");

it("lists each answer with its question, the answer, the result and the day, in order", () => {
  render(
    <RecentAnswers
      recent={[
        attempt({ questionId: first.id, answer: "hola", correct: true }),
        attempt({ questionId: second.id, answer: "adiós", correct: false }),
        attempt({ questionId: third.id, answer: "Me llamo Ana", correct: null }),
      ]}
    />,
  );

  expect(rows().map((row) => row.textContent)).toEqual(
    [
      [first.prompt, "hola", "Correct"],
      [second.prompt, "adiós", "Wrong"],
      [third.prompt, "Me llamo Ana", "Not graded"],
    ].map((parts) => parts.join("") + new Date("2026-09-09T08:00:00.000Z").toLocaleDateString()),
  );

  expect(within(rows()[0]).getByText(/\d/, { selector: "time" })).toHaveAttribute(
    "datetime",
    "2026-09-09T08:00:00.000Z",
  );
});

it("leaves out answers to questions no longer in the course and an empty answer", () => {
  render(
    <RecentAnswers
      recent={[attempt({ questionId: "deleted-question", answer: "x" }), attempt({ answer: "" })]}
    />,
  );

  expect(rows()).toHaveLength(1);
  expect(rows()[0]).toHaveTextContent(`${first.prompt}Correct`);
});

it.each([
  ["no answers", []],
  ["only answers to removed questions", [attempt({ questionId: "deleted-question" })]],
])("shows nothing with %s", (_, recent) => {
  const { container } = render(<RecentAnswers recent={recent} />);

  expect(container).toBeEmptyDOMElement();
});
