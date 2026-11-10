import asyncio
import os
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw

async def verify_strokes():
    os.makedirs('audit/strokes', exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto("http://localhost:5173/", timeout=20000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        # Find #advantages
        adv_section = await page.query_selector('#advantages')
        if not adv_section:
            print("Advantages section not found!")
            return

        box = await adv_section.bounding_box()
        # Find window scroll position to reach the section
        # Let's get section offsetTop
        section_top = await page.evaluate("() => document.querySelector('#advantages').offsetTop")
        section_height = await page.evaluate("() => document.querySelector('#advantages').offsetHeight")
        window_height = 900
        runway = section_height - window_height
        print(f"Advantages section: top={section_top}, height={section_height}, runway={runway}")

        # Capture at progress ~0.15 (Item 1 drawing)
        target_01 = section_top + runway * 0.12
        await page.evaluate(f"window.scrollTo(0, {target_01})")
        await page.wait_for_timeout(400)
        # Capture left column
        left_col = await page.query_selector('#advantages .w-full.lg\\:w-1\\/2')
        if left_col:
            await left_col.screenshot(path='audit/strokes/stroke_01_drawing.png')
            print("Captured stroke 01 drawing!")

        # Capture at progress ~0.38 (Item 2 drawing)
        target_02 = section_top + runway * 0.38
        await page.evaluate(f"window.scrollTo(0, {target_02})")
        await page.wait_for_timeout(400)
        if left_col:
            await left_col.screenshot(path='audit/strokes/stroke_02_drawing.png')
            print("Captured stroke 02 drawing!")

        # Capture at progress ~0.65 (Item 3 drawing)
        target_03 = section_top + runway * 0.65
        await page.evaluate(f"window.scrollTo(0, {target_03})")
        await page.wait_for_timeout(400)
        if left_col:
            await left_col.screenshot(path='audit/strokes/stroke_03_drawing.png')
            print("Captured stroke 03 drawing!")

        # Capture at progress ~0.90 (Item 4 drawing)
        target_04 = section_top + runway * 0.90
        await page.evaluate(f"window.scrollTo(0, {target_04})")
        await page.wait_for_timeout(400)
        if left_col:
            await left_col.screenshot(path='audit/strokes/stroke_04_drawing.png')
            print("Captured stroke 04 drawing!")

        # Also capture full viewport at stroke 02
        await page.evaluate(f"window.scrollTo(0, {target_02})")
        await page.wait_for_timeout(400)
        await page.screenshot(path='audit/strokes/full_viewport_stroke.png')

        await browser.close()

def build_collage():
    images = [
        ('1. Scroll Progress: Item 01 Stroke Drawing', 'audit/strokes/stroke_01_drawing.png'),
        ('2. Scroll Progress: Item 02 Stroke Drawing (01 Completed)', 'audit/strokes/stroke_02_drawing.png'),
        ('3. Scroll Progress: Item 03 Stroke Drawing (01 & 02 Completed)', 'audit/strokes/stroke_03_drawing.png'),
        ('4. Scroll Progress: Item 04 Stroke Drawing (01, 02 & 03 Completed)', 'audit/strokes/stroke_04_drawing.png'),
    ]

    tile_w = 480
    tile_h = 340
    header_h = 36
    cols = 2
    rows = 2
    total_w = cols * tile_w + 30
    total_h = rows * (tile_h + header_h) + 40

    collage = Image.new('RGB', (total_w, total_h), (20, 20, 20))
    draw = ImageDraw.Draw(collage)
    draw.text((20, 12), "ARCADE ARCHITECTS — WHY WORK WITH US ANIMATED STROKE PROGRESSION", fill=(255, 255, 255))

    coords = [
        (10, 40),
        (tile_w + 20, 40),
        (10, 40 + tile_h + header_h + 10),
        (tile_w + 20, 40 + tile_h + header_h + 10),
    ]

    for idx, (label, path) in enumerate(images):
        if not os.path.exists(path):
            continue
        im = Image.open(path).convert('RGB')
        im = im.resize((tile_w, tile_h), Image.Resampling.LANCZOS)
        x, y = coords[idx]
        draw.text((x + 8, y + 8), label, fill=(220, 220, 220))
        collage.paste(im, (x, y + header_h))

    artifact_path = r'C:\Users\Hasin\.gemini\antigravity\brain\4bb7da72-16c6-4b32-85de-0824002c2d7b\animated_stroke_progression.png'
    collage.save(artifact_path)
    print(f"Saved {artifact_path}")

if __name__ == '__main__':
    asyncio.run(verify_strokes())
    build_collage()

