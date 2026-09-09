import { globSync } from "node:fs";
// Authored course data has exhaustive integrity tests. Artwork is covered by
// visual comparisons. New application modules enter coverage automatically.
export const sourceIncludes = [
  "src/**/*.{ts,tsx}",
  "server/**/*.ts",
  "scripts/{audio-budget,audio-direction,elevenlabs,generate-elevenlabs}.mjs",
];
export const sourceExcludes = [
  "src/test/**",
  "**/*.test.*",
  "**/*.d.ts",
  "src/main.tsx",
  "src/data/{curriculum,mock,research,types,vocabulary-hints}.ts",
  "src/components/{Art,Icon}.tsx",
];
export const productionFiles = () =>
  [...globSync(sourceIncludes, { exclude: sourceExcludes })].sort();
