import { mockSections } from "../../data/mock";
import { Icon } from "../../design-system/Icon";
import type { Run } from "./useMockRun";

type Props = { run: Run; left: number };

export const ExamTopbar = ({ run, left }: Props) =>
  ["run", "prep", "review"].includes(run.stage) && (
    <div className="exam-topbar">
      <div className="exam-steps">
        {mockSections.map((s, i) => (
          <span
            key={s.title}
            className={i === run.section ? "active" : i < run.section ? "done" : ""}
          >
            <b>{i < run.section ? "✓" : i + 1}</b>
            {s.title}
          </span>
        ))}
      </div>
      {run.stage !== "review" && (
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
