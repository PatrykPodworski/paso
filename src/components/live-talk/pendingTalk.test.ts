import { expect, it, vi } from "vitest";
import { clearPendingTalk, readPendingTalk, savePendingTalk } from "./pendingTalk";

const ana = [
  { role: "examiner" as const, text: "¿Cómo te llamas?" },
  { role: "student" as const, text: "Me llamo Ana." },
];

const leo = [{ role: "student" as const, text: "Soy Leo." }];

it("keeps a talk per question until it is cleared", () => {
  savePendingTalk("u1-o3", ana);
  savePendingTalk("u2-o3", leo);
  clearPendingTalk("u1-o3");

  expect(readPendingTalk("u1-o3")).toBeUndefined();
  expect(readPendingTalk("u2-o3")).toEqual(leo);
});

it("removes the storage key with the last talk", () => {
  savePendingTalk("u1-o3", ana);

  expect(JSON.parse(localStorage.getItem("paso-pending-talk-v1")!)).toEqual({ "u1-o3": ana });

  clearPendingTalk("u1-o3");

  expect(localStorage.getItem("paso-pending-talk-v1")).toBeNull();
});

it("keeps nothing for a talk without a question id", () => {
  savePendingTalk(undefined, ana);

  expect(localStorage.getItem("paso-pending-talk-v1")).toBeNull();
  expect(readPendingTalk(undefined)).toBeUndefined();
});

it.each(["{oops", "[]", JSON.stringify({ "u1-o3": "Me llamo Ana." })])(
  "ignores unreadable saved talks %s",
  (raw) => {
    localStorage.setItem("paso-pending-talk-v1", raw);

    expect(readPendingTalk("u1-o3")).toBeUndefined();
  },
);

it("keeps working when storage refuses to save", () => {
  vi.spyOn(localStorage, "setItem").mockImplementationOnce(() => {
    throw new Error("full");
  });

  savePendingTalk("u1-o3", ana);

  expect(readPendingTalk("u1-o3")).toBeUndefined();
});

it("keeps the talk when storage refuses to clear it", () => {
  savePendingTalk("u1-o3", ana);

  vi.spyOn(localStorage, "removeItem").mockImplementationOnce(() => {
    throw new Error("blocked");
  });

  clearPendingTalk("u1-o3");

  expect(readPendingTalk("u1-o3")).toEqual(ana);
});

it("reads no talk when storage refuses to read", () => {
  savePendingTalk("u1-o3", ana);

  vi.spyOn(localStorage, "getItem").mockImplementationOnce(() => {
    throw new Error("blocked");
  });

  expect(readPendingTalk("u1-o3")).toBeUndefined();
  expect(readPendingTalk("u1-o3")).toEqual(ana);
});
