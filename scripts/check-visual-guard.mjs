import { writeFile, unlink, mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
// Expected-failure experiment in a disposable browser test. Production source
// and approved baselines are never changed.
const path = `tests/visual-negative-control-${process.pid}.spec.ts`;
await writeFile(
  path,
  `import {test,expect} from './fixtures/app';
test('visual control rejects a changed design',async({page})=>{
 await page.goto('/');
 await page.addStyleTag({content:'.hero-card { background: #ff00ff !important; }'});
 await expect(page).toHaveScreenshot('today.png',{fullPage:true,timeout:2000});
});\n`,
  { flag: "wx" },
);
try {
  const result = spawnSync(
    "pnpm",
    [
      "exec",
      "playwright",
      "test",
      path,
      "--project=desktop",
      "--reporter=line",
      "--output=reports/visual-negative-control",
    ],
    { encoding: "utf8" },
  );
  const output = (result.stdout || "") + (result.stderr || "");
  await mkdir("reports", { recursive: true });
  await writeFile("reports/visual-negative-control.log", output);
  if (result.status !== 1 || !output.includes("pixels") || !output.includes("different")) {
    throw new Error(
      "Visual negative control did not fail specifically on a pixel mismatch. Inspect reports/visual-negative-control.log.",
    );
  }
  console.log(
    "Verified: an intentional hero color regression fails the saved visual baseline. No baseline was updated.",
  );
} finally {
  await unlink(path);
}
