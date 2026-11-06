import type { ReactNode } from "react";
import { CompletionArt } from "../CompletionArt";
import { ButtonRow } from "../../design-system/ButtonRow";
import { Button } from "../../design-system/Button";
import { Eyebrow } from "../../design-system/Eyebrow";
import { Panel } from "../../design-system/Panel";
import { Icon } from "../../design-system/Icon";
import { mockExam } from "../../data/mock";
import { useWritingReviews } from "../writing-review/useWritingReviews";
import { keepMarks, type productiveScores } from "./productiveScores";
import { ScoreCalculator } from "./ScoreCalculator";
import { TalkGrades } from "./TalkGrades";
import { WritingRetry } from "./WritingRetry";
import type { MockRun, Question } from "../../data/types";

type Props = {
  // The sections the run took. The results show only these.
  sections: number[];
  reading: number;
  listening: number;
  // The AI scores of writing and speaking, when there are any.
  scored: ReturnType<typeof productiveScores>;
  // The scores typed in for a section the AI has not scored.
  writing: string;
  speaking: string;
  talks: MockRun["talks"];
  talkTasks: Question[];
  // The writing answers that have no mark yet, by question id.
  unmarked: Record<string, string>;
  onMarks: (marks: Record<string, number>) => void;
  onWriting: (value: string) => void;
  onSpeaking: (value: string) => void;
  onDownload: () => void;
  onReset: () => void;
};

const TILE = "flex flex-col gap-2.5 rounded-lg bg-muted px-2.5 py-5 text-foreground";

type PointsProps = { value: number; children?: ReactNode };

const Points = ({ value, children }: PointsProps) => (
  <>
    <strong className="font-heading text-4xl font-medium">
      {value}
      <small className="text-base text-muted-foreground">/25</small>
    </strong>
    {children && <small className="text-xs text-muted-foreground">{children}</small>}
  </>
);

type UnscoredProps = { children?: ReactNode };

const Unscored = ({ children = "Not scored" }: UnscoredProps) => (
  <strong className="my-2.5 text-sm font-medium">{children}</strong>
);

export const MockResults = ({
  sections,
  reading,
  listening,
  scored,
  writing,
  speaking,
  talks,
  talkTasks,
  unmarked,
  onMarks,
  onWriting,
  onSpeaking,
  onDownload,
  onReset,
}: Props) => {
  const full = sections.length === mockExam.length;
  const reviews = useWritingReviews(keepMarks(onMarks));
  const partTalks = scored.scoredTalks < talkTasks.length;

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
            <Points value={reading} />
          </div>
        )}
        {sections.includes(1) && (
          <div className={TILE}>
            <span className="text-sm">Listening</span>
            <Points value={listening} />
          </div>
        )}
        {sections.includes(2) && (
          <div className={TILE}>
            <span className="text-sm">Writing</span>
            {scored.writing !== undefined ? (
              <Points value={scored.writing} />
            ) : (
              <Unscored>{reviews.loading ? "Scoring…" : "Not scored"}</Unscored>
            )}
          </div>
        )}
        {sections.includes(3) && (
          <div className={TILE}>
            <span className="text-sm">Speaking</span>
            {scored.speaking !== undefined ? (
              <Points value={scored.speaking}>
                {partTalks && `From ${scored.scoredTalks} of ${talkTasks.length} talks`}
              </Points>
            ) : (
              <Unscored />
            )}
          </div>
        )}
      </div>
      {sections.includes(2) && scored.writing === undefined && (
        <WritingRetry reviews={reviews} unmarked={unmarked} />
      )}
      {/* The passing groups need all four scores, so only a full exam shows the calculator. */}
      {full ? (
        <ScoreCalculator
          reading={reading}
          listening={listening}
          scored={scored}
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
