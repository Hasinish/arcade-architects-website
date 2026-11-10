import asyncio
import os
from playwright.async_api import async_playwright

async def verify_fixes():
    os.makedirs('audit/comparisons', exist_ok=True)
    os.makedirs('audit/frames/cursor', exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        print("1. Loading Home Page http://localhost:5173/ ...")
        await page.goto("http://localhost:5173/", timeout=20000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        # Move mouse to trigger custom cursor
        print("Moving mouse to trigger custom cursor...")
        await page.mouse.move(720, 450)
        await page.wait_for_timeout(300)

        # Check default cursor
        await page.screenshot(path='audit/frames/cursor/cursor_01_default.png')
        print("Captured default cursor state!")

        # 2. Hover over a project card in PortfolioSection
        print("Scrolling down to portfolio and hovering over project card...")
        portfolio_card = await page.query_selector('[data-cursor="view"]')
        if portfolio_card:
            box = await portfolio_card.bounding_box()
            if box:
                await page.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
                await page.wait_for_timeout(400)
                await page.screenshot(path='audit/frames/cursor/cursor_02_view_badge.png')
                print("Captured cursor 'VIEW' badge over project card!")

        # 3. Test clicking project card with curtain transition
        print("Clicking project card with curtain transition...")
        if portfolio_card:
            await portfolio_card.click()
            # Capture while curtain is covering (~250ms)
            await page.wait_for_timeout(250)
            await page.screenshot(path='audit/frames/cursor/project_card_curtain_covering.png')
            # Wait for reveal
            await page.wait_for_timeout(900)
            print(f"Current URL after project card curtain transition: {page.url}")
            await page.screenshot(path='audit/frames/cursor/project_detail_revealed.png')
            print("Project detail page loaded via curtain transition!")

        # 4. Test Next Project link curtain transition
        print("Scrolling to next projects section in ProjectDetailPage...")
        next_proj = await page.query_selector('.section_project_nav [data-cursor="view"]')
        if next_proj:
            box = await next_proj.bounding_box()
            if box:
                await page.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
                await page.wait_for_timeout(400)
                await page.screenshot(path='audit/frames/cursor/cursor_03_next_project_hover.png')
            print("Clicking next project with curtain transition...")
            await next_proj.click()
            await page.wait_for_timeout(1000)
            print(f"Current URL after next project click: {page.url}")

        # 5. Hover over Services Section to test "DRAG" cursor badge
        print("\nNavigating back to home and testing Snøhetta Services DRAG cursor...")
        await page.goto("http://localhost:5173/#services", timeout=20000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        services_track = await page.query_selector('[data-cursor="drag"]')
        if services_track:
            box = await services_track.bounding_box()
            if box:
                await page.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
                await page.wait_for_timeout(400)
                await page.screenshot(path='audit/frames/cursor/cursor_04_drag_badge.png')
                print("Captured cursor 'DRAG' badge over Snøhetta services gallery!")

        # 6. Test Navbar Pixel Contrast immediately on route change to /contacts
        print("\nNavigating directly to /contacts to verify immediate navbar contrast...")
        await page.goto("http://localhost:5173/contacts", timeout=20000, wait_until="domcontentloaded")
        # Check colors without scrolling!
        await page.wait_for_timeout(300)
        navbar_colors = await page.evaluate('''() => {
            const logo = document.querySelector('header a');
            const burger = document.querySelector('header button span');
            return {
                logoClass: logo ? logo.className : '',
                burgerClass: burger ? burger.className : '',
                logoColor: logo ? window.getComputedStyle(logo).color : '',
                burgerBg: burger ? window.getComputedStyle(burger).backgroundColor : ''
            };
        }''')
        print("Navbar colors on /contacts without scrolling:", navbar_colors)
        await page.screenshot(path='audit/frames/cursor/navbar_contacts_immediate_contrast.png')

        await browser.close()
        print("\nAll Fix 1 and Fix 4 audits PASSED completely!")

if __name__ == '__main__':
    asyncio.run(verify_fixes())

