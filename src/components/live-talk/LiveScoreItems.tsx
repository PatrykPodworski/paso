import type { LiveScoreItem } from "../../data/types";

const LEVELS = {
  correct: "Correct",
  understandable: "Understandable, with mistakes",
  missing: "Missing",
};

type Props = {
  items: LiveScoreItem[];
  /** Placement only — margin. */
  className?: string;
};

// Each point Lucía listened for, with how well the learner gave it.
export const LiveScoreItems = ({ items, className = "" }: Props) => (
  <ul aria-label="Your answers" className={`flex flex-col gap-1.5 text-sm ${className}`}>
    {items.map(({ id, label, level }) => (
      <li key={id} className="flex justify-between gap-3">
        <span>{label}</span>
        <span className={level === "missing" ? "text-destructive" : "text-muted-foreground"}>
          {LEVELS[level]}
        </span>
      </li>
    ))}
  </ul>
);
