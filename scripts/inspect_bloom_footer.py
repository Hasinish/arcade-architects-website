from playwright.sync_api import sync_playwright
import json

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)
        
        footer_info = page.evaluate("""() => {
            const footer = document.querySelector('.section_footer');
            if (!footer) return null;
            
            const s = window.getComputedStyle(footer);
            const container = footer.querySelector('.u-container, [class*="container"]');
            
            return {
                style: {
                    background: s.backgroundColor,
                    padding: s.padding,
                    height: s.height
                },
                containerStyle: container ? {
                    padding: window.getComputedStyle(container).padding,
                    maxWidth: window.getComputedStyle(container).maxWidth
                } : null,
                html: footer.innerHTML
            };
        }""")
        
        with open("audit/bloom_footer_raw.json", "w", encoding="utf-8") as f:
            json.dump(footer_info, f, indent=2)
            
        print("Footer container padding:", footer_info.get("containerStyle"))
        print("Footer style:", footer_info.get("style"))
        print("HTML length:", len(footer_info.get("html", "")))

        # Also scroll to footer and take a live screenshot!
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(500)
        page.screenshot(path="audit/frames/bloom_footer_live.png")
        print("Captured audit/frames/bloom_footer_live.png")

        browser.close()

if __name__ == "__main__":
    main()

