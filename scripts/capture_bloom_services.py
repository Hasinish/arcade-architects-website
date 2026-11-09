from playwright.sync_api import sync_playwright

def capture_bloom_services():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        # Scroll to services
        c_top = page.evaluate("() => document.querySelector('.section_services').getBoundingClientRect().top + window.scrollY")
        page.evaluate(f"window.scrollTo(0, {c_top + 100})")
        page.wait_for_timeout(500)
        page.screenshot(path="audit/frames/bloom_services_live.png")
        print(f"Captured audit/frames/bloom_services_live.png at y={c_top + 100}")
        browser.close()

if __name__ == "__main__":
    capture_bloom_services()

