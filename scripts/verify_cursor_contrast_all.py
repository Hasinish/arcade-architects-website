import asyncio
import os
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont

async def verify_cursor():
    os.makedirs('audit/cursor_final', exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        # 1. Contacts Page Stone Background
        print("Visiting /contacts ...")
        await page.goto("http://localhost:5173/contacts", timeout=20000, wait_until="domcontentloaded")
        await page.wait_for_timeout(1500)

        # Move mouse on stone background
        await page.mouse.move(250, 250)
        await page.wait_for_timeout(300)
        await page.screenshot(path='audit/cursor_final/01_stone_default.png')

        # Hover over Send button (pointer state)
        btn = await page.query_selector('button[type="submit"]')
        if btn:
            box = await btn.bounding_box()
            if box:
                await page.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
                await page.wait_for_timeout(300)
                await page.screenshot(path='audit/cursor_final/02_stone_pointer.png')

        # Hover over dark architectural render on the right column
        await page.mouse.move(1050, 400)
        await page.wait_for_timeout(300)
        await page.screenshot(path='audit/cursor_final/03_dark_image.png')

        # 2. Home Page Project Card ("VIEW" pill)
        await page.goto("http://localhost:5173/", timeout=20000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        card = await page.query_selector('[data-cursor="view"]')
        if card:
            box = await card.bounding_box()
            if box:
                await page.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
                await page.wait_for_timeout(300)
                await page.screenshot(path='audit/cursor_final/04_view_pill.png')

        # 3. Services Gallery ("↔ DRAG" pill)
        drag_el = await page.query_selector('[data-cursor="drag"]')
        if drag_el:
            box = await drag_el.bounding_box()
            if box:
                await page.mouse.move(box['x'] + 200, box['y'] + box['height'] / 2)
                await page.wait_for_timeout(300)
                await page.screenshot(path='audit/cursor_final/05_drag_pill.png')

        await browser.close()
        print("Captured all cursor states!")

def make_collage():
    crops = [
        ('1. Stone (#F7F7F7) Default Dot + Ring', 'audit/cursor_final/01_stone_default.png', (200, 200, 300, 300)),
        ('2. Light Button Pointer State', 'audit/cursor_final/02_stone_pointer.png', None),
        ('3. Dark Surface High Contrast', 'audit/cursor_final/03_dark_image.png', (1000, 350, 1100, 450)),
        ('4. Project Card "VIEW" Badge', 'audit/cursor_final/04_view_pill.png', None),
        ('5. Gallery "↔ DRAG" Badge', 'audit/cursor_final/05_drag_pill.png', None),
    ]

    tile_w = 400
    tile_h = 240
    header_h = 36
    cols = 2
    rows = 3
    total_w = cols * tile_w + 30
    total_h = rows * (tile_h + header_h) + 40

    collage = Image.new('RGB', (total_w, total_h), (18, 18, 18))
    draw = ImageDraw.Draw(collage)

    # Put title
    draw.text((20, 12), "ARCADE ARCHITECTS - DUAL-TONE CURSOR CONTRAST AUDIT", fill=(255, 255, 255))

    coords = [
        (10, 40),
        (tile_w + 20, 40),
        (10, 40 + tile_h + header_h + 10),
        (tile_w + 20, 40 + tile_h + header_h + 10),
        (10, 40 + 2 * (tile_h + header_h) + 20),
    ]

    for idx, (label, path, crop_box) in enumerate(crops):
        if not os.path.exists(path):
            continue
        im = Image.open(path).convert('RGB')
        if crop_box:
            # Crop a 100x100 area and resize to tile
            im = im.crop(crop_box).resize((tile_w, tile_h), Image.Resampling.LANCZOS)
        else:
            # Center crop or resize
            w, h = im.size
            im = im.crop((w//4, h//4, 3*w//4, 3*h//4)).resize((tile_w, tile_h), Image.Resampling.LANCZOS)

        x, y = coords[idx]
        draw.text((x + 8, y + 8), label, fill=(230, 230, 230))
        collage.paste(im, (x, y + header_h))

    collage.save('audit/comparisons/cursor_contrast_verified.png')
    # Also save to artifact directory
    artifact_path = r'C:\Users\Hasin\.gemini\antigravity\brain\4bb7da72-16c6-4b32-85de-0824002c2d7b\cursor_contrast_verified.png'
    collage.save(artifact_path)
    print(f"Saved {artifact_path}")

if __name__ == '__main__':
    asyncio.run(verify_cursor())
    make_collage()

