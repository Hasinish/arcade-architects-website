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

    btns = page.evaluate("""() => {
        const bottomBtns = Array.from(document.querySelectorAll('.navbar_nav_inner a, .navbar_nav_inner button')).map(btn => {
            const cs = window.getComputedStyle(btn);
            return {
                text: (btn.innerText || '').trim(),
                tag: btn.tagName,
                className: btn.className,
                backgroundColor: cs.backgroundColor,
                color: cs.color,
                borderRadius: cs.borderRadius,
                padding: cs.padding,
                height: cs.height,
                width: cs.width,
                fontSize: cs.fontSize,
                fontWeight: cs.fontWeight
            };
        });
        return bottomBtns;
    }""")

    print(json.dumps(btns, indent=2))
    browser.close()
