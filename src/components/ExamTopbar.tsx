import { mockSections } from "../data/mock";
import { Icon } from "../design-system/Icon";

type Props = {
  sectionIndex: number;
  showTimer: boolean;
  left: number;
};

export const ExamTopbar = ({ sectionIndex, showTimer, left }: Props) => (
  <div className="exam-topbar">
    <div className="exam-steps">
      {mockSections.map((s, i) => (
        <span
          key={s.title}
          className={i === sectionIndex ? "active" : i < sectionIndex ? "done" : ""}
        >
          <b>{i < sectionIndex ? "✓" : i + 1}</b>
          {s.title}
        </span>
      ))}
    </div>
    {showTimer && (
      <span
        role="timer"
        aria-label="Time remaining"
        className={`exam-timer ${left < 120 ? "urgent" : ""}`}
      >
        <Icon name="clock" />
        {String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}
      </span>
    )}
  </div>
);
