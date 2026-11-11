type Props = { instruction?: string; className: string };

// A span, so it fits where only phrasing content may go: a summary, a button, a paragraph.
export const QuestionInstruction = ({ instruction, className }: Props) =>
  instruction ? (
    <span className={`block text-muted-foreground ${className}`}>{instruction}</span>
  ) : null;
