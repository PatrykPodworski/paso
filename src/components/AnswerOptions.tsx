import { Icon } from "./Icon";
export const AnswerOptions = ({
  options,
  correctAnswer,
  answer,
  feedback,
  correct,
  onChoose,
}: {
  options: string[];
  correctAnswer: string;
  answer: string;
  feedback: boolean;
  correct: boolean | null;
  onChoose: (option: string) => void;
}) => {
  const wrong = feedback && correct === false;
  return (
    <div className={`answer-options ${options.length > 4 ? "many-options" : ""}`}>
      {options.map((option, i) => {
        const picked = answer === option;
        const right = feedback && option === correctAnswer;
        return (
          <button
            type="button"
            key={option}
            className={`answer-option ${picked ? "selected" : ""} ${right ? "correct" : ""} ${wrong && picked ? "incorrect" : ""}`}
            onClick={() => onChoose(option)}
            disabled={feedback}
            aria-pressed={picked}
          >
            <span className="option-key" aria-hidden="true">
              {i + 1}
            </span>
            <span>{option}</span>
            {right && <Icon name="check" />}
            {!feedback && picked && <span className="selection-dot" />}
          </button>
        );
      })}
    </div>
  );
};
