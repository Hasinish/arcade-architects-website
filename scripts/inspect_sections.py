import asyncio
from playwright.async_api import async_playwright

async def inspect():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1600, 'height': 900})
        await page.goto('http://localhost:5173/', wait_until='networkidle')
        
        sections = await page.evaluate('''() => {
            const list = [];
            document.querySelectorAll('section, footer').forEach(s => {
                const rect = s.getBoundingClientRect();
                list.push({
                    tag: s.tagName,
                    id: s.id || s.className.slice(0, 30),
                    top: rect.top + window.scrollY,
                    bottom: rect.bottom + window.scrollY,
                    height: rect.height
                });
            });
            return list;
        }''')
        for s in sections:
            print(f"{s['tag']} [{s['id']}] Top: {s['top']:.0f} -> Bottom: {s['bottom']:.0f} (H: {s['height']:.0f})")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect())

