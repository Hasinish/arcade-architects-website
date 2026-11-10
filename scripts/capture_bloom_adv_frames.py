import asyncio
from playwright.async_api import async_playwright
import os

async def capture_bloom_adv_frames():
    os.makedirs('audit/bloom_adv_frames', exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto('https://www.bloom3d.studio/', timeout=30000, wait_until='domcontentloaded')
        await page.wait_for_timeout(3000)

        # Scroll to advantages
        section = await page.query_selector('.section_advantages')
        if not section:
            print("No section_advantages found")
            return

        box = await section.bounding_box()
        start_y = 6760 # Approximate section top

        # Capture 6 frames as we scroll through
        scroll_offsets = [1500, 1700, 1900, 2100, 2300, 2500]
        for idx, off in enumerate(scroll_offsets):
            await page.evaluate(f'window.scrollTo(0, {start_y + off})')
            await page.wait_for_timeout(400)
            # Screenshot the left content (advantages_content)
            content = await page.query_selector('.advantages_content')
            if content:
                await content.screenshot(path=f'audit/bloom_adv_frames/frame_{idx}_{off}.png')
                print(f"Captured frame {idx} at scroll offset {off}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(capture_bloom_adv_frames())

