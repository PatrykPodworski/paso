import { teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

export const m02: SetLesson = {
  id: "tm-m02",
  title: "Now, earlier, later",
  subtitle: "ahora, antes, después",
  recalled: [],
  introduction: teachingCard("TM-M02-INTRO", {
    heading: "New words",
    terms: [
      {
        es: "ahora",
        meaning: "now, at this moment",
        example: { es: "Trabajo ahora.", en: "I'm working now." },
        note: "hoy is the whole day; ahora is this moment.",
      },
      {
        es: "antes",
        meaning: "before, earlier",
        example: {
          es: "Pablo come a las dos. Yo como antes.",
          en: "Pablo eats at two. I eat earlier.",
        },
      },
      {
        es: "después / luego",
        meaning: "after, later",
        example: { es: "Desayuno y luego trabajo.", en: "I have breakfast and then I work." },
        note: "Both words mean the same.",
      },
    ],
  }),
  base: [
    "TM-T04-E01",
    "TM-T05-E01",
    "TM-T06-E01",
    "TM-T04-E03",
    "TM-T05-E03",
    "TM-T06-E03",
    "TM-T04-E04",
    "TM-T05-E04",
    "TM-T06-E04",
    "TM-T04-E05",
    "TM-T05-E05",
    "TM-T06-E05",
  ],
  formCards: [
    {
      before: "TM-T06-E04",
      teach: {
        heading: "después or luego",
        rule: "Both mean after, later, so either one is right; después has an accent on the é.",
      },
    },
  ],
  variations: [
    "TM-T04-E06",
    "TM-T05-E06",
    "TM-T06-E06",
    "TM-T04-V11",
    "TM-T05-V11",
    "TM-T06-V11",
    "TM-T01-V03",
    "TM-T02-V03",
    "TM-T03-V03",
  ],
};
