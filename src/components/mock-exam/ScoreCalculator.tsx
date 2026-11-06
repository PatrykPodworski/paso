import { FieldNote } from "../../design-system/FieldNote";
import { Notice } from "../../design-system/Notice";
import { passingGroups } from "../../data/progress";
import { FIELD } from "../../design-system/field";
import type { MockRun, Question } from "../../data/types";
import type { productiveScores } from "./productiveScores";
import { TalkGrades } from "./TalkGrades";

type Props = {
  reading: number;
  listening: number;
  // The AI scores of writing and speaking, when there are any.
  scored: ReturnType<typeof productiveScores>;
  // The scores typed in for a section the AI has not scored.
  writing: string;
  speaking: string;
  talks: MockRun["talks"];
  // The run's speaking tasks, whose talks Lucía grades.
  talkTasks: Question[];
  onWriting: (value: string) => void;
  onSpeaking: (value: string) => void;
};

// A typed score between 0 and 25, or undefined.
const typed = (value: string) => (value !== "" && +value >= 0 && +value <= 25 ? +value : undefined);

type ScoreInputProps = { label: string; value: string; onChange: (value: string) => void };

const ScoreInput = ({ label, value, onChange }: ScoreInputProps) => (
  <label className="text-sm flex flex-1 flex-col gap-2 text-foreground">
    {label}
    <input
      className={FIELD}
      type="number"
      min="0"
      max="25"
      step="0.01"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Not yet graded"
    />
  </label>
);

export const ScoreCalculator = ({
  reading,
  listening,
  scored,
  writing,
  speaking,
  talks,
  talkTasks,
  onWriting,
  onSpeaking,
}: Props) => {
  // A section the AI scored takes that score; another one takes the typed score.
  const writingPoints = scored.writing ?? typed(writing);
  const speakingPoints = scored.speaking ?? typed(speaking);
  const typing = scored.writing === undefined || scored.speaking === undefined;
  const groups = passingGroups(reading, writingPoints ?? 0, listening, speakingPoints ?? 0);

  return (
    <div className="mb-6 rounded-lg border border-border p-6 text-left max-md:p-5">
      <h3 className="text-base font-semibold tracking-tight">Check the two passing groups</h3>
      {typing && (
        <>
          <p className="leading-relaxed my-3 text-sm text-muted-foreground">
            A section without an AI score takes the score you enter: one from a qualified reviewer,
            or a hypothetical one.
          </p>
          <div className="mt-5 flex gap-4 max-md:flex-col">
            {scored.writing === undefined && (
              <ScoreInput label="Writing score /25" value={writing} onChange={onWriting} />
            )}
            {scored.speaking === undefined && (
              <ScoreInput label="Speaking score /25" value={speaking} onChange={onSpeaking} />
            )}
          </div>
        </>
      )}
      <TalkGrades talks={talks} talkTasks={talkTasks} className="mbs-4" />
      <FieldNote className="mbs-2.5">
        The speaking score counts Lucía's points: 1 for a correct point, a half for an
        understandable one. A talk without a score counts 0. Writing and speaking scores are a
        practice estimate, not a DELE mark.
      </FieldNote>
      {writingPoints !== undefined && speakingPoints !== undefined ? (
        <Notice positive={groups.pass}>
          <p className="leading-relaxed my-3 text-muted-foreground">
            Reading + writing: <strong>{groups.group1.toFixed(2)}/50</strong>
            <br />
            Listening + speaking: <strong>{groups.group2.toFixed(2)}/50</strong>
            <br />
            <span>
              Total: <strong>{(groups.group1 + groups.group2).toFixed(2)}/100</strong>
            </span>
            <br />
            {groups.pass
              ? "Both groups meet 30/50 based on these scores."
              : "At least one group is below 30/50 based on these scores."}{" "}
            This is not an official result or a prediction.
          </p>
        </Notice>
      ) : (
        <FieldNote className="my-3">
          A pass cannot be determined without a writing and a speaking score. Enter a score between
          0 and 25 for each section without one.
        </FieldNote>
      )}
    </div>
  );
};
