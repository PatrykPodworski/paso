import type { Question } from "../data/types";
import { countWords, isCorrect } from "../data/progress";
import { Icon } from "../design-system/Icon";

type Props = {
  q: Question;
  number: number;
  answer: string | undefined;
  section: number;
};

export const AnswerReview = ({ q, number, answer, section }: Props) => (
  <details>
    <summary>
      <span
        className={`review-status ${section > 1 ? "neutral" : isCorrect(q, answer || "") ? "good" : "bad"}`}
      >
        <Icon name={section > 1 ? "pen" : isCorrect(q, answer || "") ? "check" : "x"} size={16} />
      </span>
      <span>
        {number}. {q.prompt}
      </span>
    </summary>
    <div>
      <p>
        Your answer: <strong lang="es">{answer || "Not answered"}</strong>
      </p>
      <p>
        {section < 2 ? "Correct answer" : "One possible response"}:{" "}
        <strong lang="es">{q.answer}</strong>
      </p>
      <p>{q.explanation}</p>
      {q.audio && <p lang="es">Transcript: {q.audio}</p>}
      {q.minWords && (
        <p>
          Response length:{" "}
          {countWords(q.kind === "form" ? (answer || "").replace(/^.*?: /gm, "") : answer || "")}{" "}
          words. Target: {q.minWords}–{q.maxWords}.
        </p>
      )}
      {q.checklist?.map((c) => (
        <p key={c}>□ {c}</p>
      ))}
    </div>
  </details>
);
