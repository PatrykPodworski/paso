import { uniqueCorrections } from "../data/corrections";
import type { Correction } from "../data/types";

type Props = { corrections: Correction[] };

// A saved talk keeps the list it was given. Repeats from before they were collapsed still show once.
export const CorrectionList = ({ corrections }: Props) => (
  <ul aria-label="Corrections" className="mbs-2 flex flex-col gap-2">
    {uniqueCorrections(corrections).map((c) => (
      <li key={`${c.original}→${c.corrected}`} className="text-sm leading-relaxed text-foreground">
        <span lang="es" className="line-through decoration-destructive">
          {c.original}
        </span>{" "}
        → <strong lang="es">{c.corrected}</strong>{" "}
        <span className="text-muted-foreground">{c.explanation}</span>
      </li>
    ))}
  </ul>
);
