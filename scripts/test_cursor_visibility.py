import asyncio
import os
from playwright.async_api import async_playwright
from PIL import Image

async def test_cursor():
    os.makedirs('audit/cursor_test', exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        # 1. Contacts page has #F7F7F7 stone background and form inputs
        print("Visiting /contacts ...")
        await page.goto("http://localhost:5173/contacts", timeout=20000, wait_until="networkidle")
        await page.wait_for_timeout(1000)

        # Move mouse to an empty area of the stone left column
        await page.mouse.move(300, 300)
        await page.wait_for_timeout(400)
        await page.screenshot(path='audit/cursor_test/cursor_on_stone.png')
        print("Captured cursor on #F7F7F7 stone!")

        # Move mouse over a button/link (pointer state)
        await page.mouse.move(140, 460) # Over one of the social links or submit button
        await page.wait_for_timeout(400)
        await page.screenshot(path='audit/cursor_test/cursor_pointer_stone.png')
        print("Captured pointer cursor on stone!")

        # Move mouse over dark image in right column
        await page.mouse.move(1000, 400)
        await page.wait_for_timeout(400)
        await page.screenshot(path='audit/cursor_test/cursor_on_dark_image.png')
        print("Captured cursor on dark image!")

        # Let's also test on home page over pure white section or light section
        await page.goto("http://localhost:5173/", timeout=20000, wait_until="networkidle")
        await page.wait_for_timeout(1000)

        # Move over light curtain section (About section or Advantages)
        # Let's scroll down to About
        await page.evaluate("window.scrollTo(0, 1800)")
        await page.wait_for_timeout(500)
        await page.mouse.move(500, 500)
        await page.wait_for_timeout(400)
        await page.screenshot(path='audit/cursor_test/cursor_on_white_home.png')
        print("Captured cursor on home light section!")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(test_cursor())

