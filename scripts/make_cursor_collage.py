import os
from PIL import Image, ImageDraw

def make_cursor_collage():
    images = [
        ('1. Default Cursor (Zero Lag)', 'audit/frames/cursor/cursor_01_default.png'),
        ('2. "VIEW" Pill Over Project Cards', 'audit/frames/cursor/cursor_02_view_badge.png'),
        ('3. "↔ DRAG" Pill Over Services Gallery', 'audit/frames/cursor/cursor_04_drag_badge.png'),
        ('4. Project Card Curtain Transition', 'audit/frames/cursor/project_card_curtain_covering.png'),
    ]

    target_w = 480
    target_h = 300
    header_h = 40

    total_w = target_w * 2 + 30
    total_h = (target_h + header_h) * 2 + 30

    collage = Image.new('RGB', (total_w, total_h), color=(24, 24, 24))
    draw = ImageDraw.Draw(collage)

    coords = [
        (10, 10),
        (target_w + 20, 10),
        (10, target_h + header_h + 20),
        (target_w + 20, target_h + header_h + 20),
    ]

    for idx, (label, path) in enumerate(images):
        if os.path.exists(path):
            img = Image.open(path).convert('RGB')
            img = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
            x, y = coords[idx]
            draw.text((x + 10, y + 10), label, fill=(240, 240, 240))
            collage.paste(img, (x, y + header_h))

    collage.save('audit/comparisons/cursor_and_curtain_collage.png')
    print("Saved audit/comparisons/cursor_and_curtain_collage.png")

if __name__ == '__main__':
    make_cursor_collage()

