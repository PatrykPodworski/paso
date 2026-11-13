import type { Question } from "../../data/types";
import { answerWords, isCorrect } from "../../data/progress";
import { Icon } from "../../design-system/Icon";
import { ResultMark } from "../../design-system/ResultMark";
import { AnswerComparison } from "../AnswerComparison";

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

const LINE = "leading-relaxed my-2 text-sm";

export const AnswerReview = ({ q, number, answer, section }: Props) => {
  const verdict = section > 1 ? "neutral" : isCorrect(q, answer || "") ? "good" : "bad";

  return (
    <details className="border-t border-border">
      <summary className="flex cursor-pointer items-center gap-3 py-4 text-sm max-md:leading-relaxed">
        {verdict === "neutral" ? (
          <span
            role="img"
            aria-label={verdictLabel[verdict]}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
          >
            <Icon name="pen" size={16} />
          </span>
        ) : (
          <ResultMark
            result={verdict === "good" ? "correct" : "wrong"}
            label={verdictLabel[verdict]}
          />
        )}
        <span>
          {number}. {q.prompt}
        </span>
      </summary>
      <div className="pb-5 pl-10 text-muted-foreground max-md:pl-0">
        {section < 2 ? (
          <AnswerComparison className="my-2" answer={answer || ""} correct={q.answer} />
        ) : (
          <>
            <p className={LINE}>
              Your answer: <strong lang="es">{answer || "Not answered"}</strong>
            </p>
            <p className={LINE}>
              One possible response: <strong lang="es">{q.answer}</strong>
            </p>
          </>
        )}
        <p className={LINE}>{q.explanation}</p>
        {q.audio && (
          <p className={LINE} lang="es">
            Transcript: {q.audio}
          </p>
        )}
        {q.minWords && (
          <p className={LINE}>
            Response length: {answerWords(q, answer || "")} words. Target: {q.minWords}–{q.maxWords}
            .
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
