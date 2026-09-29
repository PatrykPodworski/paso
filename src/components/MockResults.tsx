import { Button } from "../design-system/Button";
import { Eyebrow } from "../design-system/Eyebrow";
import { FieldNote } from "../design-system/FieldNote";
import { Notice } from "../design-system/Notice";
import { Panel } from "../design-system/Panel";
import { passingGroups } from "../data/progress";
import { Icon } from "../design-system/Icon";

type Props = {
  reading: number;
  listening: number;
  writing: string;
  speaking: string;
  onWriting: (value: string) => void;
  onSpeaking: (value: string) => void;
  onDownload: () => void;
  onReset: () => void;
};

export const MockResults = ({
  reading,
  listening,
  writing,
  speaking,
  onWriting,
  onSpeaking,
  onDownload,
  onReset,
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
    <Panel className="exam-results">
      <div className="completion-art">
        <Icon name="trophy" size={48} />
      </div>
      <Eyebrow>REHEARSAL COMPLETE</Eyebrow>
      <h2>You’ve met the exam.</h2>
      <p>Now you know where your next steps can take you.</p>
      <div className="result-score-grid">
        <div>
          <span>Reading</span>
          <strong>
            {reading}
            <small>/25</small>
          </strong>
        </div>
        <div>
          <span>Listening</span>
          <strong>
            {listening}
            <small>/25</small>
          </strong>
        </div>
        <div>
          <span>Writing</span>
          <strong className="ungraded">Human review</strong>
        </div>
        <div>
          <span>Speaking</span>
          <strong className="ungraded">Human review</strong>
        </div>
      </div>
      <div className="score-calculator">
        <h3>Check the two passing groups</h3>
        <p>
          Enter scores from a qualified reviewer, or explore hypothetical scores. These inputs do
          not assess your writing or pronunciation.
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
          <Notice positive={groups.pass}>
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
          </Notice>
        ) : (
          <FieldNote>
            A pass cannot be determined from reading and listening alone. Enter both scores between
            0 and 25.
          </FieldNote>
        )}
      </div>
      <div className="button-row">
        <Button variant="secondary" className="max-tablet:w-full" onClick={onDownload}>
          <Icon name="download" />
          Export responses for review
        </Button>
        <Button variant="primary" className="max-tablet:w-full" onClick={onReset}>
          Return to exam overview
          <Icon name="arrow" />
        </Button>
      </div>
    </Panel>
  );
};
