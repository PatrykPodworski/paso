import { Eyebrow } from "../../design-system/Eyebrow";
import type { Question } from "../../data/types";
import { Recorder } from "./Recorder";
import type { Answer } from "./useAnswer";
import { CHECKBOX } from "../../design-system/field";

const CHECK_ROW =
  "flex items-start gap-[10px] m-[10px_0] text-[13px] leading-[1.7] text-[#758763] max-md:text-[14px]";

type Props = {
  q: Question;
  exam: boolean;
  feedback: boolean;
  practice: Answer;
  onStart: () => void;
};

export const PracticeChecks = ({ q, exam, feedback, practice, onStart }: Props) => {
  const ticked = new Set(practice.checks);

  return (
    <>
      {q.kind === "speak" && (
        <>
          <Recorder
            onRecorded={() => practice.setSpoken(true)}
            onStart={onStart}
            onRecordingChange={practice.setRecording}
          />
          {!feedback && (
            <label className={CHECK_ROW}>
              <input
                type="checkbox"
                className={`${CHECKBOX} m-[1px_3px_3px_4px]`}
                checked={practice.spoken}
                onChange={(e) => practice.setSpoken(e.target.checked)}
              />
              I practised aloud (with or without a recording).
            </label>
          )}
        </>
      )}
      {practice.productive && !exam && (
        <div className="self-checks mt-[26px] rounded-[9px] bg-[#f5f7ef] p-[19px_20px] max-md:p-[16px]">
          <Eyebrow variant="checklist" className="mb-[13px]">
            Your self-review checklist
          </Eyebrow>
          {q.checklist?.map((c, i) => (
            <label className={CHECK_ROW} key={c}>
              <input
                type="checkbox"
                className={`${CHECKBOX} m-[1px_3px_3px_4px]`}
                checked={ticked.has(i)}
                onChange={() => practice.toggleCheck(i)}
              />
              {c}
            </label>
          ))}
        </div>
      )}
      {practice.productive && !exam && !feedback && (
        <p className="mt-[22px] text-[13px] leading-[1.6] text-[#62725e]">
          AI feedback on your writing and speaking is coming soon.
        </p>
      )}
    </>
  );
};
