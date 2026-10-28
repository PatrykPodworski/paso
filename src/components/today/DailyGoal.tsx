import type { CSSProperties } from "react";
import { Panel, PanelHeading } from "../../design-system/Panel";
import { dailyAnswers, localDate } from "../../data/progress";
import type { Progress } from "../../data/types";
import { Icon } from "../../design-system/Icon";
import { IconButton } from "../../design-system/IconButton";

type Props = {
  progress: Progress;
  openSettings: () => void;
};

const DOT =
  "flex items-center justify-center rounded-full border h-6 w-6 max-xl:h-5 max-xl:w-5 max-md:h-4 max-md:w-4 max-sm:h-6 max-sm:w-6";

export const DailyGoal = ({ progress, openSettings }: Props) => {
  const today = dailyAnswers(progress);
  const reached = Math.min(today, progress.goal);

  return (
    <Panel
      as="section"
      className="text-center p-5 max-xl:p-4 max-lg:py-4 max-lg:px-5 max-md:p-3.5 max-sm:py-5 max-sm:px-6"
    >
      <PanelHeading title="Your daily little win">
        <IconButton onClick={() => openSettings()} aria-label="Adjust your daily goal">
          <Icon name="settings" size={16} />
        </IconButton>
      </PanelHeading>
      <div
        role="progressbar"
        aria-label="Daily goal"
        aria-valuemin={0}
        aria-valuemax={progress.goal}
        aria-valuenow={reached}
        aria-valuetext={`${today} of ${progress.goal} exercises today`}
        className="flex items-center justify-center rounded-full p-2 -rotate-90 bg-[conic-gradient(var(--color-olive-500)_var(--goal),var(--color-sage-100)_0)] my-6 mx-auto w-39 h-39 max-xl:mt-3.5 max-xl:mx-auto max-xl:mb-4 max-xl:w-35 max-xl:h-35 max-md:w-32 max-md:h-32 max-sm:w-36 max-sm:h-36"
        style={
          {
            "--goal": `${(reached / progress.goal) * 100}%`,
          } as CSSProperties
        }
      >
        <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-white rotate-90">
          <Icon
            name={today >= progress.goal ? "check" : "spark"}
            size={21}
            className="mb-1.5 text-sage-400"
          />
          <strong className="font-serif text-4xl leading-none text-sage-900 font-medium">
            {today}
            <span className="font-sans text-sm tracking-wider text-sage-400 pl-0.5">
              /{progress.goal}
            </span>
          </strong>
          <small className="text-2xs text-sage-400 mt-1.5">exercises today</small>
        </div>
      </div>
      <p className="leading-relaxed text-2xs text-sage-700 max-xl:text-xs max-md:text-2xs">
        {today >= progress.goal
          ? "Daily goal reached. ¡Muy bien!"
          : today
            ? "You’re building a lovely habit."
            : "A few minutes. A little more confidence."}
      </p>
      <ol
        aria-label="This week"
        className="week-dots flex justify-between mt-6 px-1.5 max-xl:mt-5 max-md:px-0 max-sm:px-3"
      >
        {Array.from({ length: 7 }, (_, i) => {
          const d = new Date();

          d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + i);
          const n = dailyAnswers(progress, localDate(d));
          const isToday = localDate(d) === localDate();

          return (
            <li key={i} className="flex flex-col items-center gap-2">
              <span
                className={`text-2xs max-xl:text-2xs max-sm:text-xs ${isToday ? "text-olive-600 font-bold" : "text-sage-600"}`}
              >
                {["M", "T", "W", "T", "F", "S", "S"][i]}
              </span>
              <i
                role="img"
                aria-label={`${d.toLocaleDateString()}: ${n} exercises`}
                className={`${DOT} ${n ? "bg-olive-500 border-olive-500 text-white" : isToday ? "bg-sage-100 border-olive-400" : "border-sage-100"}`}
                title={`${d.toLocaleDateString()}: ${n} exercises`}
              >
                {n ? (
                  <Icon name="check" size={12} />
                ) : isToday ? (
                  <b className="w-1 h-1 rounded-full bg-olive-500" />
                ) : null}
              </i>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
};
