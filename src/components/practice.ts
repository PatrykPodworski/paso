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
    tint: "bg-[#edf1e7] text-[#91a27a]",
  },
  {
    id: "listening",
    name: "Listening",
    spanish: "Escuchar",
    icon: "headphones",
    tint: "bg-[#efebf2] text-[#a294b1]",
  },
  {
    id: "writing",
    name: "Writing",
    spanish: "Escribir",
    icon: "pen",
    tint: "bg-[#f6eddf] text-[#be9971]",
  },
  {
    id: "speaking",
    name: "Speaking",
    spanish: "Hablar",
    icon: "mic",
    tint: "bg-[#f5e9e3] text-[#be8b78]",
  },
];

export const SKILL_ICON = "flex items-center justify-center shrink-0 rounded-[9px]";

export const SKILL_ICON_SIZE =
  "w-[37px] h-[37px] max-xl:w-[35px] max-xl:h-[35px] max-md:w-[30px] max-md:h-[30px] max-sm:w-[35px] max-sm:h-[35px]";

export type Session = (lesson: Lesson) => void;
export type Practice = (skill: Skill | "all" | "mistakes") => void;
