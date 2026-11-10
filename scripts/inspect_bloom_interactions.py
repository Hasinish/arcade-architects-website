import asyncio
from playwright.async_api import async_playwright

async def inspect_bloom():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1600, 'height': 900})
        
        print("Loading https://www.bloom3d.studio/ ...")
        await page.goto("https://www.bloom3d.studio/", timeout=30000, wait_until="networkidle")
        await page.wait_for_timeout(2000)

        # Inspect all buttons and links in Hero and Portfolio
        data = await page.evaluate('''() => {
            const results = [];
            
            // 1. Check all links on page
            const links = Array.from(document.querySelectorAll('a')).map(a => ({
                text: a.innerText.trim().replace(/\\n/g, ' '),
                href: a.getAttribute('href'),
                className: a.className
            })).filter(l => l.text.length > 0 || l.href);

            // 2. Check portfolio project items
            const projectEls = Array.from(document.querySelectorAll('[data-w-id*=\"project\"], .project-card, .portfolio-item, .w-dyn-item a, a[href*=\"project\"]')).map(el => ({
                tagName: el.tagName,
                href: el.getAttribute('href'),
                text: el.innerText.trim().replace(/\\n/g, ' '),
                className: el.className
            }));

            // 3. Check hero buttons
            const heroBtns = Array.from(document.querySelectorAll('.hero a, .hero button, .w-button')).map(b => ({
                tagName: b.tagName,
                text: b.innerText.trim().replace(/\\n/g, ' '),
                href: b.getAttribute('href'),
                className: b.className
            }));

            return { links: links.slice(0, 30), projectEls: projectEls.slice(0, 15), heroBtns };
        }''')

        print("\n--- HERO BUTTONS & ACTIONS ---")
        for b in data['heroBtns']:
            print(f"[{b['tagName']}] '{b['text']}' -> href: {b['href']} (class: {b['className']})")

        print("\n--- SAMPLE LINKS ON BLOOM3D ---")
        for l in data['links'][:20]:
            print(f"'{l['text']}' -> href: {l['href']}")

        print("\n--- PORTFOLIO ELEMENTS ---")
        for p_item in data['projectEls']:
            print(p_item)

        # Inspect portfolio section DOM specifically
        portfolio_info = await page.evaluate('''() => {
            const port = document.querySelector('section#portfolio, [id*=\"portfolio\"], .section_portfolio, .section-portfolio');
            if (!port) {
                // Find element containing "Featured Projects"
                const all = Array.from(document.querySelectorAll('*'));
                const heading = all.find(el => el.innerText && el.innerText.includes('Featured Projects') && el.children.length === 0);
                const parentSec = heading ? heading.closest('section, div') : null;
                return {
                    found: false,
                    headingParent: parentSec ? parentSec.outerHTML.slice(0, 500) : 'none'
                };
            }
            return {
                found: true,
                tag: port.tagName,
                html: port.outerHTML.slice(0, 1000)
            };
        }''')
        print("\n--- PORTFOLIO DOM INSPECTION ---")
        print(portfolio_info)

        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_bloom())

