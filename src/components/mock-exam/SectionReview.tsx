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
    <Panel className="section-review">
      <Eyebrow>{section.title.toUpperCase()} · SECTION REVIEW</Eyebrow>
      <h2>
        {run.section < 2 ? `${score(run.section)} out of 25.` : "Your practice is ready to review."}
      </h2>
      <p>
        {run.section < 2
          ? "Correct answers earn one point. Wrong or unanswered questions earn zero, with no penalty."
          : "Open responses require human judgment. Compare your response with the model and cover every requested point."}
      </p>
      <div className="button-row">
        <Button variant="primary" onClick={onNext}>
          {run.section === 3
            ? "See my results"
            : run.section === 2
              ? "Continue to speaking preparation"
              : `Continue to ${mockSections[run.section + 1].title.toLowerCase()}`}
          <Icon name="arrow" />
        </Button>
      </div>
      <div className="answer-review-list">
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
