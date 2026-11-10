import asyncio
from playwright.async_api import async_playwright

async def inspect_contacts_details():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto("https://www.bloom3d.studio/contacts", timeout=30000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        details = await page.evaluate('''() => {
            const wrapper = document.querySelector('.contacts_wrapper');
            const left = document.querySelector('.contacts_col_left');
            const right = document.querySelector('.contacts_col_right');
            
            return {
                wrapperClass: wrapper.className,
                wrapperDisplay: window.getComputedStyle(wrapper).display,
                wrapperGrid: window.getComputedStyle(wrapper).gridTemplateColumns,
                leftChildren: Array.from(left.children).map(c => ({
                    className: c.className,
                    text: c.innerText.slice(0, 100).replace(/\\n/g, ' ')
                })),
                rightChildren: Array.from(right.children).map(c => ({
                    className: c.className,
                    text: c.innerText.slice(0, 100).replace(/\\n/g, ' ')
                })),
                rightInnerHtml: right.innerHTML.slice(0, 2000)
            };
        }''')
        import json
        print(json.dumps(details, indent=2))
        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_contacts_details())

