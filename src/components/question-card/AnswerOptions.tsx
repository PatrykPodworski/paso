import { Icon } from "../../design-system/Icon";
import { PRESSABLE } from "../../design-system/pressable";

export const OPTION_KEY =
  "flex shrink-0 items-center justify-center rounded-[5px] border border-[#e1e7d7] bg-[#fcfdf8] text-[#a3b28e]";

const OPTION =
  "answer-option flex items-center rounded-[9px] border text-left leading-[1.65] enabled:hover:border-[#b7c7a1] enabled:hover:bg-[#f3f6eb]";

const SIZE = {
  few: "gap-[14px] p-[14px_17px] min-h-[59px] text-[15px] max-md:gap-[12px] max-md:p-[13px] max-md:min-h-[55px] max-md:text-[14px]",
  many: "gap-[14px] p-[11px] min-h-[59px] text-[14px] max-md:gap-[7px] max-md:min-h-[55px] max-md:text-[12px]",
};

const KEY_SIZE = {
  few: "w-[25px] h-[25px] text-[13px]",
  many: "w-[25px] h-[25px] text-[13px] max-md:w-[20px] max-md:h-[20px] max-md:text-[11px]",
};

// Stylesheet order, not class order, decides between two utilities of one property,
// so every state picks its own colours instead of overriding a default. The same holds
// for PRESSABLE's disabled opacity, hence `!` on the revealed answers.
const tone = (picked: boolean, right: boolean, wrong: boolean) =>
  wrong
    ? "incorrect border-[#cf9b73] bg-[#fcf0e2] text-[#ad784f] disabled:opacity-100!"
    : right
      ? "correct border-[#8ea969] bg-[#eef4e3] text-[#66844a] disabled:opacity-100!"
      : picked
        ? "border-[#8ba16d] bg-[#eef3e4]"
        : "border-[#dee5d3] bg-[#fffefa]";

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
    className={`${PRESSABLE} ${OPTION} ${SIZE[layout]} ${tone(picked, right, wrong)} ${picked ? "shadow-[0_0_0_1px_#8ba16d]" : ""}`}
    onClick={() => onChoose(option)}
    disabled={feedback}
    aria-pressed={picked}
  >
    <span
      className={`${OPTION_KEY} ${KEY_SIZE[layout]} ${picked ? "border-[#819964]! bg-[#819964]! text-white!" : ""}`}
      aria-hidden="true"
    >
      {index + 1}
    </span>
    <span>{option}</span>
    {right && <Icon name="check" className="ml-auto" />}
    {!feedback && picked && (
      <span className="ml-auto h-[13px] w-[13px] shrink-0 rounded-full border border-[#8aa171] bg-[#8aa171] shadow-[inset_0_0_0_3px_#eef3e4]" />
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
      className={`grid gap-[11px] m-[17px_0_25px] ${layout === "many" ? "many-options grid-cols-[repeat(2,minmax(0,1fr))]" : ""}`}
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
