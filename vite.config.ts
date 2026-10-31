import type { ServerResponse } from "node:http";
import { fileURLToPath, URL } from "node:url";
import { type Connect, defineConfig, type Plugin, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { Db } from "./api/_lib/db.ts";

const requestOf = async (req: Connect.IncomingMessage) => {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }

  return new Request(`http://${req.headers.host}${req.originalUrl}`, {
    method: req.method,
    headers: Object.entries(req.headers).map(([name, value]) => [name, String(value)]),
    body: chunks.length ? Buffer.concat(chunks) : undefined,
  });
};

const serve = async (
  server: ViteDevServer,
  db: Promise<Db>,
  req: Connect.IncomingMessage,
  res: ServerResponse,
) => {
  const { handleProgress } = (await server.ssrLoadModule(
    "/api/progress.ts",
  )) as typeof import("./api/progress.ts");

  const response = await handleProgress(await requestOf(req), await db, async () => null);

  res.statusCode = response.status;
  response.headers.forEach((value, name) => res.setHeader(name, value));
  res.end(Buffer.from(await response.arrayBuffer()));
};

// Serves /api/progress in `pnpm dev` and Playwright from the real handler, on an
// in-memory PGlite that starts empty with each server. There is no PASSCODE locally,
// so the passcode check is skipped.
const progressApi = (): Plugin => ({
  name: "progress-api",
  apply: "serve",
  configureServer: (server) => {
    const db = server
      .ssrLoadModule("/db/pglite.ts")
      .then((m) => (m as typeof import("./db/pglite.ts")).pgliteDb());

    server.middlewares.use("/api/progress", (req, res, next) => {
      serve(server, db, req, res).catch(next);
    });
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), progressApi()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
