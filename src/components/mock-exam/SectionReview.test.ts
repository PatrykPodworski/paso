import { screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { mockSections } from "../../data/mock";
import { click, mount, now, seed, setupMockExam, state } from "../../test/mockExam";

setupMockExam();

it("reviews listening with transcripts and continues to a 25-minute writing section", () => {
  const q = mockSections[1].questions[0];

  seed({ section: 1, stage: "review", answers: { [q.id]: q.answer } });
  mount();
  expect(screen.getByRole("heading", { name: "1 out of 25." })).toBeInTheDocument();
  expect(screen.getAllByText(/^Transcript: /)).toHaveLength(25);
  expect(screen.getAllByText(/^Correct answer:/)).toHaveLength(25);
  expect(screen.getAllByText("Not answered")).toHaveLength(24);
  click("Continue to writing");

  expect(state()).toMatchObject({
    section: 2,
    index: 0,
    stage: "run",
    deadline: now + 25 * 60000,
  });

  expect(screen.getByRole("timer")).toHaveTextContent("25:00");
});

it("reviews writing against model responses, word targets and self-checks", () => {
  const [form, letter] = mockSections[2].questions;

  seed({
    section: 2,
    stage: "review",
    answers: {
      [form.id]: "Nombre y apellidos: Ana Ruiz\nCiudad: Madrid",
      [letter.id]: "Hola Ana, nos vemos",
    },
  });

  mount();

  expect(
    screen.getByRole("heading", { name: "Your practice is ready to review." }),
  ).toBeInTheDocument();

  expect(screen.getByText(/Open responses require human judgment/)).toBeInTheDocument();
  expect(screen.getAllByText(/^One possible response:/)).toHaveLength(2);
  expect(screen.getByText("Response length: 3 words. Target: 15–25.")).toBeInTheDocument();
  expect(screen.getByText("Response length: 4 words. Target: 30–40.")).toBeInTheDocument();

  for (const check of letter.checklist!) {
    expect(screen.getByText(`□ ${check}`)).toBeInTheDocument();
  }

  expect(screen.queryByText(/^Transcript: /)).not.toBeInTheDocument();
});
