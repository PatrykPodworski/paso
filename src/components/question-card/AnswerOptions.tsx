import { Icon } from "../../design-system/Icon";

export const OPTION_KEY =
  "flex shrink-0 items-center justify-center rounded-[5px] border border-[#e1e7d7] bg-[#fcfdf8] text-[#a3b28e]";

const OPTION =
  "answer-option flex items-center rounded-[9px] border text-left leading-[1.65] [&:hover:not(:disabled)]:border-[#b7c7a1] [&:hover:not(:disabled)]:bg-[#f3f6eb]";

// Stylesheet order, not class order, decides between two utilities of one property,
// so every state picks its own colours instead of overriding a default.
const tone = (picked: boolean, right: boolean, wrong: boolean) =>
  wrong
    ? "incorrect border-[#cf9b73] bg-[#fcf0e2] text-[#ad784f] disabled:opacity-100"
    : right
      ? "correct border-[#8ea969] bg-[#eef4e3] text-[#66844a] disabled:opacity-100"
      : picked
        ? "border-[#8ba16d] bg-[#eef3e4]"
        : "border-[#dee5d3] bg-[#fffefa]";

type Props = {
  options: string[];
  correctAnswer: string;
  answer: string;
  feedback: boolean;
  correct: boolean | null;
  onChoose: (option: string) => void;
};

export const AnswerOptions = ({
  options,
  correctAnswer,
  answer,
  feedback,
  correct,
  onChoose,
}: Props) => {
  const wrong = feedback && correct === false;
  const many = options.length > 4;

  return (
    <div
      className={`grid gap-[11px] m-[17px_0_25px] ${many ? "many-options grid-cols-[repeat(2,minmax(0,1fr))]" : ""}`}
    >
      {options.map((option, i) => {
        const picked = answer === option;
        const right = feedback && option === correctAnswer;

        return (
          <button
            type="button"
            key={option}
            className={`${OPTION} ${
              many
                ? "gap-[14px] p-[11px] min-h-[59px] text-[14px] max-tablet:gap-[7px] max-tablet:min-h-[55px] max-tablet:text-[12px]"
                : "gap-[14px] p-[14px_17px] min-h-[59px] text-[15px] max-tablet:gap-[12px] max-tablet:p-[13px] max-tablet:min-h-[55px] max-tablet:text-[14px]"
            } ${tone(picked, right, wrong && picked)} ${picked ? "shadow-[0_0_0_1px_#8ba16d]" : ""}`}
            onClick={() => onChoose(option)}
            disabled={feedback}
            aria-pressed={picked}
          >
            <span
              className={`${OPTION_KEY} w-[25px] h-[25px] text-[13px] ${
                many ? "max-tablet:w-[20px] max-tablet:h-[20px] max-tablet:text-[11px]" : ""
              } ${picked ? "border-[#819964]! bg-[#819964]! text-white!" : ""}`}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span>{option}</span>
            {right && <Icon name="check" className="ml-auto" />}
            {!feedback && picked && (
              <span className="ml-auto h-[13px] w-[13px] shrink-0 rounded-full border border-[#8aa171] bg-[#8aa171] shadow-[inset_0_0_0_3px_#eef3e4]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
