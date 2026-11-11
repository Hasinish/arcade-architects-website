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

        # Click Contacts
        await page.click('button:has-text("Contacts")')
        await page.wait_for_timeout(2000)

        # Scroll down so second image is in view
        await page.evaluate("() => window.scrollTo(0, 500)")
        await page.wait_for_timeout(500)

        # Move mouse to (1080, 450)
        await page.mouse.move(1080, 450)
        await page.wait_for_timeout(500)

        await page.screenshot(path='audit/inspect_hover_bug.png')

        info = await page.evaluate("""() => {
            const els = document.elementsFromPoint(1080, 450);
            const elementsInfo = els.map(el => ({
                tag: el.tagName,
                className: el.className,
                id: el.id,
                style: el.getAttribute('style'),
                computedStyle: {
                    display: window.getComputedStyle(el).display,
                    visibility: window.getComputedStyle(el).visibility,
                    opacity: window.getComputedStyle(el).opacity,
                    zIndex: window.getComputedStyle(el).zIndex,
                    backgroundColor: window.getComputedStyle(el).backgroundColor,
                    transform: window.getComputedStyle(el).transform,
                }
            }));

            // Find all images in contacts
            const contactImgs = Array.from(document.querySelectorAll('.contacts_img_wrapper img')).map((img, i) => {
                const r = img.getBoundingClientRect();
                return {
                    i,
                    src: img.src,
                    complete: img.complete,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                    rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
                    opacity: window.getComputedStyle(img).opacity,
                    visibility: window.getComputedStyle(img).visibility,
                    display: window.getComputedStyle(img).display,
                    transform: window.getComputedStyle(img).transform,
                };
            });

            return {
                scrollY: window.scrollY,
                elementsAtPoint: elementsInfo,
                contactImgs
            };
        }""")

        pprint.pprint(info)
        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect())

