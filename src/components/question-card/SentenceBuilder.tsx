import { Icon } from "../../design-system/Icon";

type Props = {
  tokens: string[];
  selected: number[];
  feedback: boolean;
  onRemove: (pos: number) => void;
  onPick: (i: number) => void;
};

export const SentenceBuilder = ({ tokens, selected, feedback, onRemove, onPick }: Props) => (
  <div className="sentence-builder">
    <div className="sentence-tray" aria-label="Your sentence">
      {selected.length === 0 && <span>Tap the words below to build your sentence…</span>}
      {selected.map((index, pos) => (
        <button key={pos} type="button" disabled={feedback} onClick={() => onRemove(pos)} lang="es">
          {tokens[index]}
          <Icon name="x" size={12} />
        </button>
      ))}
    </div>
    <div className="word-bank">
      {tokens.map((token, i) => (
        <button
          type="button"
          lang="es"
          key={i}
          onClick={() => onPick(i)}
          disabled={feedback || selected.includes(i)}
        >
          <span className="option-key" aria-hidden="true">
            {i + 1}
          </span>
          {token}
        </button>
      ))}
    </div>
  </div>
);
