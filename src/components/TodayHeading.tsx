import { Eyebrow } from "../design-system/Eyebrow";
import { localDate } from "../data/progress";
import type { Progress } from "../data/types";
import { Icon } from "./Icon";
export const TodayHeading = ({
  progress,
  openSettings,
}: {
  progress: Progress;
  openSettings: () => void;
}) => {
  const daysToExam = progress.examDate
    ? Math.ceil(
        (new Date(`${progress.examDate}T00:00:00`).getTime() -
          new Date(`${localDate()}T00:00:00`).getTime()) /
          86400000,
      )
    : null;
  return (
    <div className="page-heading dashboard-heading">
      <div>
        <Eyebrow className="greeting mb-[9px]">
          {new Date().getHours() < 12
            ? "BUENOS DÍAS"
            : new Date().getHours() < 20
              ? "BUENAS TARDES"
              : "BUENAS NOCHES"}{" "}
          <span>✦</span>
        </Eyebrow>
        <h1>{progress.name ? `Hola, ${progress.name}.` : "A good day to learn Spanish."}</h1>
        <p>Your next chapter starts with a small step.</p>
      </div>
      <button className="date-chip" onClick={() => openSettings()}>
        <Icon name="sun" size={17} />
        {daysToExam === null
          ? "At your own pace"
          : daysToExam > 0
            ? `${daysToExam} days to your exam`
            : daysToExam === 0
              ? "Your exam day"
              : "Keep your Spanish growing"}
        <Icon name="down" size={13} />
      </button>
    </div>
  );
};
