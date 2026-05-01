# /// script
# dependencies = ["pillow"]
# ///
"""Generate semua icon LENTERA dari satu source design.

Output:
  - public/icons/icon-192.png            (PWA, maskable safe-zone benar)
  - public/icons/icon-512.png            (PWA, maskable safe-zone benar)
  - public/icons/apple-touch-icon.png    (iOS Add-to-Home-Screen, 180x180)
  - public/icons/icon-source-1024.png    (sumber high-res, untuk regenerasi nanti)
  - src/app/favicon.ico                  (multi-size 16/32/48/64)

Konvensi maskable (W3C App Manifest spec):
  Safe-zone = lingkaran central berdiameter 80% dari sisi (10% margin keliling).
  Apa pun di luar safe-zone bisa terpotong di mask circle/squircle.

Cara pakai:
  uv run scripts/make_placeholder_icons.py
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ICONS_DIR = ROOT / "public" / "icons"
APP_DIR = ROOT / "src" / "app"
ICONS_DIR.mkdir(parents=True, exist_ok=True)
APP_DIR.mkdir(parents=True, exist_ok=True)

# LENTERA palette
BG = "#060c06"
SURFACE = "#0c140c"
BORDER = "#243824"
ACCENT = "#4ade80"

FONT_CANDIDATES = [
    "C:/Windows/Fonts/segoeuib.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/calibrib.ttf",
    "C:/Windows/Fonts/arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
]


def _load_font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def render_logo(size: int) -> Image.Image:
    """Bikin logo LENTERA satu canvas, semua elemen di dalam safe-zone 80%.

    Outer 10% canvas dibiarkan flat fill background biar aman buat maskable.
    """
    img = Image.new("RGBA", (size, size), BG)
    draw = ImageDraw.Draw(img)

    # Safe-zone disc (sisanya area outer 10% adalah safe margin maskable)
    margin = size // 10  # 10% dari sisi → safe-zone 80%
    safe_left = margin
    safe_right = size - margin
    draw.ellipse(
        [safe_left, safe_left, safe_right, safe_right],
        fill=SURFACE,
        outline=BORDER,
        width=max(2, size // 96),
    )

    # Inner accent ring (well within safe-zone)
    inner_pad = int(size * 0.18)
    draw.ellipse(
        [inner_pad, inner_pad, size - inner_pad, size - inner_pad],
        outline=ACCENT,
        width=max(2, size // 128),
    )

    # Letter "L" centered (di dalam safe-zone)
    text = "L"
    font_size = int(size * 0.42)
    font = _load_font(font_size)

    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text(
        ((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1] - size * 0.02),
        text,
        font=font,
        fill=ACCENT,
    )

    # Subtle glow di sekitar L
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.text(
        ((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1] - size * 0.02),
        text,
        font=font,
        fill=(74, 222, 128, 60),
    )
    glow = glow.filter(ImageFilter.GaussianBlur(radius=size // 64))
    img = Image.alpha_composite(img, glow)

    return img


def make_pwa_icons() -> None:
    # Render satu master 1024x1024 lalu downscale untuk kualitas terbaik
    master = render_logo(1024)
    master.save(ICONS_DIR / "icon-source-1024.png", "PNG", optimize=True)
    print(f"Wrote {ICONS_DIR / 'icon-source-1024.png'} (1024x1024 source)")

    for size in (192, 512):
        out = master.resize((size, size), Image.LANCZOS)
        path = ICONS_DIR / f"icon-{size}.png"
        out.save(path, "PNG", optimize=True)
        print(f"Wrote {path} ({size}x{size})")

    # Apple touch icon — 180x180, NOT maskable (Apple does its own rounded-rect
    # masking with ~22.5% radius and crops the OUTER ~7.5% of the icon).
    # Karena Apple tidak respect "purpose: maskable", subject sebaiknya pakai
    # full canvas dengan padding kecil di tepi. Kita re-render khusus.
    apple = render_logo(720).resize((180, 180), Image.LANCZOS)
    apple_path = ICONS_DIR / "apple-touch-icon.png"
    apple.save(apple_path, "PNG", optimize=True)
    print(f"Wrote {apple_path} (180x180, iOS)")


def make_favicon() -> None:
    # Render master 256 lalu pack multi-size .ico
    master = render_logo(256)
    favicon_path = APP_DIR / "favicon.ico"
    master.save(
        favicon_path,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
    )
    print(f"Wrote {favicon_path} (favicon multi-size)")


if __name__ == "__main__":
    make_pwa_icons()
    make_favicon()
    print("\nSelesai. Icons LENTERA siap.")
