import type { Question } from "../../data/types";
import { countWords, isCorrect } from "../../data/progress";
import { Icon } from "../../design-system/Icon";

type Props = {
  q: Question;
  number: number;
  answer: string | undefined;
  section: number;
};

const status = {
  good: "bg-[#e8f0da] text-[#829965]",
  bad: "bg-[#f4e2d1] text-[#bc8358]",
  neutral: "bg-[#ebe8ef] text-[#a298b1]",
};

export const AnswerReview = ({ q, number, answer, section }: Props) => {
  const verdict = section > 1 ? "neutral" : isCorrect(q, answer || "") ? "good" : "bad";

  return (
    <details className="border-t border-line">
      <summary className="flex cursor-pointer items-center gap-[12px] py-[17px] text-[14px] max-tablet:leading-[1.7]">
        <span
          className={`review-status ${verdict} flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-full ${status[verdict]}`}
        >
          <Icon name={section > 1 ? "pen" : verdict === "good" ? "check" : "x"} size={16} />
        </span>
        <span>
          {number}. {q.prompt}
        </span>
      </summary>
      <div className="pb-[20px] pl-[40px] text-[#819271] [&>p]:my-[8px] [&>p]:text-[14px] max-tablet:pl-0">
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
};
