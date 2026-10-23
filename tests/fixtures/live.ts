import type { Page } from "@playwright/test";
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

export const sentEvents = (page: Page) =>
  page.evaluate(() => (window as any).__live.sent.map((s: string) => JSON.parse(s).type));
