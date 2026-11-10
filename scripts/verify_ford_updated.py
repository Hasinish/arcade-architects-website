import asyncio
from playwright.async_api import async_playwright

async def verify_ford():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1600, 'height': 900})
        await page.goto('http://localhost:5173/', wait_until='networkidle')
        await page.wait_for_timeout(1000)

        # Scroll to portfolio row 1 (where Ford is)
        await page.evaluate("window.scrollTo(0, 1400)")
        await page.wait_for_timeout(500)

        # Click Ford project card to open modal
        print("Clicking Ford project card to open modal...")
        await page.click('section#portfolio .group:has-text("Ford Motor")')
        await page.wait_for_timeout(600)

        # Capture screenshot of the modal with the new Ford image
        await page.screenshot(path="audit/comparisons/ford_updated_modal.png")
        print("Screenshot saved to audit/comparisons/ford_updated_modal.png")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(verify_ford())
