"""Find see-through holes inside an object: regions with alpha below 250 that do not touch
the image border, so the object encloses them. A hole of 20 px or more whose lowest alpha is
under 128 is a real see-through gap; check that each one is intended (a chair's backrest gap)
and not a hole punched into a solid piece (a door panel, a window pane).

Usage: python3 scripts/illustrations/holes.py <image ...>"""
import sys
from collections import deque
from PIL import Image

THRESHOLD = 250

for path in sys.argv[1:]:
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    alpha = im.getchannel("A").load()
    see = [[alpha[x, y] < THRESHOLD for x in range(w)] for y in range(h)]
    seen = [[False] * w for _ in range(h)]

    def fill(sx, sy):
        size, low, q = 0, 255, deque([(sx, sy)])
        seen[sy][sx] = True
        while q:
            x, y = q.popleft()
            size += 1
            low = min(low, alpha[x, y])
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if 0 <= nx < w and 0 <= ny < h and see[ny][nx] and not seen[ny][nx]:
                    seen[ny][nx] = True
                    q.append((nx, ny))
        return size, low

    for x in range(w):
        for y in (0, h - 1):
            if see[y][x] and not seen[y][x]:
                fill(x, y)
    for y in range(h):
        for x in (0, w - 1):
            if see[y][x] and not seen[y][x]:
                fill(x, y)
    holes = []
    for y in range(h):
        for x in range(w):
            if see[y][x] and not seen[y][x]:
                size, low = fill(x, y)
                holes.append((size, low, x, y))
    holes.sort(reverse=True)
    big = [hole for hole in holes if hole[0] >= 20]
    clear = [hole for hole in big if hole[1] < 128]
    print(
        f"{path}: {len(holes)} enclosed regions, {len(big)} of 20px or more, {len(clear)} see-through (min alpha < 128)"
        + (": " + ", ".join(f"{s}px min alpha {a} at ({x},{y})" for s, a, x, y in clear[:6]) if clear else "")
    )
