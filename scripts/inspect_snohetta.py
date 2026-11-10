from playwright.sync_api import sync_playwright
import json
import time

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        
        print("Navigating to https://www.snohetta.com/ ...")
        page.goto("https://www.snohetta.com/", wait_until="networkidle", timeout=45000)
        page.wait_for_timeout(3000)
        
        # Take full initial viewport screenshot
        page.screenshot(path="audit/frames/snohetta_initial_1440.png")
        print("Captured audit/frames/snohetta_initial_1440.png")

        # Inspect the gallery elements
        gallery_info = page.evaluate("""() => {
            // Find the image carousel / gallery near the top
            const allImgs = Array.from(document.querySelectorAll('img'));
            // Look for container holding multiple images in a row
            const candidates = Array.from(document.querySelectorAll('div, section')).filter(el => {
                const imgs = el.querySelectorAll('img');
                return imgs.length >= 3 && imgs.length <= 20;
            });

            // Let's find the carousel/slider specifically
            const carousels = candidates.map(c => ({
                tag: c.tagName,
                class: c.className,
                id: c.id,
                imgCount: c.querySelectorAll('img').length,
                rect: c.getBoundingClientRect(),
                style: {
                    display: window.getComputedStyle(c).display,
                    overflow: window.getComputedStyle(c).overflow,
                    transform: window.getComputedStyle(c).transform,
                    backgroundColor: window.getComputedStyle(c).backgroundColor
                }
            }));

            return {
                title: document.title,
                url: window.location.href,
                carousels: carousels.slice(0, 10),
                allImgs: allImgs.slice(0, 15).map(img => {
                    const r = img.getBoundingClientRect();
                    return {
                        src: img.src,
                        alt: img.alt,
                        rect: { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top },
                        class: img.className,
                        parentClass: img.parentElement ? img.parentElement.className : '',
                        grandParentClass: img.parentElement && img.parentElement.parentElement ? img.parentElement.parentElement.className : ''
                    };
                })
            };
        }""")

        with open("audit/snohetta_raw_info.json", "w", encoding="utf-8") as f:
            json.dump(gallery_info, f, indent=2)
            
        print("Saved audit/snohetta_raw_info.json")
        print(f"Found {len(gallery_info['allImgs'])} images on page")
        for i, img in enumerate(gallery_info['allImgs'][:8]):
            print(f"Img {i}: rect={img['rect']} parent={img['parentClass']}")

        browser.close()

if __name__ == "__main__":
    main()

