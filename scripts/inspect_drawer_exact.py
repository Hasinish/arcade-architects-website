from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome", headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("https://www.bloom3d.studio/", wait_until="domcontentloaded")
    page.wait_for_timeout(2500)

    # Click the menu
    burger = page.query_selector('.navbar_menu_btn, .menu-button, [class*="burger"], [class*="menu_btn"]')
    if burger:
        burger.click()
        page.wait_for_timeout(1000)

    drawer_data = page.evaluate("""() => {
        const navMenu = document.querySelector('.nav_menu, .w-nav-menu, [class*="drawer"], [class*="menu_wrap"], [class*="nav_panel"]');
        const burger = document.querySelector('.navbar_menu_btn, .menu-button, [class*="burger"], [class*="menu_btn"]');
        const logo = document.querySelector('.nav_logo, [class*="logo"]');
        
        // Find links inside the open menu
        const menuLinks = Array.from(document.querySelectorAll('.nav_menu a, .w-nav-menu a, [class*="menu"] a')).map(a => {
            const cs = window.getComputedStyle(a);
            return {
                text: a.innerText.trim(),
                className: a.className,
                fontSize: cs.fontSize,
                fontWeight: cs.fontWeight,
                fontFamily: cs.fontFamily,
                color: cs.color,
                padding: cs.padding,
                margin: cs.margin,
                lineHeight: cs.lineHeight,
                letterSpacing: cs.letterSpacing
            };
        });

        const drawerStyle = navMenu ? window.getComputedStyle(navMenu) : null;
        const burgerStyle = burger ? window.getComputedStyle(burger) : null;
        const logoStyle = logo ? window.getComputedStyle(logo) : null;

        // Header container
        const header = document.querySelector('.nav_component, header, .navigation, .w-nav');
        const headerStyle = header ? window.getComputedStyle(header) : null;

        // Close button or burger state inside menu
        const closeBtn = document.querySelector('.nav_close, .menu_close, [class*="close"]');
        const closeBtnStyle = closeBtn ? window.getComputedStyle(closeBtn) : null;

        return {
            headerHtml: header ? header.outerHTML.slice(0, 800) : null,
            navMenuHtml: navMenu ? navMenu.outerHTML.slice(0, 1500) : null,
            headerStyle: headerStyle ? {
                position: headerStyle.position,
                top: headerStyle.top,
                left: headerStyle.left,
                right: headerStyle.right,
                padding: headerStyle.padding,
                zIndex: headerStyle.zIndex
            } : null,
            drawerStyle: drawerStyle ? {
                width: drawerStyle.width,
                maxWidth: drawerStyle.maxWidth,
                backgroundColor: drawerStyle.backgroundColor,
                padding: drawerStyle.padding,
                position: drawerStyle.position,
                right: drawerStyle.right,
                top: drawerStyle.top,
                bottom: drawerStyle.bottom,
                boxShadow: drawerStyle.boxShadow,
                transform: drawerStyle.transform,
                transition: drawerStyle.transition,
                zIndex: drawerStyle.zIndex
            } : null,
            burgerStyle: burgerStyle ? {
                width: burgerStyle.width,
                height: burgerStyle.height,
                padding: burgerStyle.padding,
                position: burgerStyle.position,
                top: burgerStyle.top,
                right: burgerStyle.right
            } : null,
            burgerLines: Array.from(document.querySelectorAll('.navbar_menu_btn span, .navbar_menu_btn div')).map(el => {
                const s = window.getComputedStyle(el);
                return {
                    width: s.width,
                    height: s.height,
                    backgroundColor: s.backgroundColor,
                    margin: s.margin,
                    borderRadius: s.borderRadius
                };
            }),
            logoStyle: logoStyle ? {
                width: logoStyle.width,
                height: logoStyle.height,
                position: logoStyle.position,
                top: logoStyle.top,
                left: logoStyle.left
            } : null,
            links: menuLinks
        };
    }""")

    with open("audit/drawer_exact.json", "w", encoding="utf-8") as f:
        json.dump(drawer_data, f, indent=2)

    print("Drawer exact metrics saved!")
    browser.close()

