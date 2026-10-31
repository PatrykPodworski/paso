import { neon } from "@neondatabase/serverless";

export type Query = { text: string; params: unknown[] };

// Neon's HTTP driver in production and PGlite in tests and the dev server both run
// the progress store's SQL through this.
export type Db = {
  // Runs the queries in one transaction and returns each query's rows.
  transaction: (queries: Query[]) => Promise<unknown[][]>;
};

export const neonDb = (url: string): Db => {
  const sql = neon(url);

  return {
    transaction: (queries) => sql.transaction(queries.map((q) => sql.query(q.text, q.params))),
  };
};
