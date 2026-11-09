import json
import os
from PIL import Image
from playwright.sync_api import sync_playwright

def verify():
    os.makedirs("audit/frames", exist_ok=True)
    os.makedirs("audit/comparisons", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")

        # 1. Test Localhost
        print("Testing Localhost...")
        p_local = browser.new_page(viewport={"width": 1440, "height": 900})
        p_local.goto("http://localhost:5173/", wait_until="load", timeout=20000)
        p_local.wait_for_timeout(1000)

        # Test wheel scrolling and get bounding client rects
        local_scroll_data = []
        scroll_offsets = [0, 200, 400, 600, 800, 900, 1100]

        for y in scroll_offsets:
            p_local.evaluate(f"window.scrollTo(0, {y})")
            p_local.wait_for_timeout(250)
            metrics = p_local.evaluate("""() => {
                const video = document.querySelector('video');
                const heroSection = document.querySelector('section');
                const stickyDiv = heroSection ? heroSection.querySelector('div') : null;
                const portfolio = document.querySelector('#portfolio');
                const heading = document.querySelector('h1');
                return {
                    scrollY: window.scrollY,
                    heroSectionTop: heroSection ? heroSection.getBoundingClientRect().top : null,
                    stickyDivTop: stickyDiv ? stickyDiv.getBoundingClientRect().top : null,
                    videoTop: video ? video.getBoundingClientRect().top : null,
                    headingTop: heading ? heading.getBoundingClientRect().top : null,
                    portfolioTop: portfolio ? portfolio.getBoundingClientRect().top : null
                };
            }""")
            local_scroll_data.append(metrics)
            p_local.screenshot(path=f"audit/frames/local_curtain_fixed_y{y}.png")
            print(f"Local y={y}:", metrics)

        # Also test with real mouse wheel
        print("Testing real mouse wheel...")
        p_local.evaluate("window.scrollTo(0, 0)")
        p_local.wait_for_timeout(200)
        p_local.mouse.move(720, 450)
        p_local.mouse.wheel(0, 400)
        p_local.wait_for_timeout(300)
        wheel_metrics = p_local.evaluate("""() => {
            const video = document.querySelector('video');
            const stickyDiv = document.querySelector('section > div');
            const portfolio = document.querySelector('#portfolio');
            return {
                scrollY: window.scrollY,
                stickyDivTop: stickyDiv?.getBoundingClientRect().top,
                videoTop: video?.getBoundingClientRect().top,
                portfolioTop: portfolio?.getBoundingClientRect().top
            };
        }""")
        print("Mouse wheel (deltaY=400) metrics:", wheel_metrics)
        p_local.screenshot(path="audit/frames/local_curtain_wheel_test.png")

        # 2. Capture Bloom3D at identical offsets
        print("Testing Bloom3D...")
        p_bloom = browser.new_page(viewport={"width": 1440, "height": 900})
        p_bloom.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        p_bloom.wait_for_timeout(2000)

        bloom_scroll_data = []
        for y in scroll_offsets:
            p_bloom.evaluate(f"window.scrollTo(0, {y})")
            p_bloom.wait_for_timeout(300)
            metrics = p_bloom.evaluate("""() => {
                const video = document.querySelector('video');
                const hero = document.querySelector('.section_hero');
                const portfolio = document.querySelector('.section_portfolio');
                const heading = document.querySelector('h1');
                return {
                    scrollY: window.scrollY,
                    heroTop: hero ? hero.getBoundingClientRect().top : null,
                    videoTop: video ? video.getBoundingClientRect().top : null,
                    headingTop: heading ? heading.getBoundingClientRect().top : null,
                    portfolioTop: portfolio ? portfolio.getBoundingClientRect().top : null
                };
            }""")
            bloom_scroll_data.append(metrics)
            p_bloom.screenshot(path=f"audit/frames/bloom_curtain_fixed_y{y}.png")
            print(f"Bloom y={y}:", metrics)

        browser.close()

        # 3. Create Side-by-Side Comparisons for all offsets
        for y in [0, 200, 400, 600, 800, 900]:
            bloom_path = f"audit/frames/bloom_curtain_fixed_y{y}.png"
            local_path = f"audit/frames/local_curtain_fixed_y{y}.png"
            if os.path.exists(bloom_path) and os.path.exists(local_path):
                img_b = Image.open(bloom_path)
                img_l = Image.open(local_path)
                
                # Combine horizontally: Bloom Left, Arcade Architects Right
                combined = Image.new("RGB", (img_b.width + img_l.width, img_b.height))
                combined.paste(img_b, (0, 0))
                combined.paste(img_l, (img_b.width, 0))
                comp_out = f"audit/comparisons/comp_curtain_fix_y{y}.png"
                combined.save(comp_out)
                print(f"Generated comparison: {comp_out}")

        with open("audit/curtain_verification_data.json", "w") as f:
            json.dump({"local": local_scroll_data, "bloom": bloom_scroll_data, "wheel": wheel_metrics}, f, indent=2)

        print("Verification complete!")

if __name__ == "__main__":
    verify()

