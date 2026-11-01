import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { expect, it, vi } from "vitest";
import { LessonSession } from "./LessonSession";
import type { QuestionCard } from "./question-card/QuestionCard";
import type { LiveQuestion } from "./live-talk/LiveQuestion";
import { stopAudio } from "./audio/playback";
import { allQuestions } from "../data/curriculum";
import { formPractice } from "../data/mock";
import { emptySnapshot } from "../test/progress";
import type { LiveScore, Question } from "../data/types";

// Test session accounting independently of the question widget. The real
// widget and its integration are exercised in the question-card and browser tests.
let card: ComponentProps<typeof QuestionCard>;

vi.mock("./question-card/QuestionCard", () => ({
  QuestionCard: (props: typeof card) => {
    card = props;

    return <div data-testid="current-question">{props.q.id}</div>;
  },
}));

let talk: ComponentProps<typeof LiveQuestion>;

vi.mock("./live-talk/LiveQuestion", () => ({
  LiveQuestion: (props: typeof talk) => {
    talk = props;

    return null;
  },
}));

vi.mock("./audio/playback", () => ({ stopAudio: vi.fn() }));

const mount = (questions: Question[], progress = emptySnapshot()) => {
  const callbacks = { onClose: vi.fn(), onComplete: vi.fn(), onAttempt: vi.fn(), onDraft: vi.fn() };

  const view = render(
    <LessonSession
      lesson={{
        id: "accounting",
        title: "Session accounting",
        subtitle: "",
        minutes: 4,
        icon: "book",
        questions,
      }}
      progress={progress}
      {...callbacks}
    />,
  );

  return { ...callbacks, ...view };
};

const submit = (correct: boolean | null, help = false) =>
  act(() => card.onSubmit("Learner answer", correct, help));

const stat = (label: string) =>
  screen.getAllByRole("definition")[
    screen.getAllByRole("term").findIndex((term) => term.textContent === label)
  ];

it("counts objective and assisted work independently and leaves ungraded work out of the score", () => {
  const { onComplete } = mount(allQuestions.slice(0, 4));

  expect(screen.getByText("1 / 4")).toBeInTheDocument();
  submit(true);
  expect(screen.getByText("2 / 4")).toBeInTheDocument();
  submit(false);
  submit(null);
  expect(onComplete).not.toHaveBeenCalled();
  submit(true, true);
  expect(onComplete).toHaveBeenCalledExactlyOnceWith(2, 3);
  expect(stat("objective answers")).toHaveTextContent(/^2\/3$/);
  expect(screen.queryByText("creative practices")).not.toBeInTheDocument();
  expect(stat("moments to review")).toHaveTextContent(/^1$/);
  expect(screen.getByText("1 answers used transcript assistance.")).toBeInTheDocument();
  expect(screen.getByText(/Your mistakes are waiting/)).toBeInTheDocument();
  expect(stopAudio).toHaveBeenCalledTimes(4);
});

it("lets a listening recording play on while its own questions continue", () => {
  const recording = allQuestions.find((q) => /-a\d+$/.test(q.id))!.audio;
  const listening = allQuestions.filter((q) => q.audio === recording);

  expect(listening.length).toBeGreaterThan(1);
  mount([...listening.slice(0, 2), allQuestions.find((q) => !q.audio)!]);
  submit(true);
  expect(stopAudio).not.toHaveBeenCalled();
  submit(true);
  expect(stopAudio).toHaveBeenCalledOnce();
});

it.each([
  { results: [true, true], score: 2, total: 2 },
  { results: [null, null], score: 0, total: 0 },
])("reports a session without mistakes (case %#)", ({ results, score, total }) => {
  const { onComplete, onClose } = mount(allQuestions.slice(0, 2));

  results.forEach((result) => submit(result));
  expect(onComplete).toHaveBeenCalledExactlyOnceWith(score, total);
  expect(stat("objective answers").textContent).toBe(`${score}/${total}`);
  expect(stat("moments to review").textContent).toBe("0");
  expect(screen.queryByText(/answers used transcript assistance/)).not.toBeInTheDocument();
  expect(screen.queryByText(/Your mistakes are waiting/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Close lesson" }));
  expect(onClose).toHaveBeenCalledOnce();
  expect(stopAudio).toHaveBeenCalledTimes(3);
});

it.each(["write", "form", "choice", "type"] as const)(
  "restores drafts only for editable productive work: %s",
  (kind) => {
    const q = kind === "form" ? formPractice : allQuestions.find((q) => q.kind === kind)!;

    const progress = emptySnapshot();

    progress.drafts[q.id] = "Saved learner draft";
    const { onDraft } = mount([q], progress);

    if (kind === "write" || kind === "form") {
      expect(card.draft).toBe("Saved learner draft");
      act(() => card.onDraft!("Revised draft"));
      expect(onDraft).toHaveBeenCalledExactlyOnceWith(q.id, "Revised draft");
    } else {
      expect(card.draft).toBe("");
      expect(card.onDraft).toBeUndefined();
    }
  },
);

const bad: LiveScore = { grade: "bad", items: [{ id: "name", label: "Name", level: "missing" }] };

it("saves a live talk's grade with its attempt", () => {
  const live = allQuestions.find((q) => q.kind === "live")!;
  const { onAttempt } = mount([live]);

  act(() => talk.onEvaluated!("Examiner: ¿Cómo te llamas?\nYou: Ana.", false, false, "bad", bad));

  expect(onAttempt.mock.calls[0][0]).toMatchObject({
    questionId: "u1-o3",
    skill: "speaking",
    answer: "Examiner: ¿Cómo te llamas?\nYou: Ana.",
    correct: false,
    grade: "bad",
  });
});
