from playwright.sync_api import sync_playwright
import json

def inspect_exact_cta():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        data = page.evaluate("""() => {
            const cta = document.querySelector('.section_cta');
            if (!cta) return null;

            const r = cta.getBoundingClientRect();
            const s = window.getComputedStyle(cta);
            const heading = cta.querySelector('h1, h2, h3, [class*=\"heading\"], [class*=\"title\"]');
            const video = cta.querySelector('video');
            const img = cta.querySelector('img');
            const bg = cta.querySelector('.cta_bg, [class*=\"bg\"]');
            const buttons = Array.from(cta.querySelectorAll('a, button')).map(b => ({
                text: b.textContent.trim(),
                class: b.className,
                rect: b.getBoundingClientRect(),
                style: {
                    background: window.getComputedStyle(b).backgroundColor,
                    color: window.getComputedStyle(b).color,
                    padding: window.getComputedStyle(b).padding,
                    height: window.getComputedStyle(b).height,
                    width: window.getComputedStyle(b).width
                }
            }));

            return {
                class: cta.className,
                rect: { top: r.top + window.scrollY, height: r.height, width: r.width },
                bgStyle: bg ? {
                    class: bg.className,
                    position: window.getComputedStyle(bg).position,
                    transform: window.getComputedStyle(bg).transform,
                    width: window.getComputedStyle(bg).width,
                    height: window.getComputedStyle(bg).height
                } : null,
                video: video ? {
                    src: video.querySelector('source')?.src || video.src,
                    poster: video.poster
                } : null,
                img: img ? { src: img.src } : null,
                heading: heading ? {
                    text: heading.innerText,
                    fontSize: window.getComputedStyle(heading).fontSize,
                    fontWeight: window.getComputedStyle(heading).fontWeight,
                    lineHeight: window.getComputedStyle(heading).lineHeight,
                    letterSpacing: window.getComputedStyle(heading).letterSpacing,
                    color: window.getComputedStyle(heading).color
                } : null,
                buttons
            };
        }""")

        print(json.dumps(data, indent=2))
        
        # Scroll to section_cta and take screenshot
        if data:
            page.evaluate(f"window.scrollTo(0, {data['rect']['top']})")
            page.wait_for_timeout(500)
            page.screenshot(path="audit/frames/bloom_cta_live.png")
            print("Captured audit/frames/bloom_cta_live.png")

        browser.close()

if __name__ == "__main__":
    inspect_exact_cta()

