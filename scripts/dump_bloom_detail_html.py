import asyncio
from playwright.async_api import async_playwright

async def inspect_details():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1600, 'height': 1200})
        
        # 1. Projects Detail Page
        await page.goto("https://www.bloom3d.studio/projects/morven", timeout=30000, wait_until="networkidle")
        await page.wait_for_timeout(1500)
        
        morven_structure = await page.evaluate('''() => {
            const main = document.querySelector('main, .main-wrapper, section.section_project');
            return {
                html: main ? main.outerHTML.slice(0, 3000) : document.body.innerHTML.slice(0, 3000)
            };
        }''')
        
        # 2. Contacts Page
        await page.goto("https://www.bloom3d.studio/contacts", timeout=30000, wait_until="networkidle")
        await page.wait_for_timeout(1500)
        
        contacts_structure = await page.evaluate('''() => {
            const main = document.querySelector('main, .main-wrapper, section');
            return {
                html: main ? main.outerHTML.slice(0, 3000) : document.body.innerHTML.slice(0, 3000)
            };
        }''')
        
        print("=== MORVEN HTML SNIPPET ===")
        print(morven_structure['html'][:1500])
        print("\n=== CONTACTS HTML SNIPPET ===")
        print(contacts_structure['html'][:1500])
        
        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_details())

