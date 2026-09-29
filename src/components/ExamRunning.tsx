import { Button } from "../design-system/Button";
import { Panel } from "../design-system/Panel";
import { TextLink } from "../design-system/TextLink";
import { mockSections } from "../data/mock";
import { stopAudio } from "./AudioButton";
import { QuestionCard } from "./QuestionCard";

type Props = {
  sectionIndex: number;
  index: number;
  answers: Record<string, string>;
  drafts: Record<string, string>;
  confirm: boolean;
  onDraft: (id: string, text: string) => void;
  onAnswer: (id: string, answer: string) => void;
  onMove: (step: number) => void;
  onConfirm: (open: boolean) => void;
  onEnd: () => void;
};

export const ExamRunning = ({
  sectionIndex,
  index,
  answers,
  drafts,
  confirm,
  onDraft,
  onAnswer,
  onMove,
  onConfirm,
  onEnd,
}: Props) => {
  const section = mockSections[sectionIndex];
  const q = section.questions[index];
  const last = index === section.questions.length - 1;

  return (
    <Panel className="exam-running">
      <div className="exam-question-nav">
        <span>{q.task}</span>
        <strong>
          {index + 1} / {section.questions.length}
        </strong>
      </div>
      <QuestionCard
        key={`${sectionIndex}-${index}`}
        q={q}
        exam
        draft={drafts[q.id] ?? answers[q.id] ?? ""}
        onDraft={(text) => onDraft(q.id, text)}
        onSubmit={(answer) => {
          stopAudio();
          onAnswer(q.id, answer);

          if (last) {
            onConfirm(true);
          }
        }}
      />
      <div className="exam-navigation">
        <TextLink
          disabled={index === 0}
          onClick={() => {
            stopAudio();
            onMove(-1);
          }}
        >
          ← Previous question
        </TextLink>
        <TextLink
          onClick={() => {
            stopAudio();

            if (last) {
              onConfirm(true);
            } else {
              onMove(1);
            }
          }}
        >
          Skip for now →
        </TextLink>
        <Button
          variant="secondary"
          size="small"
          className="max-tablet:w-full"
          onClick={() => onConfirm(true)}
        >
          Finish section
        </Button>
      </div>
      {confirm && (
        <div className="finish-confirm" role="alert">
          <h3>Finish {section.title.toLowerCase()}?</h3>
          <p>
            {section.questions.filter((q) => !answers[q.id]).length} unanswered. After finishing,
            answers in this section cannot be changed.
          </p>
          <div className="button-row">
            <Button variant="secondary" onClick={() => onConfirm(false)}>
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
