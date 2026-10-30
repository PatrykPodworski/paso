import { Button } from "../../design-system/Button";
import { FieldNote } from "../../design-system/FieldNote";
import { Icon } from "../../design-system/Icon";
import { Notice } from "../../design-system/Notice";
import type { Grade, Question, WritingReview } from "../../data/types";
import { PasscodeField } from "../writing-review/PasscodeField";
import { problemOf, type ReviewResult } from "../writing-review/requestReview";
import { useWritingReviews } from "../writing-review/useWritingReviews";
import { WritingFeedback } from "../writing-review/WritingFeedback";
import { QuestionFooter } from "./QuestionFooter";

const BOX = "mt-5 flex flex-col gap-3.5 rounded-lg border px-5 py-4 max-md:p-3.5";

// Icon and text carry the result, so it does not depend on colour.
const FLAGS = {
  perfect: {
    label: "Passed",
    icon: "check",
    border: "border-sage-200",
    badge: "bg-sage-100 text-olive-800",
  },
  good: {
    label: "Partly passed",
    icon: "repeat",
    border: "border-sand-200",
    badge: "bg-sand-100 text-sand-800",
  },
  bad: {
    label: "Not passed yet",
    icon: "x",
    border: "border-coral-200",
    badge: "bg-coral-100 text-coral-800",
  },
};

type ResultProps = { q: Question; review: WritingReview; grade: Grade; onContinue: () => void };

const WritingResult = ({ q, review, grade, onContinue }: ResultProps) => {
  const flag = FLAGS[grade];

  return (
    <div className={`${BOX} bg-white ${flag.border}`}>
      <div
        role="status"
        className={`flex items-center gap-2 self-start rounded-2xl px-3 py-1.5 ${flag.badge}`}
      >
        <Icon name={flag.icon} size={18} />
        <h3 className="text-sm font-semibold tracking-tight">{flag.label}</h3>
      </div>
      <WritingFeedback review={review} minWords={q.minWords} maxWords={q.maxWords} />
      <div className="flex items-center justify-between gap-5 mt-1 max-md:flex-wrap max-md:gap-3.5">
        <small className="text-xs leading-relaxed text-sage-800">
          {grade === "bad" ? "Added to your mistake review." : "Your practice is saved."}
        </small>
        <Button
          type="button"
          variant="primary"
          size="compact"
          className="max-md:ml-auto"
          autoFocus
          onClick={onContinue}
        >
          Continue
          <Icon name="arrow" size={18} />
        </Button>
      </div>
    </div>
  );
};

type RequestProps = {
  needsPasscode: boolean;
  passcode: string;
  onPasscode: (passcode: string) => void;
  error?: string;
};

const WritingRequest = ({ needsPasscode, passcode, onPasscode, error }: RequestProps) => (
  <div className={`${BOX} border-sage-200 bg-white`}>
    <FieldNote>
      Get feedback from an AI tutor on every requested point, with corrections and a revised
      version. Your answer goes to OpenRouter for the feedback.
    </FieldNote>
    {needsPasscode && <PasscodeField passcode={passcode} onPasscode={onPasscode} />}
    {error && <Notice as="p">{problemOf(error)}</Notice>}
  </div>
);

// A review with a grade, the only kind a practice task gets.
const gradedOf = (result?: ReviewResult) =>
  result && "review" in result && result.review.grade
    ? { review: result.review, grade: result.review.grade }
    : undefined;

const errorOf = (result?: ReviewResult) => (result && "error" in result ? result.error : undefined);

type Props = {
  q: Question;
  // The answer as it is saved: a form's fields are "Label: value" lines.
  answer: string;
  canSubmit: boolean | undefined;
  assisted: boolean;
  onLock: (locked: boolean) => void;
  onEvaluated?: (answer: string, correct: boolean, assisted: boolean, grade: Grade) => void;
  onSubmit: (answer: string, correct: boolean, assisted: boolean) => void;
};

// A lesson or practice writing task: the AI tutor's review is its result, recorded like a
// live talk's grade. The answer stays locked while the review loads and once it arrives.
export const WritingCheck = ({
  q,
  answer,
  canSubmit,
  assisted,
  onLock,
  onEvaluated,
  onSubmit,
}: Props) => {
  const { passcode, setPasscode, needsPasscode, loading, results, check } = useWritingReviews();
  const graded = gradedOf(results[q.id]);

  const request = async () => {
    onLock(true);
    const next = gradedOf((await check({ [q.id]: answer }))[q.id]);

    if (next) {
      onEvaluated?.(answer, next.grade !== "bad", assisted, next.grade);
    } else {
      onLock(false);
    }
  };

  if (loading) {
    return (
      <div className={`${BOX} border-sage-200 bg-white`}>
        <FieldNote role="status">Checking your writing…</FieldNote>
      </div>
    );
  }

  if (graded) {
    return (
      <WritingResult
        q={q}
        {...graded}
        onContinue={() => onSubmit(answer, graded.grade !== "bad", assisted)}
      />
    );
  }

  return (
    <>
      <WritingRequest
        needsPasscode={needsPasscode}
        passcode={passcode}
        onPasscode={setPasscode}
        error={errorOf(results[q.id])}
      />
      <QuestionFooter
        exam={false}
        productive
        kind={q.kind}
        canSubmit={canSubmit && !!passcode.trim()}
        onCheck={request}
      />
    </>
  );
};
