import asyncio
import os
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw, ImageFont

async def create_audit_collage():
    os.makedirs('audit/frames/navbar', exist_ok=True)
    os.makedirs('audit/comparisons', exist_ok=True)

    test_points = [
        {"y": 0, "title": "Hero Video (Dark BG -> White Nav)", "fname": "nav_01_hero.png"},
        {"y": 950, "title": "Portfolio Header (Light Stone #F7F7F7 -> Dark Nav)", "fname": "nav_02_portfolio_header.png"},
        {"y": 1500, "title": "Independent Adaptation: Logo over Bright Facade (Dark) vs Burger over Shadow (White)", "fname": "nav_03_asymmetric_image.png"},
        {"y": 4500, "title": "Snøhetta Services Canvas (Black #000000 -> White Nav)", "fname": "nav_04_snohetta_black.png"},
        {"y": 4800, "title": "Independent Adaptation: Logo over Black (White) vs Burger over Light Slide (Dark)", "fname": "nav_05_services_asymmetric.png"},
        {"y": 6000, "title": "About Manifesto (Light Stone #F7F7F7 -> Dark Nav)", "fname": "nav_06_about_stone.png"},
        {"y": 9500, "title": "CTA Fullscreen Showreel (Dark Video -> White Nav)", "fname": "nav_07_cta_video.png"},
        {"y": 10300, "title": "FAQ Section (Light Stone #F7F7F7 -> Dark Nav)", "fname": "nav_08_faq_stone.png"}
    ]

    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1600, 'height': 900})
        await page.goto('http://localhost:5173/', wait_until='networkidle')
        await page.wait_for_timeout(1000)

        captured_images = []

        for pt in test_points:
            await page.evaluate(f"window.scrollTo(0, {pt['y']})")
            await page.wait_for_timeout(400)
            
            # Screenshot of top 110px of viewport
            save_path = f"audit/frames/navbar/{pt['fname']}"
            await page.screenshot(path=save_path, clip={"x": 0, "y": 0, "width": 1600, "height": 110})
            
            state_data = await page.evaluate('''() => {
                const logo = document.querySelector('header a');
                const burger = document.querySelector('header button span');
                return {
                    logoColor: logo ? window.getComputedStyle(logo).color : '',
                    burgerBg: burger ? window.getComputedStyle(burger).backgroundColor : ''
                };
            }''')

            captured_images.append({
                "path": save_path,
                "title": pt["title"],
                "y": pt["y"],
                "logo": "WHITE" if "255, 255, 255" in state_data['logoColor'] else "DARK",
                "burger": "WHITE" if "255, 255, 255" in state_data['burgerBg'] else "DARK"
            })

        await browser.close()

    # Now composite collage
    card_w = 1600
    card_h = 110
    label_h = 42
    total_h = len(captured_images) * (card_h + label_h + 16) + 60
    
    collage = Image.new("RGB", (card_w, total_h), "#111111")
    draw = ImageDraw.Draw(collage)

    # Title Banner
    draw.rectangle([0, 0, card_w, 50], fill="#1A1A1A")
    draw.text((32, 16), "ARCADE ARCHITECTS — REAL-TIME PIXEL SAMPLING NAVBAR AUDIT", fill="#FFFFFF")

    y_offset = 65
    for item in captured_images:
        # Draw label
        tag = f"Scroll Y: {item['y']}px | {item['title']} | [Logo: {item['logo']} | Hamburger: {item['burger']}]"
        draw.rectangle([0, y_offset, card_w, y_offset + label_h], fill="#1F1F1F")
        draw.text((32, y_offset + 12), tag, fill="#E0E0E0")
        y_offset += label_h

        # Paste navbar crop
        crop = Image.open(item["path"])
        collage.paste(crop, (0, y_offset))
        y_offset += card_h + 16

    collage_path = "audit/comparisons/navbar_pixel_calculation_audit.png"
    collage.save(collage_path)
    print(f"Collage saved successfully to {collage_path}!")

if __name__ == '__main__':
    asyncio.run(create_audit_collage())

