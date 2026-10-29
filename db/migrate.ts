import { readdirSync, readFileSync } from "node:fs";

// A connection that keeps one session, so a transaction can span several calls.
export type Session = {
  exec: (script: string) => Promise<unknown>;
  rows: <Row>(text: string) => Promise<Row[]>;
};

const MIGRATION = /^\d{3}_[a-z0-9_]+\.sql$/;

// Any constant shared by every runner; two builds migrating one database wait for each other.
const LOCK = 284_425;

// Applies the pending migrations in one transaction and returns their names.
export const migrate = async (
  session: Session,
  dir = new URL("./migrations/", import.meta.url),
) => {
  const files = readdirSync(dir)
    .filter((name) => MIGRATION.test(name))
    .sort();

  await session.exec(`
    BEGIN;
    SELECT pg_advisory_xact_lock(${LOCK});
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  try {
    const applied = new Set(
      (await session.rows<{ name: string }>("SELECT name FROM schema_migrations")).map(
        (r) => r.name,
      ),
    );

    const pending = files.filter((name) => !applied.has(name));

    for (const name of pending) {
      await session.exec(readFileSync(new URL(name, dir), "utf8"));
      await session.exec(`INSERT INTO schema_migrations (name) VALUES ('${name}')`);
    }

    await session.exec("COMMIT");

    return pending;
  } catch (error) {
    await session.exec("ROLLBACK");

    throw error;
  }
};
