import { Eyebrow } from "../../design-system/Eyebrow";
import { FieldNote } from "../../design-system/FieldNote";
import { Button } from "../../design-system/Button";
import { countWords, writingHints } from "../../data/progress";
import type { Question } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { MemoryHint } from "../MemoryHint";

const NOTE = "text-[14px] leading-[1.8] text-[#63784e] mt-[8px]";

const TONE = {
  success: {
    box: "border-[#dce5cc] bg-[#f1f6e8]",
    icon: "bg-[#e0ebd1] text-[#8ba768]",
    heading: "text-[#6f8a52]",
    paragraph: "text-[#63784e]",
  },
  needsWork: {
    box: "border-[#ead7b9] bg-[#faf1e3]",
    icon: "bg-[#f1dfc5] text-[#bf955f]",
    heading: "text-[#aa7b4a]",
    paragraph: "text-[#8d6d48]",
  },
};

type WritingNotesProps = { q: Question; value: string };

const WritingNotes = ({ q, value }: WritingNotesProps) => {
  const words = countWords(value);
  const hints = writingHints(value);

  return (
    <div className="mt-[18px]">
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
      <FieldNote className="mt-[8px]">
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
    <div className="rounded-[8px] border border-[#e4e9d7] bg-[#fffdf6] p-[18px_20px] mt-[18px] max-md:p-[15px]">
      <Eyebrow>One possible answer</Eyebrow>
      <p
        lang="es"
        className="m-[10px_0_17px] text-[15px] leading-[1.9] text-[#687b51] max-md:text-[14px]"
      >
        {q.answer}
      </p>
    </div>
    {q.kind !== "speak" && <WritingNotes q={q} value={value} />}
    <FieldNote className="mt-[13px]">
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
  <div className="flex items-center justify-between gap-[20px] mt-[20px] max-md:flex-wrap max-md:gap-[15px]">
    <small className="text-[12px] leading-[1.7] text-[#96a480]">
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
  const paragraph = `text-[14px] leading-[1.8] mt-[13px] ${tone.paragraph}`;

  return (
    <div
      className={`feedback rounded-[10px] border p-[22px] mt-[24px] max-md:p-[20px_17px] ${tone.box}`}
      role="status"
    >
      <div className="flex items-center gap-[10px]">
        <span
          className={`flex h-[30px] w-[30px] items-center justify-center rounded-full ${tone.icon}`}
        >
          <Icon name={needsWork ? "repeat" : productive ? "pen" : "check"} />
        </span>
        <h3
          className={`font-semibold tracking-[-0.3px] text-[16px] max-md:text-[15px] max-sm:text-[14px] ${tone.heading}`}
        >
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
        <details className="text-[14px] text-[#889c71] mt-[17px]">
          <summary className="cursor-pointer">Read the transcript</summary>
          <p lang="es" className="leading-[1.7] mt-[10px]">
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
