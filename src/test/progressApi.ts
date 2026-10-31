import { act } from "@testing-library/react";
import { pathToFileURL } from "node:url";
import { beforeAll, beforeEach, expect, vi } from "vitest";
import type { Db } from "../../api/_lib/db";
import { handleProgress } from "../../api/progress";
import { pgliteDb } from "../../db/pglite";
import type { ProgressSnapshot } from "../data/types";
import { type ProgressSeed, seedWrites } from "../../tests/fixtures/progressSeed";

let db: Db;
let started = 0;
const running = new Set<Promise<Response>>();

const serve = (request: Request) => handleProgress(request, db, async () => null);

// Serves /api/progress from the real handler on an in-memory Postgres, as `pnpm dev` does.
// Each test has a new learner id, so it starts with empty progress.
export const setupProgressApi = () => {
  beforeAll(async () => {
    // Vite rewrites the runner's default `new URL(…, import.meta.url)` into a dev-server URL
    // in jsdom tests, and node:fs reads only file URLs.
    db = await pgliteDb(pathToFileURL(`${process.cwd()}/db/migrations/`));
  });

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string, init: RequestInit) => {
        const request = new Request(new URL(url, "http://localhost"), init);

        if (new URL(request.url).pathname !== "/api/progress") {
          throw new Error(`Unexpected request to ${url}`);
        }

        const response = serve(request);

        started++;
        running.add(response);
        void response.finally(() => running.delete(response));

        return response;
      }),
    );
  });
};

// Captured before a test fakes timers, so waiting never moves a fake clock.
const pause = globalThis.setTimeout;

// Waits until the app has no request in flight and starts no new one.
export const settle = () =>
  act(async () => {
    for (let seen = -1, waited = 0; running.size || seen !== started; waited += 5) {
      expect(waited, "Progress requests still running").toBeLessThan(5000);
      seen = started;
      await new Promise((resolve) => pause(resolve, 5));
    }
  });

export const savedProgress = async (): Promise<ProgressSnapshot> => {
  const response = await serve(
    new Request("http://localhost/api/progress", {
      headers: { "x-learner-id": localStorage.getItem("paso-learner-v1")! },
    }),
  );

  return response.json();
};

// Stores a seed for a new learner, whose id the app then reads from this browser.
export const seedProgress = async (seed: Partial<ProgressSeed>) => {
  const learner = crypto.randomUUID();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  localStorage.setItem("paso-learner-v1", learner);

  for (const body of seedWrites(seed, timeZone)) {
    const response = await serve(
      new Request("http://localhost/api/progress", {
        method: "POST",
        headers: { "x-learner-id": learner, "content-type": "application/json" },
        body: JSON.stringify(body),
      }),
    );

    expect(response.status, `seed ${body.action}: ${await response.text()}`).toBe(200);
  }

  // No write sets a review window, so the seed sets it on the question's stored state.
  await db.transaction(
    Object.entries(seed.mistakeReviews ?? {}).map(([questionId, r]) => ({
      text: `UPDATE question_states SET review_level = $3, review_next_at = $4
             WHERE learner_id = $1 AND question_id = $2`,
      params: [learner, questionId, r.level, r.nextAt],
    })),
  );
};
