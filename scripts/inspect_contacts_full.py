import asyncio
from playwright.async_api import async_playwright

async def inspect_contacts_full():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1600, 'height': 1200})
        await page.goto("https://www.bloom3d.studio/contacts", timeout=30000, wait_until="networkidle")
        await page.wait_for_timeout(1000)
        
        data = await page.evaluate('''() => {
            const sec = document.querySelector('section.section_contacts');
            return sec ? sec.outerHTML : 'none';
        }''')
        print("CONTACTS SECTION HTML:")
        print(data[:3500])
        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_contacts_full())

