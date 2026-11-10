import asyncio
from playwright.async_api import async_playwright

async def debug_contacts():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto("http://localhost:5173/contacts", timeout=20000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        await page.screenshot(path="audit/contacts_debug_screenshot.png")
        print("Captured audit/contacts_debug_screenshot.png")

        # Let's inspect elements covering the photo or having black background
        elements = await page.evaluate("""() => {
            const results = [];
            document.querySelectorAll('*').forEach(el => {
                const style = window.getComputedStyle(el);
                const rect = el.getBoundingClientRect();
                const bg = style.backgroundColor;
                if ((bg.includes('rgb(0, 0, 0)') || bg.includes('rgb(10, 10, 10)') || bg.includes('rgb(17, 17, 17)') || bg.includes('rgb(22, 22, 22)')) && rect.width > 200 && rect.height > 200) {
                    results.push({
                        tag: el.tagName,
                        className: el.className,
                        id: el.id,
                        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
                        zIndex: style.zIndex,
                        position: style.position,
                        opacity: style.opacity,
                        display: style.display,
                        visibility: style.visibility
                    });
                }
            });
            return results;
        }""")
        print("Dark elements:", elements)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(debug_contacts())

