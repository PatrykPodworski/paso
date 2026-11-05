import { act, fireEvent, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { examSections, firstVariants } from "../../data/mock";
import { shownOptions } from "../../data/optionOrder";
import { click, mount, now, remount, seed, setupMockExam, state } from "../../test/mockExam";

// The exam as variant 1 of each task.
const sections = examSections(firstVariants);

setupMockExam();

// The option texts in the order the card shows them; the number badge is hidden from the name.
const shown = () =>
  [...document.querySelectorAll(".answer-option")].map((b) => b.children[1].textContent);

it("saves an answer, permits previous/skip navigation and hides corrections until review", async () => {
  await seed();
  await mount();
  const first = sections[0].questions[0];

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
  expect(screen.getByRole("dialog")).toHaveTextContent("24 unanswered");
  click("Keep working");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect((await state()).stage).toBe("run");
});

it.each([0, 1])(
  "last-question save or skip opens confirmation without going out of bounds: %s",
  async (mode) => {
    const questions = sections[0].questions;

    await seed({ index: questions.length - 1 });
    await mount();

    if (mode === 0) {
      click(questions.at(-1)!.answer);
    } else {
      click("Skip for now →");
    }

    expect((await state()).index).toBe(24);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  },
);

it("saves form drafts as JSON and submits labelled content without model grading", async () => {
  await seed({ section: 2, deadline: now + 25 * 60000 });
  await mount();
  const q = sections[2].questions[0];

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
  const q = sections[2].questions[1];

  await seed({ section: 2, index: 1, answers: { [q.id]: "Old answer" }, drafts: { [q.id]: "" } });
  await mount();
  expect(screen.getByRole("textbox")).toHaveValue("");
});

it("shows the task and position within the section", async () => {
  const q = sections[0].questions[3];

  await seed({ index: 3 });
  await mount();
  expect(screen.getByText("4 / 25")).toBeInTheDocument();
  expect(screen.getAllByText(q.task!).length).toBeGreaterThan(0);
  click("← Previous question");
  expect(screen.getByText("3 / 25")).toBeInTheDocument();
});

it("shows listening Task 3's shared list in the run's order on every question and after a resume", async () => {
  const listening = sections[1].questions;
  const index = listening.findIndex((q) => q.id === "mock-l3-0");
  const order = shownOptions(listening[index].options!, 7);

  expect(order).not.toEqual(listening[index].options);
  await seed({ section: 1, index, seed: 7, variants: firstVariants });
  await mount();
  expect(shown()).toEqual(order);
  click(listening[index].answer);
  expect((await state()).answers[listening[index].id]).toBe(listening[index].answer);
  expect(shown()).toEqual(order);
  await remount();
  expect(shown()).toEqual(order);
});
