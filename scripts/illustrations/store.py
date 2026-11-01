"""Store a generated PNG in the app as lossless WebP and prove no pixel changed.

Words are resized to 512x512 and, with --hero, the hero to 1200 px wide (Lanczos resizing is
the only allowed pixel change). The WebP is decoded again and compared with the source: every pixel with alpha
above 0 must match exactly, or the script fails and writes nothing.

Usage: python3 scripts/illustrations/store.py [--hero] <generated.png> <out.webp>"""
import sys
from io import BytesIO
from PIL import Image, ImageChops

args = sys.argv[1:]
hero = "--hero" in args
src, out = [a for a in args if a != "--hero"]
im = Image.open(src).convert("RGBA")
size = (1200, round(1200 * im.height / im.width)) if hero else (512, 512)
if im.size != size:
    im = im.resize(size, Image.LANCZOS)
buf = BytesIO()
im.save(buf, "WEBP", lossless=True, quality=100, method=6, exact=True)
back = Image.open(BytesIO(buf.getvalue())).convert("RGBA")
if ImageChops.difference(im, back).getbbox() is not None:
    sys.exit(f"{src}: WebP round trip changed pixels; not written")
with open(out, "wb") as f:
    f.write(buf.getvalue())
print(f"{out}: {im.width}x{im.height}, {len(buf.getvalue()) // 1024} KB, lossless round trip verified")
