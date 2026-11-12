import { teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

export const m01: SetLesson = {
  id: "tm-m01",
  title: "Today, tomorrow, yesterday",
  subtitle: "hoy, mañana, ayer",
  recalled: [],
  introduction: teachingCard("TM-M01-INTRO", {
    heading: "New words",
    terms: [
      {
        es: "hoy",
        meaning: "today",
        example: { es: "Clase de Pablo: hoy.", en: "Pablo's class: today." },
      },
      {
        es: "mañana",
        meaning: "tomorrow",
        example: { es: "Reunión de Luis: mañana.", en: "Luis's meeting: tomorrow." },
      },
      {
        es: "ayer",
        meaning: "yesterday",
        example: { es: "Visita de Diego: ayer.", en: "Diego's visit: yesterday." },
      },
    ],
  }),
  base: [
    "TM-T01-E01",
    "TM-T02-E01",
    "TM-T03-E01",
    "TM-T01-E03",
    "TM-T02-E03",
    "TM-T03-E03",
    "TM-T01-E04",
    "TM-T02-E04",
    "TM-T03-E04",
    "TM-T01-E05",
    "TM-T02-E05",
    "TM-T03-E05",
  ],
  formCards: [
    {
      before: "TM-T02-E04",
      teach: {
        heading: "mañana and la mañana",
        rule: "mañana alone means tomorrow, as in these exercises; la mañana is the morning.",
      },
    },
  ],
  variations: ["TM-T01-E06", "TM-T02-E06", "TM-T03-E06", "TM-T01-V11", "TM-T02-V11", "TM-T03-V11"],
};
