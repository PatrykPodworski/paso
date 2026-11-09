import { Button } from "../ui/button";
import type { Question } from "../../data/types";
import { Icon } from "../../design-system/Icon";

type Props = {
  exam: boolean;
  productive: boolean;
  kind: Question["kind"];
  canSubmit: boolean | undefined;
  autoFocus?: boolean;
  onCheck: () => void;
  // Saves a practice writing answer with no review, when there is no passcode for one.
  saveWithoutFeedback?: { enabled: boolean; onSave: () => void };
};

export const QuestionFooter = ({
  exam,
  productive,
  kind,
  canSubmit,
  autoFocus,
  onCheck,
  saveWithoutFeedback,
}: Props) => {
  const singleChoice = kind === "choice" || kind === "listen";

  return (
    <div className="flex items-center justify-between gap-5 mt-5 border-t border-border pt-5 max-md:flex-col max-md:items-stretch max-md:gap-3.5 max-md:pt-4">
      <span className="max-w-75 text-xs leading-relaxed text-muted-foreground max-lg:max-w-52 max-md:max-w-none max-md:text-center">
        {exam
          ? "Answers are reviewed after the section."
          : productive
            ? "A little imperfect Spanish is progress."
            : "Take your time. Every mistake is a chance to learn."}
      </span>
      {!singleChoice && (
        <div className="flex gap-2 max-md:flex-col">
          {saveWithoutFeedback && (
            <Button
              type="button"
              size="lg"
              variant="secondary"
              onClick={saveWithoutFeedback.onSave}
              disabled={!saveWithoutFeedback.enabled}
            >
              Save without feedback
            </Button>
          )}
          <Button
            type="button"
            size="lg"
            onClick={onCheck}
            disabled={!canSubmit}
            autoFocus={autoFocus}
          >
            {exam ? "Save answer" : productive ? "Review my practice" : "Check answer"}
            <Icon name="arrow" />
          </Button>
        </div>
      )}
    </div>
  );
};
