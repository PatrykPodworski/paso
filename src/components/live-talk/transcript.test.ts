import { expect, it } from "vitest";
import { addDelta, transcriptText } from "./transcript";

it("joins consecutive fragments from one speaker into a turn", () => {
  let turns = addDelta([], "examiner", "¿Cómo ");

  turns = addDelta(turns, "examiner", "te llamas?");
  turns = addDelta(turns, "student", "Me llamo");
  turns = addDelta(turns, "student", " Ana.");
  turns = addDelta(turns, "examiner", "Muy bien.");

  expect(turns).toEqual([
    { role: "examiner", text: "¿Cómo te llamas?" },
    { role: "student", text: "Me llamo Ana." },
    { role: "examiner", text: "Muy bien." },
  ]);
});

it("writes a transcript as labelled lines", () => {
  expect(
    transcriptText([
      { role: "examiner", text: "¿Cómo te llamas?" },
      { role: "student", text: " Me llamo Ana. " },
    ]),
  ).toBe("Examiner: ¿Cómo te llamas?\nYou: Me llamo Ana.");
});
