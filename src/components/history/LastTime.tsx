import type { Attempt } from "../../data/types";
import { answerResult } from "./answerResult";

export type LastAttempt = Pick<Attempt, "at" | "correct">;

type Props = { previous: LastAttempt };

// How the learner answered this question the time before.
export const LastTime = ({ previous }: Props) => {
  const result = answerResult(previous.correct);

  return (
    <p className="ml-auto normal-case tracking-normal text-xs max-md:text-2xs text-sage-500">
      Last time: <span className={`font-medium ${result.tone}`}>{result.label}</span> ·{" "}
      <time dateTime={previous.at}>{new Date(previous.at).toLocaleDateString()}</time>
    </p>
  );
};
