import asyncio
from playwright.async_api import async_playwright

async def inspect_bloom_stroke():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto('https://www.bloom3d.studio/', timeout=30000, wait_until='domcontentloaded')
        await page.wait_for_timeout(3000)

        # Let's inspect the Webflow interaction / GSAP animation on .advantage_divider
        adv_info = await page.evaluate('''() => {
            const section = document.querySelector('.section_advantages');
            const items = document.querySelectorAll('.advantage');
            return {
                sectionTop: section ? section.getBoundingClientRect().top + window.scrollY : 0,
                sectionHeight: section ? section.offsetHeight : 0,
                items: Array.from(items).map((it, i) => {
                    const divider = it.querySelector('.advantage_divider');
                    return {
                        i,
                        html: it.outerHTML.substring(0, 200),
                        dividerClass: divider?.className,
                        dividerStyle: divider?.getAttribute('style'),
                    };
                })
            };
        }''')
        print("Adv info:", adv_info)

        # Now let's scroll through the advantages section and capture divider styles every 100px
        start_y = int(adv_info['sectionTop'])
        height = int(adv_info['sectionHeight'])
        print(f"Scrolling from {start_y} to {start_y + height}...")

        records = []
        for sy in range(start_y, start_y + height, 150):
            await page.evaluate(f'window.scrollTo(0, {sy})')
            await page.wait_for_timeout(200)
            rec = await page.evaluate('''() => {
                const items = document.querySelectorAll('.advantage');
                return Array.from(items).map((it, i) => {
                    const divider = it.querySelector('.advantage_divider');
                    const body = it.querySelector('.advantage_body');
                    return {
                        i,
                        dividerWidth: divider ? window.getComputedStyle(divider).width : null,
                        dividerTransform: divider ? window.getComputedStyle(divider).transform : null,
                        dividerStyle: divider ? divider.getAttribute('style') : null,
                        bodyHeight: body ? window.getComputedStyle(body).height : null,
                    };
                });
            }''')
            records.append({'sy': sy, 'diff': sy - start_y, 'rec': rec})

        for r in records[:15]:
            print(f"Diff {r['diff']}px:")
            for item in r['rec']:
                print(f"  Item {item['i']}: dividerWidth={item['dividerWidth']}, style={item['dividerStyle']}")

        await browser.close()

asyncio.run(inspect_bloom_stroke())

