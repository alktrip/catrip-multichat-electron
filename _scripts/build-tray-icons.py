#!/usr/bin/env python3
"""Genera iconos de bandeja: verde WhatsApp y variante blanca (fondo transparente) para GNOME."""
from __future__ import annotations

import base64
import io
import os
import re
import struct
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SVG_PATH = os.path.join(ROOT, "assets", "icons", "org.k3p.catrip-multichat.svg")
OUT_DIR = os.path.join(ROOT, "assets", "icons")
HICOLOR = os.path.join(OUT_DIR, "hicolor")

WA = (37, 211, 102)
WA_DARK = (18, 128, 87)
WA_LIGHT = (210, 248, 225)

TRAY_SIZES = (22, 24, 32)
HICOLOR_SIZES = (16, 24, 32, 48, 64, 128, 256)


def load_logo_rgba() -> list[list[tuple[int, int, int, int]]]:
    try:
        from PIL import Image  # type: ignore
    except ImportError as e:
        raise SystemExit("Pillow (python3-pil) requerido para iconos de bandeja") from e

    raw = open(SVG_PATH, encoding="utf-8").read()
    m = re.search(r"data:image/png;base64,([A-Za-z0-9+/=]+)", raw)
    if not m:
        raise SystemExit(f"Sin PNG embebido en {SVG_PATH}")
    im = Image.open(io.BytesIO(base64.b64decode(m.group(1)))).convert("RGBA")
    w, h = im.size
    px = im.load()
    rows: list[list[tuple[int, int, int, int]]] = []
    for y in range(h):
        row = []
        for x in range(w):
            row.append(px[x, y])  # type: ignore[index]
        rows.append(row)
    return rows


def recolor_pixel(r: int, g: int, b: int, a: int) -> tuple[int, int, int, int]:
    if a < 16:
        return (0, 0, 0, 0)
    if r > 215 and g > 215 and b > 190:
        return (r, g, b, a)
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    if lum > 200:
        return (*WA_LIGHT, a)
    if lum > 90:
        return (*WA, a)
    return (*WA_DARK, a)


def resize_nearest(
    src: list[list[tuple[int, int, int, int]]],
    size: int,
    map_pixel,
) -> list[list[tuple[int, int, int, int]]]:
    sh, sw = len(src), len(src[0])
    out: list[list[tuple[int, int, int, int]]] = []
    for y in range(size):
        row = []
        sy = min(sh - 1, int(y * sh / size))
        for x in range(size):
            sx = min(sw - 1, int(x * sw / size))
            r, g, b, a = src[sy][sx]
            row.append(map_pixel(r, g, b, a))
        out.append(row)
    return out


def green_tray_to_white(r: int, g: int, b: int, a: int) -> tuple[int, int, int, int]:
    """A partir del icono verde: verdes -> blanco, blancos/mint -> transparente."""
    if a < 16:
        return (0, 0, 0, 0)
    # Áreas claras del PNG verde (WA_LIGHT / crema del logo).
    if r > 200 and g > 230 and b > 200:
        return (0, 0, 0, 0)
    if r > 215 and g > 215 and b > 190:
        return (0, 0, 0, 0)
    # Tonos verdes -> blanco (conserva alpha para bordes suaves).
    return (255, 255, 255, a)


def write_png(path: str, pixels: list[list[tuple[int, int, int, int]]]) -> None:
    h = len(pixels)
    w = len(pixels[0])
    raw = bytearray()
    for row in pixels:
        raw.append(0)
        for r, g, b, a in row:
            raw.extend((r, g, b, a))

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    ihdr = struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw), 9)
    png = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(png)


def write_index_theme() -> None:
    dirs = ",".join(f"{s}x{s}/apps" for s in HICOLOR_SIZES)
    lines = [
        "[Icon Theme]",
        "Name=Catrip Connect Tray",
        "Comment=Iconos de bandeja Catrip Connect",
        "Hidden=true",
        f"Directories={dirs}",
        "",
    ]
    for s in HICOLOR_SIZES:
        lines.extend(
            [
                f"[{s}x{s}/apps]",
                f"Size={s}",
                "Context=Applications",
                "Type=Threshold",
                "",
            ]
        )
    with open(os.path.join(HICOLOR, "index.theme"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def main() -> None:
    logo = load_logo_rgba()
    for size in TRAY_SIZES:
        px_green = resize_nearest(logo, size, recolor_pixel)
        write_png(os.path.join(OUT_DIR, f"tray-{size}.png"), px_green)
        print(f"Wrote assets/icons/tray-{size}.png")

        px_white = [
            [green_tray_to_white(*px_green[y][x]) for x in range(size)] for y in range(size)
        ]
        write_png(os.path.join(OUT_DIR, f"tray-white-{size}.png"), px_white)
        print(f"Wrote assets/icons/tray-white-{size}.png")

    for size in HICOLOR_SIZES:
        px = resize_nearest(logo, size, recolor_pixel)
        dest = os.path.join(HICOLOR, f"{size}x{size}", "apps", "catrip-tray.png")
        write_png(dest, px)
        print(f"Wrote assets/icons/hicolor/{size}x{size}/apps/catrip-tray.png")

    write_index_theme()
    print("Wrote assets/icons/hicolor/index.theme")


if __name__ == "__main__":
    main()
