import { teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

export const m02: SetLesson = {
  id: "tm-m02",
  title: "Now, earlier, later",
  subtitle: "ahora, antes, después",
  recalled: [],
  introduction: teachingCard(
    "TM-M02-INTRO",
    "New words: ahora, antes, después / luego",
    "ahora means now, at this moment. hoy is the whole day; ahora is this moment. Example: Trabajo ahora. antes means before, earlier. Example: Pablo come a las dos. Yo como antes. después and luego both mean after, later. Example: Desayuno y luego trabajo.",
  ),
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
      heading: "después or luego",
      text: "Both mean after, later. Either one is right in these exercises. después has an accent on the é.",
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
