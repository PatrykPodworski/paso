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
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "0 out of 25." })).toBeInTheDocument();
  click("Continue to listening");
  expect(screen.getByRole("timer")).toHaveTextContent("25:00");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("dismisses a confirmation left open when the speaking time runs out", async () => {
  await seed({ section: 3, deadline: now + 2000 });
  await mount();
  click("Finish section");
  act(() => vi.advanceTimersByTime(2000));
  click("See my results");
  click("Return to exam overview");
  click("Start exam rehearsal");
  expect(screen.getByRole("timer")).toHaveTextContent("45:00");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
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
  expect(screen.getByRole("button", { name: "Save answer" })).toBeDisabled();
});

it("keeps the results page after the last deadline has passed", async () => {
  await seed({ section: 3, stage: "done", deadline: now - 1 });
  await mount();
  act(() => vi.advanceTimersByTime(3000));
  expect((await state()).stage).toBe("done");
  expect(screen.getByRole("heading", { name: "You’ve met the exam." })).toBeInTheDocument();
});

it("keeps unsaved writing as the answers when the section deadline passes", async () => {
  await seed({
    section: 2,
    deadline: now + 1000,
    answers: { "mock-w2": "Hola." },
    drafts: { "mock-w1": JSON.stringify({ Ciudad: "Varsovia" }), "mock-w2": "Hola, Ana." },
  });

  await mount();
  act(() => vi.advanceTimersByTime(1000));

  expect(await state()).toMatchObject({
    stage: "review",
    answers: {
      "mock-w1":
        "Nombre y apellidos: \nNacionalidad: \nCiudad: Varsovia\nProfesión: \nLenguas: \nAficiones: ",
      "mock-w2": "Hola, Ana.",
    },
  });

  expect(screen.getByText("Hola, Ana.")).toBeInTheDocument();
});

it("counts unsaved writing as answered and keeps it on Finish section", async () => {
  await seed({
    section: 2,
    drafts: { "mock-w1": JSON.stringify({ Ciudad: "Varsovia" }), "mock-w2": "Hola, Ana." },
  });

  await mount();
  click("Finish section");
  expect(screen.getByRole("dialog")).toHaveTextContent("0 unanswered.");
  click("Finish & review");

  expect(await state()).toMatchObject({
    stage: "review",
    answers: {
      "mock-w1":
        "Nombre y apellidos: \nNacionalidad: \nCiudad: Varsovia\nProfesión: \nLenguas: \nAficiones: ",
      "mock-w2": "Hola, Ana.",
    },
  });
});
