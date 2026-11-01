"""Render images the way the app shows them, for a visual check. Changes no source pixel.

Each image is drawn at 96x96 (words) on the light and dark question-card surfaces, and wide
images (the hero) at 480 px wide on the light and dark muted card. Open the output PNG and
look at it: every subject must read at a glance on both themes.

Usage: python3 scripts/illustrations/preview.py <out.png> <image ...>"""
import sys
from PIL import Image

LIGHT, DARK = (241, 243, 243), (22, 27, 29)  # muted / dark card
HERO_LIGHT, HERO_DARK = (241, 243, 243), (34, 41, 43)  # muted card, light and dark
TILE, PAD, HERO_W = 96, 12, 480

out, paths = sys.argv[1], sys.argv[2:]
images = [(p, Image.open(p).convert("RGBA")) for p in paths]
words = [im for _, im in images if im.width == im.height]
wide = [im for _, im in images if im.width != im.height]
row_w = max(PAD + len(words) * (TILE + PAD), 2 * (HERO_W + PAD) + PAD)
hero_rows = [round(HERO_W * im.height / im.width) + PAD for im in wide]
height = (2 * (TILE + PAD) + PAD if words else 0) + sum(hero_rows)
canvas = Image.new("RGB", (row_w, max(height, 1)), (255, 255, 255))
y = 0
if words:
    for r, bg in enumerate((LIGHT, DARK)):
        canvas.paste(bg, (0, y + r * (TILE + PAD), row_w, y + (r + 1) * (TILE + PAD) + (PAD if r else 0)))
        for c, im in enumerate(words):
            small = im.resize((TILE, TILE), Image.LANCZOS)
            canvas.paste(small, (PAD + c * (TILE + PAD), y + PAD + r * (TILE + PAD)), small)
    y += 2 * (TILE + PAD) + PAD
for im, row in zip(wide, hero_rows):
    small = im.resize((HERO_W, row - PAD), Image.LANCZOS)
    for c, bg in enumerate((HERO_LIGHT, HERO_DARK)):
        x = PAD + c * (HERO_W + PAD)
        canvas.paste(bg, (x, y, x + HERO_W, y + row - PAD))
        canvas.paste(small, (x, y), small)
    y += row
canvas.save(out)
print(out)
