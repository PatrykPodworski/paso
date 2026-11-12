import { render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { teachingCard } from "../../data/practice-sets/item";
import { TeachingCard } from "./TeachingCard";

const texts = (elements: HTMLElement[]) => elements.map((el) => [el.textContent, el.lang]);

it("lays out each new word as a row with its meaning, example, translation and note", () => {
  const q = teachingCard("WT-M01-INTRO", {
    heading: "New phrases",
    terms: [
      {
        es: "en",
        meaning: "in, on",
        example: { es: "El libro está en la caja.", en: "The book is in the box." },
      },
      {
        es: "dentro de",
        meaning: "inside",
        example: { es: "El móvil está dentro de la bolsa.", en: "The phone is inside the bag." },
        note: "dentro de el joins into dentro del.",
      },
    ],
  });

  render(<TeachingCard q={q} onContinue={vi.fn()} />);

  expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("New phrases");

  const rows = screen.getAllByRole("term").map((term) => {
    const row = term.parentElement!;

    return {
      spanish: [...row.querySelectorAll('[lang="es"]')].map((el) => el.textContent),
      details: [...row.querySelectorAll("dd")].map((dd) => dd.textContent),
    };
  });

  expect(rows).toEqual([
    {
      spanish: ["en", "El libro está en la caja."],
      details: ["in, on", "El libro está en la caja.The book is in the box."],
    },
    {
      spanish: ["dentro de", "El móvil está dentro de la bolsa."],
      details: [
        "inside",
        "El móvil está dentro de la bolsa.The phone is inside the bag.",
        "dentro de el joins into dentro del.",
      ],
    },
  ]);
});

it("shows a rule card's rule under its heading, then its examples as pairs", () => {
  const q = teachingCard("WT-T01-E01-FORM", {
    heading: "en el, dentro del, fuera del",
    rule: "de + el becomes del. en never joins el.",
    examples: [
      { es: "El libro está en el armario.", en: "The book is in the wardrobe." },
      { es: "El móvil está dentro del bolsillo.", en: "The phone is in the pocket." },
    ],
  });

  render(<TeachingCard q={q} onContinue={vi.fn()} />);

  expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
    "en el, dentro del, fuera del",
  );

  expect(screen.getByText("de + el becomes del. en never joins el.").tagName).toBe("P");

  expect(
    screen.getAllByRole("listitem").map((li) => texts([...li.querySelectorAll<HTMLElement>("p")])),
  ).toEqual([
    [
      ["El libro está en el armario.", "es"],
      ["The book is in the wardrobe.", ""],
    ],
    [
      ["El móvil está dentro del bolsillo.", "es"],
      ["The phone is in the pocket.", ""],
    ],
  ]);
});

it("renders a plain-text card as its heading and one paragraph", () => {
  const q = teachingCard("WD-M01-INTRO", "New days", "lunes is Monday. Example: Hoy es lunes.");
  const { container } = render(<TeachingCard q={q} onContinue={vi.fn()} />);

  expect(screen.getByRole("heading", { level: 2 }).textContent).toBe("New days");

  expect(texts([...container.querySelectorAll<HTMLElement>("p")])).toEqual([
    ["lunes is Monday. Example: Hoy es lunes.", ""],
  ]);

  expect(container.querySelector("dl, ul")).toBeNull();
  expect(within(container).getByRole("button", { name: "Continue" })).toBeTruthy();
});
