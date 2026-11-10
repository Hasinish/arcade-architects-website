import asyncio
from PIL import Image
from playwright.async_api import async_playwright

async def verify_services_nav():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)

        for w, h, label in [(1440, 900, 'desktop_1440'), (1024, 768, 'tablet_1024')]:
            page = await browser.new_page(viewport={'width': w, 'height': h})
            await page.goto('http://localhost:5173', timeout=20000, wait_until='domcontentloaded')
            await page.wait_for_timeout(1000)

            # Open menu
            await page.click('button[aria-label="Open Navigation Menu"]')
            await page.wait_for_timeout(600)

            # Click Services
            await page.click('button:has-text("Services")')
            await page.wait_for_timeout(2000)

            # Capture Services Section screenshot
            sec = page.locator('#services')
            await sec.screenshot(path=f'audit/services_{label}_verified.png')

            # Inspect center pixel
            img = Image.open(f'audit/services_{label}_verified.png')
            track_y = int(img.size[1] * 0.45) # roughly middle of track
            center_pix = img.getpixel((img.size[0] // 2, track_y))
            print(f'[{label}] Center pixel at y={track_y}: {center_pix}')

            await page.close()

        await browser.close()

if __name__ == '__main__':
    asyncio.run(verify_services_nav())

