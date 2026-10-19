import { expect, type Page } from "@playwright/test";
import type { LiveScore } from "../../src/data/types";

// Stands in for OpenAI: a fake WebRTC peer whose data channel the test drives, and
// fixed answers from the two API routes.
export const mockLiveTalk = async (page: Page, score: LiveScore) => {
  await page.addInitScript(() => {
    const live = { sent: [] as string[], channel: null as null | Record<string, unknown> };

    (window as any).__live = live;

    (window as any).RTCPeerConnection = class {
      iceGatheringState = "complete";
      localDescription: unknown = null;
      ontrack = null;

      addTrack() {}

      createDataChannel() {
        live.channel = {
          readyState: "open",
          send: (data: string) => live.sent.push(data),
          onmessage: null,
          onclose: null,
        };

        return live.channel;
      }

      async createOffer() {
        return { type: "offer", sdp: "offer-sdp" };
      }

      async setLocalDescription(description: unknown) {
        this.localDescription = description;
      }

      async setRemoteDescription() {}

      close() {}
    };
  });

  await page.route("**/api/live-session", (route) =>
    route.fulfill({
      status: 201,
      json: { sdp: "answer-sdp", greeting: "Saluda.", limitSeconds: 120 },
    }),
  );

  await page.route("**/api/score-talk", (route) => route.fulfill({ json: score }));
};

export const examiner = (page: Page, event: object) =>
  page.evaluate(
    (data) => (window as any).__live.channel.onmessage({ data: JSON.stringify(data) }),
    event,
  );

// Runs one whole talk against the fake examiner: start (with the passcode once the free
// talk is used), one exchange, end, and Lucía's close.
export const talkToLucia = async (page: Page) => {
  const passcode = page.getByLabel("Passcode");

  if (await passcode.isVisible()) {
    await passcode.fill("olé-2026");
  }

  await page.getByRole("button", { name: "Start the talk" }).click();
  await expect(page.getByRole("status")).toHaveText("Connecting to Lucía…");
  await examiner(page, { type: "session.started", session: { id: "live_1" } });
  await examiner(page, { type: "session.output_transcript.delta", delta: "Hola.", start_ms: 1000 });

  await examiner(page, {
    type: "session.input_transcript.delta",
    delta: "Hola, soy Ana.",
    start_ms: 2000,
  });

  await expect(page.getByRole("status")).toHaveText("Live");
  await page.getByRole("button", { name: "End the talk" }).click();
  await examiner(page, { type: "session.closed", reason: "close_requested" });
};

// Answers a live question of the exam: picks the home topic when asked, talks, continues.
export const answerTalk = async (page: Page) => {
  const home = page.getByRole("radio", { name: /Your home/ });

  if (await home.isVisible()) {
    await home.check();
  }

  await talkToLucia(page);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
};

export const sentEvents = (page: Page) =>
  page.evaluate(() => (window as any).__live.sent.map((s: string) => JSON.parse(s).type));
