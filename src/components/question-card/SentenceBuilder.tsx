import { Icon } from "../../design-system/Icon";
import { OPTION_KEY } from "./AnswerOptions";
import { PRESSABLE } from "../../design-system/pressable";

const CHIP =
  "flex items-center gap-[8px] rounded-[7px] border border-[#d6e1c7] bg-[#fffefa] p-[10px_13px] text-[15px] shadow-[0_2px_0_#dfe7d2]";

type Props = {
  tokens: string[];
  selected: number[];
  feedback: boolean;
  onRemove: (pos: number) => void;
  onPick: (i: number) => void;
};

export const SentenceBuilder = ({ tokens, selected, feedback, onRemove, onPick }: Props) => (
  <div className="sentence-builder">
    <div
      className="sentence-tray flex min-h-[85px] flex-wrap content-center items-center gap-[9px] rounded-[10px] border border-[#dce5ce] bg-[#f5f8ef] p-[16px] mb-[22px]"
      role="group"
      aria-label="Your sentence"
    >
      {selected.length === 0 && (
        <span className="text-[14px] text-[#a5b393]">
          Tap the words below to build your sentence…
        </span>
      )}
      {selected.map((index, pos) => (
        <button
          key={pos}
          type="button"
          className={`${PRESSABLE} ${CHIP}`}
          disabled={feedback}
          onClick={() => onRemove(pos)}
          lang="es"
        >
          {tokens[index]}
          <Icon name="x" size={12} />
        </button>
      ))}
    </div>
    {/* `!`: otherwise stylesheet order picks between the chip's and PRESSABLE's disabled opacity. */}
    <div
      role="group"
      aria-label="Word bank"
      className="word-bank flex flex-wrap justify-center gap-[10px] mb-[30px]"
    >
      {tokens.map((token, i) => (
        <button
          type="button"
          lang="es"
          key={i}
          className={`${PRESSABLE} ${CHIP} disabled:opacity-[0.22]!`}
          onClick={() => onPick(i)}
          disabled={feedback || selected.includes(i)}
        >
          <span className={`${OPTION_KEY} w-[18px] h-[18px] text-[11px]`} aria-hidden="true">
            {i + 1}
          </span>
          {token}
        </button>
      ))}
    </div>
  </div>
);
