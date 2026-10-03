import { act, fireEvent, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { mockSections } from "../../data/mock";
import { click, mount, now, seed, setupMockExam, state } from "../../test/mockExam";

setupMockExam();

it("starts a new 45-minute reading section and persists its deadline", () => {
  mount();
  click("Start exam rehearsal");
  expect(screen.getByRole("timer")).toHaveTextContent("45:00");

  expect(state()).toMatchObject({
    section: 0,
    index: 0,
    stage: "run",
    deadline: now + 45 * 60000,
    started: new Date(now).toISOString(),
    answers: {},
  });

  expect(screen.getByRole("button", { name: "← Previous question" })).toBeDisabled();
});

it("counts correct answers only, reveals models after locking, and starts listening at 25 minutes", () => {
  const [a, b] = mockSections[0].questions;

  seed({ answers: { [a.id]: a.answer, [b.id]: "wrong" } });
  mount();
  click("Finish section");
  click("Finish & review");
  expect(screen.getByRole("heading", { name: "1 out of 25." })).toBeInTheDocument();
  expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  expect(screen.getByText(a.explanation)).toBeInTheDocument();
  click("Continue to listening");

  expect(state()).toMatchObject({
    section: 1,
    index: 0,
    stage: "run",
    deadline: now + 25 * 60000,
  });

  expect(screen.getByRole("timer")).toHaveTextContent("25:00");
  expect(screen.queryByRole("button", { name: /Show transcript/ })).not.toBeInTheDocument();
});

it("automatically ends a section exactly at its deadline and dismisses confirmation", () => {
  seed({ deadline: now + 2000 });
  mount();
  expect(screen.getByRole("timer")).toHaveTextContent("00:02");
  click("Finish section");
  act(() => vi.advanceTimersByTime(1000));
  expect(state().stage).toBe("run");
  act(() => vi.advanceTimersByTime(1000));
  expect(state().stage).toBe("review");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "0 out of 25." })).toBeInTheDocument();
});

it("honours an expired deadline when returning to the page", () => {
  seed({ deadline: now - 1 });
  mount();
  expect(state().stage).toBe("review");
});

it("starts oral preparation, persists notes, then gives a separate ten minutes to speak", () => {
  seed({ section: 2, stage: "review" });
  mount();
  click("Continue to speaking preparation");
  expect(state()).toMatchObject({ section: 3, index: 0, stage: "prep", deadline: now + 600000 });
  expect(screen.getByRole("timer")).toHaveTextContent("10:00");

  fireEvent.change(screen.getByRole("textbox", { name: "Your preparation notes" }), {
    target: { value: "nombre, edad" },
  });

  expect(state().drafts.prep).toBe("nombre, edad");
  act(() => vi.advanceTimersByTime(600000));
  expect(state()).toMatchObject({ stage: "run", deadline: now + 1200000 });
  expect(screen.getByRole("timer")).toHaveTextContent("10:00");
  expect(screen.getByRole("button", { name: "Save answer" })).toBeDisabled();
});

it("keeps the results page after the last deadline has passed", () => {
  seed({ section: 3, stage: "done", deadline: now - 1 });
  mount();
  act(() => vi.advanceTimersByTime(3000));
  expect(state().stage).toBe("done");
  expect(screen.getByRole("heading", { name: "You’ve met the exam." })).toBeInTheDocument();
});
