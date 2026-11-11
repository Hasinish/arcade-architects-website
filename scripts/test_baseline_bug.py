import asyncio
from PIL import Image
from playwright.async_api import async_playwright

async def test_baseline_bug():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        await page.goto('http://localhost:5173/', wait_until='domcontentloaded')
        await page.wait_for_timeout(1000)

        # Open menu
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(500)

        # Click Contacts
        await page.click('button:has-text("Contacts")')
        await page.wait_for_timeout(2000)

        # DO NOT touch menu overlay (baseline bug)
        # Move mouse
        await page.mouse.move(1080, 450)
        await page.wait_for_timeout(300)

        await page.mouse.move(1080, 1296)
        await page.wait_for_timeout(300)

        await page.screenshot(path='audit/test_baseline_bug.png')

        im = Image.open('audit/test_baseline_bug.png')
        p = im.getpixel((1080, 450))
        print('Baseline pixel at (1080, 450):', p)

        count_22 = sum(1 for x in range(720, 1440, 10) for y in range(0, 900, 10) if im.getpixel((x, y))[:3] == (22, 22, 22))
        print('Baseline count of (22, 22, 22) pixels in right half:', count_22)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_baseline_bug())

