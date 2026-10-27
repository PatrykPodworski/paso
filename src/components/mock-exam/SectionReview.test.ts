import { screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { mockSections } from "../../data/mock";
import type { WritingReview } from "../../data/types";
import { click, mount, now, seed, setupMockExam, state } from "../../test/mockExam";

setupMockExam();

it("reviews listening with transcripts and continues to a 25-minute writing section", () => {
  const q = mockSections[1].questions[0];

  seed({ section: 1, stage: "review", answers: { [q.id]: q.answer } });
  mount();
  expect(screen.getByRole("heading", { name: "1 out of 25." })).toBeInTheDocument();
  expect(screen.getAllByText(/^Transcript: /)).toHaveLength(25);
  expect(screen.getAllByText(/^Correct answer:/)).toHaveLength(25);
  expect(screen.getAllByText("Not answered")).toHaveLength(24);
  click("Continue to writing");

  expect(state()).toMatchObject({
    section: 2,
    index: 0,
    stage: "run",
    deadline: now + 25 * 60000,
  });

  expect(screen.getByRole("timer")).toHaveTextContent("25:00");
});

it("reviews writing against model responses, word targets and self-checks", () => {
  const [form, letter] = mockSections[2].questions;

  seed({
    section: 2,
    stage: "review",
    answers: {
      [form.id]: "Nombre y apellidos: Ana Ruiz\nCiudad: Madrid",
      [letter.id]: "Hola Ana, nos vemos",
    },
  });

  mount();

  expect(
    screen.getByRole("heading", { name: "Your practice is ready to review." }),
  ).toBeInTheDocument();

  expect(screen.getByText(/Get feedback from an AI tutor with a DELE mark/)).toBeInTheDocument();
  expect(screen.getAllByText(/^One possible response:/)).toHaveLength(2);
  expect(screen.getByText("Response length: 3 words. Target: 15–25.")).toBeInTheDocument();
  expect(screen.getByText("Response length: 4 words. Target: 30–40.")).toBeInTheDocument();

  for (const check of letter.checklist!) {
    expect(screen.getByText(`□ ${check}`)).toBeInTheDocument();
  }

  expect(screen.queryByText(/^Transcript: /)).not.toBeInTheDocument();
});

const [form, letter] = mockSections[2].questions;

const reviewOf = (q: typeof form, band: number, reason: string): WritingReview => ({
  wordCount: 20,
  coverage: (q.fields?.map((f) => f.label) ?? q.checklist!).map((point) => ({
    point,
    met: true,
    feedback: `${point} is there.`,
  })),
  corrections: [],
  revised: q.answer,
  mark: { band, reason },
});

const reviewWriting = (replies: Record<string, () => Promise<Response>>) => {
  const api = vi.fn((_: string, init: RequestInit) =>
    replies[JSON.parse(String(init.body)).questionId](),
  );

  vi.stubGlobal("fetch", api);

  return api;
};

const seedWriting = () => {
  vi.useRealTimers();
  localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "olé" }));

  seed({
    section: 2,
    stage: "review",
    answers: { [form.id]: "Nombre y apellidos: Ana Ruiz", [letter.id]: "Hola Ana, nos vemos" },
  });
};

it("marks both writing tasks on request and scales them to the writing score", async () => {
  seedWriting();

  const api = reviewWriting({
    [form.id]: async () => Response.json(reviewOf(form, 2, "Every field at A1 level.")),
    [letter.id]: async () => Response.json(reviewOf(letter, 2, "One missed point.")),
  });

  mount();
  expect(api).not.toHaveBeenCalled();
  click("Get feedback on my writing");

  expect(await screen.findByText("16.67 out of 25 for writing.")).toBeInTheDocument();
  expect(screen.getByText("Every field at A1 level.")).toBeInTheDocument();
  expect(screen.getByText("One missed point.")).toBeInTheDocument();
  expect(screen.getAllByText("Mark: 2 out of 3.")).toHaveLength(2);

  expect(api.mock.calls.map(([, init]) => JSON.parse(String(init.body)))).toEqual([
    { questionId: form.id, answer: "Nombre y apellidos: Ana Ruiz", passcode: "olé" },
    { questionId: letter.id, answer: "Hola Ana, nos vemos", passcode: "olé" },
  ]);
});

it("keeps one task's mark when the other cannot be reviewed, and sends a blank task", async () => {
  seedWriting();

  seed({ section: 2, stage: "review", answers: { [letter.id]: "Hola Ana, nos vemos" } });

  const api = reviewWriting({
    [form.id]: async () => Response.json({ error: "upstream" }, { status: 502 }),
    [letter.id]: async () => Response.json(reviewOf(letter, 3, "Clear and complete.")),
  });

  mount();
  click("Get feedback on my writing");

  expect(await screen.findByText("Clear and complete.")).toBeInTheDocument();

  expect(
    screen.getByText("Feedback is not available right now. Your answer is saved; try again later."),
  ).toBeInTheDocument();

  expect(screen.queryByText(/out of 25 for writing/)).not.toBeInTheDocument();
  expect(JSON.parse(String(api.mock.calls[0][1].body)).answer).toBe("");
});

it("asks for the passcode before marking the writing", () => {
  vi.useRealTimers();
  seed({ section: 2, stage: "review", answers: {} });
  mount();

  expect(screen.getByRole("button", { name: "Get feedback on my writing" })).toBeDisabled();
  expect(screen.getByLabelText("Passcode")).toHaveValue("");
});

it("offers no writing feedback outside the writing section", () => {
  seed({ section: 3, stage: "review", answers: {} });
  mount();
  expect(screen.getByText(/Open responses require human judgment/)).toBeInTheDocument();

  expect(
    screen.queryByRole("button", { name: "Get feedback on my writing" }),
  ).not.toBeInTheDocument();
});
