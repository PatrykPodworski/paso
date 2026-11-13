import type { Question } from "../../../data/types";
import { ResultMark } from "../../../design-system/ResultMark";
import { AnswerComparison } from "../../AnswerComparison";

type Props = { question: Question; answer: string; correct: boolean };

export const ObjectiveResponse = ({ question, answer, correct }: Props) => (
  <div className="flex items-start gap-3">
    <ResultMark
      result={correct ? "correct" : "wrong"}
      label={correct ? "Correct" : "Incorrect"}
      size={20}
    />
    <div className="flex flex-col gap-1">
      <p className="font-medium">{question.prompt}</p>
      <AnswerComparison answer={answer} correct={question.answer} />
    </div>
  </div>
);
