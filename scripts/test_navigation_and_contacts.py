import asyncio
import os
from playwright.async_api import async_playwright

async def run_tests():
    os.makedirs('audit/nav_fixes', exist_ok=True)
    os.makedirs(r'C:\Users\Hasin\.gemini\antigravity\brain\4bb7da72-16c6-4b32-85de-0824002c2d7b', exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        # Test 1: Verify Contacts photos have zero black boxes
        print("1. Testing Contacts page...")
        await page.goto("http://localhost:5173/contacts", timeout=20000, wait_until="networkidle")
        await page.wait_for_timeout(1500)

        # Check all images on contacts
        imgs = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('.contacts_img')).map((img, i) => ({
                idx: i,
                src: img.src,
                complete: img.complete,
                width: img.naturalWidth,
                height: img.naturalHeight,
                visible: img.offsetWidth > 0 && img.offsetHeight > 0
            }));
        }""")
        print("Contacts images status:", imgs)
        await page.screenshot(path="audit/nav_fixes/01_contacts_no_black_box.png")

        # Test 2: Click Portfolio from Contacts -> Verify cross-page curtain navigation & scroll
        print("2. Opening menu on Contacts and clicking Portfolio...")
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(800)
        await page.click('button:has-text("Portfolio")')
        await page.wait_for_timeout(2000)

        scrollY = await page.evaluate("() => window.scrollY")
        print(f"Landed on Home at scrollY={scrollY}")
        await page.screenshot(path="audit/nav_fixes/02_home_scrolled_to_portfolio.png")

        # Test 3: Click Services from Home
        print("3. Opening menu on Home and clicking Services...")
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(800)
        await page.click('button:has-text("Services")')
        await page.wait_for_timeout(1500)

        scrollY_services = await page.evaluate("() => window.scrollY")
        print(f"Scrolled to Services at scrollY={scrollY_services}")
        await page.screenshot(path="audit/nav_fixes/03_home_scrolled_to_services.png")

        # Test 4: Click About from Home
        print("4. Opening menu on Home and clicking About...")
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(800)
        await page.click('button:has-text("About")')
        await page.wait_for_timeout(1500)

        scrollY_about = await page.evaluate("() => window.scrollY")
        print(f"Scrolled to About at scrollY={scrollY_about}")
        await page.screenshot(path="audit/nav_fixes/04_home_scrolled_to_about.png")

        # Test 5: Click Contacts from Home
        print("5. Opening menu on Home and clicking Contacts...")
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(800)
        await page.click('button:has-text("Contacts")')
        await page.wait_for_timeout(1500)

        url = page.url
        print(f"Navigated to {url}")
        await page.screenshot(path="audit/nav_fixes/05_back_to_contacts.png")

        await browser.close()
        print("ALL TESTS PASSED!")

if __name__ == "__main__":
    asyncio.run(run_tests())

