import type { Question } from "../../data/types";
import { AnswerOptions } from "./AnswerOptions";
import { FormFields } from "./FormFields";
import { SentenceBuilder } from "./SentenceBuilder";
import type { Answer } from "./useAnswer";
import { WritingArea } from "./WritingArea";

type Props = {
  q: Question;
  feedback: boolean;
  answer: Answer;
  onChoose: (option: string) => void;
  onPick: (token: number) => void;
  onCheck: () => void;
};

// The input that matches the question kind: options, word tiles, text or form fields.
export const AnswerInput = ({ q, feedback, answer, onChoose, onPick, onCheck }: Props) => (
  <>
    {q.options && (
      <AnswerOptions
        options={q.options}
        correctAnswer={q.answer}
        answer={answer.answer}
        feedback={feedback}
        correct={answer.correct}
        onChoose={onChoose}
      />
    )}
    {q.kind === "order" && (
      <SentenceBuilder
        tokens={q.tokens || []}
        selected={answer.selected}
        feedback={feedback}
        onRemove={(pos) => answer.setSelected((v) => v.filter((_, i) => i !== pos))}
        onPick={onPick}
      />
    )}
    {["type", "write"].includes(q.kind) && (
      <WritingArea
        q={q}
        answer={answer.answer}
        feedback={feedback}
        words={answer.words}
        setText={answer.setText}
        submit={onCheck}
      />
    )}
    {q.kind === "form" && (
      <FormFields
        q={q}
        fieldValues={answer.fieldValues}
        feedback={feedback}
        words={answer.words}
        onFieldChange={answer.setField}
      />
    )}
  </>
);
