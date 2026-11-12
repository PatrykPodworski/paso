import { teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

export const m03: SetLesson = {
  id: "tm-m03",
  title: "Early and late",
  subtitle: "temprano, tarde",
  recalled: [],
  introduction: teachingCard("TM-M03-INTRO", {
    heading: "New words",
    terms: [
      {
        es: "temprano",
        meaning: "early, earlier than usual or than agreed",
        example: { es: "Hoy Pablo se levanta temprano.", en: "Today Pablo gets up early." },
        note: "In Spain pronto means early too.",
      },
      {
        es: "tarde",
        meaning: "late, later than usual or than agreed",
        example: { es: "Hoy me acuesto tarde.", en: "Today I go to bed late." },
      },
    ],
  }),
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
      teach: {
        heading: "tarde and la tarde",
        rule: "tarde alone means late, as in these exercises; la tarde is the afternoon.",
      },
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
