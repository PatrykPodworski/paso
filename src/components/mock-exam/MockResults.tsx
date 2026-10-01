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

const TILE =
  "flex flex-col gap-[10px] rounded-[10px] bg-[#f2f5e9] px-[10px] py-[20px] text-[#81956b]";

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
  <Panel className="p-[38px] text-center max-tablet:px-[20px] max-tablet:py-[28px]">
    <CompletionArt>
      <Icon name="trophy" size={48} />
    </CompletionArt>
    <Eyebrow>REHEARSAL COMPLETE</Eyebrow>
    <h2 className="font-serif font-semibold tracking-[-0.7px] leading-[1.25] my-[12px] text-[36px] max-tablet:text-[31px]">
      You’ve met the exam.
    </h2>
    <p className="leading-[1.7] text-[15px] text-[#919e81]">
      Now you know where your next steps can take you.
    </p>
    <div className="my-[30px] grid grid-cols-[repeat(4,1fr)] gap-[15px] max-laptop:grid-cols-[1fr_1fr]">
      <div className={TILE}>
        <span className="text-[14px]">Reading</span>
        <strong className="font-serif text-[38px] font-medium">
          {reading}
          <small className="text-[17px] text-[#a8b596]">/25</small>
        </strong>
      </div>
      <div className={TILE}>
        <span className="text-[14px]">Listening</span>
        <strong className="font-serif text-[38px] font-medium">
          {listening}
          <small className="text-[17px] text-[#a8b596]">/25</small>
        </strong>
      </div>
      <div className={TILE}>
        <span className="text-[14px]">Writing</span>
        <strong className="my-[10px] text-[14px] font-medium">Human review</strong>
      </div>
      <div className={TILE}>
        <span className="text-[14px]">Speaking</span>
        <strong className="my-[10px] text-[14px] font-medium">Human review</strong>
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
      <Button variant="secondary" className="max-tablet:w-full" onClick={onDownload}>
        <Icon name="download" />
        Export responses for review
      </Button>
      <Button variant="primary" className="max-tablet:w-full" onClick={onReset}>
        Return to exam overview
        <Icon name="arrow" />
      </Button>
    </ButtonRow>
  </Panel>
);
