import { act, fireEvent, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { mockSections } from "../../data/mock";
import { click, mount, remount, run, seed, setupMockExam, state } from "../../test/mockExam";

setupMockExam();

it.each([
  "{bad",
  "null",
  JSON.stringify(run({ section: -1 })),
  JSON.stringify(run({ section: 4 })),
  JSON.stringify(run({ section: 0.5 })),
  JSON.stringify(run({ stage: "unknown" })),
  JSON.stringify(run({ answers: null })),
])("starts from the overview when the run kept in the browser is invalid: %s", async (raw) => {
  localStorage.setItem("paso-mock-v1", raw);
  await mount();
  expect(screen.getByRole("button", { name: "Start exam rehearsal" })).toBeInTheDocument();
});

it.each([-1, 25, 1.5])(
  "starts from the overview when the kept question index is %s",
  async (index) => {
    seed({ index });
    await mount();
    expect(screen.getByRole("button", { name: "Start exam rehearsal" })).toBeInTheDocument();
  },
);

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
  seed({ section: 3, stage: "prep" });
  await mount();

  fireEvent.change(screen.getByRole("textbox", { name: "Your preparation notes" }), {
    target: { value: "mis notas" },
  });

  await remount();
  act(() => vi.advanceTimersByTime(0));
  expect(screen.getByRole("textbox", { name: "Your preparation notes" })).toHaveValue("mis notas");
  expect((await state()).drafts).toEqual({ prep: "mis notas" });
});
