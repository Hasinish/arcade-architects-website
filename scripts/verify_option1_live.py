import asyncio
import os
from playwright.async_api import async_playwright
from PIL import Image

async def verify_option1():
    os.makedirs('audit/live_nav', exist_ok=True)
    os.makedirs(r'C:\Users\Hasin\.gemini\antigravity\brain\4bb7da72-16c6-4b32-85de-0824002c2d7b', exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)

        # 1. Desktop 1440x900
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto("http://localhost:5173", timeout=20000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        # Screenshot closed header with morphing '=' button over hero
        await page.screenshot(path="audit/live_nav/01_desktop_closed_equal.png", clip={'x': 0, 'y': 0, 'width': 1440, 'height': 160})
        print("Saved 01_desktop_closed_equal.png")

        # Click the '=' button to morph into 'X' and open Fullscreen Obsidian Overlay
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(1000)

        # Screenshot opened state with white bottom strokes and zero green
        await page.screenshot(path="audit/live_nav/02_desktop_open_strokes.png")
        print("Saved 02_desktop_open_strokes.png")

        # Hover on Services to verify render swap & focus dimming
        await page.hover('button:has-text("Services")')
        await page.wait_for_timeout(1000)
        await page.screenshot(path="audit/live_nav/03_desktop_hover_services.png")
        print("Saved 03_desktop_hover_services.png")

        await page.close()

        # 2. Mobile 390x844
        page_mob = await browser.new_page(viewport={'width': 390, 'height': 844})
        await page_mob.goto("http://localhost:5173", timeout=20000, wait_until="domcontentloaded")
        await page_mob.wait_for_timeout(1500)

        # Open on mobile
        await page_mob.click('button[aria-label="Open Navigation Menu"]')
        await page_mob.wait_for_timeout(1000)
        await page_mob.screenshot(path="audit/live_nav/04_mobile_open_strokes.png")
        print("Saved 04_mobile_open_strokes.png")

        await browser.close()

    print("Generating visual audit collage...")
    im1 = Image.open("audit/live_nav/02_desktop_open_strokes.png")
    im2 = Image.open("audit/live_nav/03_desktop_hover_services.png")
    im3 = Image.open("audit/live_nav/04_mobile_open_strokes.png")

    # Resize desktop to 960x600, mobile to 300x600
    r1 = im1.resize((960, 600), Image.Resampling.LANCZOS)
    r2 = im2.resize((960, 600), Image.Resampling.LANCZOS)
    r3 = im3.resize((300, 600), Image.Resampling.LANCZOS)

    w = 960 + 300
    h = 600 * 2
    collage = Image.new("RGB", (w, h), (10, 10, 10))
    collage.paste(r1, (0, 0))
    collage.paste(r3, (960, 0))
    collage.paste(r2, (0, 600))

    collage_out = "audit/option1_live_audit.png"
    artifact_out = r"C:\Users\Hasin\.gemini\antigravity\brain\4bb7da72-16c6-4b32-85de-0824002c2d7b\option1_live_audit.png"
    collage.save(collage_out)
    collage.save(artifact_out)
    print(f"Collage saved to {collage_out} and {artifact_out}")

if __name__ == "__main__":
    asyncio.run(verify_option1())
