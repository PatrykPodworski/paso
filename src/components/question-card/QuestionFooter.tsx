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
    <div className="flex items-center justify-between gap-5 mt-5 border-t border-sage-200 pt-5 max-md:flex-col max-md:items-stretch max-md:gap-3.5 max-md:pt-4">
      <span className="max-w-75 text-xs leading-relaxed text-sage-700 max-lg:max-w-52 max-md:max-w-none max-md:text-center">
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
          className="whitespace-nowrap max-md:w-full"
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
