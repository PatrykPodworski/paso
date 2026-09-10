import { readFileSync } from "node:fs";

const report = JSON.parse(readFileSync("reports/mutation/business.json", "utf8"));
const floors = {
  "src/components/Guide.tsx": 90,
  "src/components/LessonSession.tsx": 90,
  "src/data/progress.ts": 98,
  "scripts/audio-budget.mjs": 95,
  "scripts/elevenlabs.mjs": 88,
  "scripts/generate-elevenlabs.mjs": 80,
  // 79.31 and 82.76 on two runs of identical source: six to eight of this file's 58 mutants
  // time out, and Stryker counts a timeout as detected. 68 is the score if every timeout
  // instead survives. #15 makes the timeouts deterministic; raise this once it lands.
  "scripts/audio-direction.mjs": 68,
};
const score = (mutants) => {
  const detected = mutants.filter((m) => ["Killed", "Timeout"].includes(m.status)).length;
  const missed = mutants.filter((m) => ["Survived", "NoCoverage"].includes(m.status)).length;
  return (100 * detected) / (detected + missed);
};
for (const [file, minimum] of Object.entries(floors)) {
  const measured = score(report.files[file]?.mutants || []);
  if (!(measured >= minimum)) {
    throw new Error(
      `${file}: mutation score ${measured.toFixed(2)}% is below ${minimum}%. Inspect the surviving rules.`,
    );
  }
  console.log(`${file}: ${measured.toFixed(2)}% (required ${minimum}%)`);
}
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
