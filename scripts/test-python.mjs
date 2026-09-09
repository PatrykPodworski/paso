import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
const python =
  process.env.PASO_TEST_PYTHON ||
  (existsSync(".venv-tests/bin/python") ? ".venv-tests/bin/python" : ".venv-coach/bin/python");
const args = process.argv.includes("--mutate")
  ? ["scripts/mutate-transcribe.py"]
  : ["-m", "unittest", "discover", "-s", "tests/python", "-v"];
const result = spawnSync(python, args, { stdio: "inherit" });
if (result.error) {
  console.error(
    "Python test environment missing. See docs/REFACTOR_TESTING.md for the NumPy-only setup.",
  );
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}
