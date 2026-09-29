import { Eyebrow } from "../design-system/Eyebrow";
import type { Question } from "../data/types";
import { Recorder } from "./Recorder";
import type { Answer } from "./useAnswer";

export const PracticeChecks = ({
  q,
  exam,
  feedback,
  practice,
  onStart,
}: {
  q: Question;
  exam: boolean;
  feedback: boolean;
  practice: Answer;
  onStart: () => void;
}) => {
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
            <label className="check-row">
              <input
                type="checkbox"
                checked={practice.spoken}
                onChange={(e) => practice.setSpoken(e.target.checked)}
              />
              I practised aloud (with or without a recording).
            </label>
          )}
        </>
      )}
      {practice.productive && !exam && (
        <div className="self-checks">
          <Eyebrow variant="checklist" className="mb-[13px]">
            Your self-review checklist
          </Eyebrow>
          {q.checklist?.map((c, i) => (
            <label className="check-row" key={c}>
              <input
                type="checkbox"
                checked={ticked.has(i)}
                onChange={() => practice.toggleCheck(i)}
              />
              {c}
            </label>
          ))}
        </div>
      )}
      {practice.productive && !exam && !feedback && (
        <p className="coming-soon">AI feedback on your writing and speaking is coming soon.</p>
      )}
    </>
  );
};
