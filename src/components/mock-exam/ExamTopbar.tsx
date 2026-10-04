import { mockSections } from "../../data/mock";
import { Icon } from "../../design-system/Icon";
import type { Run } from "./useMockRun";

type Props = { run: Run; left: number };

export const ExamTopbar = ({ run, left }: Props) =>
  ["run", "prep", "review"].includes(run.stage) && (
    <div className="my-6 flex items-center justify-between gap-5">
      <ol
        aria-label="Exam sections"
        className="flex gap-6 text-xs text-sage-400 max-lg:gap-3 max-lg:text-2xs max-md:gap-2 max-sm:gap-1.5"
      >
        {mockSections.map((s, i) => {
          const active = i === run.section;
          const done = i < run.section;

          return (
            <li
              key={s.title}
              aria-current={active ? "step" : undefined}
              className={`flex items-center gap-1.5 max-sm:gap-1 ${active ? "active text-olive-800 max-md:text-xs max-sm:text-2xs" : done ? "done text-olive-600" : ""}`}
            >
              <b
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium max-lg:h-5 max-lg:w-5 max-md:h-7 max-md:w-7 max-md:text-xs max-sm:h-6 max-sm:w-6 ${active ? "bg-olive-900 text-white" : "bg-sage-100"}`}
              >
                {done ? "✓" : i + 1}
              </b>
              <span className={active ? "" : "max-md:sr-only"}>{s.title}</span>
            </li>
          );
        })}
      </ol>
      {run.stage !== "review" && (
        <span
          role="timer"
          aria-label="Time remaining"
          className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-lg font-medium font-sans tabular-nums max-lg:p-2 max-lg:text-base max-md:text-base max-sm:gap-1 max-sm:px-2 max-sm:py-2 max-sm:text-sm ${left < 120 ? "urgent bg-sand-100 text-coral-600" : "bg-sage-100 text-olive-600"}`}
        >
          <Icon name="clock" className="max-sm:w-3.5" />
          {String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}
        </span>
      )}
    </div>
  );
