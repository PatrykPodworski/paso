import { allQuestions, foundations, visualQuestions } from "../data/curriculum";
import { formPractice } from "../data/mock";
import type { Lesson, Skill } from "../data/types";
export const exerciseBank = [...allQuestions, ...foundations, formPractice, ...visualQuestions];
export const skills: { id: Skill; name: string; spanish: string; icon: string }[] = [
  { id: "reading", name: "Reading", spanish: "Leer", icon: "book" },
  { id: "listening", name: "Listening", spanish: "Escuchar", icon: "headphones" },
  { id: "writing", name: "Writing", spanish: "Escribir", icon: "pen" },
  { id: "speaking", name: "Speaking", spanish: "Hablar", icon: "mic" },
];
export type Session = (lesson: Lesson) => void;
export type Practice = (skill: Skill | "all" | "mistakes") => void;
