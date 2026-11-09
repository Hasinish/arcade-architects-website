from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("https://www.bloom3d.studio/", wait_until="domcontentloaded")
    page.wait_for_timeout(2000)

    burger = page.query_selector('.navbar_menu_btn, .menu-button')
    if burger:
        burger.click()
        page.wait_for_timeout(1000)

    btn_details = page.evaluate("""() => {
        const btns = Array.from(document.querySelectorAll('.navbar_nav_inner .u-btn')).map(b => {
            const inner = b.querySelector('div') || b;
            const cs = window.getComputedStyle(inner);
            return {
                html: b.innerHTML,
                innerBg: cs.backgroundColor,
                innerColor: cs.color,
                borderRadius: cs.borderRadius,
                padding: cs.padding,
                height: cs.height,
                border: cs.border
            };
        });
        return btns;
    }""")

    print(json.dumps(btn_details, indent=2))
    browser.close()

