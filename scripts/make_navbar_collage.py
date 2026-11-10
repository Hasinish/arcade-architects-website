import os
from PIL import Image, ImageDraw, ImageFont

def make_collage():
    sections = [
        ("Hero (Dark Video)", "audit/frames/navbar/nav_hero.png", "WHITE / LIGHT"),
        ("Portfolio (Light Stone)", "audit/frames/navbar/nav_portfolio.png", "DARK / CHARCOAL"),
        ("Services (Snøhetta Black)", "audit/frames/navbar/nav_services.png", "WHITE / LIGHT"),
        ("About Studio (Light Stone)", "audit/frames/navbar/nav_about.png", "DARK / CHARCOAL"),
        ("Advantages (Light Stone)", "audit/frames/navbar/nav_advantages.png", "DARK / CHARCOAL"),
        ("CTA Section (Dark Showreel)", "audit/frames/navbar/nav_cta.png", "WHITE / LIGHT"),
        ("FAQ (Light Stone)", "audit/frames/navbar/nav_faq.png", "DARK / CHARCOAL"),
    ]

    images = []
    labels = []
    for title, path, mode in sections:
        if os.path.exists(path):
            im = Image.open(path)
            images.append(im)
            labels.append(f"{title} -> Navbar: {mode}")

    if not images:
        print("No images found!")
        return

    w = images[0].width
    row_h = images[0].height
    total_h = len(images) * (row_h + 30)

    collage = Image.new("RGB", (w, total_h), (24, 24, 24))
    draw = ImageDraw.Draw(collage)

    y_offset = 0
    for i, (im, label) in enumerate(zip(images, labels)):
        # Draw label banner
        draw.rectangle([0, y_offset, w, y_offset + 30], fill=(15, 15, 15))
        draw.text((20, y_offset + 8), label, fill=(230, 230, 230))
        y_offset += 30
        
        # Paste navbar image
        collage.paste(im, (0, y_offset))
        y_offset += row_h

    os.makedirs("audit/comparisons", exist_ok=True)
    collage.save("audit/comparisons/navbar_adaptive_comparison.png")
    print("Saved audit/comparisons/navbar_adaptive_comparison.png")

if __name__ == "__main__":
    make_collage()

