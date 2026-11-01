import { mockTasks } from "./mock";
import type { ExamVariants, MockTask, MockVariant } from "./types";

// When the learner last saw each variant, in epoch milliseconds. A variant not in it is unseen.
export type SeenVariants = ReadonlyMap<string, number>;

export type ExamRequest = {
  seed: number;
  seen?: SeenVariants;
  // Variants fixed in advance by task id, such as the one a learner picked to practise.
  chosen?: ExamVariants;
  // The tasks to pick for: the whole exam, or the tasks of one section.
  tasks?: MockTask[];
};

// How many variants the search tries before it settles for the fewest repeats. A real exam
// finds an exam without repeats within a few dozen tries.
const SEARCH_LIMIT = 10_000;

// Mulberry32: the same seed gives the same sequence on every device.
const randomFrom = (seed: number) => {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;

    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32;
  };
};

const shuffle = <T>(items: T[], random: () => number) => {
  const result = [...items];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

// A theme or a name may appear only once in an exam.
const tagsOf = (variant: MockVariant) => [
  ...new Set([variant.theme, ...variant.names].map((tag) => tag.toLowerCase())),
];

type Pool = { task: MockTask; variants: MockVariant[] };

// Depth-first search for one variant per pool with no theme or name repeated. Each pool lists
// its variants in the order the exam prefers them, so the first exam found is the preferred one.
const withoutRepeats = (pools: Pool[]) => {
  const picked: MockVariant[] = [];
  const used = new Set<string>();
  let tries = SEARCH_LIMIT;

  const visit = (depth: number): boolean => {
    if (depth === pools.length) {
      return true;
    }

    for (const variant of pools[depth].variants) {
      tries--;

      if (tries < 0) {
        return false;
      }

      const tags = tagsOf(variant);

      if (tags.some((tag) => used.has(tag))) {
        continue;
      }

      tags.forEach((tag) => used.add(tag));
      picked.push(variant);

      if (visit(depth + 1)) {
        return true;
      }

      tags.forEach((tag) => used.delete(tag));
      picked.pop();
    }

    return false;
  };

  return visit(0) ? picked : null;
};

// When every exam repeats something, each pool in turn takes the variant that repeats the
// fewest themes and names picked so far.
const fewestRepeats = (pools: Pool[]) => {
  const used = new Set<string>();

  return pools.map(({ variants }) => {
    const repeats = variants.map((v) => tagsOf(v).filter((tag) => used.has(tag)).length);
    const best = variants[repeats.indexOf(Math.min(...repeats))];

    tagsOf(best).forEach((tag) => used.add(tag));

    return best;
  });
};

// Picks one variant per task. The same request always gives the same exam. Unseen variants
// come first, then the least recently seen; among equals the seed decides.
export const buildExam = ({
  seed,
  seen = new Map(),
  chosen = {},
  tasks = mockTasks,
}: ExamRequest): ExamVariants => {
  const random = randomFrom(seed);
  const lastSeen = (variant: MockVariant) => seen.get(variant.id) ?? -1;

  const pools = tasks.map((task) => {
    const fixed = chosen[task.id];
    const variants = task.variants.filter((v) => fixed === undefined || v.id === fixed);

    if (variants.length === 0) {
      throw new Error(`Task ${task.id} has no variant ${fixed}`);
    }

    return { task, variants: shuffle(variants, random).sort((a, b) => lastSeen(a) - lastSeen(b)) };
  });

  // The tasks with the fewest variants go first, so the search meets a dead end early.
  const ordered = pools.toSorted((a, b) => a.variants.length - b.variants.length);
  const picked = withoutRepeats(ordered) ?? fewestRepeats(ordered);
  const byTask = new Map(ordered.map((pool, i) => [pool.task.id, picked[i].id]));

  return Object.fromEntries(tasks.map((task) => [task.id, byTask.get(task.id)!]));
};
