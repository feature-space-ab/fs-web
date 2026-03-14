#!/usr/bin/env python3
"""Generate a Feature Space logo loading animation (GIF + APNG)."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ICON_PATH = ROOT / "fs-assets" / "img" / "logo" / "icon" / "icon_colour.png"
OUT_DIR = ROOT / "fs-assets" / "anim"

SIZE = 256
FRAMES = 48
DURATION_MS = 45


def load_icon(path: Path) -> Image.Image:
    icon = Image.open(path).convert("RGBA")
    alpha = icon.getchannel("A")
    bbox = alpha.getbbox()
    if bbox:
        icon = icon.crop(bbox)
    return icon


def make_frame(icon: Image.Image, frame_idx: int) -> Image.Image:
    t = frame_idx / FRAMES
    angle = 360 * t
    pulse = 1.0 + 0.06 * math.sin(2 * math.pi * t)

    frame = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))

    # Soft glow layer
    glow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_alpha = int(40 + 35 * (0.5 + 0.5 * math.sin(2 * math.pi * t)))
    glow_draw.ellipse((44, 44, SIZE - 44, SIZE - 44), fill=(135, 164, 234, glow_alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(12))
    frame.alpha_composite(glow)

    draw = ImageDraw.Draw(frame)

    # Outer loader arc
    draw.arc(
        (20, 20, SIZE - 20, SIZE - 20),
        start=angle,
        end=angle + 240,
        fill=(177, 198, 240, 235),
        width=12,
    )

    # Inner loader arc (counter rotation)
    draw.arc(
        (40, 40, SIZE - 40, SIZE - 40),
        start=-angle * 1.2,
        end=-angle * 1.2 + 170,
        fill=(117, 145, 214, 210),
        width=8,
    )

    # Slightly pulsing icon
    icon_size = int(108 * pulse)
    icon_img = icon.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
    icon_x = (SIZE - icon_size) // 2
    icon_y = (SIZE - icon_size) // 2
    frame.alpha_composite(icon_img, (icon_x, icon_y))

    return frame


def save_outputs(frames: list[Image.Image]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    gif_path = OUT_DIR / "feature-space-loader.gif"
    apng_path = OUT_DIR / "feature-space-loader.apng"
    png_path = OUT_DIR / "feature-space-loader.png"

    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=DURATION_MS,
        loop=0,
        disposal=2,
        optimize=False,
    )

    frames[0].save(
        apng_path,
        save_all=True,
        append_images=frames[1:],
        duration=DURATION_MS,
        loop=0,
        disposal=2,
        optimize=False,
        format="PNG",
    )

    # Same animation as APNG but saved with .png extension for easier app asset handling.
    frames[0].save(
        png_path,
        save_all=True,
        append_images=frames[1:],
        duration=DURATION_MS,
        loop=0,
        disposal=2,
        optimize=False,
        format="PNG",
    )

    print(f"Wrote: {gif_path}")
    print(f"Wrote: {apng_path}")
    print(f"Wrote: {png_path}")


def main() -> None:
    icon = load_icon(ICON_PATH)
    frames = [make_frame(icon, i) for i in range(FRAMES)]
    save_outputs(frames)


if __name__ == "__main__":
    main()
