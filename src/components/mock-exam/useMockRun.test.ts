import { act, fireEvent, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { mockSections } from "../../data/mock";
import { click, mount, remount, seed, setupMockExam, state } from "../../test/mockExam";

setupMockExam();

it("resumes the run at the same question after a reload", async () => {
  const [first, second] = mockSections[0].questions;

  await mount();
  click("Start exam rehearsal");
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
