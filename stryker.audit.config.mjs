import configuration from "./stryker.config.json" with { type: "json" };
import { productionFiles } from "./scripts/test-surface.mjs";
export default { ...configuration, mutate: productionFiles() };
