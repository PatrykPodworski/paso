import { allQuestions, foundations, visualQuestions } from "../data/curriculum";
import { formPractice } from "../data/mock";
import type { Lesson, Skill } from "../data/types";

export const exerciseBank = [...allQuestions, ...foundations, formPractice, ...visualQuestions];

export const SKILL_TINT: Record<Skill, string> = {
  reading: "bg-skill-reading/10 text-skill-reading",
  listening: "bg-skill-listening/10 text-skill-listening",
  writing: "bg-skill-writing/10 text-skill-writing",
  speaking: "bg-skill-speaking/10 text-skill-speaking",
};

export const skills: { id: Skill; name: string; spanish: string; icon: string; tint: string }[] = [
  {
    id: "reading",
    name: "Reading",
    spanish: "Leer",
    icon: "book",
    tint: SKILL_TINT.reading,
  },
  {
    id: "listening",
    name: "Listening",
    spanish: "Escuchar",
    icon: "headphones",
    tint: SKILL_TINT.listening,
  },
  {
    id: "writing",
    name: "Writing",
    spanish: "Escribir",
    icon: "pen",
    tint: SKILL_TINT.writing,
  },
  {
    id: "speaking",
    name: "Speaking",
    spanish: "Hablar",
    icon: "mic",
    tint: SKILL_TINT.speaking,
  },
];

export const SKILL_ICON = "flex items-center justify-center shrink-0 rounded-lg";

export const SKILL_ICON_SIZE = "w-9 h-9 max-md:w-7 max-md:h-7 max-sm:w-9 max-sm:h-9";

export type Session = (lesson: Lesson) => void;
export type Practice = (skill: Skill | "all" | "mistakes") => void;
