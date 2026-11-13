import { within } from "@testing-library/react";

// What a screen reader reads in each answer of a comparison, which hides the marked copies.
export const readAnswers = (container: HTMLElement = document.body) =>
  within(container)
    .getAllByRole("definition")
    .map((answer) =>
      [...answer.childNodes]
        .filter((part) => !(part instanceof Element && part.getAttribute("aria-hidden") === "true"))
        .map((part) => part.textContent)
        .join(""),
    );
