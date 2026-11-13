import { act, fireEvent, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { buildExam, seenFrom } from "../../data/examBuilder";
import { examSections, firstVariants, mockExam } from "../../data/mock";
import { click, mount, now, seed, setupMockExam, state } from "../../test/mockExam";
import { savedProgress, sendProgress } from "../../test/progressApi";

// The exam as variant 1 of each task.
const sections = examSections(firstVariants);

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

it("builds the new exam from a random seed and saves the seed with the variants", async () => {
  vi.spyOn(crypto, "getRandomValues").mockImplementation((array) => {
    (array as Uint32Array).set([3_000_000_000]);

    return array;
  });

  const seen = { "r1-v1": "2026-09-01T10:00:00.000Z", "w2-v1": "2026-09-02T10:00:00.000Z" };

  await seed({ stage: "intro" }, seen);
  await mount();
  click("Start exam rehearsal");

  expect(await state()).toMatchObject({
    seed: 3_000_000_000,
    variants: buildExam({ seed: 3_000_000_000, seen: seenFrom(seen) }),
  });
});

// The variant ids the exam takes for one section's tasks.
const sectionVariants = (variants: Record<string, string>, section: number) =>
  mockExam[section].tasks.map((t) => variants[t.id]);

it("marks a section's variants seen when the section starts, and no others", async () => {
  const at = new Date(now).toISOString();

  await mount();
  click("Start exam rehearsal");

  const { variants } = await state();

  expect((await savedProgress()).seenVariants).toEqual(
    Object.fromEntries(sectionVariants(variants, 0).map((id) => [id, at])),
  );
});

it.each([
  [0, "Continue to listening"],
  [2, "Continue to speaking preparation"],
])("marks the next section's variants seen after section %i", async (section, button) => {
  await seed({ section, stage: "review" });
  await mount();
  click(button);

  const { variants } = await state();

  expect(Object.keys((await savedProgress()).seenVariants).sort()).toEqual(
    sectionVariants(variants, section + 1).sort(),
  );
});

it("counts correct answers only, reveals models after locking, and starts listening at 25 minutes", async () => {
  const [a, b] = sections[0].questions;

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

it("shows no finish dialog in the next rehearsal after the speaking time ran out", async () => {
  await seed({ section: 3, deadline: now + 2000 });
  await mount();
  click("Finish section");
  act(() => vi.advanceTimersByTime(2000));
  // The speaking clock cuts no talk, so the dialog stays until the learner finishes.
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  click("Finish & review");
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

it("keeps unsaved writing as the answers when the section deadline passes", async () => {
  await seed({
    section: 2,
    deadline: now + 1000,
    answers: { "mock-w2": "Hola." },
    drafts: { "mock-w1": JSON.stringify({ Ciudad: "Varsovia" }), "mock-w2": "Hola, Bruno." },
  });

  await mount();
  act(() => vi.advanceTimersByTime(1000));

  expect(await state()).toMatchObject({
    stage: "review",
    answers: {
      "mock-w1":
        "Nombre y apellidos: \nNacionalidad: \nCiudad: Varsovia\nProfesión: \nLenguas: \nAficiones: ",
      "mock-w2": "Hola, Bruno.",
    },
  });

  expect(screen.getByText("Hola, Bruno.")).toBeInTheDocument();
});

it("counts unsaved writing as answered and keeps it on Finish section", async () => {
  await seed({
    section: 2,
    drafts: { "mock-w1": JSON.stringify({ Ciudad: "Varsovia" }), "mock-w2": "Hola, Bruno." },
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
      "mock-w2": "Hola, Bruno.",
    },
  });
});

it("starts speaking alone with its ten minutes of preparation and marks only its variants seen", async () => {
  const at = new Date(now).toISOString();

  await mount();
  click("Practise speaking alone");

  expect(await state()).toMatchObject({
    sections: [3],
    section: 3,
    index: 0,
    stage: "prep",
    deadline: now + 600000,
  });

  expect(screen.getByRole("timer")).toHaveTextContent("10:00");

  const { variants } = await state();

  expect((await savedProgress()).seenVariants).toEqual(
    Object.fromEntries(sectionVariants(variants, 3).map((id) => [id, at])),
  );
});

it("ends a run of one section after its review and saves the result of that section only", async () => {
  await mount();
  click("Practise listening alone");
  expect(screen.getByRole("timer")).toHaveTextContent("25:00");
  click("Finish section");
  click("Finish & review");
  click("See my results");

  expect((await state()).stage).toBe("done");

  expect((await savedProgress()).mockResults.map(({ id: _, ...result }) => result)).toEqual([
    {
      at: new Date(now).toISOString(),
      sections: [1],
      listening: 0,
      recorded: true,
      responses: true,
    },
  ]);
});

it("resumes a run of one section in that section, with only that section in the top bar", async () => {
  await seed({ sections: [2], section: 2, stage: "run", deadline: now + 60000 });
  await mount();

  expect(
    within(screen.getByRole("list", { name: "Exam sections" }))
      .getAllByRole("listitem")
      .map((step) => step.textContent),
  ).toEqual(["1Writing"]);

  expect(screen.getByRole("timer")).toHaveTextContent("01:00");
});

it("starts each run under a new id and saves its changes to that run", async () => {
  await seed({ id: "run-old", stage: "done" });
  await mount();
  click("Return to exam overview");

  const overview = (await state()).id;

  click("Start exam rehearsal");

  const { id } = await state();

  expect(new Set(["run-old", overview, id]).size).toBe(3);
  click("Skip for now →");
  expect(await state()).toMatchObject({ id, stage: "run", index: 1 });
});

it("leaves a run another tab started alone when this page changes its earlier run", async () => {
  await seed({ id: "run-old", section: 2, stage: "review" });
  await mount();

  const newer = { section: 0, index: 0, stage: "run", id: "run-new" };

  expect(
    await sendProgress({ action: "mockRun", runId: "run-old", run: newer, replace: true }),
  ).toBe(200);

  click("Continue to speaking preparation");

  expect(await state()).toMatchObject(newer);
});
