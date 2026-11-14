import { teachingCard } from "../practice-sets/item.ts";
import type { SetLesson } from "../practice-sets/setLesson.ts";

// Each learning lesson introduces two or three days and practises them against each other; the
// earlier days come back as items the lesson owns, among its variations.
export const l01: SetLesson = {
  id: "wd-m01",
  title: "Monday to Wednesday",
  subtitle: "Learn three new days",
  recalled: [],
  introduction: teachingCard("WD-M01-INTRO", {
    heading: "New days: lunes, martes, miércoles",
    terms: [
      {
        es: "lunes",
        meaning: "Monday",
        example: { es: "Hoy es lunes.", en: "Today is Monday." },
        note: "From la Luna, the Moon.",
      },
      { es: "martes", meaning: "Tuesday", note: "From Marte, Mars." },
      {
        es: "miércoles",
        meaning: "Wednesday",
        note: "From Mercurio, Mercury. Write it with the accent on the é.",
      },
    ],
  }),
  base: [
    "WD-T02-E01",
    "WD-T01-E01",
    "WD-T03-E01",
    "WD-T03-E03",
    "WD-T01-E03",
    "WD-T02-E03",
    "WD-T01-E04",
    "WD-T03-E04",
    "WD-T02-E04",
    "WD-T03-N01",
    "WD-T01-N01",
    "WD-T02-N01",
    "WD-T01-N02",
    "WD-T03-N02",
    "WD-T02-N02",
  ],
  formCards: [
    {
      before: "WD-T01-E04",
      teach: {
        heading: "el lunes, los lunes",
        rule: "el is one day, los is every day. lunes, martes and miércoles stay the same, and days are written in lowercase.",
        examples: [
          { es: "el lunes", en: "one Monday" },
          { es: "los lunes", en: "every Monday" },
        ],
      },
    },
  ],
  variations: ["WD-T01-V01", "WD-T02-V01", "WD-T03-V01", "WD-T02-N07", "WD-T01-N07", "WD-T03-N07"],
};

export const l02: SetLesson = {
  id: "wd-m02",
  title: "Thursday and Friday",
  subtitle: "Learn two new days, mixed with Monday to Wednesday",
  recalled: [],
  introduction: teachingCard("WD-M02-INTRO", {
    heading: "New days: jueves, viernes",
    terms: [
      {
        es: "jueves",
        meaning: "Thursday",
        example: { es: "La visita es el jueves.", en: "The visit is on Thursday." },
        note: "From Júpiter, Jupiter.",
      },
      { es: "viernes", meaning: "Friday", note: "From Venus." },
    ],
  }),
  base: [
    "WD-T04-E01",
    "WD-T05-E01",
    "WD-T04-E03",
    "WD-T05-E03",
    "WD-T04-E04",
    "WD-T05-E04",
    "WD-T04-N01",
    "WD-T05-N01",
    "WD-T04-N02",
    "WD-T05-N02",
  ],
  formCards: [
    {
      before: "WD-T04-E04",
      teach: {
        heading: "el jueves, los jueves",
        rule: "jueves and viernes end in -s already, so they stay the same for every week.",
        examples: [
          { es: "los jueves", en: "every Thursday" },
          { es: "los viernes", en: "every Friday" },
        ],
      },
    },
  ],
  variations: [
    "WD-T04-V01",
    "WD-T05-V01",
    "WD-T04-N07",
    "WD-T05-N07",
    "WD-T01-E02",
    "WD-T02-E02",
    "WD-T03-E02",
    "WD-T01-N03",
    "WD-T02-N03",
    "WD-T03-N03",
  ],
};

export const r01: SetLesson = {
  id: "wd-mr01",
  title: "Monday to Friday",
  subtitle: "Review the five days so far",
  recalled: [],
  base: [],
  formCards: [],
  variations: [
    "WD-T04-E02",
    "WD-T05-E02",
    "WD-T02-V03",
    "WD-T01-V03",
    "WD-T03-V03",
    "WD-T04-V03",
    "WD-T05-V03",
    "WD-T01-N04",
    "WD-T02-N04",
    "WD-T03-N04",
    "WD-T04-N04",
    "WD-T05-N04",
    "WD-T01-N08",
    "WD-T02-N08",
    "WD-T03-N08",
    "WD-T04-N08",
    "WD-T05-N08",
    "WD-T01-V09",
    "WD-T02-V11",
    "WD-T03-V11",
    "WD-T04-V09",
    "WD-T05-V09",
  ],
};

export const l03: SetLesson = {
  id: "wd-m03",
  title: "Saturday and Sunday",
  subtitle: "Learn the weekend, mixed with Monday to Friday",
  recalled: [],
  introduction: teachingCard("WD-M03-INTRO", {
    heading: "New days: sábado, domingo",
    terms: [
      {
        es: "sábado",
        meaning: "Saturday",
        example: { es: "Hoy es sábado.", en: "Today is Saturday." },
        note: "From the Sabbath, the day of rest. Write it with the accent on the á.",
      },
      {
        es: "domingo",
        meaning: "Sunday",
        note: "From dies Dominicus, Latin for the Lord’s day.",
      },
    ],
  }),
  base: [
    "WD-T06-E01",
    "WD-T07-E01",
    "WD-T06-E03",
    "WD-T07-E03",
    "WD-T06-E04",
    "WD-T07-V01",
    "WD-T06-N01",
    "WD-T07-N01",
    "WD-T06-N02",
    "WD-T07-N02",
  ],
  formCards: [
    {
      before: "WD-T06-E04",
      teach: {
        heading: "el sábado, los sábados",
        rule: "sábado and domingo add -s for every week.",
        examples: [
          { es: "el sábado", en: "one Saturday" },
          { es: "los sábados", en: "every Saturday" },
          { es: "los domingos", en: "every Sunday" },
        ],
      },
    },
  ],
  variations: [
    "WD-T06-V01",
    "WD-T06-V09",
    "WD-T06-N07",
    "WD-T07-V07",
    "WD-T07-V09",
    "WD-T07-N07",
    "WD-T01-V05",
    "WD-T02-V05",
    "WD-T03-V05",
    "WD-T04-N05",
    "WD-T05-N05",
  ],
};

// R02 closes the set: the calendar items in their written order, then the weekend's remaining
// items.
export const r02: SetLesson = {
  id: "wd-mr02",
  title: "The whole week",
  subtitle: "Review all seven days and their order",
  recalled: [],
  base: [],
  formCards: [],
  variations: [
    "WD-G01-C01",
    "WD-G01-C02",
    "WD-G01-C03",
    "WD-G01-C04",
    "WD-G01-C05",
    "WD-G01-C06",
    "WD-G01-C07",
    "WD-G02-C01",
    "WD-G02-C02",
    "WD-G02-C03",
    "WD-G02-C04",
    "WD-G02-C05",
    "WD-G02-C06",
    "WD-G02-C07",
    "WD-G03",
    "WD-G04-C01",
    "WD-G04-C02",
    "WD-T06-E02",
    "WD-T07-E02",
    "WD-T06-N04",
    "WD-T07-N04",
    "WD-T07-E04",
    "WD-T07-N08",
  ],
};
