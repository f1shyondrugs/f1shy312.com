#!/usr/bin/env python3
"""Darken cube-right.png and cube-left.png in the cube/ directory."""

from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Install Pillow: pip install Pillow")
    raise SystemExit(1)

CUBE_DIR = Path(__file__).parent / "cube"
DARKEN_FACTOR = 0.75  # 1.0 = no change, 0.5 = half brightness


def main():
    for name in ("cube-right.png", "cube-left.png"):
        path = CUBE_DIR / name
        if not path.exists():
            print(f"Skip {name} (not found)")
            continue
        img = Image.open(path).convert("RGBA")
        pixels = img.load()
        for y in range(img.height):
            for x in range(img.width):
                r, g, b, a = pixels[x, y]
                pixels[x, y] = (
                    int(r * DARKEN_FACTOR),
                    int(g * DARKEN_FACTOR),
                    int(b * DARKEN_FACTOR),
                    a,
                )
        img.save(path)
        print(f"Darkened {name}")


if __name__ == "__main__":
    main()
