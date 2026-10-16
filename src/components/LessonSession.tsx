import { CompletionArt } from "./CompletionArt";
import { ButtonRow } from "../design-system/ButtonRow";
import { Eyebrow } from "../design-system/Eyebrow";
import { Button } from "../design-system/Button";
import { useState } from "react";
import type { Attempt, Lesson, Progress } from "../data/types";
import { Icon } from "../design-system/Icon";
import { IconButton } from "../design-system/IconButton";
import { Dialog } from "../design-system/Dialog";
import { ProgressTrack } from "../design-system/ProgressTrack";
import { QuestionCard } from "./question-card/QuestionCard";
import { stopAudio } from "./audio/playback";
import { FieldNote } from "../design-system/FieldNote";
import { CompletionStats } from "./CompletionStats";

type Props = {
  lesson: Lesson;
  progress: Progress;
  onClose: () => void;
  onAttempt: (attempt: Attempt) => void;
  onComplete: (score: number, total: number) => void;
  onDraft: (id: string, text: string) => void;
};

export const LessonSession = ({
  lesson,
  progress,
  onClose,
  onAttempt,
  onComplete,
  onDraft,
}: Props) => {
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
    <Dialog
      label={lesson.title}
      onClose={close}
      className="w-202 max-md:mx-3 max-md:w-auto max-md:max-w-none"
    >
      <header className="flex items-center gap-4 py-5 px-6 max-md:p-4 max-md:gap-3">
        <IconButton onClick={close} aria-label="Close lesson">
          <Icon name="x" />
        </IconButton>
        <div className="flex-1">
          <Eyebrow variant="small" className="mb-1">
            PASO · YOUR LEARNING PATH
          </Eyebrow>
          <h3 className="font-semibold tracking-tight text-sm">{lesson.title}</h3>
        </div>
        <span className="text-sm text-sage-400 max-md:text-xs">
          {finished ? lesson.questions.length : index + 1} / {lesson.questions.length}
        </span>
      </header>
      <ProgressTrack
        value={finished ? lesson.questions.length : index}
        max={lesson.questions.length}
        label="Lesson progress"
      />
      {confirmExit && (
        <div className="py-12 px-7 text-center">
          <Icon name="book" size={40} className="mx-auto text-olive-500 mb-5" />
          <h2 className="font-serif font-semibold tracking-tight leading-tight text-3xl">
            Leave this lesson?
          </h2>
          <p className="leading-relaxed text-sm text-sage-500 max-w-112 mt-3.5 mx-auto mb-6">
            Your submitted answers and writing drafts are saved. You can restart the lesson any
            time.
          </p>
          <ButtonRow className="justify-center">
            <Button variant="secondary" onClick={() => setConfirmExit(false)}>
              Keep learning
            </Button>
            <Button variant="primary" onClick={onClose}>
              Save & leave
            </Button>
          </ButtonRow>
        </div>
      )}
      {finished ? (
        <div className="py-12 px-7 text-center max-md:py-9 max-md:px-5">
          <CompletionArt icon="flag" sparkles />
          <Eyebrow>ONE STEP CLOSER</Eyebrow>
          <h2 className="font-serif font-semibold tracking-tight leading-tight text-4xl my-3 mx-0">
            Look at you go.
          </h2>
          <p className="leading-relaxed text-sm text-sage-500 mt-3">
            Another little piece of Spanish, yours to keep.
          </p>
          <CompletionStats
            stats={[
              [
                "objective answers",
                <>
                  {results.filter((r) => r).length}
                  <small className="text-base text-sage-400">
                    /{results.filter((r) => r !== null).length}
                  </small>
                </>,
              ],
              ["creative practices", results.filter((r) => r === null).length],
              ["moments to review", results.filter((r) => r === false).length],
            ]}
          />
          {assisted > 0 && (
            <FieldNote className="mt-3">{assisted} answers used transcript assistance.</FieldNote>
          )}
          <p className="leading-relaxed text-sm text-sage-500 mt-3">
            {results.some((r) => r === false)
              ? "Your mistakes are waiting in Practice studio, with explanations and another chance."
              : "A little practice every day goes a long way."}
          </p>
          <Button variant="primary" className="mt-6" onClick={onClose}>
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
