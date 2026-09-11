import { readFileSync } from "node:fs";
import configuration from "./stryker.config.json" with { type: "json" };
import { mutationGlobs } from "./scripts/mutation-scope.mjs";
import { productionFiles } from "./scripts/test-surface.mjs";
const files = productionFiles();
const views = files.filter((file) => file.endsWith(".tsx"));
export default {
  ...configuration,
  mutate: [
    ...files.filter((file) => !file.endsWith(".tsx")),
    ...views.flatMap((file) => mutationGlobs(file, readFileSync(file, "utf8"))),
  ],
  incrementalFile: "reports/stryker-business-incremental.json",
  jsonReporter: { fileName: "reports/mutation/business.json" },
  htmlReporter: { fileName: "reports/mutation/business.html" },
  // timeoutMS 30000, not the default 2000: at 2000 the runner cut off slow-but-finite mutants
  // at random, and Stryker counts a timeout as detected, so the score rose with machine load.
  // Only 5 mutants genuinely fail to terminate, so the higher limit costs about 12s a run.
  // break: derived from a deterministic measurement. Three runs on identical source at
  // timeoutMS 30000 each scored 79.79, with zero spread on every per-file score. 79 leaves
  // roughly 22 mutants of margin below that.
  thresholds: { high: 95, low: 85, break: 79 },
};
