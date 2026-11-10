import asyncio
import pprint
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        # Start at contacts
        await page.goto('http://localhost:5173/contacts', timeout=20000, wait_until='domcontentloaded')
        await page.wait_for_timeout(1000)

        # Open menu
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(500)

        # Click Services
        await page.click('button:has-text("Services")')

        # Capture every 300ms for 3 seconds
        for i in range(10):
            await page.wait_for_timeout(300)
            await page.screenshot(path=f'audit/cross_nav_{i}.png')
            track_state = await page.evaluate("""() => {
                const track = document.querySelector('#services [data-cursor="drag"]');
                if (!track) return 'no track';
                const firstChild = track.children[0];
                return {
                    scrollY: Math.round(window.scrollY),
                    first_left: firstChild ? firstChild.style.left : null,
                    first_width: firstChild ? firstChild.style.width : null,
                    first_rect: firstChild ? {
                        x: Math.round(firstChild.getBoundingClientRect().x),
                        y: Math.round(firstChild.getBoundingClientRect().y),
                        w: Math.round(firstChild.getBoundingClientRect().width),
                        h: Math.round(firstChild.getBoundingClientRect().height)
                    } : null,
                    img_src: firstChild?.querySelector('img')?.src,
                    img_naturalWidth: firstChild?.querySelector('img')?.naturalWidth,
                    img_complete: firstChild?.querySelector('img')?.complete
                };
            }""")
            print(f'step {i}:', track_state)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())

