import asyncio
from playwright.async_api import async_playwright

async def audit_bloom_contacts():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        
        # 1. Inspect transition from homepage to contacts on Bloom3D
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()
        print("Navigating to https://www.bloom3d.studio/ ...")
        await page.goto("https://www.bloom3d.studio/", timeout=30000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        # Check if Bloom3D has preloader or transition overlay elements in DOM
        transition_elements = await page.evaluate('''() => {
            const preloader = document.querySelector('.u-preloader, [class*="preloader"], [class*="transition"], .page-transition');
            return {
                preloaderHtml: preloader ? preloader.outerHTML : 'none',
                bodyClasses: document.body.className
            };
        }''')
        print("Bloom3D Preloader / Transition DOM elements:", transition_elements)

        # 2. Inspect Desktop Bloom Contacts (1440x900)
        print("Loading https://www.bloom3d.studio/contacts at 1440x900...")
        await page.goto("https://www.bloom3d.studio/contacts", timeout=30000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2500)

        # Capture initial viewport
        await page.screenshot(path='audit/comparisons/bloom_contacts_desktop_viewport.png', full_page=False)
        # Capture full page
        await page.screenshot(path='audit/comparisons/bloom_contacts_desktop_full.png', full_page=True)
        print("Saved desktop screenshots!")

        # Detailed DOM structure audit of bloom contacts
        contacts_data = await page.evaluate('''() => {
            const sections = Array.from(document.querySelectorAll('section, main, footer')).map(s => ({
                tagName: s.tagName,
                className: s.className,
                id: s.id,
                rect: s.getBoundingClientRect()
            }));

            // Get all text content and styling of .section_contacts
            const contactSec = document.querySelector('.section_contacts');
            const styles = contactSec ? window.getComputedStyle(contactSec) : null;

            // Form inspection
            const form = document.querySelector('form');
            const formInputs = form ? Array.from(form.querySelectorAll('input, select, textarea, label')).map(el => ({
                tag: el.tagName,
                type: el.getAttribute('type'),
                name: el.getAttribute('name'),
                placeholder: el.getAttribute('placeholder'),
                text: el.innerText,
                className: el.className
            })) : [];

            // Images on page
            const imgs = Array.from(document.querySelectorAll('img')).map(i => ({
                src: i.src,
                alt: i.alt,
                className: i.className,
                rect: i.getBoundingClientRect()
            }));

            return {
                sections,
                bgColor: styles ? styles.backgroundColor : 'none',
                formInputs,
                imgs
            };
        }''')
        print(f"Bloom3D Contacts Sections: {len(contacts_data['sections'])}")
        for s in contacts_data['sections']:
            print(f" - [{s['tagName']}] .{s['className']} (height: {s['rect']['height']})")

        print("\nForm Inputs on Bloom3D:")
        for inp in contacts_data['formInputs']:
            print(f" - [{inp['tag']}] {inp.get('type') or ''} '{inp.get('name') or ''}' (placeholder: '{inp.get('placeholder') or ''}', text: '{inp.get('text') or ''}')")

        print(f"\nImages on Bloom3D Contacts: {len(contacts_data['imgs'])}")
        for img in contacts_data['imgs']:
            print(f" - {img['className']}: {img['src'][:80]}... (w: {img['rect']['width']}, h: {img['rect']['height']})")

        # 3. Mobile Bloom Contacts (390x844)
        print("\nLoading https://www.bloom3d.studio/contacts at 390x844 (Mobile)...")
        mobile_context = await browser.new_context(viewport={'width': 390, 'height': 844})
        mobile_page = await mobile_context.new_page()
        await mobile_page.goto("https://www.bloom3d.studio/contacts", timeout=30000, wait_until="domcontentloaded")
        await mobile_page.wait_for_timeout(2500)

        # Capture mobile initial viewport
        await mobile_page.screenshot(path='audit/comparisons/bloom_contacts_mobile_viewport.png', full_page=False)
        # Capture mobile full page
        await mobile_page.screenshot(path='audit/comparisons/bloom_contacts_mobile_full.png', full_page=True)
        print("Saved mobile screenshots!")

        await browser.close()
        print("\nBloom3D audit complete!")

if __name__ == '__main__':
    asyncio.run(audit_bloom_contacts())

