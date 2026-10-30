import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import { stopAudio } from "../audio/playback";
import { allQuestions } from "../../data/curriculum";
import { formPractice } from "../../data/mock";
import type { Grade, WritingReview } from "../../data/types";

const writing = allQuestions.find((q) => q.id === "u1-o2")!;
const answer = "Hola. Me llamo Ana y soy de Polonia. Vivo en Varsovia. ¿Cómo te llamas?";
const api = vi.fn();

const review = (grade: Grade = "good"): WritingReview => ({
  wordCount: 15,
  coverage: [
    { point: writing.checklist![0], met: false, feedback: "Add a farewell." },
    { point: writing.checklist![1], met: true, feedback: "All four details are there." },
    { point: writing.checklist![2], met: true, feedback: "Good question." },
  ],
  corrections: [
    { original: "soy de Polonia", corrected: "soy de Polonia", explanation: "Correct as written." },
    {
      original: "Hola.",
      corrected: "¡Hola!",
      explanation: "Use exclamation marks for a greeting.",
    },
  ],
  revised: "¡Hola! Me llamo Ana y soy de Polonia. Vivo en Varsovia. ¿Cómo te llamas? Adiós.",
  grade,
});

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.stubGlobal("fetch", api);
});

afterEach(() => act(stopAudio));

const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
const reviewButton = () => screen.getByRole("button", { name: "Review my practice" });

const storePasscode = (passcode = "olé") =>
  localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode }));

const mount = (props: Partial<Parameters<typeof QuestionCard>[0]> = {}) => {
  const onSubmit = vi.fn();
  const onEvaluated = vi.fn();

  render(<QuestionCard q={writing} onSubmit={onSubmit} onEvaluated={onEvaluated} {...props} />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: answer } });

  return { onSubmit, onEvaluated };
};

const sent = () => JSON.parse(api.mock.calls[0][1].body);

it("asks for the passcode under the answer and enables the review once it is typed", async () => {
  api.mockResolvedValue(Response.json(review()));
  mount();

  expect(screen.getByText(/Your answer goes to OpenRouter/)).toHaveTextContent(
    "The result is saved, and a task not passed goes to your mistake review.",
  );

  expect(reviewButton()).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Passcode"), { target: { value: "olé" } });
  expect(reviewButton()).toBeEnabled();
  expect(api).not.toHaveBeenCalled();
  click("Review my practice");

  expect(await screen.findByText("15 words. Target: 30–40.")).toBeInTheDocument();
  expect(sent()).toEqual({ questionId: "u1-o2", answer, passcode: "olé" });
  expect(api.mock.calls[0][0]).toBe("/api/review-writing");
  expect(JSON.parse(localStorage.getItem("paso-live-v1")!).passcode).toBe("olé");
});

it("uses the stored passcode without asking again", async () => {
  storePasscode();
  api.mockResolvedValue(Response.json(review()));
  mount();

  expect(screen.queryByLabelText("Passcode")).not.toBeInTheDocument();
  expect(reviewButton()).toBeEnabled();
  click("Review my practice");

  expect(await screen.findByText("Add a farewell.")).toBeInTheDocument();
  expect(sent().passcode).toBe("olé");
  expect(JSON.parse(localStorage.getItem("paso-live-v1")!).freeUsed).toBe(true);
});

it("keeps the review disabled until the answer can be submitted", () => {
  storePasscode();
  render(<QuestionCard q={writing} onSubmit={vi.fn()} />);

  expect(reviewButton()).toBeDisabled();
});

it("shows only a loading status and locks the answer while the review loads", async () => {
  let reply = (_: Response) => {};

  storePasscode();
  api.mockImplementation(() => new Promise<Response>((resolve) => (reply = resolve)));
  mount();
  click("Review my practice");

  expect(screen.getByRole("status")).toHaveTextContent("Checking your writing…");
  expect(screen.getByRole("textbox")).toBeDisabled();
  expect(screen.queryByRole("button", { name: "Review my practice" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Continue" })).not.toBeInTheDocument();
  expect(screen.queryByText(/goes to OpenRouter/)).not.toBeInTheDocument();
  await act(async () => reply(Response.json(review())));
  expect(screen.getByText("Add a farewell.")).toBeInTheDocument();
  expect(api).toHaveBeenCalledOnce();
});

it("shows the result with the tutor's feedback and Continue, and keeps the answer locked", async () => {
  storePasscode();
  api.mockResolvedValue(Response.json(review()));
  mount();
  click("Review my practice");

  expect(await screen.findByRole("heading", { name: "Partly passed" })).toBeInTheDocument();

  expect(screen.getByText("Add a farewell.").closest("li")).toHaveTextContent(
    `Missing: ${writing.checklist![0]}`,
  );

  expect(screen.getByText("Good question.").closest("li")).toHaveTextContent(
    `Covered: ${writing.checklist![2]}`,
  );

  expect(screen.getByText("¡Hola!")).toHaveAttribute("lang", "es");
  expect(screen.getByText("Use exclamation marks for a greeting.")).toBeInTheDocument();
  expect(screen.getByText(review().revised)).toHaveAttribute("lang", "es");
  expect(screen.queryByText(/out of 3/)).not.toBeInTheDocument();
  expect(screen.getByText("Your practice is saved.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Continue" })).toHaveFocus();
  expect(screen.getByRole("textbox")).toBeDisabled();

  for (const name of ["Review my practice", "Check my writing", "Revise my answer"]) {
    expect(screen.queryByRole("button", { name })).not.toBeInTheDocument();
  }

  expect(screen.queryByLabelText("Passcode")).not.toBeInTheDocument();
});

it("leaves the reflection out of the result", async () => {
  storePasscode();
  api.mockResolvedValue(Response.json(review()));
  mount();
  click("Review my practice");
  await screen.findByRole("heading", { name: "Partly passed" });

  expect(screen.queryByText(writing.explanation)).not.toBeInTheDocument();
  expect(screen.queryByText("One possible answer")).not.toBeInTheDocument();
  expect(screen.queryByText(/self-review points checked/)).not.toBeInTheDocument();
});

it.each([
  ["perfect", "Passed", true, "Your practice is saved."],
  ["good", "Partly passed", true, "Your practice is saved."],
  ["bad", "Not passed yet", false, "Added to your mistake review."],
] as const)(
  "records a %s review as soon as it arrives, and Continue moves on",
  async (grade, heading, correct, note) => {
    storePasscode();
    api.mockResolvedValue(Response.json(review(grade)));
    const { onSubmit, onEvaluated } = mount();

    click("Review my practice");

    expect(await screen.findByRole("heading", { name: heading })).toBeInTheDocument();
    expect(screen.getByText(note)).toBeInTheDocument();
    expect(onEvaluated.mock.calls).toEqual([[answer, correct, false, grade]]);
    expect(onSubmit).not.toHaveBeenCalled();
    click("Continue");
    expect(onSubmit.mock.calls).toEqual([[answer, correct, false]]);
    expect(onEvaluated).toHaveBeenCalledOnce();
  },
);

it("sends a form as its labelled fields", async () => {
  storePasscode();
  api.mockResolvedValue(Response.json({ ...review(), coverage: [] }));
  render(<QuestionCard q={formPractice} onSubmit={vi.fn()} />);

  for (const f of formPractice.fields!) {
    fireEvent.change(screen.getByLabelText(f.label), { target: { value: "Ana" } });
  }

  click("Review my practice");
  await screen.findByText("15 words. Target: 15–25.");

  expect(sent().answer).toBe(formPractice.fields!.map((f) => `${f.label}: Ana`).join("\n"));
});

it("forgets a wrong passcode, records nothing and unlocks the answer", async () => {
  storePasscode("old");
  api.mockResolvedValue(Response.json({ error: "passcode" }, { status: 401 }));
  const { onSubmit, onEvaluated } = mount();

  click("Review my practice");

  expect(await screen.findByText("That passcode is not right.")).toBeInTheDocument();
  expect(screen.getByLabelText("Passcode")).toHaveValue("");
  expect(reviewButton()).toBeDisabled();
  expect(screen.getByRole("textbox")).toBeEnabled();
  expect(screen.getByRole("textbox")).toHaveValue(answer);
  expect(screen.queryByRole("button", { name: "Continue" })).not.toBeInTheDocument();
  expect([onSubmit, onEvaluated].map((f) => f.mock.calls.length)).toEqual([0, 0]);

  expect(JSON.parse(localStorage.getItem("paso-live-v1")!)).toEqual({
    freeUsed: true,
    passcode: "",
  });
});

it("says when there were too many wrong passcodes", async () => {
  api.mockResolvedValue(Response.json({ error: "passcode_tries" }, { status: 429 }));
  mount();
  fireEvent.change(screen.getByLabelText("Passcode"), { target: { value: "guess" } });
  click("Review my practice");

  expect(await screen.findByText("Too many wrong passcodes today.")).toBeInTheDocument();
});

it.each([
  ["an upstream error", async () => Response.json({ error: "upstream" }, { status: 502 })],
  ["a network failure", async () => Promise.reject(new TypeError("fetch failed"))],
])("explains %s, keeps the passcode and retries from the same place", async (_, reply) => {
  storePasscode();
  api.mockImplementationOnce(reply).mockResolvedValueOnce(Response.json(review("perfect")));
  const { onEvaluated } = mount();

  click("Review my practice");

  expect(
    await screen.findByText(
      "Feedback is not available right now. Your answer is saved; try again later.",
    ),
  ).toBeInTheDocument();

  expect(JSON.parse(localStorage.getItem("paso-live-v1")!).passcode).toBe("olé");
  expect(screen.getByRole("textbox")).toBeEnabled();
  expect(onEvaluated).not.toHaveBeenCalled();
  fireEvent.change(screen.getByRole("textbox"), { target: { value: `${answer} Adiós.` } });
  click("Review my practice");

  expect(await screen.findByRole("heading", { name: "Passed" })).toBeInTheDocument();
  expect(JSON.parse(api.mock.calls[1][1].body).answer).toBe(`${answer} Adiós.`);
  expect(onEvaluated.mock.calls).toEqual([[`${answer} Adiós.`, true, false, "perfect"]]);
});

it("drops a review that arrives after the card closed", async () => {
  let reply = (_: Response) => {};

  storePasscode();
  api.mockImplementation(() => new Promise<Response>((resolve) => (reply = resolve)));
  const { onSubmit, onEvaluated } = mount();

  click("Review my practice");
  cleanup();
  await act(async () => reply(Response.json(review("bad"))));

  expect([onSubmit, onEvaluated].map((f) => f.mock.calls.length)).toEqual([0, 0]);
});
