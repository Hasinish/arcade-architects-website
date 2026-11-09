from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("https://www.bloom3d.studio/", wait_until="domcontentloaded")
    page.wait_for_timeout(2000)

    # Inspect burger in closed state
    burger_closed = page.evaluate("""() => {
        const b = document.querySelector('.navbar_menu_btn');
        return {
            html: b ? b.outerHTML : null,
            rect: b ? b.getBoundingClientRect() : null
        };
    }""")

    # Click burger
    page.click('.navbar_menu_btn')
    page.wait_for_timeout(1000)

    # Inspect burger in open state
    burger_open = page.evaluate("""() => {
        const b = document.querySelector('.navbar_menu_btn');
        return {
            html: b ? b.outerHTML : null,
            rect: b ? b.getBoundingClientRect() : null,
            classes: b ? b.className : null
        };
    }""")

    print("CLOSED:", json.dumps(burger_closed, indent=2))
    print("OPEN:", json.dumps(burger_open, indent=2))
    browser.close()

