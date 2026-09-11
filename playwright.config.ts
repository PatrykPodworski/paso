import { defineConfig } from "@playwright/test";
import { createArgosReporterOptions } from "@argos-ci/playwright/reporter";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 4,
  timeout: 30000,
  expect: {
    timeout: 5000,
    toHaveScreenshot: { animations: "disabled", caret: "hide", maxDiffPixels: 0 },
  },
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    [
      "@argos-ci/playwright/reporter",
      createArgosReporterOptions({ uploadToArgos: process.env.ARGOS_UPLOAD === "1" }),
    ],
  ],
  use: {
    baseURL: "http://127.0.0.1:4174",
    locale: "en-GB",
    timezoneId: "Europe/Warsaw",
    colorScheme: "light",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    permissions: ["microphone"],
    launchOptions: {
      args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
    },
  },
  projects: [
    {
      name: "desktop",
      use: {
        browserName: "chromium",
        viewport: { width: 1440, height: 1080 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: "mobile",
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: "pnpm dev --port 4174 --strictPort",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: false,
    timeout: 30000,
  },
  snapshotPathTemplate: "{testDir}/visual/baselines/{projectName}/{arg}{ext}",
});
