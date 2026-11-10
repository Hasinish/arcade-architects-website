import asyncio
import os
from playwright.async_api import async_playwright
from PIL import Image

async def verify_modals():
    os.makedirs('audit/frames/modals', exist_ok=True)
    os.makedirs('audit/comparisons', exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1600, 'height': 900})
        await page.goto('http://localhost:5173/', wait_until='networkidle')
        await page.wait_for_timeout(1000)

        # 1. Test ProjectModal
        print("Testing ProjectModal...")
        await page.evaluate("window.scrollTo(0, 1400)")
        await page.wait_for_timeout(400)
        await page.click('section#portfolio .group:first-child')
        await page.wait_for_timeout(600)

        pm_path = "audit/frames/modals/01_project_modal.png"
        await page.screenshot(path=pm_path)
        print(f"Captured: {pm_path}")

        # Test Right Arrow keyboard navigation
        await page.keyboard.press('ArrowRight')
        await page.wait_for_timeout(300)
        counter_text = await page.evaluate("() => document.querySelector('.font-mono.tracking-widest')?.textContent")
        print(f"Image counter after ArrowRight: {counter_text}")

        # Close ProjectModal
        await page.keyboard.press('Escape')
        await page.wait_for_timeout(400)

        # 2. Test InquiryModal via direct JS click on Hero button
        print("\nTesting InquiryModal...")
        await page.evaluate("window.scrollTo(0, 0)")
        await page.wait_for_timeout(300)
        await page.evaluate('''() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const discuss = btns.find(b => b.textContent.includes('Discuss the project'));
            if (discuss) discuss.click();
        }''')
        await page.wait_for_timeout(600)

        im_path = "audit/frames/modals/02_inquiry_modal.png"
        await page.screenshot(path=im_path)
        print(f"Captured: {im_path}")

        # Close InquiryModal
        await page.keyboard.press('Escape')
        await page.wait_for_timeout(400)

        # 3. Test ScheduleCallModal via direct JS click on Hero button
        print("\nTesting ScheduleCallModal...")
        await page.evaluate('''() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const sched = btns.find(b => b.textContent.includes('Schedule a call'));
            if (sched) sched.click();
        }''')
        await page.wait_for_timeout(600)

        sm_path = "audit/frames/modals/03_schedule_modal.png"
        await page.screenshot(path=sm_path)
        print(f"Captured: {sm_path}")

        await page.keyboard.press('Escape')
        await page.wait_for_timeout(400)

        await browser.close()

    # Create composite audit collage of all 3 modals
    print("\nCompositing modal audit collage...")
    img1 = Image.open(pm_path)
    img2 = Image.open(im_path)
    img3 = Image.open(sm_path)

    target_w, target_h = 800, 450
    t1 = img1.resize((target_w, target_h), Image.Resampling.LANCZOS)
    t2 = img2.resize((target_w, target_h), Image.Resampling.LANCZOS)
    t3 = img3.resize((target_w, target_h), Image.Resampling.LANCZOS)

    collage = Image.new("RGB", (target_w * 2, target_h * 2), "#111114")
    collage.paste(t1, (0, 0))
    collage.paste(t2, (target_w, 0))
    collage.paste(t3, (0, target_h))

    collage_path = "audit/comparisons/modals_architectural_audit.png"
    collage.save(collage_path)
    print(f"Collage saved to {collage_path}!")

if __name__ == '__main__':
    asyncio.run(verify_modals())
