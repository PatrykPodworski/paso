export type Page = "today" | "path" | "practice" | "exam" | "guide";
export const navigation: { id: Page; label: string; icon: string }[] = [
  { id: "today", label: "My learning space", icon: "home" },
  { id: "path", label: "Learning path", icon: "map" },
  { id: "practice", label: "Practice studio", icon: "layers" },
  { id: "exam", label: "Exam rehearsal", icon: "flag" },
  { id: "guide", label: "The A1 guide", icon: "book" },
];
export const pageFromHash = (): Page => {
  const h = window.location.hash.slice(1);
  return navigation.some((n) => n.id === h) ? (h as Page) : "today";
};
