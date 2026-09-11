import { globSync } from "node:fs";
// Authored course data has exhaustive integrity tests. Artwork is covered by
// visual comparisons. New application modules enter coverage automatically.
export const sourceIncludes = [
  "src/**/*.{ts,tsx}",
  "scripts/{audio-budget,audio-direction,elevenlabs,generate-elevenlabs}.mjs",
];
export const sourceExcludes = [
  "src/test/**",
  "**/*.test.*",
  "**/*.d.ts",
  "src/main.tsx",
  "src/data/{curriculum,mock,research,types,vocabulary-hints}.ts",
  "src/components/{Art,Icon}.tsx",
  // A visual-test harness with no logic; the screenshots are its coverage.
  "src/design-system/{Gallery.tsx,sections.ts}",
];
export const productionFiles = () =>
  [...globSync(sourceIncludes, { exclude: sourceExcludes })].sort();
