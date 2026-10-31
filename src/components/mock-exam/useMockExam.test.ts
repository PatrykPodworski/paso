import { act, fireEvent, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { mockSections } from "../../data/mock";
import { click, mount, now, seed, setupMockExam, state } from "../../test/mockExam";

setupMockExam();

it("starts a new 45-minute reading section and persists its deadline", async () => {
  await mount();
  click("Start exam rehearsal");
  expect(screen.getByRole("timer")).toHaveTextContent("45:00");

  expect(await state()).toMatchObject({
    section: 0,
    index: 0,
    stage: "run",
    deadline: now + 45 * 60000,
    started: new Date(now).toISOString(),
    answers: {},
  });

  expect(screen.getByRole("button", { name: "← Previous question" })).toBeDisabled();
});

it("counts correct answers only, reveals models after locking, and starts listening at 25 minutes", async () => {
  const [a, b] = mockSections[0].questions;

  await seed({ answers: { [a.id]: a.answer, [b.id]: "wrong" } });
  await mount();
  click("Finish section");
  click("Finish & review");
  expect(screen.getByRole("heading", { name: "1 out of 25." })).toBeInTheDocument();
  expect(screen.queryByRole("timer")).not.toBeInTheDocument();
  expect(screen.getByText(a.explanation)).toBeInTheDocument();
  click("Continue to listening");

  expect(await state()).toMatchObject({
    section: 1,
    index: 0,
    stage: "run",
    deadline: now + 25 * 60000,
  });

  expect(screen.getByRole("timer")).toHaveTextContent("25:00");
  expect(screen.queryByRole("button", { name: /Show transcript/ })).not.toBeInTheDocument();
});

it("automatically ends a section exactly at its deadline and dismisses confirmation", async () => {
  await seed({ deadline: now + 2000 });
  await mount();
  expect(screen.getByRole("timer")).toHaveTextContent("00:02");
  click("Finish section");
  act(() => vi.advanceTimersByTime(1000));
  expect((await state()).stage).toBe("run");
  act(() => vi.advanceTimersByTime(1000));
  expect((await state()).stage).toBe("review");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "0 out of 25." })).toBeInTheDocument();
  click("Continue to listening");
  expect(screen.getByRole("timer")).toHaveTextContent("25:00");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("shows no finish dialog in the next rehearsal after the speaking time ran out", async () => {
  await seed({ section: 3, deadline: now + 2000 });
  await mount();
  click("Finish section");
  act(() => vi.advanceTimersByTime(2000));
  // The speaking clock cuts no talk, so the dialog stays until the learner finishes.
  expect(screen.getByRole("alert")).toBeInTheDocument();
  click("Finish & review");
  click("See my results");
  click("Return to exam overview");
  click("Start exam rehearsal");
  expect(screen.getByRole("timer")).toHaveTextContent("45:00");
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

it("honours an expired deadline when returning to the page", async () => {
  await seed({ deadline: now - 1 });
  await mount();
  expect((await state()).stage).toBe("review");
});

it("starts oral preparation, persists notes, then gives a separate ten minutes to speak", async () => {
  await seed({ section: 2, stage: "review" });
  await mount();
  click("Continue to speaking preparation");

  expect(await state()).toMatchObject({
    section: 3,
    index: 0,
    stage: "prep",
    deadline: now + 600000,
  });

  expect(screen.getByRole("timer")).toHaveTextContent("10:00");

  fireEvent.change(screen.getByRole("textbox", { name: "Your preparation notes" }), {
    target: { value: "nombre, edad" },
  });

  act(() => vi.advanceTimersByTime(800));
  expect((await state()).drafts.prep).toBe("nombre, edad");
  act(() => vi.advanceTimersByTime(600000 - 800));
  expect(await state()).toMatchObject({ stage: "run", deadline: now + 1200000 });
  expect(screen.getByRole("timer")).toHaveTextContent("10:00");
  expect(screen.getByRole("button", { name: "Start the talk" })).toBeEnabled();
});

it("lets a speaking talk run past the section's clock instead of cutting it", async () => {
  await seed({ section: 3, stage: "run", deadline: now + 1000 });
  await mount();
  act(() => vi.advanceTimersByTime(3000));
  expect((await state()).stage).toBe("run");
  expect(screen.getByRole("timer")).toHaveTextContent("00:00");
  click("Finish section");
  click("Finish & review");
  expect((await state()).stage).toBe("review");
});

it("keeps the results page after the last deadline has passed", async () => {
  await seed({ section: 3, stage: "done", deadline: now - 1 });
  await mount();
  act(() => vi.advanceTimersByTime(3000));
  expect((await state()).stage).toBe("done");
  expect(screen.getByRole("heading", { name: "You’ve met the exam." })).toBeInTheDocument();
});
