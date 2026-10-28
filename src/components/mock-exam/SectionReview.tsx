import { ButtonRow } from "../../design-system/ButtonRow";
import { Button } from "../../design-system/Button";
import { Eyebrow } from "../../design-system/Eyebrow";
import { Panel } from "../../design-system/Panel";
import { mockSections } from "../../data/mock";
import { AnswerReview } from "./AnswerReview";
import { Icon } from "../../design-system/Icon";
import type { Run } from "./useMockRun";

type Props = {
  run: Run;
  score: (index: number) => number;
  onNext: () => void;
};

export const SectionReview = ({ run, score, onNext }: Props) => {
  const section = mockSections[run.section];

  return (
    <Panel className="p-8 max-md:p-6">
      <Eyebrow>{section.title.toUpperCase()} · SECTION REVIEW</Eyebrow>
      <h2 className="font-serif font-semibold tracking-tight leading-tight mt-2.5 mb-3.5 text-3xl">
        {run.section < 2 ? `${score(run.section)} out of 25.` : "Your practice is ready to review."}
      </h2>
      <p className="leading-relaxed mb-5 text-sm text-sage-500">
        {run.section < 2
          ? "Correct answers earn one point. Wrong or unanswered questions earn zero, with no penalty."
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
