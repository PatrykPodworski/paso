import { fireEvent, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { examSections, firstVariants } from "../../data/mock";
import { click, mount, now, remount, seed, setupMockExam, state } from "../../test/mockExam";
import { savedProgress, settle } from "../../test/progressApi";

// The exam as variant 1 of each task.
const sections = examSections(firstVariants);

setupMockExam();

it("stores only objective results once and requires both human scores before a verdict", async () => {
  const answers = Object.fromEntries(
    [...sections[0].questions, ...sections[1].questions].map((q) => [q.id, q.answer]),
  );

  const results = async () =>
    (await savedProgress()).mockResults.map(({ id: _, ...result }) => result);

  await seed({ section: 3, stage: "review", answers });
  await mount();

  click("See my results");
  await settle();

  expect(await results()).toEqual([
    { at: new Date(now).toISOString(), reading: 25, listening: 25 },
  ]);

  expect(screen.getAllByText("Human review")).toHaveLength(2);
  expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();

  const writing = screen.getByRole("spinbutton", { name: "Writing score /25" }),
    speaking = screen.getByRole("spinbutton", { name: "Speaking score /25" });

  fireEvent.change(writing, { target: { value: "5" } });
  expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();
  fireEvent.change(speaking, { target: { value: "5" } });
  expect(screen.getByText(/Both groups meet 30/)).toBeInTheDocument();
  fireEvent.change(speaking, { target: { value: "4.99" } });
  expect(screen.getByText(/At least one group is below/)).toBeInTheDocument();

  for (const value of ["-1", "25.01", ""]) {
    fireEvent.change(speaking, { target: { value } });
    expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();
  }

  fireEvent.change(speaking, { target: { value: "25" } });
  fireEvent.change(writing, { target: { value: "26" } });
  expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();
  click("Return to exam overview");
  expect(await state()).toMatchObject({ stage: "intro", answers: {}, scores: {} });
  expect(await results()).toHaveLength(1);
});

it("keeps the typed human scores after a reload", async () => {
  await seed({ section: 3, stage: "done" });
  await mount();

  fireEvent.change(screen.getByRole("spinbutton", { name: "Writing score /25" }), {
    target: { value: "18.5" },
  });

  fireEvent.change(screen.getByRole("spinbutton", { name: "Speaking score /25" }), {
    target: { value: "26" },
  });

  expect((await state()).scores).toEqual({ writing: "18.5", speaking: "26" });
  await remount();
  expect(screen.getByRole("spinbutton", { name: "Writing score /25" })).toHaveValue(18.5);
  expect(screen.getByRole("spinbutton", { name: "Speaking score /25" })).toHaveValue(26);
  expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();
});

it.each([
  [0, 0],
  [0, 25],
  [25, 0],
  [25, 25],
])("accepts inclusive human score limits %s and %s", async (writing, speaking) => {
  await seed({ section: 3, stage: "done" });
  await mount();

  fireEvent.change(screen.getByRole("spinbutton", { name: "Writing score /25" }), {
    target: { value: String(writing) },
  });

  fireEvent.change(screen.getByRole("spinbutton", { name: "Speaking score /25" }), {
    target: { value: String(speaking) },
  });

  expect(screen.queryByText(/A pass cannot be determined/)).not.toBeInTheDocument();
  expect(screen.getByText(/At least one group is below/)).toBeInTheDocument();
});

it("rejects negative and excessive writing scores independently", async () => {
  await seed({ section: 3, stage: "done" });
  await mount();

  fireEvent.change(screen.getByRole("spinbutton", { name: "Speaking score /25" }), {
    target: { value: "25" },
  });

  for (const value of ["-1", "25.01", ""]) {
    fireEvent.change(screen.getByRole("spinbutton", { name: "Writing score /25" }), {
      target: { value },
    });

    expect(screen.getByText(/A pass cannot be determined/)).toBeInTheDocument();
  }
});

it("shows Lucía's grades for the three talks next to the speaking score", async () => {
  await seed({
    section: 3,
    stage: "done",
    talks: {
      "mock-s1": { grade: "good", items: [] },
      "mock-s2": { grade: "perfect", items: [] },
    },
  });

  await mount();

  expect(screen.getByRole("list", { name: "Lucía's grades" })).toHaveTextContent(
    "Task 1GoodTask 2PerfectTask 3Not done",
  );

  expect(screen.getByText(/not DELE points/)).toBeInTheDocument();
});

it("shows the objective scores on the results page", async () => {
  const answers = Object.fromEntries(
    sections[0].questions.slice(0, 3).map((q) => [q.id, q.answer]),
  );

  await seed({ section: 3, stage: "done", answers });
  await mount();
  expect(screen.getByText("Reading").parentElement).toHaveTextContent("Reading3/25");
  expect(screen.getByText("Listening").parentElement).toHaveTextContent("Listening0/25");
  expect(screen.queryByRole("timer")).not.toBeInTheDocument();
});
