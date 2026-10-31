// Migrates the Neon database before each Vercel build (the vercel-build script).
// The Neon integration gives every Preview its own branch and URL.
import { Client } from "@neondatabase/serverless";
import { migrate } from "../db/migrate.ts";

// The pooler runs in transaction mode; the direct connection is the safer choice for DDL.
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!url) {
  console.error("Set DATABASE_URL (the Neon integration does this on Vercel) to run migrations.");
  process.exit(1);
}

const client = new Client(url);

await client.connect();

try {
  const applied = await migrate({
    exec: (script) => client.query(script),
    rows: async (text) => (await client.query(text)).rows,
  });

  console.log(applied.length ? `Applied ${applied.join(", ")}` : "No pending migrations");
} finally {
  await client.end();
}
