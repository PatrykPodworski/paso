import type { ComponentProps } from "react";
import { Button } from "../design-system/Button";
import { QuestionView } from "./question-card/QuestionView";
import { TeachingCard } from "./question-card/TeachingCard";

type ViewProps = ComponentProps<typeof QuestionView>;

type Props = Pick<ViewProps, "q" | "active" | "onSubmit" | "onEvaluated" | "previous"> & {
  // The exercise was passed in an earlier session, so the learner may skip it.
  done: boolean;
  draft: string | undefined;
  onDraft: (text: string) => void;
  onSkip: () => void;
  onContinue: () => void;
};

export const LessonStep = ({ q, done, draft, onDraft, onSkip, onContinue, ...view }: Props) => {
  if (q.kind === "teach") {
    return <TeachingCard q={q} onContinue={onContinue} />;
  }

  // Objective exercises are new attempts, not editable writing drafts.
  const keepDraft = q.kind === "write" || q.kind === "form";

  return (
    <>
      {done && (
        <div className="flex items-center justify-between gap-3 pbs-5 px-9 max-md:px-5 max-sm:px-4">
          <span className="text-xs text-muted-foreground">You passed this one before.</span>
          <Button variant="secondary" size="small" onClick={onSkip}>
            Already done, skip
          </Button>
        </div>
      )}
      <QuestionView
        q={q}
        {...view}
        draft={keepDraft ? draft || "" : ""}
        onDraft={keepDraft ? onDraft : undefined}
      />
    </>
  );
};
