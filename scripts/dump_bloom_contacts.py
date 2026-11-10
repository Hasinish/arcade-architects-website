import asyncio
from playwright.async_api import async_playwright

async def inspect_contacts():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1600, 'height': 1200})
        await page.goto("https://www.bloom3d.studio/contacts", timeout=30000, wait_until="networkidle")
        await page.wait_for_timeout(1000)
        
        data = await page.evaluate('''() => {
            const sections = Array.from(document.querySelectorAll('section')).map(s => ({
                className: s.className,
                html: s.outerHTML.slice(0, 1500)
            }));
            return sections;
        }''')
        for s in data:
            print(f"CLASS: {s['className']}")
            print(s['html'][:500])
            print("="*40)
        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_contacts())

