import type { Question } from "../data/types";

type Props = { q: Pick<Question, "instruction" | "context">; className: string };

// A list row's lead-in to the prompt: the instruction, muted, then the sentence or situation it
// refers to. Spans, so they fit where only phrasing content may go: a summary, a button, a
// paragraph.
export const InstructionAndContext = ({ q, className }: Props) => (
  <>
    {q.instruction && (
      <span className={`block text-muted-foreground ${className}`}>{q.instruction}</span>
    )}
    {q.context && <span className={`block text-foreground ${className}`}>{q.context}</span>}
  </>
);
