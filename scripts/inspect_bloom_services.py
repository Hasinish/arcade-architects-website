import json
from playwright.sync_api import sync_playwright

def inspect_services():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        print("Navigating to Bloom3D...")
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        # Locate services section
        data = page.evaluate("""() => {
            // Find section or element with carousel or services
            const carousel = document.querySelector('.carousel_wrapper, [class*=\"carousel\"], [class*=\"services\"]');
            const section = carousel ? carousel.closest('section, div[class*=\"section\"]') : document.querySelector('section[class*=\"service\"]');
            
            // Check all text/headings inside section
            const headings = section ? Array.from(section.querySelectorAll('h1, h2, h3, h4, [class*=\"heading\"], [class*=\"title\"]')).map(h => {
                const s = window.getComputedStyle(h);
                return {
                    tag: h.tagName,
                    class: h.className,
                    text: h.textContent.trim(),
                    fontSize: s.fontSize,
                    fontWeight: s.fontWeight,
                    lineHeight: s.lineHeight,
                    letterSpacing: s.letterSpacing,
                    textAlign: s.textAlign,
                    color: s.color,
                    margin: s.margin,
                    padding: s.padding
                };
            }) : [];

            // Container styles (perspective, overflow, etc.)
            const containerStyles = carousel ? (() => {
                const s = window.getComputedStyle(carousel);
                const parentStyle = window.getComputedStyle(carousel.parentElement);
                return {
                    class: carousel.className,
                    perspective: s.perspective,
                    perspectiveOrigin: s.perspectiveOrigin,
                    transformStyle: s.transformStyle,
                    overflow: s.overflow,
                    display: s.display,
                    parentPerspective: parentStyle.perspective,
                    parentTransformStyle: parentStyle.transformStyle,
                    parentOverflow: parentStyle.overflow
                };
            })() : null;

            // Find all cards inside carousel
            const cards = Array.from(document.querySelectorAll('.carousel_item, [class*=\"carousel\"] [class*=\"item\"], [class*=\"carousel\"] [class*=\"card\"], .service_item')).map((card, idx) => {
                const s = window.getComputedStyle(card);
                const r = card.getBoundingClientRect();
                const img = card.querySelector('img');
                const title = card.querySelector('h2, h3, [class*=\"title\"], [class*=\"name\"]');
                const desc = card.querySelector('p, [class*=\"desc\"], [class*=\"text\"]');
                const btn = card.querySelector('a, button');

                return {
                    index: idx,
                    class: card.className,
                    width: r.width,
                    height: r.height,
                    left: r.left,
                    top: r.top,
                    style: {
                        transform: s.transform,
                        transformOrigin: s.transformOrigin,
                        perspective: s.perspective,
                        borderRadius: s.borderRadius,
                        boxShadow: s.boxShadow,
                        backgroundColor: s.backgroundColor,
                        zIndex: s.zIndex
                    },
                    img: {
                        src: img?.src,
                        objectFit: img ? window.getComputedStyle(img).objectFit : null
                    },
                    title: title ? title.textContent.trim() : null,
                    desc: desc ? desc.textContent.trim() : null,
                    btnText: btn ? btn.textContent.trim() : null
                };
            });

            return {
                section: section ? {
                    class: section.className,
                    bgColor: window.getComputedStyle(section).backgroundColor,
                    padding: window.getComputedStyle(section).padding,
                    height: section.getBoundingClientRect().height
                } : null,
                headings,
                containerStyles,
                cardCount: cards.length,
                cards
            };
        }""")

        with open("audit/bloom_services_data.json", "w") as f:
            json.dump(data, f, indent=2)

        # Now let's scroll through the services section to see how the cards move
        # Let's find the carousel offset
        section_top = page.evaluate("() => document.querySelector('.carousel_wrapper, [class*=\"carousel\"]').getBoundingClientRect().top + window.scrollY")
        print(f"Carousel offset top: {section_top}")

        scroll_steps = []
        for offset in [-400, -200, 0, 200, 400, 600, 800]:
            target_y = section_top + offset
            page.evaluate(f"window.scrollTo(0, {target_y})")
            page.wait_for_timeout(300)
            step_info = page.evaluate("""() => {
                const cards = Array.from(document.querySelectorAll('.carousel_item, [class*=\"carousel\"] [class*=\"item\"], [class*=\"carousel\"] [class*=\"card\"]')).map(c => {
                    const r = c.getBoundingClientRect();
                    const s = window.getComputedStyle(c);
                    return {
                        left: r.left,
                        top: r.top,
                        width: r.width,
                        transform: s.transform,
                        zIndex: s.zIndex,
                        opacity: s.opacity
                    };
                });
                return {
                    scrollY: window.scrollY,
                    cards
                };
            }""")
            scroll_steps.append(step_info)
            page.screenshot(path=f"audit/frames/bloom_services_scroll_{offset}.png")

        with open("audit/bloom_services_scroll.json", "w") as f:
            json.dump(scroll_steps, f, indent=2)

        print("Saved audit/bloom_services_data.json and audit/bloom_services_scroll.json")
        browser.close()

if __name__ == "__main__":
    inspect_services()

