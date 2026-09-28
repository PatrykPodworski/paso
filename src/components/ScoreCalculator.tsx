import { FieldNote } from "../design-system/FieldNote";
import { passingGroups } from "../data/progress";
export const ScoreCalculator = ({
  reading,
  listening,
  writing,
  speaking,
  onWriting,
  onSpeaking,
}: {
  reading: number;
  listening: number;
  writing: string;
  speaking: string;
  onWriting: (value: string) => void;
  onSpeaking: (value: string) => void;
}) => {
  const entered =
    writing !== "" &&
    speaking !== "" &&
    +writing >= 0 &&
    +writing <= 25 &&
    +speaking >= 0 &&
    +speaking <= 25;
  const groups = passingGroups(reading, +writing, listening, +speaking);
  return (
    <div className="score-calculator">
      <h3>Check the two passing groups</h3>
      <p>
        Enter scores from a qualified reviewer, or explore hypothetical scores. These inputs do not
        assess your writing or pronunciation.
      </p>
      <div className="form-inline">
        <label>
          Writing score /25
          <input
            type="number"
            min="0"
            max="25"
            step="0.01"
            value={writing}
            onChange={(e) => onWriting(e.target.value)}
            placeholder="Not yet graded"
          />
        </label>
        <label>
          Speaking score /25
          <input
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
        <div className={`notice ${groups.pass ? "positive" : ""}`}>
          <p>
            Reading + writing: <strong>{groups.group1.toFixed(2)}/50</strong>
            <br />
            Listening + speaking: <strong>{groups.group2.toFixed(2)}/50</strong>
            <br />
            {groups.pass
              ? "Both groups meet 30/50 based on the entered scores."
              : "At least one group is below 30/50 based on the entered scores."}{" "}
            This is not an official result or a prediction.
          </p>
        </div>
      ) : (
        <FieldNote>
          A pass cannot be determined from reading and listening alone. Enter both scores between 0
          and 25.
        </FieldNote>
      )}
    </div>
  );
};
