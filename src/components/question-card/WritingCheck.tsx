import { Button } from "../../design-system/Button";
import { FieldNote } from "../../design-system/FieldNote";
import { Notice } from "../../design-system/Notice";
import type { Question } from "../../data/types";
import { PasscodeField } from "../writing-review/PasscodeField";
import { problemOf } from "../writing-review/requestReview";
import { useWritingReviews } from "../writing-review/useWritingReviews";
import { WritingFeedback } from "../writing-review/WritingFeedback";

type Props = { q: Question; answer: string };

export const WritingCheck = ({ q, answer }: Props) => {
  const { passcode, setPasscode, needsPasscode, loading, results, check } = useWritingReviews();
  const result = results[q.id];

  return (
    <div className="mbs-4 flex flex-col gap-3.5 rounded-lg border border-sage-200 bg-white px-5 py-4 max-md:p-3.5">
      <FieldNote>
        Get feedback from an AI tutor on every requested point, with corrections and a revised
        version. Your answer goes to OpenRouter for the feedback.
      </FieldNote>
      {needsPasscode && <PasscodeField passcode={passcode} onPasscode={setPasscode} />}
      <Button
        type="button"
        variant="secondary"
        size="compact"
        className="self-start max-sm:self-stretch"
        disabled={loading || !passcode.trim()}
        onClick={() => check({ [q.id]: answer })}
      >
        {loading ? "Checking your writing…" : "Check my writing"}
      </Button>
      {result && "error" in result && <Notice as="p">{problemOf(result.error)}</Notice>}
      {result && "review" in result && (
        <WritingFeedback review={result.review} minWords={q.minWords} maxWords={q.maxWords} />
      )}
    </div>
  );
};
