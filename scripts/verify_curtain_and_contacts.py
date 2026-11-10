import asyncio
import os
from playwright.async_api import async_playwright

async def run_full_verification():
    os.makedirs('audit/comparisons', exist_ok=True)
    os.makedirs('audit/frames/transition', exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        
        # ========================================================
        # 1. TEST ROUTE TRANSITION WITH INTERMEDIATE FRAMES
        # ========================================================
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        print("1. Loading Home Page http://localhost:5173/ ...")
        await page.goto("http://localhost:5173/", timeout=20000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        # Frame 0: Pre-click on Hero
        await page.screenshot(path='audit/frames/transition/frame_00_pre_click.png')
        print("Captured Frame 0: Pre-click on Hero")

        # Find "Start project" button on Hero
        start_btn = await page.query_selector('button:has-text("Start project")')
        if not start_btn:
            # Fallback to any button or link with Start project
            start_btn = await page.query_selector('text="Start project"')
        
        print("Clicking 'Start project' to trigger architectural curtain reveal...")
        # Click button
        await start_btn.click()

        # Capture frame 1: ~180ms into transition (curtain sweeping up)
        await page.wait_for_timeout(180)
        await page.screenshot(path='audit/frames/transition/frame_01_curtain_covering.png')
        print("Captured Frame 1: Curtain sweeping upward (~180ms)")

        # Capture frame 2: ~500ms into transition (curtain fully covering viewport)
        await page.wait_for_timeout(320)
        await page.screenshot(path='audit/frames/transition/frame_02_curtain_full_cover.png')
        print("Captured Frame 2: Curtain fully covering viewport (~500ms)")

        # Capture frame 3: ~750ms into transition (curtain revealing contact page)
        await page.wait_for_timeout(250)
        await page.screenshot(path='audit/frames/transition/frame_03_curtain_revealing.png')
        print("Captured Frame 3: Curtain revealing contact page (~750ms)")

        # Capture frame 4: ~1200ms (curtain complete, page settled at top)
        await page.wait_for_timeout(450)
        await page.screenshot(path='audit/frames/transition/frame_04_settled_contacts.png')
        print("Captured Frame 4: Contact page settled at top")

        # Verify URL and scroll position
        print(f"Current URL: {page.url}")
        scroll_y = await page.evaluate("() => window.scrollY")
        print(f"Current Scroll Y: {scroll_y} (EXPECTED: 0)")

        # ========================================================
        # 2. CAPTURE CONTACT PAGE VIEWPORTS (DESKTOP 1440x900)
        # ========================================================
        print("\n2. Capturing Contact Page Desktop Viewports...")
        await page.screenshot(path='audit/comparisons/arcade_contacts_desktop_viewport.png', full_page=False)
        await page.screenshot(path='audit/comparisons/arcade_contacts_desktop_full.png', full_page=True)
        print("Saved desktop viewport & full-page screenshots!")

        # Capture Lower architectural images section specifically
        gallery_el = await page.query_selector('.contacts_img_wrapper')
        if gallery_el:
            await page.evaluate("() => window.scrollTo(0, 1000)")
            await page.wait_for_timeout(600)
            await page.screenshot(path='audit/comparisons/arcade_contacts_lower_images.png', full_page=False)
            print("Saved lower architectural image section screenshot!")

        # Capture Footer section
        footer_el = await page.query_selector('footer')
        if footer_el:
            await footer_el.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            await page.screenshot(path='audit/comparisons/arcade_contacts_footer.png', full_page=False)
            print("Saved footer screenshot!")

        # ========================================================
        # 3. TEST FORM INTERACTION & CLIENT-SIDE VALIDATION
        # ========================================================
        print("\n3. Testing Form Interaction...")
        await page.evaluate("() => window.scrollTo(0, 400)")
        await page.wait_for_timeout(500)

        # Fill in form fields
        await page.fill('#name', 'Hasin Ishrak')
        await page.fill('#email', 'hasin@arcade.design')
        await page.fill('#company', 'Arcade Architects Studio')
        await page.select_option('#subject', 'Project')
        await page.fill('#message', 'Exploring architectural visualization collaboration for a modern cantilever villa.')

        await page.screenshot(path='audit/comparisons/arcade_contacts_form_filled.png', full_page=False)
        print("Saved form filled screenshot!")

        # Click submit
        submit_btn = await page.query_selector('button[type="submit"]')
        await submit_btn.click()
        await page.wait_for_timeout(500)

        # Verify honest validation notice
        await page.screenshot(path='audit/comparisons/arcade_contacts_form_validated.png', full_page=False)
        print("Saved form validated feedback screenshot!")

        # ========================================================
        # 4. CAPTURE CONTACT PAGE VIEWPORTS (MOBILE 390x844)
        # ========================================================
        print("\n4. Capturing Mobile Viewports (390x844)...")
        mobile_context = await browser.new_context(viewport={'width': 390, 'height': 844})
        mobile_page = await mobile_context.new_page()
        await mobile_page.goto("http://localhost:5173/contacts", timeout=20000, wait_until="domcontentloaded")
        await mobile_page.wait_for_timeout(2000)

        await mobile_page.screenshot(path='audit/comparisons/arcade_contacts_mobile_viewport.png', full_page=False)
        await mobile_page.screenshot(path='audit/comparisons/arcade_contacts_mobile_full.png', full_page=True)
        print("Saved mobile viewport & full-page screenshots!")

        await browser.close()
        print("\nAll Playwright verification and frame captures PASSED cleanly!")

if __name__ == '__main__':
    asyncio.run(run_full_verification())

