// @vitest-environment node
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { describe, expect, it } from "vitest";
import { migrate } from "./migrate.ts";
import { pgliteSession } from "./pglite.ts";

const tables = async (pg: PGlite) =>
  (
    await pg.query<{ name: string }>(
      "SELECT table_name AS name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY 1",
    )
  ).rows.map((r) => r.name);

const migrationsIn = (files: Record<string, string>) => {
  const dir = mkdtempSync(join(tmpdir(), "paso-migrations-"));

  for (const [name, sql] of Object.entries(files)) {
    writeFileSync(join(dir, name), sql);
  }

  return pathToFileURL(`${dir}/`);
};

describe("migrations", () => {
  it("applies each file once, in order, and records it", async () => {
    const pg = new PGlite();

    const dir = migrationsIn({
      "002_b.sql": "ALTER TABLE a ADD COLUMN b int;",
      "001_a.sql": "CREATE TABLE a (id int);",
      "notes.txt": "not a migration",
    });

    expect(await migrate(pgliteSession(pg), dir)).toEqual(["001_a.sql", "002_b.sql"]);
    expect(await migrate(pgliteSession(pg), dir)).toEqual([]);

    expect((await pg.query("SELECT name FROM schema_migrations ORDER BY name")).rows).toEqual([
      { name: "001_a.sql" },
      { name: "002_b.sql" },
    ]);

    expect(await tables(pg)).toEqual(["a", "schema_migrations"]);
  });

  it("applies nothing from a run where one file fails", async () => {
    const pg = new PGlite();

    const dir = migrationsIn({
      "001_a.sql": "CREATE TABLE a (id int);",
      "002_b.sql": "ALTER TABLE missing ADD COLUMN b int;",
    });

    await expect(migrate(pgliteSession(pg), dir)).rejects.toThrow(
      'relation "missing" does not exist',
    );

    expect(await tables(pg)).toEqual([]);

    expect(
      await migrate(pgliteSession(pg), migrationsIn({ "001_a.sql": "CREATE TABLE a (id int);" })),
    ).toEqual(["001_a.sql"]);
  });

  it.each([
    ["edited", { "001_a.sql": "CREATE TABLE a (id bigint);" }],
    ["removed", { "002_b.sql": "CREATE TABLE b (id int);" }],
  ])("refuses to run when an applied migration was %s", async (change, files) => {
    const pg = new PGlite();

    await migrate(pgliteSession(pg), migrationsIn({ "001_a.sql": "CREATE TABLE a (id int);" }));

    await expect(migrate(pgliteSession(pg), migrationsIn(files))).rejects.toThrow(
      `Applied migration 001_a.sql was ${change}`,
    );

    expect(await tables(pg)).toEqual(["a", "schema_migrations"]);
  });

  it("creates every progress table from the repo's migrations", async () => {
    const pg = new PGlite();

    expect(await migrate(pgliteSession(pg))).toEqual(["001_init.sql", "002_mock_runs.sql"]);

    expect(await tables(pg)).toEqual([
      "attempts",
      "drafts",
      "guide_checks",
      "learners",
      "lesson_completions",
      "mock_results",
      "mock_runs",
      "question_states",
      "schema_migrations",
      "vocabulary_reviews",
    ]);
  });
});
