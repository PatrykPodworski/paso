import { Eyebrow } from "../../design-system/Eyebrow";
import { FieldNote } from "../../design-system/FieldNote";
import { Button } from "../../design-system/Button";
import { countWords, writingHints } from "../../data/progress";
import type { Question } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { MemoryHint } from "../MemoryHint";

const NOTE = "text-sm leading-relaxed text-olive-700 mt-2";

const TONE = {
  success: {
    box: "border-sage-200 bg-sage-100",
    icon: "bg-sage-200 text-olive-500",
    heading: "text-olive-600",
    paragraph: "text-olive-700",
  },
  needsWork: {
    box: "border-sand-200 bg-sand-50",
    icon: "bg-sand-200 text-sand-500",
    heading: "text-sand-600",
    paragraph: "text-sand-700",
  },
};

type WritingNotesProps = { q: Question; value: string };

const WritingNotes = ({ q, value }: WritingNotesProps) => {
  const words = countWords(value);
  const hints = writingHints(value);

  return (
    <div className="mt-4">
      <p className={NOTE}>
        {words < (q.minWords || 0)
          ? `Your response is short (${words} words). Aim for ${q.minWords}–${q.maxWords} words and develop the missing points.`
          : words > (q.maxWords || Infinity)
            ? `You wrote ${words} words. Practise keeping the response within ${q.minWords}–${q.maxWords} words.`
            : `Your word count (${words}) is within the practice target.`}
      </p>
      {hints.map((h) => (
        <p key={h} className={NOTE}>
          <Icon name="info" size={16} className="inline align-middle" /> {h}
        </p>
      ))}
      <FieldNote className="mt-2">
        {hints.length
          ? "These are targeted checks, not a complete correction."
          : "No issue found by the small set of pattern checks. This does not mean every sentence is correct."}{" "}
        A teacher can assess the full response.
      </FieldNote>
    </div>
  );
};

type PracticeReviewProps = { q: Question; value: string; checked: number };

const PracticeReview = ({ q, value, checked }: PracticeReviewProps) => (
  <>
    <div className="rounded-lg border border-sage-200 bg-white py-4 px-5 mt-4 max-md:p-3.5">
      <Eyebrow>One possible answer</Eyebrow>
      <p lang="es" className="mt-2.5 mx-0 mb-4 text-sm leading-loose text-olive-700">
        {q.answer}
      </p>
    </div>
    {q.kind !== "speak" && <WritingNotes q={q} value={value} />}
    <FieldNote className="mt-3">
      {checked}/{q.checklist?.length || 0} self-review points checked. Productive practice is saved
      without a numerical grade.
    </FieldNote>
  </>
);

type FeedbackBottomProps = {
  correct: boolean | null;
  productive: boolean;
  assisted: boolean;
  onRevise: () => void;
  onContinue: () => void;
};

const FeedbackBottom = ({
  correct,
  productive,
  assisted,
  onRevise,
  onContinue,
}: FeedbackBottomProps) => (
  <div className="flex items-center justify-between gap-5 mt-5 max-md:flex-wrap max-md:gap-3.5">
    <small className="text-xs leading-relaxed text-sage-500">
      {correct === false
        ? "Added to your mistake review."
        : productive
          ? "Your practice is saved."
          : assisted
            ? "Completed with transcript assistance."
            : "Keep taking those little steps."}
    </small>
    {productive && (
      <Button
        type="button"
        variant="secondary"
        size="compact"
        className="max-md:ml-auto"
        onClick={onRevise}
      >
        Revise my answer
      </Button>
    )}
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
);

type Props = {
  q: Question;
  correct: boolean | null;
  productive: boolean;
  value: string;
  checked: number;
  assisted: boolean;
  onRevise: () => void;
  onContinue: () => void;
};

export const QuestionFeedback = ({
  q,
  correct,
  productive,
  value,
  checked,
  assisted,
  onRevise,
  onContinue,
}: Props) => {
  const needsWork = correct === false;
  const tone = needsWork ? TONE.needsWork : TONE.success;
  const paragraph = `text-sm leading-relaxed mt-3 ${tone.paragraph}`;

  return (
    <div
      className={`feedback rounded-lg border p-5 mt-6 max-md:py-5 max-md:px-4 ${tone.box}`}
      role="status"
    >
      <div className="flex items-center gap-2.5">
        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${tone.icon}`}>
          <Icon name={needsWork ? "repeat" : productive ? "pen" : "check"} />
        </span>
        <h3 className={`font-semibold tracking-tight text-base max-md:text-sm ${tone.heading}`}>
          {productive
            ? "Let’s reflect on your answer"
            : correct
              ? "¡Muy bien! You’ve got it."
              : "A good moment to learn."}
        </h3>
      </div>
      {needsWork && (
        <p className={paragraph}>
          Your answer: <strong lang="es">{value}</strong>
          <br />
          Correct answer: <strong lang="es">{q.answer}</strong>
        </p>
      )}
      <p className={paragraph}>{q.explanation}</p>
      <MemoryHint text={q.memoryHint} />
      {productive && <PracticeReview q={q} value={value} checked={checked} />}
      {q.audio && (
        <details className="text-sm text-olive-500 mt-4">
          <summary className="cursor-pointer">Read the transcript</summary>
          <p lang="es" className="leading-relaxed mt-2.5">
            {q.audio}
          </p>
        </details>
      )}
      <FeedbackBottom
        correct={correct}
        productive={productive}
        assisted={assisted}
        onRevise={onRevise}
        onContinue={onContinue}
      />
    </div>
  );
};
