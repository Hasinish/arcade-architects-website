from playwright.sync_api import sync_playwright
import json

def inspect_carousel_code():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        data = page.evaluate("""() => {
            // Find scripts mentioning carousel or 3d
            const scripts = Array.from(document.querySelectorAll('script')).map(s => s.innerText || s.src).filter(t => t.includes('carousel') || t.includes('3d') || t.includes('ScrollTrigger'));
            
            // Check window globals
            const globals = Object.keys(window).filter(k => k.toLowerCase().includes('carousel') || k.toLowerCase().includes('gsap') || k.toLowerCase().includes('swiper'));

            // Check how carousel DOM is structured
            const carouselWrapper = document.querySelector('.carousel_wrapper, [class*=\"carousel\"]');
            const parent = carouselWrapper ? carouselWrapper.parentElement : null;

            return {
                carouselWrapper: carouselWrapper ? {
                    class: carouselWrapper.className,
                    innerHTML: carouselWrapper.innerHTML.slice(0, 1000),
                    childrenCount: carouselWrapper.children.length,
                    childrenClasses: Array.from(carouselWrapper.children).map(c => c.className)
                } : null,
                parent: parent ? {
                    tag: parent.tagName,
                    class: parent.className,
                    style: parent.getAttribute('style')
                } : null,
                globals,
                scriptsCount: scripts.length
            };
        }""")

        print(json.dumps(data, indent=2))
        browser.close()

if __name__ == "__main__":
    inspect_carousel_code()

