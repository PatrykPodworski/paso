import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { examSections, firstVariants } from "../../data/mock";
import { click, mount, now, remount, seed, setupMockExam, state } from "../../test/mockExam";
import { savedProgress, seedProgress, settle } from "../../test/progressApi";
import type { LiveItem, LiveScore } from "../../data/types";

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
    {
      at: new Date(now).toISOString(),
      sections: [0, 1, 2, 3],
      reading: 25,
      listening: 25,
      recorded: true,
      responses: true,
    },
  ]);

  const saved = await savedProgress();

  expect(saved.mockRun?.resultId).toBe(saved.mockResults[0].id);

  expect(screen.getByText("Writing").parentElement).toHaveTextContent("WritingNot scored");
  expect(screen.getByText("Speaking").parentElement).toHaveTextContent("SpeakingNot scored");
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
    "Task 1GoodTask 2PerfectTask 3Not scored",
  );
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

it("saves a speaking run without scores and shows its talks without the passing groups", async () => {
  await seed({
    sections: [3],
    section: 3,
    stage: "review",
    talks: { "mock-s1": { grade: "good", items: [] } },
  });

  await mount();
  click("See my results");
  await settle();

  expect((await savedProgress()).mockResults.map(({ id: _, ...result }) => result)).toEqual([
    { at: new Date(now).toISOString(), sections: [3], recorded: true, responses: true },
  ]);

  expect(screen.getByRole("list", { name: "Lucía's grades" })).toHaveTextContent(
    "Task 1GoodTask 2Not scoredTask 3Not scored",
  );

  expect(screen.queryByText("Reading")).not.toBeInTheDocument();
  expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  expect(screen.queryByText(/A pass cannot be determined/)).not.toBeInTheDocument();
});

// A talk with every point at one level.
const talkAt = (level: LiveItem, points = 2): LiveScore => ({
  grade: level === "correct" ? "perfect" : level === "missing" ? "bad" : "good",
  items: Array.from({ length: points }, (_, i) => ({ id: `p${i}`, label: `Point ${i}`, level })),
});

const allCorrect = Object.fromEntries(
  [...sections[0].questions, ...sections[1].questions].map((q) => [q.id, q.answer]),
);

const tile = (name: string) => screen.getByText(name, { selector: "span" }).parentElement;

it("scores writing and speaking from the AI and shows the passing groups and the total", async () => {
  await seed({
    section: 3,
    stage: "done",
    answers: allCorrect,
    marks: { "mock-w1": 2, "mock-w2": 2 },
    talks: {
      "mock-s1": talkAt("correct"),
      "mock-s2": talkAt("correct"),
      "mock-s3": talkAt("understandable"),
    },
  });

  await mount();
  expect(tile("Writing")).toHaveTextContent("Writing16.67/25");
  expect(tile("Speaking")).toHaveTextContent("Speaking20.83/25");
  expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  expect(screen.getByText(/Reading \+ writing:/)).toHaveTextContent("41.67/50");
  expect(screen.getByText(/Listening \+ speaking:/)).toHaveTextContent("45.83/50");
  expect(screen.getByText(/^Total:/)).toHaveTextContent("Total: 87.50/100");
  expect(screen.getByText(/Both groups meet 30\/50/)).toBeInTheDocument();
});

it("scores speaking from the talks Lucía scored and keeps a manual input for unscored writing", async () => {
  await seed({
    section: 3,
    stage: "done",
    answers: allCorrect,
    talks: { "mock-s1": talkAt("correct") },
  });

  await mount();
  expect(tile("Speaking")).toHaveTextContent("Speaking8.33/25From 1 of 3 talks");
  expect(tile("Writing")).toHaveTextContent("WritingNot scored");

  expect(screen.queryByRole("spinbutton", { name: "Speaking score /25" })).not.toBeInTheDocument();

  fireEvent.change(screen.getByRole("spinbutton", { name: "Writing score /25" }), {
    target: { value: "10" },
  });

  expect(screen.getByText(/Listening \+ speaking:/)).toHaveTextContent("33.33/50");
  expect(screen.getByText(/^Total:/)).toHaveTextContent("Total: 68.33/100");
});

it("ignores a typed score once the AI has scored the section", async () => {
  await seed({
    section: 3,
    stage: "done",
    answers: allCorrect,
    scores: { writing: "0", speaking: "0" },
    marks: { "mock-w1": 3, "mock-w2": 3 },
    talks: { "mock-s1": talkAt("missing"), "mock-s2": talkAt("missing") },
  });

  await mount();
  expect(screen.getByText(/Reading \+ writing:/)).toHaveTextContent("50.00/50");
  expect(screen.getByText(/Listening \+ speaking:/)).toHaveTextContent("25.00/50");
  expect(screen.getByText(/At least one group is below/)).toBeInTheDocument();
});

it("stores a genuine zero and a partial speaking score, and shows them in the history", async () => {
  await seed({
    section: 3,
    stage: "review",
    answers: allCorrect,
    marks: Object.fromEntries(sections[2].questions.map((q) => [q.id, 0])),
    talks: Object.fromEntries(sections[3].questions.map((q) => [q.id, talkAt("missing")])),
  });

  await mount();
  click("See my results");
  await settle();

  expect((await savedProgress()).mockResults.map(({ id: _, ...result }) => result)).toEqual([
    {
      at: new Date(now).toISOString(),
      sections: [0, 1, 2, 3],
      reading: 25,
      listening: 25,
      writing: 0,
      speaking: 0,
      recorded: true,
      responses: true,
    },
  ]);

  click("Return to exam overview");

  expect(screen.getByText("Writing 0/25")).toBeInTheDocument();
  expect(screen.getByText("Speaking 0/25")).toBeInTheDocument();
  expect(screen.queryByText(/ungraded|not recorded/)).not.toBeInTheDocument();
});

it("records a full exam whose writing is still ungraded and shows that in the history", async () => {
  await seed({
    section: 3,
    stage: "review",
    answers: allCorrect,
    talks: { [sections[3].questions[0].id]: talkAt("correct") },
  });

  await mount();
  click("See my results");
  await settle();

  expect((await savedProgress()).mockResults.map(({ id: _, ...result }) => result)).toEqual([
    {
      at: new Date(now).toISOString(),
      sections: [0, 1, 2, 3],
      reading: 25,
      listening: 25,
      speaking: 8.33,
      recorded: true,
      responses: true,
    },
  ]);

  click("Return to exam overview");

  expect(screen.getByText("Speaking 8.33/25")).toBeInTheDocument();
  expect(screen.getByText("Writing ungraded")).toBeInTheDocument();
  expect(screen.queryByText("Speaking ungraded")).not.toBeInTheDocument();
  expect(screen.queryByText("Productive skills ungraded")).not.toBeInTheDocument();
});

it("leaves a finished run from before result ids alone and labels its scores as not recorded", async () => {
  await seedProgress({
    mockResults: [
      {
        at: "2026-01-05T10:00:00.000Z",
        sections: [0, 1, 2, 3],
        reading: 10,
        listening: 12,
      },
    ],
    mockRun: { stage: "done", section: 3, index: 0 },
  });

  await mount();
  await settle();

  const saved = await savedProgress();

  expect(saved.mockResults).toHaveLength(1);
  expect(saved.mockResults[0].writing).toBeUndefined();
  expect(saved.mockResults[0].speaking).toBeUndefined();
  expect(saved.mockResults[0].recorded).toBeUndefined();
  expect(saved.mockRun?.resultId).toBeUndefined();

  click("Return to exam overview");

  expect(screen.getByText("Writing not recorded")).toBeInTheDocument();
  expect(screen.getByText("Speaking not recorded")).toBeInTheDocument();
  expect(screen.queryByText(/ungraded/)).not.toBeInTheDocument();
  expect(screen.getByText("Reading 10/25")).toBeInTheDocument();
});

describe("writing scored from the results page", () => {
  const [form, letter] = sections[2].questions;

  const review = (band: number) => ({
    wordCount: 20,
    coverage: [],
    corrections: [],
    revised: "",
    mark: { band, reason: "A1 level." },
  });

  // Answers the writing review; progress requests still reach the test's progress API.
  const reviewWriting = (reply: (questionId: string) => Promise<Response>) => {
    const progress = globalThis.fetch;

    const api = vi.fn((_: string, init: RequestInit) =>
      reply(JSON.parse(String(init.body)).questionId),
    );

    vi.stubGlobal("fetch", (url: string, init: RequestInit) =>
      url === "/api/review-writing" ? api(url, init) : progress(url, init),
    );

    return api;
  };

  const seedDone = (patch: Record<string, unknown> = {}) => {
    vi.useRealTimers();
    localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "olé" }));

    return seed({
      section: 3,
      stage: "done",
      answers: { [form.id]: "Nombre: Ana", [letter.id]: "Hola Ana" },
      ...patch,
    });
  };

  it("adds a writing score that arrives on the results page to the saved rehearsal", async () => {
    vi.useRealTimers();
    localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "olé" }));

    await seed({
      section: 3,
      stage: "review",
      answers: { ...allCorrect, [form.id]: "Nombre: Ana", [letter.id]: "Hola Ana" },
      talks: Object.fromEntries(sections[3].questions.map((q) => [q.id, talkAt("correct")])),
    });

    const api = reviewWriting(async () => Response.json(review(0)));

    await mount();
    click("See my results");
    await settle();

    const before = await savedProgress();

    expect(before.mockResults).toHaveLength(1);
    expect(before.mockResults[0]).toMatchObject({ speaking: 25, recorded: true, reading: 25 });
    expect(before.mockResults[0].writing).toBeUndefined();
    expect(before.mockRun?.resultId).toBe(before.mockResults[0].id);

    click("Score my writing");
    await waitFor(() => expect(tile("Writing")).toHaveTextContent("Writing0/25"));
    await settle();

    const after = await savedProgress();

    expect(after.mockResults).toHaveLength(1);
    expect(after.mockResults[0].id).toBe(before.mockResults[0].id);
    expect(after.mockResults[0].writing).toBe(0);
    expect(after.mockResults[0].speaking).toBe(25);
    expect(after.mockResults[0].at).toBe(before.mockResults[0].at);

    click("Return to exam overview");
    expect(screen.getByText("Writing 0/25")).toBeInTheDocument();
    expect(screen.getByText("Speaking 25/25")).toBeInTheDocument();
    expect(screen.queryByText("Writing ungraded")).not.toBeInTheDocument();
    expect(api).toHaveBeenCalled();

    // The band that arrived on the results page is in the stored responses too.
    click("View responses");
    const dialog = screen.getByRole("dialog", { name: "Your responses" });

    expect(await within(dialog).findByText("Hola Ana")).toBeInTheDocument();
    expect(within(dialog).getAllByText("Mark 0/3")).toHaveLength(2);
  });

  it("gets the writing score on request and keeps it with the run", async () => {
    await seedDone();
    const api = reviewWriting(async () => Response.json(review(2)));

    await mount();
    expect(api).not.toHaveBeenCalled();
    click("Score my writing");

    await waitFor(() => expect(tile("Writing")).toHaveTextContent("Writing16.67/25"));
    expect(screen.queryByRole("spinbutton", { name: "Writing score /25" })).not.toBeInTheDocument();
    expect((await state()).marks).toEqual({ [form.id]: 2, [letter.id]: 2 });
    await remount();
    expect(tile("Writing")).toHaveTextContent("Writing16.67/25");
    expect(screen.queryByRole("button", { name: "Score my writing" })).not.toBeInTheDocument();
  });

  it("shows a failed review as not scored with a retry, and asks only for the missing mark", async () => {
    await seedDone({ marks: { [form.id]: 3 } });

    const api = reviewWriting(async () => Response.json({ error: "upstream" }, { status: 502 }));

    await mount();
    click("Score my writing");

    expect(
      await screen.findByText(
        "Feedback is not available right now. Your answer is saved; try again later.",
      ),
    ).toBeInTheDocument();

    expect(tile("Writing")).toHaveTextContent("WritingNot scored");
    expect(screen.getByRole("spinbutton", { name: "Writing score /25" })).toBeInTheDocument();

    expect(api.mock.calls.map(([, init]) => JSON.parse(String(init.body)).questionId)).toEqual([
      letter.id,
    ]);

    api.mockImplementation(async () => Response.json(review(1)));
    click("Try again");
    await waitFor(() => expect(tile("Writing")).toHaveTextContent("Writing16.67/25"));
    expect((await state()).marks).toEqual({ [form.id]: 3, [letter.id]: 1 });
  });

  it("shows the writing as being scored while the review is on its way", async () => {
    await seedDone();
    reviewWriting(() => new Promise<Response>(() => {}));

    await mount();
    click("Score my writing");
    expect(await screen.findByRole("button", { name: "Scoring…" })).toBeDisabled();
    expect(tile("Writing")).toHaveTextContent("WritingScoring…");
  });
});
