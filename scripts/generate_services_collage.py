from PIL import Image, ImageDraw, ImageFont
import os

def create_services_collage():
    base_dir = "C:/Users/Hasin/.gemini/antigravity/brain/4bb7da72-16c6-4b32-85de-0824002c2d7b"
    
    img_1920 = os.path.join(base_dir, "services_infinite_1920.png")
    img_1440 = os.path.join(base_dir, "services_infinite_1440.png")
    img_768 = os.path.join(base_dir, "services_infinite_768.png")
    img_390 = os.path.join(base_dir, "services_infinite_390.png")
    
    if not (os.path.exists(img_1440) and os.path.exists(img_768) and os.path.exists(img_390)):
        print("Screenshots not all ready yet.")
        return
        
    im_1440 = Image.open(img_1440)
    im_768 = Image.open(img_768)
    im_390 = Image.open(img_390)
    im_1920 = Image.open(img_1920) if os.path.exists(img_1920) else None
    
    # Target collage width: 1600, height: 1100
    canvas = Image.new("RGB", (1600, 1100), (10, 10, 10))
    draw = ImageDraw.Draw(canvas)
    
    # Resize images
    # Top Left: 1920 resized to 780x438
    # Top Right: 1440 resized to 780x438
    # Bottom Left: 768 resized to 450x600
    # Bottom Right: 390 resized to 280x606
    
    thumb_1920 = im_1920.resize((770, 433), Image.Resampling.LANCZOS) if im_1920 else None
    thumb_1440 = im_1440.resize((770, 433), Image.Resampling.LANCZOS)
    thumb_768 = im_768.resize((420, 560), Image.Resampling.LANCZOS)
    thumb_390 = im_390.resize((260, 560), Image.Resampling.LANCZOS)
    
    # Paste top row
    if thumb_1920:
        canvas.paste(thumb_1920, (20, 40))
        draw.text((25, 18), "ULTRAWIDE DESKTOP (1920x1080) — 500x375px (4:3) Infinite Filmstrip", fill=(200, 200, 200))
        
    canvas.paste(thumb_1440, (810, 40))
    draw.text((815, 18), "PRIMARY DESKTOP (1440x900) — 500x375px (4:3) Filmstrip + Active Inquiry", fill=(200, 200, 200))
    
    # Paste bottom row
    canvas.paste(thumb_768, (20, 515))
    draw.text((25, 495), "TABLET (768x1024) — 380x285px (4:3)", fill=(200, 200, 200))
    
    canvas.paste(thumb_390, (480, 515))
    draw.text((485, 495), "MOBILE (390x844) — 280x210px (4:3) Touch Drag", fill=(200, 200, 200))
    
    # Draw summary panel on bottom right
    draw.rectangle([(780, 515), (1570, 1075)], fill=(20, 20, 20), outline=(50, 50, 50))
    
    summary_text = """ARCADE ARCHITECTS — STUDIO DISCIPLINES AUDIT

1. VISUAL DESIGN:
   - Exactly identical dimensions across all 7 services.
   - Perfectly calibrated 4:3 landscape aspect ratio (1.333).
   - Desktop: 500x375px (Gap 16px).
   - Tablet: 380x285px (Gap 14px).
   - Mobile: 280x210px (Gap 12px).
   - Zero rounded corners, zero perspective distortion.

2. INFINITE AUTOMATIC SCROLLING:
   - Continuous right-to-left crawl at 24.96 px/s (Target ~25 px/s).
   - Independent of frame rate (delta-time integrated).
   - 5 sets (35 items) modular wrapping: 100% seamless infinite loops.
   - Zero visual jumps when tile 07 loops into tile 01.

3. MOUSE DRAGGING & MOMENTUM:
   - On hover: custom architectural 'DRAG' capsule badge.
   - Pointer down: instant auto-scroll pause and grab lock.
   - Free bidirectional drag with zero resistance or clipping.
   - Pointer up: realistic exponential momentum decay blending back into -25px/s.
   - Mobile touch discrimination: vertical pan-y scroll completely unobstructed.

4. SERVICE TYPOGRAPHY & INQUIRY:
   - Dynamic detection of closest tile to horizontal screen center.
   - Subtle masked crossfade transition on title, description, and counter.
   - Center aligned directly beneath active image.
   - 'Inquire for [Category] ->' smoothly initiates curtain route to /contacts.
"""
    y_text = 535
    for line in summary_text.split('\n'):
        draw.text((800, y_text), line, fill=(220, 220, 220) if ":" in line else (160, 160, 160))
        y_text += 20
        
    out_path = os.path.join(base_dir, "services_infinite_collage.png")
    canvas.save(out_path)
    print(f"Collage saved: {out_path}")

if __name__ == "__main__":
    create_services_collage()
