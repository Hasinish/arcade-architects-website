import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        logs = []
        page.on('console', lambda m: logs.append(m.text))

        print("1. Goto /contacts")
        await page.goto('http://localhost:5173/contacts')
        await page.wait_for_timeout(1000)

        print("2. Click Logo...")
        await page.click('a:has-text("ARCADE ARCHITECTS")')
        await page.wait_for_timeout(1500)

        # Check lenis state
        state = await page.evaluate('''() => {
            const l = window.lenis;
            return {
                isStopped: l.isStopped,
                _isStopped: l._isStopped,
                _isLocked: l._isLocked,
                animatedScroll: l.animatedScroll,
                targetScroll: l.targetScroll,
                windowScrollY: window.scrollY
            };
        }''')
        print("Lenis state after returning to Home:", state)

        # Listen to scroll events
        await page.evaluate('''() => {
            window.__scrollCount = 0;
            window.__lenisCount = 0;
            window.addEventListener('scroll', () => { window.__scrollCount++; });
            if (window.lenis) {
                window.lenis.on('scroll', () => { window.__lenisCount++; });
            }
        }''')

        # Now simulate user scrolling with wheel
        print("3. Scrolling with wheel...")
        for i in range(15):
            await page.mouse.wheel(0, 200)
            await page.wait_for_timeout(150)
            counts = await page.evaluate('''() => ({
                scrollY: window.scrollY,
                scrollCount: window.__scrollCount,
                lenisCount: window.__lenisCount,
                lenisScroll: window.lenis ? window.lenis.scroll : null,
                isStopped: window.lenis ? window.lenis.isStopped : null
            })''')
            print(f"Wheel tick {i}: {counts}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())

