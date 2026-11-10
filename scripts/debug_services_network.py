import asyncio
import pprint
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        console_errors = []
        network_errors = []

        page.on('console', lambda msg: console_errors.append(f'[{msg.type}] {msg.text}') if msg.type in ['error', 'warning'] else None)
        page.on('requestfailed', lambda req: network_errors.append(f'{req.url} failed: {req.failure}'))
        page.on('response', lambda res: network_errors.append(f'{res.url} returned {res.status}') if res.status >= 400 else None)

        await page.goto('http://localhost:5173', timeout=20000, wait_until='domcontentloaded')
        await page.wait_for_timeout(1000)

        # Open menu
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(500)

        # Click Services
        await page.click('button:has-text("Services")')
        await page.wait_for_timeout(2000)

        print('=== Console Errors/Warnings ===')
        pprint.pprint(console_errors)

        print('=== Network Errors ===')
        pprint.pprint(network_errors)

        # Check all img elements inside #services
        imgs_status = await page.evaluate("""() => {
            const imgs = Array.from(document.querySelectorAll('#services img'));
            return imgs.map((img, i) => ({
                index: i,
                src: img.src,
                complete: img.complete,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                currentSrc: img.currentSrc
            }));
        }""")
        print('=== Services Images Status ===')
        pprint.pprint(imgs_status)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())

