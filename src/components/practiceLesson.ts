import type { Lesson, ProgressSnapshot, Skill } from "../data/types";
import { exerciseBank } from "./practice";

export const practiceLesson = (
  skill: Skill | "all" | "mistakes",
  progress: ProgressSnapshot,
  mistakeQuestions: Lesson["questions"],
): Lesson | null => {
  let questions =
    skill === "mistakes"
      ? mistakeQuestions
      : exerciseBank.filter((q) =>
          skill === "speaking"
            ? q.kind === "live"
            : q.kind !== "live" && (skill === "all" || q.skill === skill),
        );

  if (!questions.length) {
    return null;
  }

  if (skill !== "mistakes") {
    const practiced = (id: string) => progress.questions[id]?.at || "";

    questions = [...questions].sort((a, b) => practiced(a.id).localeCompare(practiced(b.id)));
  }

  return {
    id: `practice-${skill}`,
    title:
      skill === "mistakes"
        ? "A fresh look at your mistakes"
        : skill === "all"
          ? "Your daily mix"
          : `${skill[0].toUpperCase() + skill.slice(1)} practice`,
    subtitle: "A little focused practice",
    minutes: 6,
    icon: "layers",
    // Each live talk spends the free talk or a passcode session, so speaking opens one.
    questions: questions.slice(0, skill === "speaking" ? 1 : skill === "writing" ? 4 : 8),
  };
};
