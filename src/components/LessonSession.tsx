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
      className="w-[min(810px,calc(100vw-36px))] max-md:w-[calc(100vw_-_22px)]"
    >
      <header className="flex items-center gap-[16px] p-[22px_26px] max-md:p-[18px] max-md:gap-[12px]">
        <IconButton onClick={close} aria-label="Close lesson">
          <Icon name="x" />
        </IconButton>
        <div className="flex-1">
          <Eyebrow variant="small" className="mb-[5px]">
            PASO · YOUR LEARNING PATH
          </Eyebrow>
          <h3 className="font-semibold tracking-[-0.3px] text-[15px] max-md:text-[14px]">
            {lesson.title}
          </h3>
        </div>
        <span className="text-[14px] text-[#9aa88c] max-md:text-[12px]">
          {finished ? lesson.questions.length : index + 1} / {lesson.questions.length}
        </span>
      </header>
      <ProgressTrack
        value={finished ? lesson.questions.length : index}
        max={lesson.questions.length}
        label="Lesson progress"
      />
      {confirmExit && (
        <div className="p-[50px_30px] text-center">
          <Icon name="book" size={40} className="mx-auto text-[#9eaf85] mb-[22px]" />
          <h2 className="font-serif font-semibold tracking-[-0.7px] leading-[1.25] text-[30px]">
            Leave this lesson?
          </h2>
          <p className="leading-[1.7] text-[15px] text-[#96a483] max-w-[450px] m-[15px_auto_25px]">
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
        <div className="p-[50px_30px] text-center max-md:p-[35px_20px]">
          <CompletionArt icon="flag" sparkles />
          <Eyebrow>ONE STEP CLOSER</Eyebrow>
          <h2 className="font-serif font-semibold tracking-[-0.7px] leading-[1.25] text-[39px] m-[12px_0] max-md:text-[34px]">
            Look at you go.
          </h2>
          <p className="leading-[1.7] text-[14px] text-[#95a080] mt-[13px]">
            Another little piece of Spanish, yours to keep.
          </p>
          <CompletionStats
            stats={[
              [
                "objective answers",
                <>
                  {results.filter((r) => r).length}
                  <small className="text-[16px] text-[#a6b294]">
                    /{results.filter((r) => r !== null).length}
                  </small>
                </>,
              ],
              ["creative practices", results.filter((r) => r === null).length],
              ["moments to review", results.filter((r) => r === false).length],
            ]}
          />
          {assisted > 0 && (
            <FieldNote className="mt-[13px]">
              {assisted} answers used transcript assistance.
            </FieldNote>
          )}
          <p className="leading-[1.7] text-[14px] text-[#95a080] mt-[13px]">
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
