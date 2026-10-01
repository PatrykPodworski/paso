import { test, expect } from "../fixtures/app";

// Preflight sets `button { color: inherit }` in the base layer. An unlayered copy of that
// rule, or a layer order with utilities below base, would make `text-*` on a button do
// nothing — silently, with no build or type error. These two assertions fail if that happens.
test("Tailwind utilities are built and outrank preflight's element rules", async ({ page }) => {
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
