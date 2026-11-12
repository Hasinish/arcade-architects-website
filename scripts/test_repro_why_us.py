import asyncio
from playwright.async_api import async_playwright

async def test_repro_why_us():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        print("1. Loading Home...")
        await page.goto('http://localhost:5173/', wait_until='domcontentloaded')
        await page.wait_for_timeout(1000)

        print("2. Opening Menu...")
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(600)

        print("3. Clicking Contacts...")
        await page.click('button:has-text("Contacts")')
        await page.wait_for_timeout(2000)
        print(f"Current URL: {page.url}")

        print("4. Clicking Logo to return to main page...")
        await page.click('a[aria-label="Arcade Architects"], a:has-text("ARCADE ARCHITECTS")')
        await page.wait_for_timeout(2000)
        print(f"Current URL after clicking logo: {page.url}")

        print("5. Scrolling down to Why work with us (#advantages)...")
        # Let's scroll to #advantages using Lenis or scrollBy
        await page.evaluate("""() => {
            const el = document.getElementById('advantages');
            if (el) {
                const lenis = window.lenis;
                if (lenis) {
                    lenis.scrollTo(el, { duration: 2 });
                } else {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }""")
        await page.wait_for_timeout(3000)

        await page.screenshot(path='audit/why_us_step1.png')

        # Now let's scroll inside advantages
        print("6. Scrolling inside #advantages...")
        for i in range(5):
            await page.evaluate("() => window.scrollBy(0, 300)")
            await page.wait_for_timeout(600)
            data = await page.evaluate("""() => {
                const el = document.getElementById('advantages');
                const rect = el.getBoundingClientRect();
                const strokes = [0, 1, 2, 3].map(i => {
                    // query stroke ref
                    const divs = el.querySelectorAll('.origin-left');
                    return divs[i] ? {
                        transform: divs[i].style.transform,
                        opacity: divs[i].style.opacity
                    } : null;
                });
                return {
                    scrollY: window.scrollY,
                    rectTop: rect.top,
                    rectHeight: rect.height,
                    strokes: strokes,
                    lenisIsStopped: window.lenis ? window.lenis.isStopped : null
                };
            }""")
            print(f"Scroll step {i}: {data}")
            await page.screenshot(path=f'audit/why_us_scroll_{i}.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_repro_why_us())
