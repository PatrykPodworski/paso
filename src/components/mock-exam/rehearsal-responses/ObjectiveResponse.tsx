import type { Question } from "../../../data/types";
import { ResultMark } from "../../../design-system/ResultMark";

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
      <p className="text-muted-foreground">
        Your answer:{" "}
        <strong className="font-medium text-foreground" lang="es">
          {answer || "No answer"}
        </strong>
      </p>
      <p className="text-muted-foreground">
        Right answer:{" "}
        <strong className="font-medium text-foreground" lang="es">
          {question.answer}
        </strong>
      </p>
    </div>
  </div>
);
