import json
from playwright.sync_api import sync_playwright

def inspect_details():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        
        # 1. Inspect Bloom3D
        print("Inspecting Bloom3D...")
        p_bloom = browser.new_page(viewport={"width": 1440, "height": 900})
        p_bloom.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        p_bloom.wait_for_timeout(2000)

        bloom_info = p_bloom.evaluate("""() => {
            const video = document.querySelector('video');
            let el = video;
            const chain = [];
            while (el && el !== document.documentElement) {
                const s = window.getComputedStyle(el);
                const r = el.getBoundingClientRect();
                chain.push({
                    tag: el.tagName,
                    class: (el.className || '').toString(),
                    id: el.id,
                    position: s.position,
                    top: s.top,
                    zIndex: s.zIndex,
                    overflow: s.overflow,
                    overflowX: s.overflowX,
                    overflowY: s.overflowY,
                    height: r.height,
                    width: r.width,
                    topRect: r.top
                });
                el = el.parentElement;
            }

            // Find the portfolio section (the light section right after hero)
            const lightSection = Array.from(document.querySelectorAll('section, div')).find(e => {
                const s = window.getComputedStyle(e);
                const bg = s.backgroundColor;
                const r = e.getBoundingClientRect();
                return (bg.includes('247') || bg.includes('f7') || bg.includes('white') || bg.includes('255')) && r.height > 500 && r.top > 400;
            });

            let portfolioInfo = null;
            if (lightSection) {
                const s = window.getComputedStyle(lightSection);
                const r = lightSection.getBoundingClientRect();
                portfolioInfo = {
                    tag: lightSection.tagName,
                    class: (lightSection.className || '').toString(),
                    position: s.position,
                    top: s.top,
                    zIndex: s.zIndex,
                    topRect: r.top,
                    height: r.height,
                    bgColor: s.backgroundColor
                };
            }

            return { chain, portfolioInfo };
        }""")

        # 2. Inspect Localhost
        print("Inspecting Localhost...")
        p_local = browser.new_page(viewport={"width": 1440, "height": 900})
        p_local.goto("http://localhost:5173/", wait_until="load", timeout=15000)
        p_local.wait_for_timeout(1000)

        local_info = p_local.evaluate("""() => {
            const video = document.querySelector('video');
            let el = video;
            const chain = [];
            while (el && el !== document.documentElement) {
                const s = window.getComputedStyle(el);
                const r = el.getBoundingClientRect();
                chain.push({
                    tag: el.tagName,
                    class: (el.className || '').toString(),
                    id: el.id,
                    position: s.position,
                    top: s.top,
                    zIndex: s.zIndex,
                    overflow: s.overflow,
                    overflowX: s.overflowX,
                    overflowY: s.overflowY,
                    height: r.height,
                    width: r.width,
                    topRect: r.top
                });
                el = el.parentElement;
            }

            const portfolio = document.querySelector('#portfolio');
            let portfolioInfo = null;
            if (portfolio) {
                const s = window.getComputedStyle(portfolio);
                const r = portfolio.getBoundingClientRect();
                portfolioInfo = {
                    tag: portfolio.tagName,
                    class: (portfolio.className || '').toString(),
                    position: s.position,
                    top: s.top,
                    zIndex: s.zIndex,
                    topRect: r.top,
                    height: r.height,
                    bgColor: s.backgroundColor
                };
            }

            return { chain, portfolioInfo };
        }""")

        with open("audit/curtain_diagnostic.json", "w") as f:
            json.dump({"bloom": bloom_info, "local": local_info}, f, indent=2)

        print("Saved audit/curtain_diagnostic.json")

        # Now let's test scroll on localhost specifically and check if sticky hero sticks!
        scroll_tests = []
        for y in [0, 200, 400, 600, 800, 1000, 1400]:
            p_local.evaluate(f"window.scrollTo(0, {y})")
            p_local.wait_for_timeout(200)
            metrics = p_local.evaluate("""() => {
                const video = document.querySelector('video');
                const heroSection = document.querySelector('section');
                const stickyDiv = heroSection ? heroSection.querySelector('div') : null;
                const portfolio = document.querySelector('#portfolio');
                return {
                    scrollY: window.scrollY,
                    heroSectionTop: heroSection ? heroSection.getBoundingClientRect().top : null,
                    stickyDivTop: stickyDiv ? stickyDiv.getBoundingClientRect().top : null,
                    videoTop: video ? video.getBoundingClientRect().top : null,
                    portfolioTop: portfolio ? portfolio.getBoundingClientRect().top : null
                };
            }""")
            scroll_tests.append(metrics)
            p_local.screenshot(path=f"audit/frames/local_curtain_test_y{y}.png")

        with open("audit/local_scroll_test.json", "w") as f:
            json.dump(scroll_tests, f, indent=2)
        print("Saved audit/local_scroll_test.json")

        browser.close()

if __name__ == "__main__":
    inspect_details()
