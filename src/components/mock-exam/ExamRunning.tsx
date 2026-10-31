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
import { mockSections } from "../../data/mock";
import { stopAudio } from "../audio/playback";
import { QuestionCard } from "../question-card/QuestionCard";
import type { Run, SetRun } from "./useMockRun";

type Props = {
  run: Run;
  setRun: SetRun;
  confirm: boolean;
  setConfirm: (confirm: boolean) => void;
  onEnd: () => void;
};

export const ExamRunning = ({ run, setRun, confirm, setConfirm, onEnd }: Props) => {
  const section = mockSections[run.section];
  const q = section.questions[run.index];

  return (
    <Panel className="px-7 pt-5 pb-5 max-md:p-4">
      <div className="flex justify-between gap-2.5 border-b border-sage-200 pb-3.5 text-xs text-sage-400">
        <span>{q.task}</span>
        <strong>
          {run.index + 1} / {section.questions.length}
        </strong>
      </div>
      <QuestionCard
        key={`${run.section}-${run.index}`}
        q={q}
        exam
        draft={run.drafts[q.id] ?? run.answers[q.id] ?? ""}
        onDraft={(text) => setRun((r) => ({ ...r, drafts: { ...r.drafts, [q.id]: text } }))}
        onSubmit={(answer) => {
          stopAudio();

          setRun((r) => ({
            ...r,
            answers: { ...r.answers, [q.id]: answer },
            index: Math.min(r.index + 1, section.questions.length - 1),
          }));

          if (run.index === section.questions.length - 1) {
            setConfirm(true);
          }
        }}
      />
      <div className="mt-5 flex items-center justify-between gap-3.5 border-t border-sage-200 pt-4 max-md:flex-wrap max-md:gap-4">
        <TextLink
          disabled={run.index === 0}
          onClick={() => {
            stopAudio();
            setRun((r) => ({ ...r, index: r.index - 1 }));
          }}
        >
          ← Previous question
        </TextLink>
        <TextLink
          onClick={() => {
            stopAudio();

            if (run.index === section.questions.length - 1) {
              setConfirm(true);
            } else {
              setRun((r) => ({ ...r, index: r.index + 1 }));
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
              {section.questions.filter((q) => !run.answers[q.id]).length} unanswered. After
              finishing, answers in this section cannot be changed.
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
