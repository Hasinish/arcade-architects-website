import json
import os
from PIL import Image
from playwright.sync_api import sync_playwright

def verify_positioning():
    os.makedirs("audit/frames", exist_ok=True)
    os.makedirs("audit/comparisons", exist_ok=True)

    widths = [1440, 1648, 1920]
    comparison_results = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")

        for w in widths:
            print(f"\n--- Testing at Viewport Width {w}px ---")
            
            # 1. Localhost
            p_local = browser.new_page(viewport={"width": w, "height": 900})
            p_local.goto("http://localhost:5173/", wait_until="load", timeout=20000)
            p_local.wait_for_timeout(1000)

            local_data = p_local.evaluate("""() => {
                const logo = document.querySelector('header a');
                const burger = document.querySelector('header button');
                const burgerIcon = document.querySelector('header button > div');
                const h1 = document.querySelector('h1');
                const buttonsWrap = document.querySelector('section .pointer-events-auto.flex.items-center');
                const startBtn = document.querySelector('section button');

                const rLogo = logo ? logo.getBoundingClientRect() : null;
                const rBurger = burger ? burger.getBoundingClientRect() : null;
                const rBurgerIcon = burgerIcon ? burgerIcon.getBoundingClientRect() : null;
                const rH1 = h1 ? h1.getBoundingClientRect() : null;
                const rWrap = buttonsWrap ? buttonsWrap.getBoundingClientRect() : null;

                return {
                    width: window.innerWidth,
                    logoLeft: rLogo ? rLogo.left : null,
                    logoTop: rLogo ? rLogo.top : null,
                    burgerRight: rBurger ? window.innerWidth - rBurger.right : null,
                    burgerIconRight: rBurgerIcon ? window.innerWidth - rBurgerIcon.right : null,
                    burgerTop: rBurger ? rBurger.top : null,
                    h1Left: rH1 ? rH1.left : null,
                    h1Bottom: rH1 ? window.innerHeight - rH1.bottom : null,
                    h1Width: rH1 ? rH1.width : null,
                    buttonsRight: rWrap ? window.innerWidth - rWrap.right : null,
                    buttonsBottom: rWrap ? window.innerHeight - rWrap.bottom : null
                };
            }""")
            p_local.screenshot(path=f"audit/frames/local_pos_{w}.png")
            print(f"Local {w}px:", json.dumps(local_data, indent=2))

            # 2. Bloom3D
            p_bloom = browser.new_page(viewport={"width": w, "height": 900})
            p_bloom.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
            p_bloom.wait_for_timeout(1500)

            bloom_data = p_bloom.evaluate("""() => {
                const logo = document.querySelector('.navbar a');
                const burger = document.querySelector('.navbar_menu_btn');
                const burgerIcon = document.querySelector('.navbar_menu_btn svg, .navbar_menu_btn_icon');
                const h1 = document.querySelector('h1');
                const startBtn = Array.from(document.querySelectorAll('.section_hero a, .section_hero button')).filter(e => e.textContent.includes('Start project') || e.textContent.includes('project'))[0];
                const rLogo = logo ? logo.getBoundingClientRect() : null;
                const rBurger = burger ? burger.getBoundingClientRect() : null;
                const rBurgerIcon = burgerIcon ? burgerIcon.getBoundingClientRect() : null;
                const rH1 = h1 ? h1.getBoundingClientRect() : null;
                const rStart = startBtn ? startBtn.getBoundingClientRect() : null;

                return {
                    width: window.innerWidth,
                    logoLeft: rLogo ? rLogo.left : null,
                    logoTop: rLogo ? rLogo.top : null,
                    burgerRight: rBurger ? window.innerWidth - rBurger.right : null,
                    burgerIconRight: rBurgerIcon ? window.innerWidth - rBurgerIcon.right : null,
                    burgerTop: rBurger ? rBurger.top : null,
                    h1Left: rH1 ? rH1.left : null,
                    h1Bottom: rH1 ? window.innerHeight - rH1.bottom : null,
                    h1Width: rH1 ? rH1.width : null,
                    buttonsRight: rStart ? window.innerWidth - rStart.right : null,
                    buttonsBottom: rStart ? window.innerHeight - rStart.bottom : null
                };
            }""")
            p_bloom.screenshot(path=f"audit/frames/bloom_pos_{w}.png")
            print(f"Bloom {w}px:", json.dumps(bloom_data, indent=2))

            # 3. Create Side-by-Side Comparison Image
            img_b = Image.open(f"audit/frames/bloom_pos_{w}.png")
            img_l = Image.open(f"audit/frames/local_pos_{w}.png")
            combined = Image.new("RGB", (img_b.width + img_l.width, img_b.height))
            combined.paste(img_b, (0, 0))
            combined.paste(img_l, (img_b.width, 0))
            comp_path = f"audit/comparisons/comp_pos_fix_{w}.png"
            combined.save(comp_path)
            print(f"Saved {comp_path}")

            comparison_results[str(w)] = {
                "local": local_data,
                "bloom": bloom_data
            }

            p_local.close()
            p_bloom.close()

        # 4. Verify Curtain Scroll is still working
        print("\n--- Verifying Scroll Curtain Animation Integrity ---")
        p_scroll = browser.new_page(viewport={"width": 1648, "height": 900})
        p_scroll.goto("http://localhost:5173/", wait_until="load", timeout=20000)
        p_scroll.wait_for_timeout(1000)
        
        scroll_tests = []
        for y in [0, 300, 600, 900]:
            p_scroll.evaluate(f"window.scrollTo(0, {y})")
            p_scroll.wait_for_timeout(200)
            data = p_scroll.evaluate("""() => {
                const video = document.querySelector('video');
                const port = document.querySelector('#portfolio');
                return {
                    scrollY: window.scrollY,
                    videoTop: video ? video.getBoundingClientRect().top : null,
                    portfolioTop: port ? port.getBoundingClientRect().top : null
                };
            }""")
            scroll_tests.append(data)
            p_scroll.screenshot(path=f"audit/frames/local_scroll_curtain_verify_y{y}.png")
            print(f"Scroll y={y}:", data)

        comparison_results["scroll_curtain_check"] = scroll_tests
        p_scroll.close()
        browser.close()

        with open("audit/positioning_verification_data.json", "w") as f:
            json.dump(comparison_results, f, indent=2)
        print("\nAll verifications completed successfully!")

if __name__ == "__main__":
    verify_positioning()

