import asyncio
import os
from playwright.async_api import async_playwright
from PIL import Image

async def capture_sandbox():
    os.makedirs('audit/sandbox', exist_ok=True)
    os.makedirs(r'C:\Users\Hasin\.gemini\antigravity\brain\4bb7da72-16c6-4b32-85de-0824002c2d7b', exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})

        # --- Capture Option 1: Obsidian Gallery ---
        page = await context.new_page()
        await page.goto("http://localhost:5173/menu-sandbox", timeout=20000, wait_until="domcontentloaded")
        await page.wait_for_timeout(1000)
        # Click Option 1 card to open it directly!
        await page.click('h3:has-text("Option 1: Obsidian Gallery")')
        await page.wait_for_timeout(1000)
        await page.hover('text=Portfolio')
        await page.wait_for_timeout(1000)
        await page.screenshot(path="audit/sandbox/01_option1_obsidian_gallery.png")
        print("Saved 01_option1_obsidian_gallery.png")
        await page.close()

        # --- Capture Option 2: 50/50 Dual-Pane Split ---
        page = await context.new_page()
        await page.goto("http://localhost:5173/menu-sandbox", timeout=20000, wait_until="domcontentloaded")
        await page.wait_for_timeout(1000)
        await page.click('h3:has-text("Option 2: 50/50 Dual-Pane")')
        await page.wait_for_timeout(1000)
        await page.click('button:has-text("03 Services")')
        await page.wait_for_timeout(800)
        await page.screenshot(path="audit/sandbox/02_option2_split_pane.png")
        print("Saved 02_option2_split_pane.png")
        await page.close()

        # --- Capture Option 3: Brutalist 4-Col Grid ---
        page = await context.new_page()
        await page.goto("http://localhost:5173/menu-sandbox", timeout=20000, wait_until="domcontentloaded")
        await page.wait_for_timeout(1000)
        await page.click('h3:has-text("Option 3: Brutalist 4-Col Grid")')
        await page.wait_for_timeout(1000)
        await page.screenshot(path="audit/sandbox/03_option3_brutalist_grid.png")
        print("Saved 03_option3_brutalist_grid.png")
        await page.close()

        # --- Capture Option 4: Floating Island Dock ---
        page = await context.new_page()
        await page.goto("http://localhost:5173/menu-sandbox", timeout=20000, wait_until="domcontentloaded")
        await page.wait_for_timeout(1000)
        await page.click('h3:has-text("Option 4: Floating Island Dock")')
        await page.wait_for_timeout(1000)
        await page.screenshot(path="audit/sandbox/04_option4_floating_island.png")
        print("Saved 04_option4_floating_island.png")
        await page.close()

        await browser.close()

    print("Generating collage...")
    im1 = Image.open("audit/sandbox/01_option1_obsidian_gallery.png")
    im2 = Image.open("audit/sandbox/02_option2_split_pane.png")
    im3 = Image.open("audit/sandbox/03_option3_brutalist_grid.png")
    im4 = Image.open("audit/sandbox/04_option4_floating_island.png")

    w, h = 960, 600
    r1 = im1.resize((w, h), Image.Resampling.LANCZOS)
    r2 = im2.resize((w, h), Image.Resampling.LANCZOS)
    r3 = im3.resize((w, h), Image.Resampling.LANCZOS)
    r4 = im4.resize((w, h), Image.Resampling.LANCZOS)

    collage = Image.new("RGB", (w * 2, h * 2), (18, 18, 18))
    collage.paste(r1, (0, 0))
    collage.paste(r2, (w, 0))
    collage.paste(r3, (0, h))
    collage.paste(r4, (w, h))

    collage_out = "audit/menu_4_options_collage.png"
    artifact_out = r"C:\Users\Hasin\.gemini\antigravity\brain\4bb7da72-16c6-4b32-85de-0824002c2d7b\menu_4_options_collage.png"
    collage.save(collage_out)
    collage.save(artifact_out)
    print(f"Collage saved to {collage_out} and {artifact_out}")

if __name__ == "__main__":
    asyncio.run(capture_sandbox())
