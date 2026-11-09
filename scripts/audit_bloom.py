import json
import time
from playwright.sync_api import sync_playwright

def run_audit():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("[1/6] Loading Bloom3D...")
        page.goto("https://www.bloom3d.studio/", timeout=45000, wait_until="domcontentloaded")
        page.wait_for_timeout(3000)

        # 1. Capture Hero at initial state
        print("[2/6] Capturing Hero and top bar...")
        page.screenshot(path="audit/bloom/01_hero.png")

        # Extract Header info
        header_data = page.evaluate("""() => {
            const header = document.querySelector('header, .header, .nav_component, .navigation, [data-animation="default"]');
            const logo = document.querySelector('.nav_logo, [class*="logo"]');
            const burger = document.querySelector('.nav_burger, .menu-button, [class*="burger"], [class*="menu_btn"]');
            const style = header ? window.getComputedStyle(header) : null;
            return {
                headerClass: header ? header.className : null,
                position: style ? style.position : null,
                top: style ? style.top : null,
                padding: style ? style.padding : null,
                background: style ? style.backgroundColor : null,
                backdropFilter: style ? style.backdropFilter : null,
                burgerClass: burger ? burger.className : null
            };
        }""")
        print("Header Data:", header_data)

        # 2. Test Menu click
        print("[3/6] Testing Menu Interaction...")
        menu_clicked = False
        try:
            burger_btn = page.query_selector('.nav_burger, .menu-button, [class*="burger"], [class*="menu_btn"], [aria-label*="menu" i]')
            if burger_btn:
                burger_btn.click()
                page.wait_for_timeout(1000)
                page.screenshot(path="audit/bloom/02_menu_open.png")
                menu_clicked = True
                # Close it back
                burger_btn.click()
                page.wait_for_timeout(800)
        except Exception as e:
            print("Menu click error:", e)

        # 3. Discover all sections & dimensions
        print("[4/6] Inspecting all sections...")
        sections_data = page.evaluate("""() => {
            const sections = Array.from(document.querySelectorAll('section, [class*="section_"]'));
            return sections.map((s, idx) => {
                const rect = s.getBoundingClientRect();
                const style = window.getComputedStyle(s);
                const heading = s.querySelector('h1, h2, h3, h4');
                return {
                    index: idx,
                    tagName: s.tagName,
                    className: s.className,
                    id: s.id,
                    top: rect.top + window.scrollY,
                    height: rect.height,
                    width: rect.width,
                    heading: heading ? heading.innerText.trim() : null,
                    backgroundColor: style.backgroundColor,
                    padding: style.padding,
                    overflow: style.overflow
                };
            });
        }""")
        print(f"Found {len(sections_data)} sections")

        # 4. Scroll down and screenshot each section
        print("[5/6] Capturing sections & intermediate scroll frames...")
        # Capture frames during scroll down to observe animations
        scroll_targets = [0, 500, 1000, 1600, 2400, 3200, 4200, 5200, 6400, 7800, 9200]
        for idx, y in enumerate(scroll_targets):
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(600)
            page.screenshot(path=f"audit/frames/bloom_scroll_{idx:02d}_y{y}.png")

        # Scroll to specific major sections and screenshot
        section_selectors = [
            ("portfolio", '[class*="section_portfolio"]'),
            ("services", '[class*="section_services"]'),
            ("about", '[class*="section_about"]'),
            ("advantages", '[class*="section_advantages"]'),
            ("faq", '[class*="section_faq"]'),
            ("cta_footer", '[class*="section_cta"], [class*="section_footer"]')
        ]

        for name, sel in section_selectors:
            el = page.query_selector(sel)
            if el:
                el.scroll_into_view_if_needed()
                page.wait_for_timeout(800)
                page.screenshot(path=f"audit/bloom/section_{name}.png")

        # Detailed Typography & Styles Extraction
        print("[6/6] Extracting typography and layout metrics...")
        detailed_metrics = page.evaluate("""() => {
            const getStyles = (sel) => {
                const el = document.querySelector(sel);
                if (!el) return null;
                const cs = window.getComputedStyle(el);
                const rect = el.getBoundingClientRect();
                return {
                    fontSize: cs.fontSize,
                    fontFamily: cs.fontFamily,
                    fontWeight: cs.fontWeight,
                    lineHeight: cs.lineHeight,
                    letterSpacing: cs.letterSpacing,
                    color: cs.color,
                    backgroundColor: cs.backgroundColor,
                    borderRadius: cs.borderRadius,
                    padding: cs.padding,
                    margin: cs.margin,
                    width: rect.width,
                    height: rect.height
                };
            };

            return {
                body: getStyles('body'),
                heroHeading: getStyles('.section_hero h1, .hero_wrapper h1, h1'),
                heroSubheading: getStyles('.hero_subheading, [class*="subheading"]'),
                heroBtns: getStyles('.hero_btns, [class*="hero_btn"]'),
                portfolioHeading: getStyles('.section_portfolio h2, [class*="section_portfolio"] h2'),
                portfolioCard: getStyles('.portfolio_project, [class*="portfolio_grid"] > div'),
                servicesHeading: getStyles('.section_services h2, [class*="section_services"] h2'),
                servicesCard: getStyles('.services_card, [class*="services_scale"]'),
                aboutHeading: getStyles('.section_about h2, [class*="section_about"] h2'),
                aboutNumbers: getStyles('.about_num, [class*="about_num"]'),
                faqQuestion: getStyles('.faq_question, [class*="faq"] h3, [class*="accordion"] h3'),
                footerHeadline: getStyles('.section_footer h2, .section_cta h2')
            };
        }""")

        results = {
            "header": header_data,
            "sections": sections_data,
            "metrics": detailed_metrics
        }

        with open("audit/bloom_metrics.json", "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)

        print("Bloom3D audit complete! Saved to audit/bloom_metrics.json")
        browser.close()

if __name__ == "__main__":
    run_audit()

