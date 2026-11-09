from playwright.sync_api import sync_playwright
import json

def inspect_card_details():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        data = page.evaluate("""() => {
            const card = document.querySelector('.portfolio_project');
            const img = card ? card.querySelector('.portfolio_project_img') : null;
            const overlay = card ? card.querySelector('.portfolio_project_overlay') : null;
            const info = card ? card.querySelector('.portfolio_project_info') : null;
            const title = card ? card.querySelector('.portfolio_project_title') : null;
            const location = card ? card.querySelector('.portfolio_project_text') : null;
            const underline = card ? card.querySelector('.project_btn_underline') : null;

            function getStyles(el) {
                if (!el) return null;
                const s = window.getComputedStyle(el);
                return {
                    tag: el.tagName,
                    class: el.className,
                    position: s.position,
                    top: s.top,
                    bottom: s.bottom,
                    left: s.left,
                    right: s.right,
                    padding: s.padding,
                    margin: s.margin,
                    display: s.display,
                    fontSize: s.fontSize,
                    fontWeight: s.fontWeight,
                    lineHeight: s.lineHeight,
                    color: s.color,
                    background: s.background,
                    backgroundColor: s.backgroundColor,
                    opacity: s.opacity,
                    transform: s.transform,
                    transition: s.transition
                };
            }

            return {
                card: getStyles(card),
                img: getStyles(img),
                overlay: getStyles(overlay),
                info: getStyles(info),
                title: getStyles(title),
                location: getStyles(location),
                underline: getStyles(underline),
            };
        }""")

        print(json.dumps(data, indent=2))
        browser.close()

if __name__ == "__main__":
    inspect_card_details()

