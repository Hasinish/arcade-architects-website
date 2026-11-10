import asyncio
import os
from playwright.async_api import async_playwright
from PIL import Image, ImageDraw

async def snap_badges():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        await page.goto("http://localhost:5173/", timeout=20000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)

        # 1. Scroll to portfolio section
        portfolio = await page.query_selector('#portfolio')
        if portfolio:
            await portfolio.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)

        card = await page.query_selector('[data-cursor="view"]')
        if card:
            await card.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            box = await card.bounding_box()
            if box:
                # Hover on card center
                target_x = box['x'] + box['width'] / 2
                target_y = box['y'] + box['height'] / 2
                await page.mouse.move(target_x, target_y)
                await page.wait_for_timeout(400)
                # Take screenshot cropped around target
                await page.screenshot(path='audit/cursor_final/badge_view_full.png')
                print(f"Captured VIEW badge at ({target_x}, {target_y})")

        # 2. Scroll to services section
        services = await page.query_selector('#services')
        if services:
            await services.scroll_into_view_if_needed()
            await page.wait_for_timeout(1000)

        drag_track = await page.query_selector('[data-cursor="drag"]')
        if drag_track:
            await drag_track.scroll_into_view_if_needed()
            await page.wait_for_timeout(500)
            box = await drag_track.bounding_box()
            if box:
                target_x = box['x'] + 300
                target_y = box['y'] + 200
                await page.mouse.move(target_x, target_y)
                await page.wait_for_timeout(400)
                await page.screenshot(path='audit/cursor_final/badge_drag_full.png')
                print(f"Captured DRAG badge at ({target_x}, {target_y})")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(snap_badges())

