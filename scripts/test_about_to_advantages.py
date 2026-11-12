import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        page.on('console', lambda m: print(f"[CONSOLE] {m.text}"))

        print("1. Goto Home...")
        await page.goto('http://localhost:5173/')
        await page.wait_for_timeout(1000)

        print("2. Open menu -> Contacts...")
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(500)
        await page.click('button:has-text("Contacts")')
        await page.wait_for_timeout(2000)

        print("3. Click Logo to return to Home...")
        await page.click('a:has-text("ARCADE ARCHITECTS")')
        await page.wait_for_timeout(2000)

        print("4. Open menu -> About...")
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(500)
        await page.click('button:has-text("About")')
        await page.wait_for_timeout(2000)

        print(f"URL after clicking About: {page.url}, scrollY: {await page.evaluate('() => window.scrollY')}")

        print("5. Scrolling down into #advantages...")
        for i in range(15):
            await page.mouse.wheel(0, 150)
            await page.wait_for_timeout(150)
            data = await page.evaluate('''() => {
                const el = document.getElementById('advantages');
                const rect = el.getBoundingClientRect();
                const strokes = Array.from(el.querySelectorAll('.origin-left')).map(s => s.style.transform);
                const items = Array.from(el.querySelectorAll('.cursor-pointer'));
                const activeIdx = items.findIndex(it => it.querySelector('.overflow-hidden').className.includes('max-h-40'));
                return {
                    scrollY: window.scrollY,
                    rectTop: rect.top,
                    activeIdx,
                    strokes
                };
            }''')
            print(f"Step {i} (Y={data['scrollY']}, top={data['rectTop']:.0f}): activeIdx={data['activeIdx']}, strokes={data['strokes']}")

        await page.screenshot(path='audit/about_to_advantages_repro.png')
        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())

