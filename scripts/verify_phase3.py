import json
import os
from PIL import Image
from playwright.sync_api import sync_playwright

def verify_phase3():
    os.makedirs("audit/frames", exist_ok=True)
    os.makedirs("audit/comparisons", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")

        # -------------------------------------------------------------
        # 1. Inspect Localhost Portfolio at 1440x900
        # -------------------------------------------------------------
        print("Testing Localhost Portfolio...")
        p_local = browser.new_page(viewport={"width": 1440, "height": 900})
        p_local.goto("http://localhost:5173/", wait_until="load", timeout=20000)
        p_local.wait_for_timeout(1000)

        # Scroll so portfolio heading is near the top
        p_local.evaluate("window.scrollTo(0, 950)")
        p_local.wait_for_timeout(500)

        local_metrics = p_local.evaluate("""() => {
            const heading = document.querySelector('#portfolio h2');
            const cards = Array.from(document.querySelectorAll('#portfolio .group'));
            const csH = heading ? window.getComputedStyle(heading) : null;
            const rH = heading ? heading.getBoundingClientRect() : null;

            const cardMetrics = cards.slice(0, 5).map((c, i) => {
                const r = c.getBoundingClientRect();
                return {
                    index: i,
                    left: r.left,
                    top: r.top,
                    width: r.width,
                    height: r.height,
                    aspectRatio: (r.width / r.height).toFixed(3)
                };
            });

            return {
                heading: {
                    text: heading?.textContent?.trim(),
                    fontSize: csH?.fontSize,
                    fontWeight: csH?.fontWeight,
                    lineHeight: csH?.lineHeight,
                    letterSpacing: csH?.letterSpacing,
                    textAlign: csH?.textAlign,
                    color: csH?.color,
                    top: rH?.top
                },
                row1Gap: cardMetrics[1] ? (cardMetrics[1].left - (cardMetrics[0].left + cardMetrics[0].width)) : null,
                row2Gap: cardMetrics[3] ? (cardMetrics[3].left - (cardMetrics[2].left + cardMetrics[2].width)) : null,
                cards: cardMetrics
            };
        }""")
        print("Local Metrics:", json.dumps(local_metrics, indent=2))
        p_local.screenshot(path="audit/frames/local_portfolio_overview.png")

        # Test hover on Card 0
        first_card = p_local.locator("#portfolio .group").first
        f_box = first_card.bounding_box()
        p_local.mouse.move(f_box["x"] + f_box["width"]/2, f_box["y"] + f_box["height"]/2)
        p_local.wait_for_timeout(400)
        p_local.screenshot(path="audit/frames/local_portfolio_hover.png")

        local_hover = p_local.evaluate("""() => {
            const card = document.querySelector('#portfolio .group');
            const img = card ? card.querySelector('img') : null;
            const titleWrap = card ? card.querySelector('.translate-y-8') : null;
            return {
                imgTransform: img ? window.getComputedStyle(img).transform : null,
                titleWrapTransform: titleWrap ? window.getComputedStyle(titleWrap).transform : null
            };
        }""")
        print("Local Hover:", local_hover)

        # -------------------------------------------------------------
        # 2. Inspect Bloom3D Portfolio at 1440x900
        # -------------------------------------------------------------
        print("Testing Bloom3D Portfolio...")
        p_bloom = browser.new_page(viewport={"width": 1440, "height": 900})
        p_bloom.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        p_bloom.wait_for_timeout(1500)

        p_bloom.evaluate("window.scrollTo(0, 950)")
        p_bloom.wait_for_timeout(500)

        bloom_metrics = p_bloom.evaluate("""() => {
            const heading = document.querySelector('.section_portfolio h2.portfolio_heading');
            const cards = Array.from(document.querySelectorAll('.portfolio_project'));
            const csH = heading ? window.getComputedStyle(heading) : null;
            const rH = heading ? heading.getBoundingClientRect() : null;

            const cardMetrics = cards.slice(0, 5).map((c, i) => {
                const r = c.getBoundingClientRect();
                return {
                    index: i,
                    left: r.left,
                    top: r.top,
                    width: r.width,
                    height: r.height,
                    aspectRatio: (r.width / r.height).toFixed(3)
                };
            });

            return {
                heading: {
                    text: heading?.textContent?.trim(),
                    fontSize: csH?.fontSize,
                    fontWeight: csH?.fontWeight,
                    lineHeight: csH?.lineHeight,
                    letterSpacing: csH?.letterSpacing,
                    textAlign: csH?.textAlign,
                    color: csH?.color,
                    top: rH?.top
                },
                row1Gap: cardMetrics[1] ? (cardMetrics[1].left - (cardMetrics[0].left + cardMetrics[0].width)) : null,
                row2Gap: cardMetrics[3] ? (cardMetrics[3].left - (cardMetrics[2].left + cardMetrics[2].width)) : null,
                cards: cardMetrics
            };
        }""")
        print("Bloom Metrics:", json.dumps(bloom_metrics, indent=2))
        p_bloom.screenshot(path="audit/frames/bloom_portfolio_overview.png")

        # Test hover on Bloom first card
        b_first = p_bloom.locator(".section_portfolio .portfolio_project").first
        b_box = b_first.bounding_box()
        p_bloom.mouse.move(b_box["x"] + b_box["width"]/2, b_box["y"] + b_box["height"]/2)
        p_bloom.wait_for_timeout(400)
        p_bloom.screenshot(path="audit/frames/bloom_portfolio_hover.png")

        # -------------------------------------------------------------
        # 3. Side-by-Side Comparisons
        # -------------------------------------------------------------
        # Overview comparison
        img_b = Image.open("audit/frames/bloom_portfolio_overview.png")
        img_l = Image.open("audit/frames/local_portfolio_overview.png")
        comp = Image.new("RGB", (img_b.width + img_l.width, img_b.height))
        comp.paste(img_b, (0, 0))
        comp.paste(img_l, (img_b.width, 0))
        comp.save("audit/comparisons/comp_phase3_portfolio_overview.png")
        print("Saved audit/comparisons/comp_phase3_portfolio_overview.png")

        # Hover comparison
        img_bh = Image.open("audit/frames/bloom_portfolio_hover.png")
        img_lh = Image.open("audit/frames/local_portfolio_hover.png")
        comp_h = Image.new("RGB", (img_bh.width + img_lh.width, img_bh.height))
        comp_h.paste(img_bh, (0, 0))
        comp_h.paste(img_lh, (img_bh.width, 0))
        comp_h.save("audit/comparisons/comp_phase3_portfolio_hover.png")
        print("Saved audit/comparisons/comp_phase3_portfolio_hover.png")

        # -------------------------------------------------------------
        # 4. Verify Scroll Curtain Still Works Perfectly
        # -------------------------------------------------------------
        p_local.evaluate("window.scrollTo(0, 0)")
        p_local.wait_for_timeout(200)
        p_local.evaluate("window.scrollTo(0, 450)")
        p_local.wait_for_timeout(200)
        p_local.screenshot(path="audit/frames/local_curtain_with_phase3.png")

        with open("audit/phase3_verification_data.json", "w") as f:
            json.dump({"local": local_metrics, "bloom": bloom_metrics, "hover": local_hover}, f, indent=2)

        p_local.close()
        p_bloom.close()
        browser.close()
        print("Phase 3 verification complete!")

if __name__ == "__main__":
    verify_phase3()

