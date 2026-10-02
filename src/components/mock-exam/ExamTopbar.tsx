import { mockSections } from "../../data/mock";
import { Icon } from "../../design-system/Icon";
import type { Run } from "./useMockRun";

type Props = { run: Run; left: number };

export const ExamTopbar = ({ run, left }: Props) =>
  ["run", "prep", "review"].includes(run.stage) && (
    <div className="my-[25px] flex items-center justify-between gap-[20px]">
      <div className="exam-steps flex gap-[23px] text-[13px] text-[#a9b397] max-lg:gap-[12px] max-lg:text-[11px] max-md:gap-[8px] max-md:text-[0px] max-sm:gap-[6px]">
        {mockSections.map((s, i) => {
          const active = i === run.section;
          const done = i < run.section;

          return (
            <span
              key={s.title}
              className={`flex items-center gap-[7px] max-sm:gap-[5px] ${active ? "active text-[#536c41] max-md:text-[13px] max-sm:text-[10px]" : done ? "done text-[#809368]" : ""}`}
            >
              <b
                className={`flex h-[25px] w-[25px] items-center justify-center rounded-full text-[12px] font-medium max-lg:h-[22px] max-lg:w-[22px] max-md:h-[27px] max-md:w-[27px] max-md:text-[13px] max-sm:h-[23px] max-sm:w-[23px] ${active ? "bg-[#34582b] text-white" : "bg-[#eaf0df]"}`}
              >
                {done ? "✓" : i + 1}
              </b>
              {s.title}
            </span>
          );
        })}
      </div>
      {run.stage !== "review" && (
        <span
          role="timer"
          aria-label="Time remaining"
          className={`flex items-center gap-[8px] rounded-[7px] px-[16px] py-[10px] text-[19px] font-medium font-sans tabular-nums max-lg:p-[9px] max-lg:text-[16px] max-md:text-[17px] max-sm:gap-[5px] max-sm:px-[8px] max-sm:py-[9px] max-sm:text-[15px] max-sm:[&>svg]:w-[15px] ${left < 120 ? "urgent bg-[#f8e7d7] text-[#b36c44]" : "bg-[#edf1e4] text-[#7b8c63]"}`}
        >
          <Icon name="clock" />
          {String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}
        </span>
      )}
    </div>
  );
