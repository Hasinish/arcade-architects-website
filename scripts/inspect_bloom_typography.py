import asyncio
from playwright.async_api import async_playwright

async def inspect_bloom_typography():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto("https://www.bloom3d.studio/contacts", timeout=30000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        data = await page.evaluate('''() => {
            const getProps = (selector) => {
                const el = document.querySelector(selector);
                if (!el) return null;
                const cs = window.getComputedStyle(el);
                return {
                    fontSize: cs.fontSize,
                    fontWeight: cs.fontWeight,
                    lineHeight: cs.lineHeight,
                    color: cs.color,
                    letterSpacing: cs.letterSpacing,
                    fontFamily: cs.fontFamily,
                    margin: cs.margin,
                    padding: cs.padding
                };
            };

            return {
                h1: getProps('.contacts_title'),
                subheading: getProps('.contacts_header .u-subheading-l'),
                quoteText: getProps('.contacts_quote_text'),
                quoteAuthor: getProps('.contacts_quote_title'),
                colTitle: getProps('.contacts_col_title'),
                colItem: getProps('.contacts_col_list_item_link'),
                inputTitle: getProps('.input_title'),
                inputField: getProps('.u-input'),
                button: getProps('.contacts_btn')
            };
        }''')
        import json
        print(json.dumps(data, indent=2))
        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_bloom_typography())

