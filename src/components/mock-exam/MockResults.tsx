import { CompletionArt } from "../CompletionArt";
import { ButtonRow } from "../../design-system/ButtonRow";
import { Button } from "../../design-system/Button";
import { Eyebrow } from "../../design-system/Eyebrow";
import { Panel } from "../../design-system/Panel";
import { Icon } from "../../design-system/Icon";
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

const TILE = "flex flex-col gap-2.5 rounded-lg bg-sage-100 px-2.5 py-5 text-olive-600";

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
  <Panel className="p-9 text-center max-md:px-5 max-md:py-7">
    <CompletionArt icon="trophy" />
    <Eyebrow>REHEARSAL COMPLETE</Eyebrow>
    <h2 className="font-serif font-semibold tracking-tight leading-tight my-3 text-4xl max-md:text-3xl">
      You’ve met the exam.
    </h2>
    <p className="leading-relaxed text-sm text-sage-500">
      Now you know where your next steps can take you.
    </p>
    <div className="my-7 grid grid-cols-4 gap-3.5 max-lg:grid-cols-2">
      <div className={TILE}>
        <span className="text-sm">Reading</span>
        <strong className="font-serif text-4xl font-medium">
          {reading}
          <small className="text-base text-sage-400">/25</small>
        </strong>
      </div>
      <div className={TILE}>
        <span className="text-sm">Listening</span>
        <strong className="font-serif text-4xl font-medium">
          {listening}
          <small className="text-base text-sage-400">/25</small>
        </strong>
      </div>
      <div className={TILE}>
        <span className="text-sm">Writing</span>
        <strong className="my-2.5 text-sm font-medium">Human review</strong>
      </div>
      <div className={TILE}>
        <span className="text-sm">Speaking</span>
        <strong className="my-2.5 text-sm font-medium">Human review</strong>
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
    <ButtonRow className="justify-center">
      <Button variant="secondary" className="max-md:w-full" onClick={onDownload}>
        <Icon name="download" />
        Export responses for review
      </Button>
      <Button variant="primary" className="max-md:w-full" onClick={onReset}>
        Return to exam overview
        <Icon name="arrow" />
      </Button>
    </ButtonRow>
  </Panel>
);
