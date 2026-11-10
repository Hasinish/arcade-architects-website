import asyncio
from playwright.async_api import async_playwright

async def inspect_more():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto('https://www.bloom3d.studio/', timeout=30000, wait_until='domcontentloaded')
        await page.wait_for_timeout(3000)

        for diff in range(1400, 3200, 150):
            sy = 6760 + diff
            await page.evaluate(f'window.scrollTo(0, {sy})')
            await page.wait_for_timeout(150)
            res = await page.evaluate('''() => {
                const items = document.querySelectorAll('.advantage');
                return Array.from(items).map((it, i) => {
                    const divider = it.querySelector('.advantage_divider');
                    const body = it.querySelector('.advantage_body');
                    return {
                        i,
                        dividerStyle: divider ? divider.getAttribute('style') : 'none',
                        bodyHeight: body ? window.getComputedStyle(body).height : 'none',
                    };
                });
            }''')
            print(f"Diff {diff}px:")
            for it in res:
                print(f"  Item {it['i']}: divider='{it['dividerStyle']}' bodyHeight={it['bodyHeight']}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_more())

