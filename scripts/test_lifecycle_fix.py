import asyncio
from PIL import Image
from playwright.async_api import async_playwright

async def test_lifecycle_fix():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        await page.goto('http://localhost:5173/', wait_until='domcontentloaded')
        await page.wait_for_timeout(1000)

        # Inject the lifecycle cleanup logic on the page to test the exact mechanism
        await page.evaluate("""() => {
            const originalNavClick = window.handleNavClick;
            // Listen for clicks on menu items
            document.querySelectorAll('[data-lenis-prevent] button').forEach(btn => {
                btn.addEventListener('click', () => {
                    const menu = document.querySelector('[data-lenis-prevent]');
                    if (menu) {
                        menu.style.opacity = '0';
                        menu.style.pointerEvents = 'none';
                        setTimeout(() => {
                            menu.style.display = 'none';
                        }, 500);
                    }
                });
            });
        }""")

        # Open menu
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(500)

        # Hover Contacts
        await page.hover('button:has-text("Contacts")')
        await page.wait_for_timeout(400)

        # Click Contacts
        await page.click('button:has-text("Contacts")')
        await page.wait_for_timeout(2000)

        # Now test hover sequence across all contact images
        img_wrappers = page.locator('.contacts_img_wrapper')
        count = await img_wrappers.count()
        print(f'Testing hover across {count} contact images...')

        results = []
        for i in range(count):
            wrapper = img_wrappers.nth(i)
            await wrapper.scroll_into_view_if_needed()
            await page.wait_for_timeout(300)

            box = await wrapper.bounding_box()
            if box:
                # Hover center of image
                centerX = box['x'] + box['width']/2
                centerY = box['y'] + box['height']/2
                await page.mouse.move(centerX, centerY)
                await page.wait_for_timeout(400)
                path = f'audit/test_fix_hover_{i}.png'
                await page.screenshot(path=path)

                im = Image.open(path)
                count_22 = sum(1 for x in range(720, 1440, 10) for y in range(0, 900, 10) if im.getpixel((x, y))[:3] == (22, 22, 22))
                pct = (count_22 / 6480) * 100
                p = im.getpixel((int(centerX), int(min(890, max(10, centerY)))))
                results.append((i, count_22, pct, p))
                print(f'Image {i}: 22_count={count_22} ({pct:.1f}%), sample pixel={p}')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_lifecycle_fix())
