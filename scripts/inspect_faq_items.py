from playwright.sync_api import sync_playwright
import json

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)
        
        faq_items = page.evaluate("""() => {
            const items = Array.from(document.querySelectorAll('.faq_item'));
            return items.map((item, i) => {
                const header = item.querySelector('.faq_item_header');
                const title = item.querySelector('.faq_item_title');
                const icon = item.querySelector('.faq_item_icon, [class*="icon"], svg');
                const panel = item.querySelector('.faq_item_panel, [id*="panel"], [class*="content"], [class*="body"], [class*="text"]');
                const underline = item.querySelector('.underline_faq_item');
                
                return {
                    index: i,
                    titleText: title ? title.innerText.trim() : '',
                    panelText: panel ? panel.innerText.trim() : '',
                    headerStyle: header ? {
                        padding: window.getComputedStyle(header).padding,
                        display: window.getComputedStyle(header).display,
                        justifyContent: window.getComputedStyle(header).justifyContent,
                        alignItems: window.getComputedStyle(header).alignItems
                    } : null,
                    itemStyle: {
                        borderTop: window.getComputedStyle(item).borderTop,
                        borderBottom: window.getComputedStyle(item).borderBottom,
                        padding: window.getComputedStyle(item).padding
                    },
                    iconHtml: icon ? icon.outerHTML : null,
                    headerHtml: header ? header.innerHTML : null,
                    panelHtml: panel ? panel.outerHTML : null
                };
            });
        }""")
        
        print(json.dumps(faq_items, indent=2))
        
        # Test clicking the first item to see what happens
        page.evaluate("document.querySelector('.faq_item_header')?.click()")
        page.wait_for_timeout(500)
        
        opened_state = page.evaluate("""() => {
            const first = document.querySelector('.faq_item');
            const panel = first.querySelector('.faq_item_panel, [id*="panel"]');
            const icon = first.querySelector('svg, [class*="icon"]');
            return {
                panelHeight: panel ? window.getComputedStyle(panel).height : null,
                panelOpacity: panel ? window.getComputedStyle(panel).opacity : null,
                iconTransform: icon ? window.getComputedStyle(icon).transform : null
            };
        }""")
        print("OPENED STATE:", json.dumps(opened_state, indent=2))
        
        browser.close()

if __name__ == "__main__":
    main()

