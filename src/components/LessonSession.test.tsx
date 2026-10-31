import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { LessonSession } from "./LessonSession";
import { stopAudio } from "./audio/playback";
import { allQuestions } from "../data/curriculum";
import { emptySnapshot, questionState } from "../test/progress";
import type { ProgressSnapshot, Question } from "../data/types";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  // A passage player deliberately survives its own unmount; end it with the session.
  act(stopAudio);
});

const click = (name: string) => fireEvent.click(screen.getByRole("button", { name }));
const type = allQuestions.find((q) => q.kind === "type")!;
const writing = allQuestions.find((q) => q.id === "u1-o2")!;

it("records objective, assisted and graded writing answers without conflating their scores", async () => {
  const choice = { ...allQuestions[0], audio: "Hola." };
  const qs: Question[] = [choice, { ...type, answer: "correcto" }, writing];

  const done = vi.fn(),
    attempt = vi.fn(),
    close = vi.fn(),
    draft = vi.fn();

  localStorage.setItem("paso-live-v1", JSON.stringify({ freeUsed: true, passcode: "olé" }));

  render(
    <LessonSession
      lesson={{
        id: "lesson",
        title: "Lesson",
        subtitle: "",
        minutes: 4,
        icon: "book",
        questions: qs,
      }}
      progress={emptySnapshot()}
      onClose={close}
      onComplete={done}
      onAttempt={attempt}
      onDraft={draft}
    />,
  );

  click("Need a hand? Show transcript");
  click(choice.answer);
  expect(attempt).toHaveBeenCalledOnce();

  expect(attempt.mock.calls[0][0]).toMatchObject({
    questionId: choice.id,
    skill: choice.skill,
    correct: true,
    assisted: true,
    answer: choice.answer,
  });

  expect(attempt.mock.calls[0][0].id).toBeTruthy();
  expect(Number.isNaN(Date.parse(attempt.mock.calls[0][0].at))).toBe(false);
  click("Continue");
  const bar = screen.getByRole("progressbar", { name: "Lesson progress" });

  expect(bar).toHaveAttribute("aria-valuenow", "1");
  expect(bar).toHaveAttribute("aria-valuemax", "3");
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "incorrecto" } });
  click("Check answer");
  click("Continue");
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Hola, Ana." } });
  expect(draft).toHaveBeenLastCalledWith(writing.id, "Hola, Ana.");

  vi.stubGlobal(
    "fetch",
    vi.fn(async () =>
      Response.json({ wordCount: 2, coverage: [], corrections: [], revised: "", grade: "good" }),
    ),
  );

  click("Review my practice");
  await screen.findByRole("heading", { name: "Partly passed" });

  expect(attempt.mock.calls.at(-1)![0]).toMatchObject({
    questionId: writing.id,
    answer: "Hola, Ana.",
    correct: true,
    grade: "good",
  });

  click("Continue");
  // A graded writing review counts like an objective answer, as a graded live talk does.
  expect(done).toHaveBeenCalledExactlyOnceWith(2, 3);
  expect(screen.getByText("1 answers used transcript assistance.")).toBeInTheDocument();
  expect(screen.getByText(/Your mistakes are waiting/)).toBeInTheDocument();
  click("Back to my journey");
  expect(close).toHaveBeenCalledOnce();
});

it("closes an untouched lesson immediately", () => {
  const close = vi.fn();

  render(
    <LessonSession
      lesson={{
        id: "lesson",
        title: "Lesson",
        subtitle: "",
        minutes: 4,
        icon: "book",
        questions: [type],
      }}
      progress={emptySnapshot()}
      onClose={close}
      onComplete={vi.fn()}
      onAttempt={vi.fn()}
      onDraft={vi.fn()}
    />,
  );

  click("Close lesson");
  expect(close).toHaveBeenCalledOnce();
});

it.each([allQuestions[0], allQuestions.find((q) => q.id === "u1-o1")!])(
  "starts a fresh objective attempt without its previous answer: $id",
  (q) => {
    const progress = emptySnapshot();

    progress.drafts[q.id] = q.answer;
    const saveDraft = vi.fn();

    render(
      <LessonSession
        lesson={{
          id: "test",
          title: "Test",
          subtitle: "",
          icon: "book",
          minutes: 2,
          questions: [q],
        }}
        progress={progress}
        onClose={vi.fn()}
        onAttempt={vi.fn()}
        onComplete={vi.fn()}
        onDraft={saveDraft}
      />,
    );

    if (q.kind === "type") {
      expect(screen.getByRole("textbox")).toHaveValue("");
      fireEvent.change(screen.getByRole("textbox"), { target: { value: "Un intento" } });
    } else {
      expect(screen.getByRole("button", { name: q.answer })).toHaveAttribute(
        "aria-pressed",
        "false",
      );

      fireEvent.click(screen.getByRole("button", { name: q.answer }));
    }

    expect(saveDraft).not.toHaveBeenCalled();
  },
);

it("keeps an in-progress answer when cancelling the leave dialog", () => {
  const questions: Question[] = [allQuestions[0], allQuestions.find((q) => q.id === "u1-o1")!];

  render(
    <LessonSession
      lesson={{ id: "test", title: "Test", subtitle: "", icon: "book", minutes: 2, questions }}
      progress={emptySnapshot()}
      onClose={vi.fn()}
      onAttempt={vi.fn()}
      onComplete={vi.fn()}
      onDraft={vi.fn()}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: questions[0].answer }));
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "Soy de" } });
  fireEvent.click(screen.getByRole("button", { name: "Close lesson" }));
  fireEvent.click(screen.getByRole("button", { name: "Keep learning" }));
  expect(screen.getByRole("textbox")).toHaveValue("Soy de");
});

it("still restores longer writing drafts in a new practice session", () => {
  const q = allQuestions.find((q) => q.id === "u1-o2")!;
  const progress = emptySnapshot();

  progress.drafts[q.id] = "Hola, me llamo Julia.";

  render(
    <LessonSession
      lesson={{
        id: "test",
        title: "Test",
        subtitle: "",
        icon: "book",
        minutes: 2,
        questions: [q],
      }}
      progress={progress}
      onClose={vi.fn()}
      onAttempt={vi.fn()}
      onComplete={vi.fn()}
      onDraft={vi.fn()}
    />,
  );

  expect(screen.getByRole("textbox")).toHaveValue(progress.drafts[q.id]);
});

it("ignores answer shortcuts while the leave confirmation is open", () => {
  const choices = allQuestions.filter((q) => q.options);
  const questions: Question[] = [choices[0], choices[1]];
  const attempt = vi.fn();

  render(
    <LessonSession
      lesson={{ id: "test", title: "Test", subtitle: "", icon: "book", minutes: 2, questions }}
      progress={emptySnapshot()}
      onClose={vi.fn()}
      onAttempt={attempt}
      onComplete={vi.fn()}
      onDraft={vi.fn()}
    />,
  );

  fireEvent.click(screen.getByRole("button", { name: questions[0].answer }));
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  fireEvent.click(screen.getByRole("button", { name: "Close lesson" }));
  fireEvent.keyDown(window, { key: "2" });
  expect(attempt).toHaveBeenCalledOnce();
  fireEvent.click(screen.getByRole("button", { name: "Keep learning" }));
  fireEvent.keyDown(window, { key: "2" });
  expect(attempt).toHaveBeenCalledTimes(2);

  expect(attempt.mock.calls[1][0]).toMatchObject({
    questionId: questions[1].id,
    answer: questions[1].options![1],
  });
});

const finishOneQuestionLesson = (onNext?: () => void) => {
  const close = vi.fn();
  const q = allQuestions[0];

  render(
    <LessonSession
      lesson={{ id: "test", title: "Test", subtitle: "", icon: "book", minutes: 2, questions: [q] }}
      progress={emptySnapshot()}
      onClose={close}
      onAttempt={vi.fn()}
      onComplete={vi.fn()}
      onDraft={vi.fn()}
      onNext={onNext}
    />,
  );

  click(q.answer);
  click("Continue");

  return close;
};

it("offers the next lesson focused, with the journey as the secondary way out", () => {
  const next = vi.fn();
  const close = finishOneQuestionLesson(next);

  expect(screen.getByRole("button", { name: "Next lesson" })).toHaveFocus();
  click("Next lesson");
  expect(next).toHaveBeenCalledOnce();
  expect(close).not.toHaveBeenCalled();
  click("Back to my journey");
  expect(close).toHaveBeenCalledOnce();
});

it("focuses the way back to the journey when no lesson follows", () => {
  finishOneQuestionLesson();

  expect(screen.queryByRole("button", { name: "Next lesson" })).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Back to my journey" })).toHaveFocus();
});

it("shows how a question went last time, as it stood when the lesson opened", () => {
  const [seen, fresh] = allQuestions.filter((q) => q.options);
  const at = "2026-09-01T08:00:00.000Z";
  const before = emptySnapshot();

  before.questions[seen.id] = questionState({ correct: false, at });

  const lesson = (progress: ProgressSnapshot) => (
    <LessonSession
      lesson={{
        id: "test",
        title: "Test",
        subtitle: "",
        icon: "book",
        minutes: 2,
        questions: [seen, fresh],
      }}
      progress={progress}
      onClose={vi.fn()}
      onAttempt={vi.fn()}
      onComplete={vi.fn()}
      onDraft={vi.fn()}
    />
  );

  const { rerender } = render(lesson(before));
  const lastTime = `Last time: Wrong · ${new Date(at).toLocaleDateString()}`;

  expect(screen.getByText(/^Last time:/)).toHaveTextContent(lastTime);
  click(seen.answer);

  rerender(
    lesson({
      ...before,
      questions: { [seen.id]: questionState({ correct: true, at: new Date().toISOString() }) },
    }),
  );

  expect(screen.getByText(/^Last time:/)).toHaveTextContent(lastTime);
  click("Continue");
  expect(screen.queryByText(/^Last time:/)).not.toBeInTheDocument();
});
