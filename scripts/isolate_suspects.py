import asyncio
from PIL import Image
from playwright.async_api import async_playwright

async def run_case(case_name, prep_fn=None):
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})

        await page.goto('http://localhost:5173/', wait_until='domcontentloaded')
        await page.wait_for_timeout(1000)

        if prep_fn:
            await prep_fn(page, 'before_open')

        # Open menu
        await page.click('button[aria-label="Open Navigation Menu"]')
        await page.wait_for_timeout(500)

        # Hover Contacts
        await page.hover('button:has-text("Contacts")')
        await page.wait_for_timeout(400)

        if prep_fn:
            await prep_fn(page, 'before_click')

        # Click Contacts
        await page.click('button:has-text("Contacts")')
        await page.wait_for_timeout(2000)

        if prep_fn:
            await prep_fn(page, 'after_nav')

        # Exact hover sequence:
        # Hover first wrapper
        wrapper0 = page.locator('.contacts_img_wrapper').first
        box0 = await wrapper0.bounding_box()
        await page.mouse.move(box0['x'] + box0['width']/2, box0['y'] + box0['height']/2)
        await page.wait_for_timeout(400)

        # Hover second wrapper (moving down)
        wrapper1 = page.locator('.contacts_img_wrapper').nth(1)
        box1 = await wrapper1.bounding_box()
        await page.mouse.move(box1['x'] + box1['width']/2, box1['y'] + box1['height']/2)
        await page.wait_for_timeout(400)

        # Capture screenshot
        shot_path = f'audit/isolate_{case_name}.png'
        await page.screenshot(path=shot_path)

        im = Image.open(shot_path)
        count_22 = sum(1 for x in range(720, 1440, 10) for y in range(0, 900, 10) if im.getpixel((x, y))[:3] == (22, 22, 22))
        pct = (count_22 / 6480) * 100
        p450 = im.getpixel((1080, 450))
        print(f'[{case_name}] pixel at (1080, 450) = {p450}, (22,22,22) count = {count_22} ({pct:.1f}%)')

        await browser.close()

async def main():
    print('Starting isolation tests...')

    # Case 1: Baseline Test B (no intervention)
    await run_case('1_baseline')

    # Case 2: Remove menu overlay after closed
    async def prep_remove_menu(page, phase):
        if phase == 'after_nav':
            await page.evaluate("""() => {
                const menu = document.querySelector('[data-lenis-prevent]');
                if (menu) menu.remove();
            }""")
    await run_case('2_remove_menu', prep_remove_menu)

    # Case 3: Set display:none on menu overlay after closed
    async def prep_display_none_menu(page, phase):
        if phase == 'after_nav':
            await page.evaluate("""() => {
                const menu = document.querySelector('[data-lenis-prevent]');
                if (menu) menu.style.display = 'none';
            }""")
    await run_case('3_display_none_menu', prep_display_none_menu)

    # Case 4: Remove CustomCursor
    async def prep_remove_cursor(page, phase):
        if phase == 'after_nav':
            await page.evaluate("""() => {
                const cursor = document.querySelector('[class*="z-[9998]"]');
                if (cursor) cursor.remove();
            }""")
    await run_case('4_remove_cursor', prep_remove_cursor)

    # Case 5: Remove hoverImages from inside menu
    async def prep_remove_hover_imgs(page, phase):
        if phase == 'after_nav':
            await page.evaluate("""() => {
                const menu = document.querySelector('[data-lenis-prevent]');
                if (menu) {
                    const bgLayer = menu.querySelector('.absolute.inset-0.pointer-events-none.z-0');
                    if (bgLayer) bgLayer.remove();
                }
            }""")
    await run_case('5_remove_hover_imgs_only', prep_remove_hover_imgs)

if __name__ == '__main__':
    asyncio.run(main())

