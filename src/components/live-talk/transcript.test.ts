import { expect, it } from "vitest";
import { addDelta, transcriptText } from "./transcript";

it("joins consecutive fragments from one speaker into a turn", () => {
  let turns = addDelta([], "examiner", "¿Cómo ", 0);

  turns = addDelta(turns, "examiner", "te llamas?", 400);
  turns = addDelta(turns, "student", "Me llamo", 2100);
  turns = addDelta(turns, "student", " Ana.", 2500);
  turns = addDelta(turns, "examiner", "Muy bien.", 4000);

  expect(turns).toEqual([
    { role: "examiner", text: "¿Cómo te llamas?", at: 0 },
    { role: "student", text: "Me llamo Ana.", at: 2100 },
    { role: "examiner", text: "Muy bien.", at: 4000 },
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
