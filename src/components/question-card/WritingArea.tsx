import type { Question } from "../../data/types";
import { PRESSABLE } from "../../design-system/pressable";
import { FIELD } from "../../design-system/field";
import { MAX_TEXT } from "../../data/progress";

type Props = {
  q: Question;
  answer: string;
  feedback: boolean;
  words: number;
  setText: (text: string) => void;
  submit: () => void;
};

export const WritingArea = ({ q, answer, feedback, words, setText, submit }: Props) => (
  <div className="mt-5">
    <label htmlFor="written-answer" className="block text-sm text-muted-foreground mb-2.5">
      Your answer in Spanish
    </label>
    {q.kind === "write" ? (
      <textarea
        className={`${FIELD} leading-relaxed`}
        id="written-answer"
        lang="es"
        value={answer}
        maxLength={MAX_TEXT}
        onChange={(e) => setText(e.target.value)}
        disabled={feedback}
        placeholder="Hola…"
        rows={6}
      />
    ) : (
      <input
        className={FIELD}
        id="written-answer"
        lang="es"
        value={answer}
        maxLength={MAX_TEXT}
        onChange={(e) => setText(e.target.value)}
        disabled={feedback}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Escribe aquí…"
        autoComplete="off"
      />
    )}
    <div className="flex items-center justify-between gap-3 mt-2.5 max-md:flex-wrap">
      <div className="flex flex-wrap gap-1">
        {["á", "é", "í", "ó", "ú", "ü", "ñ", "¿", "¡"].map((c) => (
          <button
            type="button"
            key={c}
            className={`${PRESSABLE} h-7 w-6 rounded-sm border border-border bg-muted p-0 text-sm text-foreground`}
            onClick={() => {
              const el = document.getElementById("written-answer") as
                | HTMLInputElement
                | HTMLTextAreaElement;

              const start = el?.selectionStart ?? answer.length;
              const end = el?.selectionEnd ?? start;

              setText(answer.slice(0, start) + c + answer.slice(end));

              requestAnimationFrame(() => {
                el?.focus();
                el?.setSelectionRange(start + 1, start + 1);
              });
            }}
            disabled={feedback}
            aria-label={`Insert ${c}`}
          >
            {c}
          </button>
        ))}
      </div>
      {q.minWords && (
        <span
          className={`word-count whitespace-nowrap text-xs ${
            words < q.minWords || words > (q.maxWords || Infinity)
              ? "outside text-destructive"
              : "text-success"
          }`}
        >
          {words} / {q.minWords}–{q.maxWords} words
        </span>
      )}
    </div>
  </div>
);
