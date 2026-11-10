from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.snohetta.com/", wait_until="networkidle", timeout=45000)
        page.wait_for_timeout(1000)

        # Inspect the DOM of the gallery track
        track_html = page.evaluate("""() => {
            const track = document.querySelector('.flex.no-js\\\\:overflow-auto, [class*="overflow-auto"]');
            if (!track) return null;
            return {
                parentClass: track.parentElement.className,
                grandParentClass: track.parentElement.parentElement.className,
                trackClass: track.className,
                trackStyle: track.getAttribute('style'),
                childrenCount: track.children.length,
                firstElementChildClass: track.children[0]?.className,
                firstElementChildStyle: track.children[0]?.getAttribute('style'),
                firstElementHtml: track.children[0]?.outerHTML.slice(0, 400)
            };
        }""")
        print("Track info:", track_html)

        # Check mobile viewport (390x844)
        page.set_viewport_size({"width": 390, "height": 844})
        page.wait_for_timeout(1000)
        page.screenshot(path="audit/frames/snohetta_mobile_390.png")
        print("Captured audit/frames/snohetta_mobile_390.png")

        mobile_imgs = page.evaluate("""() => {
            const imgs = Array.from(document.querySelectorAll('img')).filter(img => {
                const r = img.getBoundingClientRect();
                return r.top >= 150 && r.top <= 450 && r.width > 50;
            });
            return imgs.map((img, i) => {
                const r = img.getBoundingClientRect();
                return {
                    index: i,
                    rect: { x: r.x, y: r.y, width: r.width, height: r.height }
                };
            });
        }""")
        print("Mobile images:", mobile_imgs)

        browser.close()

if __name__ == "__main__":
    main()

