import { Icon } from "../../design-system/Icon";
import { OPTION_KEY } from "./AnswerOptions";
import { PRESSABLE } from "../../design-system/pressable";

const CHIP =
  "flex items-center gap-2 rounded-md border border-sage-200 bg-white py-2.5 px-3 text-sm shadow-2xs shadow-sage-200";

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
      className="sentence-tray flex min-h-21 flex-wrap content-center items-center gap-2 rounded-lg border border-sage-200 bg-sage-50 p-4 mb-5"
      role="group"
      aria-label="Your sentence"
    >
      {selected.length === 0 && (
        <span className="text-sm text-sage-400">Tap the words below to build your sentence…</span>
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
      className="word-bank flex flex-wrap justify-center gap-2.5 mb-7"
    >
      {tokens.map((token, i) => (
        <button
          type="button"
          lang="es"
          key={i}
          className={`${PRESSABLE} ${CHIP} disabled:opacity-20!`}
          onClick={() => onPick(i)}
          disabled={feedback || selected.includes(i)}
        >
          <span className={`${OPTION_KEY} w-4 h-4 text-2xs`} aria-hidden="true">
            {i + 1}
          </span>
          {token}
        </button>
      ))}
    </div>
  </div>
);
