from playwright.sync_api import sync_playwright

def test_about_illumination():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("http://localhost:5173/", wait_until="load")
        page.wait_for_timeout(1000)

        about_top = page.evaluate("() => document.querySelector('#about').getBoundingClientRect().top + window.scrollY")
        print(f"About top: {about_top}")

        # Test at about_top - 800 (rect.top ~ 800px, entering bottom of viewport)
        for offset in [-800, -600, -400, -200, 0]:
            y = about_top + offset
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(200)
            data = page.evaluate("""() => {
                const text = document.querySelector('#about h2');
                const r = text.getBoundingClientRect();
                const spans = Array.from(text.querySelectorAll('span'));
                const colors = spans.map(s => s.style.color);
                const illuminatedCount = colors.filter(c => c.includes('rgb(46, 46, 46)') && !c.includes('0.18') && !c.includes('rgba')).length;
                return {
                    scrollY: window.scrollY,
                    textTop: r.top,
                    totalWords: spans.length,
                    illuminatedWords: illuminatedCount,
                    firstWordColor: colors[0],
                    lastWordColor: colors[colors.length - 1]
                };
            }""")
            print(f"offset={offset}:", data)
            page.screenshot(path=f"audit/frames/local_about_step_{offset}.png")

        browser.close()

if __name__ == "__main__":
    test_about_illumination()

