import asyncio
from playwright.async_api import async_playwright

async def inspect_case_study():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1600, 'height': 900})
        
        print('Loading https://www.bloom3d.studio/projects/morven ...')
        await page.goto('https://www.bloom3d.studio/projects/morven', timeout=30000, wait_until='networkidle')
        await page.wait_for_timeout(2000)
        
        data = await page.evaluate('''() => {
            const h1 = document.querySelector('h1')?.innerText;
            const sections = Array.from(document.querySelectorAll('section, main, .section, [class*="project"]')).map(s => ({
                tag: s.tagName,
                className: s.className,
                textSnippet: s.innerText ? s.innerText.slice(0, 150).replace(/\\n/g, ' ') : ''
            }));
            const images = Array.from(document.querySelectorAll('img')).map(i => ({
                src: i.src,
                alt: i.alt,
                className: i.className
            }));
            const projectDetails = Array.from(document.querySelectorAll('.project_detail, .project_meta, [class*="detail"], [class*="meta"]')).map(d => ({
                class: d.className,
                text: d.innerText.replace(/\\n/g, ' ')
            }));
            return { h1, sections: sections.slice(0, 8), imgCount: images.length, sampleImgs: images.slice(0, 5), projectDetails };
        }''')
        print('MORVEN PROJECT DATA:', data)
        await page.screenshot(path='audit/comparisons/bloom_morven_screenshot.png', full_page=False)
        
        print('\nLoading https://www.bloom3d.studio/contacts ...')
        await page.goto('https://www.bloom3d.studio/contacts', timeout=30000, wait_until='networkidle')
        await page.wait_for_timeout(2000)
        c_data = await page.evaluate('''() => {
            const h1 = document.querySelector('h1')?.innerText;
            const text = document.body.innerText.slice(0, 500).replace(/\\n/g, ' ');
            const forms = Array.from(document.querySelectorAll('form')).map(f => ({
                action: f.getAttribute('action'),
                fields: Array.from(f.querySelectorAll('input, textarea, select')).map(i => ({
                    tag: i.tagName,
                    type: i.getAttribute('type'),
                    placeholder: i.getAttribute('placeholder'),
                    name: i.getAttribute('name')
                }))
            }));
            return { h1, text, forms };
        }''')
        print('CONTACTS DATA:', c_data)
        await page.screenshot(path='audit/comparisons/bloom_contacts_screenshot.png', full_page=False)
        
        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_case_study())

