import { expect, it } from "vitest";
import sources from "../../data/audio-sources.json";
import { audioAssets, audioSourceNames } from "./audioAssets";

it("lists every generated clip once, under the unit or collection that speaks it", () => {
  expect(audioAssets).toHaveLength(Object.keys(sources).length);
  expect(new Set(audioAssets.map((a) => a.id)).size).toBe(audioAssets.length);

  expect(audioAssets.find((a) => a.text === "la cocina")).toEqual({
    id: "audio:v6yukl",
    text: "la cocina",
    src: "/audio/voxcpm/401bff33039f205fe74afd37.mp3",
    source: "Unit 4",
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
    "Unit 1",
    "Unit 2",
    "Unit 3",
    "Unit 4",
    "Unit 6",
    "Unit 10",
    "Unit 11",
    "Unit 12",
    "Unit 13",
    "Unit 16",
    "Unit 18",
    "Unit 20",
    "Asking questions · Unit 14",
    "Asking questions · Unit 15",
    "Asking questions · Unit 17",
    "Asking questions · Unit 19",
    "Weekdays · Unit 7",
    "Weekdays · Unit 8",
    "Weekdays · Unit 9",
    "Where things are · Unit 5",
    "Mock exam",
    "Foundations",
    "Topic flashcards",
    "Other",
  ]);
});

it("offers every practice set's units after the course units", () => {
  expect(audioSourceNames.slice(11, 21)).toEqual([
    "Unit 20",
    "Asking questions · Unit 14",
    "Asking questions · Unit 15",
    "Asking questions · Unit 17",
    "Asking questions · Unit 19",
    "Weekdays · Unit 7",
    "Weekdays · Unit 8",
    "Weekdays · Unit 9",
    "Where things are · Unit 5",
    "Mock exam",
  ]);
});
