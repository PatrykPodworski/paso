import { ButtonRow } from "../design-system/ButtonRow";
import { Button } from "../design-system/Button";
import { useState } from "react";
import type { Attempt, Lesson, ProgressSnapshot } from "../data/types";
import { Eyebrow } from "../design-system/Eyebrow";
import { Icon } from "../design-system/Icon";
import { IconButton } from "../design-system/IconButton";
import { Dialog } from "../design-system/Dialog";
import { ProgressTrack } from "../design-system/ProgressTrack";
import { LessonStep } from "./LessonStep";
import { LessonComplete } from "./LessonComplete";
import { stopAudio } from "./audio/playback";
import { pathPlace } from "../data/path";
import { usePreloadPictures } from "./usePreloadPictures";
import { resumeIndex } from "../data/resumeIndex";
import { sharesRecording } from "../data/sharesRecording";

type Props = {
  lesson: Lesson;
  progress: ProgressSnapshot;
  onClose: () => void;
  onAttempt: (attempt: Attempt) => void;
  onComplete: (score: number, total: number) => void;
  onDraft: (id: string, text: string) => void;
  onNext?: () => void;
};

export const LessonSession = ({
  lesson,
  progress,
  onClose,
  onAttempt,
  onComplete,
  onDraft,
  onNext,
}: Props) => {
  // Each question's answer from before this lesson; answers given now must not replace it.
  const [before] = useState(() => progress.questions);
  // A resumed lesson counts the stored answers to the exercises it skips.
  const [start] = useState(() => resumeIndex(lesson, progress));

  const skipped = lesson.questions
    .slice(0, start)
    .filter((q) => q.kind !== "teach")
    .map((q) => before[q.id]);

  const [index, setIndex] = useState(start);
  const [results, setResults] = useState(() => skipped.map((a) => a.correct));
  const [finished, setFinished] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [assisted, setAssisted] = useState(() => skipped.filter((a) => a.assisted).length);
  const [answered, setAnswered] = useState<number | null>(null);
  const question = lesson.questions[index];
  const place = pathPlace(lesson.id);
  const done = before[question.id]?.correct === true && answered !== index;

  usePreloadPictures(lesson.questions);

  const close = () => {
    stopAudio();

    if (index > start && !finished) {
      setConfirmExit(true);
    } else {
      onClose();
    }
  };

  // A teaching card moves on with the results unchanged, so it never counts in the score.
  const moveOn = (next: (boolean | null)[]) => {
    setResults(next);

    if (index === lesson.questions.length - 1) {
      setFinished(true);
      onComplete(next.filter((r) => r === true).length, next.filter((r) => r !== null).length);
    } else {
      setIndex((i) => i + 1);
    }
  };

  const advance = (correct: boolean | null) => moveOn([...results, correct]);

  // A passed exercise moves on with its saved answer, as a resumed lesson does, without a new
  // attempt or check.
  const skip = () => {
    stopAudio();

    if (before[question.id].assisted) {
      setAssisted((a) => a + 1);
    }

    advance(true);
  };

  const submit = (answer: string, correct: boolean | null, help: boolean) => {
    void answer;

    if (!sharesRecording(question, lesson.questions[index + 1])) {
      stopAudio();
    }

    if (help) {
      setAssisted((a) => a + 1);
    }

    advance(correct);
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
            {place ? `UNIT ${place.unit} · LESSON ${place.lesson}` : "PRACTICE"}
          </Eyebrow>
          <h3 className="font-semibold tracking-tight text-sm">{lesson.title}</h3>
        </div>
        <span className="text-sm text-muted-foreground max-md:text-xs">
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
          <Icon name="book" size={40} className="mx-auto text-muted-foreground mb-5" />
          <h2 className="font-heading font-semibold tracking-tight leading-tight text-3xl">
            Leave this lesson?
          </h2>
          <p className="leading-relaxed text-sm text-muted-foreground max-w-112 mt-3.5 mx-auto mb-6">
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
        <LessonComplete results={results} assisted={assisted} onClose={onClose} onNext={onNext} />
      ) : (
        <div hidden={confirmExit}>
          <LessonStep
            key={question.id}
            q={question}
            done={done}
            active={!confirmExit}
            onSkip={skip}
            onContinue={() => moveOn(results)}
            onSubmit={submit}
            onEvaluated={(answer, correct, assisted, grade, noted) => {
              const q = lesson.questions[index];

              setAnswered(index);

              onAttempt({
                id: crypto.randomUUID(),
                questionId: q.id,
                skill: q.skill,
                answer,
                correct,
                assisted,
                ...(grade && { grade }),
                ...(noted && { noted }),
                at: new Date().toISOString(),
              });
            }}
            draft={progress.drafts[question.id]}
            onDraft={(text) => onDraft(question.id, text)}
            previous={before[question.id]}
          />
        </div>
      )}
    </Dialog>
  );
};
