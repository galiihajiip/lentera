# /// script
# dependencies = ["pillow"]
# ///
"""Generate placeholder PWA icons for LENTERA.

Creates 192x192 and 512x512 PNGs with the LENTERA brand colors:
  - Background: #060c06 (lentera-bg)
  - Accent ring: #4ade80 (lentera-green)
  - Letter "L" in lentera-green
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ICONS_DIR = ROOT / "public" / "icons"
ICONS_DIR.mkdir(parents=True, exist_ok=True)

BG = "#060c06"
ACCENT = "#4ade80"
RING_BG = "#0c140c"
RING_BORDER = "#243824"

def make_icon(size: int, output_path: Path) -> None:
    img = Image.new("RGBA", (size, size), BG)
    draw = ImageDraw.Draw(img)

    # Inner safe-zone disc (maskable safe area is ~80% center)
    pad = size // 8
    draw.ellipse(
        [pad, pad, size - pad, size - pad],
        fill=RING_BG,
        outline=RING_BORDER,
        width=max(2, size // 64),
    )

    # Inner accent ring
    inner_pad = size // 6
    draw.ellipse(
        [inner_pad, inner_pad, size - inner_pad, size - inner_pad],
        outline=ACCENT,
        width=max(2, size // 96),
    )

    # Letter "L" centered
    text = "L"
    font_size = int(size * 0.45)
    font = None
    for candidate in (
        "C:/Windows/Fonts/segoeuib.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/arial.ttf",
    ):
        try:
            font = ImageFont.truetype(candidate, font_size)
            break
        except OSError:
            continue
    if font is None:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text(
        ((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1] - size * 0.02),
        text,
        font=font,
        fill=ACCENT,
    )

    img.save(output_path, "PNG", optimize=True)
    print(f"Wrote {output_path} ({size}x{size})")


if __name__ == "__main__":
    make_icon(192, ICONS_DIR / "icon-192.png")
    make_icon(512, ICONS_DIR / "icon-512.png")
