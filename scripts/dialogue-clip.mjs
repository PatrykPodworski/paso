export const dialogueText = (turns) => turns.map(([, text]) => text).join(" ");

// Whisper writes most spoken numbers as digits; "un" and "uno" stay words, so they are not listed.
const numbers = [
  "cero",
  "",
  "dos",
  "tres",
  "cuatro",
  "cinco",
  "seis",
  "siete",
  "ocho",
  "nueve",
  "diez",
  "once",
  "doce",
  "trece",
  "catorce",
  "quince",
  "dieciseis",
  "diecisiete",
  "dieciocho",
  "diecinueve",
  "veinte",
  "veintiuno",
  "veintidos",
  "veintitres",
  "veinticuatro",
  "veinticinco",
  "veintiseis",
  "veintisiete",
  "veintiocho",
  "veintinueve",
  "treinta",
];

const words = (text) =>
  text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => (numbers.includes(word) ? String(numbers.indexOf(word)) : word))
    .join(" ");

export const sameWords = (expected, heard) => words(expected) === words(heard);

export const installClip = (sources, key, entry) => {
  const next = { ...sources, [key]: entry };
  const old = sources[key]?.src;
  const unused = old && !Object.values(next).some((s) => s.src === old) ? old : null;

  return { sources: next, unused };
};
