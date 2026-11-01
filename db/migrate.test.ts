// @vitest-environment node
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { describe, expect, it } from "vitest";
import { firstVariants } from "../src/data/mock.ts";
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

    expect(await migrate(pgliteSession(pg))).toEqual([
      "001_init.sql",
      "002_mock_runs.sql",
      "003_mock_run_variants.sql",
    ]);

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

describe("003_mock_run_variants", () => {
  const repo = new URL("./migrations/", import.meta.url);
  const file = (name: string) => readFileSync(new URL(name, repo), "utf8");
  const learner = (n: number) => `00000000-0000-4000-8000-00000000000${n}`;

  it("gives every run saved before variants variant 1 of each task, and keeps newer runs", async () => {
    const pg = new PGlite();

    await migrate(
      pgliteSession(pg),
      migrationsIn({
        "001_init.sql": file("001_init.sql"),
        "002_mock_runs.sql": file("002_mock_runs.sql"),
      }),
    );

    const old = { section: 1, index: 2, stage: "run", answers: { "mock-r1-0": "a" } };
    const newer = { ...old, seed: 7, variants: { r1: "r1-v2" } };

    await pg.query("INSERT INTO learners (id) VALUES ($1), ($2)", [learner(1), learner(2)]);

    await pg.query("INSERT INTO mock_runs (learner_id, run) VALUES ($1, $2), ($3, $4)", [
      learner(1),
      old,
      learner(2),
      newer,
    ]);

    expect(await migrate(pgliteSession(pg))).toEqual(["003_mock_run_variants.sql"]);

    const runs = await pg.query<{ run: unknown }>("SELECT run FROM mock_runs ORDER BY learner_id");

    expect(runs.rows.map((r) => r.run)).toEqual([
      { ...old, seed: 0, variants: firstVariants },
      newer,
    ]);
  });
});
