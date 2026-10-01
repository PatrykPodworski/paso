import type { Question } from "../../data/types";

type Props = {
  q: Question;
  answer: string;
  feedback: boolean;
  words: number;
  setText: (text: string) => void;
  submit: () => void;
};

export const WritingArea = ({ q, answer, feedback, words, setText, submit }: Props) => (
  <div className="mt-[20px]">
    <label htmlFor="written-answer" className="block text-[14px] text-[#93a17e] mb-[10px]">
      Your answer in Spanish
    </label>
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
    <div className="flex items-center justify-between gap-[12px] mt-[11px] max-md:flex-wrap">
      <div className="flex flex-wrap gap-[5px]">
        {["á", "é", "í", "ó", "ú", "ü", "ñ", "¿", "¡"].map((c) => (
          <button
            type="button"
            key={c}
            className="h-[27px] w-[25px] rounded-[4px] border border-[#e0e6d4] bg-[#f5f8ed] p-0 text-[14px] text-[#93a47a]"
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
          className={`word-count whitespace-nowrap text-[13px] ${
            words < q.minWords || words > (q.maxWords || Infinity)
              ? "outside text-[#b69a67]"
              : "text-[#7d9660]"
          }`}
        >
          {words} / {q.minWords}–{q.maxWords} words
        </span>
      )}
    </div>
  </div>
);
