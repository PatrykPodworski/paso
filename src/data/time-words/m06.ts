import { teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

export const m06: SetLesson = {
  id: "tm-m06",
  title: "From and until",
  subtitle: "desde, hasta",
  recalled: [],
  introduction: teachingCard("TM-M06-INTRO", {
    heading: "New words",
    terms: [
      {
        es: "desde",
        meaning: "from; it gives the start time",
        example: { es: "Trabajo desde las nueve.", en: "I work from nine." },
      },
      {
        es: "hasta",
        meaning: "until; it gives the end time",
        example: { es: "Trabajo hasta las cinco.", en: "I work until five." },
      },
    ],
  }),
  base: [
    "TM-T15-E01",
    "TM-T16-E01",
    "TM-T15-E03",
    "TM-T16-E03",
    "TM-T15-E04",
    "TM-T16-E04",
    "TM-T15-E05",
    "TM-T16-E05",
  ],
  formCards: [],
  variations: [
    "TM-T15-E06",
    "TM-T16-E06",
    "TM-T15-V11",
    "TM-T16-V11",
    "TM-T12-V03",
    "TM-T13-V03",
    "TM-T14-V03",
    "TM-T08-V04",
    "TM-T10-V04",
    "TM-T04-V04",
  ],
};
