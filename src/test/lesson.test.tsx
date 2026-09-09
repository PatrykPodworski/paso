import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { expect, it, vi } from "vitest";
import { LessonSession } from "../components/LessonSession";
import type { QuestionCard } from "../components/QuestionCard";
import { stopAudio } from "../components/Audio";
import { allQuestions } from "../data/curriculum";
import { formPractice } from "../data/mock";
import { emptyProgress } from "../data/progress";
import type { Question } from "../data/types";

// Test session accounting independently of the question widget. The real
// widget and its integration are exercised in question-rules and browser tests.
let card: ComponentProps<typeof QuestionCard>;
vi.mock("../components/QuestionCard", () => ({
  QuestionCard: (props: typeof card) => {
    card = props;
    return <div data-testid="current-question">{props.q.id}</div>;
  },
}));
vi.mock("../components/Audio", () => ({ stopAudio: vi.fn() }));
const mount = (questions: Question[], progress = emptyProgress()) => {
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
  screen.getByText(label, { exact: true }).parentElement!.querySelector("strong")!;

it("counts mixed objective, creative and assisted work independently", () => {
  const { onComplete, container } = mount(allQuestions.slice(0, 4));
  expect(container.querySelector(".lesson-counter")).toHaveTextContent("1 / 4");
  submit(true);
  expect(container.querySelector(".lesson-counter")).toHaveTextContent("2 / 4");
  submit(false);
  submit(null);
  expect(onComplete).not.toHaveBeenCalled();
  submit(true, true);
  expect(onComplete).toHaveBeenCalledExactlyOnceWith(2, 3);
  expect(stat("objective answers")).toHaveTextContent(/^2\/3$/);
  expect(stat("creative practices")).toHaveTextContent(/^1$/);
  expect(stat("moments to review")).toHaveTextContent(/^1$/);
  expect(screen.getByText("1 answers used transcript assistance.")).toBeInTheDocument();
  expect(screen.getByText(/Your mistakes are waiting/)).toBeInTheDocument();
  expect(stopAudio).toHaveBeenCalledTimes(4);
});
it.each([
  { results: [true, true], score: 2, total: 2, creative: 0 },
  { results: [null, null], score: 0, total: 0, creative: 2 },
])("reports a session without mistakes (case %#)", ({ results, score, total, creative }) => {
  const { onComplete, onClose } = mount(allQuestions.slice(0, 2));
  results.forEach((result) => submit(result));
  expect(onComplete).toHaveBeenCalledExactlyOnceWith(score, total);
  expect(stat("objective answers").textContent).toBe(`${score}/${total}`);
  expect(stat("creative practices").textContent).toBe(String(creative));
  expect(stat("moments to review").textContent).toBe("0");
  expect(screen.queryByText(/answers used transcript assistance/)).not.toBeInTheDocument();
  expect(screen.queryByText(/Your mistakes are waiting/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Close lesson" }));
  expect(onClose).toHaveBeenCalledOnce();
  expect(stopAudio).toHaveBeenCalledTimes(3);
});
it.each(["write", "form", "choice", "type", "speak"] as const)(
  "restores drafts only for editable productive work: %s",
  (kind) => {
    const q = kind === "form" ? formPractice : allQuestions.find((q) => q.kind === kind)!;
    const progress = emptyProgress();
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
