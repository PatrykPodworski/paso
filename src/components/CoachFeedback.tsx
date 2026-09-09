import type { CoachReview } from "../data/coach";
import { Icon } from "./Icon";

export const CoachFeedback = ({
  review,
  loading,
  error,
  speaking,
  onRetry,
}: {
  review: CoachReview | null;
  loading: boolean;
  error: string;
  speaking: boolean;
  onRetry: () => void;
}) => (
  <section className="coach-feedback" aria-label="Codex feedback" aria-busy={loading}>
    <div className="coach-heading">
      <span className="coach-emblem">
        <Icon name="spark" size={23} />
      </span>
      <div>
        <span className="eyebrow">YOUR SPANISH COACH</span>
        <h3>A little guidance, just for you.</h3>
      </div>
      <span className="coach-provider">Codex</span>
    </div>
    {loading && (
      <p className="coach-loading" role="status">
        <span />
        Reading your Spanish and checking the task…
      </p>
    )}
    {error && (
      <div className="coach-error" role="status">
        <p>{error}</p>
        <button type="button" className="text-link" onClick={onRetry}>
          Try Codex again <Icon name="repeat" size={16} />
        </button>
      </div>
    )}
    {review && (
      <>
        <p className="coach-summary">{review.summary}</p>
        {review.strengths.length > 0 && (
          <div className="coach-strengths">
            <h4>What’s working</h4>
            <ul>
              {review.strengths.map((strength, i) => (
                <li key={i}>{strength}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="coach-corrections">
          <h4>A few things to practise</h4>
          {review.corrections.length ? (
            review.corrections.map((correction, i) => (
              <article key={i}>
                <div className="coach-correction-pair">
                  <del lang="es">{correction.original}</del>
                  <Icon name="arrow" size={16} />
                  <strong lang="es">{correction.corrected}</strong>
                </div>
                <p>{correction.explanation}</p>
              </article>
            ))
          ) : (
            <p>No specific language corrections suggested for this answer.</p>
          )}
        </div>
        <div className="coach-coverage">
          <h4>The points in your task</h4>
          {review.coverage.map((point, i) => (
            <div key={i}>
              <span
                className={point.met === null ? "self-review" : point.met ? "covered" : "missing"}
              >
                <Icon
                  name={point.met === null ? "headphones" : point.met ? "check" : "pen"}
                  size={17}
                />
                <span className="sr-only">
                  {point.met === null
                    ? "Self-review needed:"
                    : point.met
                      ? "Covered:"
                      : "Still to add:"}
                </span>
              </span>
              <div>
                <strong>{point.point}</strong>
                <p>{point.feedback}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="coach-revision">
          <span className="eyebrow">A SUGGESTED REVISION</span>
          <p lang="es">{review.improvedAnswer}</p>
        </div>
        <div className="coach-next">
          <Icon name="flag" size={20} />
          <p>
            <strong>Your next little step</strong>
            {review.nextStep}
          </p>
        </div>
      </>
    )}
    <p className="coach-footnote">
      {speaking
        ? "Feedback uses your transcript. Pronunciation and spoken fluency need listening and human review."
        : "AI practice feedback can miss things. It is not an official DELE grade."}
    </p>
  </section>
);
