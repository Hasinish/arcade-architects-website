import asyncio
import pprint
from playwright.async_api import async_playwright

async def inspect_mouse_move():
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

        print('--- Moving to (1080, 450) ---')
        await page.mouse.move(1080, 450)
        await page.wait_for_timeout(300)

        print('--- Moving to (1080, 1296) ---')
        await page.mouse.move(1080, 1296)
        await page.wait_for_timeout(300)

        report = await page.evaluate("""() => {
            const img0 = document.querySelectorAll('.contacts_img_wrapper img')[0];
            const w0 = document.querySelectorAll('.contacts_img_wrapper')[0];
            const r0 = img0.getBoundingClientRect();
            const rw0 = w0.getBoundingClientRect();

            // Find all elements covering (1080, 450)
            const elsAt450 = document.elementsFromPoint(1080, 450).map(el => ({
                tag: el.tagName,
                className: el.className,
                style: el.getAttribute('style'),
                opacity: window.getComputedStyle(el).opacity,
                bg: window.getComputedStyle(el).backgroundColor,
                display: window.getComputedStyle(el).display,
                visibility: window.getComputedStyle(el).visibility,
                transform: window.getComputedStyle(el).transform,
                zIndex: window.getComputedStyle(el).zIndex,
            }));

            // Check CustomCursor
            const cursorDot = document.querySelector('.z-\\\\[9998\\\\] motion\\\\.div') || document.querySelector('[class*=\"z-[9998]\"]');

            return {
                scrollY: window.scrollY,
                img0: {
                    naturalWidth: img0.naturalWidth,
                    rect: { x: r0.x, y: r0.y, w: r0.width, h: r0.height },
                    opacity: window.getComputedStyle(img0).opacity,
                    visibility: window.getComputedStyle(img0).visibility,
                    display: window.getComputedStyle(img0).display,
                    transform: window.getComputedStyle(img0).transform,
                },
                w0: {
                    rect: { x: rw0.x, y: rw0.y, w: rw0.width, h: rw0.height },
                    bg: window.getComputedStyle(w0).backgroundColor,
                },
                elsAt450
            };
        }""")

        pprint.pprint(report)
        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_mouse_move())

