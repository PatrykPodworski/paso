export type Page = "today" | "path" | "practice" | "exam" | "guide" | "backoffice";

export const navigation: { id: Page; label: string; icon: string }[] = [
  { id: "today", label: "My learning space", icon: "home" },
  { id: "path", label: "Learning path", icon: "map" },
  { id: "practice", label: "Practice studio", icon: "layers" },
  { id: "exam", label: "Exam rehearsal", icon: "flag" },
  { id: "guide", label: "The A1 guide", icon: "book" },
];
