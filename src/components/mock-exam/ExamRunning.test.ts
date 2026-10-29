import { act, fireEvent, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { mockSections } from "../../data/mock";
import { click, mount, now, seed, setupMockExam, state } from "../../test/mockExam";

setupMockExam();

it("saves an answer, permits previous/skip navigation and hides corrections until review", async () => {
  seed();
  await mount();
  const first = mockSections[0].questions[0];

  click(first.answer);
  expect((await state()).answers[first.id]).toBe(first.answer);
  expect((await state()).index).toBe(1);
  expect(screen.queryByText(first.explanation)).not.toBeInTheDocument();
  click("← Previous question");

  expect(screen.getByRole("button", { name: first.answer })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  click("Skip for now →");
  expect((await state()).index).toBe(1);
  click("Finish section");
  expect(screen.getByRole("alert")).toHaveTextContent("24 unanswered");
  click("Keep working");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect((await state()).stage).toBe("run");
});

it.each([0, 1])(
  "last-question save or skip opens confirmation without going out of bounds: %s",
  async (mode) => {
    const questions = mockSections[0].questions;

    seed({ index: questions.length - 1 });
    await mount();

    if (mode === 0) {
      click(questions.at(-1)!.answer);
    } else {
      click("Skip for now →");
    }

    expect((await state()).index).toBe(24);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  },
);

it("saves form drafts as JSON and submits labelled content without model grading", async () => {
  seed({ section: 2, deadline: now + 25 * 60000 });
  await mount();
  const q = mockSections[2].questions[0];

  for (const f of q.fields!) {
    fireEvent.change(screen.getByRole("textbox", { name: f.label }), {
      target: { value: f.example },
    });
  }

  act(() => vi.advanceTimersByTime(800));

  expect(JSON.parse((await state()).drafts[q.id])).toEqual(
    Object.fromEntries(q.fields!.map((f) => [f.label, f.example])),
  );

  click("Save answer");
  expect((await state()).answers[q.id]).toContain("Nacionalidad:");
  expect((await state()).index).toBe(1);
});

it("keeps a cleared writing draft empty when revisiting an already submitted response", async () => {
  const q = mockSections[2].questions[1];

  seed({ section: 2, index: 1, answers: { [q.id]: "Old answer" }, drafts: { [q.id]: "" } });
  await mount();
  expect(screen.getByRole("textbox")).toHaveValue("");
});

it("shows the task and position within the section", async () => {
  const q = mockSections[0].questions[3];

  seed({ index: 3 });
  await mount();
  expect(screen.getByText("4 / 25")).toBeInTheDocument();
  expect(screen.getAllByText(q.task!).length).toBeGreaterThan(0);
  click("← Previous question");
  expect(screen.getByText("3 / 25")).toBeInTheDocument();
});
