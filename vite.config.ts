import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { coachPlugin } from "./server/coach.ts";
export default defineConfig({
  plugins: [react(), coachPlugin()],
  server: { watch: { ignored: ["**/.venv-coach/**"] } },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { environment: "jsdom", globals: false, setupFiles: ["./src/test/setup.ts"] },
});
