import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        page.on('console', lambda m: print(f"[CONSOLE] {m.text}"))

        print("1. Goto /contacts")
        await page.goto('http://localhost:5173/contacts')
        await page.wait_for_timeout(1000)

        print("2. Click Logo...")
        await page.click('a:has-text("ARCADE ARCHITECTS")')
        await page.wait_for_timeout(1500)

        # Check console during wheel scroll
        print("3. Scrolling down towards #advantages...")
        for i in range(45):
            await page.mouse.wheel(0, 200)
            await page.wait_for_timeout(60)

        await page.wait_for_timeout(1000)
        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
