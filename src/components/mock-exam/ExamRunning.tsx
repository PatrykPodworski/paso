import { ButtonRow } from "../../design-system/ButtonRow";
import { Panel } from "../../design-system/Panel";
import { Button } from "../../design-system/Button";
import { TextLink } from "../../design-system/TextLink";
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
    <Panel className="px-[30px] pt-[22px] pb-[20px] [&_.question-card]:px-0 [&_.question-card]:pt-[26px] [&_.question-card]:pb-0 max-md:p-[18px] max-md:[&_.question-card]:pt-[20px] max-md:[&_.question-heading_h2]:text-[25px]">
      <div className="flex justify-between gap-[10px] border-b border-sage-200 pb-[15px] text-[13px] text-[#9aa88b] max-md:text-[12px]">
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
      <div className="mt-[22px] flex items-center justify-between gap-[15px] border-t border-sage-200 pt-[18px] max-md:flex-wrap max-md:gap-[17px]">
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
          className="max-md:w-full"
          onClick={() => setConfirm(true)}
        >
          Finish section
        </Button>
      </div>
      {confirm && (
        <div className="mt-[20px] rounded-[10px] bg-[#f4ebd6] p-[23px]" role="alert">
          <h3 className="text-[17px] font-semibold tracking-[-0.3px]">
            Finish {section.title.toLowerCase()}?
          </h3>
          <p className="leading-[1.7] my-[12px] text-[14px]">
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
