import { teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

export const m04: SetLesson = {
  id: "tm-m04",
  title: "Morning, afternoon, night",
  subtitle: "por la mañana, por la tarde, por la noche",
  recalled: [],
  introduction: teachingCard(
    "TM-M04-INTRO",
    "New words: por la mañana, por la tarde, por la noche",
    "por la mañana means in the morning. Example: Pablo estudia por la mañana. por la tarde means in the afternoon. Example: Luis trabaja por la tarde. por la noche means at night, in the evening. Example: Diego lee por la noche.",
  ),
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
      heading: "por la mañana, not mañana",
      text: "Keep all three words: por la mañana is in the morning. mañana alone means tomorrow.",
    },
    {
      before: "TM-T10-E04",
      heading: "por la tarde, not tarde",
      text: "Keep all three words: por la tarde is in the afternoon. tarde alone means late.",
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
