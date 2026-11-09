import json
from playwright.sync_api import sync_playwright

def inspect():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        print("Navigating to Bloom3D...")
        page.goto("https://www.bloom3d.studio/", wait_until="networkidle", timeout=60000)
        page.wait_for_timeout(3000)

        # Inspect elements at scroll positions 0, 200, 400, 600, 900, 1200
        scroll_positions = [0, 200, 400, 600, 900, 1200]
        results = []

        # Find the hero container, hero video, and portfolio container
        structure = page.evaluate("""() => {
            const bodyChildren = Array.from(document.body.children).map((el, i) => {
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                return {
                    index: i,
                    tag: el.tagName,
                    id: el.id,
                    className: el.className,
                    rect: { top: rect.top, bottom: rect.bottom, height: rect.height, width: rect.width },
                    position: style.position,
                    top: style.top,
                    zIndex: style.zIndex,
                    overflow: style.overflow
                };
            });

            // Let's also look for Webflow sections or whatever Bloom3D is built with
            const sections = Array.from(document.querySelectorAll('div, section')).filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.height > 400 && rect.width > 1000;
            }).slice(0, 15).map(el => {
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                return {
                    tag: el.tagName,
                    id: el.id,
                    class: (el.className || '').toString().slice(0, 50),
                    rect: { top: rect.top, bottom: rect.bottom, height: rect.height },
                    position: style.position,
                    top: style.top,
                    zIndex: style.zIndex,
                    overflow: style.overflow,
                    transform: style.transform
                };
            });

            return { bodyChildren, sections };
        }""")

        with open("audit/bloom_structure.json", "w") as f:
            json.dump(structure, f, indent=2)
        print("Saved audit/bloom_structure.json")

        # Now let's scroll and log getBoundingClientRect of key elements
        for y in scroll_positions:
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(500)
            data = page.evaluate(f"""() => {{
                // Find hero and portfolio
                const video = document.querySelector('video');
                const hero = video ? video.closest('div, section') : null;
                // find the section containing projects or portfolio
                const images = Array.from(document.querySelectorAll('img'));
                // let's grab top 5 main container divs
                const mainDivs = Array.from(document.querySelectorAll('body > div, body > section, main > div')).map(el => {{
                    const r = el.getBoundingClientRect();
                    return {{
                        tag: el.tagName,
                        class: (el.className || '').toString().slice(0, 40),
                        top: r.top,
                        bottom: r.bottom,
                        height: r.height,
                        transform: window.getComputedStyle(el).transform
                    }};
                }});
                return {{
                    scrollY: window.scrollY,
                    mainDivs
                }};
            }}""")
            results.append(data)
            page.screenshot(path=f"audit/frames/bloom_curtain_exact_y{y}.png")

        with open("audit/bloom_scroll_metrics.json", "w") as f:
            json.dump(results, f, indent=2)
        print("Saved audit/bloom_scroll_metrics.json and screenshots.")

        browser.close()

if __name__ == "__main__":
    inspect()

