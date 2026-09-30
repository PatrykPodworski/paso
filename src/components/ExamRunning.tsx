import { Panel } from "../design-system/Panel";
import { Button } from "../design-system/Button";
import { TextLink } from "../design-system/TextLink";
import { mockSections } from "../data/mock";
import { stopAudio } from "./playback";
import { QuestionCard } from "./question-card/QuestionCard";
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
    <Panel className="exam-running">
      <div className="exam-question-nav">
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
      <div className="exam-navigation">
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
        <Button
          variant="secondary"
          size="small"
          className="max-tablet:w-full"
          onClick={() => setConfirm(true)}
        >
          Finish section
        </Button>
      </div>
      {confirm && (
        <div className="finish-confirm" role="alert">
          <h3>Finish {section.title.toLowerCase()}?</h3>
          <p>
            {section.questions.filter((q) => !run.answers[q.id]).length} unanswered. After
            finishing, answers in this section cannot be changed.
          </p>
          <div className="button-row">
            <Button variant="secondary" onClick={() => setConfirm(false)}>
              Keep working
            </Button>
            <Button variant="primary" onClick={onEnd}>
              Finish & review
            </Button>
          </div>
        </div>
      )}
    </Panel>
  );
};
