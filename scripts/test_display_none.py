import asyncio
from PIL import Image
from playwright.async_api import async_playwright

async def test_display_none():
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

        # Instead of removing, set display: none on the menu overlay
        await page.evaluate("""() => {
            const menu = document.querySelector('[data-lenis-prevent]');
            if (menu) menu.style.display = 'none';
        }""")
        await page.wait_for_timeout(200)

        # Now do the exact same mouse moves
        await page.mouse.move(1080, 450)
        await page.wait_for_timeout(300)

        await page.mouse.move(1080, 1296)
        await page.wait_for_timeout(300)

        await page.screenshot(path='audit/test_after_display_none.png')

        im = Image.open('audit/test_after_display_none.png')
        p = im.getpixel((1080, 450))
        print('Pixel at (1080, 450) after display:none:', p)

        count_22 = sum(1 for x in range(720, 1440, 10) for y in range(0, 900, 10) if im.getpixel((x, y))[:3] == (22, 22, 22))
        print('Count of (22, 22, 22) pixels in right half:', count_22)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_display_none())

