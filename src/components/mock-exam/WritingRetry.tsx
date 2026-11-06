import { FieldNote } from "../../design-system/FieldNote";
import { Notice } from "../../design-system/Notice";
import { Button } from "../ui/button";
import { PasscodeField } from "../writing-review/PasscodeField";
import { problemOf } from "../writing-review/requestReview";
import type { useWritingReviews } from "../writing-review/useWritingReviews";

type Props = {
  reviews: ReturnType<typeof useWritingReviews>;
  // The writing answers that have no mark yet, by question id.
  unmarked: Record<string, string>;
};

// Asks the AI tutor again for the writing marks the results page is missing.
export const WritingRetry = ({ reviews, unmarked }: Props) => {
  const { passcode, setPasscode, needsPasscode, loading, results, check } = reviews;

  const problems = [
    ...new Set(
      Object.values(results).flatMap((result) =>
        "error" in result ? [problemOf(result.error)] : [],
      ),
    ),
  ];

  return (
    <div className="mb-6 flex flex-col gap-3.5 rounded-lg border border-border p-6 text-left max-md:p-5">
      <FieldNote>
        Your writing has no score yet. An AI tutor marks each task from 0 to 3 like a DELE examiner.
        Your answers go to OpenRouter for the marks.
      </FieldNote>
      {needsPasscode && <PasscodeField passcode={passcode} onPasscode={setPasscode} />}
      {problems.map((problem) => (
        <Notice key={problem} as="p">
          {problem}
        </Notice>
      ))}
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="self-start max-sm:self-stretch"
        disabled={loading || !passcode.trim()}
        onClick={() => check(unmarked)}
      >
        {loading ? "Scoring…" : problems.length ? "Try again" : "Score my writing"}
      </Button>
    </div>
  );
};
