import { Button } from "../../design-system/Button";
import { ButtonRow } from "../../design-system/ButtonRow";
import { FieldNote } from "../../design-system/FieldNote";
import type { LiveScore } from "../../data/types";
import { LiveTranscript } from "./LiveTranscript";
import type { LiveTurn } from "./transcript";

const HEADINGS = {
  perfect: "Perfect. You passed.",
  good: "Good. You passed.",
  bad: "Not yet. Talk again to pass.",
};

const NOTES = {
  perfect: "You gave Lucía everything she asked for in correct Spanish.",
  good: "Lucía understood you. Talk again to make your answers correct.",
  bad: "Lucía did not get everything she asked for. If you continue now, you can try it again later under My mistakes in Practice.",
};

const EXAM_HEADINGS = { perfect: "Perfect.", good: "Good.", bad: "Not everything." };

const EXAM_NOTES = {
  perfect: "You gave Lucía everything she asked for in correct Spanish.",
  good: "Lucía understood you, with some mistakes.",
  bad: "Lucía did not get everything she asked for.",
};

const LEVELS = {
  correct: "Correct",
  understandable: "Understandable, with mistakes",
  missing: "Missing",
};

type Props = {
  score: LiveScore;
  turns: LiveTurn[];
  // In the exam the grade is kept as it is: no second talk, no pass or fail.
  exam: boolean;
  onAgain: () => void;
  onContinue: () => void;
};

export const LiveResult = ({ score, turns, exam, onAgain, onContinue }: Props) => (
  <div className="mbs-5 border-bs border-border pbs-5">
    <h3 className="font-heading text-2xl font-medium">
      {(exam ? EXAM_HEADINGS : HEADINGS)[score.grade]}
    </h3>
    <p className="mbs-2 text-sm leading-relaxed text-muted-foreground">
      {(exam ? EXAM_NOTES : NOTES)[score.grade]}
    </p>
    <ul aria-label="Your answers" className="mbs-3.5 flex flex-col gap-1.5 text-sm">
      {score.items.map(({ id, label, level }) => (
        <li key={id} className="flex justify-between gap-3">
          <span>{label}</span>
          <span className={level === "missing" ? "text-destructive" : "text-muted-foreground"}>
            {LEVELS[level]}
          </span>
        </li>
      ))}
    </ul>
    <FieldNote className="mbs-3.5">
      Only the transcript is scored, never your pronunciation.
    </FieldNote>
    {turns.length > 0 && <LiveTranscript turns={turns} />}
    <ButtonRow className="mbs-4">
      {!exam && score.grade !== "perfect" && (
        <Button variant={score.grade === "bad" ? "primary" : "secondary"} onClick={onAgain}>
          Talk again
        </Button>
      )}
      <Button variant={score.grade === "bad" ? "secondary" : "primary"} onClick={onContinue}>
        Continue
      </Button>
    </ButtonRow>
  </div>
);
