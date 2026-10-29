import { act } from "@testing-library/react";
import { pathToFileURL } from "node:url";
import { beforeAll, beforeEach, expect, vi } from "vitest";
import type { Db } from "../../api/_lib/db";
import { handleProgress } from "../../api/progress";
import { pgliteDb } from "../../db/pglite";
import type { ProgressSnapshot } from "../data/types";

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
