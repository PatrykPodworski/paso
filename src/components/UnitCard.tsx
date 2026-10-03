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
  "flex items-center w-full text-left border-0 bg-transparent [&:hover]:bg-[#f8f9f2] gap-[15px] max-xl:gap-[12px] max-lg:gap-[15px] p-[22px_20px] max-xl:p-[16px] max-lg:p-[20px]";

const ICON =
  "flex items-center justify-center shrink-0 rounded-[12px] w-[47px] h-[47px] max-xl:w-[40px] max-xl:h-[43px]";

const TITLE =
  "mt-[6px] leading-[1.3] text-[18px] max-xl:text-[16px] max-lg:text-[17px] max-md:text-[16px]";

const SUBTITLE =
  "mt-[5px] text-[#75816b] text-[12px] max-xl:text-[11px] max-lg:text-[13px] max-md:text-[11px]";

const STATUS =
  "flex items-center text-[11px] text-[#939d84] gap-[14px] max-xl:gap-[9px] max-md:gap-[8px]";

const EXPANDED =
  "border-t border-t-[#ebeee3] p-[0_20px_12px] max-xl:p-[8px_15px_12px] max-lg:p-[0_20px_13px]";

const GOALS =
  "flex max-xl:hidden max-lg:flex flex-wrap gap-[6px_14px] xl:gap-[8px_14px] py-[14px] xl:py-[16px]";

const LESSON_LIST =
  "relative before:content-[''] before:absolute before:top-[20px] before:bottom-[23px] before:border-l before:border-dashed before:border-[#d9e1cc] before:left-[17px] max-xl:before:left-[13px]";

const ROW =
  "relative flex items-center w-full text-left border-0 bg-transparent [&:hover]:bg-[#f4f7ed] gap-[12px] max-xl:gap-[9px] p-[13px_0] max-xl:p-[8px_0] max-lg:p-[10px_0] max-md:p-[12px_0]";

const NODE =
  "relative z-[1] flex items-center justify-center shrink-0 rounded-full border w-[35px] h-[35px] max-xl:w-[28px] max-xl:h-[28px]";

const NODE_STATE = {
  current: "bg-[#f0dfc9] border-[#e6caa7] text-[#b78a5a]",
  completed: "bg-[#e1ebd6] border-[#e2e7d9] text-[#658052]",
  upcoming: "bg-[#f3f5ee] border-[#e2e7d9] text-[#95a186]",
};

const ROW_TITLE =
  "block font-semibold text-[#5f7058] text-[14px] max-xl:text-[12px] max-lg:text-[14px] max-md:text-[13px]";

const ROW_SUBTITLE =
  "block mt-[3px] text-[#75816b] text-[11px] xl:leading-[1.5] max-xl:text-[10px] max-lg:text-[12px]";

const LENGTH =
  "flex items-center text-[#75816b] gap-[12px] text-[11px] max-xl:text-[10px] max-lg:text-[12px]";

// Phone and tablet tails that differ between the Today list and a path stop.
const PLACE = {
  today: {
    eyebrow: "unit" as const,
    card: "",
    summary: "max-md:p-[20px_17px] max-sm:p-[20px_13px] max-sm:gap-[11px]",
    icon: "max-md:w-[43px] max-md:h-[45px] max-sm:w-[39px] max-sm:h-[42px]",
    iconSvg: "",
    title: "max-sm:text-[17px]",
    subtitle: "",
    status: "",
    expanded: "max-sm:px-[13px]",
    goals: "",
    list: "",
    row: "max-sm:gap-[8px]",
    node: "",
    nodeSvg: "",
    rowTitle: "",
    rowSubtitle: "max-md:text-[10px]",
    length: "max-md:text-[10px] max-sm:text-[9px] max-sm:gap-[3px]",
    lengthSvg: "",
  },
  path: {
    eyebrow: "pathUnit" as const,
    card: "flex-1 min-w-0",
    summary: "max-md:p-[15px_13px] max-md:gap-[10px] max-sm:gap-[8px]",
    icon: "max-md:w-[35px] max-md:h-[39px] max-sm:w-[31px] max-sm:h-[34px]",
    iconSvg: "max-md:w-[21px]",
    title: "max-sm:text-[15px]",
    subtitle: "max-sm:hidden",
    status: "max-sm:hidden",
    expanded: "max-md:px-[13px] max-sm:p-[10px_11px]",
    goals: "max-sm:hidden",
    list: "max-sm:before:left-[12px]",
    row: "max-sm:gap-[7px]",
    node: "max-sm:w-[25px] max-sm:h-[25px]",
    nodeSvg: "max-sm:w-[13px]",
    rowTitle: "max-sm:text-[12px]",
    rowSubtitle: "max-md:text-[11px] max-sm:text-[9px]",
    length: "max-md:text-[11px] max-md:gap-[6px] max-sm:text-[9px] max-sm:gap-[3px]",
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
      className={`unit-card border rounded-[10px] bg-white overflow-hidden ${expanded ? "border-[#ced9c3] shadow-[0_3px_9px_#60734906]" : "border-sage-200"} ${at.card}`}
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
            UNIT {String(index + 1).padStart(2, "0")} <i>·</i> {unit.spanish}
          </Eyebrow>
          <h3 className={`font-semibold tracking-[-0.3px] ${TITLE} ${at.title}`}>{unit.title}</h3>
          <p className={`leading-[1.7] ${SUBTITLE} ${at.subtitle}`}>{unit.subtitle}</p>
        </div>
        <div className={`${STATUS} ${at.status}`}>
          <span className="flex items-center gap-[4px] whitespace-nowrap max-xl:text-[10px] max-lg:text-[12px] max-md:hidden">
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
              <span
                key={g}
                className="inline-flex items-center gap-[4px] text-[#75816b] text-[11px] max-md:text-[10px]"
              >
                <Icon name="check" size={13} className="w-[11px] text-[#92a17b]" />
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
          <details className="mt-[11px] xl:mt-[14px] border-t border-t-[#eef0e6] pt-[10px] xl:pt-[14px] text-[#75816b]">
            <summary className="flex items-center gap-[6px] cursor-pointer list-none text-[11px] max-lg:text-[13px] max-sm:text-[11px]">
              <Icon name="spark" size={15} />A little pattern to remember
            </summary>
            <p className="leading-[1.7] text-[13px] my-[9px] text-[#7c886e]">{unit.tip}</p>
            <div lang="es" className="flex items-center justify-between text-[14px] text-[#62714e]">
              {unit.example}
              <AudioButton compact text={unit.example} label="Listen to the unit example" />
            </div>
          </details>
        </div>
      )}
    </article>
  );
};
