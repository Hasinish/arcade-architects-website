import asyncio
import pprint
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        # Match user viewport 1024x768
        page = await browser.new_page(viewport={'width': 1024, 'height': 768})
        await page.goto('http://localhost:5173', timeout=20000, wait_until='domcontentloaded')
        await page.wait_for_timeout(2000)

        # Open menu
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(800)
        # Click Services
        await page.click('button:has-text("Services")')
        await page.wait_for_timeout(2500)

        await page.screenshot(path='audit/services_1024_after_nav.png')

        slides_info = await page.evaluate("""() => {
            const track = document.querySelector('#services [data-cursor="drag"]');
            if (!track) return 'no track';
            const rect = track.getBoundingClientRect();
            const children = Array.from(track.children).map((c, i) => {
                const cRect = c.getBoundingClientRect();
                return {
                    index: i,
                    leftStyle: c.style.left,
                    widthStyle: c.style.width,
                    renderedRect: {
                        x: Math.round(cRect.x),
                        y: Math.round(cRect.y),
                        width: Math.round(cRect.width),
                        height: Math.round(cRect.height)
                    },
                    imgNaturalWidth: c.querySelector('img')?.naturalWidth,
                    imgNaturalHeight: c.querySelector('img')?.naturalHeight
                };
            });
            return {
                window_inner: { w: window.innerWidth, h: window.innerHeight },
                trackRect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
                children
            };
        }""")
        pprint.pprint(slides_info)
        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())

