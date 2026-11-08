import type { Question } from "../../../data/types";

type Props = { question: Question; text: string; band?: number };

export const WritingResponse = ({ question, text, band }: Props) => (
  <div className="flex flex-col gap-2">
    <p className="font-medium">{question.prompt}</p>
    {text.trim() ? (
      <p className="whitespace-pre-wrap rounded-lg border border-border p-3" lang="es">
        {text}
      </p>
    ) : (
      <p className="text-muted-foreground">Nothing submitted</p>
    )}
    {band !== undefined && <p className="text-muted-foreground">Mark {band}/3</p>}
  </div>
);
