import { Button } from "../../design-system/Button";
import { FieldNote } from "../../design-system/FieldNote";
import { Notice } from "../../design-system/Notice";
import { writingScore } from "../../data/progress";
import type { Question } from "../../data/types";
import { PasscodeField } from "../writing-review/PasscodeField";
import { problemOf } from "../writing-review/requestReview";
import { useWritingReviews } from "../writing-review/useWritingReviews";
import { WritingFeedback } from "../writing-review/WritingFeedback";

type Props = { questions: Question[]; answers: Record<string, string> };

export const WritingMarks = ({ questions, answers }: Props) => {
  const { passcode, setPasscode, needsPasscode, loading, results, check } = useWritingReviews();

  const bands = questions.flatMap((q) => {
    const result = results[q.id];

    return result && "review" in result && result.review.mark ? [result.review.mark.band] : [];
  });

  return (
    <div className="mbs-7 flex flex-col gap-3.5 rounded-lg border border-sage-200 bg-white p-5 max-md:p-4">
      <FieldNote>
        An AI tutor marks each task from 0 to 3 like a DELE examiner and checks every requested
        point. Your answers go to OpenRouter for the feedback.
      </FieldNote>
      {needsPasscode && <PasscodeField passcode={passcode} onPasscode={setPasscode} />}
      <Button
        type="button"
        variant="secondary"
        className="self-start max-sm:self-stretch"
        disabled={loading || !passcode.trim()}
        onClick={() => check(Object.fromEntries(questions.map((q) => [q.id, answers[q.id] ?? ""])))}
      >
        {loading ? "Getting feedback…" : "Get feedback on my writing"}
      </Button>
      {bands.length === questions.length && (
        <p className="font-serif text-2xl font-semibold tracking-tight">
          {writingScore([bands[0], bands[1]])} out of 25 for writing.
        </p>
      )}
      {questions.map((q) => {
        const result = results[q.id];

        return (
          result && (
            <section key={q.id} className="border-bs border-sage-200 pbs-4">
              <h3 className="mbe-3 text-base font-semibold tracking-tight">{q.task}</h3>
              {"error" in result ? (
                <Notice as="p">{problemOf(result.error)}</Notice>
              ) : (
                <WritingFeedback
                  review={result.review}
                  minWords={q.minWords}
                  maxWords={q.maxWords}
                />
              )}
            </section>
          )
        );
      })}
    </div>
  );
};
