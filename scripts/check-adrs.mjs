import { realpathSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// docs/adr/README.md is the index. Each record is NNNN-slug.md, with status
// frontmatter and a # NNNN. Title heading that matches its index line.
const fileName = /^(\d{4})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const headingLine = /^# (\d{4})\. (.+)$/;
const superseded = /^superseded by (\d{4})$/;

const indexLine =
  /^- \[(\d{4})\. (.+)\]\((\d{4}-[a-z0-9]+(?:-[a-z0-9]+)*\.md)\) — (accepted|superseded by \d{4})$/;

const isStatus = (status) => status === "accepted" || superseded.test(status);

const frontmatter = (text) => {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(text);

  if (!match) {
    return { status: undefined, body: text };
  }

  const line = match[1].split(/\r?\n/).find((item) => item.startsWith("status:"));

  return {
    status: line === undefined ? undefined : line.slice("status:".length).trim(),
    body: match[2],
  };
};

const headingOf = (body) => {
  const line = body.split(/\r?\n/).find((item) => item.startsWith("# "));

  if (line === undefined) {
    return undefined;
  }

  const match = headingLine.exec(line);

  if (!match) {
    return null;
  }

  return { number: match[1], title: match[2].trim() };
};

const numberingErrors = (numbers) => {
  const errors = [];
  const counts = new Map();

  for (const number of numbers) {
    counts.set(number, (counts.get(number) ?? 0) + 1);
  }

  for (const [number, count] of counts) {
    if (count > 1) {
      errors.push(`duplicate ADR number ${number}`);
    }
  }

  const unique = [...counts.keys()].sort();

  for (let position = 0; position < unique.length; position += 1) {
    const expected = String(position + 1).padStart(4, "0");

    if (unique[position] !== expected) {
      errors.push(`ADR numbers skip ${expected}`);
      break;
    }
  }

  return errors;
};

const statusErrors = (name, number, status, numbers) => {
  if (status === undefined) {
    return [`${name}: missing status frontmatter`];
  }

  if (!isStatus(status)) {
    return [`${name}: status must be "accepted" or "superseded by NNNN"`];
  }

  const target = superseded.exec(status);

  if (!target) {
    return [];
  }

  if (target[1] === number) {
    return [`${name}: superseded by ${target[1]}, which is the same record`];
  }

  if (!numbers.has(target[1])) {
    return [`${name}: superseded by ${target[1]}, which does not exist`];
  }

  return [];
};

const headingErrors = (name, number, heading) => {
  if (heading === undefined) {
    return [`${name}: missing # NNNN. heading`];
  }

  if (!heading || heading.number !== number) {
    return [`${name}: heading must be # ${number}. Title`];
  }

  return [];
};

const readIndex = (readme) => {
  const indexed = [];
  const errors = [];

  for (const line of readme.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed.startsWith("- [")) {
      continue;
    }

    const match = indexLine.exec(trimmed);

    if (!match) {
      errors.push(`index line does not match the ADR format: ${trimmed}`);
      continue;
    }

    indexed.push({
      number: match[1],
      title: match[2].trim(),
      file: match[3],
      status: match[4],
    });
  }

  return { indexed, errors };
};

const entryErrors = (item, record) => {
  if (!record) {
    return [`index links ${item.file}, which is not an ADR file`];
  }

  const errors = [];

  if (item.number !== record.number) {
    errors.push(`${item.file}: index number ${item.number} does not match ${record.number}`);
  }

  const heading = record.heading;
  const label = `${item.number}. ${item.title}`;

  if (heading && label !== `${heading.number}. ${heading.title}`) {
    errors.push(`${item.file}: index heading does not match the file heading`);
  }

  if (record.status !== undefined && item.status !== record.status) {
    errors.push(
      `${item.file}: index status "${item.status}" does not match file status "${record.status}"`,
    );
  }

  return errors;
};

const indexErrors = (readme, records) => {
  const { indexed, errors } = readIndex(readme);
  const indexedNames = new Set(indexed.map((item) => item.file));

  for (const name of records.keys()) {
    if (!indexedNames.has(name)) {
      errors.push(`${name}: missing from the index`);
    }
  }

  const seen = new Set();

  for (const item of indexed) {
    if (seen.has(item.file)) {
      errors.push(`index lists ${item.file} more than once`);
      continue;
    }

    seen.add(item.file);
    errors.push(...entryErrors(item, records.get(item.file)));
  }

  return errors;
};

export const checkAdrs = async (dir) => {
  let entries;

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [`missing ADR directory ${dir}`];
  }

  const errors = [];
  const adrFiles = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === "README.md" && entry.isFile()) {
      continue;
    }

    const match = entry.isFile() ? fileName.exec(entry.name) : null;

    if (!match) {
      errors.push(`${entry.name}: file name must match NNNN-slug.md`);
      continue;
    }

    adrFiles.push({ name: entry.name, number: match[1] });
  }

  const numbers = new Set(adrFiles.map((file) => file.number));

  errors.push(...numberingErrors(adrFiles.map((file) => file.number)));

  const records = new Map();

  for (const file of adrFiles) {
    const text = await readFile(join(dir, file.name), "utf8");
    const parsed = frontmatter(text);
    const heading = headingOf(parsed.body);

    errors.push(
      ...statusErrors(file.name, file.number, parsed.status, numbers),
      ...headingErrors(file.name, file.number, heading),
    );

    records.set(file.name, { number: file.number, status: parsed.status, heading });
  }

  const readme = entries.find((entry) => entry.name === "README.md" && entry.isFile());

  if (!readme) {
    errors.push("missing README.md index");

    for (const name of records.keys()) {
      errors.push(`${name}: missing from the index`);
    }

    return errors;
  }

  errors.push(...indexErrors(await readFile(join(dir, "README.md"), "utf8"), records));

  return errors;
};

const calledDirectly = () => {
  const entry = process.argv[1];

  if (!entry) {
    return false;
  }

  try {
    return import.meta.url === pathToFileURL(realpathSync(entry)).href;
  } catch {
    return false;
  }
};

if (calledDirectly()) {
  const errors = await checkAdrs(process.argv[2] ?? "docs/adr");

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error);
    }

    process.exit(1);
  }

  console.log("ADRs match the index.");
}
