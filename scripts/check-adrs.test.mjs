// @vitest-environment node
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { checkAdrs } from "./check-adrs.mjs";

const repoAdrs = fileURLToPath(new URL("../docs/adr", import.meta.url));
const script = fileURLToPath(new URL("./check-adrs.mjs", import.meta.url));
const dash = "—";
const roots = [];

const adr = (number, title, status) => `---
status: ${status}
---

# ${number}. ${title}

Recorded decision.
`;

const entry = (number, title, file, status) => `- [${number}. ${title}](${file}) ${dash} ${status}`;

const index = (lines) => `# Architecture decision records

${lines.join("\n")}
`;

const writeTree = async (files) => {
  const root = await mkdtemp(join(tmpdir(), "paso-adr-"));

  roots.push(root);

  await Promise.all(
    Object.entries(files).map(async ([name, contents]) => {
      const path = join(root, name);

      if (contents === null) {
        await mkdir(path);

        return;
      }

      await writeFile(path, contents);
    }),
  );

  return root;
};

const runScript = (dir) =>
  new Promise((resolve) => {
    execFile(process.execPath, [script, dir], (error, stdout, stderr) => {
      resolve({ status: error?.code ?? 0, stdout, stderr });
    });
  });

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("ADR index", () => {
  it("matches the two confirmed records in this repo", async () => {
    const readme = await readFile(join(repoAdrs, "README.md"), "utf8");
    const offline = await readFile(join(repoAdrs, "0001-no-offline-mode.md"), "utf8");

    const passcode = await readFile(
      join(repoAdrs, "0002-passcode-gates-paid-llm-features.md"),
      "utf8",
    );

    expect(readme.match(/^- \[/gm)).toHaveLength(2);
    expect(readme).toContain(`[0001. No offline mode](0001-no-offline-mode.md) ${dash} accepted`);

    expect(readme).toContain(
      `[0002. Passcode gates paid LLM features only](0002-passcode-gates-paid-llm-features.md) ${dash} accepted`,
    );

    expect(offline).toContain("status: accepted");
    expect(offline).toContain("source of truth");
    expect(offline).toContain("A failed write shows Retry.");
    expect(offline).toContain("Revisit when real offline use appears.");
    expect(passcode).toContain("gates paid LLM features only");
    expect(passcode).toContain("does not gate entering the app or saving progress");
    expect(passcode).toContain("issues/449");
    expect(await checkAdrs(repoAdrs)).toEqual([]);
  });

  it("accepts a record superseded by the next one", async () => {
    const root = await writeTree({
      "README.md": index([
        entry("0001", "First choice", "0001-first-choice.md", "superseded by 0002"),
        entry("0002", "Second choice", "0002-second-choice.md", "accepted"),
      ]),
      "0001-first-choice.md": adr("0001", "First choice", "superseded by 0002"),
      "0002-second-choice.md": adr("0002", "Second choice", "accepted"),
    });

    expect(await checkAdrs(root)).toEqual([]);
  });

  it("rejects a missing directory and an invalid tree from the command", async () => {
    const missing = join(tmpdir(), "paso-adr-missing");

    const root = await writeTree({
      "README.md": index([]),
      "notes.md": "not a record\n",
    });

    expect(await checkAdrs(missing)).toEqual([`missing ADR directory ${missing}`]);

    const valid = await runScript(repoAdrs);
    const invalid = await runScript(root);

    expect(valid).toMatchObject({ status: 0, stdout: "ADRs match the index.\n" });
    expect(invalid.status).toBe(1);
    expect(invalid.stderr).toContain("notes.md: file name must match NNNN-slug.md");
  });

  it("rejects invalid filenames, numbers, status, headings, index lines, and targets", async () => {
    const cases = [
      {
        files: {
          "README.md": index([]),
          "notes.md": "nope\n",
          "0001-Bad.md": adr("0001", "Bad", "accepted"),
          extra: null,
        },
        errors: [
          "0001-Bad.md: file name must match NNNN-slug.md",
          "extra: file name must match NNNN-slug.md",
          "notes.md: file name must match NNNN-slug.md",
        ],
      },
      {
        files: {
          "README.md": index([
            entry("0001", "Alpha", "0001-alpha.md", "accepted"),
            entry("0001", "Beta", "0001-beta.md", "accepted"),
          ]),
          "0001-alpha.md": adr("0001", "Alpha", "accepted"),
          "0001-beta.md": adr("0001", "Beta", "accepted"),
        },
        errors: ["duplicate ADR number 0001"],
      },
      {
        files: {
          "README.md": index([
            entry("0001", "First", "0001-first.md", "accepted"),
            entry("0003", "Third", "0003-third.md", "accepted"),
          ]),
          "0001-first.md": adr("0001", "First", "accepted"),
          "0003-third.md": adr("0003", "Third", "accepted"),
        },
        errors: ["ADR numbers skip 0002"],
      },
      {
        files: {
          "README.md": index([entry("0002", "Second", "0002-second.md", "accepted")]),
          "0002-second.md": adr("0002", "Second", "accepted"),
        },
        errors: ["ADR numbers skip 0001"],
      },
      {
        files: {
          "README.md": index([entry("0001", "Title", "0001-title.md", "accepted")]),
          "0001-title.md": "# 0001. Title\n\nNo status.\n",
        },
        errors: ["0001-title.md: missing status frontmatter"],
      },
      {
        files: {
          "README.md": index([entry("0001", "Title", "0001-title.md", "accepted")]),
          "0001-title.md": "---\nstatus: proposed\n---\n\n# 0001. Title\n",
        },
        errors: [
          '0001-title.md: status must be "accepted" or "superseded by NNNN"',
          '0001-title.md: index status "accepted" does not match file status "proposed"',
        ],
      },
      {
        files: {
          "README.md": index([entry("0001", "Title", "0001-title.md", "accepted")]),
          "0001-title.md": "---\nstatus: superseded by ADR-0002\n---\n\n# 0001. Title\n",
        },
        errors: [
          '0001-title.md: status must be "accepted" or "superseded by NNNN"',
          '0001-title.md: index status "accepted" does not match file status "superseded by ADR-0002"',
        ],
      },
      {
        files: {
          "README.md": index([entry("0001", "Title", "0001-title.md", "accepted")]),
          "0001-title.md": "---\nstatus: accepted\n---\n\nNo heading.\n",
        },
        errors: ["0001-title.md: missing # NNNN. heading"],
      },
      {
        files: {
          "README.md": index([entry("0001", "Title", "0001-title.md", "accepted")]),
          "0001-title.md": "---\nstatus: accepted\n---\n\n# Title\n",
        },
        errors: ["0001-title.md: heading must be # 0001. Title"],
      },
      {
        files: {
          "README.md": index([entry("0001", "Title", "0001-title.md", "accepted")]),
          "0001-title.md": adr("0002", "Title", "accepted"),
        },
        errors: [
          "0001-title.md: heading must be # 0001. Title",
          "0001-title.md: index heading does not match the file heading",
        ],
      },
      {
        files: {
          "README.md": index([entry("0001", "Indexed", "0001-title.md", "accepted")]),
          "0001-title.md": adr("0001", "Written", "accepted"),
        },
        errors: ["0001-title.md: index heading does not match the file heading"],
      },
      {
        files: {
          "README.md": index([entry("0002", "Title", "0001-title.md", "accepted")]),
          "0001-title.md": adr("0001", "Title", "accepted"),
        },
        errors: [
          "0001-title.md: index number 0002 does not match 0001",
          "0001-title.md: index heading does not match the file heading",
        ],
      },
      {
        files: {
          "README.md": index([entry("0001", "First", "0001-first.md", "accepted")]),
          "0001-first.md": adr("0001", "First", "accepted"),
          "0002-second.md": adr("0002", "Second", "accepted"),
        },
        errors: ["0002-second.md: missing from the index"],
      },
      {
        files: {
          "README.md": index([
            entry("0001", "First", "0001-first.md", "accepted"),
            entry("0001", "First", "0001-first.md", "accepted"),
          ]),
          "0001-first.md": adr("0001", "First", "accepted"),
        },
        errors: ["index lists 0001-first.md more than once"],
      },
      {
        files: {
          "README.md": index([
            entry("0001", "First", "0001-first.md", "accepted"),
            entry("0002", "Second", "0002-second.md", "accepted"),
          ]),
          "0001-first.md": adr("0001", "First", "accepted"),
        },
        errors: ["index links 0002-second.md, which is not an ADR file"],
      },
      {
        files: {
          "README.md": `# Architecture decision records

- [0001. Title](0001-title.md) - accepted
`,
          "0001-title.md": adr("0001", "Title", "accepted"),
        },
        errors: [
          "index line does not match the ADR format: - [0001. Title](0001-title.md) - accepted",
          "0001-title.md: missing from the index",
        ],
      },
      {
        files: {
          "README.md": index([entry("0001", "First", "0001-first.md", "accepted")]),
          "0001-first.md": adr("0001", "First", "superseded by 0002"),
          "0002-second.md": adr("0002", "Second", "accepted"),
        },
        errors: [
          "0002-second.md: missing from the index",
          '0001-first.md: index status "accepted" does not match file status "superseded by 0002"',
        ],
      },
      {
        files: {
          "README.md": index([entry("0001", "First", "0001-first.md", "superseded by 0003")]),
          "0001-first.md": adr("0001", "First", "superseded by 0003"),
        },
        errors: ["0001-first.md: superseded by 0003, which does not exist"],
      },
      {
        files: {
          "README.md": index([entry("0001", "First", "0001-first.md", "superseded by 0001")]),
          "0001-first.md": adr("0001", "First", "superseded by 0001"),
        },
        errors: ["0001-first.md: superseded by 0001, which is the same record"],
      },
      {
        files: {
          "0001-only.md": adr("0001", "Only", "accepted"),
        },
        errors: ["missing README.md index", "0001-only.md: missing from the index"],
      },
    ];

    const results = await Promise.all(
      cases.map(async ({ files, errors }) => ({
        errors,
        actual: await checkAdrs(await writeTree(files)),
      })),
    );

    for (const result of results) {
      expect(result.actual).toEqual(result.errors);
    }
  });
});
