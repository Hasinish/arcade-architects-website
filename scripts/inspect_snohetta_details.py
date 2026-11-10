from playwright.sync_api import sync_playwright
import json

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto("https://www.snohetta.com/", wait_until="networkidle", timeout=45000)
        page.wait_for_timeout(2000)

        # Inspect the container of these images
        info = page.evaluate("""() => {
            const firstImg = document.querySelector('img');
            // find container with role or specific class
            let container = firstImg;
            while (container && container.parentElement && !container.className.includes('carousel') && !container.className.includes('slider') && !container.className.includes('swiper') && container.tagName !== 'BODY') {
                container = container.parentElement;
                if (container.querySelectorAll('img').length >= 5) break;
            }

            const activeItem = document.querySelector('[class*="active"], [data-active="true"]') || firstImg.parentElement;

            // Let's find the text below the active image
            const textNodes = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, span, div')).filter(el => {
                const r = el.getBoundingClientRect();
                return r.top >= 650 && r.top <= 750 && el.innerText.trim().length > 0 && el.children.length <= 2;
            }).map(el => ({
                tag: el.tagName,
                class: el.className,
                text: el.innerText.trim(),
                rect: el.getBoundingClientRect(),
                style: {
                    color: window.getComputedStyle(el).color,
                    fontSize: window.getComputedStyle(el).fontSize,
                    fontWeight: window.getComputedStyle(el).fontWeight,
                    lineHeight: window.getComputedStyle(el).lineHeight,
                    letterSpacing: window.getComputedStyle(el).letterSpacing
                }
            }));

            // Check event listeners and classes on the container
            const gallerySection = container ? {
                tag: container.tagName,
                class: container.className,
                style: {
                    display: window.getComputedStyle(container).display,
                    position: window.getComputedStyle(container).position,
                    overflow: window.getComputedStyle(container).overflow,
                    touchAction: window.getComputedStyle(container).touchAction,
                    cursor: window.getComputedStyle(container).cursor,
                    backgroundColor: window.getComputedStyle(container).backgroundColor
                },
                rect: container.getBoundingClientRect()
            } : null;

            // Inspect the items / children inside the gallery track
            const items = container ? Array.from(container.children).map((child, idx) => ({
                index: idx,
                tag: child.tagName,
                class: child.className,
                rect: child.getBoundingClientRect(),
                style: {
                    display: window.getComputedStyle(child).display,
                    position: window.getComputedStyle(child).position,
                    transform: window.getComputedStyle(child).transform,
                    width: window.getComputedStyle(child).width,
                    height: window.getComputedStyle(child).height
                },
                imgSrc: child.querySelector('img')?.src || null
            })) : [];

            return {
                gallerySection,
                itemsCount: items.length,
                items: items.slice(0, 8),
                textNodes: textNodes.slice(0, 8)
            };
        }""")

        with open("audit/snohetta_gallery_details.json", "w", encoding="utf-8") as f:
            json.dump(info, f, indent=2)

        print("Gallery Section:", json.dumps(info.get("gallerySection"), indent=2))
        print("Items count:", info.get("itemsCount"))
        print("Text nodes below active:", json.dumps(info.get("textNodes"), indent=2))

        browser.close()

if __name__ == "__main__":
    main()

