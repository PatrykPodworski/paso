import type { LiveScore, Question } from "../../../data/types";
import { CorrectionList } from "../../CorrectionList";
import { LiveScoreItems } from "../../live-talk/LiveScoreItems";

const GRADES = { perfect: "Perfect", good: "Good", bad: "Not everything" };

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
        <LiveScoreItems items={score.items} />
        {score.corrections && score.corrections.length > 0 && (
          <CorrectionList corrections={score.corrections} />
        )}
      </>
    ) : (
      <p className="text-muted-foreground">No scored talk</p>
    )}
  </div>
);
