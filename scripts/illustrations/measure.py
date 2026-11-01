"""Measure how close an image's main fills are to the illustration palette. Changes no pixel.

For each image: take the opaque pixels (alpha 250 or more), find the 12 dominant colours
(median cut), and for each colour covering at least 2% of the opaque area print its nearest
palette colour and the OKLab distance x100 (1 is a just-visible difference, under 2 reads as
the same colour). Also prints the share of opaque pixels within 3 and within 6 of the palette.

Usage: python3 scripts/illustrations/measure.py <image ...>"""
import json
import sys
from pathlib import Path
from PIL import Image

PALETTE = Path(__file__).with_name("palette.json")


def to_oklab(rgb):
    def lin(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = (lin(v) for v in rgb)
    l = (0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b) ** (1 / 3)
    m = (0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b) ** (1 / 3)
    s = (0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b) ** (1 / 3)
    return (
        0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
    )


def dist(p, q):
    return 100 * sum((x - y) ** 2 for x, y in zip(p, q)) ** 0.5


roles = json.loads(PALETTE.read_text())
palette = {h: to_oklab(tuple(int(h[i : i + 2], 16) for i in (1, 3, 5))) for h in roles}


def nearest(rgb):
    lab = to_oklab(rgb)
    return min((dist(lab, v), h) for h, v in palette.items())


for path in sys.argv[1:]:
    im = Image.open(path).convert("RGBA")
    pixels = im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata()
    opaque = [p[:3] for p in pixels if p[3] >= 250]
    strip = Image.new("RGB", (len(opaque), 1))
    strip.putdata(opaque)
    near3 = near6 = 0
    for n, c in strip.getcolors(1 << 24):
        d = nearest(c)[0]
        near3 += n if d <= 3 else 0
        near6 += n if d <= 6 else 0
    q = strip.quantize(colors=12, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()
    clusters = sorted(((n, tuple(pal[i * 3 : i * 3 + 3])) for n, i in q.getcolors()), reverse=True)
    total = len(opaque)
    worst = 0.0
    print(f"{path}: {total} opaque px, {100 * near3 / total:.0f}% within 3 of the palette, {100 * near6 / total:.0f}% within 6")
    for n, c in clusters:
        if n / total < 0.02:
            continue
        d, h = nearest(c)
        worst = max(worst, d)
        print(f"  {100 * n / total:4.1f}%  #{c[0]:02X}{c[1]:02X}{c[2]:02X} -> {h} {roles[h]}  distance {d:.1f}")
    print(f"  worst dominant fill distance {worst:.1f}: {'PASS' if worst <= 6 else 'FAIL (over 6)'}")
