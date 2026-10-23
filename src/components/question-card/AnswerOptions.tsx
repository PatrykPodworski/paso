import { Icon } from "../../design-system/Icon";
import { PRESSABLE } from "../../design-system/pressable";

export const OPTION_KEY =
  "flex shrink-0 items-center justify-center rounded-sm border border-sage-200 bg-white text-sage-400";

const OPTION =
  "answer-option flex items-center rounded-lg border text-left leading-relaxed enabled:hover:border-sage-300 enabled:hover:bg-sage-50";

const SIZE = {
  few: "gap-3.5 py-3.5 px-4 min-h-15 text-sm max-md:gap-3 max-md:p-3 max-md:min-h-14",
  many: "gap-3.5 p-2.5 min-h-15 text-sm max-md:gap-1.5 max-md:min-h-14 max-md:text-xs",
};

const KEY_SIZE = {
  few: "w-6 h-6 text-xs",
  many: "w-6 h-6 text-xs max-md:w-5 max-md:h-5 max-md:text-2xs",
};

// Stylesheet order, not class order, decides between two utilities of one property,
// so every state picks its own colours instead of overriding a default. The same holds
// for PRESSABLE's disabled opacity, hence `!` on the revealed answers.
const tone = (picked: boolean, right: boolean, wrong: boolean) =>
  wrong
    ? "incorrect border-coral-500 bg-sand-50 text-coral-600 disabled:opacity-100!"
    : right
      ? "correct border-olive-500 bg-sage-100 text-olive-700 disabled:opacity-100!"
      : picked
        ? "border-olive-500 bg-sage-100"
        : "border-sage-200 bg-white";

type OptionProps = {
  option: string;
  index: number;
  layout: keyof typeof SIZE;
  picked: boolean;
  right: boolean;
  wrong: boolean;
  feedback: boolean;
  onChoose: (option: string) => void;
};

const Option = ({
  option,
  index,
  layout,
  picked,
  right,
  wrong,
  feedback,
  onChoose,
}: OptionProps) => (
  <button
    type="button"
    className={`${PRESSABLE} ${OPTION} ${SIZE[layout]} ${tone(picked, right, wrong)} ${picked ? "ring ring-olive-500" : ""}`}
    onClick={() => onChoose(option)}
    disabled={feedback}
    aria-pressed={picked}
  >
    <span
      className={`${OPTION_KEY} ${KEY_SIZE[layout]} ${picked ? "border-olive-600! bg-olive-600! text-white!" : ""}`}
      aria-hidden="true"
    >
      {index + 1}
    </span>
    <span>{option}</span>
    {right && <Icon name="check" className="ml-auto" />}
    {!feedback && picked && (
      <span className="ml-auto h-3 w-3 shrink-0 rounded-full border border-olive-500 bg-olive-500 inset-ring-3 inset-ring-sage-100" />
    )}
  </button>
);

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
  const layout = options.length > 4 ? "many" : "few";

  return (
    <div
      className={`grid gap-2.5 mt-4 mx-0 mb-6 ${layout === "many" ? "many-options grid-cols-2" : ""}`}
    >
      {options.map((option, i) => (
        <Option
          key={option}
          option={option}
          index={i}
          layout={layout}
          picked={answer === option}
          right={feedback && option === correctAnswer}
          wrong={wrong && answer === option}
          feedback={feedback}
          onChoose={onChoose}
        />
      ))}
    </div>
  );
};
