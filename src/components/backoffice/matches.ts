const fold = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

// Accent-blind, so "cancion" finds "canción".
export const matches = (query: string, ...texts: string[]) => {
  const needle = fold(query.trim());

  return texts.some((t) => fold(t).includes(needle));
};
