import asyncio
import pprint
from playwright.async_api import async_playwright

async def reproduce():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)

        # -------------------------------------------------------------
        # TEST A: Direct loading of /contacts
        # -------------------------------------------------------------
        page_a = await browser.new_page(viewport={'width': 1440, 'height': 900})
        console_a = []
        page_a.on('console', lambda msg: console_a.append(f'[{msg.type}] {msg.text}'))

        await page_a.goto('http://localhost:5173/contacts', wait_until='domcontentloaded')
        await page_a.wait_for_timeout(1000)

        # Hover over first and second contact images
        img_wrappers_a = page_a.locator('.contacts_img_wrapper')
        count_a = await img_wrappers_a.count()
        print(f'[Test A] Found {count_a} contact image wrappers')

        for i in range(count_a):
            box = await img_wrappers_a.nth(i).bounding_box()
            if box:
                await page_a.mouse.move(box['x'] + box['width']/2, box['y'] + box['height']/2)
                await page_a.wait_for_timeout(300)
                await page_a.screenshot(path=f'audit/repro_testA_hover_img_{i}.png')

        # -------------------------------------------------------------
        # TEST B: Home -> Menu -> Contacts -> Hover
        # -------------------------------------------------------------
        page_b = await browser.new_page(viewport={'width': 1440, 'height': 900})
        console_b = []
        page_b.on('console', lambda msg: console_b.append(f'[{msg.type}] {msg.text}'))

        await page_b.goto('http://localhost:5173/', wait_until='domcontentloaded')
        await page_b.wait_for_timeout(1000)

        # Open menu
        await page_b.click('button[aria-label="Open Navigation Menu"]')
        await page_b.wait_for_timeout(500)

        # Hover over menu items
        await page_b.hover('button:has-text("Contacts")')
        await page_b.wait_for_timeout(400)

        # Click Contacts
        await page_b.click('button:has-text("Contacts")')
        # Wait for page transition / curtain to complete
        await page_b.wait_for_timeout(2000)

        print(f'[Test B] Current URL: {page_b.url}')

        img_wrappers_b = page_b.locator('.contacts_img_wrapper')
        count_b = await img_wrappers_b.count()
        print(f'[Test B] Found {count_b} contact image wrappers')

        for i in range(count_b):
            box = await img_wrappers_b.nth(i).bounding_box()
            if box:
                # Move mouse to center of image wrapper
                await page_b.mouse.move(box['x'] + box['width']/2, box['y'] + box['height']/2)
                await page_b.wait_for_timeout(400)
                await page_b.screenshot(path=f'audit/repro_testB_hover_img_{i}.png')

        # Inspect DOM layers in Test B
        dom_report_b = await page_b.evaluate("""() => {
            const curtain = document.querySelector('[key="architectural-curtain"]') || Array.from(document.querySelectorAll('*')).find(el => el.className && typeof el.className === 'string' && el.className.includes('9999'));
            const menu = document.querySelector('[data-lenis-prevent]');
            const cursor = Array.from(document.querySelectorAll('*')).find(el => el.className && typeof el.className === 'string' && el.className.includes('9998'));
            const images = Array.from(document.querySelectorAll('.contacts_img_wrapper')).map((w, idx) => {
                const img = w.querySelector('img');
                const overlay = w.querySelector('.pointer-events-none');
                const rect = w.getBoundingClientRect();
                return {
                    idx,
                    rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
                    imgSrc: img?.src,
                    imgComplete: img?.complete,
                    imgNaturalWidth: img?.naturalWidth,
                    imgOpacity: window.getComputedStyle(img).opacity,
                    imgTransform: window.getComputedStyle(img).transform,
                    wrapperBg: window.getComputedStyle(w).backgroundColor,
                };
            });
            return {
                curtainExists: !!curtain,
                curtainStyle: curtain ? curtain.getAttribute('style') : null,
                curtainClass: curtain ? curtain.className : null,
                menuDisplay: menu ? window.getComputedStyle(menu).display : null,
                menuVisibility: menu ? window.getComputedStyle(menu).visibility : null,
                menuOpacity: menu ? window.getComputedStyle(menu).opacity : null,
                menuPointerEvents: menu ? window.getComputedStyle(menu).pointerEvents : null,
                images
            };
        }""")

        print('=== DOM REPORT TEST B ===')
        pprint.pprint(dom_report_b)

        print('=== CONSOLE A ERRORS ===')
        pprint.pprint([c for c in console_a if 'error' in c.lower() or 'warn' in c.lower()])

        print('=== CONSOLE B ERRORS ===')
        pprint.pprint([c for c in console_b if 'error' in c.lower() or 'warn' in c.lower()])

        await browser.close()

if __name__ == '__main__':
    asyncio.run(reproduce())
