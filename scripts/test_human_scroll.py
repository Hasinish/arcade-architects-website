import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        page.on('console', lambda m: print(f"[CONSOLE] {m.text}"))

        print("1. Goto /contacts")
        await page.goto('http://localhost:5173/contacts')
        await page.wait_for_timeout(1000)

        print("2. Click Logo...")
        await page.click('a:has-text("ARCADE ARCHITECTS")')
        await page.wait_for_timeout(1500)

        # Scroll to right before #advantages
        await page.evaluate("""() => {
            const el = document.getElementById('advantages');
            const targetY = window.scrollY + el.getBoundingClientRect().top - 200;
            window.lenis.scrollTo(targetY, { immediate: true });
        }""")
        await page.wait_for_timeout(1000)

        print("3. Human scrolling into #advantages...")
        for i in range(20):
            await page.mouse.wheel(0, 100)
            await page.wait_for_timeout(400)

        await page.screenshot(path='audit/human_scroll_test.png')
        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())

