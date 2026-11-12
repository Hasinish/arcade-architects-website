import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        await page.goto('http://localhost:5173/contacts')
        await page.wait_for_timeout(1000)

        # Click Logo
        await page.click('a:has-text("ARCADE ARCHITECTS")')
        await page.wait_for_timeout(1500)

        res1 = await page.evaluate('''() => {
            const el = document.getElementById('advantages');
            const targetY = window.scrollY + el.getBoundingClientRect().top;
            window.lenis.scrollTo(targetY, { immediate: true });
            return {
                targetY,
                scrollY: window.scrollY,
                lenisScroll: window.lenis ? window.lenis.scroll : null,
                isStopped: window.lenis ? window.lenis.isStopped : null
            };
        }''')
        print('After scrollTo targetY:', res1)

        for i in range(5):
            await page.mouse.wheel(0, 150)
            await page.wait_for_timeout(200)
            res2 = await page.evaluate('''() => ({
                scrollY: window.scrollY,
                lenisScroll: window.lenis ? window.lenis.scroll : null,
                isStopped: window.lenis ? window.lenis.isStopped : null
            })''')
            print(f'Wheel {i}:', res2)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())

