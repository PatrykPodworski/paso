import type { CSSProperties } from "react";
import { Panel, PanelHeading } from "../../design-system/Panel";
import { dailyAnswers, localDate } from "../../data/progress";
import type { Progress } from "../../data/types";
import { Icon } from "../../design-system/Icon";

type Props = {
  progress: Progress;
  openSettings: () => void;
};

export const DailyGoal = ({ progress, openSettings }: Props) => {
  const today = dailyAnswers(progress);

  return (
    <Panel as="section" className="daily-goal">
      <PanelHeading title="Your daily little win">
        <button
          className="icon-button"
          onClick={() => openSettings()}
          aria-label="Adjust your daily goal"
        >
          <Icon name="settings" size={16} />
        </button>
      </PanelHeading>
      <div
        className="goal-ring"
        style={
          {
            "--goal": `${Math.min(today / progress.goal, 1) * 100}%`,
          } as CSSProperties
        }
      >
        <div>
          <Icon name={today >= progress.goal ? "check" : "spark"} size={24} />
          <strong>
            {today}
            <span>/{progress.goal}</span>
          </strong>
          <small>exercises today</small>
        </div>
      </div>
      <p>
        {today >= progress.goal
          ? "Daily goal reached. ¡Muy bien!"
          : today
            ? "You’re building a lovely habit."
            : "A few minutes. A little more confidence."}
      </p>
      <div className="week-dots">
        {Array.from({ length: 7 }, (_, i) => {
          const d = new Date();

          d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + i);
          const n = dailyAnswers(progress, localDate(d));

          return (
            <div key={i} className={localDate(d) === localDate() ? "is-today" : ""}>
              <span>{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
              <i className={n ? "done" : ""} title={`${d.toLocaleDateString()}: ${n} exercises`}>
                {n ? <Icon name="check" size={12} /> : localDate(d) === localDate() ? <b /> : null}
              </i>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};
