import { test, expect } from "../fixtures/app";

// styles.css imports Tailwind's utilities unlayered on purpose. Normal unlayered
// declarations beat normal layered ones at any specificity, so putting utilities back
// in layer(utilities) would make them lose to plain element rules such as
// `button { color: inherit }` — silently, with no build or type error. These two
// assertions fail if that happens.
test("Tailwind utilities are built and outrank the stylesheet's element rules", async ({
  page,
}) => {
  await page.goto("/");
  const styles = await page.evaluate(() => {
    const host = document.createElement("div");
    host.style.color = "rgb(0, 255, 0)";
    const button = document.createElement("button");
    // text-* collides with `button { color: inherit }`; gap-* collides with nothing.
    button.className = "text-[#ff0000] gap-3";
    host.append(button);
    document.body.append(host);
    const { color, gap } = getComputedStyle(button);
    host.remove();
    return { color, gap };
  });
  expect(styles.gap, "utilities are emitted at all").toBe("12px");
  expect(styles.color, "utilities beat `button { color: inherit }`").toBe("rgb(255, 0, 0)");
});
