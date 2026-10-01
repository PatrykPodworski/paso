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
  "flex items-center justify-center rounded-[50%] border h-[25px] w-[25px] max-desktop:h-[20px] max-desktop:w-[20px] max-tablet:h-[18px] max-tablet:w-[18px] max-phone:h-[23px] max-phone:w-[23px]";

export const DailyGoal = ({ progress, openSettings }: Props) => {
  const today = dailyAnswers(progress);

  return (
    <Panel
      as="section"
      className="text-center p-[20px] max-desktop:p-[16px] max-laptop:p-[18px_20px] max-tablet:p-[15px] max-phone:p-[20px_25px]"
    >
      <PanelHeading title="Your daily little win">
        <IconButton onClick={() => openSettings()} aria-label="Adjust your daily goal">
          <Icon name="settings" size={16} />
        </IconButton>
      </PanelHeading>
      <div
        className="goal-ring flex items-center justify-center rounded-[50%] p-[8px] -rotate-90 bg-[conic-gradient(#8fa374_var(--goal),#edf0e5_0)] m-[24px_auto] w-[158px] h-[158px] max-desktop:m-[15px_auto_18px] max-desktop:w-[139px] max-desktop:h-[139px] max-tablet:w-[130px] max-tablet:h-[130px] max-phone:w-[145px] max-phone:h-[145px]"
        style={
          {
            "--goal": `${Math.min(today / progress.goal, 1) * 100}%`,
          } as CSSProperties
        }
      >
        <div className="flex flex-col items-center justify-center w-full h-full rounded-[50%] bg-paper rotate-90 [&>svg]:w-[21px] [&>svg]:h-[21px] [&>svg]:mb-[6px] [&>svg]:text-[#b4b393]">
          <Icon name={today >= progress.goal ? "check" : "spark"} size={24} />
          <strong className="font-serif text-[34px] leading-none text-[#405a3d] font-medium">
            {today}
            <span className="font-['Avenir_Next',sans-serif] text-[15px] tracking-[1px] text-[#a6ad96] pl-[3px]">
              /{progress.goal}
            </span>
          </strong>
          <small className="text-[11px] text-[#9da68c] mt-[7px]">exercises today</small>
        </div>
      </div>
      <p className="leading-[1.7] text-[11px] text-[#75816b] max-desktop:text-[12px] max-laptop:text-[13px] max-tablet:text-[11px]">
        {today >= progress.goal
          ? "Daily goal reached. ¡Muy bien!"
          : today
            ? "You’re building a lovely habit."
            : "A few minutes. A little more confidence."}
      </p>
      <div className="week-dots flex justify-between mt-[23px] px-[6px] max-desktop:mt-[20px] max-tablet:px-0 max-phone:px-[12px]">
        {Array.from({ length: 7 }, (_, i) => {
          const d = new Date();

          d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + i);
          const n = dailyAnswers(progress, localDate(d));
          const isToday = localDate(d) === localDate();

          return (
            <div key={i} className="flex flex-col items-center gap-[8px]">
              <span
                className={`text-[10px] max-desktop:text-[11px] max-phone:text-[12px] ${isToday ? "text-[#788f5c] font-bold" : "text-[#81906e]"}`}
              >
                {["M", "T", "W", "T", "F", "S", "S"][i]}
              </span>
              <i
                className={`${DOT} ${n ? "bg-[#8fa674] border-[#8fa674] text-white" : isToday ? "bg-[#f1f4e8] border-[#b3c49a]" : "border-[#e8ecdf]"}`}
                title={`${d.toLocaleDateString()}: ${n} exercises`}
              >
                {n ? (
                  <Icon name="check" size={12} />
                ) : isToday ? (
                  <b className="w-[4px] h-[4px] rounded-[50%] bg-[#94a777]" />
                ) : null}
              </i>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};
