import { expect, it } from "vitest";
import { mergedCorrections, uniqueCorrections } from "./corrections";
import type { Correction } from "./types";

const de: Correction = {
  original: "un poco español",
  corrected: "un poco de español",
  explanation: "The expression needs de before the language name.",
};

const personality: Correction = {
  original: "Paciencia y muy tranquilo",
  corrected: "paciente y muy tranquilo",
  explanation: "Paciente is the adjective describing a person; paciencia is the noun.",
};

const personalityShort: Correction = {
  original: "Paciencia",
  corrected: "paciente",
  explanation: personality.explanation,
};

const screenshot = [de, personality, { ...de }, personalityShort];

it("collapses the screenshot's exact copy and the shorter quote of the same mistake", () => {
  expect(uniqueCorrections(screenshot)).toEqual([de, personality]);
});

it("keeps the fuller quote when it arrives after the short one", () => {
  expect(uniqueCorrections([personalityShort, personality])).toEqual([personality]);
});

it("keeps the fuller quote and the more informative explanation", () => {
  const brief = { ...personality, explanation: "Adjective." };
  const noted = { ...personalityShort, explanation: personality.explanation };

  expect(uniqueCorrections([brief, noted])).toEqual([
    { ...personality, explanation: noted.explanation },
  ]);

  expect(uniqueCorrections([noted, brief])).toEqual([personality]);
});

it("treats case, spacing and surrounding punctuation as the same quote", () => {
  const typed = {
    original: "Un  poco español",
    corrected: "un poco de español",
    explanation: "Needs de.",
  };

  const spoken = {
    original: "un poco español,",
    corrected: "Un poco de español.",
    explanation: "needs de!",
  };

  expect(uniqueCorrections([typed, spoken])).toEqual([typed]);
});

it("keeps distinct mistakes that share an explanation", () => {
  const feminine = "The noun is feminine.";

  expect(
    uniqueCorrections([
      { original: "el casa", corrected: "la casa", explanation: feminine },
      { original: "el mesa", corrected: "la mesa", explanation: feminine },
    ]),
  ).toEqual([
    { original: "el casa", corrected: "la casa", explanation: feminine },
    { original: "el mesa", corrected: "la mesa", explanation: feminine },
  ]);
});

it("keeps a neighbouring word when it is a different change", () => {
  const agreement: Correction = {
    original: "muy tranquilo",
    corrected: "muy tranquila",
    explanation: personality.explanation,
  };

  expect(uniqueCorrections([personality, agreement])).toEqual([personality, agreement]);
});

it("keeps side by side mistakes that are not the same change", () => {
  const article: Correction = {
    original: "español",
    corrected: "el español",
    explanation: de.explanation,
  };

  expect(uniqueCorrections([de, article])).toEqual([de, article]);
});

it("keeps two different fixes of the same words", () => {
  const tener = "Use tener.";

  expect(
    uniqueCorrections([
      { original: "Soy veinte", corrected: "Tengo veinte", explanation: tener },
      { original: "Soy veinte", corrected: "Tengo veinte años", explanation: tener },
    ]),
  ).toHaveLength(2);
});

it("matches the same change when an earlier copy of the word is a different edit", () => {
  const both = {
    original: "casa grande y casa pequeña",
    corrected: "casa grande y casas pequeñas",
    explanation: "The second noun is plural.",
  };

  const second = {
    original: "casa pequeña",
    corrected: "casas pequeñas",
    explanation: "Plural.",
  };

  const firstOnly = {
    original: "casa",
    corrected: "casas",
    explanation: "Plural.",
  };

  expect(uniqueCorrections([both, second])).toEqual([both]);
  expect(uniqueCorrections([both, firstOnly])).toEqual([both, firstOnly]);
});

it("does not treat letters inside a word, or an empty quote, as the same mistake", () => {
  const article = { original: "español", corrected: "el español", explanation: "Article." };
  const verb = { original: "es", corrected: "es", explanation: "Article." };
  const blank = { original: "", corrected: "", explanation: "Article." };

  const dashed = {
    original: "Paciencia — y muy tranquilo",
    corrected: "paciente y muy tranquilo",
    explanation: personality.explanation,
  };

  expect(uniqueCorrections([article, verb, blank])).toEqual([article, verb, blank]);
  expect(uniqueCorrections([dashed, personalityShort])).toEqual([dashed]);
});

it("keeps a missing answer separate from a different missing answer", () => {
  const age = { original: "", corrected: "Tengo veinte años.", explanation: "Say your age." };
  const city = { original: " ", corrected: "Vivo en Madrid.", explanation: "Say your age." };

  const ageAgain = {
    original: "",
    corrected: "Tengo veinte años.",
    explanation: "Age was missing.",
  };

  expect(uniqueCorrections([age, city])).toEqual([age, city]);
  expect(uniqueCorrections([age, ageAgain])).toEqual([{ ...age, explanation: "Age was missing." }]);

  expect(
    uniqueCorrections([age, { original: "hola", corrected: "hola", explanation: age.explanation }]),
  ).toHaveLength(2);
});

it("does not let a repeated fix take a later correction's place under the cap", () => {
  const fix = { original: "a", corrected: "b", explanation: "p" };

  const distinct = Array.from({ length: 8 }, (_, i) => ({
    original: `error ${i}`,
    corrected: `fixed ${i}`,
    explanation: `Because ${i}.`,
  }));

  const fuller = {
    original: "a y más",
    corrected: "b y más",
    explanation: "p",
  };

  expect(mergedCorrections([fix], [fix, ...distinct, fuller, distinct[0]], 8)).toEqual([
    fuller,
    ...distinct,
  ]);
});

it("drops a distinct correction past the cap and still upgrades an earlier quote", () => {
  const fix = { original: "Paciencia", corrected: "paciente", explanation: "Short." };

  expect(
    mergedCorrections(
      [fix],
      [
        {
          original: "otro",
          corrected: "otra",
          explanation: "Gender.",
        },
        personality,
      ],
      0,
    ),
  ).toEqual([personality]);
});
