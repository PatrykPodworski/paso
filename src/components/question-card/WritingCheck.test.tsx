import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { QuestionCard } from "./QuestionCard";
import { QuestionFeedback } from "./QuestionFeedback";
import { stopAudio } from "../audio/playback";
import { allQuestions } from "../../data/curriculum";
import { formPractice, mockQuestions } from "../../data/mock";
import type { WritingReview } from "../../data/types";

const writing = allQuestions.find((q) => q.id === "u1-o2")!;
const answer = "Hola. Me llamo Ana y soy de Polonia. Vivo en Varsovia. ¿Cómo te llamas?";
const api = vi.fn();

const review: WritingReview = {
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
};

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  vi.stubGlobal("fetch", api);
});

afterEach(() => act(stopAudio));

const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));

const submit = () => {
  render(<QuestionCard q={writing} onSubmit={vi.fn()} />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: answer } });
  click("Review my practice");
};

const sent = () => JSON.parse(api.mock.calls[0][1].body);

it("asks for feedback only when the learner requests it, with the passcode", async () => {
  api.mockResolvedValue(Response.json(review));
  submit();
  expect(api).not.toHaveBeenCalled();
  expect(screen.getByRole("button", { name: "Check my writing" })).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Passcode"), { target: { value: "olé" } });
  click("Check my writing");

  expect(await screen.findByText("15 words. Target: 30–40.")).toBeInTheDocument();
  expect(sent()).toEqual({ questionId: "u1-o2", answer, passcode: "olé" });
  expect(api.mock.calls[0][0]).toBe("/api/review-writing");

  expect(screen.getByText("Add a farewell.").closest("li")).toHaveTextContent(
    `Missing: ${writing.checklist![0]}`,
  );

  expect(screen.getByText("Good question.").closest("li")).toHaveTextContent(
    `Covered: ${writing.checklist![2]}`,
  );

  expect(screen.getByText("¡Hola!")).toHaveAttribute("lang", "es");
  expect(screen.getByText("Use exclamation marks for a greeting.")).toBeInTheDocument();
  expect(screen.getByText(review.revised)).toHaveAttribute("lang", "es");
  expect(screen.queryByText(/out of 3/)).not.toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem("paso-live-v1")!).passcode).toBe("olé");
});

it("uses the stored passcode without asking again", async () => {
  localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "olé" }));
  api.mockResolvedValue(Response.json(review));
  submit();
  expect(screen.queryByLabelText("Passcode")).not.toBeInTheDocument();
  click("Check my writing");

  expect(await screen.findByText("Add a farewell.")).toBeInTheDocument();
  expect(sent().passcode).toBe("olé");
  expect(JSON.parse(localStorage.getItem("paso-live-v1")!).freeUsed).toBe(true);
});

it("sends a form as its labelled fields", async () => {
  api.mockResolvedValue(Response.json({ ...review, coverage: [] }));
  localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: false, passcode: "olé" }));
  render(<QuestionCard q={formPractice} onSubmit={vi.fn()} />);

  for (const f of formPractice.fields!) {
    fireEvent.change(screen.getByLabelText(f.label), { target: { value: "Ana" } });
  }

  click("Review my practice");
  click("Check my writing");
  await screen.findByText("15 words. Target: 15–25.");

  expect(sent().answer).toBe(formPractice.fields!.map((f) => `${f.label}: Ana`).join("\n"));
});

it("forgets a wrong passcode and keeps the answer", async () => {
  localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "old" }));
  api.mockResolvedValue(Response.json({ error: "passcode" }, { status: 401 }));
  submit();
  click("Check my writing");

  expect(await screen.findByText("That passcode is not right.")).toBeInTheDocument();
  expect(screen.getByLabelText("Passcode")).toHaveValue("");

  expect(JSON.parse(localStorage.getItem("paso-live-v1")!)).toEqual({
    freeUsed: true,
    passcode: "",
  });

  click("Revise my answer");
  expect(screen.getByRole("textbox")).toHaveValue(answer);
});

it("says when there were too many wrong passcodes", async () => {
  api.mockResolvedValue(Response.json({ error: "passcode_tries" }, { status: 429 }));
  submit();
  fireEvent.change(screen.getByLabelText("Passcode"), { target: { value: "guess" } });
  click("Check my writing");

  expect(await screen.findByText("Too many wrong passcodes today.")).toBeInTheDocument();
});

it.each([
  ["an upstream error", async () => Response.json({ error: "upstream" }, { status: 502 })],
  ["a network failure", async () => Promise.reject(new TypeError("fetch failed"))],
])("explains %s and keeps the answer and the passcode", async (_, reply) => {
  localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "olé" }));
  api.mockImplementation(reply);
  submit();
  click("Check my writing");

  expect(
    await screen.findByText(
      "Feedback is not available right now. Your answer is saved; try again later.",
    ),
  ).toBeInTheDocument();

  expect(JSON.parse(localStorage.getItem("paso-live-v1")!).passcode).toBe("olé");
  expect(screen.getByRole("button", { name: "Check my writing" })).toBeEnabled();
  click("Revise my answer");
  expect(screen.getByRole("textbox")).toHaveValue(answer);
});

it("disables the button while the feedback loads", async () => {
  let reply = (_: Response) => {};

  api.mockImplementation(() => new Promise<Response>((resolve) => (reply = resolve)));
  localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "olé" }));
  submit();
  click("Check my writing");

  expect(screen.getByRole("button", { name: "Checking your writing…" })).toBeDisabled();
  await act(async () => reply(Response.json(review)));
  expect(screen.getByRole("button", { name: "Check my writing" })).toBeEnabled();
});

it("offers the writing check for writing, not for speaking", () => {
  const speaking = mockQuestions.find((q) => q.kind === "speak")!;

  const props = {
    correct: null,
    productive: true,
    value: "",
    submission: "",
    checked: 0,
    assisted: false,
    onRevise: vi.fn(),
    onContinue: vi.fn(),
  };

  const { rerender } = render(<QuestionFeedback q={speaking} {...props} />);

  expect(screen.queryByRole("button", { name: "Check my writing" })).not.toBeInTheDocument();
  rerender(<QuestionFeedback q={writing} {...props} />);
  expect(screen.getByRole("button", { name: "Check my writing" })).toBeInTheDocument();
});
