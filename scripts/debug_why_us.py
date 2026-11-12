import asyncio
from playwright.async_api import async_playwright

async def debug_why_us():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        # Capture console.log
        page.on('console', lambda msg: print(f"[BROWSER CONSOLE] {msg.text}"))

        await page.goto('http://localhost:5173/contacts', wait_until='domcontentloaded')
        await page.wait_for_timeout(1000)

        # Click Logo
        await page.click('a:has-text("ARCADE ARCHITECTS")')
        await page.wait_for_timeout(1500)

        # Inspect WhyUs state
        await page.evaluate("""() => {
            const el = document.getElementById('advantages');
            el.scrollIntoView();
        }""")
        await page.wait_for_timeout(500)

        for step in range(10):
            await page.mouse.wheel(0, 300)
            await page.wait_for_timeout(200)
            info = await page.evaluate("""() => {
                const el = document.getElementById('advantages');
                const rect = el.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const stickyRunway = rect.height - windowHeight;
                const scrolledInside = -rect.top;
                const progress = Math.max(0, Math.min(1, scrolledInside / stickyRunway));
                const nextIndex = Math.min(3, Math.floor(progress / 0.25));

                const items = Array.from(el.querySelectorAll('.cursor-pointer')).map((item, idx) => {
                    const title = item.querySelector('h3').innerText;
                    const body = item.querySelector('.overflow-hidden');
                    return {
                        idx,
                        title,
                        maxH: body.className.includes('max-h-40'),
                        classes: body.className
                    };
                });

                return {
                    scrollY: window.scrollY,
                    rectTop: rect.top,
                    progress,
                    nextIndex,
                    items
                };
            }""")
            print(f"\n--- STEP {step} ---")
            print(f"ScrollY: {info['scrollY']}, rectTop: {info['rectTop']}, progress: {info['progress']:.3f}, nextIndex: {info['nextIndex']}")
            for it in info['items']:
                print(f"  Item {it['idx']} ({it['title']}): maxH-40={it['maxH']}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(debug_why_us())

