import { ButtonRow } from "../../design-system/ButtonRow";
import { Button } from "../../design-system/Button";
import { Eyebrow } from "../../design-system/Eyebrow";
import { Panel } from "../../design-system/Panel";
import { mockSections } from "../../data/mock";
import { AnswerReview } from "./AnswerReview";
import { Icon } from "../../design-system/Icon";
import type { MockRun } from "../../data/types";
import { WritingMarks } from "./WritingMarks";

type Props = {
  run: MockRun;
  score: (index: number) => number;
  onNext: () => void;
};

export const SectionReview = ({ run, score, onNext }: Props) => {
  const section = mockSections[run.section];

  return (
    <Panel className="p-8 max-md:p-6">
      <Eyebrow>{section.title.toUpperCase()} · SECTION REVIEW</Eyebrow>
      <h2 className="font-heading font-semibold tracking-tight leading-tight mt-2.5 mb-3.5 text-3xl">
        {run.section < 2 ? `${score(run.section)} out of 25.` : "Your practice is ready to review."}
      </h2>
      <p className="leading-relaxed mb-5 text-sm text-muted-foreground">
        {run.section < 2
          ? "Correct answers earn one point. Wrong or unanswered questions earn zero, with no penalty."
          : run.section === 2
            ? "Get feedback from an AI tutor with a DELE mark from 0 to 3 for each task, and compare your response with the model."
            : "Open responses require human judgment. Compare your response with the model and cover every requested point."}
      </p>
      <ButtonRow>
        <Button variant="primary" onClick={onNext}>
          {run.section === 3
            ? "See my results"
            : run.section === 2
              ? "Continue to speaking preparation"
              : `Continue to ${mockSections[run.section + 1].title.toLowerCase()}`}
          <Icon name="arrow" />
        </Button>
      </ButtonRow>
      {run.section === 2 && <WritingMarks questions={section.questions} answers={run.answers} />}
      <div className="mt-7">
        {section.questions.map((q, i) => (
          <AnswerReview
            key={q.id}
            q={q}
            number={i + 1}
            answer={run.answers[q.id]}
            section={run.section}
          />
        ))}
      </div>
    </Panel>
  );
};
