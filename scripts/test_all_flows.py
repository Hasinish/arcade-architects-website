import asyncio
from PIL import Image
from playwright.async_api import async_playwright

async def audit_all_flows():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        # FLOW 1: Home -> Menu -> Portfolio -> Hover
        print('=== FLOW 1: Home -> Menu -> Portfolio ===')
        await page.goto('http://localhost:5173/', wait_until='domcontentloaded')
        await page.wait_for_timeout(1000)
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(500)
        await page.click('button:has-text("Portfolio")')
        await page.wait_for_timeout(1800)

        # Hover first project card
        card1 = page.locator('#portfolio a[data-cursor="view"]').first
        box1 = await card1.bounding_box()
        if box1:
            await page.mouse.move(box1['x'] + box1['width']/2, box1['y'] + box1['height']/2)
            await page.wait_for_timeout(500)
            await page.screenshot(path='audit/flow1_portfolio_hover.png')

        # FLOW 2: Home -> Menu -> Services -> Hover/Drag
        print('=== FLOW 2: Home -> Menu -> Services ===')
        await page.goto('http://localhost:5173/', wait_until='domcontentloaded')
        await page.wait_for_timeout(1000)
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(500)
        await page.click('button:has-text("Services")')
        await page.wait_for_timeout(1800)

        # Hover on active slide
        await page.mouse.move(720, 450)
        await page.wait_for_timeout(500)
        await page.screenshot(path='audit/flow2_services_hover.png')

        # FLOW 3: Home -> Menu -> About -> Scroll
        print('=== FLOW 3: Home -> Menu -> About ===')
        await page.goto('http://localhost:5173/', wait_until='domcontentloaded')
        await page.wait_for_timeout(1000)
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(500)
        await page.click('button:has-text("About")')
        await page.wait_for_timeout(1800)
        await page.screenshot(path='audit/flow3_about_landing.png')

        # FLOW 4: Contacts -> Menu -> About
        print('=== FLOW 4: Contacts -> Menu -> About ===')
        await page.goto('http://localhost:5173/contacts', wait_until='domcontentloaded')
        await page.wait_for_timeout(1000)
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(500)
        await page.click('button:has-text("About")')
        await page.wait_for_timeout(2500)
        await page.screenshot(path='audit/flow4_contacts_to_about.png')

        print('All flows captured.')
        await browser.close()

if __name__ == '__main__':
    asyncio.run(audit_all_flows())

