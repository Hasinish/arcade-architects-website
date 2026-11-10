import asyncio
from playwright.async_api import async_playwright
import json

async def inspect_bloom_advantages():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto('https://www.bloom3d.studio/', timeout=30000, wait_until='domcontentloaded')
        await page.wait_for_timeout(3000)

        # Find .section_advantages or advantages elements
        data = await page.evaluate('''() => {
            const section = document.querySelector('.section_advantages');
            if (!section) return { error: 'no section_advantages' };

            const items = section.querySelectorAll('.advantage');
            const itemsData = Array.from(items).map((item, idx) => {
                const header = item.querySelector('.advantage_header');
                const num = item.querySelector('.advantage_num');
                const title = item.querySelector('.advantage_heading');
                const body = item.querySelector('.advantage_body');
                const divider = item.querySelector('.advantage_divider');
                const cs = window.getComputedStyle(item);
                const d_cs = divider ? window.getComputedStyle(divider) : null;

                return {
                    idx,
                    itemHTML: item.outerHTML.substring(0, 300),
                    children: Array.from(item.children).map(c => ({
                        tag: c.tagName,
                        className: c.className,
                        computedWidth: window.getComputedStyle(c).width,
                        computedHeight: window.getComputedStyle(c).height,
                        computedBorder: window.getComputedStyle(c).border,
                        computedBg: window.getComputedStyle(c).backgroundColor,
                        transform: window.getComputedStyle(c).transform,
                    })),
                    borderTop: cs.borderTop,
                    borderBottom: cs.borderBottom,
                    dividerStyles: d_cs ? {
                        width: d_cs.width,
                        height: d_cs.height,
                        backgroundColor: d_cs.backgroundColor,
                        transform: d_cs.transform,
                        transformOrigin: d_cs.transformOrigin,
                        border: d_cs.border,
                        position: d_cs.position,
                        top: d_cs.top,
                        bottom: d_cs.bottom,
                    } : null
                };
            });

            return {
                sectionClass: section.className,
                itemsCount: items.length,
                itemsData
            };
        }''')
        print("Initial state:")
        print(json.dumps(data, indent=2))

        # Now scroll through the advantages section and capture states at different scroll positions!
        # Scroll in increments of 200px
        scroll_steps = []
        for scroll_y in range(6500, 8500, 300):
            await page.evaluate(f'window.scrollTo(0, {scroll_y})')
            await page.wait_for_timeout(300)
            step_data = await page.evaluate('''() => {
                const items = document.querySelectorAll('.advantage');
                return Array.from(items).map((item, idx) => {
                    const divider = item.querySelector('.advantage_divider');
                    const numBg = item.querySelector('.advantage_num_bg');
                    const body = item.querySelector('.advantage_body');
                    return {
                        idx,
                        className: item.className,
                        style: item.getAttribute('style'),
                        dividerTransform: divider ? window.getComputedStyle(divider).transform : null,
                        dividerWidth: divider ? window.getComputedStyle(divider).width : null,
                        bodyHeight: body ? window.getComputedStyle(body).height : null,
                        bodyOpacity: body ? window.getComputedStyle(body).opacity : null,
                    };
                });
            }''')
            scroll_steps.append({'scrollY': scroll_y, 'items': step_data})

        print("\nScroll animation progression:")
        for s in scroll_steps[:5]:
            print(f"ScrollY {s['scrollY']}:")
            for it in s['items']:
                print(f"  Item {it['idx']}: dividerTransform={it['dividerTransform']}, bodyHeight={it['bodyHeight']}")

        await browser.close()

asyncio.run(inspect_bloom_advantages())

