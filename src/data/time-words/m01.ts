import { teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

export const m01: SetLesson = {
  id: "tm-m01",
  title: "Today, tomorrow, yesterday",
  subtitle: "hoy, mañana, ayer",
  recalled: [],
  introduction: teachingCard(
    "TM-M01-INTRO",
    "New words: hoy, mañana, ayer",
    "hoy means today. Example: Clase de Pablo: hoy. mañana means tomorrow. Example: Reunión de Luis: mañana. ayer means yesterday. Example: Visita de Diego: ayer.",
  ),
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
      heading: "mañana and la mañana",
      text: "mañana alone means tomorrow. With la, la mañana is the morning. In these exercises mañana means tomorrow.",
    },
  ],
  variations: ["TM-T01-E06", "TM-T02-E06", "TM-T03-E06", "TM-T01-V11", "TM-T02-V11", "TM-T03-V11"],
};
