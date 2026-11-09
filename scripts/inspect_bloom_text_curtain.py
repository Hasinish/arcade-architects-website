from playwright.sync_api import sync_playwright
import json

def inspect_bloom_text_and_curtain():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        results = []
        for y in [0, 100, 200, 300, 450, 600, 750, 900]:
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(200)
            data = page.evaluate("""() => {
                const heading = document.querySelector('h1');
                const port = document.querySelector('.section_portfolio');
                const video = document.querySelector('video');
                const csHeading = heading ? window.getComputedStyle(heading) : null;
                const rHeading = heading ? heading.getBoundingClientRect() : null;
                const rPort = port ? port.getBoundingClientRect() : null;
                const rVideo = video ? video.getBoundingClientRect() : null;
                return {
                    scrollY: window.scrollY,
                    heading: {
                        top: rHeading?.top,
                        opacity: csHeading?.opacity,
                        transform: csHeading?.transform
                    },
                    portfolio: {
                        top: rPort?.top
                    },
                    video: {
                        top: rVideo?.top
                    }
                };
            }""")
            results.append(data)
            page.screenshot(path=f"audit/frames/bloom_curtain_verify_y{y}.png")
        
        print(json.dumps(results, indent=2))
        browser.close()

if __name__ == "__main__":
    inspect_bloom_text_and_curtain()

