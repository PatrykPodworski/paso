import { useEffect, useState } from "react";
import { Panel } from "../../design-system/Panel";
import { TextLink } from "../../design-system/TextLink";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { examSections } from "../../data/mock";
import { sharesRecording } from "../../data/sharesRecording";
import { stopAudio } from "../audio/playback";
import { QuestionCard } from "../question-card/QuestionCard";
import type { MockRun, MockRunPatch, Question } from "../../data/types";
import { draftAnswers } from "./draftAnswers";
import { SpeakingTask } from "./SpeakingTask";
import type { ChangeRun } from "./useMockRun";

type Props = {
  run: MockRun;
  change: ChangeRun;
  confirm: boolean;
  setConfirm: (confirm: boolean) => void;
  onEnd: () => void;
};

export const ExamRunning = ({ run, change, confirm, setConfirm, onEnd }: Props) => {
  const section = examSections(run.variants)[run.section];
  const q = section.questions[run.index];
  const last = section.questions.length - 1;
  const answers = { ...run.answers, ...draftAnswers(run) };
  // Plays of each recording, by its text: the questions that share one count them together.
  const [plays, setPlays] = useState<Record<string, number>>({});
  const audio = q.audio;

  // Leaving the exam page stops the recording, which the shared player leaves running.
  useEffect(() => stopAudio, []);

  // The recording keeps playing only on a question that shares it.
  const leaveFor = (next: Question | undefined) => {
    if (!sharesRecording(q, next)) {
      stopAudio();
    }
  };

  // Moves to the next question, or asks to finish the section after the last one.
  const advance = (patch: MockRunPatch = {}) => {
    change({ ...patch, section: run.section, index: Math.min(run.index + 1, last) });

    if (run.index === last) {
      setConfirm(true);
    }
  };

  return (
    <Panel className="px-7 pt-5 pb-5 max-md:p-4">
      <div className="flex justify-between gap-2.5 border-b border-border pb-3.5 text-xs text-muted-foreground">
        <span>{q.task}</span>
        <strong>
          {run.index + 1} / {section.questions.length}
        </strong>
      </div>
      {q.kind === "live" ? (
        <SpeakingTask
          key={`${run.section}-${run.index}`}
          q={q}
          run={run}
          change={change}
          onNext={() => advance()}
        />
      ) : (
        <QuestionCard
          key={`${run.section}-${run.index}`}
          q={q}
          seed={run.seed}
          exam
          draft={run.drafts[q.id] ?? run.answers[q.id] ?? ""}
          onDraft={(text) => change({ drafts: { [q.id]: text } })}
          plays={
            audio
              ? {
                  count: plays[audio] ?? 0,
                  onPlayed: () => setPlays((p) => ({ ...p, [audio]: (p[audio] ?? 0) + 1 })),
                }
              : undefined
          }
          onSubmit={(answer) => {
            leaveFor(section.questions[run.index + 1]);
            advance({ answers: { [q.id]: answer } });
          }}
        />
      )}
      <div className="mt-5 flex items-center justify-between gap-3.5 border-t border-border pt-4 max-md:flex-wrap max-md:gap-4">
        <TextLink
          disabled={run.index === 0}
          onClick={() => {
            leaveFor(section.questions[run.index - 1]);
            change({ section: run.section, index: run.index - 1 });
          }}
        >
          ← Previous question
        </TextLink>
        <TextLink
          onClick={() => {
            leaveFor(section.questions[run.index + 1]);

            if (run.index === last) {
              setConfirm(true);
            } else {
              change({ section: run.section, index: run.index + 1 });
            }
          }}
        >
          Skip for now →
        </TextLink>
        <Button variant="outline" className="max-md:w-full" onClick={() => setConfirm(true)}>
          Finish section
        </Button>
      </div>
      <Dialog open={confirm} onOpenChange={(open) => !open && setConfirm(false)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Finish {section.title.toLowerCase()}?</DialogTitle>
            <DialogDescription>
              {section.questions.filter((q) => !answers[q.id]).length} unanswered. After finishing,
              answers in this section cannot be changed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" size="lg" />}>Keep working</DialogClose>
            <Button size="lg" onClick={onEnd}>
              Finish & review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Panel>
  );
};
