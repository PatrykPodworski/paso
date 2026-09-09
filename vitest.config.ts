import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { sourceIncludes, sourceExcludes } from "./scripts/test-surface.mjs";
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.mjs"],
    setupFiles: ["./src/test/setup.ts"],
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      provider: "v8",
      include: sourceIncludes,
      exclude: sourceExcludes,
      thresholds: {
        statements: 98,
        branches: 95,
        functions: 97,
        lines: 98,
        "src/data/progress.ts": { statements: 100, branches: 100, functions: 100, lines: 100 },
        "scripts/audio-budget.mjs": { statements: 98, branches: 100, functions: 100, lines: 98 },
      },
      reporter: ["text", "json", "html", "json-summary"],
    },
  },
});
