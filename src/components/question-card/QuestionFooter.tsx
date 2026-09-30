import { Button } from "../../design-system/Button";
import type { Question } from "../../data/types";
import { Icon } from "../../design-system/Icon";

type Props = {
  exam: boolean;
  productive: boolean;
  kind: Question["kind"];
  canSubmit: boolean | undefined;
  onCheck: () => void;
};

export const QuestionFooter = ({ exam, productive, kind, canSubmit, onCheck }: Props) => {
  const singleChoice = kind === "choice" || kind === "listen";

  return (
    <div className="question-footer">
      <span>
        {exam
          ? "Answers are reviewed after the section."
          : productive
            ? "A little imperfect Spanish is progress."
            : "Take your time. Every mistake is a chance to learn."}
      </span>
      {!singleChoice && (
        <Button
          type="button"
          variant="primary"
          className="whitespace-nowrap max-tablet:w-full"
          onClick={onCheck}
          disabled={!canSubmit}
        >
          {exam ? "Save answer" : productive ? "Review my practice" : "Check answer"}
          <Icon name="arrow" size={18} />
        </Button>
      )}
    </div>
  );
};
