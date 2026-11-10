from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("http://localhost:5173/", wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(1000)

        # Apply mix-blend-mode: difference directly to logo and burger
        page.evaluate("""() => {
            const header = document.querySelector('header');
            header.style.mixBlendMode = 'normal';
            
            const logo = header.querySelector('a');
            const burger = header.querySelector('button');
            
            logo.style.mixBlendMode = 'difference';
            logo.style.color = '#FFFFFF';
            const img = logo.querySelector('img');
            if (img) img.style.filter = 'brightness(0) invert(1)';
            
            burger.style.mixBlendMode = 'difference';
            const bars = burger.querySelectorAll('span');
            bars.forEach(b => {
                b.style.backgroundColor = '#FFFFFF';
            });
        }""")
        page.wait_for_timeout(200)

        page.screenshot(path="audit/frames/direct_blend_hero.png", clip={"x": 0, "y": 0, "width": 1440, "height": 140})

        page.evaluate("window.scrollTo(0, 1200)")
        page.wait_for_timeout(300)
        page.screenshot(path="audit/frames/direct_blend_portfolio.png", clip={"x": 0, "y": 0, "width": 1440, "height": 140})

        page.evaluate("window.scrollTo(0, 5200)")
        page.wait_for_timeout(300)
        page.screenshot(path="audit/frames/direct_blend_about.png", clip={"x": 0, "y": 0, "width": 1440, "height": 140})

        browser.close()

if __name__ == "__main__":
    main()

