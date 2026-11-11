import asyncio
import pprint
from playwright.async_api import async_playwright

async def inspect():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        await page.goto('http://localhost:5173/', wait_until='domcontentloaded')
        await page.wait_for_timeout(1000)

        # Open menu
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(500)

        # Hover over menu item
        await page.hover('button:has-text("Contacts")')
        await page.wait_for_timeout(400)

        # Click Contacts
        await page.click('button:has-text("Contacts")')
        await page.wait_for_timeout(2000)

        # Before hover: check image
        img0_before = await page.evaluate("""() => {
            const img = document.querySelector('.contacts_img_wrapper img');
            const r = img ? img.getBoundingClientRect() : null;
            return {
                complete: img?.complete,
                naturalWidth: img?.naturalWidth,
                naturalHeight: img?.naturalHeight,
                currentSrc: img?.currentSrc,
                rect: r ? { x: r.x, y: r.y, w: r.width, h: r.height } : null,
                opacity: img ? window.getComputedStyle(img).opacity : null,
                visibility: img ? window.getComputedStyle(img).visibility : null,
                transform: img ? window.getComputedStyle(img).transform : null,
                display: img ? window.getComputedStyle(img).display : null,
            };
        }""")
        print('=== IMG 0 BEFORE HOVER ===')
        pprint.pprint(img0_before)
        await page.screenshot(path='audit/debug_testB_before_hover.png')

        # Now hover over the image
        first_wrapper = page.locator('.contacts_img_wrapper').first
        box = await first_wrapper.bounding_box()
        print('First wrapper bounding box:', box)
        await page.mouse.move(box['x'] + box['width']/2, box['y'] + box['height']/2)
        await page.wait_for_timeout(400)

        img0_after = await page.evaluate("""() => {
            const img = document.querySelector('.contacts_img_wrapper img');
            const r = img ? img.getBoundingClientRect() : null;
            return {
                complete: img?.complete,
                naturalWidth: img?.naturalWidth,
                naturalHeight: img?.naturalHeight,
                currentSrc: img?.currentSrc,
                rect: r ? { x: r.x, y: r.y, w: r.width, h: r.height } : null,
                opacity: img ? window.getComputedStyle(img).opacity : null,
                visibility: img ? window.getComputedStyle(img).visibility : null,
                transform: img ? window.getComputedStyle(img).transform : null,
                display: img ? window.getComputedStyle(img).display : null,
            };
        }""")
        print('=== IMG 0 AFTER HOVER ===')
        pprint.pprint(img0_after)
        await page.screenshot(path='audit/debug_testB_after_hover.png')

        # Now hover over the SECOND image
        # In repro_testB, we hovered over nth(1) with mouse.move(1080, 1296)
        # What did mouse.move(1080, 1296) do?
        # Let's test that exact mouse move!
        second_wrapper = page.locator('.contacts_img_wrapper').nth(1)
        box2 = await second_wrapper.bounding_box()
        print('Second wrapper bounding box:', box2)
        await page.mouse.move(box2['x'] + box2['width']/2, box2['y'] + box2['height']/2)
        await page.wait_for_timeout(400)
        await page.screenshot(path='audit/debug_testB_after_hover_box2.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect())

