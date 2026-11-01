import { FieldNote } from "../../design-system/FieldNote";
import { Notice } from "../../design-system/Notice";
import { passingGroups } from "../../data/progress";
import { FIELD } from "../../design-system/field";
import type { MockRun, Question } from "../../data/types";

const GRADES = { perfect: "Perfect", good: "Good", bad: "Not everything" };

type Props = {
  reading: number;
  listening: number;
  writing: string;
  speaking: string;
  talks: MockRun["talks"];
  // The run's speaking tasks, whose talks Lucía grades.
  talkTasks: Question[];
  onWriting: (value: string) => void;
  onSpeaking: (value: string) => void;
};

export const ScoreCalculator = ({
  reading,
  listening,
  writing,
  speaking,
  talks,
  talkTasks,
  onWriting,
  onSpeaking,
}: Props) => {
  const entered =
    writing !== "" &&
    speaking !== "" &&
    +writing >= 0 &&
    +writing <= 25 &&
    +speaking >= 0 &&
    +speaking <= 25;

  const groups = passingGroups(reading, +writing, listening, +speaking);

  return (
    <div className="mb-6 rounded-lg border border-border p-6 text-left max-md:p-5">
      <h3 className="text-base font-semibold tracking-tight">Check the two passing groups</h3>
      <p className="leading-relaxed my-3 text-sm text-muted-foreground">
        Enter scores from a qualified reviewer, or explore hypothetical scores. These inputs do not
        assess your writing or pronunciation.
      </p>
      <div className="mt-5 flex gap-4 max-md:flex-col">
        <label className="text-sm flex flex-1 flex-col gap-2 text-foreground">
          Writing score /25
          <input
            className={FIELD}
            type="number"
            min="0"
            max="25"
            step="0.01"
            value={writing}
            onChange={(e) => onWriting(e.target.value)}
            placeholder="Not yet graded"
          />
        </label>
        <label className="text-sm flex flex-1 flex-col gap-2 text-foreground">
          Speaking score /25
          <input
            className={FIELD}
            type="number"
            min="0"
            max="25"
            step="0.01"
            value={speaking}
            onChange={(e) => onSpeaking(e.target.value)}
            placeholder="Not yet graded"
          />
        </label>
      </div>
      <ul aria-label="Lucía's grades" className="mbs-4 flex flex-col gap-1.5 text-sm">
        {talkTasks.map((q, i) => (
          <li key={q.id} className="flex justify-between gap-3">
            <span>Task {i + 1}</span>
            <span className="text-muted-foreground">
              {talks[q.id] ? GRADES[talks[q.id].grade] : "Not done"}
            </span>
          </li>
        ))}
      </ul>
      <FieldNote className="mbs-2.5">
        Lucía's grades for the three talks are not DELE points. Enter the speaking score yourself
        for now.
      </FieldNote>
      {entered ? (
        <Notice positive={groups.pass}>
          <p className="leading-relaxed my-3 text-muted-foreground">
            Reading + writing: <strong>{groups.group1.toFixed(2)}/50</strong>
            <br />
            Listening + speaking: <strong>{groups.group2.toFixed(2)}/50</strong>
            <br />
            {groups.pass
              ? "Both groups meet 30/50 based on the entered scores."
              : "At least one group is below 30/50 based on the entered scores."}{" "}
            This is not an official result or a prediction.
          </p>
        </Notice>
      ) : (
        <FieldNote className="my-3">
          A pass cannot be determined from reading and listening alone. Enter both scores between 0
          and 25.
        </FieldNote>
      )}
    </div>
  );
};
