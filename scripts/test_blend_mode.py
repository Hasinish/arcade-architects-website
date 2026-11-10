from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("http://localhost:5173/", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(1000)

        # Apply mix-blend-mode: difference to header
        page.evaluate("""() => {
            const header = document.querySelector('header');
            header.style.mixBlendMode = 'difference';
            const logo = header.querySelector('a');
            const burger = header.querySelector('button');
            
            // In difference mode, pure white #ffffff inverts black to white and white to black
            logo.className = logo.className.replace(/text-\\[.*?\\]/g, '') + ' text-white';
            const img = logo.querySelector('img');
            if (img) img.style.filter = 'brightness(0) invert(1)';
            
            const bars = burger.querySelectorAll('span');
            bars.forEach(b => {
                b.className = b.className.replace(/bg-\\[.*?\\]/g, '') + ' bg-white';
            });
        }""")
        page.wait_for_timeout(200)

        # Test at hero
        page.screenshot(path="audit/frames/blend_hero.png", clip={"x": 0, "y": 0, "width": 1440, "height": 140})

        # Test at portfolio (y = 1200)
        page.evaluate("window.scrollTo(0, 1200)")
        page.wait_for_timeout(300)
        page.screenshot(path="audit/frames/blend_portfolio.png", clip={"x": 0, "y": 0, "width": 1440, "height": 140})

        # Test at services (y = 4200)
        page.evaluate("window.scrollTo(0, 4200)")
        page.wait_for_timeout(300)
        page.screenshot(path="audit/frames/blend_services.png", clip={"x": 0, "y": 0, "width": 1440, "height": 140})

        # Test at about (y = 5200)
        page.evaluate("window.scrollTo(0, 5200)")
        page.wait_for_timeout(300)
        page.screenshot(path="audit/frames/blend_about.png", clip={"x": 0, "y": 0, "width": 1440, "height": 140})

        print("Captured blend test screenshots.")
        browser.close()

if __name__ == "__main__":
    main()

