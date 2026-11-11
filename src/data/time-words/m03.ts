import { teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

export const m03: SetLesson = {
  id: "tm-m03",
  title: "Early and late",
  subtitle: "temprano, tarde",
  recalled: [],
  introduction: teachingCard(
    "TM-M03-INTRO",
    "New words: temprano, tarde",
    "temprano means early, earlier than usual or than agreed. In Spain pronto means early too. Example: Hoy Pablo se levanta temprano. tarde means late, later than usual or than agreed. Example: Hoy me acuesto tarde.",
  ),
  base: [
    "TM-T07-E01",
    "TM-T08-E01",
    "TM-T07-E03",
    "TM-T08-E03",
    "TM-T07-E04",
    "TM-T08-E04",
    "TM-T07-E05",
    "TM-T08-E05",
  ],
  formCards: [
    {
      before: "TM-T08-E04",
      heading: "tarde and la tarde",
      text: "tarde alone means late. With la, la tarde is the afternoon. In these exercises tarde means late.",
    },
  ],
  variations: [
    "TM-T07-E06",
    "TM-T08-E06",
    "TM-T07-V11",
    "TM-T08-V11",
    "TM-T04-V03",
    "TM-T05-V03",
    "TM-T06-V03",
    "TM-T01-V04",
    "TM-T02-V04",
    "TM-T03-V04",
  ],
};
