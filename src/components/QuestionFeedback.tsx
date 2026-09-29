import { Eyebrow } from "../design-system/Eyebrow";
import { FieldNote } from "../design-system/FieldNote";
import { Button } from "../design-system/Button";
import { countWords, writingHints } from "../data/progress";
import type { Question } from "../data/types";
import { Icon } from "./Icon";
import { MemoryHint } from "./MemoryHint";

const WritingNotes = ({ q, value }: { q: Question; value: string }) => {
  const words = countWords(value);
  const hints = writingHints(value);

  return (
    <div className="writing-notes">
      <p>
        {words < (q.minWords || 0)
          ? `Your response is short (${words} words). Aim for ${q.minWords}–${q.maxWords} words and develop the missing points.`
          : words > (q.maxWords || Infinity)
            ? `You wrote ${words} words. Practise keeping the response within ${q.minWords}–${q.maxWords} words.`
            : `Your word count (${words}) is within the practice target.`}
      </p>
      {hints.map((h) => (
        <p key={h}>
          <Icon name="info" size={16} /> {h}
        </p>
      ))}
      <FieldNote>
        {hints.length
          ? "These are targeted checks, not a complete correction."
          : "No issue found by the small set of pattern checks. This does not mean every sentence is correct."}{" "}
        A teacher can assess the full response.
      </FieldNote>
    </div>
  );
};

const PracticeReview = ({ q, value, checked }: { q: Question; value: string; checked: number }) => (
  <>
    <div className="model-answer">
      <Eyebrow>One possible answer</Eyebrow>
      <p lang="es">{q.answer}</p>
    </div>
    {q.kind !== "speak" && <WritingNotes q={q} value={value} />}
    <FieldNote>
      {checked}/{q.checklist?.length || 0} self-review points checked. Productive practice is saved
      without a numerical grade.
    </FieldNote>
  </>
);

const FeedbackBottom = ({
  correct,
  productive,
  assisted,
  onRevise,
  onContinue,
}: {
  correct: boolean | null;
  productive: boolean;
  assisted: boolean;
  onRevise: () => void;
  onContinue: () => void;
}) => (
  <div className="feedback-bottom">
    <small>
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
        className="max-tablet:ml-auto"
        onClick={onRevise}
      >
        Revise my answer
      </Button>
    )}
    <Button
      type="button"
      variant="primary"
      size="compact"
      className="max-tablet:ml-auto"
      autoFocus
      onClick={onContinue}
    >
      Continue
      <Icon name="arrow" size={18} />
    </Button>
  </div>
);

export const QuestionFeedback = ({
  q,
  correct,
  productive,
  value,
  checked,
  assisted,
  onRevise,
  onContinue,
}: {
  q: Question;
  correct: boolean | null;
  productive: boolean;
  value: string;
  checked: number;
  assisted: boolean;
  onRevise: () => void;
  onContinue: () => void;
}) => (
  <div className={`feedback ${correct === false ? "needs-work" : "success"}`} role="status">
    <div className="feedback-heading">
      <span className="feedback-icon">
        <Icon name={correct === false ? "repeat" : productive ? "pen" : "check"} />
      </span>
      <h3>
        {productive
          ? "Let’s reflect on your answer"
          : correct
            ? "¡Muy bien! You’ve got it."
            : "A good moment to learn."}
      </h3>
    </div>
    {correct === false && (
      <p>
        Your answer: <strong lang="es">{value}</strong>
        <br />
        Correct answer: <strong lang="es">{q.answer}</strong>
      </p>
    )}
    <p>{q.explanation}</p>
    <MemoryHint text={q.memoryHint} />
    {productive && <PracticeReview q={q} value={value} checked={checked} />}
    {q.audio && (
      <details>
        <summary>Read the transcript</summary>
        <p lang="es">{q.audio}</p>
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
