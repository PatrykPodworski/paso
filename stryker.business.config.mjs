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
  // break: stopgap, not a measurement. Four runs on identical source scored 79.42–80.20 because
  // timeoutMS 2000 × concurrency 8 lets Timeout↔Survived drift with machine load and Stryker
  // counts Timeout as detected. 79 is below the observed floor. #15 fixes the determinism and
  // re-derives this number.
  thresholds: { high: 95, low: 85, break: 79 },
};
