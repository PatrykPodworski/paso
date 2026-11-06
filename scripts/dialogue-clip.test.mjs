// @vitest-environment node
import { describe, expect, it } from "vitest";
import { allQuestions } from "../src/data/curriculum.ts";
import { mockQuestions } from "../src/data/mock.ts";
import { dialogues } from "./dialogues.mjs";
import { dialogueText, installClip, sameWords } from "./dialogue-clip.mjs";

describe("dialogue clips", () => {
  it("splits each dialogue into turns that read back as a listening text", () => {
    const listening = new Set([...allQuestions, ...mockQuestions].map((q) => q.audio));

    for (const dialogue of dialogues) {
      expect(listening.has(dialogueText(dialogue.turns)), dialogue.id).toBe(true);
    }
  });

  it("gives the speakers of a dialogue different voices", () => {
    for (const dialogue of dialogues) {
      const speakers = new Set(dialogue.turns.map(([speaker]) => speaker));
      const voices = new Set([...speakers].map((speaker) => dialogue.voices[speaker]));

      expect(speakers.size, dialogue.id).toBeGreaterThan(1);
      expect(voices.size, dialogue.id).toBe(speakers.size);
    }
  });

  it("joins the turn texts with one space", () => {
    expect(
      dialogueText([
        ["friend", "Hola, Pablo."],
        ["pablo", "¿Qué tal?"],
      ]),
    ).toBe("Hola, Pablo. ¿Qué tal?");
  });

  it("compares a transcript by its words, ignoring case, accents and punctuation", () => {
    expect(sameWords("¿Cómo vamos? Podemos ir en tren.", "como vamos podemos ir en tren")).toBe(
      true,
    );

    expect(sameWords("Cuesta doce euros.", "Cuesta 12 euros.")).toBe(true);
    expect(sameWords("A las ocho y media.", "A las 8 y media.")).toBe(true);
    expect(sameWords("Cuesta doce euros.", "Cuesta 13 euros.")).toBe(false);
    expect(sameWords("Cuesta doce euros.", "Cuesta dos euros.")).toBe(false);
  });

  it("installs a clip under its text key and frees the old file only when nothing else plays it", () => {
    const sources = {
      k1: { src: "/audio/voxcpm/old.mp3", text: "A" },
      k2: { src: "/audio/voxcpm/shared.mp3", text: "B" },
      k3: { src: "/audio/voxcpm/shared.mp3", text: "C" },
    };

    const entry = { src: "/audio/voxcpm/new.mp3", text: "A" };

    expect(installClip(sources, "k1", entry)).toEqual({
      sources: { ...sources, k1: entry },
      unused: "/audio/voxcpm/old.mp3",
    });

    expect(installClip(sources, "k2", entry).unused).toBe(null);
    expect(installClip(sources, "k9", entry).unused).toBe(null);
  });
});
