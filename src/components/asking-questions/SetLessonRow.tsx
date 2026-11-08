import { exerciseCount } from "../../data/asking-questions/askingQuestions";
import type { SetLesson } from "../../data/asking-questions/setLesson";
import type { ProgressSnapshot } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { PRESSABLE } from "../../design-system/pressable";
import { ResultMark } from "../../design-system/ResultMark";
import { TINT } from "../tone";

type Props = { lesson: SetLesson; progress: ProgressSnapshot; onOpen: () => void };

export const SetLessonRow = ({ lesson, progress, onOpen }: Props) => {
  const last = progress.completed[lesson.id];

  return (
    <button
      type="button"
      className={`${PRESSABLE} flex w-full items-center gap-3.5 max-sm:gap-2.5 rounded-lg border-0 bg-transparent p-3 max-sm:px-2 text-start hover:bg-muted`}
      onClick={onOpen}
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-full ${last ? "" : TINT}`}
      >
        {last ? (
          <ResultMark result="correct" size={40} className="size-full" />
        ) : (
          <Icon name="spark" size={18} />
        )}
      </span>
      <span className="flex-1 min-w-0">
        <strong className="block text-sm font-semibold text-foreground">{lesson.title}</strong>
        <small className="block mbs-0.5 text-xs text-muted-foreground">{lesson.subtitle}</small>
      </span>
      <span className="flex flex-col items-end gap-0.5 text-end text-xs text-muted-foreground">
        <span className="whitespace-nowrap">{exerciseCount(lesson)} exercises</span>
        {last && (
          <span className="whitespace-nowrap text-foreground">
            Last score {last.score}/{last.total}
          </span>
        )}
      </span>
      <Icon name="chevron" size={15} className="shrink-0 text-muted-foreground" />
    </button>
  );
};
