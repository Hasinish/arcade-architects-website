import os
from PIL import Image, ImageDraw, ImageFont

def make_transition_filmstrip():
    frames = [
        ('Frame 0: Pre-Click', 'audit/frames/transition/frame_00_pre_click.png'),
        ('Frame 1: Curtain Rising', 'audit/frames/transition/frame_01_curtain_covering.png'),
        ('Frame 2: Fully Covered (0 Scroll Jump)', 'audit/frames/transition/frame_02_curtain_full_cover.png'),
        ('Frame 3: Curtain Revealing', 'audit/frames/transition/frame_03_curtain_revealing.png'),
        ('Frame 4: Settled at Top (Scroll=0)', 'audit/frames/transition/frame_04_settled_contacts.png'),
    ]

    target_w = 400
    target_h = 250
    header_h = 40

    total_w = target_w * len(frames) + 20 * (len(frames) + 1)
    total_h = target_h + header_h + 30

    collage = Image.new('RGB', (total_w, total_h), color=(26, 26, 26))
    draw = ImageDraw.Draw(collage)

    for idx, (label, path) in enumerate(frames):
        if os.path.exists(path):
            img = Image.open(path).convert('RGB')
            img = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
            x = 20 + idx * (target_w + 20)
            y = 20 + header_h
            collage.paste(img, (x, y))
            draw.text((x + 10, 25), label, fill=(240, 240, 240))

    collage.save('audit/comparisons/transition_filmstrip.png')
    print("Saved audit/comparisons/transition_filmstrip.png")

def make_side_by_side(img1_path, img2_path, label1, label2, output_path, max_w=720):
    if not os.path.exists(img1_path) or not os.path.exists(img2_path):
        print(f"Missing images: {img1_path} or {img2_path}")
        return

    im1 = Image.open(img1_path).convert('RGB')
    im2 = Image.open(img2_path).convert('RGB')

    # Scale both to same width
    h1 = int(im1.height * (max_w / im1.width))
    h2 = int(im2.height * (max_w / im2.width))

    target_h = max(h1, h2)
    # Resize keeping aspect
    im1_scaled = im1.resize((max_w, h1), Image.Resampling.LANCZOS)
    im2_scaled = im2.resize((max_w, h2), Image.Resampling.LANCZOS)

    header_h = 50
    collage = Image.new('RGB', (max_w * 2 + 30, target_h + header_h + 20), color=(24, 24, 24))
    draw = ImageDraw.Draw(collage)

    # Headers
    draw.text((20, 15), label1, fill=(255, 255, 255))
    draw.text((max_w + 30, 15), label2, fill=(255, 255, 255))

    collage.paste(im1_scaled, (10, header_h))
    collage.paste(im2_scaled, (max_w + 20, header_h))

    collage.save(output_path)
    print(f"Saved {output_path}")

if __name__ == '__main__':
    make_transition_filmstrip()
    
    # Desktop Viewport Comparison
    make_side_by_side(
        'audit/comparisons/bloom_contacts_desktop_viewport.png',
        'audit/comparisons/arcade_contacts_desktop_viewport.png',
        'REFERENCE: Bloom3D Contacts (1440x900)',
        'ARCADE ARCHITECTS: Redesigned Contacts (1440x900)',
        'audit/comparisons/contacts_desktop_viewport_comparison.png',
        max_w=720
    )

    # Mobile Full Page Comparison
    make_side_by_side(
        'audit/comparisons/bloom_contacts_mobile_full.png',
        'audit/comparisons/arcade_contacts_mobile_full.png',
        'REFERENCE: Bloom3D Mobile Full Page (390px)',
        'ARCADE ARCHITECTS: Redesigned Mobile Full Page (390px)',
        'audit/comparisons/contacts_mobile_comparison.png',
        max_w=390
    )

