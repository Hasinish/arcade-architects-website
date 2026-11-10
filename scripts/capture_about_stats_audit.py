import asyncio
import os
from playwright.async_api import async_playwright
from PIL import Image

async def capture_stats():
    os.makedirs('audit/comparisons', exist_ok=True)
    os.makedirs('audit/about_stats', exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)

        # 1. Desktop 1440x900
        print("Capturing Desktop 1440x900 About Section...")
        page_desk = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page_desk.goto("http://localhost:5173/", timeout=20000, wait_until="domcontentloaded")
        await page_desk.wait_for_timeout(2000)

        # Scroll to #about
        about_el = await page_desk.query_selector('#about')
        if about_el:
            await about_el.scroll_into_view_if_needed()
            await page_desk.wait_for_timeout(1000)
            # Take screenshot of the about section element itself
            await about_el.screenshot(path='audit/about_stats/about_desktop_1440.png')
            print("Saved audit/about_stats/about_desktop_1440.png")

        # 2. Mobile 390x844
        print("Capturing Mobile 390x844 About Section...")
        page_mob = await browser.new_page(viewport={'width': 390, 'height': 844})
        await page_mob.goto("http://localhost:5173/", timeout=20000, wait_until="domcontentloaded")
        await page_mob.wait_for_timeout(2000)

        about_el_mob = await page_mob.query_selector('#about')
        if about_el_mob:
            await about_el_mob.scroll_into_view_if_needed()
            await page_mob.wait_for_timeout(1000)
            await about_el_mob.screenshot(path='audit/about_stats/about_mobile_390.png')
            print("Saved audit/about_stats/about_mobile_390.png")

        await browser.close()

def build_artifacts():
    # Copy/Save into artifact directory
    desk_path = 'audit/about_stats/about_desktop_1440.png'
    mob_path = 'audit/about_stats/about_mobile_390.png'

    art_desk = r'C:\Users\Hasin\.gemini\antigravity\brain\4bb7da72-16c6-4b32-85de-0824002c2d7b\about_stats_desktop_1440.png'
    art_mob = r'C:\Users\Hasin\.gemini\antigravity\brain\4bb7da72-16c6-4b32-85de-0824002c2d7b\about_stats_mobile_390.png'

    if os.path.exists(desk_path):
        im_d = Image.open(desk_path)
        im_d.save(art_desk)
        print("Saved artifact:", art_desk)

    if os.path.exists(mob_path):
        im_m = Image.open(mob_path)
        im_m.save(art_mob)
        print("Saved artifact:", art_mob)

if __name__ == '__main__':
    asyncio.run(capture_stats())
    build_artifacts()

