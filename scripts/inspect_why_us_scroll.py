import asyncio
from playwright.async_api import async_playwright

async def inspect_why_us_scroll():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        # 1. Direct visit to Home first
        await page.goto('http://localhost:5173/contacts', wait_until='domcontentloaded')
        await page.wait_for_timeout(1000)

        # Click Logo
        await page.click('a:has-text("ARCADE ARCHITECTS")')
        await page.wait_for_timeout(1500)

        # Scroll to #advantages
        await page.evaluate("""() => {
            const el = document.getElementById('advantages');
            el.scrollIntoView();
        }""")
        await page.wait_for_timeout(1000)

        # Now simulate user scrolling with wheel
        print("Starting wheel scroll...")
        snapshots = []
        for step in range(30):
            await page.mouse.wheel(0, 150)
            await page.wait_for_timeout(100)
            data = await page.evaluate("""() => {
                const el = document.getElementById('advantages');
                const rect = el.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const stickyRunway = rect.height - windowHeight;
                const scrolledInside = -rect.top;
                const progress = Math.max(0, Math.min(1, scrolledInside / stickyRunway));
                const activeAdvantage = document.querySelector('#advantages .max-h-40');
                const activeText = activeAdvantage ? activeAdvantage.parentElement.querySelector('h3').innerText : null;

                const strokes = Array.from(document.querySelectorAll('#advantages .origin-left')).map((s, idx) => ({
                    idx,
                    transform: s.style.transform,
                    opacity: s.style.opacity
                }));

                const activeImg = Array.from(document.querySelectorAll('#advantages .lg\\\\:block img')).map(img => ({
                    src: img.src,
                    opacity: window.getComputedStyle(img.parentElement).opacity
                }));

                return {
                    scrollY: window.scrollY,
                    rectTop: rect.top,
                    progress: progress,
                    activeText: activeText,
                    strokes: strokes,
                    activeImg: activeImg
                };
            }""")
            snapshots.append(data)
            print(f"Step {step}: progress={data['progress']:.3f}, active={data['activeText']}, stroke3={data['strokes'][3]['transform']}")

        await page.screenshot(path='audit/why_us_wheel_final.png')
        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_why_us_scroll())

