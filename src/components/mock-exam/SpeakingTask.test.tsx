import { act, fireEvent, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { beforeEach, expect, it, vi } from "vitest";
import { mockSections } from "../../data/mock";
import type { LiveScore } from "../../data/types";
import { click, mount, seed, setupMockExam, state } from "../../test/mockExam";
import type { LiveTalk } from "../live-talk/LiveTalk";

let talk: ComponentProps<typeof LiveTalk> | undefined;

vi.mock("../live-talk/LiveTalk", () => ({
  LiveTalk: (props: ComponentProps<typeof LiveTalk>) => {
    talk = props;

    return <p>Lucía is here</p>;
  },
}));

setupMockExam();

beforeEach(() => {
  talk = undefined;
});

const [s1, s2, s3] = mockSections[3].questions;

const score: LiveScore = {
  grade: "good",
  items: [{ id: "name", label: "Name", level: "correct" }],
};

it("runs Task 1 as a live talk without a topic", async () => {
  await seed({ section: 3, stage: "run" });
  await mount();
  expect(screen.getByRole("heading", { name: s1.prompt })).toBeInTheDocument();
  expect(screen.queryByRole("radio")).toBeNull();
  expect(screen.queryByRole("button", { name: "Save answer" })).toBeNull();
  expect(talk).toMatchObject({ task: "mock-s1", topic: undefined, exam: true, result: undefined });
});

it("asks for the topic before Task 2 and sends it with the talk", async () => {
  await seed({ section: 3, index: 1, stage: "run" });
  await mount();
  expect(screen.getByRole("heading", { name: s2.prompt })).toBeInTheDocument();
  expect(screen.getByRole("group", { name: "Your topic for Tasks 2 and 3" })).toBeInTheDocument();
  expect(screen.queryByText("Lucía is here")).toBeNull();
  fireEvent.click(screen.getByRole("radio", { name: /Your studies/ }));
  expect((await state()).topic).toBe("studies");
  expect(screen.getByText("Lucía is here")).toBeInTheDocument();
  expect(talk).toMatchObject({ task: "mock-s2", topic: "studies" });
  fireEvent.click(screen.getByRole("radio", { name: /Your free time/ }));
  expect(talk).toMatchObject({ task: "mock-s2", topic: "freeTime" });
});

it("keeps the picked topic for Task 3", async () => {
  await seed({ section: 3, index: 2, stage: "run", topic: "home" });
  await mount();
  expect(screen.getByRole("heading", { name: s3.prompt })).toBeInTheDocument();
  expect(screen.getByRole("radio", { name: /Your home/ })).toBeChecked();
  expect(talk).toMatchObject({ task: "mock-s3", topic: "home" });
});

it("keeps the transcript and the grade with the run as soon as Lucía has scored", async () => {
  await seed({ section: 3, stage: "run" });
  await mount();
  act(() => talk!.onEvaluated!("Lucía: Hola.\nYou: Hola.", true, false, score));
  expect((await state()).answers[s1.id]).toBe("Lucía: Hola.\nYou: Hola.");
  expect((await state()).talks[s1.id]).toEqual(score);
  expect((await state()).index).toBe(0);
  act(() => talk!.onSubmit("Lucía: Hola.\nYou: Hola.", true, false));
  expect((await state()).index).toBe(1);
  expect((await state()).answers[s1.id]).toBe("Lucía: Hola.\nYou: Hola.");
});

it("shows a finished talk's result again instead of a new talk, and confirms after the last", async () => {
  await seed({ section: 3, index: 2, stage: "run", topic: "home", talks: { [s3.id]: score } });
  await mount();
  expect(screen.queryByRole("radio")).toBeNull();
  expect(talk).toMatchObject({ task: "mock-s3", topic: "home", result: score });
  act(() => talk!.onSubmit("", true, false));
  expect((await state()).index).toBe(2);
  expect(screen.getByRole("alert")).toHaveTextContent("3 unanswered");
});

it("moves between talks with the section's own navigation", async () => {
  await seed({ section: 3, index: 1, stage: "run" });
  await mount();
  click("← Previous question");
  expect((await state()).index).toBe(0);
  expect(talk).toMatchObject({ task: "mock-s1" });
});
