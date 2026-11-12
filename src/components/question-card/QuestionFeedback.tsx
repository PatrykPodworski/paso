import { Eyebrow } from "../../design-system/Eyebrow";
import { FieldNote } from "../../design-system/FieldNote";
import { Button } from "../ui/button";
import {
  accentMistakes,
  accentOnlyAnswer,
  missingQuestionMarks,
  notedAnswer,
} from "../../data/progress";
import type { Question } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { ResultMark } from "../../design-system/ResultMark";
import { MemoryHint } from "../MemoryHint";
import { AnswerComparison } from "../AnswerComparison";

const PANEL = "rounded-lg border p-5 mbs-6 max-md:py-5 max-md:px-4";

const TONE = {
  success: {
    box: "border-success/20 bg-success/10",
    icon: "bg-success/15 text-success",
    heading: "text-success",
    paragraph: "text-foreground",
  },
  needsWork: {
    box: "border-destructive/20 bg-destructive/5",
    icon: "bg-destructive/10 text-destructive",
    heading: "text-destructive",
    paragraph: "text-foreground",
  },
};

type PracticeReviewProps = { q: Question; checked: number };

const PracticeReview = ({ q, checked }: PracticeReviewProps) => (
  <>
    <div className="rounded-lg border border-border bg-card py-4 px-5 mt-4 max-md:p-3.5">
      <Eyebrow>One possible answer</Eyebrow>
      <p lang="es" className="mt-2.5 mx-0 mb-4 text-sm leading-loose text-foreground">
        {q.answer}
      </p>
    </div>
    <FieldNote className="mt-3">
      {checked}/{q.checklist?.length || 0} self-review points checked. Productive practice is saved
      without a numerical grade.
    </FieldNote>
  </>
);

type FeedbackHeadingProps = { correct: boolean | null; productive: boolean };

const FeedbackHeading = ({ correct, productive }: FeedbackHeadingProps) => {
  const needsWork = correct === false;
  const tone = needsWork ? TONE.needsWork : TONE.success;

  return (
    <div className="flex items-center gap-2.5">
      {needsWork || productive ? (
        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${tone.icon}`}>
          <Icon name={needsWork ? "repeat" : "pen"} />
        </span>
      ) : (
        <ResultMark result="correct" size={28} />
      )}
      <h3 className={`font-semibold tracking-tight text-base max-md:text-sm ${tone.heading}`}>
        {productive
          ? "Let’s reflect on your answer"
          : correct
            ? "¡Muy bien! You’ve got it."
            : "A good moment to learn."}
      </h3>
    </div>
  );
};

type AccentNoteProps = { accepted: string; value: string };

const accentPhrase = (kind: string, letters: string[]) =>
  letters.length === 0
    ? []
    : [`${kind} accent${letters.length > 1 ? "s" : ""} on ${letters.join(", ")}`];

const AccentNote = ({ accepted, value }: AccentNoteProps) => {
  const { missing, extra } = accentMistakes(accepted, value);
  const label = [...accentPhrase("missing", missing), ...accentPhrase("extra", extra)].join("; ");

  return <FieldNote className="mt-3">{label.charAt(0).toUpperCase() + label.slice(1)}.</FieldNote>;
};

type FeedbackBottomProps = {
  // Wrong, or correct with an accent or ¿ ? note.
  toReview: boolean;
  productive: boolean;
  assisted: boolean;
  onRevise: () => void;
  onContinue: () => void;
};

const FeedbackBottom = ({
  toReview,
  productive,
  assisted,
  onRevise,
  onContinue,
}: FeedbackBottomProps) => (
  <div className="flex items-center justify-between gap-5 mt-5 max-md:flex-wrap max-md:gap-3.5">
    <small className="text-xs leading-relaxed text-muted-foreground">
      {toReview
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
        variant="outline"
        size="lg"
        className="max-md:ml-auto"
        onClick={onRevise}
      >
        Revise my answer
      </Button>
    )}
    <Button type="button" size="lg" className="max-md:ml-auto" autoFocus onClick={onContinue}>
      Continue
      <Icon name="arrow" />
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
  const bottom = (
    <FeedbackBottom
      toReview={correct === false || notedAnswer(q, value)}
      productive={productive}
      assisted={assisted}
      onRevise={onRevise}
      onContinue={onContinue}
    />
  );

  const needsWork = correct === false;
  const tone = needsWork ? TONE.needsWork : TONE.success;
  const paragraph = `text-sm leading-relaxed mt-3 ${tone.paragraph}`;
  const typed = q.kind === "type";
  const accentAnswer = accentOnlyAnswer(q, value);

  return (
    <div className={`${PANEL} ${tone.box}`} role="status">
      <FeedbackHeading correct={correct} productive={productive} />
      {(needsWork || accentAnswer) && (
        <AnswerComparison className="mbs-3" answer={value} correct={accentAnswer ?? q.answer} />
      )}
      <p className={paragraph}>{q.explanation}</p>
      {accentAnswer && <AccentNote accepted={accentAnswer} value={value} />}
      {correct && typed && missingQuestionMarks(q, value) && (
        <FieldNote className="mt-3">
          Spanish questions open with ¿ and close with ?: <span lang="es">{q.answer}</span>
        </FieldNote>
      )}
      <MemoryHint text={q.memoryHint} />
      {productive && <PracticeReview q={q} checked={checked} />}
      {q.audio && (
        <details className="text-sm text-muted-foreground mt-4">
          <summary className="cursor-pointer">Read the transcript</summary>
          <p lang="es" className="leading-relaxed mt-2.5">
            {q.audio}
          </p>
        </details>
      )}
      {bottom}
    </div>
  );
};
