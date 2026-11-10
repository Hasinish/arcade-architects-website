import asyncio
from playwright.async_api import async_playwright

async def inspect_morven_full():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1600, 'height': 1200})
        await page.goto("https://www.bloom3d.studio/projects/morven", timeout=30000, wait_until="networkidle")
        await page.wait_for_timeout(1000)
        
        data = await page.evaluate('''() => {
            const nextProj = document.querySelector('.project_nav_card, [class*="project_nav"], [class*="next_project"], .next-project');
            const galleryEls = Array.from(document.querySelectorAll('.section_project img, .project_wrapper img')).map(img => ({
                src: img.src,
                className: img.className,
                parentClass: img.parentElement ? img.parentElement.className : ''
            }));
            const nextProjHtml = nextProj ? nextProj.outerHTML : 'none';
            return { nextProjHtml, galleryEls };
        }''')
        print("NEXT PROJECT HTML:")
        print(data['nextProjHtml'][:1500])
        print("\nGALLERY IMAGES COUNT:", len(data['galleryEls']))
        for g in data['galleryEls']:
            print(f"img: {g['className']} | parent: {g['parentClass']}")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_morven_full())

