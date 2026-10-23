import { FieldNote } from "../../design-system/FieldNote";
import { Notice } from "../../design-system/Notice";
import { passingGroups } from "../../data/progress";
import { FIELD } from "../../design-system/field";

type Props = {
  reading: number;
  listening: number;
  writing: string;
  speaking: string;
  onWriting: (value: string) => void;
  onSpeaking: (value: string) => void;
};

export const ScoreCalculator = ({
  reading,
  listening,
  writing,
  speaking,
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
    <div className="mb-6 rounded-lg border border-sage-200 p-6 text-left max-md:p-5">
      <h3 className="text-base font-semibold tracking-tight">Check the two passing groups</h3>
      <p className="leading-relaxed my-3 text-sm text-sage-500">
        Enter scores from a qualified reviewer, or explore hypothetical scores. These inputs do not
        assess your writing or pronunciation.
      </p>
      <div className="mt-5 flex gap-4 max-md:flex-col">
        <label className="text-sm flex flex-1 flex-col gap-2 text-olive-600">
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
        <label className="text-sm flex flex-1 flex-col gap-2 text-olive-600">
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
      {entered ? (
        <Notice positive={groups.pass}>
          <p className="leading-relaxed my-3 text-sage-500">
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
