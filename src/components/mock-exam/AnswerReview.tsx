import type { Question } from "../../data/types";
import { countWords, isCorrect } from "../../data/progress";
import { Icon } from "../../design-system/Icon";

type Props = {
  q: Question;
  number: number;
  answer: string | undefined;
  section: number;
};

const verdictLabel = {
  good: "Correct",
  bad: "Incorrect",
  neutral: "Not graded",
};

const status = {
  good: "bg-sage-100 text-olive-600",
  bad: "bg-sand-200 text-coral-600",
  neutral: "bg-lavender-100 text-lavender-500",
};

const LINE = "leading-[1.7] my-[8px] text-[14px]";

export const AnswerReview = ({ q, number, answer, section }: Props) => {
  const verdict = section > 1 ? "neutral" : isCorrect(q, answer || "") ? "good" : "bad";

  return (
    <details className="border-t border-sage-200">
      <summary className="flex cursor-pointer items-center gap-[12px] py-[17px] text-[14px] max-md:leading-[1.7]">
        <span
          role="img"
          aria-label={verdictLabel[verdict]}
          className={`review-status ${verdict} flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full ${status[verdict]}`}
        >
          <Icon name={section > 1 ? "pen" : verdict === "good" ? "check" : "x"} size={16} />
        </span>
        <span>
          {number}. {q.prompt}
        </span>
      </summary>
      <div className="pb-[20px] pl-[40px] text-sage-600 max-md:pl-0">
        <p className={LINE}>
          Your answer: <strong lang="es">{answer || "Not answered"}</strong>
        </p>
        <p className={LINE}>
          {section < 2 ? "Correct answer" : "One possible response"}:{" "}
          <strong lang="es">{q.answer}</strong>
        </p>
        <p className={LINE}>{q.explanation}</p>
        {q.audio && (
          <p className={LINE} lang="es">
            Transcript: {q.audio}
          </p>
        )}
        {q.minWords && (
          <p className={LINE}>
            Response length:{" "}
            {countWords(q.kind === "form" ? (answer || "").replace(/^.*?: /gm, "") : answer || "")}{" "}
            words. Target: {q.minWords}–{q.maxWords}.
          </p>
        )}
        {q.checklist?.map((c) => (
          <p className={LINE} key={c}>
            □ {c}
          </p>
        ))}
      </div>
    </details>
  );
};
