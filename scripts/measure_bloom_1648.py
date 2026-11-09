import json
from playwright.sync_api import sync_playwright

def inspect_bloom_positions():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        
        # Test at 1648 x 900
        page = browser.new_page(viewport={"width": 1648, "height": 900})
        page.goto("https://www.bloom3d.studio/", wait_until="load", timeout=30000)
        page.wait_for_timeout(2000)

        data = page.evaluate("""() => {
            // Find navbar elements
            const navbar = document.querySelector('.navbar, header, [class*=\"nav\"]');
            const logo = document.querySelector('a[class*=\"brand\"], a[class*=\"logo\"], .navbar a');
            const burger = document.querySelector('.menu_button, [class*=\"burger\"], [class*=\"menu-button\"]');
            const heading = document.querySelector('h1');
            const heroButtons = document.querySelectorAll('.section_hero a, .section_hero button, .hero_buttons a');
            const heroContainer = heading?.closest('div');

            // Measure containers up the chain for navbar and hero
            function getChain(el) {
                const list = [];
                let curr = el;
                while (curr && curr !== document.body) {
                    const r = curr.getBoundingClientRect();
                    const s = window.getComputedStyle(curr);
                    list.push({
                        tag: curr.tagName,
                        class: curr.className,
                        width: r.width,
                        left: r.left,
                        right: r.right,
                        maxWidth: s.maxWidth,
                        paddingLeft: s.paddingLeft,
                        paddingRight: s.paddingRight,
                        marginLeft: s.marginLeft,
                        marginRight: s.marginRight
                    });
                    curr = curr.parentElement;
                }
                return list;
            }

            return {
                viewport: { width: window.innerWidth, height: window.innerHeight },
                navbar: navbar ? {
                    rect: navbar.getBoundingClientRect(),
                    style: {
                        maxWidth: window.getComputedStyle(navbar).maxWidth,
                        padding: window.getComputedStyle(navbar).padding,
                        left: window.getComputedStyle(navbar).left,
                        right: window.getComputedStyle(navbar).right,
                        width: window.getComputedStyle(navbar).width
                    }
                } : null,
                logo: logo ? {
                    rect: logo.getBoundingClientRect(),
                    text: logo.textContent?.trim(),
                    left: logo.getBoundingClientRect().left
                } : null,
                burger: burger ? {
                    rect: burger.getBoundingClientRect(),
                    rightFromEdge: window.innerWidth - burger.getBoundingClientRect().right,
                    left: burger.getBoundingClientRect().left,
                    width: burger.getBoundingClientRect().width
                } : null,
                heading: heading ? {
                    rect: heading.getBoundingClientRect(),
                    left: heading.getBoundingClientRect().left,
                    bottom: window.innerHeight - heading.getBoundingClientRect().bottom,
                    style: {
                        fontSize: window.getComputedStyle(heading).fontSize,
                        lineHeight: window.getComputedStyle(heading).lineHeight,
                        maxWidth: window.getComputedStyle(heading).maxWidth,
                        width: window.getComputedStyle(heading).width
                    },
                    text: heading.innerText
                } : null,
                buttons: Array.from(heroButtons).map(b => ({
                    text: b.textContent?.trim(),
                    rect: b.getBoundingClientRect(),
                    rightFromEdge: window.innerWidth - b.getBoundingClientRect().right,
                    bottomFromEdge: window.innerHeight - b.getBoundingClientRect().bottom
                })),
                navbarChain: logo ? getChain(logo) : [],
                heroChain: heading ? getChain(heading) : []
            };
        }""")

        with open("audit/bloom_1648_measurements.json", "w") as f:
            json.dump(data, f, indent=2)

        print(json.dumps(data, indent=2))
        browser.close()

if __name__ == "__main__":
    inspect_bloom_positions()

