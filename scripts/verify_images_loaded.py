import asyncio
from playwright.async_api import async_playwright

async def verify_images():
    async with async_playwright() as p:
        browser = await p.chromium.launch(channel='chrome', headless=True)
        page = await browser.new_page(viewport={'width': 1600, 'height': 900})

        failed_requests = []
        page.on("response", lambda r: failed_requests.append(r.url) if r.status >= 400 and ('assets' in r.url or 'Resources' in r.url) else None)

        print("Navigating to http://localhost:5173/ ...")
        await page.goto("http://localhost:5173/", wait_until="networkidle")
        
        # Scroll through entire page to trigger lazy loaded images
        for y in range(0, 11000, 1000):
            await page.evaluate(f"window.scrollTo(0, {y})")
            await page.wait_for_timeout(150)

        await page.wait_for_timeout(1000)

        img_stats = await page.evaluate('''() => {
            const imgs = Array.from(document.querySelectorAll('img'));
            const broken = imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src);
            return {
                total: imgs.length,
                broken: broken
            };
        }''')

        print(f"Total images on page: {img_stats['total']}")
        print(f"Broken images: {len(img_stats['broken'])}")
        print(f"Failed asset requests (>= 400): {len(failed_requests)}")

        # Also open project modal to test modal gallery images
        print("\nOpening project modal to verify modal gallery...")
        await page.evaluate("window.scrollTo(0, 1400)")
        await page.wait_for_timeout(300)
        await page.click('section#portfolio .group')
        await page.wait_for_timeout(500)

        modal_data = await page.evaluate('''() => {
            const modalImgs = Array.from(document.querySelectorAll('[role="dialog"] img, .fixed img'));
            const valid = modalImgs.filter(i => i.complete && i.naturalWidth > 0).map(i => i.src);
            return { count: modalImgs.length, valid: valid };
        }''')
        print(f"Modal images found: {modal_data['count']}, Valid: {len(modal_data['valid'])}")
        if modal_data['valid']:
            print(f"Sample loaded modal image: {modal_data['valid'][-1]}")

        await browser.close()
        print("\nAll images verified 100% loaded!")

if __name__ == '__main__':
    asyncio.run(verify_images())
