import { ButtonRow } from "../../design-system/ButtonRow";
import { Panel } from "../../design-system/Panel";
import { Button } from "../../design-system/Button";
import { TextLink } from "../../design-system/TextLink";
import { mockSections } from "../../data/mock";
import { stopAudio } from "../audio/playback";
import { QuestionCard } from "../question-card/QuestionCard";
import type { MockRun, MockRunPatch } from "../../data/types";
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
  const section = mockSections[run.section];
  const q = section.questions[run.index];
  const last = section.questions.length - 1;

  // Moves to the next question, or asks to finish the section after the last one.
  const advance = (patch: MockRunPatch = {}) => {
    change({ ...patch, section: run.section, index: Math.min(run.index + 1, last) });

    if (run.index === last) {
      setConfirm(true);
    }
  };

  return (
    <Panel className="px-7 pt-5 pb-5 max-md:p-4">
      <div className="flex justify-between gap-2.5 border-b border-sage-200 pb-3.5 text-xs text-sage-400">
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
          exam
          draft={run.drafts[q.id] ?? run.answers[q.id] ?? ""}
          onDraft={(text) => change({ drafts: { [q.id]: text } })}
          onSubmit={(answer) => {
            stopAudio();
            advance({ answers: { [q.id]: answer } });
          }}
        />
      )}
      <div className="mt-5 flex items-center justify-between gap-3.5 border-t border-sage-200 pt-4 max-md:flex-wrap max-md:gap-4">
        <TextLink
          disabled={run.index === 0}
          onClick={() => {
            stopAudio();
            change({ section: run.section, index: run.index - 1 });
          }}
        >
          ← Previous question
        </TextLink>
        <TextLink
          onClick={() => {
            stopAudio();

            if (run.index === last) {
              setConfirm(true);
            } else {
              change({ section: run.section, index: run.index + 1 });
            }
          }}
        >
          Skip for now →
        </TextLink>
        <Button
          variant="secondary"
          size="small"
          className="max-md:w-full"
          onClick={() => setConfirm(true)}
        >
          Finish section
        </Button>
      </div>
      {confirm && (
        <div className="mt-5 rounded-lg bg-sand-100 p-6" role="alert">
          <h3 className="text-base font-semibold tracking-tight">
            Finish {section.title.toLowerCase()}?
          </h3>
          <p className="leading-relaxed my-3 text-sm">
            {section.questions.filter((q) => !run.answers[q.id]).length} unanswered. After
            finishing, answers in this section cannot be changed.
          </p>
          <ButtonRow>
            <Button variant="secondary" onClick={() => setConfirm(false)}>
              Keep working
            </Button>
            <Button variant="primary" onClick={onEnd}>
              Finish & review
            </Button>
          </ButtonRow>
        </div>
      )}
    </Panel>
  );
};
