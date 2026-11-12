import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        page.on('console', lambda m: print('CONSOLE:', m.text))

        await page.goto('http://localhost:5173/contacts')
        await page.wait_for_timeout(1000)
        await page.click('a:has-text("ARCADE ARCHITECTS")')
        await page.wait_for_timeout(1500)

        # Check if lenis is running
        res = await page.evaluate('''() => {
            const lenis = window.lenis;
            return {
                lenisExists: Boolean(lenis),
                isStopped: lenis ? lenis.isStopped : null,
                isSmooth: lenis ? lenis.isSmooth : null,
                scroll: lenis ? lenis.scroll : null,
                windowScrollY: window.scrollY
            };
        }''')
        print('LENIS STATE:', res)
        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())

