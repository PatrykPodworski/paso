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
    <div className="flex items-center justify-between gap-[20px] mt-[22px] border-t border-line pt-[22px] max-tablet:flex-col max-tablet:items-stretch max-tablet:gap-[15px] max-tablet:mt-[21px] max-tablet:pt-[18px]">
      <span className="max-w-[300px] text-[13px] leading-[1.7] text-[#75816b] max-laptop:max-w-[210px] max-tablet:max-w-none max-tablet:text-center max-tablet:text-[12px]">
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
