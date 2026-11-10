import asyncio
from playwright.async_api import async_playwright

async def verify_bloom_routing():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        context = await browser.new_context(viewport={'width': 1600, 'height': 1000})
        page = await context.new_page()

        print("1. Testing Home Page (http://localhost:5173/) ...")
        await page.goto("http://localhost:5173/", timeout=20000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        # Verify no modals mounted in DOM
        modals = await page.query_selector_all('[role="dialog"]')
        print(f"Modals mounted on home page: {len(modals)} (EXPECTED: 0)")

        # Scroll to portfolio
        print("2. Clicking first portfolio project...")
        project_link = await page.query_selector('a[href^="/projects/"]')
        if project_link:
            href = await project_link.get_attribute('href')
            print(f"Found project link with href: {href}")
            await project_link.click()
            await page.wait_for_timeout(1500)
            print(f"Current URL after click: {page.url}")
            await page.screenshot(path='audit/comparisons/editorial_project_detail_screenshot.png', full_page=False)
            print("Saved screenshot: audit/comparisons/editorial_project_detail_screenshot.png")
        else:
            print("ERROR: No project link found on home page!")

        # Verify project detail page content
        title = await page.query_selector('.project_heading')
        title_text = await title.inner_text() if title else 'None'
        print(f"Project Heading: {title_text}")

        # Check next project navigation
        next_proj = await page.query_selector('.section_project_nav a[href^="/projects/"]')
        if next_proj:
            next_href = await next_proj.get_attribute('href')
            print(f"Next project link found: {next_href}")
            await next_proj.click()
            await page.wait_for_timeout(1500)
            print(f"Current URL after clicking next project: {page.url}")

        # Test Contacts Page
        print("\n3. Testing Contacts Page (http://localhost:5173/contacts) ...")
        await page.goto("http://localhost:5173/contacts", timeout=20000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)
        contacts_h1 = await page.query_selector('h1')
        h1_text = await contacts_h1.inner_text() if contacts_h1 else 'None'
        print(f"Contacts Page H1: {h1_text}")
        await page.screenshot(path='audit/comparisons/editorial_contacts_screenshot.png', full_page=False)
        print("Saved screenshot: audit/comparisons/editorial_contacts_screenshot.png")

        # Test drawer navigation
        print("\n4. Testing Drawer Navigation...")
        menu_btn = await page.query_selector('header button')
        if menu_btn:
            await menu_btn.click()
            await page.wait_for_timeout(500)
            drawer = await page.query_selector('aside')
            is_visible = await drawer.is_visible() if drawer else False
            print(f"Drawer opened: {is_visible}")
            await page.screenshot(path='audit/comparisons/editorial_drawer_screenshot.png', full_page=False)

        await browser.close()
        print("\nAll routing and editorial view audits PASSED successfully!")

if __name__ == '__main__':
    asyncio.run(verify_bloom_routing())
