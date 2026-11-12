import { teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

export const m04: SetLesson = {
  id: "tm-m04",
  title: "Morning, afternoon, night",
  subtitle: "por la mañana, por la tarde, por la noche",
  recalled: [],
  introduction: teachingCard("TM-M04-INTRO", {
    heading: "New words",
    terms: [
      {
        es: "por la mañana",
        meaning: "in the morning",
        example: { es: "Pablo estudia por la mañana.", en: "Pablo studies in the morning." },
      },
      {
        es: "por la tarde",
        meaning: "in the afternoon",
        example: { es: "Luis trabaja por la tarde.", en: "Luis works in the afternoon." },
      },
      {
        es: "por la noche",
        meaning: "at night, in the evening",
        example: { es: "Diego lee por la noche.", en: "Diego reads at night." },
      },
    ],
  }),
  base: [
    "TM-T09-E01",
    "TM-T10-E01",
    "TM-T11-E01",
    "TM-T09-E03",
    "TM-T10-E03",
    "TM-T11-E03",
    "TM-T09-E04",
    "TM-T10-E04",
    "TM-T11-E04",
    "TM-T09-E05",
    "TM-T10-E05",
    "TM-T11-E05",
  ],
  formCards: [
    {
      before: "TM-T09-E04",
      teach: {
        heading: "por la mañana, not mañana",
        rule: "Keep all three words: por la mañana is in the morning, and mañana alone means tomorrow.",
      },
    },
    {
      before: "TM-T10-E04",
      teach: {
        heading: "por la tarde, not tarde",
        rule: "Keep all three words: por la tarde is in the afternoon, and tarde alone means late.",
      },
    },
  ],
  variations: [
    "TM-T09-E06",
    "TM-T10-E06",
    "TM-T11-E06",
    "TM-T09-V11",
    "TM-T10-V11",
    "TM-T11-V11",
    "TM-T07-V03",
    "TM-T08-V03",
    "TM-T05-V04",
  ],
};
