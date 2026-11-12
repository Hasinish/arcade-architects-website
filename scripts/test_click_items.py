import asyncio
from playwright.async_api import async_playwright

async def test_click_items():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        print("1. Go to contacts...")
        await page.goto('http://localhost:5173/contacts')
        await page.wait_for_timeout(1000)

        print("2. Click Logo...")
        await page.click('a:has-text("ARCADE ARCHITECTS")')
        await page.wait_for_timeout(2000)

        print("3. Scroll to advantages...")
        await page.evaluate("""() => {
            const el = document.getElementById('advantages');
            const lenis = window.lenis;
            if (lenis) {
                lenis.scrollTo(el, { immediate: true });
            } else {
                el.scrollIntoView();
            }
        }""")
        await page.wait_for_timeout(1000)

        # Check current active item
        data1 = await page.evaluate("""() => {
            const items = Array.from(document.querySelectorAll('#advantages .cursor-pointer'));
            return items.map((it, idx) => ({
                idx,
                title: it.querySelector('h3').innerText,
                isActive: it.querySelector('.overflow-hidden').className.includes('max-h-40')
            }));
        }""")
        print("Initial state at advantages:", data1)

        # Now click item 1 (Fast delivery)
        print("4. Clicking Item 1 (Fast delivery)...")
        item1 = page.locator('#advantages .cursor-pointer:has-text("Fast delivery")')
        await item1.click()
        await page.wait_for_timeout(1500)

        data2 = await page.evaluate("""() => {
            const items = Array.from(document.querySelectorAll('#advantages .cursor-pointer'));
            return items.map((it, idx) => ({
                idx,
                title: it.querySelector('h3').innerText,
                isActive: it.querySelector('.overflow-hidden').className.includes('max-h-40')
            }));
        }""")
        print("State after clicking Item 1:", data2)

        # Now click item 3 (Architectural expertise)
        print("5. Clicking Item 3 (Architectural expertise)...")
        item3 = page.locator('#advantages .cursor-pointer:has-text("Architectural expertise")')
        await item3.click()
        await page.wait_for_timeout(1500)

        data3 = await page.evaluate("""() => {
            const items = Array.from(document.querySelectorAll('#advantages .cursor-pointer'));
            return items.map((it, idx) => ({
                idx,
                title: it.querySelector('h3').innerText,
                isActive: it.querySelector('.overflow-hidden').className.includes('max-h-40')
            }));
        }""")
        print("State after clicking Item 3:", data3)

        # Now click item 1 again (Fast delivery)
        print("6. Clicking Item 1 again...")
        await item1.click()
        await page.wait_for_timeout(1500)

        data4 = await page.evaluate("""() => {
            const items = Array.from(document.querySelectorAll('#advantages .cursor-pointer'));
            return items.map((it, idx) => ({
                idx,
                title: it.querySelector('h3').innerText,
                isActive: it.querySelector('.overflow-hidden').className.includes('max-h-40')
            }));
        }""")
        print("State after clicking Item 1 again:", data4)

        await page.screenshot(path='audit/test_click_items.png')
        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_click_items())

