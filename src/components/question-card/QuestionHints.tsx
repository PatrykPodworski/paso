import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { TextLink } from "../../design-system/TextLink";

type Props = {
  hints: string[];
  answer: string;
  feedback: boolean;
  onHint: () => void;
};

// Each press shows the next hint; the press after the last hint reveals the answer.
export const QuestionHints = ({ hints, answer, feedback, onHint }: Props) => {
  const [shown, setShown] = useState(0);
  const reveal = useRef<HTMLParagraphElement>(null);
  const revealed = shown > hints.length;

  const next = () => {
    // The pressed control unmounts with the reveal, so focus moves to the answer.
    flushSync(() => setShown(shown + 1));
    reveal.current?.focus();
    onHint();
  };

  return (
    <div className="mbe-5" aria-live="polite">
      {shown > 0 && (
        <div className="flex flex-col gap-2 rounded-sm border-s-3 border-border bg-muted py-4 px-5 text-sm leading-relaxed text-foreground">
          <ol className="flex list-decimal flex-col gap-1.5 ps-5">
            {hints.slice(0, shown).map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ol>
          {revealed && (
            <p ref={reveal} tabIndex={-1} className="font-medium">
              Answer: <span lang="es">{answer}</span>
            </p>
          )}
        </div>
      )}
      {!feedback && !revealed && (
        <TextLink
          type="button"
          className="mbs-2.5 text-xs! font-normal! text-muted-foreground!"
          onClick={next}
        >
          {shown === 0
            ? "Show a hint"
            : shown < hints.length
              ? "Show another hint"
              : "Show the answer"}
        </TextLink>
      )}
    </div>
  );
};
