from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("https://www.bloom3d.studio/", wait_until="domcontentloaded")
    page.wait_for_timeout(2000)

    # Click the menu
    burger = page.query_selector('.navbar_menu_btn, .menu-button')
    if burger:
        burger.click()
        page.wait_for_timeout(1000)

    inner_info = page.evaluate("""() => {
        const inner = document.querySelector('.navbar_nav_inner');
        const style = inner ? window.getComputedStyle(inner) : null;
        const navWrapper = document.querySelector('.navbar_nav_wrapper');
        const navStyle = navWrapper ? window.getComputedStyle(navWrapper) : null;
        const burger = document.querySelector('.navbar_menu_btn');
        const burgerStyle = burger ? window.getComputedStyle(burger) : null;
        
        return {
            innerStyle: style ? {
                padding: style.padding,
                display: style.display,
                flexDirection: style.flexDirection,
                justifyContent: style.justifyContent,
                height: style.height,
                width: style.width
            } : null,
            navWrapperBackground: navStyle ? navStyle.backgroundColor : null,
            burgerColor: burgerStyle ? burgerStyle.color : null,
            burgerBg: burgerStyle ? burgerStyle.backgroundColor : null
        };
    }""")

    print(json.dumps(inner_info, indent=2))
    browser.close()

