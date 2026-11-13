import { expect, it } from "vitest";
import sources from "../../data/audio-sources.json";
import { courseUnitNumber, pathUnitNumber } from "../../data/path";
import { audioAssets, audioSourceNames } from "./audioAssets";

// Clip groups take the path number of their unit, which moves when a set unit joins the path
// before it.
const unit = (course: number) => `Unit ${courseUnitNumber(course)}`;
const setUnit = (name: string, id: string) => `${name} · Unit ${pathUnitNumber(id)}`;

const SET_GROUPS = [
  setUnit("Asking questions", "aq-u1"),
  setUnit("Asking questions", "aq-u2"),
  setUnit("Asking questions", "aq-u3"),
  setUnit("Asking questions", "aq-u4"),
  setUnit("Weekdays", "wd-u1"),
  setUnit("Weekdays", "wd-u2"),
  setUnit("Where things are", "pl-u1"),
  setUnit("Where things are", "pl-u2"),
  setUnit("Where things are", "pl-u3"),
  setUnit("Time words", "tm-u1"),
  setUnit("Time words", "tm-u2"),
];

it("lists every generated clip once, under the unit or collection that speaks it", () => {
  expect(audioAssets).toHaveLength(Object.keys(sources).length);
  expect(new Set(audioAssets.map((a) => a.id)).size).toBe(audioAssets.length);

  expect(audioAssets.find((a) => a.text === "la cocina")).toEqual({
    id: "audio:v6yukl",
    text: "la cocina",
    src: "/audio/voxcpm/401bff33039f205fe74afd37.mp3",
    source: unit(4),
  });

  expect(audioAssets.find((a) => a.text === "el escritorio")?.source).toBe("Topic flashcards");

  expect(audioAssets[0].source).toBe("Unit 1");
  expect(audioAssets.find((a) => a.text === "Poco a poco.")?.source).toBe("Other");

  expect(audioAssets.find((a) => a.id === "audio:1r7h0dt")).toEqual({
    id: "audio:1r7h0dt",
    text: "No text recorded",
    src: "/audio/elevenlabs/8400afd6a427915cd24228e7.mp3",
    source: "Other",
  });
});

it("orders the clips by unit, then the practice sets, the mock exam, foundations and topic flashcards", () => {
  const order = [...new Set(audioAssets.map((a) => a.source))];

  expect(order).toEqual([
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(unit),
    ...SET_GROUPS,
    "Mock exam",
    "Foundations",
    "Topic flashcards",
    "Other",
  ]);
});

it("offers every practice set's units after the course units", () => {
  expect(audioSourceNames.slice(11, 25)).toEqual([
    unit(12),
    ...SET_GROUPS,
    setUnit("Numbers", "nu-u1"),
    "Mock exam",
  ]);
});
