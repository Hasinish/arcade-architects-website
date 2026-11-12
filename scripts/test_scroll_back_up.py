import asyncio
from playwright.async_api import async_playwright

async def test_scroll_back_up():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        await page.goto('http://localhost:5173/contacts')
        await page.wait_for_timeout(1000)

        # Click Logo
        await page.click('a:has-text("ARCADE ARCHITECTS")')
        await page.wait_for_timeout(1500)

        # Scroll to #advantages
        await page.evaluate("""() => {
            const el = document.getElementById('advantages');
            const targetY = window.scrollY + el.getBoundingClientRect().top;
            window.lenis.scrollTo(targetY, { immediate: true });
        }""")
        await page.wait_for_timeout(500)

        print("Scrolling DOWN through advantages...")
        for i in range(15):
            await page.mouse.wheel(0, 150)
            await page.wait_for_timeout(100)

        down_state = await page.evaluate("""() => {
            const el = document.getElementById('advantages');
            const items = Array.from(el.querySelectorAll('.cursor-pointer'));
            const activeIdx = items.findIndex(it => it.querySelector('.overflow-hidden').className.includes('max-h-40'));
            const strokes = Array.from(el.querySelectorAll('.origin-left')).map(s => s.style.transform);
            return { activeIdx, strokes };
        }""")
        print("At bottom of scroll:", down_state)

        print("Now scrolling BACK UP...")
        for i in range(15):
            await page.mouse.wheel(0, -150)
            await page.wait_for_timeout(100)

        up_state = await page.evaluate("""() => {
            const el = document.getElementById('advantages');
            const items = Array.from(el.querySelectorAll('.cursor-pointer'));
            const activeIdx = items.findIndex(it => it.querySelector('.overflow-hidden').className.includes('max-h-40'));
            const strokes = Array.from(el.querySelectorAll('.origin-left')).map(s => s.style.transform);
            return { activeIdx, strokes };
        }""")
        print("After scrolling back up:", up_state)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_scroll_back_up())

