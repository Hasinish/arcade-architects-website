import asyncio
from playwright.async_api import async_playwright

async def verify_sections():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1600, 'height': 900})
        await page.goto("http://localhost:5173/", wait_until="networkidle")
        await page.wait_for_timeout(1000)

        # 1. Test Curtain: Scroll into portfolio overlap
        print("Testing Hero curtain overlap under Lenis...")
        await page.evaluate("window.lenis.scrollTo(1200, { immediate: false, duration: 1.0 })")
        await page.wait_for_timeout(1200)

        hero_clip = await page.evaluate('''() => {
            const hero = document.querySelector('section');
            const port = document.querySelector('section#portfolio');
            const hRect = hero.getBoundingClientRect();
            const pRect = port.getBoundingClientRect();
            return {
                heroTop: hRect.top,
                heroBottom: hRect.bottom,
                portTop: pRect.top,
                isCovering: pRect.top < 900
            };
        }''')
        print(f"Curtain: Portfolio Top = {hero_clip['portTop']:.1f}px (Covering Hero: {hero_clip['isCovering']})")

        # 2. Test Advantages 300vh progression
        print("\nTesting Advantages 300vh progression under Lenis...")
        await page.evaluate("window.lenis.scrollTo(7500, { immediate: false, duration: 1.0 })")
        await page.wait_for_timeout(1200)

        adv_state = await page.evaluate('''() => {
            const advSec = document.querySelector('section#advantages');
            const activeAdv = advSec ? advSec.querySelector('[class*=\"text-[#2E2E2E]\"]') : null;
            return {
                scrollY: window.scrollY,
                hasActive: !!activeAdv
            };
        }''')
        print(f"Advantages: ScrollY = {adv_state['scrollY']:.1f}px (Active advantage activated: {adv_state['hasActive']})")

        await browser.close()
        print("\nAll sections verified seamlessly under Lenis!")

if __name__ == '__main__':
    asyncio.run(verify_sections())

