import json
from playwright.sync_api import sync_playwright

def inspect_portfolio():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        # Scroll to portfolio section
        page.evaluate("window.scrollTo(0, 950)")
        page.wait_for_timeout(500)

        data = page.evaluate("""() => {
            const portfolio = document.querySelector('.section_portfolio, [class*=\"portfolio\"]');
            if (!portfolio) return null;

            const pRect = portfolio.getBoundingClientRect();
            const pStyle = window.getComputedStyle(portfolio);

            // Find all headings inside portfolio
            const headings = Array.from(portfolio.querySelectorAll('h1, h2, h3, h4, [class*=\"title\"], [class*=\"heading\"]')).map(h => {
                const s = window.getComputedStyle(h);
                const r = h.getBoundingClientRect();
                return {
                    tag: h.tagName,
                    class: h.className,
                    text: h.textContent.trim(),
                    fontSize: s.fontSize,
                    fontWeight: s.fontWeight,
                    lineHeight: s.lineHeight,
                    letterSpacing: s.letterSpacing,
                    textAlign: s.textAlign,
                    color: s.color,
                    marginTop: s.marginTop,
                    marginBottom: s.marginBottom,
                    rect: { top: r.top, left: r.left, width: r.width, height: r.height }
                };
            });

            // Find project cards / links
            const cards = Array.from(portfolio.querySelectorAll('a, [class*=\"card\"], [class*=\"item\"], [class*=\"project\"]')).filter(el => {
                const img = el.querySelector('img');
                const r = el.getBoundingClientRect();
                return img && r.width > 200 && r.height > 200;
            });

            // Unique cards by rect or element
            const uniqueCards = Array.from(new Set(cards)).map((card, idx) => {
                const r = card.getBoundingClientRect();
                const s = window.getComputedStyle(card);
                const img = card.querySelector('img');
                const imgStyle = img ? window.getComputedStyle(img) : null;
                const imgRect = img ? img.getBoundingClientRect() : null;
                
                // texts inside card
                const texts = Array.from(card.querySelectorAll('*')).filter(el => {
                    return el.children.length === 0 && el.textContent.trim().length > 0;
                }).map(t => ({
                    tag: t.tagName,
                    class: t.className,
                    text: t.textContent.trim(),
                    fontSize: window.getComputedStyle(t).fontSize,
                    color: window.getComputedStyle(t).color,
                    opacity: window.getComputedStyle(t).opacity,
                    transform: window.getComputedStyle(t).transform
                }));

                return {
                    index: idx,
                    tag: card.tagName,
                    class: card.className,
                    rect: { top: r.top, left: r.left, width: r.width, height: r.height },
                    borderRadius: s.borderRadius,
                    overflow: s.overflow,
                    img: {
                        src: img?.src,
                        width: imgRect?.width,
                        height: imgRect?.height,
                        objectFit: imgStyle?.objectFit,
                        transition: imgStyle?.transition
                    },
                    texts
                };
            });

            // Grid or layout containers
            const grids = Array.from(portfolio.querySelectorAll('div')).filter(d => {
                const s = window.getComputedStyle(d);
                return s.display.includes('grid') || s.display.includes('flex');
            }).map(d => {
                const s = window.getComputedStyle(d);
                const r = d.getBoundingClientRect();
                return {
                    class: d.className,
                    display: s.display,
                    gridTemplateColumns: s.gridTemplateColumns,
                    gap: s.gap,
                    rowGap: s.rowGap,
                    columnGap: s.columnGap,
                    padding: s.padding,
                    margin: s.margin,
                    width: r.width,
                    height: r.height
                };
            });

            return {
                portfolio: {
                    rect: { width: pRect.width, height: pRect.height, top: pRect.top },
                    backgroundColor: pStyle.backgroundColor,
                    padding: pStyle.padding
                },
                headings,
                cardsCount: uniqueCards.length,
                cards: uniqueCards,
                grids: grids.slice(0, 10)
            };
        }""")

        with open("audit/bloom_portfolio_data.json", "w") as f:
            json.dump(data, f, indent=2)

        # Now test hover on the first card
        print("Testing hover on first card...")
        first_card = page.locator(".section_portfolio a").first
        if first_card.count() > 0:
            box = first_card.bounding_box()
            page.mouse.move(box["x"] + box["width"]/2, box["y"] + box["height"]/2)
            page.wait_for_timeout(500)
            hover_data = page.evaluate("""() => {
                const card = document.querySelector('.section_portfolio a');
                if (!card) return null;
                const img = card.querySelector('img');
                const overlay = card.querySelector('[class*=\"overlay\"], [class*=\"cover\"], div');
                const texts = Array.from(card.querySelectorAll('*')).map(t => ({
                    tag: t.tagName,
                    class: t.className,
                    text: t.textContent.trim(),
                    opacity: window.getComputedStyle(t).opacity,
                    transform: window.getComputedStyle(t).transform,
                    color: window.getComputedStyle(t).color
                }));
                return {
                    imgTransform: img ? window.getComputedStyle(img).transform : null,
                    imgTransition: img ? window.getComputedStyle(img).transition : null,
                    texts
                };
            }""")
            print("Hover Data:", json.dumps(hover_data, indent=2))
            with open("audit/bloom_portfolio_hover.json", "w") as f:
                json.dump(hover_data, f, indent=2)

        page.screenshot(path="audit/frames/bloom_portfolio_inspected.png", full_page=False)
        print("Inspection saved to audit/bloom_portfolio_data.json")
        browser.close()

if __name__ == "__main__":
    inspect_portfolio()

