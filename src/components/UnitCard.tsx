import { TONE } from "./tone";
import { Eyebrow } from "../design-system/Eyebrow";
import type { Lesson, Progress, Unit } from "../data/types";
import { AudioButton } from "./audio/AudioButton";
import { Icon } from "../design-system/Icon";
import { PRESSABLE } from "../design-system/pressable";

type Props = {
  unit: Unit;
  onPath?: boolean;
  index: number;
  progress: Progress;
  start: (l: Lesson) => void;
  expanded: boolean;
  onExpand: () => void;
};

// Each pair is what the old `.x` / `.path-stop .x` media cascades resolved to per breakpoint.
const SUMMARY =
  "flex items-center w-full text-left border-0 bg-transparent hover:bg-sage-50 gap-3.5 max-xl:gap-3 max-lg:gap-3.5 p-5 max-xl:p-4 max-lg:p-5";

const ICON =
  "flex items-center justify-center shrink-0 rounded-xl w-12 h-12 max-xl:w-10 max-xl:h-11";

const TITLE = "mt-1.5 leading-tight text-lg max-xl:text-base";

const SUBTITLE = "mt-1 text-sage-700 text-xs max-xl:text-2xs max-lg:text-xs max-md:text-2xs";

const STATUS = "flex items-center text-2xs text-sage-500 gap-3.5 max-xl:gap-2";

const EXPANDED =
  "border-t border-t-sage-100 pt-0 px-5 pb-3 max-xl:pt-2 max-xl:px-3.5 max-xl:pb-3 max-lg:pt-0 max-lg:px-5 max-lg:pb-3";

const GOALS =
  "flex max-xl:hidden max-lg:flex flex-wrap gap-y-1.5 gap-x-3.5 xl:gap-y-2 xl:gap-x-3.5 py-3.5 xl:py-4";

const LESSON_LIST =
  "relative before:absolute before:top-5 before:bottom-6 before:border-l before:border-dashed before:border-sage-200 before:left-4 max-xl:before:left-3";

const ROW =
  "relative flex items-center w-full text-left border-0 bg-transparent hover:bg-sage-50 gap-3 max-xl:gap-2 py-3 px-0 max-xl:py-2 max-xl:px-0 max-lg:py-2.5 max-lg:px-0 max-md:py-3 max-md:px-0";

const NODE =
  "relative z-1 flex items-center justify-center shrink-0 rounded-full border w-9 h-9 max-xl:w-7 max-xl:h-7";

const NODE_STATE = {
  current: "bg-sand-200 border-sand-300 text-sand-500",
  completed: "bg-sage-200 border-sage-200 text-olive-700",
  upcoming: "bg-sage-50 border-sage-200 text-sage-500",
};

const ROW_TITLE =
  "block font-semibold text-sage-800 text-sm max-xl:text-xs max-lg:text-sm max-md:text-xs";

const ROW_SUBTITLE = "block mt-0.5 text-sage-700 text-2xs xl:leading-normal max-lg:text-xs";

const LENGTH = "flex items-center text-sage-700 gap-3 text-2xs max-lg:text-xs";

// Phone and tablet tails that differ between the Today list and a path stop.
const PLACE = {
  today: {
    eyebrow: "unit" as const,
    card: "",
    summary: "max-md:py-5 max-md:px-4 max-sm:py-5 max-sm:px-3 max-sm:gap-2.5",
    icon: "max-md:w-11 max-md:h-11 max-sm:w-10 max-sm:h-10",
    iconSvg: "",
    title: "max-sm:text-base",
    subtitle: "",
    status: "",
    expanded: "max-sm:px-3",
    goals: "",
    list: "",
    row: "max-sm:gap-2",
    node: "",
    nodeSvg: "",
    rowTitle: "",
    rowSubtitle: "max-md:text-2xs",
    length: "max-md:text-2xs max-sm:gap-0.5",
    lengthSvg: "",
  },
  path: {
    eyebrow: "pathUnit" as const,
    card: "flex-1 min-w-0",
    summary: "max-md:py-3.5 max-md:px-3 max-md:gap-2.5 max-sm:gap-2",
    icon: "max-md:w-9 max-md:h-10 max-sm:w-8 max-sm:h-8",
    iconSvg: "max-md:w-5",
    title: "max-sm:text-sm",
    subtitle: "max-sm:hidden",
    status: "max-sm:hidden",
    expanded: "max-md:px-3 max-sm:p-2.5",
    goals: "max-sm:hidden",
    list: "max-sm:before:left-3",
    row: "max-sm:gap-1.5",
    node: "max-sm:w-6 max-sm:h-6",
    nodeSvg: "max-sm:w-3",
    rowTitle: "max-sm:text-xs",
    rowSubtitle: "max-md:text-2xs",
    length: "max-md:text-2xs max-md:gap-1.5 max-sm:gap-0.5",
    lengthSvg: "max-sm:hidden",
  },
};

export const UnitCard = ({
  unit,
  onPath = false,
  index,
  progress,
  start,
  expanded,
  onExpand,
}: Props) => {
  const done = unit.lessons.filter((l) => progress.completed[l.id]).length;
  const at = PLACE[onPath ? "path" : "today"];

  return (
    <article
      className={`unit-card border rounded-lg bg-white overflow-hidden ${expanded ? "border-sage-200 shadow-md shadow-olive-700/2" : "border-sage-200"} ${at.card}`}
    >
      <button
        type="button"
        className={`${PRESSABLE} unit-summary ${SUMMARY} ${at.summary}`}
        onClick={onExpand}
        aria-expanded={expanded}
      >
        <div className={`${ICON} ${at.icon} ${TONE[unit.color]}`}>
          <Icon name={unit.icon} size={25} className={at.iconSvg} />
        </div>
        <div className="flex-1 min-w-0">
          <Eyebrow variant={at.eyebrow}>
            UNIT {String(index + 1).padStart(2, "0")} <i className="not-italic px-1">·</i>{" "}
            {unit.spanish}
          </Eyebrow>
          <h3 className={`font-semibold tracking-tight ${TITLE} ${at.title}`}>{unit.title}</h3>
          <p className={`leading-relaxed ${SUBTITLE} ${at.subtitle}`}>{unit.subtitle}</p>
        </div>
        <div className={`${STATUS} ${at.status}`}>
          <span className="flex items-center gap-1 whitespace-nowrap max-xl:text-2xs max-lg:text-xs max-md:hidden">
            {done === 4 ? (
              <>
                <Icon name="check" size={14} />
                Complete
              </>
            ) : done ? (
              `${done}/4 lessons`
            ) : (
              "4 lessons"
            )}
          </span>
          <Icon name={expanded ? "down" : "chevron"} size={17} />
        </div>
      </button>
      {expanded && (
        <div className={`${EXPANDED} ${at.expanded}`}>
          <div className={`${GOALS} ${at.goals}`}>
            {unit.goals.map((g) => (
              <span key={g} className="inline-flex items-center gap-1 text-sage-700 text-2xs">
                <Icon name="check" size={13} className="w-2.5 text-sage-500" />
                {g}
              </span>
            ))}
          </div>
          <div className={`${LESSON_LIST} ${at.list}`}>
            {unit.lessons.map((l, i) => {
              const completed = !!progress.completed[l.id];
              const state = completed ? "completed" : i === 0 ? "current" : "upcoming";

              return (
                <button
                  type="button"
                  key={l.id}
                  className={`${PRESSABLE} ${ROW} ${at.row}`}
                  onClick={() => start(l)}
                >
                  <div className={`${NODE} ${NODE_STATE[state]} ${at.node}`}>
                    <Icon name={completed ? "check" : l.icon} size={17} className={at.nodeSvg} />
                  </div>
                  <span className="flex-1">
                    <strong className={`${ROW_TITLE} ${at.rowTitle}`}>{l.title}</strong>
                    <small className={`${ROW_SUBTITLE} ${at.rowSubtitle}`}>{l.subtitle}</small>
                  </span>
                  <span className={`${LENGTH} ${at.length}`}>
                    {l.minutes} min{" "}
                    <Icon
                      name={i === 0 && !completed ? "play" : "chevron"}
                      size={15}
                      className={at.lengthSvg}
                    />
                  </span>
                </button>
              );
            })}
          </div>
          <details className="mt-2.5 xl:mt-3.5 border-t border-t-sage-100 pt-2.5 xl:pt-3.5 text-sage-700">
            <summary className="flex items-center gap-1.5 cursor-pointer list-none text-2xs max-lg:text-xs max-sm:text-2xs">
              <Icon name="spark" size={15} />A little pattern to remember
            </summary>
            <p className="leading-relaxed text-xs my-2 text-sage-700">{unit.tip}</p>
            <div lang="es" className="flex items-center justify-between text-sm text-sage-800">
              {unit.example}
              <AudioButton compact text={unit.example} label="Listen to the unit example" />
            </div>
          </details>
        </div>
      )}
    </article>
  );
};
