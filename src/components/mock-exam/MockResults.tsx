import { CompletionArt } from "../CompletionArt";
import { ButtonRow } from "../../design-system/ButtonRow";
import { Button } from "../../design-system/Button";
import { Eyebrow } from "../../design-system/Eyebrow";
import { Panel } from "../../design-system/Panel";
import { Icon } from "../../design-system/Icon";
import { mockExam } from "../../data/mock";
import { ScoreCalculator } from "./ScoreCalculator";
import { TalkGrades } from "./TalkGrades";
import type { MockRun, Question } from "../../data/types";

type Props = {
  // The sections the run took. The results show only these.
  sections: number[];
  reading: number;
  listening: number;
  writing: string;
  speaking: string;
  talks: MockRun["talks"];
  talkTasks: Question[];
  onWriting: (value: string) => void;
  onSpeaking: (value: string) => void;
  onDownload: () => void;
  onReset: () => void;
};

const TILE = "flex flex-col gap-2.5 rounded-lg bg-muted px-2.5 py-5 text-foreground";

export const MockResults = ({
  sections,
  reading,
  listening,
  writing,
  speaking,
  talks,
  talkTasks,
  onWriting,
  onSpeaking,
  onDownload,
  onReset,
}: Props) => {
  const full = sections.length === mockExam.length;

  return (
    <Panel className="p-9 text-center max-md:px-5 max-md:py-7">
      <CompletionArt icon="trophy" />
      <Eyebrow>REHEARSAL COMPLETE</Eyebrow>
      <h2 className="font-heading font-semibold tracking-tight leading-tight my-3 text-4xl max-md:text-3xl">
        You’ve met the exam.
      </h2>
      <p className="leading-relaxed text-sm text-muted-foreground">
        Now you know where your next steps can take you.
      </p>
      <div className={`my-7 grid gap-3.5 ${full ? "grid-cols-4 max-lg:grid-cols-2" : ""}`}>
        {sections.includes(0) && (
          <div className={TILE}>
            <span className="text-sm">Reading</span>
            <strong className="font-heading text-4xl font-medium">
              {reading}
              <small className="text-base text-muted-foreground">/25</small>
            </strong>
          </div>
        )}
        {sections.includes(1) && (
          <div className={TILE}>
            <span className="text-sm">Listening</span>
            <strong className="font-heading text-4xl font-medium">
              {listening}
              <small className="text-base text-muted-foreground">/25</small>
            </strong>
          </div>
        )}
        {sections.includes(2) && (
          <div className={TILE}>
            <span className="text-sm">Writing</span>
            <strong className="my-2.5 text-sm font-medium">Human review</strong>
          </div>
        )}
        {sections.includes(3) && (
          <div className={TILE}>
            <span className="text-sm">Speaking</span>
            <strong className="my-2.5 text-sm font-medium">Human review</strong>
          </div>
        )}
      </div>
      {/* The passing groups need all four scores, so only a full exam shows the calculator. */}
      {full ? (
        <ScoreCalculator
          reading={reading}
          listening={listening}
          writing={writing}
          speaking={speaking}
          talks={talks}
          talkTasks={talkTasks}
          onWriting={onWriting}
          onSpeaking={onSpeaking}
        />
      ) : (
        sections.includes(3) && (
          <TalkGrades
            talks={talks}
            talkTasks={talkTasks}
            className="mb-6 rounded-lg border border-border p-6 text-left max-md:p-5"
          />
        )
      )}
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
};
