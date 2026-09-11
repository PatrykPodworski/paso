import { Button } from "../design-system/Button";
import { useState } from "react";
import type { Attempt, Lesson, Progress } from "../data/types";
import { Icon } from "./Icon";
import { Dialog } from "./Dialog";
import { QuestionCard } from "./QuestionCard";
import { stopAudio } from "./Audio";
export const LessonSession = ({
  lesson,
  progress,
  onClose,
  onAttempt,
  onComplete,
  onDraft,
}: {
  lesson: Lesson;
  progress: Progress;
  onClose: () => void;
  onAttempt: (attempt: Attempt) => void;
  onComplete: (score: number, total: number) => void;
  onDraft: (id: string, text: string) => void;
}) => {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<(boolean | null)[]>([]);
  const [finished, setFinished] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [assisted, setAssisted] = useState(0);
  const question = lesson.questions[index];
  // Objective exercises are new attempts, not editable writing drafts.
  const keepDraft = question.kind === "write" || question.kind === "form";
  const close = () => {
    stopAudio();
    if (index > 0 && !finished) {
      setConfirmExit(true);
    } else {
      onClose();
    }
  };
  const submit = (answer: string, correct: boolean | null, help: boolean) => {
    void answer;
    // A reading passage keeps playing across the questions that share it.
    if (!question.passage || lesson.questions[index + 1]?.passage !== question.passage) {
      stopAudio();
    }
    const next = [...results, correct];
    setResults(next);
    if (help) {
      setAssisted((a) => a + 1);
    }
    if (index === lesson.questions.length - 1) {
      setFinished(true);
      onComplete(next.filter((r) => r === true).length, next.filter((r) => r !== null).length);
    } else {
      setIndex((i) => i + 1);
    }
  };
  return (
    <Dialog label={lesson.title} onClose={close} className="lesson-dialog">
      <header className="lesson-header">
        <button className="icon-button" onClick={close} aria-label="Close lesson">
          <Icon name="x" />
        </button>
        <div>
          <span className="eyebrow">PASO · YOUR LEARNING PATH</span>
          <h3>{lesson.title}</h3>
        </div>
        <span className="lesson-counter">
          {finished ? lesson.questions.length : index + 1} / {lesson.questions.length}
        </span>
      </header>
      <div className="lesson-progress">
        <div style={{ width: `${finished ? 100 : (index / lesson.questions.length) * 100}%` }} />
      </div>
      {confirmExit && (
        <div className="exit-confirm">
          <Icon name="book" size={40} />
          <h2>Leave this lesson?</h2>
          <p>
            Your submitted answers and writing drafts are saved. You can restart the lesson any
            time.
          </p>
          <div className="button-row">
            <Button variant="secondary" onClick={() => setConfirmExit(false)}>
              Keep learning
            </Button>
            <Button variant="primary" onClick={onClose}>
              Save & leave
            </Button>
          </div>
        </div>
      )}
      {finished ? (
        <div className="session-complete">
          <div className="completion-art">
            <span>✦</span>
            <Icon name="flag" size={50} />
            <span>✧</span>
          </div>
          <span className="eyebrow">ONE STEP CLOSER</span>
          <h2>Look at you go.</h2>
          <p>Another little piece of Spanish, yours to keep.</p>
          <div className="completion-stats">
            <div>
              <strong>
                {results.filter((r) => r).length}
                <small>/{results.filter((r) => r !== null).length}</small>
              </strong>
              <span>objective answers</span>
            </div>
            <div>
              <strong>{results.filter((r) => r === null).length}</strong>
              <span>creative practices</span>
            </div>
            <div>
              <strong>{results.filter((r) => r === false).length}</strong>
              <span>moments to review</span>
            </div>
          </div>
          {assisted > 0 && (
            <p className="field-note">{assisted} answers used transcript assistance.</p>
          )}
          <p>
            {results.some((r) => r === false)
              ? "Your mistakes are waiting in Practice studio, with explanations and another chance."
              : "A little practice every day goes a long way."}
          </p>
          <Button variant="primary" className="mt-[25px]" onClick={onClose}>
            Back to my journey
            <Icon name="arrow" />
          </Button>
        </div>
      ) : (
        <div hidden={confirmExit}>
          <QuestionCard
            key={question.id}
            q={question}
            onSubmit={submit}
            onEvaluated={(answer, correct, assisted) => {
              const q = lesson.questions[index];
              onAttempt({
                id: crypto.randomUUID(),
                questionId: q.id,
                skill: q.skill,
                answer,
                correct,
                assisted,
                at: new Date().toISOString(),
              });
            }}
            draft={keepDraft ? progress.drafts[question.id] || "" : ""}
            onDraft={keepDraft ? (text) => onDraft(question.id, text) : undefined}
          />
        </div>
      )}
    </Dialog>
  );
};
