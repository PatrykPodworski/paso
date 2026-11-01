import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { sourceIncludes, sourceExcludes } from "./scripts/test-surface.mjs";

export default defineConfig({
  plugins: [react()],
  // Registry components import each other through the @ alias.
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "jsdom",
    include: [
      "src/**/*.test.{ts,tsx}",
      "api/**/*.test.ts",
      "db/**/*.test.ts",
      "scripts/**/*.test.mjs",
      "lint-plugins/**/*.test.mjs",
    ],
    setupFiles: ["./src/test/setup.ts"],
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      provider: "v8",
      include: sourceIncludes,
      exclude: sourceExcludes,
      // statements/lines were 98, set just under a measurement that included the coach; 23 uncovered statements before and after its removal.
      thresholds: {
        statements: 97,
        branches: 95,
        functions: 97,
        lines: 97,
        "src/data/progress.ts": { statements: 100, branches: 100, functions: 100, lines: 100 },
        "scripts/audio-budget.mjs": { statements: 98, branches: 100, functions: 100, lines: 98 },
      },
      reporter: ["text", "json", "html", "json-summary"],
    },
  },
});
