import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";

// A connection that keeps one session, so a transaction can span several calls.
export type Session = {
  exec: (script: string) => Promise<unknown>;
  rows: <Row>(text: string) => Promise<Row[]>;
};

const MIGRATION = /^\d{3}_[a-z0-9_]+\.sql$/;

// Any constant shared by every runner; two builds migrating one database wait for each other.
const LOCK = 284_425;

const checksumOf = (sql: string) => createHash("sha256").update(sql).digest("hex");

// Applies the pending migrations in one transaction and returns their names. An applied
// migration is never edited, renamed or removed: a schema change is a new numbered file.
export const migrate = async (
  session: Session,
  dir = new URL("./migrations/", import.meta.url),
) => {
  const files = readdirSync(dir)
    .filter((name) => MIGRATION.test(name))
    .sort();

  const sql = new Map(files.map((name) => [name, readFileSync(new URL(name, dir), "utf8")]));

  await session.exec(`
    BEGIN;
    SELECT pg_advisory_xact_lock(${LOCK});
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name text PRIMARY KEY,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  try {
    const applied = await session.rows<{ name: string; checksum: string }>(
      "SELECT name, checksum FROM schema_migrations",
    );

    for (const { name, checksum } of applied) {
      const file = sql.get(name);

      if (file === undefined || checksumOf(file) !== checksum) {
        throw new Error(
          `Applied migration ${name} was ${file === undefined ? "removed" : "edited"}`,
        );
      }
    }

    const pending = files.filter((name) => !applied.some((r) => r.name === name));

    for (const name of pending) {
      const file = sql.get(name) as string;

      await session.exec(file);

      await session.exec(
        `INSERT INTO schema_migrations (name, checksum) VALUES ('${name}', '${checksumOf(file)}')`,
      );
    }

    await session.exec("COMMIT");

    return pending;
  } catch (error) {
    await session.exec("ROLLBACK");

    throw error;
  }
};
