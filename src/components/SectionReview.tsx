import { Button } from "../design-system/Button";
import { Eyebrow } from "../design-system/Eyebrow";
import { Panel } from "../design-system/Panel";
import { mockSections } from "../data/mock";
import { countWords, isCorrect } from "../data/progress";
import type { Question } from "../data/types";
import { Icon } from "../design-system/Icon";

type Props = {
  sectionIndex: number;
  score: number;
  answers: Record<string, string>;
  onNext: () => void;
};

const statusIcons = { neutral: "pen", good: "check", bad: "x" };

const responseWords = (q: Question, answer: string) =>
  countWords(q.kind === "form" ? answer.replace(/^.*?: /gm, "") : answer);

export const SectionReview = ({ sectionIndex, score, answers, onNext }: Props) => {
  const section = mockSections[sectionIndex];
  const modelLabel = sectionIndex < 2 ? "Correct answer" : "One possible response";

  return (
    <Panel className="section-review">
      <Eyebrow>{section.title.toUpperCase()} · SECTION REVIEW</Eyebrow>
      <h2>{sectionIndex < 2 ? `${score} out of 25.` : "Your practice is ready to review."}</h2>
      <p>
        {sectionIndex < 2
          ? "Correct answers earn one point. Wrong or unanswered questions earn zero, with no penalty."
          : "Open responses require human judgment. Compare your response with the model and cover every requested point."}
      </p>
      <div className="button-row">
        <Button variant="primary" onClick={onNext}>
          {sectionIndex === 3
            ? "See my results"
            : sectionIndex === 2
              ? "Continue to speaking preparation"
              : `Continue to ${mockSections[sectionIndex + 1].title.toLowerCase()}`}
          <Icon name="arrow" />
        </Button>
      </div>
      <div className="answer-review-list">
        {section.questions.map((q, i) => {
          const answer = answers[q.id] || "";
          const status = sectionIndex > 1 ? "neutral" : isCorrect(q, answer) ? "good" : "bad";

          return (
            <details key={q.id}>
              <summary>
                <span className={`review-status ${status}`}>
                  <Icon name={statusIcons[status]} size={16} />
                </span>
                <span>
                  {i + 1}. {q.prompt}
                </span>
              </summary>
              <div>
                <p>
                  Your answer: <strong lang="es">{answer || "Not answered"}</strong>
                </p>
                <p>
                  {modelLabel}: <strong lang="es">{q.answer}</strong>
                </p>
                <p>{q.explanation}</p>
                {q.audio && <p lang="es">Transcript: {q.audio}</p>}
                {q.minWords && (
                  <p>
                    Response length: {responseWords(q, answer)} words. Target: {q.minWords}–
                    {q.maxWords}.
                  </p>
                )}
                {q.checklist?.map((c) => (
                  <p key={c}>□ {c}</p>
                ))}
              </div>
            </details>
          );
        })}
      </div>
    </Panel>
  );
};
