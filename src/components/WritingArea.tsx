import type { Question } from "../data/types";

export const WritingArea = ({
  q,
  answer,
  feedback,
  words,
  setText,
  submit,
}: {
  q: Question;
  answer: string;
  feedback: boolean;
  words: number;
  setText: (text: string) => void;
  submit: () => void;
}) => (
  <div className="writing-area">
    <label htmlFor="written-answer">Your answer in Spanish</label>
    {q.kind === "write" ? (
      <textarea
        id="written-answer"
        lang="es"
        value={answer}
        onChange={(e) => setText(e.target.value)}
        disabled={feedback}
        placeholder="Hola…"
        rows={6}
      />
    ) : (
      <input
        id="written-answer"
        lang="es"
        value={answer}
        onChange={(e) => setText(e.target.value)}
        disabled={feedback}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
        placeholder="Escribe aquí…"
        autoComplete="off"
      />
    )}
    <div className="writing-tools">
      <div className="accent-keys">
        {["á", "é", "í", "ó", "ú", "ü", "ñ", "¿", "¡"].map((c) => (
          <button
            type="button"
            key={c}
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
          className={
            words < q.minWords || words > (q.maxWords || Infinity)
              ? "word-count outside"
              : "word-count"
          }
        >
          {words} / {q.minWords}–{q.maxWords} words
        </span>
      )}
    </div>
  </div>
);
