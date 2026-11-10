import asyncio
from playwright.async_api import async_playwright

async def inspect_contacts_dom():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto("https://www.bloom3d.studio/contacts", timeout=30000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        dom_info = await page.evaluate('''() => {
            const container = document.querySelector('.contacts_container');
            const wrapper = document.querySelector('.contacts_wrapper');
            const left = document.querySelector('.contacts_col_left');
            const right = document.querySelector('.contacts_col_right');
            const imgsWrapper = document.querySelector('.contacts_imgs, [class*="contacts_img"], .contacts_gallery');
            
            // Get all children of .contacts_wrapper or .section_contacts
            const section = document.querySelector('.section_contacts');
            const sectionChildren = Array.from(section.children).map(c => ({
                tag: c.tagName,
                className: c.className,
                htmlPreview: c.outerHTML.slice(0, 300)
            }));

            // Check where the 4 contacts_img elements live
            const imgs = Array.from(document.querySelectorAll('.contacts_img')).map(i => ({
                src: i.src,
                parentTag: i.parentElement.tagName,
                parentClass: i.parentElement.className,
                grandParentClass: i.parentElement.parentElement ? i.parentElement.parentElement.className : ''
            }));

            return {
                sectionChildren,
                leftStyles: left ? {
                    width: window.getComputedStyle(left).width,
                    padding: window.getComputedStyle(left).padding,
                    fontSize: window.getComputedStyle(left).fontSize
                } : null,
                rightStyles: right ? {
                    width: window.getComputedStyle(right).width,
                    padding: window.getComputedStyle(right).padding
                } : null,
                imgs
            };
        }''')
        print("DOM INFO:")
        import json
        print(json.dumps(dom_info, indent=2))
        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_contacts_dom())

