import asyncio
from playwright.async_api import async_playwright

async def reproduce():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        page.on('console', lambda msg: print(f"[CONSOLE] {msg.text}"))

        print("1. Goto /")
        await page.goto('http://localhost:5173/')
        await page.wait_for_timeout(1000)

        print("2. Open menu and click Contacts")
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(500)
        await page.click('button:has-text("Contacts")')
        await page.wait_for_timeout(2000)

        print(f"3. On /contacts (URL: {page.url}). Now click Logo...")
        await page.click('a:has-text("ARCADE ARCHITECTS")')
        await page.wait_for_timeout(2000)
        print(f"4. Returned to Home (URL: {page.url})")

        # Now simulate user scrolling down using mouse wheel continuously
        print("5. Scrolling down towards #advantages...")
        
        # Scroll down in increments
        for i in range(40):
            await page.mouse.wheel(0, 400)
            await page.wait_for_timeout(100)

        await page.wait_for_timeout(1000)
        await page.screenshot(path='audit/user_flow_at_advantages.png')

        data = await page.evaluate("""() => {
            const el = document.getElementById('advantages');
            const rect = el.getBoundingClientRect();
            const strokes = Array.from(el.querySelectorAll('.origin-left')).map(s => s.style.transform);
            const activeIdx = Array.from(el.querySelectorAll('.cursor-pointer')).findIndex(item => 
                item.querySelector('.overflow-hidden').className.includes('max-h-40')
            );
            return {
                scrollY: window.scrollY,
                rectTop: rect.top,
                strokes,
                activeIdx
            };
        }""")
        print("Final Data at #advantages:", data)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(reproduce())

