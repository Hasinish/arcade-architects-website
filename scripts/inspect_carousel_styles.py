from playwright.sync_api import sync_playwright
import json

def inspect_carousel_styles():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        data = page.evaluate("""() => {
            const container = document.querySelector('.carousel_container');
            const carousel = document.querySelector('.carousel');
            const card = document.querySelector('.carousel_card');
            const mask = document.querySelector('.carousel_mask');

            function getCss(el) {
                if (!el) return null;
                const s = window.getComputedStyle(el);
                return {
                    class: el.className,
                    perspective: s.perspective,
                    perspectiveOrigin: s.perspectiveOrigin,
                    transformStyle: s.transformStyle,
                    transform: s.transform,
                    width: s.width,
                    height: s.height,
                    overflow: s.overflow,
                    position: s.position,
                    display: s.display
                };
            }

            // Check how many cards are inside .carousel and what their inline styles are
            const cardsInfo = Array.from(document.querySelectorAll('.carousel_card')).map((c, i) => ({
                index: i,
                tag: c.tagName,
                class: c.className,
                styleAttr: c.getAttribute('style'),
                transform: window.getComputedStyle(c).transform,
                width: window.getComputedStyle(c).width,
                height: window.getComputedStyle(c).height,
                title: c.querySelector('.services_card_title')?.textContent.trim()
            }));

            // Check if there's custom CSS in any style tag mentioning carousel
            const styleTags = Array.from(document.querySelectorAll('style')).map(s => s.textContent).filter(t => t.includes('carousel'));

            return {
                container: getCss(container),
                carousel: getCss(carousel),
                card: getCss(card),
                mask: getCss(mask),
                cardsCount: cardsInfo.length,
                cardsInfo: cardsInfo.slice(0, 10),
                customStyles: styleTags
            };
        }""")

        print(json.dumps(data, indent=2))
        browser.close()

if __name__ == "__main__":
    inspect_carousel_styles()

