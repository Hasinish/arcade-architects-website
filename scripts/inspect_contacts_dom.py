import asyncio
from playwright.async_api import async_playwright

async def inspect():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto("http://localhost:5173/contacts", timeout=20000, wait_until="networkidle")
        await page.wait_for_timeout(2000)

        # Check all elements overlapping the right column (x > 720)
        data = await page.evaluate("""() => {
            const els = document.elementsFromPoint(1000, 450);
            return els.map(e => ({
                tag: e.tagName,
                className: e.className,
                id: e.id,
                rect: e.getBoundingClientRect(),
                bg: window.getComputedStyle(e).backgroundColor,
                opacity: window.getComputedStyle(e).opacity,
                zIndex: window.getComputedStyle(e).zIndex
            }));
        }""")
        print("Elements at (1000, 450):", data)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(inspect())
