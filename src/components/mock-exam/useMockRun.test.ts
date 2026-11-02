import { act, fireEvent, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { examSections } from "../../data/mock";
import { click, mount, remount, seed, setupMockExam, state } from "../../test/mockExam";

setupMockExam();

it("resumes the run at the same question after a reload", async () => {
  await mount();
  click("Start exam rehearsal");

  // The variants the exam builder chose for this run.
  const [first, second] = examSections((await state()).variants)[0].questions;

  click(first.answer);
  await remount();

  expect(screen.getByRole("heading", { name: second.prompt })).toBeInTheDocument();
  expect(screen.getByRole("timer")).toHaveTextContent("45:00");
  click("← Previous question");

  expect(screen.getByRole("button", { name: first.answer })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

it("sends a draft still waiting when the learner leaves the exam page", async () => {
  await seed({ section: 3, stage: "prep" });
  await mount();

  fireEvent.change(screen.getByRole("textbox", { name: "Your preparation notes" }), {
    target: { value: "mis notas" },
  });

  await remount();
  act(() => vi.advanceTimersByTime(0));
  expect(screen.getByRole("textbox", { name: "Your preparation notes" })).toHaveValue("mis notas");
  expect((await state()).drafts).toEqual({ prep: "mis notas" });
});
