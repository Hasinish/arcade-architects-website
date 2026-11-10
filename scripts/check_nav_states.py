import asyncio
from playwright.async_api import async_playwright

async def check():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1600, 'height': 900})
        await page.goto('http://localhost:5173/', wait_until='networkidle')
        
        for y in [0, 950, 1200, 1500, 1800, 2400, 4500, 4800, 6000, 9500, 10300]:
            await page.evaluate(f"window.scrollTo(0, {y})")
            await page.wait_for_timeout(350)
            res = await page.evaluate('''() => {
                const logo = document.querySelector('header a');
                const burger = document.querySelector('header button span');
                return {
                    y: window.scrollY,
                    logoClass: logo?.className,
                    logoColor: logo ? window.getComputedStyle(logo).color : '',
                    burgerClass: burger?.className,
                    burgerBg: burger ? window.getComputedStyle(burger).backgroundColor : ''
                };
            }''')
            print(f"Y={res['y']:>5} | Logo: {res['logoColor']} ({'WHITE' if '255, 255, 255' in res['logoColor'] else 'DARK'}) | Burger: {res['burgerBg']} ({'WHITE' if '255, 255, 255' in res['burgerBg'] else 'DARK'})")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(check())

