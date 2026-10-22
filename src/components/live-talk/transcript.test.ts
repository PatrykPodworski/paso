import { expect, it } from "vitest";
import { transcriptText, turnsOf } from "./transcript";

it("joins consecutive fragments from one speaker into a turn", () => {
  expect(
    turnsOf([
      { role: "examiner", text: "¿Cómo ", start: 0, end: 300 },
      { role: "examiner", text: "te llamas?", start: 300, end: 900 },
      { role: "student", text: "Me llamo", start: 2100, end: 2500 },
      { role: "student", text: " Ana.", start: 2500, end: 2900 },
      { role: "examiner", text: "Muy bien.", start: 4000, end: 4600 },
    ]),
  ).toEqual([
    { role: "examiner", text: "¿Cómo te llamas?", at: 0 },
    { role: "student", text: "Me llamo Ana.", at: 2100 },
    { role: "examiner", text: "Muy bien.", at: 4000 },
  ]);
});

it("orders fragments by when they were spoken, not when they arrived", () => {
  expect(
    turnsOf([
      { role: "examiner", text: "¿Cómo te llamas?", start: 0, end: 900 },
      { role: "examiner", text: "Muy bien. ", start: 3000, end: 3500 },
      { role: "examiner", text: "¿Cuántos años tienes?", start: 3500, end: 4400 },
      { role: "student", text: "Me llamo Ana.", start: 1500, end: 2600 },
      { role: "student", text: "Tengo veinte años.", start: 5000, end: 6200 },
    ]),
  ).toEqual([
    { role: "examiner", text: "¿Cómo te llamas?", at: 0 },
    { role: "student", text: "Me llamo Ana.", at: 1500 },
    { role: "examiner", text: "Muy bien. ¿Cuántos años tienes?", at: 3000 },
    { role: "student", text: "Tengo veinte años.", at: 5000 },
  ]);
});

it("keeps overlapping speech in the order each part started", () => {
  expect(
    turnsOf([
      { role: "student", text: "Soy de", start: 1000, end: 1400 },
      { role: "examiner", text: "Ajá.", start: 1200, end: 1300 },
      { role: "student", text: " Polonia.", start: 1400, end: 1900 },
    ]).map((t) => t.role),
  ).toEqual(["student", "examiner", "student"]);
});

it("writes a transcript as labelled lines", () => {
  expect(
    transcriptText([
      { role: "examiner", text: "¿Cómo te llamas?" },
      { role: "student", text: " Me llamo Ana. " },
    ]),
  ).toBe("Lucía: ¿Cómo te llamas?\nYou: Me llamo Ana.");
});
