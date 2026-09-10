import { useEffect, useRef, useState } from "react";
import type { Question } from "../data/types";
import { countWords, isCorrect, writingHints } from "../data/progress";
import { AudioButton, stopAudio } from "./Audio";
import type { AudioHandle } from "./Audio";
import { Icon } from "./Icon";
import { MemoryHint } from "./MemoryHint";
import { Recorder } from "./Recorder";
export const QuestionCard = ({
  q,
  onSubmit,
  onEvaluated,
  exam = false,
  draft = "",
  onDraft,
}: {
  q: Question;
  onSubmit: (answer: string, correct: boolean | null, assisted: boolean) => void;
  onEvaluated?: (answer: string, correct: boolean | null, assisted: boolean) => void;
  exam?: boolean;
  draft?: string;
  onDraft?: (text: string) => void;
}) => {
  const heading = useRef<HTMLHeadingElement>(null);
  const answerAudio = useRef<AudioHandle>(null);
  const listeningAudio = useRef<AudioHandle>(null);
  const [recording, setRecording] = useState(false);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    const dialog = heading.current?.closest("dialog");
    if (dialog) {
      dialog.scrollTop = 0;
    }
  }, [q.id]);
  const [answer, setAnswer] = useState(draft);
  const [selected, setSelected] = useState<number[]>([]);
  const [feedback, setFeedback] = useState(false);
  const [transcript, setTranscript] = useState(false);
  const [assisted, setAssisted] = useState(false);
  const [checks, setChecks] = useState<number[]>([]);
  const [spoken, setSpoken] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    try {
      const parsed = JSON.parse(draft);
      return parsed &&
        typeof parsed === "object" &&
        !Array.isArray(parsed) &&
        Object.values(parsed).every((v) => typeof v === "string")
        ? parsed
        : {};
    } catch {
      return {};
    }
  });
  const productive = ["write", "speak", "form"].includes(q.kind);
  const singleChoice = q.kind === "choice" || q.kind === "listen";
  const pronunciation = q.pronunciation || q.audio || q.passage || q.answer;
  const built = selected.map((i) => q.tokens![i]).join(" ");
  const formText = (q.fields || []).map((f) => fieldValues[f.label] || "").join(" ");
  const value =
    q.kind === "order"
      ? built
      : q.kind === "form"
        ? formText
        : q.kind === "speak" && spoken
          ? "Practised aloud. Audio must be reviewed from the downloaded recording."
          : answer;
  const submission =
    q.kind === "form"
      ? (q.fields || []).map((f) => `${f.label}: ${fieldValues[f.label] || ""}`).join("\n")
      : value;
  const correct = productive ? null : isCorrect(q, value);
  const words = countWords(value);
  const hints = writingHints(value);
  const canSubmit =
    q.kind === "speak"
      ? !recording && (spoken || checks.length > 0)
      : q.kind === "form"
        ? q.fields?.every((f) => fieldValues[f.label]?.trim())
        : q.kind === "order"
          ? selected.length === q.tokens?.length
          : !!answer.trim();
  const setText = (text: string) => {
    setAnswer(text);
    onDraft?.(text);
  };
  const submit = (choice?: string) => {
    const valid = choice === undefined ? canSubmit : !q.options || q.options.includes(choice);
    if (!valid || feedback) {
      return;
    }
    const submitted = choice ?? submission;
    const result = choice ? isCorrect(q, choice) : correct;
    if (exam) {
      onSubmit(submitted, result, assisted);
      return;
    }
    onEvaluated?.(submitted, result, assisted);
    setFeedback(true);
    // Keep the player mounted so playback starts inside the answer gesture.
    // Read the Spanish model even after a mistake, never the incorrect answer.
    if (q.kind !== "listen") {
      (q.audio ? listeningAudio : answerAudio).current?.play();
    }
  };
  return (
    <div className="question-card">
      <div className="question-kind">
        <span className={`skill-dot ${q.skill}`} />
        {q.skill} <span> / </span>
        {q.kind === "listen"
          ? "Listen closely"
          : q.kind === "order"
            ? "Build a sentence"
            : productive
              ? "Your turn"
              : "A small step forward"}
      </div>
      <div className="question-heading">
        <h2 ref={heading} tabIndex={-1}>
          {q.prompt}
        </h2>
        <div className="question-pronunciation" hidden={!q.audio && !feedback}>
          {q.audio ? (
            <AudioButton
              ref={listeningAudio}
              compact
              text={q.audio}
              label="Play Spanish audio"
              autoPlay={q.kind === "listen"}
              limit={exam ? 2 : undefined}
            />
          ) : !exam ? (
            <AudioButton
              ref={answerAudio}
              compact
              text={pronunciation}
              label="Play Spanish audio"
            />
          ) : null}
        </div>
      </div>
      {q.image && (
        <img
          className="question-scene"
          src={`/illustrations/${q.image}.svg`}
          alt={
            q.image === "cafe"
              ? "Illustrated café counter with coffee and bread"
              : q.image === "town"
                ? "A neighborhood with a park, pharmacy and train station"
                : "A train waiting at a station"
          }
        />
      )}
      {q.passage && (
        <div className="reading-passage" lang="es">
          <span className="paper-clip" aria-hidden="true" />
          <p>{q.passage}</p>
        </div>
      )}
      {q.audio && (
        <>
          {!exam && (
            <button
              type="button"
              className="text-link transcript-toggle"
              onClick={() => {
                setTranscript((t) => !t);
                setAssisted(true);
              }}
            >
              {transcript ? "Hide transcript" : "Need a hand? Show transcript"}
            </button>
          )}
          {transcript && (
            <div className="transcript" lang="es">
              {q.audio}
              <small>
                Transcript assistance is recorded; this answer will not count toward unassisted
                accuracy.
              </small>
            </div>
          )}
        </>
      )}
      {q.visual && (
        <div className="vocab-visual" role="img" aria-label="Vocabulary illustration">
          {q.visual}
        </div>
      )}
      {q.options && (
        <div className={`answer-options ${q.options.length > 4 ? "many-options" : ""}`}>
          {q.options.map((option, i) => (
            <button
              type="button"
              key={option}
              className={`answer-option ${answer === option ? "selected" : ""} ${feedback && option === q.answer ? "correct" : ""} ${feedback && answer === option && correct === false ? "incorrect" : ""}`}
              onClick={() => {
                setText(option);
                submit(option);
              }}
              disabled={feedback}
              aria-pressed={answer === option}
            >
              <span className="option-key" aria-hidden="true">
                {String.fromCharCode(65 + i)}
              </span>
              <span>{option}</span>
              {feedback && option === q.answer && <Icon name="check" />}
              {!feedback && answer === option && <span className="selection-dot" />}
            </button>
          ))}
        </div>
      )}
      {q.kind === "order" && (
        <div className="sentence-builder">
          <div className="sentence-tray" aria-label="Your sentence">
            {selected.length === 0 && <span>Tap the words below to build your sentence…</span>}
            {selected.map((index, pos) => (
              <button
                key={pos}
                type="button"
                disabled={feedback}
                onClick={() => setSelected((v) => v.filter((_, i) => i !== pos))}
                lang="es"
              >
                {q.tokens![index]}
                <Icon name="x" size={12} />
              </button>
            ))}
          </div>
          <div className="word-bank">
            {q.tokens?.map((token, i) => (
              <button
                type="button"
                lang="es"
                key={i}
                onClick={() => {
                  const next = [...selected, i];
                  setSelected(next);
                  const sentence = next.map((j) => q.tokens![j]).join(" ");
                  if (next.length === q.tokens!.length && isCorrect(q, sentence)) {
                    submit(sentence);
                  }
                }}
                disabled={feedback || selected.includes(i)}
              >
                {token}
              </button>
            ))}
          </div>
        </div>
      )}
      {(q.kind === "type" || q.kind === "write") && (
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
      )}
      {q.kind === "form" && (
        <div className="form-fields">
          {q.fields?.map((f) => (
            <label key={f.label}>
              {f.label}
              <input
                lang="es"
                value={fieldValues[f.label] || ""}
                onChange={(e) => {
                  const next = { ...fieldValues, [f.label]: e.target.value };
                  setFieldValues(next);
                  onDraft?.(JSON.stringify(next));
                }}
                disabled={feedback}
                placeholder={f.example}
              />
            </label>
          ))}
          <p className="field-note">
            {words} words · target {q.minWords}–{q.maxWords}. Use fictional personal details.
          </p>
        </div>
      )}
      {q.kind === "speak" && (
        <>
          <Recorder
            onRecorded={() => setSpoken(true)}
            onStart={() => {
              setSpoken(false);
              setFeedback(false);
            }}
            onRecordingChange={setRecording}
          />
          {!feedback && (
            <label className="check-row">
              <input
                type="checkbox"
                checked={spoken}
                onChange={(e) => setSpoken(e.target.checked)}
              />
              I practised aloud (with or without a recording).
            </label>
          )}
        </>
      )}
      {productive && !exam && (
        <div className="self-checks">
          <span className="eyebrow">Your self-review checklist</span>
          {q.checklist?.map((c, i) => (
            <label className="check-row" key={c}>
              <input
                type="checkbox"
                checked={checks.includes(i)}
                onChange={() =>
                  setChecks((v) => (v.includes(i) ? v.filter((x) => x !== i) : [...v, i]))
                }
              />
              {c}
            </label>
          ))}
        </div>
      )}
      {productive && !exam && !feedback && (
        <p className="coming-soon">AI feedback on your writing and speaking is coming soon.</p>
      )}
      {!feedback ? (
        <div className="question-footer">
          <span>
            {exam
              ? "Answers are reviewed after the section."
              : productive
                ? "A little imperfect Spanish is progress."
                : "Take your time. Every mistake is a chance to learn."}
          </span>
          {!singleChoice && (
            <button
              type="button"
              className="button primary"
              onClick={() => submit()}
              disabled={!canSubmit}
            >
              {exam ? "Save answer" : productive ? "Review my practice" : "Check answer"}
              <Icon name="arrow" size={18} />
            </button>
          )}
        </div>
      ) : (
        <div className={`feedback ${correct === false ? "needs-work" : "success"}`} role="status">
          <div className="feedback-heading">
            <span className="feedback-icon">
              <Icon name={correct === false ? "repeat" : productive ? "pen" : "check"} />
            </span>
            <h3>
              {productive
                ? "Let’s reflect on your answer"
                : correct
                  ? "¡Muy bien! You’ve got it."
                  : "A good moment to learn."}
            </h3>
          </div>
          {correct === false && (
            <p>
              Your answer: <strong lang="es">{value}</strong>
              <br />
              Correct answer: <strong lang="es">{q.answer}</strong>
            </p>
          )}
          <p>{q.explanation}</p>
          <MemoryHint text={q.memoryHint} />
          {productive && (
            <>
              <div className="model-answer">
                <span className="eyebrow">One possible answer</span>
                <p lang="es">{q.answer}</p>
              </div>
              {q.kind !== "speak" && (
                <div className="writing-notes">
                  <p>
                    {words < (q.minWords || 0)
                      ? `Your response is short (${words} words). Aim for ${q.minWords}–${q.maxWords} words and develop the missing points.`
                      : words > (q.maxWords || Infinity)
                        ? `You wrote ${words} words. Practise keeping the response within ${q.minWords}–${q.maxWords} words.`
                        : `Your word count (${words}) is within the practice target.`}
                  </p>
                  {hints.map((h) => (
                    <p key={h}>
                      <Icon name="info" size={16} /> {h}
                    </p>
                  ))}
                  <p className="field-note">
                    {hints.length
                      ? "These are targeted checks, not a complete correction."
                      : "No issue found by the small set of pattern checks. This does not mean every sentence is correct."}{" "}
                    A teacher can assess the full response.
                  </p>
                </div>
              )}
              <p className="field-note">
                {checks.length}/{q.checklist?.length || 0} self-review points checked. Productive
                practice is saved without a numerical grade.
              </p>
            </>
          )}
          {q.audio && (
            <details>
              <summary>Read the transcript</summary>
              <p lang="es">{q.audio}</p>
            </details>
          )}
          <div className="feedback-bottom">
            <small>
              {correct === false
                ? "Added to your mistake review."
                : productive
                  ? "Your practice is saved."
                  : assisted
                    ? "Completed with transcript assistance."
                    : "Keep taking those little steps."}
            </small>
            {productive && (
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  stopAudio();
                  setFeedback(false);
                }}
              >
                Revise my answer
              </button>
            )}
            <button
              type="button"
              className="button primary"
              autoFocus
              onClick={() => onSubmit(submission, correct, assisted)}
            >
              Continue
              <Icon name="arrow" size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
