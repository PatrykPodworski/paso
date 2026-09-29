import { Button } from "../design-system/Button";
import { Eyebrow } from "../design-system/Eyebrow";
import { Panel } from "../design-system/Panel";
import { Icon } from "./Icon";
import { ScoreCalculator } from "./ScoreCalculator";

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
}: Props) => (
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
    <ScoreCalculator
      reading={reading}
      listening={listening}
      writing={writing}
      speaking={speaking}
      onWriting={onWriting}
      onSpeaking={onSpeaking}
    />
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
