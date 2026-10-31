import { PGlite } from "@electric-sql/pglite";
import type { Db } from "../api/_lib/db.ts";
import { migrate, type Session } from "./migrate.ts";

export const pgliteSession = (pg: PGlite): Session => ({
  exec: (script) => pg.exec(script),
  rows: async <Row>(text: string) => (await pg.query<Row>(text)).rows,
});

// An in-memory Postgres with the repo's migrations, for tests and the dev server.
export const pgliteDb = async (migrations?: URL): Promise<Db> => {
  const pg = new PGlite();

  // PGlite takes the host's zone; Neon runs in UTC.
  await pg.exec("SET TIME ZONE 'UTC'");
  await migrate(pgliteSession(pg), migrations);

  return {
    transaction: (queries) =>
      pg.transaction(async (tx) => {
        const results: unknown[][] = [];

        for (const q of queries) {
          results.push((await tx.query(q.text, q.params)).rows);
        }

        return results;
      }),
  };
};
