import { Eyebrow } from "../../design-system/Eyebrow";
import type { Question } from "../../data/types";
import { Recorder } from "./Recorder";
import type { Answer } from "./useAnswer";
import { CHECKBOX } from "../../design-system/field";

const CHECK_ROW =
  "flex items-start gap-2.5 my-2.5 mx-0 text-xs leading-relaxed text-sage-700 max-md:text-sm";

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
                className={`${CHECKBOX} mt-px mr-0.5 mb-0.5 ml-1`}
                checked={practice.spoken}
                onChange={(e) => practice.setSpoken(e.target.checked)}
              />
              I practised aloud (with or without a recording).
            </label>
          )}
        </>
      )}
      {practice.productive && !exam && (
        <div className="self-checks mt-6 rounded-lg bg-sage-50 p-5 max-md:p-4">
          <Eyebrow variant="checklist" className="mb-3">
            Your self-review checklist
          </Eyebrow>
          {q.checklist?.map((c, i) => (
            <label className={CHECK_ROW} key={c}>
              <input
                type="checkbox"
                className={`${CHECKBOX} mt-px mr-0.5 mb-0.5 ml-1`}
                checked={ticked.has(i)}
                onChange={() => practice.toggleCheck(i)}
              />
              {c}
            </label>
          ))}
        </div>
      )}
      {practice.productive && !exam && !feedback && (
        <p className="mt-5 text-xs leading-relaxed text-sage-800">
          AI feedback on your writing and speaking is coming soon.
        </p>
      )}
    </>
  );
};
