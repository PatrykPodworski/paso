import { allQuestions, foundations, visualQuestions } from "../data/curriculum";
import { formPractice } from "../data/mock";
import type { Lesson, Skill } from "../data/types";

export const exerciseBank = [...allQuestions, ...foundations, formPractice, ...visualQuestions];

export const skills: { id: Skill; name: string; spanish: string; icon: string; tint: string }[] = [
  {
    id: "reading",
    name: "Reading",
    spanish: "Leer",
    icon: "book",
    tint: "bg-sage-100 text-olive-500",
  },
  {
    id: "listening",
    name: "Listening",
    spanish: "Escuchar",
    icon: "headphones",
    tint: "bg-lavender-100 text-lavender-500",
  },
  {
    id: "writing",
    name: "Writing",
    spanish: "Escribir",
    icon: "pen",
    tint: "bg-sand-100 text-sand-500",
  },
  {
    id: "speaking",
    name: "Speaking",
    spanish: "Hablar",
    icon: "mic",
    tint: "bg-coral-100 text-coral-500",
  },
];

export const SKILL_ICON = "flex items-center justify-center shrink-0 rounded-lg";

export const SKILL_ICON_SIZE = "w-9 h-9 max-md:w-7 max-md:h-7 max-sm:w-9 max-sm:h-9";

export type Session = (lesson: Lesson) => void;
export type Practice = (skill: Skill | "all" | "mistakes") => void;
