import { execFileSync } from "node:child_process";
import { setTimeout } from "node:timers/promises";

// Stryker selects tests by their collected name. Clock/random values in it.each
// titles can silently prevent a selected test from running in the next worker.
const collect = () => {
  const output = execFileSync("pnpm", ["exec", "vitest", "list", "--json"], {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
  return JSON.parse(output)
    .map(({ file, name }) => `${file}: ${name}`)
    .sort();
};
const first = collect();
await setTimeout(1100);
const second = collect();
if (
  !first.length ||
  new Set(first).size !== first.length ||
  JSON.stringify(first) !== JSON.stringify(second)
) {
  console.error({
    duplicates: first.filter((id, i) => i > 0 && id === first[i - 1]),
    changed: [
      ...first.filter((id) => !second.includes(id)),
      ...second.filter((id) => !first.includes(id)),
    ],
  });
  throw new Error(
    "Test IDs must be unique and stable between workers. Remove time/random values from test titles.",
  );
}
console.log(`Verified ${first.length} stable, unique test IDs for mutation selection.`);
