import type { LiveScore, Question } from "../../../data/types";
import { CorrectionList } from "../../CorrectionList";

const GRADES = { perfect: "Perfect", good: "Good", bad: "Not everything" };

const LEVELS = {
  correct: "Correct",
  understandable: "Understandable, with mistakes",
  missing: "Missing",
};

type Props = { question: Question; transcript?: string; score?: LiveScore };

// A scored talk: the transcript, one turn per line, then Lucía's grade of it.
export const SpeakingResponse = ({ question, transcript, score }: Props) => (
  <div className="flex flex-col gap-2">
    <p className="font-medium">{question.prompt}</p>
    {transcript !== undefined && score ? (
      <>
        <div className="flex flex-col gap-1 rounded-lg border border-border p-3" lang="es">
          {transcript.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <p>Lucía's grade: {GRADES[score.grade]}</p>
        <ul aria-label="Lucía's points" className="flex flex-col gap-1.5">
          {score.items.map(({ id, label, level }) => (
            <li key={id} className="flex justify-between gap-3">
              <span>{label}</span>
              <span className={level === "missing" ? "text-destructive" : "text-muted-foreground"}>
                {LEVELS[level]}
              </span>
            </li>
          ))}
        </ul>
        {score.corrections && score.corrections.length > 0 && (
          <CorrectionList corrections={score.corrections} />
        )}
      </>
    ) : (
      <p className="text-muted-foreground">No scored talk</p>
    )}
  </div>
);
