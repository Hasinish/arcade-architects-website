import asyncio
from playwright.async_api import async_playwright

async def record_user_flow():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        context = await browser.new_context(
            viewport={'width': 1440, 'height': 900}
        )
        page = await context.new_page()

        # Step 1: Open website
        print("1. Opening http://localhost:5173/")
        await page.goto('http://localhost:5173/')
        await page.wait_for_timeout(1000)

        # Step 2: Open navbar menu
        print("2. Opening Navbar Menu...")
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(600)

        # Step 3: Click Contacts
        print("3. Clicking Contacts...")
        await page.click('button:has-text("Contacts")')
        await page.wait_for_timeout(2000)
        print(f"URL: {page.url}")

        # Step 4: Click Logo to return to main page
        print("4. Clicking Logo...")
        await page.click('a:has-text("ARCADE ARCHITECTS")')
        await page.wait_for_timeout(2000)
        print(f"URL: {page.url}")

        # Step 5: Go to Why work with us
        print("5. Scrolling down towards Why work with us...")
        for i in range(25):
            await page.mouse.wheel(0, 300)
            await page.wait_for_timeout(120)

        # Take screenshot when reaching advantages
        await page.screenshot(path='audit/video_repro/step5_advantages.png')

        # Try clicking item 2 (Fast delivery)
        print("6. Clicking Item 2...")
        await page.click('#advantages .cursor-pointer:has-text("Fast delivery")')
        await page.wait_for_timeout(1500)
        await page.screenshot(path='audit/video_repro/step6_clicked_item2.png')

        # Try clicking item 4 (Architectural expertise)
        print("7. Clicking Item 4...")
        await page.click('#advantages .cursor-pointer:has-text("Architectural expertise")')
        await page.wait_for_timeout(1500)
        await page.screenshot(path='audit/video_repro/step7_clicked_item4.png')

        # Scroll further down past advantages
        print("8. Scrolling past advantages...")
        for i in range(15):
            await page.mouse.wheel(0, 300)
            await page.wait_for_timeout(120)

        # Scroll back up through advantages
        print("9. Scrolling back up into advantages...")
        for i in range(25):
            await page.mouse.wheel(0, -300)
            await page.wait_for_timeout(120)

        await page.screenshot(path='audit/video_repro/step9_scrolled_back_up.png')

        await context.close()
        await browser.close()
        print("Done recording video!")

if __name__ == '__main__':
    asyncio.run(record_user_flow())
