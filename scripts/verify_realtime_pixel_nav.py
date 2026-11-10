import asyncio
import os
from playwright.async_api import async_playwright

async def verify_realtime_pixel_nav():
    os.makedirs('audit/frames/navbar', exist_ok=True)
    os.makedirs('audit/comparisons', exist_ok=True)

    async with async_playwright() as p:
        # Launch Chrome channel
        browser = await p.chromium.launch(channel="chrome", headless=True)
        context = await browser.new_context(viewport={"width": 1600, "height": 900})
        page = await context.new_page()

        print("Navigating to http://localhost:5173/ ...")
        await page.goto("http://localhost:5173/", wait_until="networkidle")
        await page.wait_for_timeout(1000)

        # Test points across scroll
        test_scrolls = [
            {"name": "01_hero_video", "y": 0, "desc": "Hero full video background (Dark)"},
            {"name": "02_portfolio_heading", "y": 950, "desc": "Portfolio 'Featured Projects' heading on Stone #F7F7F7 (Light)"},
            {"name": "03_portfolio_row1_asymmetric", "y": 1400, "desc": "Portfolio Image Row 1 (Image pixel sampling)"},
            {"name": "04_portfolio_row2_mid", "y": 2300, "desc": "Portfolio Image Row 2 (Image pixel sampling)"},
            {"name": "05_snohetta_services", "y": 4200, "desc": "Snøhetta Services Gallery on Black #000000 (Dark)"},
            {"name": "06_about_manifesto", "y": 5500, "desc": "About Manifesto on Stone #F7F7F7 (Light)"},
            {"name": "07_cta_showreel", "y": 8800, "desc": "CTA Fullscreen Video/Showreel (Dark)"},
            {"name": "08_faq_section", "y": 9900, "desc": "FAQ Accordion on Stone #F7F7F7 (Light)"},
        ]

        results = []

        for item in test_scrolls:
            y = item["y"]
            name = item["name"]
            desc = item["desc"]

            await page.evaluate(f"window.scrollTo(0, {y})")
            await page.wait_for_timeout(400) # allow rAF & transition

            # Read computed styles and DOM classes
            nav_data = await page.evaluate("""() => {
                const logoLink = document.querySelector('header a');
                const logoImg = logoLink ? logoLink.querySelector('img') : null;
                const burgerBtn = document.querySelector('header button');
                const burgerSpans = burgerBtn ? burgerBtn.querySelectorAll('span') : [];

                const logoColor = logoLink ? window.getComputedStyle(logoLink).color : '';
                const logoFilter = logoImg ? window.getComputedStyle(logoImg).filter : '';
                const burgerBg = burgerSpans.length > 0 ? window.getComputedStyle(burgerSpans[0]).backgroundColor : '';

                return {
                    scrollY: window.scrollY,
                    logoColor,
                    logoFilter,
                    burgerBg,
                    logoClasses: logoLink ? logoLink.className : '',
                    burgerClasses: burgerSpans.length > 0 ? burgerSpans[0].className : ''
                };
            }""")

            # Capture header area screenshot
            screenshot_path = f"audit/frames/navbar/{name}_y{y}.png"
            header = page.locator("header")
            # Take screenshot of top 120px of viewport to see navbar with its background
            await page.screenshot(path=screenshot_path, clip={"x": 0, "y": 0, "width": 1600, "height": 140})

            results.append({
                "step": name,
                "desc": desc,
                "y": y,
                "logoColor": nav_data["logoColor"],
                "burgerBg": nav_data["burgerBg"],
                "logoFilter": nav_data["logoFilter"],
                "screenshot": screenshot_path
            })

            print(f"[{name}] Y={y} | Logo: {nav_data['logoColor']} | Burger: {nav_data['burgerBg']}")

        # Also test Drawer Open state
        print("\nTesting Drawer Open state...")
        await page.evaluate("window.scrollTo(0, 0)") # on dark hero
        await page.wait_for_timeout(300)
        await page.click('header button')
        await page.wait_for_timeout(600)

        drawer_data = await page.evaluate("""() => {
            const logoLink = document.querySelector('header a');
            const burgerBtn = document.querySelector('header button');
            const burgerSpans = burgerBtn ? burgerBtn.querySelectorAll('span') : [];

            return {
                logoColor: logoLink ? window.getComputedStyle(logoLink).color : '',
                burgerBg: burgerSpans.length > 0 ? window.getComputedStyle(burgerSpans[0]).backgroundColor : ''
            };
        }""")

        drawer_screenshot = "audit/frames/navbar/09_drawer_open.png"
        await page.screenshot(path=drawer_screenshot, clip={"x": 0, "y": 0, "width": 1600, "height": 400})
        print(f"[drawer_open] Logo: {drawer_data['logoColor']} | Burger: {drawer_data['burgerBg']}")

        await browser.close()
        print("\nReal-time pixel calculation verification complete!")

if __name__ == "__main__":
    asyncio.run(verify_realtime_pixel_nav())

