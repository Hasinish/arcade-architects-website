import os
from PIL import Image, ImageDraw

def main():
    crops = [
        ('1. Stone (#F7F7F7) Cursor (Crisp Black Core + Dual Ring)', 'audit/cursor_final/01_stone_default.png', (200, 200, 300, 300)),
        ('2. Dark Render Cursor (Crisp White Halo + Dual Ring)', 'audit/cursor_final/03_dark_image.png', (1000, 350, 1100, 450)),
        ('3. Project Card Hover: "VIEW" Pill', 'audit/cursor_final/badge_view_full.png', (240, 330, 480, 530)),
        ('4. Gallery Horizontal Drag: "↔ DRAG" Pill', 'audit/cursor_final/badge_drag_full.png', (180, 390, 420, 590)),
    ]

    tile_w = 440
    tile_h = 260
    header_h = 36
    cols = 2
    rows = 2
    total_w = cols * tile_w + 30
    total_h = rows * (tile_h + header_h) + 40

    collage = Image.new('RGB', (total_w, total_h), (14, 14, 14))
    draw = ImageDraw.Draw(collage)
    draw.text((20, 12), "ARCADE ARCHITECTS - ARCHITECTURAL DUAL-TONE CURSOR VERIFICATION", fill=(255, 255, 255))

    coords = [
        (10, 40),
        (tile_w + 20, 40),
        (10, 40 + tile_h + header_h + 10),
        (tile_w + 20, 40 + tile_h + header_h + 10),
    ]

    for idx, (label, path, crop_box) in enumerate(crops):
        if not os.path.exists(path):
            print(f"File not found: {path}")
            continue
        im = Image.open(path).convert('RGB')
        if crop_box:
            im = im.crop(crop_box).resize((tile_w, tile_h), Image.Resampling.LANCZOS)
        x, y = coords[idx]
        draw.text((x + 8, y + 8), label, fill=(210, 210, 210))
        collage.paste(im, (x, y + header_h))

    artifact_path = r'C:\Users\Hasin\.gemini\antigravity\brain\4bb7da72-16c6-4b32-85de-0824002c2d7b\cursor_contrast_verified.png'
    collage.save(artifact_path)
    print(f"Saved {artifact_path}")

if __name__ == '__main__':
    main()
