from playwright.sync_api import sync_playwright
import json

def measure_widths():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        for w in [1440, 1648, 1920]:
            page = browser.new_page(viewport={"width": w, "height": 900})
            page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
            page.wait_for_timeout(1000)

            data = page.evaluate("""() => {
                const logo = document.querySelector('.navbar a');
                const burger = document.querySelector('.navbar_menu_btn');
                const burgerIcon = document.querySelector('.navbar_menu_btn svg, .navbar_menu_btn_icon');
                const h1 = document.querySelector('h1');
                const btn = Array.from(document.querySelectorAll('.section_hero a, .section_hero button')).filter(e => e.textContent.includes('Start project') || e.textContent.includes('project'))[0];
                return {
                    width: window.innerWidth,
                    logoLeft: logo ? logo.getBoundingClientRect().left : null,
                    burgerBtnRight: burger ? window.innerWidth - burger.getBoundingClientRect().right : null,
                    burgerIconRight: burgerIcon ? window.innerWidth - burgerIcon.getBoundingClientRect().right : null,
                    h1Left: h1 ? h1.getBoundingClientRect().left : null,
                    h1Bottom: h1 ? window.innerHeight - h1.getBoundingClientRect().bottom : null,
                    h1Width: h1 ? h1.getBoundingClientRect().width : null,
                    h1ComputedWidth: h1 ? window.getComputedStyle(h1).width : null,
                    h1ParentWidth: h1 ? h1.parentElement.getBoundingClientRect().width : null,
                    btnRight: btn ? window.innerWidth - btn.getBoundingClientRect().right : null,
                    btnBottom: btn ? window.innerHeight - btn.getBoundingClientRect().bottom : null,
                };
            }""")
            print(f"Width {w}:", json.dumps(data, indent=2))
            page.close()
        browser.close()

if __name__ == "__main__":
    measure_widths()

