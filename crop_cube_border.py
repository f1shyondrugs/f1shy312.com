#!/usr/bin/env python3
"""Crop 2px off every side of PNGs in the cube/ directory to remove borders."""

from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Install Pillow: pip install Pillow")
    raise SystemExit(1)

CUBE_DIR = Path(__file__).parent / "cube"
CROP_PX = 2


def main():
    for path in sorted(CUBE_DIR.glob("*.png")):
        img = Image.open(path).convert("RGBA")
        w, h = img.size
        if w <= CROP_PX * 2 or h <= CROP_PX * 2:
            print(f"Skip {path.name} (too small)")
            continue
        cropped = img.crop((CROP_PX, CROP_PX, w - CROP_PX, h - CROP_PX))
        cropped.save(path)
        print(f"Cropped {path.name}")


if __name__ == "__main__":
    main()
