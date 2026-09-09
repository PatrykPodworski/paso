import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Recorder } from "../components/Recorder";
let instances: FakeRecorder[];
let stopTrack: ReturnType<typeof vi.fn>;
let getUserMedia: ReturnType<typeof vi.fn>;
let mime: string;
class FakeRecorder {
  state = "inactive";
  mimeType = mime;
  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  onerror: (() => void) | null = null;
  start = vi.fn(() => {
    this.state = "recording";
  });
  stop = vi.fn(() => {
    this.state = "inactive";
    this.onstop?.();
  });
  constructor() {
    instances.push(this);
  }
}
beforeEach(() => {
  instances = [];
  mime = "audio/webm";
  stopTrack = vi.fn();
  getUserMedia = vi.fn(async () => ({ getTracks: () => [{ stop: stopTrack }] }));
  vi.stubGlobal("MediaRecorder", FakeRecorder);
  Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: { getUserMedia } });
  vi.stubGlobal(
    "URL",
    Object.assign(class extends URL {}, {
      createObjectURL: vi.fn(() => `blob:recording-${instances.length}`),
      revokeObjectURL: vi.fn(),
    }),
  );
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
const start = async () => {
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: /Record (your answer|again)/ })),
  );
};
describe("recording lifecycle", () => {
  it.each(["audio/webm", "audio/mp4", ""])(
    "records, stops, downloads and cleans up %s audio",
    async (type) => {
      mime = type;
      const saved = vi.fn(),
        changed = vi.fn(),
        began = vi.fn();
      const { unmount } = render(
        <Recorder
          onRecorded={saved}
          onStart={began}
          onRecordingChange={changed}
          transcribeLocally
        />,
      );
      await start();
      expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
      expect(began).toHaveBeenCalledOnce();
      expect(changed).toHaveBeenCalledWith(true);
      expect(instances[0].start).toHaveBeenCalledOnce();
      act(() => {
        instances[0].ondataavailable?.({ data: new Blob([]) });
        instances[0].ondataavailable?.({ data: new Blob(["spoken Spanish"]) });
      });
      fireEvent.click(screen.getByRole("button", { name: "Stop recording" }));
      expect(saved).toHaveBeenCalledOnce();
      expect(saved.mock.calls[0][0].size).toBe(14);
      expect(saved.mock.calls[0][0].type).toBe(type || "audio/webm");
      expect(stopTrack).toHaveBeenCalled();
      expect(changed).toHaveBeenLastCalledWith(false);
      expect(screen.getByRole("link", { name: "Save recording" })).toHaveAttribute(
        "download",
        type === "audio/mp4" ? "paso-speaking.m4a" : "paso-speaking.webm",
      );
      unmount();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:recording-1");
    },
  );
  it("does not submit an empty recording for transcription", async () => {
    const saved = vi.fn();
    render(<Recorder onRecorded={saved} />);
    await start();
    fireEvent.click(screen.getByRole("button", { name: "Stop recording" }));
    expect(saved).not.toHaveBeenCalled();
  });
  it("increments elapsed time only while recording and resets on a new take", async () => {
    vi.useFakeTimers();
    render(<Recorder onRecorded={vi.fn()} />);
    await start();
    act(() => vi.advanceTimersByTime(65000));
    expect(screen.getByText("01:05")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Stop recording" }));
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByText("01:05")).toBeInTheDocument();
    await start();
    expect(screen.getByText("00:00")).toBeInTheDocument();
  });
  it("revokes the previous recording when replacing it", async () => {
    render(<Recorder onRecorded={vi.fn()} />);
    await start();
    fireEvent.click(screen.getByRole("button", { name: "Stop recording" }));
    await start();
    fireEvent.click(screen.getByRole("button", { name: "Stop recording" }));
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:recording-1");
    expect(screen.getByRole("link", { name: "Save recording" })).toHaveAttribute(
      "href",
      "blob:recording-2",
    );
  });
  it.each([new DOMException("denied", "NotAllowedError"), new Error("No device"), "unknown"])(
    "allows practice when microphone permission or device fails (case %#): %j",
    async (error) => {
      getUserMedia.mockRejectedValue(error);
      render(<Recorder onRecorded={vi.fn()} />);
      await start();
      expect(screen.getByRole("status")).toHaveTextContent(
        error instanceof Error
          ? error.name === "NotAllowedError"
            ? "Microphone access was declined"
            : error.message
          : "could not start",
      );
      expect(instances).toHaveLength(0);
    },
  );
  it("explains unsupported browsers", async () => {
    vi.stubGlobal("MediaRecorder", undefined);
    render(<Recorder onRecorded={vi.fn()} />);
    await start();
    expect(screen.getByRole("status")).toHaveTextContent("not supported");
    expect(getUserMedia).not.toHaveBeenCalled();
  });
  it("stops tracks on device errors and can try again", async () => {
    const changed = vi.fn();
    render(<Recorder onRecorded={vi.fn()} onRecordingChange={changed} />);
    await start();
    act(() => instances[0].onerror?.());
    expect(stopTrack).toHaveBeenCalled();
    expect(changed).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole("status")).toHaveTextContent("stopped unexpectedly");
    await start();
    expect(instances).toHaveLength(2);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
  it("deduplicates permission requests and stops a late stream after unmount", async () => {
    let resolve!: (s: unknown) => void;
    getUserMedia.mockReturnValue(
      new Promise((r) => {
        resolve = r;
      }),
    );
    const { unmount } = render(<Recorder onRecorded={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Record your answer" }));
    fireEvent.click(screen.getByRole("button", { name: "Record your answer" }));
    expect(getUserMedia).toHaveBeenCalledOnce();
    unmount();
    await act(async () => resolve({ getTracks: () => [{ stop: stopTrack }] }));
    expect(stopTrack).toHaveBeenCalledOnce();
    expect(instances).toHaveLength(0);
  });
  it("stops an active recording on unmount without submitting it", async () => {
    const saved = vi.fn();
    const { unmount } = render(<Recorder onRecorded={saved} />);
    await start();
    act(() => instances[0].ondataavailable?.({ data: new Blob(["sound"]) }));
    unmount();
    expect(instances[0].stop).toHaveBeenCalledOnce();
    expect(saved).not.toHaveBeenCalled();
    expect(stopTrack).toHaveBeenCalled();
  });
});
