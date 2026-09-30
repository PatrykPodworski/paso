import { readFileSync } from "node:fs";

const report = JSON.parse(readFileSync("reports/mutation/business.json", "utf8"));

const unexecuted = Object.entries(report.files).flatMap(([file, value]) =>
  value.mutants
    .filter((m) => m.status === "Survived" && m.testsCompleted === 0)
    .map((m) => `${file}:${m.location.start.line}`),
);

if (unexecuted.length) {
  throw new Error(
    `Surviving mutations ran zero selected tests; check runner selection and test IDs: ${unexecuted.join(", ")}`,
  );
}
