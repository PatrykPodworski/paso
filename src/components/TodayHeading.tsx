import { Eyebrow } from "../design-system/Eyebrow";
import { PageHeading } from "../design-system/PageHeading";
import { localDate } from "../data/progress";
import type { Progress } from "../data/types";
import { Icon } from "./Icon";

type Props = {
  progress: Progress;
  openSettings: () => void;
};

export const TodayHeading = ({ progress, openSettings }: Props) => {
  const daysToExam = progress.examDate
    ? Math.ceil(
        (new Date(`${progress.examDate}T00:00:00`).getTime() -
          new Date(`${localDate()}T00:00:00`).getTime()) /
          86400000,
      )
    : null;

  return (
    <PageHeading
      className="dashboard-heading"
      eyebrow={
        <Eyebrow className="greeting mb-[9px]">
          {new Date().getHours() < 12
            ? "BUENOS DÍAS"
            : new Date().getHours() < 20
              ? "BUENAS TARDES"
              : "BUENAS NOCHES"}{" "}
          <span>✦</span>
        </Eyebrow>
      }
      title={progress.name ? `Hola, ${progress.name}.` : "A good day to learn Spanish."}
      description="Your next chapter starts with a small step."
    >
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
    </PageHeading>
  );
};
