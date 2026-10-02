import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { LessonSession } from "./LessonSession";
import { stopAudio } from "./audio/playback";
import { allQuestions } from "../data/curriculum";
import { emptyProgress } from "../data/progress";
import type { Question } from "../data/types";

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

it("records objective, assisted and creative answers without conflating their scores", () => {
  const choice = { ...allQuestions[0], audio: "Hola." };
  const qs: Question[] = [choice, { ...type, answer: "correcto" }, writing];

  const done = vi.fn(),
    attempt = vi.fn(),
    close = vi.fn(),
    draft = vi.fn();

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
      progress={emptyProgress()}
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
  click("Review my practice");
  click("Continue");
  expect(done).toHaveBeenCalledExactlyOnceWith(1, 2);
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
      progress={emptyProgress()}
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
    const progress = emptyProgress();

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
      progress={emptyProgress()}
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
  const progress = emptyProgress();

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
