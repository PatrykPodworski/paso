import { mockSections } from "../../data/mock";
import { Icon } from "../../design-system/Icon";
import type { Run } from "./useMockRun";

type Props = { run: Run; left: number };

export const ExamTopbar = ({ run, left }: Props) =>
  ["run", "prep", "review"].includes(run.stage) && (
    <div className="my-[25px] flex items-center justify-between gap-[20px]">
      <div className="exam-steps flex gap-[23px] text-[13px] text-[#a9b397] max-laptop:gap-[12px] max-laptop:text-[11px] max-tablet:gap-[8px] max-tablet:text-[0px] max-phone:gap-[6px]">
        {mockSections.map((s, i) => {
          const active = i === run.section;
          const done = i < run.section;

          return (
            <span
              key={s.title}
              className={`flex items-center gap-[7px] max-phone:gap-[5px] ${active ? "active text-[#536c41] max-tablet:text-[13px] max-phone:text-[10px]" : done ? "done text-[#809368]" : ""}`}
            >
              <b
                className={`flex h-[25px] w-[25px] items-center justify-center rounded-full text-[12px] font-medium max-laptop:h-[22px] max-laptop:w-[22px] max-tablet:h-[27px] max-tablet:w-[27px] max-tablet:text-[13px] max-phone:h-[23px] max-phone:w-[23px] ${active ? "bg-[#34582b] text-white" : "bg-[#eaf0df]"}`}
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
          className={`flex items-center gap-[8px] rounded-[7px] px-[16px] py-[10px] text-[19px] font-medium [font-family:monospace] max-laptop:p-[9px] max-laptop:text-[16px] max-tablet:text-[17px] max-phone:gap-[5px] max-phone:px-[8px] max-phone:py-[9px] max-phone:text-[15px] max-phone:[&>svg]:w-[15px] ${left < 120 ? "urgent bg-[#f8e7d7] text-[#b36c44]" : "bg-[#edf1e4] text-[#7b8c63]"}`}
        >
          <Icon name="clock" />
          {String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}
        </span>
      )}
    </div>
  );
