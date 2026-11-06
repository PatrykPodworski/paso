import type { MockRun, Question } from "../../data/types";

const GRADES = { perfect: "Perfect", good: "Good", bad: "Not everything" };

type Props = {
  talks: MockRun["talks"];
  // The run's speaking tasks, whose talks Lucía grades.
  talkTasks: Question[];
  className?: string;
};

export const TalkGrades = ({ talks, talkTasks, className = "" }: Props) => (
  <ul aria-label="Lucía's grades" className={`flex flex-col gap-1.5 text-sm ${className}`}>
    {talkTasks.map((q, i) => (
      <li key={q.id} className="flex justify-between gap-3">
        <span>Task {i + 1}</span>
        <span className="text-muted-foreground">
          {talks[q.id] ? GRADES[talks[q.id].grade] : "Not done"}
        </span>
      </li>
    ))}
  </ul>
);
