#!/usr/bin/env python3
"""
Shrink BBQ photos so the site stays fast and the git repo stays small.

Usage:
    python3 tools/resize_photos.py photos/2026-08-15-india-point/
    python3 tools/resize_photos.py photos/2026-08-15-india-point/ --max 1600 --quality 85
    python3 tools/resize_photos.py photos/2026-08-15-india-point/ --keep-originals

What it does:
  * resizes every image in the folder so its longest side is at most --max px
  * rotates according to the camera's EXIF orientation, then strips EXIF (privacy)
  * converts HEIC/PNG/etc. to .jpg (HEIC needs `pip install pillow-heif`)
  * prints a ready-to-paste `photos: [...]` list for events.js
"""
import argparse
import os
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageOps

try:  # optional HEIC support (iPhone photos)
    import pillow_heif  # type: ignore
    pillow_heif.register_heif_opener()
except ImportError:
    pass

EXTS = {".jpg", ".jpeg", ".png", ".heic", ".heif", ".webp", ".tif", ".tiff", ".bmp"}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("folder", help="folder with the photos, e.g. photos/2026-08-15-india-point/")
    ap.add_argument("--max", type=int, default=1600, help="max longest side in px (default 1600)")
    ap.add_argument("--quality", type=int, default=85, help="JPEG quality (default 85)")
    ap.add_argument("--keep-originals", action="store_true", help="move originals into <folder>/originals/ (git-ignored)")
    args = ap.parse_args()

    folder = Path(args.folder)
    if not folder.is_dir():
        sys.exit(f"not a folder: {folder}")

    files = sorted(p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in EXTS)
    if not files:
        sys.exit(f"no images found in {folder}")

    originals = folder / "originals"
    if args.keep_originals:
        originals.mkdir(exist_ok=True)

    outputs, before, after = [], 0, 0
    for src in files:
        try:
            im = Image.open(src)
        except Exception as e:  # noqa: BLE001
            print(f"  skip {src.name}: {e}")
            continue
        im = ImageOps.exif_transpose(im)  # apply camera rotation
        im.thumbnail((args.max, args.max), Image.LANCZOS)  # keeps aspect ratio, never upscales
        if im.mode not in ("RGB", "L"):
            im = im.convert("RGB")

        dst = src.with_suffix(".jpg")
        size_before = src.stat().st_size
        if args.keep_originals:
            shutil.move(str(src), originals / src.name)
        elif dst != src:
            src.unlink()
        im.save(dst, "JPEG", quality=args.quality, optimize=True, progressive=True)  # EXIF not passed => stripped
        size_after = dst.stat().st_size
        before += size_before
        after += size_after
        outputs.append(dst)
        print(f"  {src.name:40s} {size_before/1e6:6.2f} MB -> {size_after/1e6:5.2f} MB  ({im.width}x{im.height})")

    print(f"\n{len(outputs)} photos, {before/1e6:.1f} MB -> {after/1e6:.1f} MB total")
    print("\nPaste this into the event in events.js:\n")
    print("    photos: [")
    for p in outputs:
        print(f'      "{p.as_posix()}",')
    print("    ],")


if __name__ == "__main__":
    main()
