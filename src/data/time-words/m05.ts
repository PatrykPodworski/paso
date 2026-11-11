import { teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

export const m05: SetLesson = {
  id: "tm-m05",
  title: "Always, sometimes, never",
  subtitle: "siempre, a veces, nunca",
  recalled: [],
  introduction: teachingCard(
    "TM-M05-INTRO",
    "New words: siempre, a veces, nunca",
    "siempre means always. Example: Pablo siempre estudia en casa. a veces means sometimes. Example: Yo a veces voy en autobús. nunca means never. Example: Tomás nunca trabaja los sábados.",
  ),
  base: [
    "TM-T12-E01",
    "TM-T13-E01",
    "TM-T14-E01",
    "TM-T12-E03",
    "TM-T13-E03",
    "TM-T14-E03",
    "TM-T12-E04",
    "TM-T13-E04",
    "TM-T14-E04",
    "TM-T12-E05",
    "TM-T13-E05",
    "TM-T14-E05",
  ],
  formCards: [
    {
      before: "TM-T12-E04",
      heading: "siempre and the verb",
      text: "siempre usually goes before the verb: Pablo siempre estudia en casa. After the verb is right too: Pablo estudia siempre en casa.",
    },
    {
      before: "TM-T14-E04",
      heading: "nunca, with or without no",
      text: "nunca before the verb is enough: Pablo nunca estudia en casa. With no, nunca goes after the verb: Pablo no estudia nunca en casa.",
    },
  ],
  variations: [
    "TM-T12-E06",
    "TM-T13-E06",
    "TM-T14-E06",
    "TM-T12-V11",
    "TM-T13-V11",
    "TM-T14-V11",
    "TM-T09-V03",
    "TM-T10-V03",
    "TM-T11-V03",
    "TM-T07-V04",
  ],
};
