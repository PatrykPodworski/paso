import type { Lesson, Progress, Skill } from "../data/types";
import { exerciseBank } from "./practice";

export const practiceLesson = (
  skill: Skill | "all" | "mistakes",
  progress: Progress,
  mistakeQuestions: Lesson["questions"],
): Lesson | null => {
  let questions =
    skill === "mistakes"
      ? mistakeQuestions
      : exerciseBank.filter((q) => skill === "all" || q.skill === skill);

  if (!questions.length) {
    return null;
  }

  if (skill !== "mistakes") {
    const practiced = new Map(progress.attempts.map((a) => [a.questionId, a.at]));

    questions = [...questions].sort((a, b) =>
      (practiced.get(a.id) || "").localeCompare(practiced.get(b.id) || ""),
    );
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
    questions: questions.slice(0, skill === "writing" || skill === "speaking" ? 4 : 8),
  };
};
