import { teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

export const m05: SetLesson = {
  id: "tm-m05",
  title: "Always, sometimes, never",
  subtitle: "siempre, a veces, nunca",
  recalled: [],
  introduction: teachingCard("TM-M05-INTRO", {
    heading: "New words",
    terms: [
      {
        es: "siempre",
        meaning: "always",
        example: { es: "Pablo siempre estudia en casa.", en: "Pablo always studies at home." },
      },
      {
        es: "a veces",
        meaning: "sometimes",
        example: { es: "Yo a veces voy en autobús.", en: "I sometimes go by bus." },
      },
      {
        es: "nunca",
        meaning: "never",
        example: { es: "Tomás nunca trabaja los sábados.", en: "Tomás never works on Saturdays." },
      },
    ],
  }),
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
      teach: {
        heading: "siempre and the verb",
        rule: "siempre usually goes before the verb, but after the verb is right too.",
        examples: [
          { es: "Pablo siempre estudia en casa.", en: "Pablo always studies at home." },
          { es: "Pablo estudia siempre en casa.", en: "Pablo always studies at home." },
        ],
      },
    },
    {
      before: "TM-T14-E04",
      teach: {
        heading: "nunca, with or without no",
        rule: "nunca before the verb is enough; with no, nunca goes after the verb.",
        examples: [
          { es: "Pablo nunca estudia en casa.", en: "Pablo never studies at home." },
          { es: "Pablo no estudia nunca en casa.", en: "Pablo never studies at home." },
        ],
      },
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
